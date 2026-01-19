/**
 * Hook Installation Script
 * Automatically installs the Judge hook into Claude Code's hooks configuration
 */

const fs = require('fs');
const path = require('path');

const HOOKS_FILE = '.claude/hooks.json';
const HOOK_SCRIPT_NAME = 'judge-hook.js';
const HOOK_TIMEOUT = 30; // seconds

function main() {
  const projectRoot = process.cwd();
  const hooksFilePath = path.join(projectRoot, HOOKS_FILE);
  const hookScriptPath = path.join(projectRoot, 'dist', HOOK_SCRIPT_NAME);

  console.log('[Quality Gate] Installing hook...');

  // Check if dist directory exists
  if (!fs.existsSync(path.dirname(hookScriptPath))) {
    console.error('[Quality Gate] ERROR: dist directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Check if hook script exists
  if (!fs.existsSync(hookScriptPath)) {
    console.error('[Quality Gate] ERROR: Hook script not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Read existing hooks config or create new one
  let hooksConfig = { hooks: {} };

  if (fs.existsSync(hooksFilePath)) {
    try {
      const content = fs.readFileSync(hooksFilePath, 'utf-8');
      hooksConfig = JSON.parse(content);
    } catch (error) {
      console.warn('[Quality Gate] Warning: Could not parse existing hooks.json, creating new one');
    }
  }

  // Initialize PreToolUse hooks array if it doesn't exist
  if (!hooksConfig.hooks.PreToolUse) {
    hooksConfig.hooks.PreToolUse = [];
  }

  // Check if judge hook is already installed
  const hookScript = `node $CLAUDE_PROJECT_DIR/plugins/quality-gate/${hookScriptPath}`;
  const existingHook = hooksConfig.hooks.PreToolUse.find(
    (h) => h.hooks && h.hooks.some((hook) => hook.command.includes('judge-hook'))
  );

  if (existingHook) {
    console.log('[Quality Gate] Hook already installed. Updating...');
    // Remove existing hook
    hooksConfig.hooks.PreToolUse = hooksConfig.hooks.PreToolUse.filter(
      (h) => h !== existingHook
    );
  }

  // Add judge hook
  hooksConfig.hooks.PreToolUse.push({
    matcher: 'Write|Edit|MultiEdit',
    hooks: [
      {
        type: 'command',
        command: 'node $CLAUDE_PROJECT_DIR/plugins/quality-gate/dist/judge-hook.js',
        timeout: HOOK_TIMEOUT,
        description: 'Code quality gate - validates complexity, semantics, and security',
      },
    ],
  });

  // Ensure .claude directory exists
  const claudeDir = path.dirname(hooksFilePath);
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Write hooks config
  fs.writeFileSync(hooksFilePath, JSON.stringify(hooksConfig, null, 2));

  console.log('[Quality Gate] Hook installed successfully!');
  console.log(`[Quality Gate] Hooks file: ${hooksFilePath}`);
  console.log('[Quality Gate] The judge hook will now validate all Write/Edit operations.');
}

main();
