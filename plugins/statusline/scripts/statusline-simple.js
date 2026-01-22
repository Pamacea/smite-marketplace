#!/usr/bin/env node

/**
 * Simplified Statusline for Claude Code
 *
 * A reliable, cross-platform statusline that:
 * - Shows git branch, cost, duration, and current session token usage
 * - Parses transcript to count tokens from current session only
 * - Works on Windows, macOS, and Linux
 * - No cumulative token tracking - session-specific only
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Token tracker paths
const TOKEN_TRACKER_PATH = path.join(os.homedir(), '.claude', '.token-tracker.json');
const TOKEN_DIFF_TIMEOUT = 5000; // 5 seconds - hide token diff after this time
const SESSION_TIMEOUT = 1800000; // 30 minutes - reset tracker after this time
const SPURIOUS_DIFF_THRESHOLD = 50000; // 50K - hide unreasonably large diffs

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  red: '\x1b[31m'
};

/**
 * Load token tracker from disk
 */
function loadTokenTracker(currentUsage, sessionId) {
  try {
    if (fs.existsSync(TOKEN_TRACKER_PATH)) {
      const content = fs.readFileSync(TOKEN_TRACKER_PATH, 'utf-8');
      const tracker = JSON.parse(content);
      const now = Date.now();

      // Reset tracker if too old (> 30 minutes) or session changed
      if (
        now - tracker.timestamp > SESSION_TIMEOUT ||
        (sessionId && tracker.sessionId && sessionId !== tracker.sessionId)
      ) {
        return {
          lastUsage: currentUsage,
          timestamp: now,
          lastDiffTime: now,
          sessionId,
        };
      }
      // Update sessionId if it wasn't set before
      if (sessionId && !tracker.sessionId) {
        tracker.sessionId = sessionId;
      }
      return tracker;
    }
  } catch (e) {
    // File doesn't exist or is invalid
  }
  return {
    lastUsage: currentUsage,
    timestamp: Date.now(),
    lastDiffTime: Date.now(),
    sessionId,
  };
}

/**
 * Save token tracker to disk
 */
function saveTokenTracker(tracker) {
  try {
    tracker.timestamp = Date.now();
    fs.writeFileSync(
      TOKEN_TRACKER_PATH,
      JSON.stringify(tracker, null, 2),
      'utf-8'
    );
  } catch (e) {
    // Fail silently - don't break statusline if we can't save
  }
}

/**
 * Calculate token difference and determine if it should be shown
 */
function getTokenDiff(currentUsage, tracker) {
  const tokenDiff = currentUsage - tracker.lastUsage;
  const now = Date.now();
  const timeSinceLastDiff = now - (tracker.lastDiffTime || 0);

  // Only show positive token diffs (new tokens added)
  const shouldShow = tokenDiff > 0 && timeSinceLastDiff < TOKEN_DIFF_TIMEOUT;

  return { diff: tokenDiff, shouldShow };
}

/**
 * Update tracker with new usage if tokens have changed
 */
function updateTracker(tracker, currentUsage) {
  const tokenDiff = currentUsage - tracker.lastUsage;
  const now = Date.now();

  if (tokenDiff > 0) {
    // New tokens added - normal progression
    tracker.lastUsage = currentUsage;
    tracker.lastDiffTime = now;
  } else if (tokenDiff < 0) {
    // Context cleared or parallel session detected
    tracker.lastUsage = currentUsage;
    // lastDiffTime stays the same
  }
  // If tokenDiff === 0, no update needed

  return tracker;
}

/**
 * Estimate tokens from transcript for CURRENT SESSION only
 * Counts user messages, assistant messages, and tool results
 * Uses 3.5 chars per token ratio (balanced for code + text)
 */
