const SessionManager = require('./session-manager');

class RenameScript {
  constructor() {
    this.manager = new SessionManager();
    this.lastRename = null;
    this.lastRenameTime = 0;
    this.renameCount = 0;
    this.maxRenamesPerSession = 15; // Increased for more dynamic updates
    this.minRenameInterval = 15000; // Reduced to 15 seconds for more frequent updates
  }

  async run() {
    const args = process.argv.slice(2);
    const hookType = args[0] || 'session-start';

    try {
      const input = this.readStdin();

      if (hookType === 'session-start') {
        await this.handleSessionStart(input);
      } else if (hookType === 'post-tool') {
        await this.handlePostToolUse(input);
      } else if (hookType === 'user-prompt') {
        await this.handleUserPromptSubmit(input);
      } else if (hookType === 'manual') {
        await this.handleManualRename(args[1]);
      }

    } catch (error) {
      console.error(`[AutoRename] Error: ${error.message}`);
      process.exit(0);
    }
  }

  readStdin() {
    try {
      // Check if stdin is available (file descriptor 0)
      const fs = require('fs');
      const stdinFd = 0;

      // Try to read with a small timeout
      // Use synchronous read but handle the case where no data is available
      try {
        const inputData = fs.readFileSync(stdinFd, 'utf-8');

        if (inputData && inputData.trim()) {
          const parsed = JSON.parse(inputData);

          // Log successful input for debugging
          if (parsed && (parsed.tool_name || parsed.content)) {
            console.error('[AutoRename] Input received:', JSON.stringify(parsed).substring(0, 100));
          }

          return parsed;
        }

        console.error('[AutoRename] No stdin data available');
        return null;
      } catch (readError) {
        // EAGAIN or EWOULDBLOCK means no data available on non-blocking stdin
        // Other errors might be actual problems
        if (readError.code !== 'EAGAIN' && readError.code !== 'EWOULDBLOCK') {
          console.error('[AutoRename] stdin read error:', readError.message);
        }
        return null;
      }
    } catch (error) {
      // No stdin data or invalid JSON - return null for hooks that don't require input
      console.error('[AutoRename] stdin parse error:', error.message);
      return null;
    }
  }

  async handleSessionStart(input) {
    const sessionPath = this.manager.findCurrentSession();

    if (!sessionPath) {
      return;
    }

    // Wait to gather initial context
    await this.delay(5000);

    const entries = this.manager.readSession(sessionPath);

    // If we still don't have much context, wait a bit more and retry
    if (entries.length < 3) {
      await this.delay(7000);
      const updatedEntries = this.manager.readSession(sessionPath);
      await this.attemptRename(sessionPath, updatedEntries, 'session-start');
      return;
    }

    await this.attemptRename(sessionPath, entries, 'session-start');
  }

  async handlePostToolUse(input) {
    console.error('[AutoRename] PostToolUse triggered');

    if (!this.shouldTriggerRename(input)) {
      console.error('[AutoRename] PostToolUse: not a significant tool');
      return;
    }

    const sessionPath = this.manager.findCurrentSession();
    if (!sessionPath) {
      console.error('[AutoRename] PostToolUse: no session found');
      return;
    }

    const entries = this.manager.getSessionHistory(sessionPath);
    console.error(`[AutoRename] PostToolUse: session has ${entries.length} entries`);

    // Rename periodically - every 3-5 significant tool uses
    if (entries.length < 3) {
      console.error('[AutoRename] PostToolUse: not enough entries yet');
      return;
    }

    await this.attemptRename(sessionPath, entries, 'post-tool');
  }

  async handleUserPromptSubmit(input) {
    console.error('[AutoRename] UserPromptSubmit triggered');

    const sessionPath = this.manager.findCurrentSession();
    if (!sessionPath) {
      console.error('[AutoRename] UserPromptSubmit: no session found');
      return;
    }

    const entries = this.manager.getSessionHistory(sessionPath);
    console.error(`[AutoRename] UserPromptSubmit: session has ${entries.length} entries`);

    // Rename after every few user prompts to capture conversation evolution
    if (entries.length < 3) {
      console.error('[AutoRename] UserPromptSubmit: not enough entries yet');
      return;
    }

    await this.attemptRename(sessionPath, entries, 'user-prompt');
  }

  async handleManualRename(customName) {
    const sessionPath = this.manager.findCurrentSession();

    if (!sessionPath) {
      console.error('[AutoRename] No session found');
      process.exit(1);
      return;
    }

    if (customName) {
      this.manager.writeSessionRename(sessionPath, customName);
      console.log(`[AutoRename] Session renamed to: "${customName}"`);
    } else {
      const entries = this.manager.getSessionHistory(sessionPath);
      await this.attemptRename(sessionPath, entries, 'manual');
    }
  }

