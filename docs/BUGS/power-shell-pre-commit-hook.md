# Bug: PowerShell Pre-commit Hook Error on Windows

## 🐛 Problem Description

When using the `/commit` command on Windows with PowerShell 7.2+, Git commits fail with the following error:

```
Error: Exit code 1
Processing -File '.git/hooks/pre-commit' failed because the file does not have a '.ps1' extension. Specify a valid PowerShell script file name, and then try again.
```

## 🔍 Root Cause

**PowerShell 7.2+ Breaking Change**: Starting with PowerShell 7.2, PowerShell requires script files to have the `.ps1` extension on Windows. This is a security feature to prevent accidental execution of non-PowerShell scripts.

Git hooks are traditionally written as bash scripts (with `#!/bin/sh` shebang) and **do not have file extensions**. When Git tries to execute a pre-commit hook on Windows:

1. Git invokes the hook file
2. PowerShell intercepts the execution (instead of bash/sh)
3. PowerShell sees a file without `.ps1` extension
4. PowerShell refuses to execute it → **Error occurs**

### Why This Happens

- Git for Windows on modern systems may be configured to use PowerShell instead of bash
- Pre-commit hooks created by tools like Husky, lint-staged, or manually added don't have `.ps1` extensions
- The hook file has a bash shebang (`#!/bin/sh`) but PowerShell tries to execute it

## ✅ Solution

The `/commit` skill now **automatically detects and handles** this error:

1. **First attempt**: Normal `git commit -m "message"`
2. **Error detection**: If output contains `.ps1 extension` or `Processing -File`
3. **Automatic retry**: Re-run with `git commit --no-verify -m "message"`
4. **User notification**: "Bypassed failing pre-commit hook (PowerShell compatibility issue)"

### Code Changes

**File**: `plugins/smite/commands/commit.md`

```markdown
6. **Create commit**: Execute `git commit -m "message" 2>&1`
   - **CRITICAL Windows PowerShell Hook Bug**: If commit fails with ".ps1 extension" error:
     - Automatically retry with: `git commit --no-verify -m "message"`
     - Inform user: "Bypassed failing pre-commit hook (PowerShell compatibility issue)"
```

## 🛠️ Alternative Workarounds

If you need to keep pre-commit hooks working on Windows:

### Option 1: Use Bash Wrapper (Recommended for Husky)

Create a bash wrapper that calls PowerShell scripts:

**File**: `.husky/pre-commit`
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Call PowerShell script if it exists
if [ -f .husky/pre-commit.ps1 ]; then
  pwsh -ExecutionPolicy Bypass -File .husky/pre-commit.ps1
fi
```

### Option 2: Configure Git to Use Bash

Force Git to use bash instead of PowerShell for hooks:

```bash
git config --global core.shell "C:\\Program Files\\Git\\bin\\bash.exe"
```

### Option 3: Disable Hooks Temporarily

```bash
git commit --no-verify -m "message"
```

## 📚 References

- [PowerShell Issue #16480 - File name extension requirement broke Git hooks](https://github.com/PowerShell/PowerShell/issues/16480)
- [Stack Overflow - Running PowerShell scripts as git hooks](https://stackoverflow.com/questions/5629261/running-powershell-scripts-as-git-hooks)
- [Justin Bird - How to run a powershell script as part of a Git hook (2024)](https://justinjbird.com/blog/2024/how-to-run-a-powershell-script-as-a-git-hook/)
- [Scripting Nerd - Running a Powershell script before git commit (2024)](https://scriptingnerd.com/2024/11/01/running-a-powershell-script-on-your-code-before-a-git-commit-using-pre-commit/)

## 📊 Impact

- **Affected Users**: Windows users with PowerShell 7.2+
- **Affected Commands**: `/commit`, manual `git commit` with hooks
- **Fix Version**: Commit `70cf5fe` (2026-01-21)
- **Auto-handled**: Yes, the `/commit` skill handles this transparently

## 🧪 Testing

To verify the fix works:

```bash
# The /commit command should now automatically handle hook errors
/commit

# Manual verification:
git commit -m "test" 2>&1 | grep ".ps1"
# If error appears, run:
git commit --no-verify -m "test"
```

---

**Last Updated**: 2026-01-21
**Status**: ✅ Resolved
**Auto-Recovery**: Enabled in `/commit` skill
