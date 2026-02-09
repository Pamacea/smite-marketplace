# SMITE Core API Reference

**Version**: 1.5.1
**Last Updated**: 2025-02-09

---

## Table of Contents

- [Manifest Loader](#manifest-loader)
- [Configuration Manager](#configuration-manager)
- [Hook Registry](#hook-registry)
- [Schema Validator](#schema-validator)
- [Platform Detector](#platform-detector)
- [Template Engine](#template-engine)
- [Logger](#logger)
- [Error Handler](#error-handler)
- [Version Utilities](#version-utilities)

---

## Manifest Loader

### Classes

#### `ManifestLoader`

Main class for loading and managing plugin manifests.

**Methods**:

##### `load(manifest: PluginManifest): void`

Load a single plugin manifest.

**Parameters**:
- `manifest` - Plugin manifest object

**Throws**:
- `Error` if manifest is missing required fields
- `Error` if version format is invalid

**Example**:
```typescript
const loader = new ManifestLoader();
loader.load({
  name: 'my-plugin',
  version: '1.0.0',
  smite: '1.5.1',
  provides: ['my-feature']
});
```

##### `loadAll(manifests: PluginManifest[]): void`

Load multiple plugin manifests.

**Parameters**:
- `manifests` - Array of plugin manifests

##### `get(name: string): PluginManifest | undefined`

Get a plugin manifest by name.

**Returns**: Plugin manifest or `undefined` if not found

##### `getAll(): Map<string, PluginManifest>`

Get all loaded manifests.

**Returns**: Map of plugin name to manifest

##### `buildGraph(): DependencyGraph`

Build dependency graph and calculate load order.

**Returns**: Dependency graph with load order, cycles, and missing dependencies

##### `checkConflicts(): Map<string, string[]>`

Check for conflicting plugins.

**Returns**: Map of plugin name to array of conflicting plugin names

##### `validateVersions(smiteVersion: string, coreVersion: string): string[]`

Validate version constraints for all plugins.

**Returns**: Array of error messages (empty if all valid)

##### `getProviders(capability: string): PluginManifest[]`

Get all plugins that provide a capability.

**Returns**: Array of plugin manifests

##### `findByTag(tag: string): PluginManifest[]`

Find plugins by tag.

**Returns**: Array of plugin manifests with the tag

#### `loadFromPluginRoot(rootPaths: string[]): Promise<ManifestLoader>`

Load manifests from plugin root directories.

**Parameters**:
- `rootPaths` - Array of directory paths

**Returns**: Promise resolving to ManifestLoader instance

**Example**:
```typescript
const loader = await loadFromPluginRoot([
  './plugins/core',
  './plugins/studio'
]);
```

### Types

#### `PluginManifest`

```typescript
interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  smite: string;
  core?: string;
  depends?: string[];
  optional?: string[];
  provides: string[];
  conflicts?: string[];
  loadAfter?: string[];
  loadBefore?: string[];
  tags?: string[];
  author?: string;
  license?: string;
  repository?: string;
}
```

#### `DependencyGraph`

```typescript
interface DependencyGraph {
  nodes: Map<string, PluginManifest>;
  edges: Map<string, Set<string>>;
  loadOrder: string[];
  circular: string[][];
  missing: string[];
}
```

---

## Configuration Manager

### Classes

#### `ConfigManager`

Manager for loading, merging, and validating plugin configurations.

**Methods**:

##### `loadPluginConfig(pluginName: string, options?: ConfigLoadOptions): Promise<PluginConfig>`

Load plugin configuration with inheritance and overrides.

**Parameters**:
- `pluginName` - Name of the plugin
- `options` - Optional load options

**Returns**: Promise resolving to configuration object

**Example**:
```typescript
const manager = new ConfigManager();
const config = await manager.loadPluginConfig('studio', {
  env: 'production',
  overrides: { debug: true }
});
```

##### `mergeConfigs(...configs: PluginConfig[]): PluginConfig`

Deep merge multiple configurations.

**Parameters**:
- `configs` - Configuration objects to merge

**Returns**: Merged configuration

**Example**:
```typescript
const merged = manager.mergeConfigs(baseConfig, envConfig, userConfig);
```

##### `validateConfig(config: unknown, schemaPath: string): Promise<ValidationResult>`

Validate configuration against JSON schema.

**Parameters**:
- `config` - Configuration to validate
- `schemaPath` - Path to JSON schema file

**Returns**: Promise resolving to validation result

##### `clearCache(pluginName?: string): void`

Clear configuration cache.

**Parameters**:
- `pluginName` - Optional plugin name to clear specific cache

### Types

#### `PluginConfig`

```typescript
interface PluginConfig {
  [key: string]: unknown;
}
```

#### `ConfigLoadOptions`

```typescript
interface ConfigLoadOptions {
  env?: string;
  overrides?: PluginConfig;
}
```

#### `ValidationResult`

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
}
```

---

## Hook Registry

### Classes

#### `HookRegistry`

Registry for plugin lifecycle hooks.

**Methods**:

##### `register(event: HookEvent, handler: HookHandler, pluginName: string, priority?: number): string`

Register a hook for an event.

**Parameters**:
- `event` - Hook event type
- `handler` - Hook handler function
- `pluginName` - Name of the plugin registering the hook
- `priority` - Optional priority (default: 0)

**Returns**: Hook ID for later unregistration

**Example**:
```typescript
const registry = getGlobalHookRegistry();
const hookId = registry.register(
  'session.start',
  async (context) => {
    console.log('Session started');
  },
  'my-plugin',
  10
);
```

##### `unregister(hookId: string): boolean`

Unregister a hook by ID.

**Parameters**:
- `hookId` - Hook ID returned from `register()`

**Returns**: `true` if hook was found and removed

##### `unregisterPlugin(pluginName: string): void`

Unregister all hooks for a plugin.

**Parameters**:
- `pluginName` - Name of the plugin

##### `trigger(event: HookEvent, context?: HookContext): Promise<void>`

Trigger all hooks for an event.

**Parameters**:
- `event` - Hook event type
- `context` - Optional context object

**Example**:
```typescript
await registry.trigger('session.start', { userId: 123 });
```

##### `getHooks(event: HookEvent): HookRegistration[]`

Get all registered hooks for an event.

**Returns**: Array of hook registrations

##### `hasHooks(event: HookEvent): boolean`

Check if any hooks are registered for an event.

**Returns**: `true` if hooks exist

##### `clear(): void`

Clear all hooks (useful for testing)

#### `getGlobalHookRegistry(): HookRegistry`

Get or create the global hook registry.

**Returns**: Global HookRegistry instance

### Types

#### `HookEvent`

```typescript
type HookEvent =
  | 'plugin.load'
  | 'plugin.unload'
  | 'config.change'
  | 'command.before'
  | 'command.after'
  | 'session.start'
  | 'session.end';
```

#### `HookContext`

```typescript
interface HookContext {
  pluginName?: string;
  [key: string]: unknown;
}
```

#### `HookHandler`

```typescript
type HookHandler = (context: HookContext) => Promise<void> | void;
```

#### `HookRegistration`

```typescript
interface HookRegistration {
  id: string;
  pluginName: string;
  event: HookEvent;
  handler: HookHandler;
  priority?: number;
}
```

---

## Schema Validator

### Classes

#### `SchemaValidator`

Runtime validation with JSON schemas.

**Methods**:

##### `loadSchema(schemaName: string, schemaDir?: string): Promise<SchemaDefinition>`

Load JSON schema and cache it.

**Parameters**:
- `schemaName` - Name of schema file (without .schema.json)
- `schemaDir` - Optional schema directory path

**Returns**: Promise resolving to schema definition

##### `validate(data: unknown, schema: SchemaDefinition): ValidationResult`

Validate data against schema.

**Parameters**:
- `data` - Data to validate
- `schema` - Schema definition

**Returns**: Validation result

##### `validateWithSchema(data: unknown, schemaName: string, schemaDir?: string): Promise<ValidationResult>`

Validate data against loaded schema.

**Parameters**:
- `data` - Data to validate
- `schemaName` - Name of schema
- `schemaDir` - Optional schema directory

**Returns**: Promise resolving to validation result

##### `generateType(schema: SchemaDefinition, typeName?: string): string`

Generate TypeScript type from schema.

**Parameters**:
- `schema` - Schema definition
- `typeName` - Optional type name

**Returns**: TypeScript type definition string

##### `clearCache(): void`

Clear schema cache.

### Types

#### `SchemaDefinition`

```typescript
interface SchemaDefinition {
  type: 'object' | 'string' | 'number' | 'boolean' | 'array';
  properties?: Record<string, SchemaDefinition>;
  required?: string[];
  items?: SchemaDefinition;
  enum?: unknown[];
}
```

#### `ValidationResult`

```typescript
type ValidationResult =
  | { success: true; data: unknown }
  | { success: false; errors: string[] };
```

---

## Platform Detector

### Classes

#### `PlatformDetector`

Runtime platform and environment detection.

**Methods**:

##### `detect(): PlatformInfo`

Detect current platform information.

**Returns**: Platform info object

**Example**:
```typescript
const detector = new PlatformDetector();
const platform = detector.detect();
console.log(`Running on ${platform.os} ${platform.arch}`);
```

##### `supports(feature: PlatformFeature): boolean`

Check if platform supports a feature.

**Parameters**:
- `feature` - Feature to check

**Returns**: `true` if feature is supported

##### `getPathSeparator(): string`

Get platform-specific path separator.

**Returns**: `;` on Windows, `:` on Unix

##### `getNewline(): string`

Get platform-specific newline characters.

**Returns**: `\r\n` on Windows, `\n` on Unix

##### `windowsToGitBashPath(windowsPath: string): string`

Convert Windows path to Git Bash path.

**Parameters**:
- `windowsPath` - Windows path (e.g., `C:\path\to\file`)

**Returns**: Git Bash path (e.g., `/c/path/to/file`)

##### `clearCache(): void`

Clear cached platform info.

#### `getGlobalPlatformDetector(): PlatformDetector`

Get or create global platform detector.

**Returns**: Global PlatformDetector instance

#### `getPlatformInfo(): PlatformInfo`

Get current platform info (convenience function).

**Returns**: Platform info object

### Types

#### `PlatformInfo`

```typescript
interface PlatformInfo {
  os: OSType;
  arch: string;
  shell: ShellType;
  nodeVersion: string;
  env: string | undefined;
  isWSL: boolean;
  isCI: boolean;
}
```

#### `OSType`

```typescript
type OSType = 'darwin' | 'linux' | 'win32' | 'unknown';
```

#### `ShellType`

```typescript
type ShellType = 'powershell' | 'cmd' | 'bash' | 'zsh' | 'fish' | 'unknown';
```

#### `PlatformFeature`

```typescript
type PlatformFeature =
  | 'symlinks'
  | 'executable-permissions'
  | 'case-sensitive'
  | 'native-async-local';
```

---

## Template Engine

### Classes

#### `TemplateEngine`

Simple template processor for variables and includes.

**Methods**:

##### `process(template: string, context?: TemplateContext): string`

Process template with variables.

**Parameters**:
- `template` - Template string
- `context` - Template context data

**Returns**: Processed template string

**Example**:
```typescript
const engine = new TemplateEngine();
const output = engine.process('Hello {{name}}!', { name: 'World' });
// Returns: "Hello World!"
```

##### `loadFile(templatePath: string, context?: TemplateContext, options?: TemplateOptions): Promise<string>`

Load and process template file.

**Parameters**:
- `templatePath` - Path to template file
- `context` - Template context data
- `options` - Template processing options

**Returns**: Promise resolving to processed template

##### `clearCache(): void`

Clear template cache.

### Types

#### `TemplateContext`

```typescript
interface TemplateContext {
  [key: string]: unknown;
}
```

#### `TemplateOptions`

```typescript
interface TemplateOptions {
  includeRoot?: string;
  escapeHTML?: boolean;
}
```

**Template Syntax**:
- Variables: `{{variableName}}`
- Nested: `{{user.name}}`
- Conditionals: `{{#if condition}}...{{/if}}`
- Loops: `{{#each items}}...{{/each}}`
- Includes: `{{include:file.md}}`

---

## Logger

### Classes

#### `Logger`

Structured logging with levels.

**Constructor**:
```typescript
constructor(level?: LogLevel, prefix?: string)
```

**Methods**:

##### `debug(message: string, context?: Record<string, unknown>): void`

Log debug message.

##### `info(message: string, context?: Record<string, unknown>): void`

Log info message.

##### `warn(message: string, context?: Record<string, unknown>): void`

Log warning message.

##### `error(message: string, context?: Record<string, unknown>): void`

Log error message.

##### `setLevel(level: LogLevel): void`

Set log level.

##### `withPrefix(prefix: string): Logger`

Create child logger with prefix.

**Returns**: New Logger instance

#### `getGlobalLogger(): Logger`

Get or create global logger.

**Returns**: Global Logger instance

### Types

#### `LogLevel`

```typescript
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}
```

#### `LogEntry`

```typescript
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}
```

---

## Error Handler

### Classes

#### `SmiteError`

Base error class for SMITE.

**Constructor**:
```typescript
constructor(
  message: string,
  code: string,
  plugin?: string,
  details?: unknown
)
```

**Methods**:

##### `toJSON(): object`

Convert error to JSON-serializable object.

#### `ValidationError`

Validation error.

**Constructor**:
```typescript
constructor(message: string, details?: unknown)
```

#### `ConfigurationError`

Configuration error.

**Constructor**:
```typescript
constructor(message: string, plugin?: string, details?: unknown)
```

#### `PluginLoadError`

Plugin load error.

**Constructor**:
```typescript
constructor(pluginName: string, details?: unknown)
```

#### `ErrorHandler`

Static error handling utilities.

**Static Methods**:

##### `handle(error: Error): void`

Handle error with appropriate strategy.

##### `format(error: Error): string`

Format error for user display.

##### `wrap(error: Error, code: string, plugin?: string, details?: unknown): SmiteError`

Wrap error in SMITE error.

##### `fromUnknown(value: unknown): Error`

Create error from unknown value.

#### `tryCatch<T>(fn: () => Promise<T>, errorCode: string, plugin?: string): Promise<T>`

Async error wrapper.

**Parameters**:
- `fn` - Async function to execute
- `errorCode` - Error code if function fails
- `plugin` - Optional plugin name

**Returns**: Promise resolving to function result

**Example**:
```typescript
const result = await tryCatch(
  async () => riskyOperation(),
  'OPERATION_FAILED',
  'my-plugin'
);
```

#### `tryCatchSync<T>(fn: () => T, errorCode: string, plugin?: string): T`

Sync error wrapper.

**Parameters**:
- `fn` - Function to execute
- `errorCode` - Error code if function fails
- `plugin` - Optional plugin name

**Returns**: Function result

---

## Version Utilities

### Functions

#### `parseSemver(version: string): Semver`

Parse semver string.

**Parameters**:
- `version` - Semver string (e.g., `1.2.3-beta.1+build.456`)

**Returns**: Semver object

**Throws**: `Error` if version format is invalid

#### `formatSemver(semver: Semver): string`

Format semver to string.

**Parameters**:
- `semver` - Semver object

**Returns**: Semver string

#### `compareVersions(v1: string | Semver, v2: string | Semver): number`

Compare two versions.

**Returns**:
- `-1` if v1 < v2
- `0` if v1 == v2
- `1` if v1 > v2

#### `satisfiesVersion(version: string | Semver, constraint: string | Semver): boolean`

Check if version satisfies minimum constraint.

**Returns**: `true` if version >= constraint

#### `bumpVersion(version: string | Semver, type: 'major' | 'minor' | 'patch'): Semver`

Bump version.

**Parameters**:
- `version` - Version to bump
- `type` - Type of bump

**Returns**: New semver object

#### `getVersionRange(version: string): string`

Get version range string.

**Returns**: Version range (e.g., `^1.5.1`)

### Types

#### `Semver`

```typescript
interface Semver {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
}
```

---

## Constants

#### `SMITE_VERSION`

Current SMITE version (`'1.5.1'`)

#### `CORE_VERSION`

Current core version (`'1.5.1'`)

---

For more information, see:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [INTEGRATION.md](./INTEGRATION.md) - Integration guide
- [MIGRATION_v1.5.0_to_v1.5.1.md](./MIGRATION_v1.5.0_to_v1.5.1.md) - Migration guide
