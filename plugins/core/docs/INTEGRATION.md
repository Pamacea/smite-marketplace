# SMITE Core Integration Guide

**Version**: 1.5.1
**Last Updated**: 2025-02-09

---

## Quick Start

### 1. Install Core

Core is automatically installed as a dependency of SMITE plugins. No separate installation needed.

### 2. Import Core APIs

```typescript
// Import specific modules
import { ConfigManager } from '@smite/core';
import { HookRegistry, getGlobalHookRegistry } from '@smite/core';

// Or import everything
import * as Core from '@smite/core';
```

### 3. Use Core in Your Plugin

```typescript
import { ConfigManager, Logger, getGlobalHookRegistry } from '@smite/core';

export async function load() {
  const logger = new Logger(undefined, 'MyPlugin');
  logger.info('Loading plugin...');

  // Load configuration
  const configManager = new ConfigManager();
  const config = await configManager.loadPluginConfig('my-plugin');

  // Register hooks
  const registry = getGlobalHookRegistry();
  registry.register('session.start', async () => {
    logger.info('Session started');
  }, 'my-plugin');

  logger.info('Plugin loaded successfully');
}
```

---

## Integration Patterns

### Pattern 1: Simple Plugin

**Use Case**: Basic plugin without complex features

```typescript
// my-plugin/src/index.ts
import { Logger } from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

export async function load() {
  logger.info('Plugin loaded');
}

export async function unload() {
  logger.info('Plugin unloaded');
}
```

### Pattern 2: Plugin with Configuration

**Use Case**: Plugin that needs user configuration

```typescript
// my-plugin/src/index.ts
import { ConfigManager, Logger, ValidationError } from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

interface PluginConfig {
  apiKey: string;
  debug: boolean;
  maxRetries: number;
}

export async function load() {
  const configManager = new ConfigManager();

  // Load configuration
  const config = await configManager.loadPluginConfig('my-plugin') as PluginConfig;

  // Validate required fields
  if (!config.apiKey) {
    throw new ValidationError('Missing required field: apiKey');
  }

  logger.info('Plugin loaded with config:', { debug: config.debug });
}

export async function unload() {
  logger.info('Plugin unloaded');
}
```

**Configuration File** (`.claude/.smite/my-plugin.json`):
```json
{
  "apiKey": "your-api-key",
  "debug": false,
  "maxRetries": 3
}
```

### Pattern 3: Plugin with Hooks

**Use Case**: Plugin that needs to react to events

```typescript
// my-plugin/src/index.ts
import {
  HookRegistry,
  getGlobalHookRegistry,
  Logger,
  type HookContext,
} from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

export async function load() {
  const registry = getGlobalHookRegistry();

  // Register session start hook
  registry.register('session.start', async (context: HookContext) => {
    logger.info('Session started');
    await initializePlugin();
  }, 'my-plugin', 10);

  // Register command.before hook
  registry.register('command.before', async (context: HookContext) => {
    logger.info(`Before command: ${context.commandName}`);
    await validateCommand(context);
  }, 'my-plugin');

  // Register config.change hook
  registry.register('config.change', async (context: HookContext) => {
    logger.info('Config changed, reloading...');
    await reloadConfig();
  }, 'my-plugin');
}

export async function unload() {
  const registry = getGlobalHookRegistry();
  registry.unregisterPlugin('my-plugin');
  logger.info('Plugin unregistered');
}

async function initializePlugin(): Promise<void> {
  // Initialization logic
}

async function validateCommand(context: HookContext): Promise<void> {
  // Validation logic
}

async function reloadConfig(): Promise<void> {
  // Config reload logic
}
```

### Pattern 4: Plugin with Validation

**Use Case**: Plugin that validates user input

```typescript
// my-plugin/src/index.ts
import { SchemaValidator, Logger } from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

export async function load() {
  const validator = new SchemaValidator();

  // Load schema
  const schema = await validator.loadSchema('user-input');

  // Validate input
  const result = validator.validate(userInput, schema);

  if (!result.success) {
    logger.error('Validation failed:', result.errors);
    throw new Error(result.errors.join(', '));
  }

  logger.info('Input validated successfully');
}
```