function estimateSessionTokens(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    return 0;
  }

  try {
    const transcriptContent = fs.readFileSync(transcriptPath, 'utf-8');
    const lines = transcriptContent.trim().split('\n');

    let charCount = 0;

    // Parse all entries to count session tokens
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);

        // Skip internal entries that don't consume context
        if (entry.type === 'progress' || entry.type === 'file-history-snapshot') {
          continue;
        }

        // Count user and assistant messages (excluding "thinking" blocks)
        if (entry.type === 'user' || entry.type === 'assistant') {
          const content = entry.message?.content || entry.content || '';
          if (Array.isArray(content)) {
            const nonThinkingContent = content.filter(c => c.type !== 'thinking');
            charCount += JSON.stringify(nonThinkingContent).length;
          } else {
            charCount += content.length;
          }
        }
        // Count tool results and tool uses
        else if (entry.type === 'tool_result' || entry.type === 'tool_use') {
          const toolContent = entry.message?.content || entry.content || entry.output || '';
          const toolInput = entry.message?.input || entry.input || '';
          charCount += JSON.stringify(toolContent).length + JSON.stringify(toolInput).length;
        }
      } catch {
        continue;
      }
    }

    // Estimate tokens: 3.5 chars per token
    return Math.round(charCount / 3.5);

  } catch (e) {
    return 0;
  }
}

