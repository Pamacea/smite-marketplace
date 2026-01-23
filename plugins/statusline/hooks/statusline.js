#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes
const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  white: '\x1b[37m'
};

const TOKENS_PER_CHAR = 0.15;
const JSON_OVERHEAD = 4.0;

class StatusLine {
  constructor() {
    this.homeDir = os.homedir();
    this.claudeDir = path.join(this.homeDir, '.claude');
    this.projectsDir = path.join(this.claudeDir, 'projects');
    this.contextLimits = {
      'opus': 200000,
      'sonnet': 200000,
      'haiku': 200000,
      'glm': 200000,
      'default': 200000
    };
  }

  run() {
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
      this.colorize(gitInfo.branch, 'cyan'),
      gitInfo.insertions, // Already colored
      this.colorize(pathInfo.abbrevPath, 'dim'),
      this.colorize(sessionInfo.model, 'blue'),
      this.colorize(sessionInfo.cost, 'yellow'),
      this.colorize(sessionInfo.tokens, 'magenta'),
      sessionInfo.progress,
      this.colorize(sessionInfo.percentage, 'cyan'),
      this.colorize(sessionInfo.duration, 'dim')
    ];

    return parts.filter(Boolean).join(` ${COLORS.dim}•${COLORS.reset} `);
  }

  colorize(text, color) {
    if (!text) return '';
    return `${COLORS[color]}${text}${COLORS.reset}`;
  }

  getGitInfo() {
    const info = {
      branch: 'N/A',
      insertions: ''
    };

    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      try {
        info.branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
      } catch {
        info.branch = 'HEAD';
      }

      try {
        const diffStat = execSync('git diff --shortstat', { encoding: 'utf-8' }).trim();
        const match = diffStat.match(/(\d+) insertion[^,]*(?:, (\d+) deletion)?/);
        if (match) {
          const insertions = parseInt(match[1]);
          const deletions = match[2] ? parseInt(match[2]) : 0;
          if (insertions > 0 || deletions > 0) {
            // Green for additions, red for deletions
            const plus = insertions > 0 ? `${COLORS.green}+${insertions}${COLORS.reset}` : '';
            const minus = deletions > 0 ? `${COLORS.red}/-${deletions}${COLORS.reset}` : '';
            info.insertions = plus + minus;
          }
        }
      } catch {
        // No changes
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

      // Get latest entry with model data
      const apiEntry = sessionData.slice().reverse().find(e =>
        (e.type === 'assistant' || e.type === 'api_call_start' || e.type === 'completion_params') &&
        (e.message?.model || e.model)
      );

      if (apiEntry) {
        info.model = this.extractModelName(apiEntry);

        // Try actual tokens first, then estimate from file size
        const tokens = this.extractTokens(sessionData, sessionPath);
        info.tokens = this.formatTokens(tokens);

        const cost = this.calculateCost(tokens, apiEntry);
        info.cost = cost ? `$${cost.toFixed(2)}` : '';

        // Context percentage
        const contextLimit = this.getContextLimit(info.model);
        const pct = Math.min(100, Math.round((tokens.total / contextLimit) * 100));
        info.percentage = `${pct}%`;
        info.progress = this.renderProgress(info.percentage);
      }

      // Duration
      info.duration = this.calculateDuration(sessionData);
    } catch (error) {
      // Session read failed
    }

    return info;
  }

  findCurrentSession() {
    try {
      const cwd = process.cwd();
      const projects = fs.readdirSync(this.projectsDir);

      // Find matching project directory
      let matchingProject = null;
      for (const project of projects) {
        const projectDir = path.join(this.projectsDir, project);
        const stat = fs.statSync(projectDir);
        if (!stat.isDirectory()) continue;

        // Check sessions-index.json for project path
        const indexPath = path.join(projectDir, 'sessions-index.json');
        if (fs.existsSync(indexPath)) {
          try {
            const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
            if (index.originalPath && cwd.startsWith(index.originalPath)) {
              matchingProject = projectDir;
              break;
            }
          } catch {
            // Continue
          }
        }
      }

      // If no match, use the most recently modified session
      if (!matchingProject) {
        let newestSession = null;
        let newestTime = 0;

        for (const project of projects) {
          const projectDir = path.join(this.projectsDir, project);
          const stat = fs.statSync(projectDir);
          if (!stat.isDirectory()) continue;

          const sessions = fs.readdirSync(projectDir)
            .filter(f => f.endsWith('.jsonl'))
            .map(f => path.join(projectDir, f));

          for (const sessionPath of sessions) {
            const sessionStat = fs.statSync(sessionPath);
            // Check if this session was modified in the last minute (active session)
            const now = Date.now();
            const timeSinceModified = now - sessionStat.mtimeMs;

            // Prioritize very recently modified sessions (likely current)
            if (timeSinceModified < 60000 && sessionStat.mtimeMs > newestTime) {
              newestTime = sessionStat.mtimeMs;
              newestSession = sessionPath;
            }
          }
        }

        return newestSession;
      }

      // Get most recent session from matching project
      const sessions = fs.readdirSync(matchingProject)
        .filter(f => f.endsWith('.jsonl'))
        .map(f => path.join(matchingProject, f));

      if (sessions.length === 0) return null;

      return sessions.sort((a, b) => {
        const statA = fs.statSync(a);
        const statB = fs.statSync(b);
        return statB.mtimeMs - statA.mtimeMs;
      })[0];
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
    const model = entry.message?.model || entry.model || entry.model_name || entry.slate?.model;
    if (model) {
      const modelLower = model.toLowerCase();
      if (modelLower.includes('opus')) return 'Opus 4.5';
      if (modelLower.includes('sonnet')) return 'Sonnet 4.5';
      if (modelLower.includes('haiku')) return 'Haiku 4.5';
      if (modelLower.includes('glm')) {
        if (modelLower.includes('4.5') || modelLower.includes('4-5')) return 'Glm 4.5';
        if (modelLower.includes('4.7') || modelLower.includes('4-7')) return 'Glm 4.7';
        return 'Glm';
      }
      return model.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    return 'N/A';
  }

  extractTokens(sessionData, sessionPath) {
    let inputTokens = 0;
    let outputTokens = 0;

    // First, try to get actual tokens from session data
    for (const entry of sessionData) {
      if (entry.type === 'api_call_start') {
        inputTokens += entry.input_tokens || 0;
        outputTokens += entry.output_tokens || 0;
      } else if (entry.type === 'completion_params') {
        inputTokens += entry.prompt_tokens || 0;
        outputTokens += entry.completion_tokens || 0;
      } else if (entry.type === 'assistant' && entry.message?.usage) {
        inputTokens += entry.message.usage.input_tokens || 0;
        outputTokens += entry.message.usage.output_tokens || 0;
      }
    }

    // If no actual tokens found, estimate from file size
    if (inputTokens === 0 && outputTokens === 0 && sessionPath) {
      try {
        const stats = fs.statSync(sessionPath);
        const fileSize = stats.size;
        const estimatedTotal = Math.round((fileSize * TOKENS_PER_CHAR) / JSON_OVERHEAD);
        inputTokens = Math.round(estimatedTotal * 0.7);
        outputTokens = Math.round(estimatedTotal * 0.3);
      } catch {
        const totalContent = sessionData.map(e => JSON.stringify(e)).join('');
        const estimatedTotal = Math.round((totalContent.length * TOKENS_PER_CHAR) / JSON_OVERHEAD);
        inputTokens = Math.round(estimatedTotal * 0.7);
        outputTokens = Math.round(estimatedTotal * 0.3);
      }
    }

    return { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens };
  }

  getContextLimit(modelName) {
    const modelLower = (modelName || '').toLowerCase();
    if (modelLower.includes('opus')) return this.contextLimits.opus;
    if (modelLower.includes('sonnet')) return this.contextLimits.sonnet;
    if (modelLower.includes('haiku')) return this.contextLimits.haiku;
    if (modelLower.includes('glm')) return this.contextLimits.glm;
    return this.contextLimits.default;
  }

  formatTokens(tokens) {
    if (!tokens || tokens.total === 0) return '';
    const t = tokens.total;
    return t >= 1000 ? `${(t / 1000).toFixed(0)}K` : `${t}`;
  }

  calculateCost(tokens, entry) {
    const pricing = {
      opus: { input: 15, output: 75 },
      sonnet: { input: 3, output: 15 },
      haiku: { input: 1, output: 5 },
      glm: { input: 0.5, output: 1 }
    };

    let model = 'opus';
    const modelStr = (entry.message?.model || entry.model || entry.model_name || '').toLowerCase();
    if (modelStr.includes('sonnet')) model = 'sonnet';
    else if (modelStr.includes('haiku')) model = 'haiku';
    else if (modelStr.includes('glm')) model = 'glm';

    const rates = pricing[model];
    const inputCost = (tokens.input / 1_000_000) * rates.input;
    const outputCost = (tokens.output / 1_000_000) * rates.output;

    return inputCost + outputCost;
  }

  renderProgress(percentage) {
    if (!percentage) return '';
    const pct = parseInt(percentage);
    if (isNaN(pct)) return '';

    const width = 10;
    const filled = Math.round((pct / 100) * width);
    const empty = width - filled;

    // Color gradient based on percentage
    let color = COLORS.green;
    if (pct >= 80) color = COLORS.red;
    else if (pct >= 50) color = COLORS.yellow;

    return color + '█'.repeat(filled) + COLORS.dim + '░'.repeat(empty) + COLORS.reset;
  }

  calculateDuration(sessionData) {
    if (sessionData.length === 0) return '';

    let start = null;
    let end = null;

    for (const entry of sessionData) {
      const ts = entry.timestamp || entry.time;
      if (ts) {
        if (!start) start = ts;
        end = ts;
      }
    }

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

    if (cwd.startsWith(this.homeDir)) {
      abbrevPath = '~' + cwd.slice(this.homeDir.length);
    }

    const parts = abbrevPath.split(path.sep);
    if (parts.length > 3) {
      const last = parts[parts.length - 1];
      const secondLast = parts[parts.length - 2];
      abbrevPath = ['~', '...', secondLast, last].join(path.sep);
    }

    return { abbrevPath };
  }
}

if (require.main === module) {
  const statusline = new StatusLine();
  statusline.run();
}

module.exports = StatusLine;
