# 🛡️ Quality Gate Plugin

Comprehensive documentation for the `@smite/quality-gate` plugin is now located in the plugin directory.

## Quick Links

- **[Installation & Quick Start](../plugins/quality-gate/INSTALL.md)**
- **[Architecture Overview](../plugins/quality-gate/ARCHITECTURE.md)**
- **[Configuration Reference](../plugins/quality-gate/CONFIG_REFERENCE.md)**
- **[Integration Guide](../plugins/quality-gate/INTEGRATION.md)**
- **[Testing Guide](../plugins/quality-gate/TESTING.md)**
- **[Troubleshooting](../plugins/quality-gate/TROUBLESHOOTING.md)**
- **[Contributing](../plugins/quality-gate/CONTRIBUTING.md)**

## Overview

The Quality Gate plugin provides automatic code review through:
- **Complexity Analysis**: Validates cyclomatic complexity thresholds
- **Security Scanning**: Detects SQL injection, XSS, weak crypto, and more
- **Semantic Validation**: Ensures type consistency and naming conventions
- **Test Execution**: Runs tests automatically on code changes
- **Documentation Sync**: Integrates with MCP Scribe for automatic doc updates

## Installation

```bash
/plugin install quality-gate@smite
```

See [INSTALL.md](../plugins/quality-gate/INSTALL.md) for detailed instructions.