try {
  // Read stdin synchronously
  const inputData = fs.readFileSync(0, 'utf-8');
  const data = JSON.parse(inputData);

  // Get git branch with timeout
  let branch = 'main';
  try {
    branch = execSync('git branch --show-current', {
      encoding: 'utf8',
      timeout: 300,
      stdio: ['ignore', 'pipe', 'ignore'],
      cwd: data.workspace?.current_dir?.replace(/\\/g, '/') || process.cwd()
    }).trim() || 'main';
  } catch {
    branch = 'main';
  }

  // Format cost
  const cost = (data.cost?.total_cost_usd || 0).toFixed(2);

  // Format duration
  const durationSecs = Math.floor((data.cost?.total_duration_ms || 0) / 1000);
  const mins = Math.floor(durationSecs / 60);
  const secs = durationSecs % 60;

  // Get context window size
  const contextWindow = data.context_window?.context_window_size || 200000;

  // Base context tokens (fixed overhead from Claude Code)
  // From /context command:
  // - System prompt: 2.9k tokens
  // - System tools: 14.6k tokens
  // - Custom agents: 251 tokens
  // - Memory files (CLAUDE.md, rules): 6.1k tokens
  // - Skills: 566 tokens
  // Total: ~24.4k tokens (this is constant per session)
  const BASE_CONTEXT_TOKENS = 24400;

  // Token counting strategy:
  // 1. Parse transcript for session tokens (user messages + assistant + tools)
  // 2. Add base context (System prompt + tools + agents + memory files)
  // This gives us CURRENT SESSION usage, not cumulative

  const sessionTokens = estimateSessionTokens(data.transcript_path);
  const currentUsage = sessionTokens + BASE_CONTEXT_TOKENS;

  // Token tracking with diff
  const sessionId = data.transcript_path; // Use transcript path as session ID
  const tokenTracker = loadTokenTracker(currentUsage, sessionId);
  let { diff: tokenDiff, shouldShow: showTokenDiff } = getTokenDiff(currentUsage, tokenTracker);

  // Detect spurious diffs from base context calculation changes or session resets
  if (Math.abs(tokenDiff) > SPURIOUS_DIFF_THRESHOLD) {
    showTokenDiff = false;
    tokenTracker.lastUsage = currentUsage;
    tokenTracker.timestamp = Date.now();
    saveTokenTracker(tokenTracker);
  } else {
    // Normal path: update tracker with actual changes
    const updatedTracker = updateTracker(tokenTracker, currentUsage);
    saveTokenTracker(updatedTracker);
  }

  const percentage = Math.min(100, Math.round((currentUsage / contextWindow) * 100));

  // Color-coded progress bar based on usage
  const filled = Math.floor(percentage / 10);
  const empty = 10 - filled;

  let barColor = colors.green;
  if (percentage >= 80) barColor = colors.yellow;
  if (percentage >= 90) barColor = colors.bright + colors.red;

  const bar = barColor + '█'.repeat(filled) + colors.gray + '░'.repeat(empty) + colors.reset;

  // Get model name
  const modelName = data.model?.display_name || 'Claude';

  // Format tokens in K
  const tokensK = (currentUsage / 1000).toFixed(1);

  // Format token diff if showing
  let tokenDiffStr = '';
  if (showTokenDiff && tokenDiff > 0) {
    const diffK = (tokenDiff / 1000).toFixed(1);
    tokenDiffStr = colors.gray + '(' + colors.green + '+' + diffK + 'K' + colors.gray + ')' + colors.reset;
  }

  // Get project path and format it relative to home directory
  const homeDir = os.homedir();
  let projectPath = (data.workspace?.current_dir || process.cwd()).replace(/\\/g, '/');

  // Try to get current working directory from transcript
  try {
    if (data.transcript_path && fs.existsSync(data.transcript_path)) {
      const transcriptContent = fs.readFileSync(data.transcript_path, 'utf-8');
      const lines = transcriptContent.trim().split('\n');
      const recentLines = lines.slice(-50);
      let currentDir = projectPath;

      // Process in reverse to find most recent cd command
      for (let i = recentLines.length - 1; i >= 0; i--) {
        try {
          const entry = JSON.parse(recentLines[i]);
          const entryStr = JSON.stringify(entry);

          // Look for cd commands
          const bashInputMatch = entryStr.match(/<bash-input>cd\s+([^\s<]+)<\/bash-input>/);
          if (bashInputMatch) {
            let targetDir = bashInputMatch[1].trim();

            if (targetDir === '..') {
              const parts = currentDir.split(/[/\\]/);
              parts.pop();
              currentDir = parts.join('/');
            } else if (targetDir.startsWith('/') || targetDir.match(/^[A-Za-z]:\\/)) {
              currentDir = targetDir;
            } else if (targetDir !== '.' && targetDir !== '~') {
              const separator = currentDir.includes('/') ? '/' : '\\';
              currentDir = currentDir + separator + targetDir;
            }

            currentDir = currentDir.replace(/\\/g, '/');
            projectPath = currentDir;
            break;
          }
        } catch {
          continue;
        }
      }
    }
  } catch {
    // Use default path
  }

  // Replace home directory with ~
  const normalizedProjectPath = projectPath;
  const normalizedHomeDir = homeDir.replace(/\\/g, '/');

  let displayPath = normalizedProjectPath;
  if (normalizedProjectPath.startsWith(normalizedHomeDir + '/') || normalizedProjectPath === normalizedHomeDir) {
    const relativePath = normalizedProjectPath.slice(normalizedHomeDir.length);
    displayPath = '~' + (relativePath.startsWith('/') ? relativePath : '/' + relativePath);
  }

  // Get project name
  const pathParts = displayPath.split(/[/\\]/);
  const projectName = pathParts.pop() || 'project';
  const pathWithoutProject = pathParts.join('/');

  let finalPathDisplay = projectName;
  if (pathWithoutProject && pathWithoutProject !== '~') {
    finalPathDisplay = pathWithoutProject + '/' + projectName;
  } else if (pathWithoutProject === '~') {
    finalPathDisplay = '~/' + projectName;
  }

  // Output the statusline
  console.log(
    colors.cyan + branch + colors.reset + ' • ' +
    colors.gray + finalPathDisplay + colors.reset + ' • ' +
    colors.bright + modelName + colors.reset + ' • ' +
    colors.yellow + '$' + cost + colors.reset + ' • ' +
    colors.white + mins + 'm' + secs + 's' + colors.reset + ' • ' +
    colors.blue + tokensK + 'K' + tokenDiffStr + colors.reset + ' • ' +
    bar + ' ' + percentage + '%' + colors.reset
  );

} catch (error) {
  // Fallback output on any error
  console.log(colors.gray + '>> accepts edits on' + colors.reset);
}
