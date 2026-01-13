---
description: Statusline commands for installation, configuration, and management
argument-hint: [install|config|reset|help] [--dry-run|--verbose|--help]
---

# /statusline

Auto-configuring statusline plugin for Claude Code. Provides real-time display of git status, session information, context usage, and more.

## Overview

The statusline plugin enhances your Claude Code experience with a rich, customizable status bar that displays:
- Git branch information and changes
- Session cost and duration
- Context tokens and usage percentage
- Project information
- Usage limits (when available)

## Usage

```bash
# Manually trigger installation (if auto-install failed)
/statusline install

# View current configuration
/statusline config

# Reset to defaults
/statusline reset

# Show this help message
/statusline help
```

## Commands

### `/statusline install`

Manually trigger the statusline installation and configuration process.

**Purpose**: Use this if the automatic installation during plugin install failed, or when you want to reconfigure the statusline manually.

**Options**:
- `--dry-run` - Preview what changes would be made without actually modifying files
- `--verbose` - Show detailed installation steps and debugging information

**Examples**:
```bash
# Basic installation
/statusline install

# Preview installation without making changes
/statusline install --dry-run

# Install with detailed output
/statusline install --verbose
```

**Output**:
```
[INFO] Detecting platform...
[SUCCESS] Detected windows with node
[INFO] Configuring statusline...
[SUCCESS] Installation completed in 2.34s
Statusline is now configured!
Restart Claude Code to see the statusline.
```

**Error Scenarios**:
- ❌ `ERROR: Plugin not found` - The statusline plugin is not installed
  - Solution: Run `/plugin install statusline@smite` first
- ❌ `ERROR: Could not access settings.json` - Permissions issue
  - Solution: Check file permissions or run as administrator
- ❌ `ERROR: Backup failed` - Unable to create backup
  - Solution: Check disk space or permissions

### `/statusline config`

Display the current statusline configuration and settings.

**Purpose**: View what configuration is currently active and check if everything is properly set up.

**Output**:
```
📊 Statusline Configuration
─────────────────────────────────────────
Statusline Type: command
Command: bun /Users/username/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts
Padding: 0

📁 Config File: /Users/username/.claude/statusline.config.json
✅ Config file exists
🔧 Features enabled:
  • Git status: enabled
  • Session info: enabled
  • Context usage: enabled
  • Usage limits: disabled
```

**Error Scenarios**:
- ❌ `WARNING: Config file not found` - Configuration file missing
  - Solution: Run `/statusline reset` to recreate defaults
- ❌ `ERROR: Invalid config format` - Configuration corrupted
  - Solution: Run `/statusline reset` to restore defaults

### `/statusline reset`

Reset the statusline configuration to default values.

**Purpose**: Restore the statusline to its default configuration. This is useful when:
- Configuration is corrupted
- You want to start fresh
- Migrating from a different version

**Options**:
- `--dry-run` - Preview what would be reset

**Examples**:
```bash
# Reset to defaults
/statusline reset

# Preview reset without making changes
/statusline reset --dry-run
```

**What gets reset**:
- Removes custom statusline configuration from settings.json
- Recreates default configuration file
- Preserves your existing settings.json backup

**Error Scenarios**:
- ❌ `ERROR: Could not restore backup` - Backup not found
  - Solution: Manual configuration may be needed
- ❌ `ERROR: Write permissions denied` - Cannot write to settings
  - Solution: Check file permissions

### `/statusline help`

Show this help message with command documentation.

**Purpose**: Quick reference for all available commands and their options.

**Usage**:
```bash
/statusline help
```

## Options

### Global Options

All commands support these global options:

- `--dry-run` - Preview changes without actually modifying files or settings
- `--verbose` - Enable verbose output for debugging and detailed information
- `--help, -h` - Show help message

### Command-Specific Options

- `/statusline install` - Supports `--dry-run` and `--verbose`
- `/statusline config` - No additional options
- `/statusline reset` - Supports `--dry-run`
- `/statusline help` - No additional options

## Features

### Displayed Information

| Feature | Description | Example |
|---------|-------------|---------|
| **Git Status** | Current branch with change indicators | `main +2 -1 ~3` |
| **Session Info** | Model name and session details | `Sonnet 4.5 • $0.15 • 5m23s` |
| **Context Usage** | Tokens used and percentage with progress bar | `45.2K/200K ⣿⣿⣧⣀⣀⣀⣀⣀⣀⣀ 23%` |
| **Project Info** | Repository name and directory path | `smite-marketplace /projects/smite` |

### Visual Example

```
main • Sonnet 4.5 • $0.15 • 5m23s • 45.2K/200K ⣿⣿⣧⣀⣀⣀⣀⣀⣀⣀ 23%
smite-marketplace • /Users/username/Projects/smite-marketplace
```

## Configuration

### Automatic Installation (Recommended)

The statusline plugin automatically configures itself when installed via the marketplace:

```bash
/plugin install statusline@smite
```

This will:
1. Auto-detect your platform (Windows/macOS/Linux)
2. Set up the correct runtime (Bun/Node.js)
3. Configure your settings.json
4. Create default configuration
5. Provide a rollback if installation fails

### Manual Configuration

If automatic installation fails, or if you need to reconfigure:

```bash
/statusline install
```

### Configuration Files

The plugin uses two configuration files:

1. **`~/.claude/settings.json`** - Claude Code configuration
   - Added by: `statusLine` section
   - Managed by: Install script

2. **`~/.claude/statusline.config.json`** - Statusline preferences
   - Contains: Feature toggles, formatting options
   - Created by: Install script
   - Editable: Yes, for customization

## Examples

### Installation Examples

```bash
# Basic installation
/statusline install

# Preview installation without changes
/statusline install --dry-run

# Debug installation issues
/statusline install --verbose

# Check current status
/statusline config

# Reset to defaults if configuration is broken
/statusline reset
```

### Troubleshooting Examples

```bash
# Check if plugin is installed
/plugin list | grep statusline

# Verify installation
/statusline config

# Clean reinstall
/statusline reset
/statusline install
```

## Error Handling

### Common Issues

1. **Statusline Not Visible**
   - Cause: Plugin not installed or configuration incomplete
   - Solution: Run `/statusline install`

2. **Invalid JSON in Settings**
   - Cause: Corrupted settings.json
   - Solution: Run `/statusline reset` (uses backup)

3. **Permission Denied**
   - Cause: Insufficient permissions to write to config files
   - Solution: Run as administrator or check file permissions

4. **Command Not Found**
   - Cause: Bun/Node.js not available or incorrect path
   - Solution: Verify runtime installation and paths

### Safety Features

- **Automatic Backups**: Always creates `.backup` before modifying settings
- **Dry Run Mode**: Preview changes before applying
- **Rollback Support**: Restores backup if installation fails
- **Validation**: Checks JSON syntax before writing
- **Atomic Writes**: Uses temporary files + rename to prevent corruption

## Related Documentation

- [Plugin Installation Guide](../../README.md#installation)
- [Configuration Options](../../scripts/statusline/README.md)
- [Troubleshooting Guide](../../docs/TROUBLESHOOTING.md)
- [Statusline Customization](../../docs/CUSTOMIZATION.md)

## Support

If you encounter issues with the statusline plugin:

1. Check `/statusline config` for configuration issues
2. Try `/statusline reset` to restore defaults
3. Run `/statusline install --verbose` for detailed logs
4. Check the error log at `~/.claude/logs/statusline-install.log`

For additional support:
- GitHub Issues: [smite-marketplace/issues](https://github.com/Pamacea/smite-marketplace/issues)
- Community: [SMITE Discord](https://discord.gg/smite)
