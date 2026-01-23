# Fix Execution Report

## Root Cause Confirmed

### Hypothesis 1: Build Configuration ✅ CONFIRMED
The `.gitignore` file was ignoring `dist/` globally, meaning compiled files were NOT committed to Git. When plugins are installed via marketplace, they are cloned from Git without running `npm run build`, resulting in empty `dist/` folders.

**Evidence**:
- `.gitignore` line 2: `dist/` (global ignore)
- `.gitignore` had exceptions only for `statusline` dist folders
- The marketplace cache at `~/.claude/plugins/cache/smite/ralph/3.1.0/dist/` was missing `stop-hook.js`
- Source file `src/stop-hook.ts` exists but compiled output was not in git

### Hypothesis 2: Wrong Hook Path ✅ CONFIRMED
The `plugin.json` declared hook path as `hooks/stop-hook.js` but the file was at `dist/stop-hook.js`.

**Evidence**:
- plugin.json line 21: `"command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.js"`
- Compiled file location: `dist/stop-hook.js`
- No `hooks/` folder existed in the plugin structure

## Changes Applied

### 1. Fixed .gitignore
**File**: `.gitignore`
**Change**: Added exceptions for all plugin `dist/` folders
```diff
# Allow statusline dist folders (needed for plugin installation)
!plugins/statusline/scripts/dist/
!plugins/statusline/scripts/statusline/dist/
+# Allow dist folders for plugins (needed for plugin installation)
+!plugins/ralph/dist/
+!plugins/predator/dist/
+!plugins/mobs/dist/
+!plugins/toolkit/dist/
+!plugins/basics/dist/
+!plugins/auto-rename/dist/
+!plugins/shell/dist/
```

### 2. Fixed plugin.json Hook Path
**File**: `plugins/ralph/.claude-plugin/plugin.json`
**Change**: Updated hook command path from `hooks/stop-hook.js` to `dist/stop-hook.js`
```diff
-            "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.js"
+            "command": "node ${CLAUDE_PLUGIN_ROOT}/dist/stop-hook.js"
```

### 3. Removed postinstall Script
**File**: `plugins/ralph/package.json`
**Change**: Removed `postinstall` and `install-hook` scripts that were creating an incorrect wrapper
```diff
    "typecheck": "tsc --noEmit",
-    "postinstall": "node install-hook.js",
-    "install-hook": "node install-hook.js"
+    "typecheck": "tsc --noEmit"
```

### 4. Updated Version
**File**: `plugins/ralph/package.json`
**Change**: Bumped version from 3.0.0 to 3.1.1 for the fix release

### 5. Removed obsolete install-hook.js
**File**: `plugins/ralph/install-hook.js`
**Change**: Deleted this file as it's no longer needed (plugin.json hook is sufficient)

### 6. Rebuilt Plugin
**Command**: `cd plugins/ralph && npm run build`
**Result**: `stop-hook.js` (7234 bytes) now exists in `dist/` folder

## Files Modified
- `.gitignore` - Added dist folder exceptions for all plugins
- `plugins/ralph/.claude-plugin/plugin.json` - Fixed hook path
- `plugins/ralph/package.json` - Removed postinstall, bumped version
- `plugins/ralph/install-hook.js` - DELETED (no longer needed)
- `plugins/ralph/dist/stop-hook.js` - Created by build (was missing)

## Next Steps
1. Commit and push these changes to Git
2. Update marketplace to pull latest changes
3. Reinstall ralph plugin to get the updated version with dist files
