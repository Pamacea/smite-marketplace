# @smite/quality-gate - Marketplace Listing

**Code Quality Gate System for Claude Code**

[![Version](https://img.shields.io/npm/v/@smite/quality-gate)](https://www.npmjs.com/package/@smite/quality-gate)
[![License](https://img.shields.io/npm/l/@smite/quality-gate)](./LICENSE)
[![Smite](https://img.shields.io/badge/smite-v1.0.0+-blue.svg)](https://github.com/pamacea/smite)

---

## Overview

The Smite Quality Gate is an automated code quality validation system that intercepts file operations in Claude Code before they execute. Using AST-based static analysis, it validates code complexity, security vulnerabilities, and semantic quality, providing real-time feedback and automatic retry with context-aware correction prompts.

---

## Features

### Complexity Analysis

Multi-dimensional complexity metrics to maintain maintainable code:

- **Cyclomatic Complexity**: Measures decision points in code (if, for, while, case)
- **Cognitive Complexity**: Measures how difficult code is to understand (accounts for nesting)
- **Nesting Depth**: Tracks maximum nesting level of control structures
- **Function Length**: Enforces maximum lines per function
- **Parameter Count**: Limits function parameters for better testability

### Security Scanning

Automated detection of common security vulnerabilities:

- **SQL Injection**: Detects vulnerable string concatenation and template literals
- **XSS Vulnerabilities**: Identifies dangerous DOM manipulations (innerHTML, document.write)
- **Weak Cryptography**: Flags outdated algorithms (MD5, SHA1, DES, RC4)
- **Hardcoded Secrets**: Detects API keys, passwords, and tokens using regex patterns
- **Eval Usage**: Flags dynamic code execution vulnerabilities
- **Unsafe Regex**: Detects regular expressions vulnerable to ReDoS attacks

### Semantic Validation

Code quality and consistency checks:

- **Naming Conventions**: Enforces camelCase for functions/variables, PascalCase for classes
- **No Any**: Flags usage of `any` type, encourages specific types or `unknown`
- **No Type Assertions**: Suggests type guards instead of type assertions
- **Prefer Const**: Recommends `const` over `let` for immutable variables
- **No Console**: Optional flag for console.log statements in production code

### Feedback Loop

Intelligent retry mechanism for continuous improvement:

- **Context-Aware Feedback**: Specific error messages with line numbers and code snippets
- **Code Examples**: Shows how to fix issues with before/after examples
- **Automatic Retry**: Reinjects feedback into executor context for immediate correction
- **Configurable Retries**: Set maximum retry attempts (default: 3)

### Audit Trail

Complete validation history for compliance and review:

- **Structured Logging**: JSON-formatted audit logs
- **Session Tracking**: Links validations to Claude Code sessions
- **Decision Recording**: Logs allow/deny decisions with reasoning
- **Issue Details**: Complete list of violations with severity and location

---

## Use Cases

### 1. Enterprise Development Teams

Maintain code quality standards across large teams:

- Enforce complexity thresholds for maintainability
- Prevent security vulnerabilities before commit
- Automated code review without human bottleneck
- Onboard new developers with instant feedback

### 2. Open Source Projects

Ensure contributions meet quality standards:

- Validate pull requests automatically
- Enforce security best practices
- Maintain code consistency across contributors
- Reduce reviewer workload with automated checks

### 3. Security-Critical Applications

Protect against common vulnerabilities:

- Detect injection attacks (SQL, XSS, command injection)
- Identify weak cryptographic implementations
- Flag hardcoded secrets and credentials
- Enforce secure coding practices

### 4. Legacy Code Modernization

Gradually improve code quality:

- Set lenient thresholds initially, tighten over time
- Focus on critical security issues first
- Use audit logs to track improvement metrics
- Identify high-complexity functions for refactoring

---

## Benefits

### For Developers

- **Instant Feedback**: Catch issues before code is written
- **Learning Tool**: Understand why code violates rules with detailed explanations
- **Reduced Rework**: Fewer rejected pull requests and code reviews
- **Best Practices**: Learn security and complexity patterns automatically

### For Teams

- **Consistent Standards**: Enforce quality rules uniformly across the team
- **Reduced Technical Debt**: Prevent complexity accumulation
- **Faster Reviews**: Automated checks reduce manual review time
- **Compliance**: Maintain audit trail for security standards (OWASP, SOC2)

### For Organizations

- **Lower Risk**: Prevent security vulnerabilities before production
- **Cost Savings**: Reduce bug fixes and security incidents
- **Scalability**: Maintain quality as team and codebase grow
- **Metrics**: Track quality trends over time with audit logs

---

## Compatibility

### Smite Version

- **Minimum**: 1.0.0
- **Recommended**: Latest version
- **Type**: PreToolUse Hook

### Runtime Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0
- **Operating Systems**: Windows, macOS, Linux

### Integration

Works seamlessly with:
- Claude Code (all versions)
- TypeScript projects
- JavaScript projects (JSX, TSX supported)
- Any framework (React, Vue, Angular, Node.js, etc.)

---

## Comparison

| Feature | Smite Quality Gate | ESLint | SonarQube | CodeQL |
|---------|-------------------|--------|-----------|--------|
| **Real-time Hook** | ✅ | ❌ | ❌ | ❌ |
| **AST-Based** | ✅ | ✅ | ✅ | ✅ |
| **Security Scanning** | ✅ | Plugin | ✅ | ✅ |
| **Complexity Metrics** | ✅ | Plugin | ✅ | Partial |
| **Claude Code Integration** | ✅ | ❌ | ❌ | ❌ |
| **Feedback Loop** | ✅ | ❌ | ❌ | ❌ |
| **Zero Config** | ✅ | ❌ | ❌ | ❌ |
| **Setup Time** | < 2 min | ~30 min | ~2 hours | ~4 hours |

---

## Changelog

### Version 1.0.0 (2025-01-19)

**Initial Release**

Features:
- Multi-dimensional complexity analysis (cyclomatic, cognitive, nesting)
- Security vulnerability scanning (SQL injection, XSS, weak crypto, hardcoded secrets)
- Semantic validation (naming conventions, type safety)
- AST-based code parsing using TypeScript Compiler API
- Configurable rules and thresholds
- Automatic retry with context-aware feedback
- Audit logging with structured JSON output
- PreToolUse hook integration
- Zero-configuration setup with sensible defaults

---

## Installation

```bash
cd plugins/quality-gate
npm install
npm run build
npm run install-hook
```

See [INSTALL.md](./INSTALL.md) for detailed installation instructions.

---

## Documentation

- [README](./README.md) - Full feature documentation
- [INSTALL.md](./INSTALL.md) - Installation guide
- [quality.example.json](./quality.example.json) - Configuration reference
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

---

## Support

- **Issues**: [GitHub Issues](https://github.com/pamacea/smite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pamacea/smite/discussions)
- **Documentation**: [Full Docs](./README.md)

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Keywords

`claude-code`, `quality-gate`, `code-review`, `static-analysis`, `security`, `complexity`, `ast`, `validation`, `testing`, `typescript`, `code-quality`, `smite`, `smite-plugin`

---

## Categories

- **Quality & Testing**
- **Security**
- **Developer Tools**
- **Automation**

---

**Automated code quality validation for better, safer, more maintainable code.**
