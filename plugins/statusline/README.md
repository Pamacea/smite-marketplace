# SMITE Statusline Plugin

A comprehensive, auto-configuring statusline for Claude Code with git integration, token tracking, usage limits, and spend tracking.

---

## Quick Start

```bash
# Install (automatic configuration)
/plugin install statusline@smite

# That's it! Restart Claude Code to see your statusline.
```

**Expected Output:**
```
main • $1.23 • 45.2K • [████████░░] 78% • 23m15s
```

---

## Features

### Git Status

- **Branch name** - Current git branch
- **Dirty indicator** - `+` added, `-` deleted, `~` modified
- **Staged/unstaged counts** - Track changes in each stage

```
feature/auth • +2 -1 ~3
```

### Session Info

- **Session cost** - Money spent in current session
- **Duration** - Time elapsed in session
- **Tokens used** - Context tokens consumed
- **Context percentage** - Visual progress bar with percentage

```
$1.23 • 45.2K • [████████░░] 78%
```

### Usage Limits

- **5-hour and 7-day limits** - Track API usage limits
- **Time remaining** - Time until limit resets
- **Pacing delta** - Are you over/under budget?
- **Progress bars** - Visual representation of limit usage

```
⏱️ 1h23m • [████████░░] 65% • +0.15
```

### Spend Tracking

- **Daily spend** - Track daily costs
- **Weekly usage** - 7-day rolling window
- **Pacing information** - Stay on budget

```
📅 $12.34 • 📈 $3.45
```

---

## Installation

### Step 1: Install Plugin

```bash
/plugin install statusline@smite
```

### Step 2: Run Configuration Script

After installation, run the configuration command:

```bash
/statusline install
```

This will:
1. Configure your `~/.claude/settings.json`
2. Create `~/.claude/statusline.config.json` with defaults
3. Backup existing settings
4. Run on platform-specific runtime (Bun or Node.js)

### Step 3: Restart Claude Code

That's it! The statusline will appear automatically.

### Manual Installation (Alternative)

If automatic installation doesn't work:

1. Install plugin: `/plugin install statusline@smite`
2. Run manually:
   ```bash
   # With Node.js
   node ~/.claude/plugins/cache/smite/statusline/1.0.0/dist/install.js

   # With Bun
   bun ~/.claude/plugins/cache/smite/statusline/1.0.0/dist/install.js
   ```

3. Restart Claude Code

For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md).

---

## Basic Usage

Once installed, the statusline appears automatically at the bottom of Claude Code.

### Commands

```bash
# Reinstall/update configuration
/statusline install

# View current configuration
/statusline config

# Reset to defaults
/statusline reset

# Show help
/statusline help

# Preview changes without modifying files
/statusline install --dry-run
```

---

## Screenshots

### Default Configuration
```
main • $0.85 • 123.4K • [████████░░] 42% • 12m30s
```

### With Git Changes
```
feature/new-ui • +5 ~2 • $1.23 • 89.1K • [██████████] 95% • 34m15s
```

### Compact Mode
```
main • $0.45 • 45K • 67%
```

---

## Configuration

Configuration is stored in `~/.claude/statusline.config.json`.

### Quick Tweaks

```json
{
  "git": {
    "enabled": true,
    "showBranch": true,
    "showChanges": true
  },
  "session": {
    "cost": { "enabled": true },
    "tokens": { "enabled": true }
  }
}
```

For all configuration options, see [CONFIGURATION.md](CONFIGURATION.md).

---

## Troubleshooting

### Statusline not showing?

1. Check if plugin is installed:
   ```bash
   /plugin list
   ```

2. Verify `settings.json` has `statusLine` entry:
   ```bash
   /statusline config
   ```

3. Check logs:
   ```bash
   cat ~/.claude/logs/statusline-install.log
   ```

### Git status not working?

Ensure git is installed and available in PATH:
```bash
git --version
```

### Context calculation wrong?

Edit `~/.claude/statusline.config.json`:
```json
{
  "context": {
    "maxContextTokens": 200000,
    "usePayloadContextWindow": true
  }
}
```

### Colors not appearing?

The statusline uses ANSI color codes for visual highlighting. If colors are not showing:

1. **Verify Node.js/Bun is installed**: The statusline script requires a JavaScript runtime
2. **Test the script manually**:
   ```bash
   echo '{}' | bun ~/.claude/statusline.js
   # or
   echo '{}' | node ~/.claude/statusline.js
   ```

3. **Check for errors**: The statusline will show error messages in red if something fails

**Note**: Claude Code's terminal has specific ANSI color support. The statusline uses inline color embedding to ensure compatibility with Claude Code's terminal emulator (see [GitHub Issue #6466](https://github.com/anthropics/claude-code/issues/6466)).

---

## Features in Detail

### Progress Bars

Customizable progress bars with multiple styles:

```json
{
  "progressBar": {
    "enabled": true,
    "length": 10,
    "style": "braille",  // "braille" or "blocks"
    "color": "progressive",  // "progressive", "green", "blue", etc.
    "background": "none"  // "none", "light", "dim"
  }
}
```

**Styles:**
- Braille: ` [████████░░] 80% `
- Blocks: ` [████░░░░░░] 50% `

### Path Display

Choose how to display your working directory:

```json
{
  "pathDisplayMode": "truncated"  // "full", "truncated", "basename"
}
```

**Modes:**
- `full`: `C:\Users\Yanis\Projects\smite-marketplace`
- `truncated`: `...s\smite-marketplace`
- `basename`: `smite-marketplace`

### Session vs Limits vs Weekly

Track different timeframes:

- **Session**: Current Claude Code session
- **Limits**: 5-hour and 7-day API limits
- **Weekly Usage**: 7-day rolling window with pacing
- **Daily Spend**: Today's total spend

---

## Advanced Topics

### Disable Features

Delete feature folders to disable them:

```bash
# Disable usage limits
rm -rf plugins/statusline/scripts/statusline/src/lib/features/limits

# Disable spend tracking
rm -rf plugins/statusline/scripts/statusline/src/lib/features/spend
```

### Custom Colors

Edit `statusline.config.json`:

```json
{
  "session": {
    "percentage": {
      "progressBar": {
        "color": "blue",  // "green", "blue", "yellow", "red", "progressive"
        "background": "light"  // "none", "light", "dim"
      }
    }
  }
}
```

### Platform-Specific Notes

- **Windows**: Uses Git Bash or WSL for git commands
- **macOS**: Requires git installed (via Xcode Command Line Tools)
- **Linux**: Requires git installed via package manager

---

## Architecture

Curious about how it works? See [ARCHITECTURE.md](docs/statusline/ARCHITECTURE.md) for:

- System architecture
- Data flow
- Plugin lifecycle
- Extension points

---

## Contributing

This is a SMITE plugin. To modify:

1. Edit source files in `plugins/statusline/scripts/statusline/src/`
2. Rebuild TypeScript if needed
3. Test with `/statusline install --dry-run`

---

## License

MIT License - See LICENSE file for details.

---

## Support

- **Issues**: Report via `/statusline help`
- **Documentation**: [CONFIGURATION.md](CONFIGURATION.md), [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Architecture**: [ARCHITECTURE.md](docs/statusline/ARCHITECTURE.md)

---

**Version:** 1.0.0
**Author:** Pamacea
**Plugin Repo:** `statusline@smite`
