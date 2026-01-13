# Troubleshooting Guide

Solutions to common issues with the SMITE Statusline plugin.

---

## Table of Contents

1. [Statusline Not Showing](#statusline-not-showing)
2. [Configuration Errors](#configuration-errors)
3. [Git Status Issues](#git-status-issues)
4. [Context Calculation Problems](#context-calculation-problems)
5. [Usage Limits Not Working](#usage-limits-not-working)
6. [Spend Tracking Issues](#spend-tracking-issues)
7. [Performance Problems](#performance-problems)
8. [Platform-Specific Issues](#platform-specific-issues)
9. [Debug Mode](#debug-mode)
10. [Log Files](#log-files)

---

## Statusline Not Showing

### Issue: No statusline appears at bottom of Claude Code

#### ✅ Quick Check

```bash
# 1. Verify plugin installed
/plugin list

# Should show:
# - statusline@smite (1.0.0)
```

#### ✅ Check Configuration

```bash
# View current config
/statusline config

# Should show:
{
  "statusLine": {
    "type": "command",
    "command": "bun /path/to/index.ts",
    "padding": 0
  }
}
```

**If missing:**
```bash
# Reinstall
/statusline install
```

#### ✅ Verify Command Path

```bash
# Check if command exists
cat ~/.claude/settings.json | grep command

# Test the command manually
bun ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts < /dev/null
```

**If path is wrong:**
```bash
# Reset and reinstall
/statusline reset
/statusline install
```

#### ✅ Check Runtime

```bash
# Which runtime is configured?
cat ~/.claude/settings.json | grep -E '(bun|node)'

# Verify runtime available
bun --version
# OR
node --version
```

**If runtime not found:**
- Install Bun: `curl -fsSL https://bun.sh/install | bash`
- Or use Node.js: See [INSTALLATION.md](INSTALLATION.md)

#### ✅ Restart Claude Code

Sometimes needed after configuration changes:
1. Close Claude Code completely
2. Reopen Claude Code

---

## Configuration Errors

### Issue: "Invalid JSON in configuration file"

#### ✅ Validate JSON

```bash
# Check JSON syntax
cat ~/.claude/statusline.config.json

# Use JSON validator
python3 -m json.tool ~/.claude/statusline.config.json
```

**If invalid:**
```bash
# Reset to defaults
/statusline reset
```

#### ✅ Check for Typos

Common mistakes:
- Missing commas
- Trailing commas
- Unquoted keys
- Single quotes instead of double quotes

**Bad:**
```json
{
  "git": {
    "enabled": true,  // ← Trailing comma
  }
}
```

**Good:**
```json
{
  "git": {
    "enabled": true
  }
}
```

### Issue: "Configuration not applied"

#### ✅ Verify File Location

```bash
# Check config exists
ls -la ~/.claude/statusline.config.json

# Should exist and be readable
```

**If missing:**
```bash
# Recreate from defaults
cp plugins/statusline/scripts/statusline/data/defaults.json ~/.claude/statusline.config.json
```

#### ✅ Check File Permissions

```bash
# Check permissions
ls -la ~/.claude/statusline.config.json

# Should be readable
# -rw-r--r-- 1 user group ...
```

**If permissions wrong:**
```bash
# Fix permissions
chmod 644 ~/.claude/statusline.config.json
```

---

## Git Status Issues

### Issue: Git branch not showing

#### ✅ Check Git Installed

```bash
git --version

# Should output: git version 2.x.x
```

**If not found:**
- Windows: Install from https://git-scm.com/download/win
- macOS: `xcode-select --install`
- Linux: `sudo apt-get install git` (or equivalent)

#### ✅ Check Git Repository

```bash
# Verify in git repo
git status

# Should show:
# On branch main
# ...
```

**If not a git repo:**
```bash
# Initialize git
git init

# Or disable git in statusline
# Edit ~/.claude/statusline.config.json:
{
  "git": {
    "enabled": false
  }
}
```

#### ✅ Check Git in PATH

```bash
# Find git executable
which git

# Should output: /usr/bin/git or similar
```

**If not in PATH:**
- Add git to system PATH
- Or specify full path in config

### Issue: Git changes not showing (+/-/~)

#### ✅ Verify Dirty Indicator

```json
{
  "git": {
    "enabled": true,
    "showDirtyIndicator": true,
    "showChanges": false  // ← Set to true for actual counts
  }
}
```

#### ✅ Make Changes

```bash
# Create a test change
echo "test" > test.txt

# Check git status
git status

# Should show:
# modified:   test.txt
```

#### ✅ Check Git Permissions

```bash
# Can statusline access .git?
ls -la .git/

# Should be readable
```

---

## Context Calculation Problems

### Issue: Context percentage wrong

#### ✅ Check Context Settings

```bash
# View context config
cat ~/.claude/statusline.config.json | grep -A 10 '"context"'
```

**Expected:**
```json
{
  "context": {
    "usePayloadContextWindow": true,
    "maxContextTokens": 200000,
    "useUsableContextOnly": true
  }
}
```

#### ✅ Verify Token Calculations

Context calculation:
```
Usable Context = maxContextTokens - autocompactBufferTokens - overheadTokens
Percentage = (tokensUsed / Usable Context) × 100
```

**Example:**
```json
{
  "context": {
    "maxContextTokens": 200000,
    "autocompactBufferTokens": 45000,
    "overheadTokens": 0
  }
}
```
Usable = 200000 - 45000 - 0 = 155000 tokens

If you've used 77500 tokens, percentage = 77500 / 155000 = 50%

#### ✅ Adjust for Your Model

**Claude Sonnet (default):**
```json
{
  "context": {
    "maxContextTokens": 200000
  }
}
```

**Claude Opus:**
```json
{
  "context": {
    "maxContextTokens": 200000
  }
}
```

**Claude Haiku:**
```json
{
  "context": {
    "maxContextTokens": 200000
  }
}
```

### Issue: "Context exceeds 100%"

#### ✅ Reduce Overhead

```json
{
  "context": {
    "autocompactBufferTokens": 60000,  // Increase buffer
    "overheadTokens": 10000            // Add overhead
  }
}
```

#### ✅ Disable Usable Context Only

```json
{
  "context": {
    "useUsableContextOnly": false  // Use full context window
  }
}
```

---

## Usage Limits Not Working

### Issue: Usage limits not showing

#### ✅ Check Feature Enabled

```json
{
  "features": {
    "usageLimits": true  // ← Must be true
  },
  "limits": {
    "enabled": true  // ← Must be true
  }
}
```

#### ✅ Verify Feature Files Exist

```bash
# Check if limits module exists
ls -la plugins/statusline/scripts/statusline/src/lib/features/limits.js

# Should exist
```

**If missing:**
```bash
# Feature was deleted - reinstall plugin
/plugin install statusline@smite --force
```

#### ✅ Check API Response

Usage limits come from Claude API. Check if API is returning them:

```bash
# View last payload
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/last_payload.txt | grep -i limit
```

**If not in payload:**
- Usage limits may not be available for your account
- Contact Claude support

### Issue: "Incorrect limit values"

#### ✅ Verify Time Remaining

Limits reset periodically:
- 5-hour limit: Resets every 5 hours
- 7-day limit: Resets every 7 days

Check your reset time in last_payload.txt.

#### ✅ Check Pacing Calculation

Pacing = (Expected Usage) - (Actual Usage)

If pacing is positive: You're under budget ✅
If pacing is negative: You're over budget ⚠️

---

## Spend Tracking Issues

### Issue: Daily spend not showing

#### ✅ Check Feature Enabled

```json
{
  "features": {
    "spendTracking": true  // ← Must be true
  },
  "dailySpend": {
    "cost": {
      "enabled": true  // ← Must be true
    }
  }
}
```

#### ✅ Verify Spend Module

```bash
# Check if spend module exists
ls -la plugins/statusline/scripts/statusline/src/lib/features/spend.js

# Should exist
```

**If missing:**
```bash
# Reinstall plugin
/plugin install statusline@smite --force
```

#### ✅ Check Data Files

```bash
# View spend data
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/sessions.json

# Should contain session data with costs
```

**If missing or empty:**
- Spend tracking needs time to accumulate data
- Check after a few sessions

### Issue: "Wrong spend amounts"

#### ✅ Verify Cost Format

```json
{
  "dailySpend": {
    "cost": {
      "enabled": true,
      "format": "decimal1"  // "decimal1" = $1.23, "decimal2" = $1.234
    }
  }
}
```

#### ✅ Check API Pricing

Spend is calculated from API usage. Verify:
- Input tokens: $3 / 1M tokens
- Output tokens: $15 / 1M tokens

Check Claude pricing for current rates.

---

## Performance Problems

### Issue: Statusline slow to update

#### ✅ Reduce Progress Bar Length

```json
{
  "session": {
    "percentage": {
      "progressBar": {
        "length": 5  // Reduce from 10
      }
    }
  }
}
```

#### ✅ Disable Expensive Features

```json
{
  "git": {
    "enabled": true,
    "showChanges": false  // Disable change counting
  },
  "session": {
    "tokens": {
      "showDecimals": false  // Faster calculation
    }
  }
}
```

#### ✅ Use Simple Progress Bar Style

```json
{
  "progressBar": {
    "style": "blocks"  // Faster than "braille"
  }
}
```

### Issue: High CPU usage

#### ✅ Check Git Status Frequency

If git commands are slow:
```bash
# Time git status
time git status

# If > 100ms, consider disabling git
{
  "git": {
    "enabled": false
  }
}
```

#### ✅ Reduce Features

```json
{
  "features": {
    "usageLimits": false,   // Disable if not needed
    "spendTracking": false  // Disable if not needed
  }
}
```

---

## Platform-Specific Issues

### Windows

#### Issue: "Command not found"

**Problem:** Path separators or executable not found.

**Solution:**
```bash
# Verify Windows paths in settings.json
{
  "statusLine": {
    "command": "bun C:\\Users\\YourName\\.claude\\plugins\\cache\\smite\\statusline\\1.0.0\\scripts\\statusline\\src\\index.ts"
  }
}
```

#### Issue: Git not working in PowerShell

**Solution:**
```bash
# Install Git for Windows
# https://git-scm.com/download/win

# Or use WSL
wsl
```

### macOS

#### Issue: "Permission denied"

**Solution:**
```bash
# Fix permissions
chmod +x ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts

# Or reinstall
/statusline reset
/statusline install
```

#### Issue: Git not installed

**Solution:**
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

### Linux

#### Issue: "Node.js not found"

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# Fedora/RHEL
sudo dnf install nodejs npm

# Arch Linux
sudo pacman -S nodejs npm
```

#### Issue: "Cannot execute binary"

**Solution:**
```bash
# Check file is executable
ls -la ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts

# Make executable
chmod +x ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts
```

---

## Debug Mode

### Enable Verbose Logging

#### Installation Debug

```bash
/statusline install --verbose
```

Shows:
- Platform detection
- File paths
- Configuration details

#### Runtime Debug

```bash
# Check last payload
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/last_payload.txt

# Check logs
cat ~/.claude/logs/statusline-install.log
```

### Manual Testing

```bash
# Test statusline manually
echo '{}' | bun ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts

# Should output statusline
```

---

## Log Files

### Installation Log

**Location:** `~/.claude/logs/statusline-install.log`

**Contents:**
```
[2025-01-13T12:34:56.789Z] Installation started
[2025-01-13T12:34:56.890Z] Platform: windows (bun)
[2025-01-13T12:34:56.990Z] Settings read successfully
[2025-01-13T12:34:57.090Z] Settings written successfully
[2025-01-13T12:34:57.190Z] Config file created
[2025-01-13T12:34:57.290Z] Installation completed successfully
```

### Last Payload

**Location:** `~/.claude/plugins/cache/smite/statusline/1.0.0/data/last_payload.txt`

**Purpose:** Debug what data Claude Code is sending to statusline.

**View:**
```bash
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/last_payload.txt
```

### Sessions Data

**Location:** `~/.claude/plugins/cache/smite/statusline/1.0.0/data/sessions.json`

**Purpose:** Track sessions for spend tracking.

**View:**
```bash
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/sessions.json
```

---

## Getting Help

### Collect Diagnostic Info

```bash
# 1. Plugin info
/plugin list

# 2. Configuration
/statusline config

# 3. Installation log
cat ~/.claude/logs/statusline-install.log

# 4. Last payload
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/last_payload.txt

# 5. Platform info
uname -a  # Linux/macOS
systeminfo  # Windows
```

### Common Solutions Summary

| Issue | Solution |
|-------|----------|
| No statusline | `/statusline install` and restart |
| Git not working | Install git or disable in config |
| Wrong percentage | Adjust `context.maxContextTokens` |
| Limits not showing | Enable `features.usageLimits` |
| Spend not tracking | Enable `features.spendTracking` |
| Slow updates | Reduce `progressBar.length` |

### Reset Everything

```bash
# Complete reset
/statusline reset
/plugin remove statusline
/plugin install statusline@smite
```

---

## Still Having Issues?

1. Check [README.md](README.md) for basics
2. Review [CONFIGURATION.md](CONFIGURATION.md) for options
3. Study [ARCHITECTURE.md](docs/statusline/ARCHITECTURE.md) for internals
4. Search existing issues
5. Report with diagnostic info

---

**Version:** 1.0.0
**Last Updated:** 2025-01-13
