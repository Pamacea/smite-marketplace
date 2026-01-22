---
name: shell
description: Cross-platform shell aliases for Claude Code (cc and ccc)
version: 3.1.0
---

# Shell Skill

## Mission

Cross-platform shell aliases for Claude Code - `cc` for normal mode and `ccc` for bypass-permissions mode.

## Core Workflow

1. **Input**: User runs `/install-aliases` command
2. **Process**:
   - Detect shell (PowerShell, Bash, Zsh, cmd.exe)
   - Create backup of shell profile
   - Append alias definitions to profile
   - Verify installation
3. **Output**: Global aliases installed and ready after shell reload

## Key Principles

- **Cross-platform**: Windows (PowerShell/CMD), macOS (Bash/Zsh), Linux (Bash/Zsh)
- **One-time installation**: Run once, works forever
- **Idempotent**: Safe to re-run without errors
- **Safe backup**: Creates backup before modifying profiles
- **Global availability**: Works from any directory/project

## Aliases

### `cc` (Normal Mode)
- **Behavior**: `claude` - asks for permission on edits
- **Use case**: Development, code review, cautious workflows
- **PowerShell**: `function cc { claude $args }`
- **Bash/Zsh**: `alias cc='claude'`

### `ccc` (Bypass Mode)
- **Behavior**: `claude --bypass-permissions` - auto-accepts all edits
- **Use case**: Boilerplate generation, bulk edits, trusted workflows
- **PowerShell**: `function ccc { claude --bypass-permissions $args }`
- **Bash/Zsh**: `alias ccc='claude --bypass-permissions'`

## Integration

- **Installation command**: `/install-aliases` in smite project
- **Shell reload required**: `. $PROFILE` (PowerShell), `source ~/.bashrc` (Bash), `source ~/.zshrc` (Zsh)
- **Files modified**: `$PROFILE` (Windows), `~/.bashrc` or `~/.zshrc` (macOS/Linux)
- **Backups created**: `$PROFILE.backup`, `~/.bashrc.backup`, `~/.zshrc.backup`

## Configuration

- **PowerShell execution policy**: May require `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **cmd.exe**: Works immediately with .bat files (no reload needed)
- **Shell detection**: Automatic based on available commands

## Error Handling

- **Permission denied**: Suggest checking shell permissions
- **Execution policy error**: Guide to set RemoteSigned policy
- **Alias not working**: Verify installation with grep/Get-Content
- **Corrupted profile**: Restore from backup

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*

**Note:** Previously named `shell-aliases`, now `shell`
