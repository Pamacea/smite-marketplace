# Bug Analysis Report

## Error Information
- **Type**: MODULE_NOT_FOUND
- **Message**: Cannot find module 'C:\Users\Yanis\.claude\plugins\cache\smite\ralph\3.1.0\hooks\stop-hook.js'
- **File**: C:\Users\Yanis\.claude\plugins\cache\smite\ralph\3.1.0\hooks\stop-hook.js
- **Function**: Claude Code Stop Hook execution

## Stack Trace
```
Error: Cannot find module 'C:\Users\Yanis\.claude\plugins\cache\smite\ralph\3.1.0\hooks\stop-hook.js'
  at Module._resolveFilename (node:internal/modules/cjs/loader:1421:15)
  at Module.load (node:internal/modules/cjs/loader:1201:14)
  ...
```

## Reproduction Steps
1. Install ralph plugin via marketplace
2. The plugin.json declares a Stop hook at `${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.js`
3. Claude Code tries to execute the stop hook on every session exit
4. The file doesn't exist → MODULE_NOT_FOUND error

## Expected vs Actual

### Expected Behavior
- The stop-hook.js file should exist in the plugin's hooks/ directory
- OR the hook should not be registered if the file doesn't exist
- The hook should only run when ralph is actually active (loop mode)

### Actual Behavior
- The stop-hook.js file doesn't exist
- Claude Code tries to run it on EVERY session exit (even when ralph is not used)
- Error appears in console but is "non-blocking" (session continues)

## Root Cause Hypothesis

### Primary Issue: Build/Deploy Process
The `src/stop-hook.ts` file is NOT being compiled to `dist/stop-hook.js` AND the `hooks/stop-hook.js` path is not being created during installation.

**Evidence**:
1. `src/stop-hook.ts` exists (5845 bytes)
2. `dist/` folder exists but does NOT contain `stop-hook.js`
3. No `hooks/` folder exists in the cached plugin
4. The `install-hook.js` script tries to copy from `dist/stop-hook.js` (line 15) but that file doesn't exist
5. The `plugin.json` declares the hook at `hooks/stop-hook.js` path

### Secondary Issue: Hook Always Runs
Even if the file existed, the hook runs on EVERY session exit, not just when ralph is active. The stop-hook.ts code checks for loop.md file but the hook is invoked regardless.

## Relevant Files
- `plugins/ralph/src/stop-hook.ts` - Source hook file (NOT compiled)
- `plugins/ralph/install-hook.js` - Installation script (references dist/stop-hook.js which doesn't exist)
- `plugins/ralph/package.json` - Has postinstall hook but references wrong path
- `.claude-plugin/plugin.json` - Declares hook at hooks/stop-hook.js

## Error Pattern
**Build Artifact Missing Pattern**: A TypeScript source file exists but is not included in the build output, causing runtime MODULE_NOT_FOUND errors when the plugin system tries to load it.
