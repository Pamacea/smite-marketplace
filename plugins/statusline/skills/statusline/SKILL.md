# Statusline Skill

## Mission

Auto-configuring statusline display for Claude Code sessions with git status, context tracking, session info, and usage metrics.

## Core Workflow

1. **Input**: Session start or update trigger
2. **Process**:
   - Detect OS and runtime (bun/node)
   - Read configuration from defaults and user settings
   - Gather status data (git, context, session, usage)
   - Render compact statusline output
3. **Output**: Formatted statusline string displayed in Claude Code UI

## Key Principles

- **Cross-platform**: Windows (PowerShell/CMD), macOS (zsh/bash), Linux (bash/zsh/fish)
- **Automatic setup**: PostPluginInstall hook configures settings.json
- **Graceful degradation**: Features work independently, no single point of failure
- **Performance**: < 100ms render time, < 50MB memory footprint
- **Safe installation**: Backup and rollback on failure

## Features

### Core Display
- **Git status**: Branch name, changed files, staged/unstaged counts
- **Session info**: Cost, duration, tokens used, percentage of budget
- **Context tracking**: Current token count vs maximum (200K default)
- **Path display**: Working directory (truncated mode)

### Optional Features
- **Usage limits**: 5-hour limit, weekly tracking
- **Spend tracking**: API cost monitoring
- **Custom metrics**: Extensible via user config

## Integration

- **Trigger**: PostPluginInstall hook runs installation script
- **Config**: Modifies `~/.claude/settings.json` with statusline command
- **Runtime**: Bun (preferred), Node.js (fallback)
- **Dependencies**: chalk, ora, cli-spinners

## Configuration

- **Default config**: `scripts/statusline/defaults.json`
- **User config**: `~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/statusline.config.json`
- **Settings file**: Override defaults while preserving schema
- **Install log**: `~/.claude/logs/statusline-install.log`

## Error Handling

- **Installation failure**: Automatic rollback from backup
- **Invalid config**: JSON validation prevents corruption
- **Missing features**: Graceful degradation, partial functionality
- **Runtime errors**: Comprehensive logging, user-friendly messages

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