  shouldTriggerRename(input) {
    // PostToolUse hook provides: tool_name, tool_input, tool_response
    // See: https://code.claude.com/docs/en/hooks#PostToolUse Input
    if (!input || !input.tool_name) {
      console.error('[AutoRename] shouldTriggerRename: no tool_name in input');
      return false;
    }

    const significantTools = [
      'Write', 'Edit', 'MultiEdit',
      'Bash', 'Skill'
    ];

    console.error(`[AutoRename] Checking tool: ${input.tool_name}`);

    if (significantTools.includes(input.tool_name)) {
      // For Bash, check if it's a significant command
      if (input.tool_name === 'Bash' && input.tool_input) {
        const command = input.tool_input.command || '';
        const significantCommands = ['git commit', 'npm ', 'yarn ', 'pnpm ', 'bun ', 'git add', 'git push'];
        const isSignificant = significantCommands.some(cmd => command.includes(cmd));

        console.error(`[AutoRename] Bash command: "${command}", significant: ${isSignificant}`);
        return isSignificant;
      }

      console.error(`[AutoRename] Tool ${input.tool_name} is significant`);
      return true;
    }

    console.error(`[AutoRename] Tool ${input.tool_name} is not significant`);
    return false;
  }

  async attemptRename(sessionPath, entries, trigger) {
    console.error(`[AutoRename] attemptRename called (trigger: ${trigger})`);

    if (this.renameCount >= this.maxRenamesPerSession) {
      console.error(`[AutoRename] Max renames reached (${this.renameCount}/${this.maxRenamesPerSession})`);
      return;
    }

    // Debounce: Don't rename if we've renamed recently (within minRenameInterval)
    const now = Date.now();
    const timeSinceLastRename = now - this.lastRenameTime;

    if (timeSinceLastRename < this.minRenameInterval) {
      console.error(`[AutoRename] Too soon since last rename (${timeSinceLastRename}ms < ${this.minRenameInterval}ms)`);
      return;
    }

    const context = this.manager.extractContext(entries);
    console.error(`[AutoRename] Context extracted: firstUserMessage="${context.firstUserMessage?.substring(0, 50)}..."`);

    if (!context.firstUserMessage && entries.length < 5) {
      console.error('[AutoRename] Not enough context to rename');
      return;
    }

    const prompt = this.manager.generateSessionNamePrompt(context);
    console.error('[AutoRename] Generating name with LLM...');

    const newName = await this.generateNameWithLLM(prompt);

    if (!newName) {
      console.error('[AutoRename] Failed to generate name');
      return;
    }

    if (this.lastRename === newName) {
      console.error(`[AutoRename] Name unchanged: "${newName}"`);
      return;
    }

    console.error(`[AutoRename] Writing rename: "${newName}"`);
    const success = this.manager.writeSessionRename(sessionPath, newName);

    if (success) {
      this.lastRename = newName;
      this.lastRenameTime = now;
      this.renameCount++;
      console.error(`[AutoRename] ✅ Session renamed to: "${newName}" (trigger: ${trigger}, count: ${this.renameCount})`);
    } else {
      console.error('[AutoRename] ❌ Failed to write rename');
    }
  }

  async generateNameWithLLM(prompt) {
    try {
      const { spawn } = require('child_process');

      return new Promise((resolve) => {
        const claude = spawn('claude', ['--non-interactive'], {
          env: {
            ...process.env,
            INPUT_DATA: JSON.stringify({ content: prompt })
          }
        });

        let output = '';
        let errorOutput = '';

        claude.stdout.on('data', (data) => {
          output += data.toString();
        });

        claude.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        claude.on('close', (code) => {
          if (output.trim()) {
            const name = output.trim()
              .split('\n')[0]
              .replace(/["']/g, '')
              .substring(0, 50);

            if (name.length > 5) {
              resolve(name);
              return;
            }
          }

          const fallback = this.generateFallbackName();
          resolve(fallback);
        });

        setTimeout(() => {
          claude.kill();
          resolve(this.generateFallbackName());
        }, 10000);
      });
    } catch (error) {
      return this.generateFallbackName();
    }
  }

  generateFallbackName() {
    const hour = new Date().getHours();
    const actions = ['Working on', 'Fixing', 'Building', 'Debugging'];
    const action = actions[hour % actions.length];

    return `${action} code`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

if (require.main === module) {
  const script = new RenameScript();
  script.run().catch(error => {
    console.error('[AutoRename] Fatal error:', error);
    process.exit(0);
  });
}

module.exports = RenameScript;
