---
name: install-aliases
description: ONE-TIME installation command for Claude Code global shell aliases. Run ONCE per machine to install cc (normal mode) and ccc (bypass-permissions mode) aliases across PowerShell, Bash, Zsh, and cmd.exe. Cross-platform with automatic shell detection, backup creation, and verification. Specific phrases: 'install aliases', 'setup cc command', 'global claude aliases'. (user)
version: 3.1.0
---

## Mission

Cross-platform shell aliases for Claude Code - `cc` for normal mode and `ccc` for bypass-permissions mode.

---

## When to Use

- **First-time setup**: Run once when installing Claude Code
- **New machine**: Run on each new development machine
- **Alias missing**: Run if cc/ccc commands don't work
- **Shell change**: Re-run after switching shells

### Examples
```bash
# Installation command
/install-aliases

# After installation
cc "build my feature"          # Normal mode (asks permission)
ccc "generate boilerplate"     # Bypass mode (auto-accepts)
```

---

## When NOT to Use

- ❌ **Every session** (one-time installation only)
- ❌ **When aliases already work** (idempotent but unnecessary)
- ❌ **In CI/CD** (use full claude command instead)
- ❌ **For temporary usage** (use full claude command)

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

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Running every session | Unnecessary overhead | One-time installation only |
| Not reloading shell | Aliases don't work | Run reload command after install |
| Using wrong shell | Aliases not found | System detects shell automatically |
| Skipping backup | Can't revert if needed | Automatic backup created |
| Using ccc for everything | Bypasses safety net | Use cc for normal work, ccc only for trusted bulk operations |
| Ignoring execution policy | Fails on PowerShell | Check/Set RemoteSigned policy if needed |

## Integration

- **Installation command**: `/install-aliases` in smite project
- **Shell reload required**: `. $PROFILE` (PowerShell), `source ~/.bashrc` (Bash), `source ~/.zshrc` (Zsh)
- **Files modified**: `$PROFILE` (Windows), `~/.bashrc` or `~/.zshrc` (macOS/Linux)
- **Backups created**: `$PROFILE.backup`, `~/.bashrc.backup`, `~/.zshrc.backup`

---

*Auto-generated from plugin.json - Last sync: 2025-01-22*

**Note:** Previously named `shell-aliases`, now `shell`
