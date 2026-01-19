# Quality Gate Configuration Reference

**Complete configuration reference for the Smite Quality Gate system.**

---

## Table of Contents

- [Configuration File](#configuration-file)
- [Configuration Schema](#configuration-schema)
- [Master Settings](#master-settings)
- [File Filtering](#file-filtering)
- [Complexity Thresholds](#complexity-thresholds)
- [Security Rules](#security-rules)
- [Semantic Checks](#semantic-checks)
- [Test Execution](#test-execution)
- [MCP Integration](#mcp-integration)
- [Output Options](#output-options)
- [Per-File Overrides](#per-file-overrides)
- [Environment Variables](#environment-variables)
- [Configuration Examples](#configuration-examples)

---

## Configuration File

### Location

`.claude/.smite/quality.json` (relative to project root)

### JSON Schema

The configuration is validated against `config-schema.json` in the quality-gate plugin directory.

### Validation

If your configuration is invalid:
1. Detailed errors are logged
2. The system falls back to defaults
3. Operation continues (failsafe behavior)

### Quick Check

```bash
# Validate configuration
quality-config validate .claude/.smite/quality.json

# Show current configuration
quality-config show

# Show default configuration
quality-config show-defaults
```

---

## Configuration Schema

```typescript
interface JudgeConfig {
  // Master Settings
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxRetries: number;

  // File Filtering
  include: string[];
  exclude: string[];

  // Complexity Thresholds
  complexity: {
    maxCyclomaticComplexity: number;
    maxCognitiveComplexity: number;
    maxNestingDepth: number;
    maxFunctionLength: number;
    maxParameterCount: number;
  };

  // Semantic Checks
  semantics: {
    enabled: boolean;
    checks: Array<{
      type: string;
      enabled: boolean;
      severity: 'error' | 'warning';
    }>;
  };

  // Security Rules
  security: {
    enabled: boolean;
    rules: Array<{
      id: string;
      enabled: boolean;
      severity?: 'critical' | 'error' | 'warning';
      customPattern?: string;
    }>;
  };

  // Test Execution
  tests: {
    enabled: boolean;
    command?: string;
    framework?: 'jest' | 'vitest' | 'mocha' | 'pytest' | 'none';
    timeoutMs: number;
    failOnTestFailure: boolean;
  };

  // MCP Integration
  mcp: {
    enabled: boolean;
    serverPath: string;
    triggers: {
      openAPI: {
        enabled: boolean;
        filePatterns: string[];
        frameworks: string[];
      };
      readme: {
        enabled: boolean;
        filePatterns: string[];
      };
      jsdoc: {
        enabled: boolean;
        filePatterns: string[];
      };
    };
  };

  // Output Options
  output: {
    format: 'json' | 'text';
    includeCodeSnippets: boolean;
    maxSuggestions: number;
  };

  // Per-File Overrides
  overrides?: Array<{
    files: string;
    complexity?: object;
    security?: object;
    semantics?: object;
    tests?: object;
  }>;
}
```

---

## Master Settings

### enabled

**Type:** `boolean`
**Default:** `true`
**Environment Variable:** `SMITE_QUALITY_ENABLED`

Master toggle for the quality gate system. When `false`, all validations are bypassed and code changes are allowed immediately.

**Usage:**
```json
{
  "enabled": true
}
```

**Disable temporarily:**
```bash
export SMITE_QUALITY_ENABLED=false
```

---

### logLevel

**Type:** `'debug' | 'info' | 'warn' | 'error'`
**Default:** `'info'`
**Environment Variable:** `SMITE_QUALITY_LOG_LEVEL`

Controls logging verbosity. Messages at the specified level and above are logged.

**Levels:**
- `debug`: Detailed diagnostic information (AST traversal, analyzer decisions)
- `info`: General informational messages (validation start/end, decision)
- `warn`: Warning messages (threshold exceeded, non-critical issues)
- `error`: Error messages only (parse failures, critical issues)

**Usage:**
```json
{
  "logLevel": "debug"
}
```

**Enable debug logging:**
```bash
export SMITE_QUALITY_LOG_LEVEL=debug
```

---

### maxRetries

**Type:** `number`
**Range:** `0` - `10`
**Default:** `3`
**Environment Variable:** `SMITE_QUALITY_MAX_RETRIES`

Maximum number of retry attempts when validation fails. Each retry provides context-aware feedback to help Claude fix the issues.

**Behavior:**
- `0`: No retries, immediate failure on first denial
- `1-3`: Standard retry behavior (recommended)
- `4-10`: Extended retry period (useful for complex refactoring)

**Usage:**
```json
{
  "maxRetries": 3
}
```

**Disable retries:**
```bash
export SMITE_QUALITY_MAX_RETRIES=0
```

---

## File Filtering

### include

**Type:** `string[]`
**Default:** `["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]`

Glob patterns for files to include in validation. Supports `*` and `**` wildcards.

**Pattern Syntax:**
- `*`: Match any characters except `/`
- `**`: Match any characters including `/`
- `**/*.ts`: Match all `.ts` files in any directory
- `src/**/*.ts`: Match all `.ts` files under `src/`

**Examples:**
```json
{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx"
  ]
}
```

**TypeScript only:**
```json
{
  "include": ["**/*.ts", "**/*.tsx"]
}
```

**Specific directories:**
```json
{
  "include": [
    "src/**/*.ts",
    "lib/**/*.ts",
    "server/**/*.ts"
  ]
}
```

---

### exclude

**Type:** `string[]`
**Default:** `["**/*.test.ts", "**/*.spec.ts", "**/node_modules/**", "**/dist/**", "**/build/**"]`

Glob patterns for files to exclude from validation. Takes precedence over `include` patterns.

**Common exclusions:**
```json
{
  "exclude": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.generated.ts",
    "**/coverage/**"
  ]
}
```

**Exclude vendored code:**
```json
{
  "exclude": [
    "**/vendor/**",
    "**/third-party/**"
  ]
}
```

---

## Complexity Thresholds

### complexity.maxCyclomaticComplexity

**Type:** `number`
**Range:** `1` - `100`
**Default:** `10`
**Environment Variable:** `SMITE_QUALITY_COMPLEXITY_MAX_CYCLOMATIC_COMPLEXITY`

Maximum cyclomatic complexity per function. Measures the number of linearly independent paths through the code.

**Guidelines:**
- `1-10`: Simple, easy to test
- `11-20`: Moderate complexity, should consider refactoring
- `21-50`: High complexity, should refactor
- `51+`: Very high complexity, immediate refactoring needed

**Example:**
```json
{
  "complexity": {
    "maxCyclomaticComplexity": 10
  }
}
```

**Strict setting:**
```json
{
  "complexity": {
    "maxCyclomaticComplexity": 5
  }
}
```

---

### complexity.maxCognitiveComplexity

**Type:** `number`
**Range:** `1` - `100`
**Default:** `15`
**Environment Variable:** `SMITE_QUALITY_COMPLEXITY_MAX_COGNITIVE_COMPLEXITY`

Maximum cognitive complexity per function. Measures how difficult the code is to understand by a human.

**Guidelines:**
- `1-15`: Easy to understand
- `16-30`: Moderate difficulty, some nesting
- `31-50`: Difficult to understand, deeply nested
- `51+`: Very difficult, needs simplification

**Example:**
```json
{
  "complexity": {
    "maxCognitiveComplexity": 15
  }
}
```

---

### complexity.maxNestingDepth

**Type:** `number`
**Range:** `1` - `20`
**Default:** `4`

Maximum nesting depth of control structures (if/for/while/switch).

**Example:**
```typescript
// Nesting depth: 4
function example() {
  if (condition1) {          // depth 1
    if (condition2) {        // depth 2
      if (condition3) {      // depth 3
        if (condition4) {    // depth 4
          // code
        }
      }
    }
  }
}
```

**Guidelines:**
- `1-3`: Flat, easy to read
- `4-5`: Moderate nesting
- `6+`: Deeply nested, consider extracting functions

**Example:**
```json
{
  "complexity": {
    "maxNestingDepth": 4
  }
}
```

---

### complexity.maxFunctionLength

**Type:** `number`
**Range:** `1` - `500`
**Default:** `50`

Maximum function length in lines of code (excluding comments and whitespace).

**Guidelines:**
- `1-25`: Short, focused function
- `26-50`: Moderate length
- `51-100`: Long function, consider splitting
- `101+`: Very long, should refactor

**Example:**
```json
{
  "complexity": {
    "maxFunctionLength": 50
  }
}
```

---

### complexity.maxParameterCount

**Type:** `number`
**Range:** `0` - `20`
**Default:** `5`

Maximum number of function parameters. High parameter counts indicate complex interfaces.

**Guidelines:**
- `0-3`: Ideal, easy to understand
- `4-5`: Acceptable
- `6-7`: Consider using options object
- `8+`: Too many parameters, refactor

**Example:**
```json
{
  "complexity": {
    "maxParameterCount": 5
  }
}
```

---

## Security Rules

### security.enabled

**Type:** `boolean`
**Default:** `true`

Master toggle for security scanning.

**Example:**
```json
{
  "security": {
    "enabled": true
  }
}
```

---

### security.rules

**Type:** `Array<{id, enabled, severity?, customPattern?}>`
**Default:** All rules enabled

Array of security rule configurations.

#### Rule IDs

| Rule ID | Name | Category | Default Severity |
|---------|------|----------|------------------|
| `sql-injection` | SQL Injection | Injection | CRITICAL |
| `xss-vulnerability` | Cross-Site Scripting | XSS | CRITICAL |
| `weak-crypto` | Weak Cryptography | Crypto | ERROR |
| `hardcoded-secret` | Hardcoded Secrets | Data Exposure | CRITICAL |

#### Example Configurations

**All rules enabled:**
```json
{
  "security": {
    "enabled": true,
    "rules": [
      { "id": "sql-injection", "enabled": true },
      { "id": "xss-vulnerability", "enabled": true },
      { "id": "weak-crypto", "enabled": true },
      { "id": "hardcoded-secret", "enabled": true }
    ]
  }
}
```

**Disable specific rule:**
```json
{
  "security": {
    "rules": [
      { "id": "weak-crypto", "enabled": false }
    ]
  }
}
```

**Override severity:**
```json
{
  "security": {
    "rules": [
      { "id": "hardcoded-secret", "enabled": true, "severity": "warning" }
    ]
  }
}
```

**Custom pattern:**
```json
{
  "security": {
    "rules": [
      {
        "id": "sql-injection",
        "enabled": true,
        "customPattern": "\\.query\\s*\\(\\s*['\"`]\\s*\\+"
      }
    ]
  }
}
```

---

## Semantic Checks

### semantics.enabled

**Type:** `boolean`
**Default:** `true`

Master toggle for semantic analysis.

**Example:**
```json
{
  "semantics": {
    "enabled": true
  }
}
```

---

### semantics.checks

**Type:** `Array<{type, enabled, severity}>`

Array of semantic check configurations.

#### Check Types

| Type | Description | Default Severity |
|------|-------------|------------------|
| `api-contract` | Validates API contract consistency | ERROR |
| `type-consistency` | Checks type annotations | ERROR |
| `naming` | Enforces naming conventions | WARNING (disabled) |
| `duplicate-code` | Detects duplicate code | WARNING (disabled) |

#### Example Configurations

**All checks enabled:**
```json
{
  "semantics": {
    "enabled": true,
    "checks": [
      { "type": "api-contract", "enabled": true, "severity": "error" },
      { "type": "type-consistency", "enabled": true, "severity": "error" },
      { "type": "naming", "enabled": false, "severity": "warning" },
      { "type": "duplicate-code", "enabled": false, "severity": "warning" }
    ]
  }
}
```

**Enable naming checks:**
```json
{
  "semantics": {
    "checks": [
      { "type": "naming", "enabled": true, "severity": "error" }
    ]
  }
}
```

**Disable all semantic checks:**
```json
{
  "semantics": {
    "enabled": false
  }
}
```

---

## Test Execution

### tests.enabled

**Type:** `boolean`
**Default:** `false`
**Environment Variable:** `SMITE_QUALITY_TESTS_ENABLED`

Enable automatic test execution before allowing code changes.

**Example:**
```json
{
  "tests": {
    "enabled": true
  }
}
```

**Enable via environment:**
```bash
export SMITE_QUALITY_TESTS_ENABLED=true
```

---

### tests.command

**Type:** `string`
**Default:** (auto-detected)
**Environment Variable:** `SMITE_QUALITY_TESTS_COMMAND`

Custom test command. Overrides automatic framework detection.

**Example:**
```json
{
  "tests": {
    "command": "npm run test:unit"
  }
}
```

**Custom command with args:**
```json
{
  "tests": {
    "command": "npm test -- --coverage --watchAll=false"
  }
}
```

---

### tests.framework

**Type:** `'jest' | 'vitest' | 'mocha' | 'pytest' | 'none'`
**Default:** (auto-detected)

Test framework to use. If not specified, the system will attempt to detect the framework from `package.json` or configuration files.

**Explicit framework:**
```json
{
  "tests": {
    "framework": "jest"
  }
}
```

---

### tests.timeoutMs

**Type:** `number`
**Range:** `1000` - `600000`
**Default:** `60000` (60 seconds)
**Environment Variable:** `SMITE_QUALITY_TESTS_TIMEOUT_MS`

Maximum time to wait for test execution in milliseconds.

**Example:**
```json
{
  "tests": {
    "timeoutMs": 120000
  }
}
```

**Increase timeout:**
```bash
export SMITE_QUALITY_TESTS_TIMEOUT_MS=120000
```

---

### tests.failOnTestFailure

**Type:** `boolean`
**Default:** `true`

Deny code changes when tests fail. When `false`, test failures are reported as warnings but don't block changes.

**Example:**
```json
{
  "tests": {
    "failOnTestFailure": true
  }
}
```

**Warnings only:**
```json
{
  "tests": {
    "failOnTestFailure": false
  }
}
```

---

## MCP Integration

### mcp.enabled

**Type:** `boolean`
**Default:** `false`
**Environment Variable:** `SMITE_QUALITY_MCP_ENABLED`

Enable MCP (Model Context Protocol) integration for automatic documentation generation.

**Example:**
```json
{
  "mcp": {
    "enabled": true
  }
}
```

---

### mcp.serverPath

**Type:** `string`
**Default:** `"./node_modules/@smite/docs-editor-mcp/dist/index.js"`
**Environment Variable:** `SMITE_QUALITY_MCP_SERVER_PATH`

Path to the MCP documentation server.

**Example:**
```json
{
  "mcp": {
    "serverPath": "./node_modules/@smite/docs-editor-mcp/dist/index.js"
  }
}
```

**Custom path:**
```bash
export SMITE_QUALITY_MCP_SERVER_PATH=/path/to/mcp-server.js
```

---

### mcp.triggers.openAPI

**Type:** `object`

OpenAPI/Swagger specification generation settings.

#### openAPI.enabled

**Type:** `boolean`
**Default:** `true`

Enable OpenAPI documentation generation.

#### openAPI.filePatterns

**Type:** `string[]`
**Default:** `["**/routes/**/*.ts", "**/api/**/*.ts", "**/controllers/**/*.ts", "**/pages/api/**/*.ts"]`

Glob patterns for API route files to document.

#### openAPI.frameworks

**Type:** `string[]`
**Default:** `["express", "nextjs"]`

Web frameworks to support for API documentation.

**Supported Frameworks:**
- `express`: Express.js (app.get, router.post, etc.)
- `nextjs`: Next.js (App Router, Pages API)
- `fastify`: (planned)
- `koa`: (planned)

**Example:**
```json
{
  "mcp": {
    "triggers": {
      "openAPI": {
        "enabled": true,
        "filePatterns": ["**/routes/**/*.ts", "**/api/**/*.ts"],
        "frameworks": ["express", "nextjs"]
      }
    }
  }
}
```

---

### mcp.triggers.readme

**Type:** `object`

README.md documentation generation settings.

#### readme.enabled

**Type:** `boolean`
**Default:** `true`

Enable README documentation generation.

#### readme.filePatterns

**Type:** `string[]`
**Default:** `["**/src/**/*.ts", "**/lib/**/*.ts", "**/core/**/*.ts", "package.json"]`

Glob patterns for files that trigger README updates.

**Example:**
```json
{
  "mcp": {
    "triggers": {
      "readme": {
        "enabled": true,
        "filePatterns": ["**/src/**/*.ts", "package.json"]
      }
    }
  }
}
```

---

### mcp.triggers.jsdoc

**Type:** `object`

JSDoc comment generation settings.

#### jsdoc.enabled

**Type:** `boolean`
**Default:** `true`

Enable JSDoc generation.

#### jsdoc.filePatterns

**Type:** `string[]`
**Default:** `["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]`

Glob patterns for files requiring JSDoc.

**Example:**
```json
{
  "mcp": {
    "triggers": {
      "jsdoc": {
        "enabled": true,
        "filePatterns": ["**/*.ts", "**/*.tsx"]
      }
    }
  }
}
```

---

## Output Options

### output.format

**Type:** `'json' | 'text'`
**Default:** `'text'`
**Environment Variable:** `SMITE_QUALITY_OUTPUT_FORMAT`

Output format for validation results.

**Text format:**
```
❌ Validation failed: complexity-max-cognitive-complexity

The function processData has cognitive complexity of 45, which exceeds the threshold of 15.

Location: src/api/users.ts:23:1

Suggestion: Consider breaking this function into smaller, more focused functions.
```

**JSON format:**
```json
{
  "decision": "deny",
  "confidence": 0.7,
  "issues": [
    {
      "type": "complexity",
      "severity": "error",
      "message": "Cognitive complexity exceeds threshold",
      "location": {
        "file": "src/api/users.ts",
        "line": 23,
        "column": 1
      }
    }
  ]
}
```

---

### output.includeCodeSnippets

**Type:** `boolean`
**Default:** `true`

Include code snippets in validation output.

**Example:**
```json
{
  "output": {
    "includeCodeSnippets": true
  }
}
```

---

### output.maxSuggestions

**Type:** `number`
**Range:** `0` - `20`
**Default:** `5`

Maximum number of suggestions to display per issue.

**Example:**
```json
{
  "output": {
    "maxSuggestions": 5
  }
}
```

---

## Per-File Overrides

Apply different rules to specific files or directories.

### Syntax

```json
{
  "overrides": [
    {
      "files": "<glob-pattern>",
      "complexity": { ... },
      "security": { ... },
      "semantics": { ... },
      "tests": { ... }
    }
  ]
}
```

### Matching Behavior

- Overrides are evaluated from first to last
- Later overrides take precedence (last match wins)
- More specific patterns should come after general ones

### Examples

**Stricter rules for core code:**
```json
{
  "overrides": [
    {
      "files": "**/core/**/*.ts",
      "complexity": {
        "maxCyclomaticComplexity": 5,
        "maxCognitiveComplexity": 8,
        "maxNestingDepth": 3
      }
    }
  ]
}
```

**Lenient rules for tests:**
```json
{
  "overrides": [
    {
      "files": "**/*.test.ts",
      "complexity": {
        "maxCyclomaticComplexity": 15,
        "maxCognitiveComplexity": 25
      },
      "semantics": {
        "enabled": false
      }
    }
  ]
}
```

**Multiple overrides:**
```json
{
  "overrides": [
    {
      "files": "**/core/**/*.ts",
      "complexity": { "maxCyclomaticComplexity": 5 }
    },
    {
      "files": "**/api/**/*.ts",
      "security": {
        "rules": [
          { "id": "sql-injection", "enabled": true },
          { "id": "xss-vulnerability", "enabled": true }
        ]
      }
    },
    {
      "files": "**/*.test.ts",
      "semantics": { "enabled": false }
    }
  ]
}
```

---

## Environment Variables

Override configuration using environment variables. Environment variables take precedence over file-based configuration.

### Naming Convention

All environment variables use the `SMITE_QUALITY_` prefix.

### Available Variables

| Environment Variable | Type | Description |
|---------------------|------|-------------|
| `SMITE_QUALITY_ENABLED` | boolean | Master toggle |
| `SMITE_QUALITY_LOG_LEVEL` | string | Logging level |
| `SMITE_QUALITY_MAX_RETRIES` | number | Maximum retry count |
| `SMITE_QUALITY_COMPLEXITY_MAX_CYCLOMATIC_COMPLEXITY` | number | Cyclomatic complexity threshold |
| `SMITE_QUALITY_COMPLEXITY_MAX_COGNITIVE_COMPLEXITY` | number | Cognitive complexity threshold |
| `SMITE_QUALITY_TESTS_ENABLED` | boolean | Enable test execution |
| `SMITE_QUALITY_TESTS_COMMAND` | string | Custom test command |
| `SMITE_QUALITY_TESTS_TIMEOUT_MS` | number | Test timeout |
| `SMITE_QUALITY_MCP_ENABLED` | boolean | Enable MCP integration |
| `SMITE_QUALITY_MCP_SERVER_PATH` | string | MCP server path |
| `SMITE_QUALITY_OUTPUT_FORMAT` | string | Output format (json/text) |

### Usage

```bash
# Disable quality gate
export SMITE_QUALITY_ENABLED=false

# Enable debug logging
export SMITE_QUALITY_LOG_LEVEL=debug

# Increase complexity threshold
export SMITE_QUALITY_COMPLEXITY_MAX_CYCLOMATIC_COMPLEXITY=15

# Enable tests with custom command
export SMITE_QUALITY_TESTS_ENABLED=true
export SMITE_QUALITY_TESTS_COMMAND="npm run test:fast"

# Enable MCP
export SMITE_QUALITY_MCP_ENABLED=true

# JSON output
export SMITE_QUALITY_OUTPUT_FORMAT=json
```

**Persistent configuration (bash/zsh):**
```bash
# Add to ~/.bashrc or ~/.zshrc
export SMITE_QUALITY_LOG_LEVEL=debug
export SMITE_QUALITY_TESTS_ENABLED=true
```

**Project-specific (`.env` file):**
```bash
# .env
SMITE_QUALITY_ENABLED=true
SMITE_QUALITY_LOG_LEVEL=info
SMITE_QUALITY_TESTS_ENABLED=false
```

---

## Configuration Examples

### Minimal Configuration

```json
{
  "enabled": true
}
```

All other settings use defaults.

### Strict Configuration

```json
{
  "enabled": true,
  "logLevel": "info",
  "maxRetries": 3,
  "complexity": {
    "maxCyclomaticComplexity": 5,
    "maxCognitiveComplexity": 8,
    "maxNestingDepth": 3,
    "maxFunctionLength": 30,
    "maxParameterCount": 4
  },
  "security": {
    "enabled": true,
    "rules": [
      { "id": "sql-injection", "enabled": true },
      { "id": "xss-vulnerability", "enabled": true },
      { "id": "weak-crypto", "enabled": true },
      { "id": "hardcoded-secret", "enabled": true }
    ]
  },
  "semantics": {
    "enabled": true,
    "checks": [
      { "type": "api-contract", "enabled": true, "severity": "error" },
      { "type": "type-consistency", "enabled": true, "severity": "error" }
    ]
  },
  "tests": {
    "enabled": true,
    "failOnTestFailure": true
  }
}
```

### Lenient Configuration

```json
{
  "enabled": true,
  "complexity": {
    "maxCyclomaticComplexity": 20,
    "maxCognitiveComplexity": 30,
    "maxNestingDepth": 6
  },
  "semantics": {
    "enabled": false
  },
  "security": {
    "enabled": true,
    "rules": [
      { "id": "sql-injection", "enabled": true },
      { "id": "hardcoded-secret", "enabled": true }
    ]
  }
}
```

### Next.js API Routes

```json
{
  "enabled": true,
  "include": [
    "**/pages/api/**/*.ts",
    "**/app/api/**/*.ts",
    "**/src/**/*.ts"
  ],
  "exclude": [
    "**/*.test.ts",
    "**/node_modules/**"
  ],
  "complexity": {
    "maxCyclomaticComplexity": 8
  },
  "security": {
    "enabled": true,
    "rules": [
      { "id": "sql-injection", "enabled": true },
      { "id": "xss-vulnerability", "enabled": true }
    ]
  },
  "mcp": {
    "enabled": true,
    "serverPath": "./node_modules/@smite/docs-editor-mcp/dist/index.js",
    "triggers": {
      "openAPI": {
        "enabled": true,
        "filePatterns": ["**/pages/api/**/*.ts", "**/app/api/**/*.ts"],
        "frameworks": ["nextjs"]
      },
      "readme": {
        "enabled": true,
        "filePatterns": ["package.json", "**/src/**/*.ts"]
      }
    }
  }
}
```

### Monorepo Configuration

```json
{
  "enabled": true,
  "include": ["packages/*/src/**/*.ts"],
  "exclude": ["**/node_modules/**", "**/dist/**"],
  "overrides": [
    {
      "files": "packages/core/**/*.ts",
      "complexity": {
        "maxCyclomaticComplexity": 5
      },
      "tests": {
        "enabled": true,
        "failOnTestFailure": true
      }
    },
    {
      "files": "packages/web/**/*.ts",
      "complexity": {
        "maxCyclomaticComplexity": 10
      }
    },
    {
      "files": "packages/*/*.test.ts",
      "semantics": {
        "enabled": false
      }
    }
  ]
}
```

### CI/CD Configuration

```json
{
  "enabled": true,
  "logLevel": "error",
  "maxRetries": 0,
  "complexity": {
    "maxCyclomaticComplexity": 10
  },
  "security": {
    "enabled": true,
    "rules": [
      { "id": "sql-injection", "enabled": true },
      { "id": "hardcoded-secret", "enabled": true }
    ]
  },
  "tests": {
    "enabled": true,
    "failOnTestFailure": true
  },
  "output": {
    "format": "json"
  }
}
```

With environment variables:
```bash
export SMITE_QUALITY_LOG_LEVEL=error
export SMITE_QUALITY_MAX_RETRIES=0
export SMITE_QUALITY_TESTS_ENABLED=true
export SMITE_QUALITY_OUTPUT_FORMAT=json
```

---

## Configuration Validation

### Validate Configuration

```bash
quality-config validate .claude/.smite/quality.json
```

**Output:**
```
✅ Configuration is valid
```

**Invalid configuration:**
```
❌ Configuration validation failed:

  - /complexity/maxCyclomaticComplexity: must be >= 1
  - /security/rules/0/id: must be equal to one of the allowed values
  - /semantics/checks/0/type: must be equal to one of the allowed values
```

### Show Configuration

```bash
quality-config show
```

**Output:**
```json
{
  "enabled": true,
  "logLevel": "info",
  "maxRetries": 3,
  "complexity": {
    "maxCyclomaticComplexity": 10,
    ...
  },
  ...
}
```

### Show Defaults

```bash
quality-config show-defaults
```

---

## Troubleshooting Configuration

### Configuration Not Loading

**Symptoms:** Default settings are being used

**Solutions:**
1. Check file exists: `ls .claude/.smite/quality.json`
2. Validate JSON: `cat .claude/.smite/quality.json | jq`
3. Check syntax: `quality-config validate .claude/.smite/quality.json`
4. Check file permissions: `ls -la .claude/.smite/quality.json`

### Overrides Not Working

**Symptoms:** Per-file overrides are not applied

**Solutions:**
1. Check pattern order (more specific last)
2. Test pattern: Use glob tester
3. Check path separators (use `/` on all platforms)
4. Enable debug logging: `logLevel: "debug"`

### Environment Variables Ignored

**Symptoms:** Environment variables don't override config

**Solutions:**
1. Check variable name (case-sensitive)
2. Verify variable is set: `echo $SMITE_QUALITY_ENABLED`
3. Check value type: Use `true`/`false` (not `1`/`0`)
4. Restart Claude Code after setting variables

---

## Related Documentation

- [README.md](README.md) - User guide and quick start
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Troubleshooting guide
- [examples/](examples/) - Configuration examples

---

**Last Updated:** 2025-01-19
