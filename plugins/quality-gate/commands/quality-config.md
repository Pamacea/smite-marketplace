# quality-gate quality-config

Configure the quality gate system interactively or via CLI.

## Usage

```bash
quality-gate quality-config [action] [options]
```

## Actions

### `init` - Initialize configuration
Creates `.smite/quality.json` with default settings.

```bash
quality-gate quality-config init
```

### `validate` - Validate configuration
Check if current config is valid.

```bash
quality-gate quality-config validate
```

### `set` - Set configuration value
Update a specific configuration value.

```bash
quality-gate quality-config set complexity.threshold 15
quality-gate quality-config set security.enabled true
quality-gate quality-config set tests.command "npm run test:unit"
```

### `get` - Get configuration value
Display current configuration value.

```bash
quality-gate quality-config get complexity
quality-gate quality-config get security.enabled
```

### `edit` - Open configuration in editor
Open `.smite/quality.json` in default editor.

```bash
quality-gate quality-config edit
```

### `reset` - Reset to defaults
Reset configuration to default values.

```bash
quality-gate quality-config reset [--force]
```

## Options

- `--global, -g` - Use global config instead of project
- `--verbose, -v` - Detailed output
- `--dry-run, -d` - Show changes without applying

## Examples

```bash
# Initialize with defaults
quality-gate quality-config init

# Enable complexity checking with threshold 15
quality-gate quality-config set complexity.enabled true
quality-gate quality-config set complexity.threshold 15

# Disable security scanning
quality-gate quality-config set security.enabled false

# Validate current config
quality-gate quality-config validate

# View all settings
quality-gate quality-config get
```

## Configuration Structure

```json
{
  "enabled": true,
  "complexity": {
    "enabled": true,
    "threshold": 10,
    "perFunction": true
  },
  "security": {
    "enabled": true,
    "patterns": ["sql-injection", "xss", "weak-crypto"]
  },
  "semantic": {
    "enabled": true,
    "checkTypes": true,
    "checkNaming": true
  },
  "tests": {
    "enabled": true,
    "command": "npm test",
    "onEveryWrite": false
  },
  "documentation": {
    "enabled": true,
    "triggers": {
      "onCodeAccept": true
    }
  },
  "feedback": {
    "maxRetries": 3,
    "requireTests": true
  }
}
```

## Schema

Full JSON schema available in:
`plugins/quality-gate/config-schema.json`

Validate with:
```bash
quality-gate quality-config validate --schema
```

## See Also

- **[quality-gate quality-check](commands/quality-check.md)** - Run quality checks
- **[quality-gate docs-sync](commands/docs-sync.md)** - Sync documentation
- **[Configuration Reference](../../docs/plugins/quality-gate/CONFIG_REFERENCE.md)**
- **[Default Config](../../plugins/quality-gate/default-config.json)**
