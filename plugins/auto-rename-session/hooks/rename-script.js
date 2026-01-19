const SessionManager = require('./session-manager');

class RenameScript {
  constructor() {
    this.manager = new SessionManager();
    this.lastRename = null;
    this.renameCount = 0;
    this.maxRenamesPerSession = 10;
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
      const buffer = [];
      const chunk = Buffer.from(process.env.INPUT_DATA || '', 'utf-8');

      if (chunk.length > 0) {
        return JSON.parse(chunk.toString());
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async handleSessionStart(input) {
    const sessionPath = this.manager.findCurrentSession();

    if (!sessionPath) {
      return;
    }

    await this.delay(2000);

    const entries = this.manager.readSession(sessionPath);

    if (entries.length < 2) {
      setTimeout(() => this.attemptRename(sessionPath, entries, 'session-start'), 3000);
      return;
    }

    await this.attemptRename(sessionPath, entries, 'session-start');
  }

  async handlePostToolUse(input) {
    if (!this.shouldTriggerRename(input)) {
      return;
    }

    const sessionPath = this.manager.findCurrentSession();
    if (!sessionPath) {
      return;
    }

    const entries = this.manager.getSessionHistory(sessionPath);

    if (entries.length % 10 !== 0) {
      return;
    }

    await this.attemptRename(sessionPath, entries, 'post-tool');
  }

  async handleUserPromptSubmit(input) {
    const sessionPath = this.manager.findCurrentSession();
    if (!sessionPath) {
      return;
    }

    const entries = this.manager.getSessionHistory(sessionPath);

    if (entries.length < 5) {
      return;
    }

    if (entries.length % 8 !== 0) {
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
    if (!input || !input.tool_name) {
      return false;
    }

    const significantTools = [
      'Write', 'Edit', 'MultiEdit',
      'Bash(npm)', 'Bash(git)', 'Bash(yarn)', 'Bash(pnpm)',
      'Skill'
    ];

    if (significantTools.includes(input.tool_name)) {
      return true;
    }

    if (input.tool_name === 'Bash' && input.tool_input) {
      const command = input.tool_input.command || '';
      const significantCommands = ['git commit', 'npm ', 'yarn ', 'pnpm ', 'bun '];
      return significantCommands.some(cmd => command.includes(cmd));
    }

    return false;
  }

  async attemptRename(sessionPath, entries, trigger) {
    if (this.renameCount >= this.maxRenamesPerSession) {
      return;
    }

    const context = this.manager.extractContext(entries);

    if (!context.firstUserMessage && entries.length < 5) {
      return;
    }

    const prompt = this.manager.generateSessionNamePrompt(context);
    const newName = await this.generateNameWithLLM(prompt);

    if (!newName) {
      return;
    }

    if (this.lastRename === newName) {
      return;
    }

    const success = this.manager.writeSessionRename(sessionPath, newName);

    if (success) {
      this.lastRename = newName;
      this.renameCount++;
      console.error(`[AutoRename] Session renamed to: "${newName}" (trigger: ${trigger})`);
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
