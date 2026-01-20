#!/usr/bin/env node

/**
 * Simplified Statusline for Claude Code
 *
 * A reliable, cross-platform statusline implementation that:
 * - Uses synchronous stdin reading (no async hangs)
 * - Has 300ms timeout on git commands
 * - Works on Windows, macOS, and Linux
 * - Shows git branch, cost, duration, and context usage
 * - Tracks token diff per request
 * - Dynamically updates working directory from cd commands
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

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

// Token tracking - show what the last request cost
const TRACKER_FILE = path.join(os.homedir(), '.claude', '.statusline-token-tracker.json');

let tokenState = {
  lastTotalTokens: null,
  lastRequestCost: null,
};

function loadTokenTracker() {
  try {
    if (fs.existsSync(TRACKER_FILE)) {
      const content = fs.readFileSync(TRACKER_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    // File doesn't exist or is invalid
  }
  return { lastTotalTokens: null, lastRequestCost: null };
}

function saveTokenTracker(state) {
  try {
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    // Fail silently
  }
}

function getTrackerState(currentTotalTokens) {
  // Load previous state
  if (tokenState.lastTotalTokens === null) {
    tokenState = loadTokenTracker();
  }

  let requestCost = 0;

  if (tokenState.lastTotalTokens !== null) {
    // Calculate what this request cost
    const calculatedCost = currentTotalTokens - tokenState.lastTotalTokens;

    // ONLY update if tokens increased (ignore session resets/compactions)
    // If totalTokens decreased, it means the session was reset or compacted
    if (calculatedCost > 0) {
      requestCost = calculatedCost;
      // Save this as the "last request cost" for next time
      tokenState.lastRequestCost = requestCost;
    } else {
      // Tokens decreased - use previous cost or 0 if first time
      requestCost = 0;
      // Don't update lastRequestCost - keep showing previous valid value
    }
  }

  // Always update the baseline to current, even if it decreased
  tokenState.lastTotalTokens = currentTotalTokens;
  saveTokenTracker(tokenState);

  // Return the PREVIOUS request's cost (what we should display now)
  return {
    diff: tokenState.lastRequestCost || 0,
    show: (tokenState.lastRequestCost || 0) > 0
  };
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
      cwd: data.workspace?.current_dir || process.cwd()
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

  // Calculate context percentage
  const contextWindow = data.context_window?.context_window_size || 200000;
  const currentUsage = (data.context_window?.current_usage?.input_tokens || 0) +
                     (data.context_window?.current_usage?.cache_creation_input_tokens || 0) +
                     (data.context_window?.current_usage?.cache_read_input_tokens || 0);
  const percentage = Math.min(100, Math.round((currentUsage / contextWindow) * 100));

  // Use total_input_tokens for tracking (accumulated across all requests)
  const totalTokens = data.context_window?.total_input_tokens || 0;

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

  // Track token difference using total accumulated tokens
  const { diff: tokenDiff, show: showTokenDiff } = getTrackerState(totalTokens);

  // Format token difference with color
  let tokenDiffStr = '';
  if (showTokenDiff && tokenDiff > 0) {
    const diffK = (tokenDiff / 1000).toFixed(1);
    const diffColor = tokenDiff > 50000 ? colors.red : (tokenDiff > 20000 ? colors.yellow : colors.green);
    tokenDiffStr = ' ' + diffColor + '+' + diffK + 'K' + colors.reset;
  }

  // Get project path and format it relative to home directory
  const homeDir = os.homedir();
  let projectPath = data.workspace?.current_dir || process.cwd();

  // Try to get current working directory from transcript
  try {
    if (data.transcript_path && fs.existsSync(data.transcript_path)) {
      // Read transcript file (JSONL format - one JSON object per line)
      const transcriptContent = fs.readFileSync(data.transcript_path, 'utf-8');
      const lines = transcriptContent.trim().split('\n');

      // Get last 50 entries to analyze
      const recentLines = lines.slice(-50);
      let currentDir = projectPath;

      // Process lines in reverse to find the most recent cd command
      for (let i = recentLines.length - 1; i >= 0; i--) {
        try {
          const entry = JSON.parse(recentLines[i]);
          const entryStr = JSON.stringify(entry);

          // Look for bash-input with cd command (format: <bash-input>cd plugins</bash-input>)
          const bashInputMatch = entryStr.match(/<bash-input>cd\s+([^\s<]+)<\/bash-input>/);
          if (bashInputMatch) {
            let targetDir = bashInputMatch[1].trim();

            // Handle relative paths
            if (targetDir === '..') {
              const parts = currentDir.split(/[/\\]/);
              parts.pop();
              currentDir = parts.join('/');
            } else if (targetDir.startsWith('/') || targetDir.match(/^[A-Za-z]:\\/)) {
              // Absolute path
              currentDir = targetDir;
            } else if (targetDir !== '.' && targetDir !== '~') {
              // Relative path
              const separator = currentDir.includes('/') ? '/' : '\\';
              currentDir = currentDir + separator + targetDir;
            }

            // Normalize path
            currentDir = currentDir.replace(/\\/g, '/');
            projectPath = currentDir;
            break; // Found most recent cd, stop searching
          }

          // Also look for cd in tool calls (format: {"command":"cd plugins"})
          const toolCdMatch = entryStr.match(/"command"\s*:\s*"((?:[^"\\]|\\.)*cd\s+[^\s"]+)"/);
          if (toolCdMatch) {
            const command = toolCdMatch[1].replace(/\\"/g, '"').replace(/\\'/g, "'");
            const cdMatch = command.match(/cd\s+([^\s&"]+)/);
            if (cdMatch) {
              let targetDir = cdMatch[1].replace(/^["']|["']$/g, '').trim();

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
          }
        } catch (parseError) {
          // Skip lines that can't be parsed
          continue;
        }
      }
    }
  } catch (e) {
    // Use default path if transcript can't be read
  }

  let displayPath = projectPath;

  // Normalize path separators for consistent comparison
  const normalizedProjectPath = projectPath.replace(/\\/g, '/');
  const normalizedHomeDir = homeDir.replace(/\\/g, '/');

  // Replace home directory with ~ for cleaner display
  if (normalizedProjectPath.startsWith(normalizedHomeDir + '/') || normalizedProjectPath === normalizedHomeDir) {
    const relativePath = normalizedProjectPath.slice(normalizedHomeDir.length);
    displayPath = '~' + (relativePath.startsWith('/') ? relativePath : '/' + relativePath);
  } else {
    // If not under home dir, just normalize separators
    displayPath = normalizedProjectPath;
  }

  // Get project name (last component of path)
  const pathParts = displayPath.split(/[/\\]/);
  const projectName = pathParts.pop() || 'project';
  const pathWithoutProject = pathParts.join('/');

  // Build final path display: if there's a path before project name, show it
  // Otherwise just show the project name
  let finalPathDisplay = projectName;
  if (pathWithoutProject && pathWithoutProject !== '~') {
    finalPathDisplay = pathWithoutProject + '/' + projectName;
  } else if (pathWithoutProject === '~') {
    finalPathDisplay = '~/' + projectName;
  }

  // Output the statusline with colors
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
