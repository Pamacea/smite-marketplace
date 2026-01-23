const fs = require('fs');
const path = require('path');
const os = require('os');

class SessionManager {
  constructor() {
    this.claudeDir = path.join(os.homedir(), '.claude');
    this.projectsDir = path.join(this.claudeDir, 'projects');
    this.sessionsCache = new Map();
  }

  findCurrentSession() {
    try {
      const envVars = process.env;

      if (envVars.TRANSCRIPT_PATH) {
        return envVars.TRANSCRIPT_PATH;
      }

      const projectDir = envVars.CLAUDE_PROJECT_DIR || process.cwd();
      const projectHash = this.hashPath(projectDir);
      const projectSessionDir = path.join(this.projectsDir, projectHash);

      if (!fs.existsSync(projectSessionDir)) {
        return null;
      }

      const files = fs.readdirSync(projectSessionDir)
        .filter(f => f.endsWith('.jsonl') && !f.startsWith('agent-'))
        .sort((a, b) => {
          const statA = fs.statSync(path.join(projectSessionDir, a));
          const statB = fs.statSync(path.join(projectSessionDir, b));
          return statB.mtimeMs - statA.mtimeMs;
        });

      return files.length > 0
        ? path.join(projectSessionDir, files[0])
        : null;
    } catch (error) {
      console.error('[SessionManager] Error finding session:', error.message);
      return null;
    }
  }

  hashPath(filePath) {
    return filePath
      .replace(/\\/g, '/')
      .replace(/:/g, '-')
      .replace(/[\/\\]/g, '--');
  }

  readSession(sessionPath) {
    try {
      if (!fs.existsSync(sessionPath)) {
        return [];
      }

      const content = fs.readFileSync(sessionPath, 'utf-8');
      const lines = content.trim().split('\n').filter(line => line.trim());

      return lines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(entry => entry !== null);
    } catch (error) {
      console.error('[SessionManager] Error reading session:', error.message);
      return [];
    }
  }

  extractContext(entries, maxEntries = 50) {
    const context = {
      firstUserMessage: null,
      lastUserMessages: [],
      recentTools: [],
      projectPath: process.cwd(),
      timestamp: new Date().toISOString()
    };

    const recentEntries = entries.slice(-maxEntries);

    for (const entry of recentEntries) {
      if (entry.type === 'user' && entry.message && entry.message.content) {
        // Skip command/skill invocations - they're not real user messages
        if (this.isCommandInvocation(entry.message.content)) {
          continue;
        }

        const content = this.extractContent(entry.message.content);

        // Only capture meaningful content (not empty or just whitespace)
        if (!content || content.trim().length < 3) {
          continue;
        }

        if (!context.firstUserMessage) {
          context.firstUserMessage = content.substring(0, 200);
        }

        context.lastUserMessages.unshift(content.substring(0, 100));
        if (context.lastUserMessages.length > 3) {
          context.lastUserMessages.pop();
        }
      }
    }

    for (let i = recentEntries.length - 1; i >= Math.max(0, recentEntries.length - 10); i--) {
      const entry = recentEntries[i];
      if (entry.toolUse && entry.toolUse.name) {
        const toolName = entry.toolUse.name;
        if (!context.recentTools.includes(toolName)) {
          context.recentTools.push(toolName);
        }
      }
    }

    return context;
  }

