# SMITE Core Architecture

**Version**: 1.5.1
**Last Updated**: 2025-02-09

---

## Overview

SMITE Core is the foundational infrastructure for all SMITE plugins. It provides shared utilities, configuration management, lifecycle hooks, runtime validation, platform detection, template processing, and error handling.

## Design Principles

1. **Minimal Dependencies**: Core has zero external dependencies
2. **Type-Safe**: Full TypeScript support with exported types
3. **Cross-Platform**: Works on Windows, macOS, and Linux
4. **Extensible**: Hook-based architecture for plugin integration
5. **Performant**: Caching and lazy loading where appropriate

## Module Structure

```
plugins/core/
├── manifest/              # Plugin dependency management
│   ├── loader.ts         # Manifest loader and validator
│   └── index.ts          # Manifest exports
├── src/
│   ├── config/           # Configuration management
│   ├── hooks/            # Plugin lifecycle hooks
│   ├── validation/       # Runtime validation
│   ├── platform/         # Platform detection
│   ├── template/         # Template engine
│   ├── utils/            # Shared utilities
│   └── index.ts          # Public API
├── validation/schemas/   # JSON validation schemas
└── examples/             # Integration examples
```

## Core Capabilities

### 1. Manifest Loader

**Purpose**: Load, validate, and resolve plugin dependencies

**Features**:
- Semantic versioning with proper comparison
- Circular dependency detection
- Topological sort for load order
- Conflict detection
- Capability provider lookup

**Usage**:
```typescript
import { ManifestLoader, loadFromPluginRoot } from '@smite/core';

// Load manifests from plugin roots
const loader = await loadFromPluginRoot(['./plugins/core', './plugins/studio']);

// Build dependency graph
const graph = loader.buildGraph();
console.log('Load order:', graph.loadOrder);

// Check for conflicts
const conflicts = loader.checkConflicts();

// Find providers of a capability
const providers = loader.getProviders('hook-registry');
```

### 2. Configuration Manager

**Purpose**: Load, merge, and validate plugin configurations

**Features**:
- Hierarchical config loading (base → env → local)
- Deep merge strategy
- Environment variable substitution (`${VAR_NAME}`)
- JSON schema validation
- Hot-reload support

**Usage**:
```typescript
import { ConfigManager } from '@smite/core';

const configManager = new ConfigManager();

// Load plugin config
const config = await configManager.loadPluginConfig('studio', {
  env: 'production',
  overrides: { debug: true }
});

// Merge configs
const merged = configManager.mergeConfigs(config1, config2);

// Validate against schema
const result = await configManager.validateConfig(config, 'schema.json');
if (!result.valid) {
  console.error(result.errors);
}
```

**Config Priority** (low to high):
1. `.claude/.smite/{plugin}.json` (base)
2. `.claude/.smite/{plugin}.{env}.json` (environment)
3. `.claude/.smite/local/{plugin}.json` (local overrides)

### 3. Hook Registry

**Purpose**: Plugin lifecycle hooks for extensibility

**Available Hooks**:
- `plugin.load` - When a plugin is loaded
- `plugin.unload` - When a plugin is unloaded
- `config.change` - When configuration changes
- `command.before` - Before command execution
- `command.after` - After command execution
- `session.start` - When SMITE session starts
- `session.end` - When SMITE session ends

**Usage**:
```typescript
import { HookRegistry, getGlobalHookRegistry } from '@smite/core';

// Get global registry
const registry = getGlobalHookRegistry();

// Register a hook
registry.register('plugin.load', async (context) => {
  console.log(`Plugin ${context.pluginName} loaded`);
}, 'my-plugin', 10); // priority 10

// Trigger hooks
await registry.trigger('plugin.load', { pluginName: 'studio' });

// Unregister plugin hooks
registry.unregisterPlugin('my-plugin');
```

**Hook Priority**:
- Higher priority hooks execute first
- Default priority is 0
- Use priority to control execution order

### 4. Schema Validator

**Purpose**: Runtime validation with JSON schemas

**Features**:
- Dynamic schema loading
- Type validation (string, number, boolean, array, object)
- Required field checking
- Enum validation
- Nested object validation
- Array item validation

**Usage**:
```typescript
import { SchemaValidator } from '@smite/core';

const validator = new SchemaValidator();

// Load schema
const schema = await validator.loadSchema('plugin-manifest');

// Validate data
const result = validator.validate(data, schema);
if (!result.success) {
  console.error(result.errors);
}

// Validate with schema name
const result2 = await validator.validateWithSchema(data, 'plugin-manifest');
```

### 5. Platform Detector

**Purpose**: Runtime platform and environment detection

**Detected Information**:
- OS type (darwin, linux, win32)
- Architecture (x64, arm64)
- Default shell (powershell, cmd, bash, zsh, fish)
- Node version
- Environment (development, production)
- WSL detection
- CI environment detection

**Usage**:
```typescript
import { PlatformDetector, getPlatformInfo } from '@smite/core';

// Quick platform info
const platform = getPlatformInfo();
console.log('Running on', platform.os, platform.arch);

// Full detector
const detector = new PlatformDetector();
const info = detector.detect();

// Check feature support
if (detector.supports('symlinks')) {
  console.log('Symlinks supported');
}

// Windows-specific conversions
if (platform.os === 'win32') {
  const bashPath = detector.windowsToGitBashPath('C:\\path\\to\\file');
  // Returns: /c/path/to/file
}
```

**Platform Features**:
- `symlinks` - Symbolic link support
- `executable-permissions` - Unix-style permissions
- `case-sensitive` - Case-sensitive filesystem
- `native-async-local` - Async local storage support

### 6. Template Engine

