# @smite/quality-gate

Code quality gate system with complexity, semantic, and security validation for Claude Code.

## Features

- **Complexity Analysis**: Detects high cyclomatic and cognitive complexity
- **Security Scanning**: Identifies SQL injection, XSS, weak crypto, and hardcoded secrets
- **Semantic Checks**: Validates naming conventions and type consistency
- **Feedback Loop**: Automatic retry with context-aware correction prompts
- **Audit Trail**: Logs all validation results for review

## Installation

```bash
cd plugins/quality-gate
npm install
npm run build
npm run install-hook
```

## Configuration

### Quick Start

Run the interactive configuration CLI to generate a customized config:

```bash
npm run init-config
```

This will:
- Detect your project type (Node.js, Python, mixed)
- Identify frameworks and test frameworks
- Ask questions about your preferences
- Generate `.smite/quality.json` with sensible defaults

### Manual Configuration

Create or edit `.smite/quality.json` in your project root:

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
      { "id": "xss-vulnerability", "enabled": true }
    ]
  }
}
```

### Configuration Options

#### Master Settings

- **enabled** (boolean): Master toggle for the quality gate system
- **logLevel** ('debug' | 'info' | 'warn' | 'error'): Logging verbosity
- **maxRetries** (number): Maximum retry attempts when validation fails

#### File Filtering

- **include** (string[]): Glob patterns for files to validate
- **exclude** (string[]): Glob patterns for files to exclude

#### Complexity Thresholds

- **complexity.maxCyclomaticComplexity** (number): Maximum cyclomatic complexity (default: 10)
- **complexity.maxCognitiveComplexity** (number): Maximum cognitive complexity (default: 15)
- **complexity.maxNestingDepth** (number): Maximum nesting depth (default: 4)
- **complexity.maxFunctionLength** (number): Maximum function length in lines (default: 50)
- **complexity.maxParameterCount** (number): Maximum parameter count (default: 5)

#### Semantic Checks

- **semantics.enabled** (boolean): Enable semantic analysis
- **semantics.checks** (array): Individual check configurations
  - **type** ('api-contract' | 'type-consistency' | 'naming' | 'duplicate-code'): Check type
  - **enabled** (boolean): Enable this check
  - **severity** ('error' | 'warning'): Violation severity

#### Security Rules

- **security.enabled** (boolean): Enable security scanning
- **security.rules** (array): Security rule configurations
  - **id** ('sql-injection' | 'xss-vulnerability' | 'weak-crypto' | 'hardcoded-secret'): Rule ID
  - **enabled** (boolean): Enable this rule
  - **severity** ('critical' | 'error' | 'warning'): Override severity
  - **customPattern** (string): Custom regex pattern

#### Test Execution

- **tests.enabled** (boolean): Enable automated test execution
- **tests.command** (string): Custom test command (overrides auto-detection)
- **tests.framework** ('jest' | 'vitest' | 'mocha' | 'pytest'): Test framework
- **tests.timeoutMs** (number): Test execution timeout (default: 60000)
- **tests.failOnTestFailure** (boolean): Deny changes on test failure

#### MCP Integration

- **mcp.enabled** (boolean): Enable documentation MCP triggers
- **mcp.serverPath** (string): Path to MCP server
- **mcp.triggers.openAPI**: OpenAPI documentation settings
- **mcp.triggers.readme**: README documentation settings
- **mcp.triggers.jsdoc**: JSDoc documentation settings

### Per-File Configuration Overrides

Apply different rules to specific files or directories:

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

Override patterns are evaluated from most specific to least specific. Later overrides in the array take precedence.

### Environment Variables

Override configuration using environment variables (prefix: `SMITE_QUALITY_`):

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

Environment variables take precedence over file-based configuration.

### JSON Schema Validation

The configuration file is validated against a JSON Schema. If your configuration is invalid, the quality gate will:

1. Log detailed validation errors
2. Show the exact path and issue for each error
3. Fall back to default configuration
4. Continue operation (failsafe behavior)

View the schema: `plugins/quality-gate/config-schema.json`

### Example Configurations

#### Strict Configuration for Core Libraries

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

#### Lenient Configuration for Legacy Code

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

#### Next.js API Routes Configuration

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

## How It Works

1. **Hook Integration**: The Judge hook intercepts `Write`, `Edit`, and `MultiEdit` tool calls before they execute
2. **AST Parsing**: Code is parsed using TypeScript Compiler API to generate an Abstract Syntax Tree
3. **Multi-Dimensional Analysis**:
   - **Complexity Analyzer**: Calculates cyclomatic complexity, cognitive complexity, nesting depth
   - **Security Scanner**: Pattern matching for known security vulnerabilities
   - **Semantic Checker**: Validates naming conventions and type usage
4. **Decision Engine**: Aggregates results and makes allow/deny decision
5. **Feedback Loop**: If denied, correction prompt is reinjected into executor context with specific feedback

## Architecture

```
┌─────────────────────┐
│   Claude Code       │
│  (Tool Use Call)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  PreToolUse Hook    │
│   (judge-hook.js)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Judge Core      │
│  - Parser           │
│  - Complexity       │
│  - Security         │
│  - Semantic         │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │         │
      ▼         ▼
   [ALLOW]  [DENY]
      │         │
      │         └──► Feedback Generator
      │                    │
      │                    └──► Context Re-injection
      │
      ▼
   Code Written
```

## Validation Rules

### Complexity Rules

- **complexity-max-complexity**: Cyclomatic complexity exceeds threshold (default: 10)
- **complexity-max-cognitive-complexity**: Cognitive complexity exceeds threshold (default: 15)
- **complexity-max-nesting**: Nesting depth exceeds threshold (default: 4)
- **complexity-max-length**: Function length exceeds threshold (default: 50 lines)
- **complexity-max-parameters**: Parameter count exceeds threshold (default: 5)

### Security Rules

- **sql-injection**: Detects SQL injection vulnerabilities (CRITICAL)
- **xss-vulnerability**: Detects XSS vulnerabilities (CRITICAL)
- **weak-crypto**: Detects weak cryptographic algorithms (ERROR)
- **hardcoded-secret**: Detects hardcoded secrets (CRITICAL)

### Semantic Rules

- **semantic-naming-convention**: Validates camelCase naming for functions and variables
- **semantic-no-any**: Flags usage of `any` type
- **semantic-no-type-assertion**: Flags type assertions

## Audit Logs

Validation results are logged to `.smite/judge-audit.log`:

```json
{
  "timestamp": "2025-01-19T10:30:00.000Z",
  "sessionId": "session-123",
  "file": "src/api/users.ts",
  "decision": "deny",
  "issuesCount": 3,
  "issues": [
    {
      "type": "security",
      "severity": "critical",
      "message": "Potential SQL injection vulnerability"
    }
  ]
}
```

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
```

## References

- [Using the TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [TypeScript Compiler API Documentation](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- [OWASP Top 10 2021](https://owasp.org/Top10/)

## License

MIT
