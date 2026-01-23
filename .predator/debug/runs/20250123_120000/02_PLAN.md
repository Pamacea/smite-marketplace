# Debug Strategy

## Hypotheses

### Hypothesis 1: TypeScript Build Configuration Missing stop-hook.ts
**Probability**: HIGH
**Root Cause**: The `src/stop-hook.ts` is not included in the TypeScript compilation output
**Evidence**:
- `src/stop-hook.ts` exists (5845 bytes)
- `dist/` folder exists but has NO `stop-hook.js`
- Other .ts files ARE compiled (index.js, prd-generator.js, etc.)
**Test Strategy**: Check tsconfig.json to see if stop-hook.ts is excluded

### Hypothesis 2: install-hook.js References Wrong Path
**Probability**: HIGH
**Root Cause**: The install script copies from `dist/stop-hook.js` but the file should be compiled to a different location or the script is wrong
**Evidence**:
- Line 15 of install-hook.js: `const sourceHook = path.join(pluginDir, 'dist', 'stop-hook.js');`
- This file doesn't exist after build
**Test Strategy**: Verify the actual build output location

### Hypothesis 3: plugin.json Declares Wrong Hook Path
**Probability**: MEDIUM
**Root Cause**: The plugin.json declares `${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.js` but the file should be at a different location
**Evidence**:
- plugin.json line 21: `"command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.js"`
- No `hooks/` directory in the plugin
**Test Strategy**: Check Claude Code plugin documentation for correct hook path format

## Investigation Strategy

### Priority 1: Fix Build Configuration
**Goal**: Ensure `stop-hook.ts` is compiled to the correct location

**Steps**:
1. Check `tsconfig.json` for any exclusions
2. Verify the compile output structure
3. Fix build to include stop-hook.ts

**Expected Result**: `dist/stop-hook.js` exists after `npm run build`

### Priority 2: Fix plugin.json Hook Path
**Goal**: Point to the correct hook file location

**Steps**:
1. Determine correct path (should be `dist/stop-hook.js` not `hooks/stop-hook.js`)
2. Update plugin.json to reference the compiled file
3. Test hook execution

**Expected Result**: Hook file is found when Claude Code tries to execute it

### Priority 3: Fix install-hook.js Script
**Goal**: Ensure the postinstall script works correctly

**Steps**:
1. Update path references to match actual build output
2. OR remove install-hook.js if not needed (use plugin.json directly)

**Expected Result**: Hook is properly installed/available after plugin install

## Acceptance Criteria

### Bug Fix Verification
- [ ] stop-hook.js exists in the correct location after install
- [ ] Claude Code can find and execute the hook
- [ ] No MODULE_NOT_FOUND error on session exit
- [ ] Hook only runs when ralph loop is active (not every session)

### Validation
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] Plugin installs correctly

### Regression Testing
- [ ] Ralph loop functionality still works
- [ ] Other ralph commands work
- [ ] Other plugins not affected

## Risk Assessment

### Fix Complexity
- **Low**: Update plugin.json path reference
- **Medium**: Fix build configuration
- **Low**: Update install-hook.js script

### Potential Side Effects
- Breaking existing ralph loop functionality if hook logic changes
- Plugin reinstall may be required

### Affected Areas
- plugins/ralph/src/
- plugins/ralph/.claude-plugin/plugin.json
- plugins/ralph/install-hook.js
