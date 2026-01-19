# @smite/quality-gate

**Code quality gate system with complexity, semantic, and security validation for Claude Code.**

The Quality Gate is a PreToolUse hook that intercepts code changes (Write, Edit, MultiEdit) and validates them before allowing execution. It provides automatic feedback and retry mechanisms to help Claude write better code.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Validation Rules](#validation-rules)
- [Documentation Integration](#documentation-integration)
- [CLI Tools](#cli-tools)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)
- [API Reference](#api-reference)

---

## Features

### Code Quality Analysis

- **Complexity Analysis**: Detects high cyclomatic and cognitive complexity
  - Cyclomatic complexity (linearly independent paths)
  - Cognitive complexity (how hard code is to understand)
  - Nesting depth (control structure nesting)
  - Function length (lines of code)
  - Parameter count (interface complexity)

- **Security Scanning**: Identifies common vulnerabilities
  - SQL injection vulnerabilities
  - Cross-site scripting (XSS)
  - Weak cryptographic algorithms
  - Hardcoded secrets

- **Semantic Checks**: Validates code consistency
  - API contract violations
  - Type consistency
  - Naming conventions
  - Duplicate code detection

### Quality Gate Workflow

- **Automatic Validation**: Intercepts code changes before execution
- **Feedback Loop**: Provides context-aware correction prompts
- **Retry Mechanism**: Allows multiple attempts with progressive feedback
- **Audit Trail**: Logs all validation results for review
- **Test Execution**: Runs tests before allowing changes (optional)

### Documentation Integration

- **OpenAPI Sync**: Automatically updates API documentation
- **README Updates**: Keeps project documentation in sync
- **JSDoc Generation**: Generates inline code documentation

---

## Quick Start

### 1. Install

```bash
cd plugins/quality-gate
npm install
npm run build
npm run install-hook
```

### 2. Configure (Interactive)

```bash
npm run init-config
```

This interactive CLI will:
- Detect your project type (Node.js, Python, mixed)
- Identify frameworks and test frameworks
- Ask questions about your preferences
- Generate `.smite/quality.json` with sensible defaults

### 3. Validate

The quality gate automatically validates code changes. Try it:

```typescript
// src/example.ts - This will trigger complexity warnings
export function complexFunction(a: number, b: number, c: number, d: number, e: number) {
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (d > 0) {
          for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
              // High complexity code
              switch (e) {
                case 1:
                  return a + b;
                case 2:
                  return a - b;
                // ... many cases
              }
            }
          }
        }
      }
    }
  }
  return 0;
}
```

The gate will deny this change and provide feedback:
```
❌ Validation failed: complexity-max-cognitive-complexity

The function complexFunction has cognitive complexity of 45, which exceeds the threshold of 15.

Suggestion: Consider breaking this function into smaller, more focused functions.
```

### 4. Fix and Retry

```typescript
// Better: Broken down into smaller functions
function calculateBase(a: number, b: number): number {
  return a + b;
}

function applyMultiplier(value: number, multiplier: number): number {
  return value * multiplier;
}

function processRange(start: number, end: number, operation: (n: number) => number): number[] {
  const results: number[] = [];
  for (let i = start; i < end; i++) {
    results.push(operation(i));
  }
  return results;
}
```

This will pass validation!

---

## Installation

### Prerequisites

- Node.js 18+ or Python 3.8+
- Claude Code with hook support
- TypeScript project (or JavaScript with type checking)

### Install from npm

```bash
npm install @smite/quality-gate --save-dev
```

### Install from Source

```bash
cd plugins/quality-gate
npm install
npm run build
npm run install-hook
```

### Verify Installation

```bash
# Check if hook is installed
judge-hook --version

# Run a manual validation
quality-check src/index.ts
```

---

## Configuration

### Quick Configuration (Recommended)

Run the interactive configuration CLI:

```bash
npm run init-config
```

### Manual Configuration

Create `.smite/quality.json`:

```json
{
  "enabled": true,
  "logLevel": "info",
  "maxRetries": 3,
  "include": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
  "exclude": ["**/*.test.ts", "**/node_modules/**"],
  "complexity": {
    "maxCyclomaticComplexity": 10,
    "maxCognitiveComplexity": 15,
    "maxNestingDepth": 4,
    "maxFunctionLength": 50,
    "maxParameterCount": 5
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
  "tests": {
    "enabled": false,
    "timeoutMs": 60000,
    "failOnTestFailure": true
  },
  "mcp": {
    "enabled": false,
    "serverPath": "./node_modules/@smite/docs-editor-mcp/dist/index.js",
    "triggers": {
      "openAPI": {
        "enabled": true,
        "filePatterns": ["**/routes/**/*.ts", "**/api/**/*.ts"],
        "frameworks": ["express", "nextjs"]
      },
      "readme": {
        "enabled": true,
        "filePatterns": ["**/src/**/*.ts", "package.json"]
      },
      "jsdoc": {
        "enabled": true,
        "filePatterns": ["**/*.ts", "**/*.tsx"]
      }
    }
  }
}
```

### Per-File Overrides

Apply different rules to specific files:

```json
{
  "overrides": [
    {
      "files": "**/core/**/*.ts",
      "complexity": {
        "maxCyclomaticComplexity": 5,
        "maxCognitiveComplexity": 8
      }
    },
    {
      "files": "**/*.test.ts",
      "complexity": {
        "maxCyclomaticComplexity": 15
      },
      "semantics": {
        "enabled": false
      }
    }
  ]
}
```

### Environment Variables

Override configuration with environment variables:

```bash
# Disable quality gate
export SMITE_QUALITY_ENABLED=false

# Set debug logging
export SMITE_QUALITY_LOG_LEVEL=debug

# Adjust complexity threshold
export SMITE_QUALITY_COMPLEXITY_MAX_CYCLOMATIC_COMPLEXITY=15

# Enable tests
export SMITE_QUALITY_TESTS_ENABLED=true

# Custom test command
export SMITE_QUALITY_TESTS_COMMAND="npm run test:fast"
```

See [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) for all configuration options.

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Claude Code                          │
│                   (Tool Use Request)                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PreToolUse Hook                          │
│                   (judge-hook.js)                           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Judge Core                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. TypeScript Parser (AST Generation)               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. Complexity Analyzer                               │  │
│  │     - Cyclomatic Complexity                           │  │
│  │     - Cognitive Complexity                            │  │
│  │     - Nesting Depth                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. Security Scanner                                  │  │
│  │     - SQL Injection                                   │  │
│  │     - XSS Vulnerabilities                            │  │
│  │     - Weak Crypto                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. Semantic Checker                                  │  │
│  │     - Type Consistency                               │  │
│  │     - Naming Conventions                             │  │
│  │     - Duplicate Code                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  5. Test Runner (Optional)                            │  │
│  │     - Jest/Vitest/Mocha/Pytest                       │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
              [ALLOW]            [DENY]
                  │                   │
                  │            ┌──────┴──────┐
                  │            │             │
                  │            ▼             ▼
                  │    Feedback Generator  Retry
                  │    Context Injection   State
                  │            │             │
                  │            └──────┬──────┘
                  │                   │
                  ▼                   ▼
          Code Written        Claude Retries
                              with Feedback
```

### Hook Pipeline

The Quality Gate implements a multi-stage validation pipeline:

1. **Code Reception**: Hook receives tool use request
2. **File Filtering**: Checks if file should be validated
3. **AST Parsing**: Generates Abstract Syntax Tree
4. **Multi-Dimensional Analysis**:
   - Complexity metrics calculation
   - Security pattern matching
   - Semantic consistency checks
   - Test execution (if enabled)
5. **Decision Engine**: Aggregates results and decides
6. **Feedback Generation**: Creates correction prompt if denied
7. **Documentation Trigger**: Updates docs if allowed

### Data Flow

```
Input: Write/Edit/MultiEdit Tool Use
  ↓
Parse: TypeScript Compiler API → AST
  ↓
Analyze: Multiple Analyzers → Issues + Metrics
  ↓
Decide: Decision Engine → Allow/Deny/Ask
  ↓
Output: Hook Response + Feedback (if denied)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

---

## Validation Rules

### Complexity Rules

| Rule | Default | Description |
|------|---------|-------------|
| `complexity-max-complexity` | 10 | Maximum cyclomatic complexity per function |
| `complexity-max-cognitive-complexity` | 15 | Maximum cognitive complexity per function |
| `complexity-max-nesting` | 4 | Maximum nesting depth of control structures |
| `complexity-max-length` | 50 | Maximum function length in lines |
| `complexity-max-parameters` | 5 | Maximum number of function parameters |

**Example Violation:**

```typescript
// ❌ Violates complexity-max-nesting (depth: 5)
function processData(data: Data[]) {
  if (data.length > 0) {
    for (const item of data) {
      if (item.valid) {
        if (item.type === 'A') {
          if (item.value > 100) {
            // 5 levels deep
          }
        }
      }
    }
  }
}

// ✅ Fixed: Extract nested logic
function shouldProcessItem(item: Data): boolean {
  return item.valid && item.type === 'A' && item.value > 100;
}

function processData(data: Data[]) {
  const validItems = data.filter(shouldProcessItem);
  // Process valid items
}
```

### Security Rules

| Rule | Severity | CWE | OWASP |
|------|----------|-----|-------|
| `sql-injection` | CRITICAL | CWE-89 | A01:2021 |
| `xss-vulnerability` | CRITICAL | CWE-79 | A03:2021 |
| `weak-crypto` | ERROR | CWE-327 | A02:2021 |
| `hardcoded-secret` | CRITICAL | CWE-798 | A07:2021 |

**Example Violation:**

```typescript
// ❌ Violates sql-injection
const userId = req.body.id;
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query);

// ✅ Fixed: Use parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### Semantic Rules

| Rule | Default Severity | Description |
|------|------------------|-------------|
| `api-contract` | ERROR | Validates API contract consistency |
| `type-consistency` | ERROR | Checks type annotations |
| `naming` | WARNING | Enforces naming conventions (disabled by default) |
| `duplicate-code` | WARNING | Detects duplicate code (disabled by default) |

---

## Documentation Integration

The Quality Gate can automatically trigger documentation updates via MCP (Model Context Protocol).

### OpenAPI Sync

Automatically updates OpenAPI/Swagger specifications when API routes change:

```json
{
  "mcp": {
    "enabled": true,
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

**How it works:**
1. Detects changes to API route files
2. Scans route definitions (Express, Next.js, Fastify, Koa)
3. Generates OpenAPI specification
4. Merges with existing spec (preserves manual edits)
5. Writes updated spec to file

**Supported Frameworks:**
- Express.js (`app.get()`, `router.post()`, etc.)
- Next.js (App Router, Pages API)
- Fastify (planned)
- Koa (planned)

### README Updates

Keeps README sections in sync with code:

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

**Auto-updated sections:**
- Installation (dependencies)
- Architecture (framework detection)
- Project Structure (directory tree)

**Manual edit protection:**
```markdown
<!-- SMITE:MANUAL:START -->
## Custom Section
This content is preserved during auto-updates.
<!-- SMITE:MANUAL:END -->
```

### JSDoc Generation

Automatically generates JSDoc comments:

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

**Generates:**
- Function descriptions
- Parameter types and descriptions
- Return type documentation
- Example usage (optional)

---

## CLI Tools

### judge-hook

Main hook entry point (installed automatically).

```bash
# Manual testing
judge-hook validate src/index.ts

# Check version
judge-hook --version

# Show help
judge-hook --help
```

### quality-check

Manual validation tool.

```bash
# Validate a file
quality-check src/index.ts

# Validate with custom config
quality-check --config .smite/quality-custom.json src/index.ts

# Output format
quality-check --format json src/index.ts > report.json

# Verbose output
quality-check --verbose src/index.ts
```

### docs-sync

Manual documentation sync tool.

```bash
# Sync OpenAPI spec
docs-sync openapi --project-path . --output openapi.json

# Sync README
docs-sync readme --project-path . --sections all

# Generate JSDoc
docs-sync jsdoc --project-path . --files "src/**/*.ts"
```

### quality-config

Configuration management tool.

```bash
# Initialize config (interactive)
quality-config init

# Validate config
quality-config validate .smite/quality.json

# Show current config
quality-config show

# Show defaults
quality-config show-defaults
```

---

## Troubleshooting

### Common Issues

#### Hook Not Triggering

**Problem:** Code changes are not being validated.

**Solutions:**
1. Check hook is installed: `judge-hook --version`
2. Verify config exists: `ls .smite/quality.json`
3. Check enabled flag: `quality-config show`
4. Check file patterns: Ensure your files match `include` patterns

#### False Positives

**Problem:** Valid code is being rejected.

**Solutions:**
1. Adjust thresholds in `.smite/quality.json`
2. Use per-file overrides for specific files
3. Disable specific rules: `{ "id": "rule-name", "enabled": false }`
4. Use environment variables for temporary overrides

#### Parse Errors

**Problem:** "Failed to parse file" errors.

**Solutions:**
1. Check TypeScript version compatibility
2. Verify file has valid syntax
3. Exclude problematic files: `exclude: ["**/generated/**"]`
4. Check for TypeScript errors: `tsc --noEmit`

#### Test Failures

**Problem:** Tests fail during validation.

**Solutions:**
1. Run tests manually first: `npm test`
2. Adjust test timeout: `tests.timeoutMs: 120000`
3. Disable test validation: `tests.enabled: false`
4. Use different test command: `tests.command: "npm run test:unit"`

### Debug Mode

Enable debug logging:

```json
{
  "logLevel": "debug"
}
```

Or via environment variable:

```bash
export SMITE_QUALITY_LOG_LEVEL=debug
```

### Audit Logs

View validation history:

```bash
# View audit log
cat .smite/judge-audit.log

# Filter by session
grep "session-123" .smite/judge-audit.log

# View only denials
grep '"decision": "deny"' .smite/judge-audit.log
```

### Getting Help

1. Check logs: `.smite/judge-audit.log`
2. Enable debug mode: `logLevel: "debug"`
3. Validate config: `quality-config validate`
4. Review [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md)
5. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed guides

---

## Examples

### Strict Configuration for Core Libraries

```json
{
  "enabled": true,
  "complexity": {
    "maxCyclomaticComplexity": 5,
    "maxCognitiveComplexity": 8,
    "maxNestingDepth": 3
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
  "tests": {
    "enabled": true,
    "failOnTestFailure": true
  }
}
```

### Lenient Configuration for Legacy Code

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

### Next.js API Routes Configuration

```json
{
  "enabled": true,
  "include": [
    "**/pages/api/**/*.ts",
    "**/app/api/**/*.ts",
    "**/src/**/*.ts"
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
    "triggers": {
      "openAPI": {
        "enabled": true,
        "frameworks": ["nextjs"]
      }
    }
  }
}
```

See [examples/](examples/) directory for more examples.

---

## API Reference

### Judge Class

Main orchestrator class that coordinates all validation components.

```typescript
import { Judge } from '@smite/quality-gate';

const judge = new Judge(cwd);
const result = await judge.validate(input);
```

**Methods:**
- `validate(input: JudgeHookInput): Promise<JudgeHookOutput>` - Main validation entry point

### ConfigManager Class

Manages configuration loading, validation, and overrides.

```typescript
import { ConfigManager } from '@smite/quality-gate';

const configManager = new ConfigManager(cwd);
const config = configManager.getConfig();
const fileConfig = configManager.getConfigForFile(filePath);
```

**Methods:**
- `getConfig(): JudgeConfig` - Get current configuration
- `getConfigForFile(filePath: string): JudgeConfig` - Get config with overrides applied
- `shouldValidateFile(filePath: string): boolean` - Check if file should be validated
- `reloadConfig(): void` - Reload configuration from file

### TypeScriptParser Class

Parses TypeScript code and generates AST.

```typescript
import { TypeScriptParser } from '@smite/quality-gate';

const parser = new TypeScriptParser(logger);
const sourceFile = parser.parseCode(filePath, content);
```

**Methods:**
- `parseCode(filePath: string, content: string): ts.SourceFile | null` - Parse code to AST

### ComplexityAnalyzer Class

Analyzes code complexity metrics.

```typescript
import { ComplexityAnalyzer } from '@smite/quality-gate';

const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
analyzer.analyze(sourceFile, context);
```

**Metrics:**
- Cyclomatic complexity
- Cognitive complexity
- Nesting depth
- Function length
- Parameter count

### SecurityScanner Class

Scans for security vulnerabilities.

```typescript
import { SecurityScanner } from '@smite/quality-gate';

const scanner = new SecurityScanner(parser, logger, rules);
scanner.scan(sourceFile, context);
```

**Rules:**
- SQL injection
- XSS vulnerabilities
- Weak cryptography
- Hardcoded secrets

See [API Reference](docs/API.md) for complete API documentation.

---

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run watch

# Type check
npm run typecheck

# Lint
npm run lint

# Format code
npm run format

# Run tests
npm test
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture and design
- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) - Complete configuration reference
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Troubleshooting guide
- [INTEGRATION.md](INTEGRATION.md) - Integration guide for extending the system
- [examples/](examples/) - Usage examples and patterns

---

## License

MIT

---

## Authors

- Pamacea (contact@pamacea.com)

---

## References

- [Using the TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- [Cognitive Complexity](https://www.sonarsource.com/resources/cognitive-complexity.html)
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
