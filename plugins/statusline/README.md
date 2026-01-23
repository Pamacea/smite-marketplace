# Statusline Plugin

Lightweight session statusline display for Claude Code.

## Overview

Display a compact statusline showing your current session information:

```
main • +123/-45  • ~/Projects/smite • Opus 4.5 • $1.23 • 45K • ████████░░ • 78% • 1h 23m
```

## Components

| Component | Description | Example |
|-----------|-------------|---------|
| **branch** | Git branch name | `main`, `feature-branch` |
| **insertions** | Git changes (additions/deletions) | `+123/-45`, `+42` |
| **path** | Abbreviated project path | `~/Projects/smite` |
| **model** | AI model name | `Opus 4.5`, `Sonnet 4.5` |
| **cost** | Estimated session cost | `$1.23` |
| **tokens** | Total tokens used | `45K`, `123` |
| **progress** | Visual progress bar | `████████░░` |
| **percentage** | Context window used | `78%` |
| **duration** | Session duration | `1h 23m`, `15m` |

## Installation

```bash
# Install via plugin system
/plugin install statusline
```

## Usage

### Display Status

```bash
/statusline
```

### Output Examples

**Active development session:**
```
main • +123/-45  • ~/Projects/smite • Opus 4.5 • $1.23 • 45K • ████████░░ • 78% • 1h 23m
```

**New session with no changes:**
```
main  • ~/Projects/myapp • Sonnet 4.5 • $0.05 • 3K • █░░░░░░░░░ • 12% • 2m
```

**Non-git project:**
```
N/A  • ~/temp/script • Haiku 4.5 • $0.01 • 1K • ░░░░░░░░░░ • 5% • 1m
```

## Features

- **Lightweight**: No external dependencies, uses Node.js built-ins
- **Fast**: Executes in < 100ms
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Graceful degradation**: Shows "N/A" for missing data
- **Smart path abbreviation**: Long paths are shortened intelligently

## Configuration

### Auto-display (Optional)

The plugin includes an optional hook to auto-display status after tool use. Edit `plugins/statusline/.claude-plugin/plugin.json`:

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Edit|Write|Bash",
      "hooks": [
        {
          "type": "command",
          "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/statusline.js post-tool",
          "enabled": true
        }
      ]
    }
  ]
}
```

Set `"enabled": true` to activate auto-display.

## Cost Calculation

Cost is estimated based on model pricing (per million tokens):

| Model | Input | Output |
|-------|-------|--------|
| Opus 4.5 | $15 | $75 |
| Sonnet 4.5 | $3 | $15 |
| Haiku 4.5 | $1 | $5 |

*Note: These are approximate prices and may vary by region.*

## Requirements

- Node.js (for hook script)
- Git (for branch/changes info)
- Claude Code session directory (`~/.claude/sessions/`)

## Troubleshooting

**"N/A" for branch**: Not in a git repository

**Empty cost/tokens**: No API calls in current session yet

**Incorrect model**: Session data format may vary, defaults to entry model field

**Path not abbreviated**: Path is short enough to display fully

## License

MIT License - see [SMITE repository](https://github.com/Pamacea/smite) for details.

## Version

1.0.0