### Pattern 5: Plugin with Platform Detection

**Use Case**: Plugin that adapts to different platforms

```typescript
// my-plugin/src/index.ts
import { PlatformDetector, Logger } from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

export async function load() {
  const detector = new PlatformDetector();
  const platform = detector.detect();

  logger.info(`Running on ${platform.os} (${platform.arch})`);

  // Platform-specific logic
  if (platform.os === 'win32') {
    logger.info('Using Windows-specific features');
    await setupWindowsFeatures();
  } else if (platform.os === 'darwin') {
    logger.info('Using macOS-specific features');
    await setupMacOSFeatures();
  } else {
    logger.info('Using Linux features');
    await setupLinuxFeatures();
  }

  // Check feature support
  if (detector.supports('symlinks')) {
    logger.info('Symlinks supported, using symlink strategy');
  }
}

async function setupWindowsFeatures(): Promise<void> {
  // Windows setup
}

async function setupMacOSFeatures(): Promise<void> {
  // macOS setup
}

async function setupLinuxFeatures(): Promise<void> {
  // Linux setup
}
```

### Pattern 6: Plugin with Templates

**Use Case**: Plugin that processes templates

```typescript
// my-plugin/src/index.ts
import { TemplateEngine, Logger } from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

export async function load() {
  const engine = new TemplateEngine();

  // Process simple template
  const output1 = engine.process('Hello {{name}}!', { name: 'World' });
  logger.info('Template output:', output1);

  // Process complex template
  const output2 = engine.process(
    'Hello {{user.name}}! You have {{user.notifications.length}} notifications.',
    {
      user: {
        name: 'Alice',
        notifications: ['a', 'b', 'c'],
      },
    }
  );

  // Process conditional template
  const output3 = engine.process(
    '{{#if showBanner}}Welcome!{{/if}}',
    { showBanner: true }
  );

  // Process loop template
  const output4 = engine.process(
    '{{#each items}}- {{item}} ({{index}}){{/each}}',
    { items: ['apple', 'banana', 'cherry'] }
  );

  // Load and process file
  const output5 = await engine.loadFile('templates/welcome.md', {
    username: 'John',
  });

  logger.info('All templates processed');
}
```

### Pattern 7: Plugin with Error Handling

**Use Case**: Plugin with proper error handling

```typescript
// my-plugin/src/index.ts
import {
  Logger,
  SmiteError,
  ValidationError,
  ConfigurationError,
  ErrorHandler,
  tryCatch,
} from '@smite/core';

const logger = new Logger(undefined, 'MyPlugin');

export async function load() {
  try {
    await loadConfiguration();
    await connectToDatabase();
    await initializeServices();
  } catch (error) {
    ErrorHandler.handle(error);
    throw error;
  }
}

async function loadConfiguration(): Promise<void> {
  const config = await tryCatch(
    async () => fetchConfig(),
    'CONFIG_LOAD_FAILED',
    'my-plugin'
  );

  if (!config.apiKey) {
    throw new ValidationError('Missing required field: apiKey', {
      field: 'apiKey',
    });
  }
}

async function connectToDatabase(): Promise<void> {
  const result = await tryCatch(
    async () => database.connect(),
    'DB_CONNECTION_FAILED',
    'my-plugin'
  );

  if (!result.connected) {
    throw new ConfigurationError(
      'Failed to connect to database',
      'my-plugin',
      { error: result.error }
    );
  }
}

async function initializeServices(): Promise<void> {
  // Service initialization
}
```

---

## Configuration Best Practices

### 1. Use Hierarchical Configuration

Leverage the config priority system:

```
.claude/.smite/my-plugin.json          # Base config
.claude/.smite/my-plugin.prod.json     # Production overrides
.claude/.smite/local/my-plugin.json    # Local development (gitignored)
```

### 2. Use Environment Variables

