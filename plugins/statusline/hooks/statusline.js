#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class StatusLine {
  constructor() {
    this.homeDir = os.homedir();
    this.claudeDir = path.join(this.homeDir, '.claude');
    this.sessionsDir = path.join(this.claudeDir, 'sessions');
  }

  run() {
    const args = process.argv.slice(2);
    const mode = args[0] || 'display';

    try {
      const status = this.buildStatus();
      console.log(status);
    } catch (error) {
      console.error('Statusline Error:', error.message);
    }
  }

  buildStatus() {
    const gitInfo = this.getGitInfo();
    const sessionInfo = this.getSessionInfo();
    const pathInfo = this.getPathInfo();

    const parts = [
      gitInfo.branch,
      gitInfo.insertions,
      pathInfo.abbrevPath,
      sessionInfo.model,
      sessionInfo.cost,
      sessionInfo.tokens,
      sessionInfo.progress,
      sessionInfo.percentage,
      sessionInfo.duration
    ];

    return parts.filter(Boolean).join(' • ');
  }

  getGitInfo() {
    const info = {
      branch: 'N/A',
      insertions: ''
    };

    try {
      // Check if we're in a git repo
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });

      // Get branch name
      try {
        info.branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
      } catch {
        info.branch = 'HEAD';
      }

      // Get insertions/deletions
      try {
        const diffStat = execSync('git diff --shortstat', { encoding: 'utf-8' }).trim();
        const match = diffStat.match(/(\d+) insertion[^,]*(?:, (\d+) deletion)?/);
        if (match) {
          const insertions = parseInt(match[1]);
          const deletions = match[2] ? parseInt(match[2]) : 0;
          if (insertions > 0 || deletions > 0) {
            info.insertions = deletions > 0 ? `+${insertions}/-${deletions}` : `+${insertions}`;
          }
        }
      } catch {
        // No changes or command failed
      }
    } catch {
      // Not a git repo
    }

    return info;
  }

  getSessionInfo() {
    const info = {
      model: 'N/A',
      cost: '',
      tokens: '',
      progress: '',
      percentage: '',
      duration: ''
    };

    try {
      const sessionPath = this.findCurrentSession();
      if (!sessionPath) return info;

      const sessionData = this.readSession(sessionPath);
      if (!sessionData || sessionData.length === 0) return info;

      // Get latest entry with API data
      const apiEntry = sessionData.slice().reverse().find(e =>
        e.type === 'api_call_start' || e.type === 'completion_params'
      );

      if (apiEntry) {
        // Model name
        info.model = this.extractModelName(apiEntry);

        // Tokens and cost
        const tokens = this.extractTokens(sessionData);
        info.tokens = this.formatTokens(tokens);

        const cost = this.calculateCost(tokens, apiEntry);
        info.cost = cost ? `$${cost.toFixed(2)}` : '';

        // Context percentage
        info.percentage = this.extractPercentage(apiEntry);
        info.progress = this.renderProgress(info.percentage);
      }

      // Duration
      info.duration = this.calculateDuration(sessionData);
    } catch (error) {
      // Session read failed, use defaults
    }

    return info;
  }

  findCurrentSession() {
    try {
      const sessions = fs.readdirSync(this.sessionsDir);
      // Sort by modified time, get most recent
      const sessionPaths = sessions
        .map(s => path.join(this.sessionsDir, s))
        .filter(p => {
          try {
            return fs.statSync(p).isFile();
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          const statA = fs.statSync(a);
          const statB = fs.statSync(b);
          return statB.mtimeMs - statA.mtimeMs;
        });

      return sessionPaths[0] || null;
    } catch {
      return null;
    }
  }

  readSession(sessionPath) {
    try {
      const content = fs.readFileSync(sessionPath, 'utf-8');
      const lines = content.trim().split('\n');
      return lines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  extractModelName(entry) {
    // Try various fields for model name
    const model = entry.model || entry.model_name || entry.slate?.model;
    if (model) {
      // Format: "claude-opus-4-5-20251101" -> "Opus 4.5"
      if (model.includes('opus')) return 'Opus 4.5';
      if (model.includes('sonnet')) return 'Sonnet 4.5';
      if (model.includes('haiku')) return 'Haiku 4.5';
      return model.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return 'N/A';
  }

  extractTokens(sessionData) {
    let inputTokens = 0;
    let outputTokens = 0;

    for (const entry of sessionData) {
      if (entry.type === 'api_call_start') {
        inputTokens += entry.input_tokens || 0;
        outputTokens += entry.output_tokens || 0;
      } else if (entry.type === 'completion_params') {
        inputTokens += entry.prompt_tokens || 0;
        outputTokens += entry.completion_tokens || 0;
      }
    }

    return { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens };
  }

  formatTokens(tokens) {
    if (!tokens || tokens.total === 0) return '';
    const t = tokens.total;
    return t >= 1000 ? `${(t / 1000).toFixed(0)}K` : `${t}`;
  }

  calculateCost(tokens, entry) {
    // Pricing per million tokens (approximate)
    const pricing = {
      opus: { input: 15, output: 75 },
      sonnet: { input: 3, output: 15 },
      haiku: { input: 1, output: 5 }
    };

    let model = 'opus';
    const modelStr = (entry.model || entry.model_name || '').toLowerCase();
    if (modelStr.includes('sonnet')) model = 'sonnet';
    else if (modelStr.includes('haiku')) model = 'haiku';

    const rates = pricing[model];
    const inputCost = (tokens.input / 1_000_000) * rates.input;
    const outputCost = (tokens.output / 1_000_000) * rates.output;

    return inputCost + outputCost;
  }

  extractPercentage(entry) {
    // Try to get context window percentage
    const pct = entry.context_percentage || entry.percent || entry.usage?.percent;
    return pct ? `${pct}%` : '';
  }

  renderProgress(percentage) {
    if (!percentage) return '';
    const pct = parseInt(percentage);
    if (isNaN(pct)) return '';

    const width = 10;
    const filled = Math.round((pct / 100) * width);
    const empty = width - filled;

    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  calculateDuration(sessionData) {
    if (sessionData.length === 0) return '';

    const start = sessionData[0].timestamp || sessionData[0].time;
    const end = sessionData[sessionData.length - 1].timestamp || sessionData[sessionData.length - 1].time;

    if (!start || !end) return '';

    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffMs = endTime - startTime;

    if (diffMs < 0) return '';

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getPathInfo() {
    const cwd = process.cwd();
    let abbrevPath = cwd;

    // Replace home directory with ~
    if (cwd.startsWith(this.homeDir)) {
      abbrevPath = '~' + cwd.slice(this.homeDir.length);
    }

    // Further abbreviate path components
    const parts = abbrevPath.split(path.sep);
    if (parts.length > 3) {
      const last = parts[parts.length - 1];
      const secondLast = parts[parts.length - 2];
      abbrevPath = ['~', '...', secondLast, last].join(path.sep);
    }

    return { abbrevPath };
  }
}

// Run if executed directly
if (require.main === module) {
  const statusline = new StatusLine();
  statusline.run();
}

module.exports = StatusLine;
