# Configuration Guide

Complete reference for configuring the SMITE Statusline plugin.

---

## Table of Contents

1. [Quick Configuration](#quick-configuration)
2. [Configuration File Location](#configuration-file-location)
3. [All Configuration Options](#all-configuration-options)
4. [Feature Toggles](#feature-toggles)
5. [Git Configuration](#git-configuration)
6. [Session Configuration](#session-configuration)
7. [Context Configuration](#context-configuration)
8. [Usage Limits Configuration](#usage-limits-configuration)
9. [Weekly Usage Configuration](#weekly-usage-configuration)
10. [Daily Spend Configuration](#daily-spend-configuration)
11. [Progress Bar Styles](#progress-bar-styles)
12. [Color Schemes](#color-schemes)
13. [Common Configurations](#common-configurations)

---

## Quick Configuration

### Edit Config File

```bash
# Open in default editor
nano ~/.claude/statusline.config.json

# Or with Claude Code
/statusline config
```

### Example Minimal Config

```json
{
  "features": {
    "usageLimits": true,
    "spendTracking": true
  },
  "git": {
    "enabled": true
  },
  "session": {
    "cost": { "enabled": true },
    "tokens": { "enabled": true }
  }
}
```

---

## Configuration File Location

**Config Path:** `~/.claude/statusline.config.json`

**Defaults Path:** `plugins/statusline/scripts/statusline/data/defaults.json`

### Reset to Defaults

```bash
/statusline reset
```

Or manually:
```bash
cp plugins/statusline/scripts/statusline/data/defaults.json ~/.claude/statusline.config.json
```

---

## All Configuration Options

### Full Default Configuration

```json
{
  "features": {
    "usageLimits": true,
    "spendTracking": true
  },
  "oneLine": true,
  "showSonnetModel": false,
  "pathDisplayMode": "truncated",
  "git": {
    "enabled": true,
    "showBranch": true,
    "showDirtyIndicator": true,
    "showChanges": false,
    "showStaged": true,
    "showUnstaged": true
  },
  "separator": "•",
  "session": {
    "infoSeparator": null,
    "cost": { "enabled": true, "format": "decimal1" },
    "duration": { "enabled": true },
    "tokens": { "enabled": true, "showMax": false, "showDecimals": false },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": {
        "enabled": true,
        "length": 10,
        "style": "braille",
        "color": "progressive",
        "background": "none"
      }
    }
  },
  "context": {
    "usePayloadContextWindow": true,
    "maxContextTokens": 200000,
    "autocompactBufferTokens": 45000,
    "useUsableContextOnly": true,
    "overheadTokens": 0
  },
  "limits": {
    "enabled": true,
    "showTimeLeft": true,
    "showPacingDelta": true,
    "cost": { "enabled": false, "format": "decimal1" },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": {
        "enabled": true,
        "length": 10,
        "style": "braille",
        "color": "progressive",
        "background": "none"
      }
    }
  },
  "weeklyUsage": {
    "enabled": "90%",
    "showTimeLeft": true,
    "showPacingDelta": true,
    "cost": { "enabled": false, "format": "decimal1" },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": {
        "enabled": true,
        "length": 10,
        "style": "braille",
        "color": "progressive",
        "background": "none"
      }
    }
  },
  "dailySpend": {
    "cost": { "enabled": true, "format": "decimal1" }
  }
}
```

---

## Feature Toggles

### Enable/Disable Features

```json
{
  "features": {
    "usageLimits": true,    // Show 5h/7d usage limits
    "spendTracking": true   // Track daily/weekly spend
  }
}
```

**To permanently disable features, delete feature folders:**
```bash
# Disable usage limits
rm -rf plugins/statusline/scripts/statusline/src/lib/features/limits

# Disable spend tracking
rm -rf plugins/statusline/scripts/statusline/src/lib/features/spend
```

---

## Git Configuration

### Full Options

```json
{
  "git": {
    "enabled": true,           // Enable/disable git status
    "showBranch": true,        // Show branch name
    "showDirtyIndicator": true,// Show +/-/~ for changes
    "showChanges": false,      // Show actual change counts
    "showStaged": true,        // Show staged changes
    "showUnstaged": true       // Show unstaged changes
  }
}
```

### Examples

**Minimal Git:**
```json
{
  "git": {
    "enabled": true,
    "showBranch": true,
    "showDirtyIndicator": true
  }
}
```
Output: `main •`

**Detailed Git:**
```json
{
  "git": {
    "enabled": true,
    "showBranch": true,
    "showDirtyIndicator": true,
    "showChanges": true,
    "showStaged": true,
    "showUnstaged": true
  }
}
```
Output: `main +2 -1 ~3 •`

---

## Session Configuration

### Full Options

```json
{
  "session": {
    "infoSeparator": null,      // Separator between session sections (null = use global)
    "cost": {
      "enabled": true,
      "format": "decimal1"      // "decimal1" = $1.23, "decimal2" = $1.234
    },
    "duration": {
      "enabled": true
    },
    "tokens": {
      "enabled": true,
      "showMax": false,         // Show "123K/200K" instead of just "123K"
      "showDecimals": false     // Show "123.4K" instead of "123K"
    },
    "percentage": {
      "enabled": true,
      "showValue": true,        // Show "80%" text
      "progressBar": {
        "enabled": true,
        "length": 10,           // Progress bar width in characters
        "style": "braille",     // "braille" or "blocks"
        "color": "progressive", // Color scheme
        "background": "none"    // "none", "light", "dim"
      }
    }
  }
}
```

### Examples

**Minimal Session:**
```json
{
  "session": {
    "cost": { "enabled": true },
    "tokens": { "enabled": false },
    "percentage": { "enabled": false }
  }
}
```
Output: `$1.23`

**Full Session:**
```json
{
  "session": {
    "cost": { "enabled": true },
    "duration": { "enabled": true },
    "tokens": { "enabled": true, "showMax": true },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": { "enabled": true }
    }
  }
}
```
Output: `$1.23 • 45.2K/200K • [████████░░] 78% • 12m30s`

---

## Context Configuration

Control how context tokens are calculated.

```json
{
  "context": {
    "usePayloadContextWindow": true,   // Use context window from API payload
    "maxContextTokens": 200000,        // Default max tokens (200K for Claude Sonnet)
    "autocompactBufferTokens": 45000,  // Auto-compact threshold
    "useUsableContextOnly": true,      // Use only usable context (excludes overhead)
    "overheadTokens": 0                // Additional overhead to subtract
  }
}
```

### Context Calculation

```
Usable Context = Total Tokens - Autocompact Buffer - Overhead
Percentage = (Used / Usable Context) × 100
```

### Examples

**Default (Claude Sonnet):**
```json
{
  "context": {
    "usePayloadContextWindow": true,
    "maxContextTokens": 200000
  }
}
```

**Manual Context Window:**
```json
{
  "context": {
    "usePayloadContextWindow": false,
    "maxContextTokens": 100000
  }
}
```

**Custom Overhead:**
```json
{
  "context": {
    "useUsableContextOnly": true,
    "overheadTokens": 5000
  }
}
```

---

## Usage Limits Configuration

Configure 5-hour and 7-day usage limits display.

```json
{
  "limits": {
    "enabled": true,
    "showTimeLeft": true,         // Show time until reset
    "showPacingDelta": true,      // Show over/under budget
    "cost": {
      "enabled": false,           // Show cost in limits section
      "format": "decimal1"
    },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": {
        "enabled": true,
        "length": 10,
        "style": "braille",
        "color": "progressive",
        "background": "none"
      }
    }
  }
}
```

### Examples

**Minimal Limits:**
```json
{
  "limits": {
    "enabled": true,
    "percentage": {
      "enabled": true,
      "progressBar": { "enabled": true }
    }
  }
}
```
Output: `[████████░░] 65%`

**Full Limits:**
```json
{
  "limits": {
    "enabled": true,
    "showTimeLeft": true,
    "showPacingDelta": true,
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": { "enabled": true }
    }
  }
}
```
Output: `⏱️ 1h23m • [████████░░] 65% • +0.15`

---

## Weekly Usage Configuration

Track 7-day rolling usage with pacing.

```json
{
  "weeklyUsage": {
    "enabled": "90%",             // Enable at 90% usage (or true/false)
    "showTimeLeft": true,
    "showPacingDelta": true,
    "cost": {
      "enabled": false,
      "format": "decimal1"
    },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": {
        "enabled": true,
        "length": 10,
        "style": "braille",
        "color": "progressive",
        "background": "none"
      }
    }
  }
}
```

### Enable Threshold

- `"enabled": true` - Always show
- `"enabled": false` - Never show
- `"enabled": "90%"` - Show when usage ≥ 90%

### Examples

**Always Show:**
```json
{
  "weeklyUsage": {
    "enabled": true,
    "showPacingDelta": true
  }
}
```

**Warning Threshold:**
```json
{
  "weeklyUsage": {
    "enabled": "80%",
    "showTimeLeft": true,
    "showPacingDelta": true
  }
}
```
Output (when >80%): `⚠️ 3d12h • [████████░░] 85% • -$2.50`

---

## Daily Spend Configuration

Track today's total spend.

```json
{
  "dailySpend": {
    "cost": {
      "enabled": true,
      "format": "decimal1"
    }
  }
}
```

### Examples

**Basic:**
```json
{
  "dailySpend": {
    "cost": { "enabled": true }
  }
}
```
Output: `📈 $3.45`

**With Weekly:**
```json
{
  "weeklyUsage": {
    "enabled": true,
    "cost": { "enabled": true }
  },
  "dailySpend": {
    "cost": { "enabled": true }
  }
}
```
Output: `📅 $12.34 • 📈 $3.45`

---

## Progress Bar Styles

### Style Options

```json
{
  "progressBar": {
    "style": "braille"  // "braille" or "blocks"
  }
}
```

**Braille (default):**
```
[████████░░] 80%
```

**Blocks:**
```
[████░░░░░░] 50%
```

### Color Options

```json
{
  "progressBar": {
    "color": "progressive"  // Color by percentage
  }
}
```

**Available Colors:**
- `"progressive"` - Changes color based on percentage (green → yellow → red)
- `"green"` - Always green
- `"blue"` - Always blue
- `"yellow"` - Always yellow
- `"red"` - Always red
- `"cyan"` - Always cyan
- `"magenta"` - Always magenta

### Background Options

```json
{
  "progressBar": {
    "background": "none"  // Background style
  }
}
```

**Available Backgrounds:**
- `"none"` - No background (default)
- `"light"` - Light background
- `"dim"` - Dim background

---

## Color Schemes

### Session Colors

```json
{
  "session": {
    "percentage": {
      "progressBar": {
        "color": "progressive"
      }
    }
  }
}
```

### Limits Colors

```json
{
  "limits": {
    "percentage": {
      "progressBar": {
        "color": "blue"
      }
    }
  }
}
```

### Weekly Colors

```json
{
  "weeklyUsage": {
    "percentage": {
      "progressBar": {
        "color": "yellow",
        "background": "light"
      }
    }
  }
}
```

---

## Common Configurations

### Minimal

```json
{
  "git": {
    "enabled": true,
    "showBranch": true
  },
  "session": {
    "cost": { "enabled": true },
    "tokens": { "enabled": false },
    "percentage": { "enabled": false }
  }
}
```
Output: `main • $1.23`

### Compact

```json
{
  "oneLine": true,
  "git": {
    "enabled": true,
    "showBranch": true,
    "showDirtyIndicator": false
  },
  "session": {
    "cost": { "enabled": true },
    "duration": { "enabled": false },
    "tokens": { "enabled": true, "showDecimals": false },
    "percentage": {
      "enabled": true,
      "progressBar": { "enabled": false }
    }
  }
}
```
Output: `main • $1.23 • 45K • 78%`

### Developer

```json
{
  "git": {
    "enabled": true,
    "showBranch": true,
    "showDirtyIndicator": true,
    "showChanges": true,
    "showStaged": true,
    "showUnstaged": true
  },
  "session": {
    "cost": { "enabled": true },
    "duration": { "enabled": true },
    "tokens": { "enabled": true, "showMax": true },
    "percentage": {
      "enabled": true,
      "showValue": true,
      "progressBar": { "enabled": true }
    }
  }
}
```
Output: `main +2 -1 ~3 • $1.23 • 45.2K/200K • [████████░░] 78% • 12m30s`

### Budget Conscious

```json
{
  "session": {
    "cost": { "enabled": true }
  },
  "limits": {
    "enabled": true,
    "showTimeLeft": true,
    "showPacingDelta": true,
    "cost": { "enabled": true }
  },
  "weeklyUsage": {
    "enabled": "80%",
    "showPacingDelta": true,
    "cost": { "enabled": true }
  },
  "dailySpend": {
    "cost": { "enabled": true }
  }
}
```
Output: `$1.23 • ⏱️ 1h23m $4.56 [████████░░] 65% • 📅 $12.34 • 📈 $3.45`

---

## Global Options

### One Line Mode

```json
{
  "oneLine": true  // All status on one line
}
```

### Separator

```json
{
  "separator": "•"  // Between sections (default: "•")
}
```

**Alternatives:**
- `"|"` - Pipe separator
- `"/"` - Slash separator
- `" "` - Space separator

### Path Display Mode

```json
{
  "pathDisplayMode": "truncated"  // "full", "truncated", "basename"
}
```

**Examples:**
- `full`: `C:\Users\Yanis\Projects\smite-marketplace`
- `truncated`: `...s\smite-marketplace`
- `basename`: `smite-marketplace`

### Show Sonnet Model

```json
{
  "showSonnetModel": false  // Show "Sonnet 4.5" in status
}
```

---

## Applying Configuration

### After Editing Config

```bash
# Restart Claude Code
# Or reload if supported
```

### Test Configuration

```bash
/statusline install --dry-run
```

---

## Next Steps

- [Installation Guide](INSTALLATION.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Architecture](docs/statusline/ARCHITECTURE.md)