Config supports environment variable substitution:

```json
{
  "apiKey": "${API_KEY}",
  "databaseUrl": "${DATABASE_URL}",
  "debug": "${DEBUG:-false}"
}
```

### 3. Validate Configuration

Always validate configuration after loading:

```typescript
const configManager = new ConfigManager();
const config = await configManager.loadPluginConfig('my-plugin');

const result = await configManager.validateConfig(
  config,
  'plugins/core/validation/schemas/plugin-config.schema.json'
);

if (!result.valid) {
  throw new ValidationError('Invalid configuration', {
    errors: result.errors,
  });
}
```

---

## Hook Best Practices

### 1. Register Hooks During Load

Always register hooks in the `load()` function:

```typescript
export async function load() {
  const registry = getGlobalHookRegistry();

  registry.register('session.start', handler, 'my-plugin');
}
```

### 2. Unregister Hooks During Unload

Always clean up hooks in the `unload()` function:

```typescript
export async function unload() {
  const registry = getGlobalHookRegistry();
  registry.unregisterPlugin('my-plugin');
}
```

### 3. Use Hook Priority

Use priority to control execution order:

```typescript
// High priority - executes first
registry.register('command.before', handler, 'my-plugin', 100);

// Low priority - executes last
registry.register('command.before', handler, 'my-plugin', -10);
```

### 4. Handle Hook Errors Gracefully

Hooks should handle errors gracefully:

```typescript
registry.register('session.start', async (context) => {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Hook failed:', error);
    // Don't throw - let other hooks execute
  }
}, 'my-plugin');
```

---

## Common Pitfalls

### 1. Forgetting to Cache

Core modules cache results automatically. Don't create new instances unnecessarily:

```typescript
// Bad
function process() {
  const detector = new PlatformDetector(); // New instance every time
  return detector.detect();
}

// Good
const detector = new PlatformDetector(); // Reuse instance
function process() {
  return detector.detect();
}
```

### 2. Not Validating Input

Always validate external input:

```typescript
// Bad
async function processUserInput(input: unknown) {
  const name = (input as any).name; // Unsafe
}

// Good
async function processUserInput(input: unknown) {
  const validator = new SchemaValidator();
  const result = validator.validate(input, schema);

  if (!result.success) {
    throw new ValidationError('Invalid input', {
      errors: result.errors,
    });
  }

  const name = (result.data as any).name; // Safe
}
```

### 3. Ignoring Platform Differences

Always check platform before using platform-specific features:

```typescript
// Bad
const path = '/usr/local/bin'; // Assumes Unix

// Good
const detector = new PlatformDetector();
const platform = detector.detect();

const path = platform.os === 'win32'
  ? 'C:\\Program Files\\MyApp'
  : '/usr/local/bin';
```

### 4. Not Using Proper Error Types

Always use SMITE error types:

```typescript
// Bad
throw new Error('Configuration error');

// Good
throw new ConfigurationError('Missing API key', 'my-plugin', {
  field: 'apiKey',
});
```

---

## Testing Integration

### Unit Test Example

```typescript
import { ConfigManager, SchemaValidator } from '@smite/core';
import { describe, it, expect } from 'vitest';

describe('My Plugin', () => {
  it('should load configuration', async () => {
    const configManager = new ConfigManager();
    const config = await configManager.loadPluginConfig('my-plugin');

    expect(config).toHaveProperty('apiKey');
    expect(config.apiKey).toBeTruthy();
  });

  it('should validate user input', async () => {
    const validator = new SchemaValidator();
    const schema = await validator.loadSchema('user-input');

    const result = validator.validate(
      { name: 'John', email: '[email protected]' },
      schema
    );

    expect(result.success).toBe(true);
  });
});
```

---

## Next Steps

- See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture
- See [API.md](./API.md) for complete API reference
- See [MIGRATION_v1.5.0_to_v1.5.1.md](./MIGRATION_v1.5.0_to_v1.5.1.md) for migration guide
- Check [examples/](../examples/) for working code examples
