# @smite/essentials

Productivity utilities - auto-rename, shell aliases.

**Version:** 1.0.0 | **SMITE Version:** >=4.0.0

## Overview

SMITE Essentials provides productivity utilities that enhance your daily development workflow with intelligent session renaming and cross-platform shell aliases.

**Merged from:** `@smite/shell`, `@smite/auto-rename`

---

## Commands

### /rename

Automatic session renaming based on conversation context.

```bash
# Automatic renaming (triggered by smart hooks)
/rename

# Manual rename with custom name
/rename "Build OAuth2 authentication flow"
```

**Features:**
- **Smart triggers**: Renames at optimal moments (start, end, idle)
- **Context-aware**: Analyzes conversation to generate meaningful names
- **Slash filtering**: Removes commands from session names
- **Format consistency**: "Action: Context" pattern
- **Manual override**: Custom names when needed

**Configuration:** `.claude/.smite/essentials.json`

```json
{
  "autoRename": {
    "enabled": true,
    "triggers": ["user_prompt_start", "conversation_end"],
    "maxNameLength": 50,
    "format": "title-case",
    "filters": ["remove-emojis", "remove-special-chars", "truncate"]
  }
}
```

**See:** [commands/rename.md](./commands/rename.md)

---

### /install-aliases

Cross-platform shell aliases for Claude Code.

```bash
# Install aliases
/install-aliases

# Use aliases
cc "Hello, Claude!"      # Normal mode
ccc "Hello, Claude!"     # Bypass permissions mode
```

**Aliases:**
- `cc` - Normal mode (respects all hooks and permissions)
- `ccc` - Bypass-permissions mode (skips confirmation prompts)

**Platforms:**
- **PowerShell**: Functions added to `$PROFILE`
- **Bash**: Aliases added to `~/.bashrc`
- **Zsh**: Aliases added to `~/.zshrc`
- **cmd.exe**: Batch file at `%USERPROFILE%\cc.bat`

**Installation:**
- Automatic backup of existing config
- Safe installation with rollback option
- One-time setup, persistent across sessions

**See:** [commands/install-aliases.md](./commands/install-aliases.md)

---

## Installation

```bash
/plugin install essentials@smite
```

**Post-Installation:**

```bash
# Install shell aliases (optional but recommended)
/install-aliases
```

**Requirements:**
- SMITE v4.0.0 or higher
- @smite/core (installed automatically)
- Node.js 18.0.0 or higher

---

## Configuration

Configuration file: `.claude/.smite/essentials.json`

```json
{
  "version": "1.0.0",
  "autoRename": {
    "enabled": true,
    "triggers": [
      "user_prompt_start",
      "conversation_end"
    ],
    "maxNameLength": 50,
    "format": "title-case",
    "filters": [
      "remove-emojis",
      "remove-special-chars",
      "truncate"
    ],
    "patterns": {
      "feature": ["build", "create", "implement", "add"],
      "bugfix": ["fix", "debug", "resolve"],
      "refactor": ["refactor", "cleanup", "optimize"],
      "docs": ["document", "readme", "guide"]
    }
  },
  "shell": {
    "enabled": true,
    "aliases": {
      "cc": "claude",
      "ccc": "claude-code"
    },
    "installPaths": {
      "powershell": "$PROFILE",
      "bash": "~/.bashrc",
      "zsh": "~/.zshrc",
      "cmd": "%USERPROFILE%\\cc.bat"
    }
  }
}
```

---

## Features

### Auto-Rename

**Smart Triggers:**
- `user_prompt_start` - Rename when user starts a new prompt
- `conversation_end` - Rename when conversation ends
- Custom triggers supported

**Filters:**
- `remove-emojis` - Strip emojis from session name
- `remove-special-chars` - Clean up special characters
- `truncate` - Limit to maxNameLength

**Pattern Detection:**
- Automatically categorizes sessions (feature, bugfix, refactor, docs)
- Generates meaningful names from context
- Consistent "Action: Context" format

### Shell Aliases

**Cross-Platform:**
- Windows (PowerShell, cmd.exe)
- macOS (Bash, Zsh)
- Linux (Bash, Zsh)

**Safe Installation:**
- Automatic backup of existing configs
- Rollback option if something goes wrong
- No overwrite of existing aliases

**Persistent:**
- One-time installation
- Survives terminal restarts
- Works across all sessions

---

## Usage Examples

### Auto-Rename

```bash
# Automatic (no action needed)
User: "Build a user authentication system with JWT"
# Session automatically renamed to "Implement: User Authentication System"

# Manual override
/rename "Custom session name"
# Session renamed to "Custom Session Name"
```

### Shell Aliases

```bash
# Normal mode (respects all hooks)
cc "Help me debug this authentication issue"

# Bypass-permissions mode (skips confirmations)
ccc "Quick fix this bug"

# Both work exactly like typing the full command
```

---

## Migration from v3.x

**Coming from:** `@smite/shell`, `@smite/auto-rename`

### Command Mapping

| Old Command | New Command | Notes |
|-------------|-------------|-------|
| `/rename` | `/rename` | No changes |
| `/install-aliases` | `/install-aliases` | No changes |
| `cc` | `cc` | No changes |
| `ccc` | `ccc` | No changes |

### Configuration Migration

**Old (separate configs):**
```json
// .claude/.smite/shell.json
{
  "aliases": { "cc": "claude" }
}

// .claude/.smite/auto-rename.json
{
  "enabled": true,
  "maxNameLength": 50
}
```

**New (merged config):**
```json
// .claude/.smite/essentials.json
{
  "shell": {
    "aliases": { "cc": "claude" }
  },
  "autoRename": {
    "enabled": true,
    "maxNameLength": 50
  }
}
```

**See:** [Migration Guide](../MIGRATION_v3_to_v4.md)

---

## Skills

Essentials uses specialized skills:

- **[auto-rename](./skills/auto-rename/SKILL.md)** - Session renaming logic
- **[shell](./skills/shell/SKILL.md)** - Alias installation logic

---

## Hooks

Essentials includes hooks for automatic session renaming:

- **[auto-rename/hooks.json](./hooks/auto-rename/hooks.json)** - Hook configuration
- **[shell/install.ps1](./hooks/shell/install.ps1)** - PowerShell installation
- **[shell/install.sh](./hooks/shell/install.sh)** - Bash/Zsh installation

---

## Troubleshooting

### Auto-Rename Not Working

1. Check if enabled: `.claude/.smite/essentials.json` → `autoRename.enabled`
2. Verify triggers are set correctly
3. Check Claude Code hooks are enabled

### Aliases Not Found

1. Run `/install-aliases` again
2. Check shell config file for aliases
3. Restart terminal after installation
4. Verify correct shell (PowerShell vs cmd.exe)

### Session Names Too Long

1. Adjust `maxNameLength` in config
2. Enable `truncate` filter
3. Use manual `/rename` for custom names

---

## License

MIT

---

**Version:** 1.0.0 | **Last Updated:** 2026-02-08
