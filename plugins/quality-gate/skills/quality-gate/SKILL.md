# Quality Gate Skill

## Mission

Automated code quality validation through complexity analysis, security scanning, semantic validation, and test execution.

## Core Workflow

1. **Input**: Code changes (Write/Edit operations trigger PreToolUse hook)
2. **Process**:
   - Parse code with TypeScript compiler API
   - Analyze complexity (cyclomatic, cognitive)
   - Scan for security issues (SQL injection, XSS, weak crypto, secrets)
   - Validate semantics (type consistency, naming conventions)
   - Run tests (Jest, Vitest, Mocha, pytest)
   - Provide feedback and retry prompts
3. **Output**: Validation result with pass/fail and fix suggestions

## Key Principles

- **Zero-debt enforcement**: Block code that doesn't meet standards
- **Complexity thresholds**: Max 10 cyclomatic, 15 cognitive
- **Security scanning**: Detect common vulnerabilities automatically
- **Semantic validation**: Ensure type safety and consistency
- **Automatic feedback**: Retry prompts with context-aware suggestions

## Integration

- **Trigger**: PreToolUse hook on Write/Edit operations
- **Integrates with**: All development workflows
- **Works with**: @smite/docs-editor-mcp (documentation sync)

## Configuration

- **Config file**: `.claude/.smite/quality.json`
- **Complexity**: maxCyclomaticComplexity: 10, maxCognitiveComplexity: 15
- **Performance**: maxMemoryMB: 8192, batchSize: 10
- **Exclude**: node_modules, .next, dist, .claude

## Error Handling

- **Complexity exceeded**: Suggest refactoring or splitting functions
- **Security issues**: Block commit, provide fix examples
- **Test failures**: Block commit, require test fixes
- **Semantic errors**: Block commit, require type fixes

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