  isCommandInvocation(message) {
    // Detect if this is a system command/skill invocation rather than a real user message
    if (typeof message === 'string') {
      // Skip messages containing command tags (from CLI command invocations)
      // Skip messages containing skill expansion tags (<objective>, <process>, etc.)
      return message.includes('<command-') ||
             message.includes('<local-command-') ||
             message.includes('<objective>') ||
             message.includes('<process>') ||
             message.includes('<verification>');
    }

    if (Array.isArray(message)) {
      // Check if any element contains command tags or system artifacts
      for (const m of message) {
        if (typeof m === 'string') {
          if (m.includes('<command-') ||
              m.includes('<local-command-') ||
              m.includes('<objective>') ||
              m.includes('<process>') ||
              m.includes('<verification>')) {
            return true;
          }
        }
        const text = m?.text || '';
        if (text.includes('<command-') ||
            text.includes('<local-command-') ||
            text.includes('<objective>') ||
            text.includes('<process>') ||
            text.includes('<verification>')) {
          return true;
        }
      }
      return false;
    }

    const text = message?.text || '';
    return text.includes('<command-') ||
           text.includes('<local-command-') ||
           text.includes('<objective>') ||
           text.includes('<process>') ||
           text.includes('<verification>');
  }

  extractContent(message) {
    if (typeof message === 'string') {
      return this.cleanSlashCommands(message);
    }

    if (Array.isArray(message)) {
      return message
        .map(m => typeof m === 'string' ? this.cleanSlashCommands(m) : (m.text || ''))
        .join(' ');
    }

    if (message.text) {
      return this.cleanSlashCommands(message.text);
    }

    return '';
  }

  cleanSlashCommands(text) {
    // Remove slash commands from the beginning of messages
    // Examples: "/debug fix this", "/commit message", "/clear description"
    // Improved: Handles commands anywhere in the text, not just at start

    // Pattern matches: /command, /smite:debug, /tool:subcommand, etc.
    // Followed by space and any content
    const slashCommandPattern = /^\/[a-zA-Z0-9_\-:]+(\s|$)/;

    // Remove the command if it's at the start
    const cleaned = text.replace(slashCommandPattern, '').trim();

    // Return cleaned text if not empty, otherwise return original
    // This prevents returning empty strings for command-only inputs
    return cleaned || text;
  }

  generateSessionNamePrompt(context) {
    const { firstUserMessage, lastUserMessages, recentTools, projectPath } = context;

    return `You are a session naming expert. Generate a short, descriptive name for this Claude Code session.

Context:
- First request: ${firstUserMessage || 'N/A'}
- Recent requests: ${lastUserMessages.join('; ')}
- Tools used: ${recentTools.join(', ') || 'None'}
- Project: ${path.basename(projectPath)}

Generate a name following these rules:
1. Maximum 50 characters
2. Format: "Action: Context" (e.g., "Fix: bug login", "Add: API endpoint", "Refactor: database")
3. Use these action prefixes: Fix, Add, Update, Delete, Refactor, Debug, Test, Docs, Config
4. Focus on WHAT is being done, not the command used
5. Summarize the core task/problem, not the exact wording
6. Return ONLY the name, no explanation

Examples:
- "Fix: authentication bug" (not "Debug: fix authentication")
- "Add: user CRUD API" (not "Feat: add user CRUD")
- "Refactor: database schema" (not "Update: refactor database")
- "Debug: memory leak" (not "Debug: debug memory issue")
- "Docs: API README" (not "Add: documentation")

Generate the name now:`;
  }

  writeSessionRename(sessionPath, newName) {
    try {
      const renameEntry = {
        type: 'system',
        message: {
          role: 'system',
          content: `Session renamed to: "${newName}"`
        },
        timestamp: new Date().toISOString(),
        sessionId: path.basename(sessionPath, '.jsonl')
      };

      const line = JSON.stringify(renameEntry) + '\n';
      fs.appendFileSync(sessionPath, line);

      return true;
    } catch (error) {
      console.error('[SessionManager] Error writing rename:', error.message);
      return false;
    }
  }

  getSessionHistory(sessionPath) {
    const cacheKey = sessionPath;

    if (this.sessionsCache.has(cacheKey)) {
      return this.sessionsCache.get(cacheKey);
    }

    const entries = this.readSession(sessionPath);
    this.sessionsCache.set(cacheKey, entries);

    return entries;
  }

  clearCache() {
    this.sessionsCache.clear();
  }
}

module.exports = SessionManager;
