# Installation Guide

Complete installation instructions for the SMITE Statusline plugin.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Automatic Installation](#automatic-installation)
3. [Manual Installation](#manual-installation)
4. [Verification](#verification)
5. [Platform-Specific Notes](#platform-specific-notes)
6. [Troubleshooting](#troubleshooting-installation)

---

## Quick Start

```bash
/plugin install statusline@smite
```

That's it! The plugin will configure itself automatically. Restart Claude Code to see the statusline.

---

## Automatic Installation

### Prerequisites

- Claude Code installed
- Git installed (for git status features)
- Bun or Node.js installed

### Step 1: Install Plugin

```bash
/plugin install statusline@smite
```

### Step 2: Automatic Configuration

The plugin will automatically:

1. **Detect Platform**
   - OS (Windows, macOS, Linux)
   - Runtime (Bun, Node.js)
   - Home directory

2. **Backup Settings**
   - Creates `~/.claude/settings.json.backup`
   - Preserves existing configuration

3. **Configure Claude Code**
   - Adds `statusLine` entry to `settings.json`
   - Sets up command path

4. **Create Config File**
   - Creates `~/.claude/statusline.config.json`
   - Copies default configuration

### Step 3: Restart Claude Code

Close and reopen Claude Code. The statusline will appear at the bottom.

---

## Manual Installation

Use manual installation if automatic installation fails or you need custom setup.

### Prerequisites

Choose your runtime:

**Option A: Bun (Recommended)**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

**Option B: Node.js + tsx**
```bash
# Install Node.js from nodejs.org
npm install -g tsx
```

**Option C: Node.js (Compiled)**
```bash
# Install Node.js from nodejs.org
# No extra tools needed
```

### Step 1: Download Plugin

```bash
# From Claude Code
/plugin download statusline@smite

# Or manually clone to plugins/statusline/
```

### Step 2: Run Installation Script

**With Bun:**
```bash
bun plugins/statusline/scripts/install.ts
```

**With Node.js + tsx:**
```bash
npx tsx plugins/statusline/scripts/install.ts
```

**With Node.js (Compiled):**
```bash
node plugins/statusline/scripts/dist/install.js
```

### Step 3: Verify Installation

```bash
# Check settings.json
cat ~/.claude/settings.json

# Should contain:
{
  "statusLine": {
    "type": "command",
    "command": "bun /path/to/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts",
    "padding": 0
  }
}
```

### Step 4: Restart Claude Code

Close and reopen Claude Code.

---

## Verification

### 1. Check Plugin List

```bash
/plugin list
```

Should show `statusline` as installed.

### 2. Check Configuration

```bash
/statusline config
```

Displays current configuration.

### 3. Check Logs

```bash
cat ~/.claude/logs/statusline-install.log
```

Look for:
```
[SUCCESS] Detected windows with bun
[SUCCESS] Settings configured successfully
[SUCCESS] Created config file: ~/.claude/statusline.config.json
```

### 4. Test Statusline

Start a conversation. The statusline should appear:

```
main • $0.12 • 12.3K • [██░░░░░░░] 20% • 2m30s
```

---

## Platform-Specific Notes

### Windows

**Git Installation:**
- Install Git for Windows from https://git-scm.com/download/win
- Or use WSL (Windows Subsystem for Linux)

**Path Issues:**
If statusline doesn't appear, check `settings.json` command path uses Windows separators:
```json
{
  "statusLine": {
    "command": "bun C:\\Users\\YourName\\.claude\\plugins\\cache\\smite\\statusline\\1.0.0\\scripts\\statusline\\src\\index.ts"
  }
}
```

**PowerShell vs CMD:**
Installation works in both PowerShell and Command Prompt.

### macOS

**Git Installation:**
```bash
# Install via Xcode Command Line Tools
xcode-select --install

# Or via Homebrew
brew install git
```

**Permissions:**
No special permissions needed. Files are in user directory (`~/.claude/`).

**Bun Installation:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### Linux

**Git Installation:**
```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora/RHEL
sudo dnf install git

# Arch Linux
sudo pacman -S git
```

**Bun Installation:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Node.js Installation:**
```bash
# Ubuntu/Debian
sudo apt-get install nodejs npm

# Fedora/RHEL
sudo dnf install nodejs npm
```

---

## Troubleshooting Installation

### Issue: "Plugin not found"

**Solution:**
```bash
# Verify plugin exists
ls plugins/statusline/

# Reinstall
/plugin install statusline@smite --force
```

### Issue: "Command failed: bun not found"

**Solution:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Or use Node.js
node plugins/statusline/scripts/dist/install.js
```

### Issue: "settings.json already has statusLine"

**Solution:**
```bash
# Reset configuration
/statusline reset

# Or manually edit
nano ~/.claude/settings.json
```

### Issue: "Permission denied"

**Solution:**
```bash
# Check permissions
ls -la ~/.claude/

# Fix ownership
chown -R $USER ~/.claude/

# Fix permissions
chmod -R 755 ~/.claude/
```

### Issue: "Git status not working"

**Solution:**
```bash
# Verify git installed
git --version

# Check git in PATH
which git

# Reinstall git if needed
# Windows: https://git-scm.com/download/win
# macOS: xcode-select --install
# Linux: sudo apt-get install git
```

### Issue: "Statusline shows errors"

**Solution:**
```bash
# Check logs
cat ~/.claude/logs/statusline-install.log

# Enable debug mode
/statusline install --verbose

# Check last payload
cat ~/.claude/plugins/cache/smite/statusline/1.0.0/data/last_payload.txt
```

### Issue: "Can't find configuration file"

**Solution:**
```bash
# Recreate config
cp plugins/statusline/scripts/statusline/data/defaults.json ~/.claude/statusline.config.json

# Or reset
/statusline reset
```

### Issue: "Installation partially failed"

**Solution:**
```bash
# Rollback from backup
cp ~/.claude/settings.json.backup ~/.claude/settings.json

# Try clean install
/statusline reset
/plugin install statusline@smite
```

---

## Dry Run Installation

Preview what will change without modifying files:

```bash
/statusline install --dry-run
```

Output:
```
[DRY RUN] Would write to ~/.claude/settings.json:
{
  "statusLine": {
    "type": "command",
    "command": "bun ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts",
    "padding": 0
  }
}

[DRY RUN] Would create ~/.claude/statusline.config.json from plugins/statusline/scripts/statusline/data/defaults.json

Dry run complete - no changes made
```

---

## Uninstallation

```bash
# Remove plugin
/plugin remove statusline

# Remove configuration
rm ~/.claude/statusline.config.json

# Remove statusLine from settings.json
nano ~/.claude/settings.json
# Delete the "statusLine" section

# Clean up cache
rm -rf ~/.claude/plugins/cache/smite/statusline
```

---

## Upgrading

```bash
# Upgrade plugin
/plugin upgrade statusline

# Reinstall configuration
/statusline install

# Your custom config in statusline.config.json is preserved
```

---

## Next Steps

After installation:

1. [Customize configuration](CONFIGURATION.md)
2. [Read feature documentation](README.md#features-in-detail)
3. [Troubleshoot issues](TROUBLESHOOTING.md)
4. [Understand architecture](docs/statusline/ARCHITECTURE.md)

---

**Need Help?**
- Quick help: `/statusline help`
- Full docs: [README.md](README.md)
- Troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
