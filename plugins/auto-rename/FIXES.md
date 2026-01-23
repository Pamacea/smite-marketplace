# Auto-Rename Plugin Bug Fixes

## Version 3.1.2 - January 23, 2026

### 🐛 Bug #7: **Session Names Capture Command Artifacts Instead of User Intent** (HIGH)
**Problem**: When using `/command` skills (like `/predator:debug`, `/debug`, `/commit`), the plugin captured command arguments and status bar artifacts instead of the user's actual request.
**Impact**: Sessions named with garbage like "main • ~\Projects\smite • Glm 4.7 • $0.00 • 3K..." instead of the actual task
**Fix**: Added `isCommandInvocation()` method to detect and skip system-generated messages
**Location**: `session-manager.js:123-165, 85-108`

**Root Cause**:
When a user invokes `/predator:debug The auto-rename plugin doesn't work perfectly`, the session contains:
1. First user message: `<command-args>main • ~\Projects\smite • Glm 4.7 • $0.00 • 3K...</command-args>` (status bar info)
2. Second user message: `<objective>Debug and resolve...</objective>` (skill expansion)

The old code captured the FIRST user message, which was command metadata, not the user's intent.

**Fix Added**:
```javascript
isCommandInvocation(message) {
  // Detect if this is a system command/skill invocation rather than a real user message
  // Skips messages containing: <command->, <local-command->, <objective>, <process>, <verification>
  // Returns true for system messages, false for genuine user input
}
```

And updated `extractContext()` to skip these messages:
```javascript
for (const entry of recentEntries) {
  if (entry.type === 'user' && entry.message && entry.message.content) {
    // Skip command/skill invocations - they're not real user messages
    if (this.isCommandInvocation(entry.message.content)) {
      continue;
    }
    // ... rest of extraction
  }
}
```

**Result**: Session names now reflect the actual task, not command artifacts.

---

## Version 3.1.1 - January 22, 2026

### 🐛 Critical Bugs Fixed

#### Bug #1: **LLM Generation Completely Broken** (CRITICAL)
**Problem**: Used non-existent `--non-interactive` flag for `claude` CLI
**Impact**: All intelligent name generation failed, always fell back to generic names
**Fix**: Changed to use `-p` (print) flag with proper stdin handling
**Location**: `rename-script.js:250-316`

**Before**:
```javascript
const claude = spawn('claude', ['--non-interactive'], {
  env: {
    ...process.env,
    INPUT_DATA: JSON.stringify({ content: prompt }) // ❌ Wrong approach
  }
});
```

**After**:
```javascript
const claude = spawn('claude', ['-p', '--output-format', 'text'], {
  env: process.env,
  shell: true // ✅ Properly resolve claude command on Windows
});

// Write prompt to stdin
claude.stdin.write(prompt);
claude.stdin.end();
```

---

#### Bug #2: **Stdin Reading Blocking/Empty** (HIGH)
**Problem**: Synchronous stdin read could block or return empty on Windows
**Impact**: PostToolUse and UserPromptSubmit hooks often failed silently
**Fix**: Added proper pipe detection and error handling
**Location**: `rename-script.js:36-76`

**Before**:
```javascript
const inputData = fs.readFileSync(stdinFd, 'utf-8'); // ❌ Blocks, no pipe check
```

**After**:
```javascript
const stdinStat = fs.fstatSync(0);
if (stdinStat.isFIFO() || stdinStat.size > 0) { // ✅ Check if pipe
  const inputData = fs.readFileSync(0, 'utf-8');
  // ...
}
```

---

#### Bug #3: **Stale Session Data in Cache** (MEDIUM)
**Problem**: Session data cached but never refreshed between triggers
**Impact**: Hooks worked with outdated session info, missed recent changes
**Fix**: Clear cache before reading session in all hooks
**Location**: `rename-script.js:127-128, 150-151`

**Added**:
```javascript
// Clear cache to ensure we have fresh session data
this.manager.clearCache();
```

---

#### Bug #4: **Matcher Config Ignored** (LOW)
**Problem**: `hooks.json` had matcher regex but code used hardcoded list
**Impact**: Configuration inconsistency, confusing maintenance
**Fix**: Removed matcher from config (handle all in code)
**Location**: `hooks.json:17`, `plugin.json:24-33`

---