**Purpose**: Simple template processing with variables and includes

**Features**:
- Variable substitution: `{{variableName}}`
- Nested objects: `{{user.name}}`
- Conditionals: `{{#if condition}}...{{/if}}`
- Loops: `{{#each items}}...{{/each}}`
- Includes: `{{include:file.md}}`
- Automatic caching

**Usage**:
```typescript
import { TemplateEngine } from '@smite/core';

const engine = new TemplateEngine();

// Process template
const output = engine.process('Hello {{name}}!', { name: 'World' });
// Returns: "Hello World!"

// Load and process file
const result = await engine.loadFile('template.md', {
  title: 'My Page',
  items: ['a', 'b', 'c']
});
```

**Template Syntax**:
```markdown
# {{title}}

{{#if showContent}}
Content goes here

{{#each items}}
- {{item}} (index: {{index}})
{{/each}}
{{/if}}

Include: {{include:footer.md}}
```

### 7. Logger

**Purpose**: Structured logging with levels

**Features**:
- Log levels: DEBUG, INFO, WARN, ERROR
- Timestamp formatting
- Contextual logging
- Prefixed loggers
- Global logger instance

**Usage**:
```typescript
import { Logger, getGlobalLogger, LogLevel } from '@smite/core';

// Use global logger
const logger = getGlobalLogger();
logger.info('Application started');

// Create custom logger
const customLogger = new Logger(LogLevel.DEBUG, 'MyPlugin');
customLogger.debug('Debug info', { userId: 123 });
customLogger.warn('Warning message');
customLogger.error('Error occurred', { error: details });

// Create child logger with prefix
const childLogger = logger.withPrefix('Database');
childLogger.info('Connected');
```

### 8. Error Handler

**Purpose**: Standardized error handling

**Error Types**:
- `SmiteError` - Base error with code and details
- `ValidationError` - Validation failures
- `ConfigurationError` - Configuration issues
- `PluginLoadError` - Plugin load failures

**Usage**:
```typescript
import {
  SmiteError,
  ValidationError,
  ConfigurationError,
  ErrorHandler,
  tryCatch,
} from '@smite/core';

// Throw SMITE errors
throw new ValidationError('Invalid input', { field: 'email' });
throw new ConfigurationError('Missing config', 'my-plugin');

// Handle errors
try {
  // ...
} catch (error) {
  ErrorHandler.handle(error);
}

// Wrap errors
const wrapped = ErrorHandler.wrap(error, 'CUSTOM_CODE', 'my-plugin');

// Try-catch wrapper
const result = await tryCatch(
  async () => riskyOperation(),
  'OPERATION_FAILED',
  'my-plugin'
);
```

### 9. Version Utilities

**Purpose**: Semantic versioning support

**Features**:
- Parse semver strings
- Compare versions
- Check version constraints
- Bump versions
- Format version ranges

**Usage**:
```typescript
import {
  parseSemver,
  compareVersions,
  satisfiesVersion,
  bumpVersion,
  getVersionRange,
} from '@smite/core';

// Parse version
const semver = parseSemver('1.2.3-beta.1+build.456');
console.log(semver); // { major: 1, minor: 2, patch: 3, ... }

// Compare versions
const cmp = compareVersions('1.2.3', '1.2.4');
console.log(cmp); // -1 (less than)

// Check constraint
if (satisfiesVersion('1.5.0', '1.5.1')) {
  console.log('Version satisfied');
}

// Bump version
const bumped = bumpVersion('1.2.3', 'minor');
console.log(bumped); // { major: 1, minor: 3, patch: 0 }

// Get range string
const range = getVersionRange('1.5.1');
console.log(range); // ^1.5.1
```

## Integration Patterns

### Pattern 1: Plugin with Config

```typescript
import { ConfigManager, HookRegistry } from '@smite/core';

export async function load() {
  const configManager = new ConfigManager();
  const config = await configManager.loadPluginConfig('my-plugin');

  // Use config
  console.log('Debug mode:', config.debug);
}
```

### Pattern 2: Plugin with Hooks

```typescript
import { getGlobalHookRegistry } from '@smite/core';

export async function load() {
  const registry = getGlobalHookRegistry();

  registry.register('session.start', async () => {
    console.log('Session started');
  }, 'my-plugin');
}
```

### Pattern 3: Plugin with Validation

```typescript
import { SchemaValidator } from '@smite/core';

export async function load() {
  const validator = new SchemaValidator();
  const schema = await validator.loadSchema('my-schema');

  const result = validator.validate userInput, schema);
  if (!result.success) {
    throw new Error(result.errors.join(', '));
  }
}
```

## Performance Considerations

1. **Caching**: ConfigManager, SchemaValidator, and TemplateEngine cache results
2. **Lazy Loading**: Schemas and configs are loaded on-demand
3. **Hook Priority**: Use priority wisely to avoid unnecessary hook execution
4. **Deep Merge**: Config deep merge can be expensive for large objects

## Best Practices

1. **Always validate** external input with SchemaValidator
2. **Use ConfigManager** for all configuration, avoid manual JSON parsing
3. **Register hooks** during plugin load, unregister during unload
4. **Handle errors** with ErrorHandler for consistent error reporting
5. **Use Logger** instead of console.log for structured logging
6. **Check platform** before using platform-specific features

## Migration from v1.5.0

See [MIGRATION_v1.5.0_to_v1.5.1.md](./MIGRATION_v1.5.0_to_v1.5.1.md) for detailed migration guide.

## API Reference

See [API.md](./API.md) for complete API documentation.

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/Pamacea/smite
- Documentation: https://github.com/Pamacea/smite/tree/main/plugins/core/docs
