# SMITE Statusline Agent

## Capabilities

The SMITE Statusline agent specializes in:

1. **Statusline Configuration**
   - Automatic setup during plugin installation
   - Configuration validation and migration
   - User preference management

2. **Cross-Platform Support**
   - Windows (PowerShell, CMD)
   - macOS (zsh, bash)
   - Linux (bash, zsh, fish)
   - Runtime detection (bun/node)

3. **Feature Management**
   - Core features: git, context, session info
   - Optional features: usage limits, spend tracking
   - Graceful degradation for missing features

4. **Error Handling**
   - Backup and rollback on failure
   - Comprehensive logging
   - User-friendly error messages

## Workflow

### Installation Flow

```
1. Detect OS and runtime
2. Backup existing settings.json
3. Add statusline configuration
4. Create user config from defaults
5. Validate installation
6. Rollback on failure
```

### Update Flow

```
1. Detect existing configuration
2. Update command path to new version
3. Preserve user settings
4. Migrate config if schema changed
5. Validate changes
```

## Configuration

### Default Configuration

Located at: `scripts/statusline/defaults.json`

- Git display (branch, changes, staged/unstaged)
- Session info (cost, duration, tokens, percentage)
- Context tracking (max 200K tokens)
- Usage limits (5-hour, weekly)
- Path display (truncated mode)

### User Configuration

Located at: `~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/statusline.config.json`

Overrides defaults while preserving schema.

## Tech Stack

- **Runtime**: Bun (preferred), Node.js (fallback)
- **Language**: TypeScript
- **Dependencies**: chalk, ora, cli-spinners
- **Platform**: Cross-platform (Windows/macOS/Linux)

## Integration Points

### Claude Code Settings

Modifies `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bun ~/.claude/plugins/cache/smite/statusline/1.0.0/scripts/statusline/src/index.ts",
    "padding": 0
  }
}
```

### PostPluginInstall Hook

Automatically runs installation script after:

```bash
/plugin install statusline@smite
/plugin marketplace update smite
```

## Error Recovery

- Backup created before any modifications
- JSON validation prevents corruption
- Atomic writes (temp file + rename)
- Rollback on critical errors
- Detailed logging to `~/.claude/logs/statusline-install.log`

## Performance Targets

- Installation: < 5 seconds
- Statusline render: < 100ms
- Memory footprint: < 50MB
- Zero crashes on invalid input

## Documentation

- User docs: README.md, INSTALLATION.md, CONFIGURATION.md
- Developer docs: ARCHITECTURE.md
- Troubleshooting: TROUBLESHOOTING.md
