# Statusline Plugin

Lightweight session statusline display for Claude Code.

## Overview

Display a compact statusline showing your current session information:

```
main • +14 -4036  • ~/plugins/statusline • Glm 4.7 • $0.0 • 0 • ████████░░ • 0% • (42m)
```

## Components

| Component | Description | Example |
|-----------|-------------|---------|
| **branch** | Git branch name | `main`, `feature-branch` |
| **changes** | Git changes (additions/deletions) | `+14 -4036`, `+42` |
| **path** | Abbreviated project path | `~/plugins/statusline` |
| **model** | AI model name | `Opus 4.5`, `Sonnet 4.5`, `Glm 4.7` |
| **cost** | Estimated session cost | `$0.0` |
| **tokens** | Total tokens used | `0`, `45K` |
| **progress** | Visual progress bar | `████████░░` |
| **percentage** | Context window used | `0%`, `78%` |
| **duration** | Session duration | `42m`, `1h 23m` |

## Features

- **Bun Runtime**: Uses Bun for fast execution
- **Modular Architecture**: Separate modules for git, formatters, rendering
- **Real-time Updates**: Updates after each tool use via PostToolUse hook
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Graceful Degradation**: Shows N/A for missing data

## Installation

This plugin requires **Bun** runtime.

### Prerequisites

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
```

### Setup

```bash
# Install dependencies
cd plugins/statusline
bun install
```

## Usage

### Display Status

```bash
/statusline
```

### Output Examples

**Active development session:**
```
main • +14 -4036  • ~/plugins/statusline • Glm 4.7 • $0.0 • 0 • ████████░░ • 0% • (42m)
```

**New session with no changes:**
```
main  • ~/Projects/myapp • Sonnet 4.5 • $0.05 • 3K • █░░░░░░░░░░ • 12% • (2m)
```

## Configuration

Edit `statusline.config.json` to customize the display:

```json
{
  "oneLine": true,
  "showSonnetModel": false,
  "pathDisplayMode": "truncated",
  "git": {
    "enabled": true,
    "showBranch": true,
    "showDirtyIndicator": true,
    "showChanges": true
  },
  "session": {
    "cost": { "enabled": true, "format": "decimal1" },
    "tokens": { "enabled": true, "showMax": false, "showDecimals": false },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": {
        "enabled": true,
        "length": 10,
        "style": "filled",
        "color": "progressive",
        "background": "none"
      }
    }
  }
}
```

### Progress Bar Styles

- `filled`: Uses `█` and `░` characters
- `rectangle`: Uses `▰` and `▱` characters
- `braille`: Uses Braille patterns for finer resolution

### Color Modes

- `progressive`: Changes color based on percentage (gray → yellow → orange → red)
- `green`, `yellow`, `red`, `peach`, `black`, `white`: Fixed colors

## Cost Calculation

Cost is estimated based on model pricing (per million tokens):

| Model | Input | Output |
|-------|-------|--------|
| Opus 4.5 | $15 | $75 |
| Sonnet 4.5 | $3 | $15 |
| Haiku 4.5 | $1 | $5 |
| Glm | $0.50 | $1 |

## Architecture

Based on [AIBlueprint](https://github.com/Melvynx/aiblueprint) statusline with session file reading adapter for Claude Code hooks.

```
src/
├── index.ts           # Main entry point with session adapter
├── lib/
│   ├── config.ts      # Configuration loader
│   ├── config-types.ts# Type definitions
│   ├── context.ts     # Token/context calculation
│   ├── formatters.ts  # All formatting functions
│   ├── git.ts         # Git status (Bun shell)
│   ├── render-pure.ts # Pure rendering logic
│   ├── types.ts       # Hook input types
│   ├── utils.ts       # Utilities
│   └── features/      # Optional premium features
│       ├── limits.ts  # Usage limits (stub)
│       └── spend.ts   # Cost tracking (stub)
```

## Requirements

- **Bun** runtime
- Git (for branch/changes info)
- Claude Code session directory (`~/.claude/sessions/`)

## License

MIT License - see [SMITE repository](https://github.com/Pamacea/smite) for details.

## Version

2.0.0 - Adapted from AIBlueprint
