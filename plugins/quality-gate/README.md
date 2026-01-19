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