#### Bug #5: **Limited Significant Commands** (MEDIUM)
**Problem**: Only detected 6 git/npm commands as significant
**Impact**: Many important operations didn't trigger renames
**Fix**: Expanded to 25+ commands including testing, linting, docker
**Location**: `rename-script.js:186-197`

**Before**:
```javascript
const significantCommands = [
  'git commit', 'npm ', 'yarn ', 'pnpm ', 'bun ', 'git add', 'git push'
];
```

**After**:
```javascript
const significantCommands = [
  'git commit', 'git add', 'git push', 'git pull', 'git merge', 'git checkout',
  'git rebase', 'git reset', 'git revert', 'git stash',
  'npm ', 'yarn ', 'pnpm ', 'bun ',
  'npm install', 'npm run', 'npm ci',
  'yarn install', 'yarn add',
  'pnpm install', 'pnpm add',
  'bun install', 'bun add',
  'eslint', 'prettier', 'pytest', 'jest', 'vitest',
  'build', 'test', 'lint', 'typecheck', 'format',
  'docker', 'terraform', 'ansible'
];
```

---

#### Bug #6: **Slow Session Start** (LOW)
**Problem**: Fixed 12-second delay (5s + 7s) on session start
**Impact**: Poor UX, slow initial rename
**Fix**: Reduced to 8 seconds (3s + 5s) with better logging
**Location**: `rename-script.js:89-109`

---

### 📊 Impact Summary

| Bug | Severity | Impact | Status |
|-----|----------|--------|--------|
| LLM generation broken | 🔴 CRITICAL | No intelligent names ever generated | ✅ Fixed |
| Stdin reading issues | 🟠 HIGH | Hooks often failed silently | ✅ Fixed |
| Stale cache data | 🟡 MEDIUM | Worked with outdated info | ✅ Fixed |
| Config inconsistency | 🟢 LOW | Confusing maintenance | ✅ Fixed |
| Limited commands | 🟡 MEDIUM | Missed important operations | ✅ Fixed |
| Slow delays | 🟢 LOW | Poor UX | ✅ Fixed |

---

### 🧪 Testing

To verify fixes work:

1. **Check syntax**:
   ```bash
   node -c hooks/rename-script.js
   ```

2. **Test LLM generation** (should work now):
   ```bash
   echo 'Generate a name for: "Fix authentication bug"' | claude -p
   ```

3. **Test hook trigger**:
   - Start a new session
   - Run some git/npm commands
   - Check stderr for `[AutoRename]` messages
   - Verify session gets renamed

---

### 📝 Migration Notes

**For users upgrading from 3.1.0 → 3.1.1**:

1. **No config changes needed** - `settings.json` remains compatible
2. **Reinstall plugin** to get updated hooks:
   ```bash
   # Uninstall old version
   claude plugin uninstall auto-rename@smite

   # Install new version
   claude plugin install auto-rename@smite
   ```
3. **Verify installation**:
   ```bash
   claude plugin list
   ```

---

### 🔍 Verification Checklist

After installing 3.1.1, verify:

- [ ] Plugin loads without errors
- [ ] LLM names generate (not just fallbacks)
- [ ] PostToolUse hooks trigger on git/npm commands
- [ ] UserPromptSubmit hooks work
- [ ] Session start rename happens quickly
- [ ] No "spawn claude ENOENT" errors in logs
- [ ] No stdin-related errors in logs

---

### 📁 Files Modified

- `hooks/rename-script.js` - Main fixes (LLM, stdin, cache, commands)
- `hooks/hooks.json` - Removed matcher
- `.claude-plugin/plugin.json` - Version bump to 3.1.1
- `README.md` - No changes needed (already correct)
- `config/settings.json` - No changes needed

---

### 🚀 What's Improved

1. ✅ **LLM names actually work** - No more always falling back to "Working on code"
2. ✅ **More responsive** - Hooks trigger reliably on PostToolUse and UserPromptSubmit
3. ✅ **Better detection** - Catches more significant operations (testing, linting, etc.)
4. ✅ **Faster** - Reduced delays on session start
5. ✅ **More reliable** - Proper error handling, no silent failures

---

## Bug Report Source

Debug session: `/predator:debug Check for auto-rename plugin in the repo and my .claude, there arre a bugs, the auto-rename don't works perfectly`

Root causes identified and fixed on 2026-01-22
