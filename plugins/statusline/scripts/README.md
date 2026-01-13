# Statusline Auto-Configuration Installation Script

Automatically configures Claude Code to use the SMITE Statusline plugin.

## Features

- **Cross-platform**: Works on Windows, macOS, and Linux
- **Runtime detection**: Automatically detects Bun or Node.js
- **Safe installation**: Backs up existing settings before modification
- **Idempotent**: Safe to run multiple times
- **Dry-run mode**: Preview changes without modifying files
- **Rollback support**: Automatically restores backup on failure
- **Comprehensive logging**: Logs all steps to `~/.claude/logs/statusline-install.log`

## Usage

The installation script is automatically run by the `PostPluginInstall` hook after the plugin is installed.

### Manual Installation

```bash
# Test what would be done (dry-run)
node plugins/statusline/dist/install.js --dry-run

# Install with verbose output
node plugins/statusline/dist/install.js --verbose

# Show help
node plugins/statusline/dist/install.js --help
```

## What It Does

1. **Detects Platform**: Identifies OS (Windows/macOS/Linux) and runtime (Bun/Node)
2. **Backs Up Settings**: Creates `settings.json.backup` before modification
3. **Configures Statusline**: Adds `statusLine` configuration to `settings.json`:
   ```json
   {
     "statusLine": {
       "type": "command",
       "command": "bun ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts",
       "padding": 0
     }
   }
   ```
4. **Creates Config**: Copies `defaults.json` to `~/.claude/statusline.config.json`
5. **Logs**: Writes installation log to `~/.claude/logs/statusline-install.log`

## Error Handling

- Validates JSON before writing to prevent corruption
- Creates backup of existing settings
- Atomic writes (writes to temp file, then renames)
- Automatic rollback on failure
- User-friendly error messages

## File Structure

```
plugins/statusline/
├── scripts/
│   ├── install.ts              # Installation script source
│   ├── dist/
│   │   └── install.js          # Compiled JavaScript
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config
│   └── statusline/
│       ├── data/
│       │   └── defaults.json   # Default configuration
│       └── src/
│           └── index.ts        # Statusline entry point
```

## Development

### Build

```bash
cd plugins/statusline/scripts
npm install
npm run build
```

### Watch Mode

```bash
npm run build:watch
```

## Troubleshooting

### Installation Fails

Check the installation log:
```bash
cat ~/.claude/logs/statusline-install.log
```

### Rollback Manual

If something goes wrong, restore from backup:
```bash
cp ~/.claude/settings.json.backup ~/.claude/settings.json
```

### Statusline Not Showing

1. Check the command path in `settings.json`
2. Ensure the runtime (Bun/Node) is installed
3. Check Claude Code logs for errors

## Configuration

After installation, customize `~/.claude/statusline.config.json`:

```json
{
  "segments": [
    { "type": "token", "enabled": true },
    { "type": "context", "enabled": true },
    { "type": "git", "enabled": true },
    { "type": "timestamp", "enabled": true }
  ],
  "style": {
    "separator": "•",
    "padding": { "left": 1, "right": 1 }
  }
}
```

## License

MIT
