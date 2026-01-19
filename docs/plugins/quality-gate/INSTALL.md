# Installation Guide - @smite/quality-gate

Complete installation guide for the Smite Quality Gate system.

## Prerequisites

Before installing, ensure you have:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **TypeScript**: Version 5.0.0 or higher (for development)
- **Smite**: Version 1.0.0 or higher
- **Git**: For hook installation

Verify your environment:

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
tsc --version   # Should be >= 5.0.0
```

## Quick Start

### 1. Navigate to Plugin Directory

```bash
cd plugins/quality-gate
```

### 2. Install Dependencies

```bash
npm install
```

This installs all required dependencies including:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `typescript` - TypeScript compiler
- `zod` - Schema validation

### 3. Build the Plugin

```bash
npm run build
```

This compiles TypeScript source files to the `dist/` directory.

### 4. Install the Hook

```bash
npm run install-hook
```

This installs the PreToolUse hook that intercepts file operations before they execute.

## Verification

Verify the installation was successful:

```bash
# Check hook is installed
test -f .smite/hooks/pre-tool-use/judge-hook.js && echo "Hook installed"

# Check config exists
test -f .smite/quality.json && echo "Config exists"

# View hook location
ls -la .smite/hooks/pre-tool-use/
```

Expected output:
```
Hook installed
Config exists
.smite/hooks/pre-tool-use/judge-hook.js
```

## Configuration

After installation, create your configuration file at `.smite/quality.json`:

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
  "semantic": {
    "enabled": true,
    "rules": [
      { "id": "naming-convention", "enabled": true },
      { "id": "no-any", "enabled": true },
      { "id": "no-type-assertion", "enabled": true }
    ]
  }
}
```

See [quality.example.json](./quality.example.json) for a fully documented example.

## Post-Installation Steps

### 1. Test the Hook

Create a test file to verify the quality gate is working:

```typescript
// test-quality.ts
export function complexFunction(a: number, b: number, c: number, d: number, e: number, f: number): number {
  if (a > 0) {
    if (b > 0) {
      if (c > 0) {
        if (d > 0) {
          if (e > 0) {
            return a + b + c + d + e + f;
          }
        }
      }
    }
  }
  return 0;
}
```

Try to write this file using Claude Code - the quality gate should flag it for:
- High cyclomatic complexity
- Excessive nesting depth
- Too many parameters

### 2. Review Audit Logs

Check the audit log after validation:

```bash
cat .smite/judge-audit.log
```

### 3. Customize Rules

Adjust thresholds in `.smite/quality.json` based on your project's needs:

- **Stricter**: Lower complexity thresholds for critical code
- **Lenient**: Raise thresholds for legacy code or prototypes
- **Custom**: Add project-specific rules

## Installation Modes

### Local Installation (Recommended)

Install per-project as shown above. This allows project-specific configuration.

```bash
cd plugins/quality-gate
npm install
npm run build
npm run install-hook
```

### Global Installation

For system-wide usage (not recommended - use per-project instead):

```bash
cd plugins/quality-gate
npm install -g .
npm link
```

## Troubleshooting

### Hook Not Found

**Problem**: Hook doesn't intercept file operations

**Solution**:
```bash
# Reinstall the hook
npm run install-hook

# Verify hook exists
ls -la .smite/hooks/pre-tool-use/judge-hook.js
```

### TypeScript Compilation Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Clean and rebuild
npm run clean
npm run build

# Check TypeScript version
npm list typescript
```

### Configuration Not Loading

**Problem**: Rules not being applied

**Solution**:
```bash
# Verify config exists
cat .smite/quality.json

# Validate JSON syntax
cat .smite/quality.json | jq .

# Check log level
grep "logLevel" .smite/quality.json
```

### Permission Errors

**Problem**: Cannot create hook directory

**Solution**:
```bash
# Create directory manually
mkdir -p .smite/hooks/pre-tool-use

# Set permissions
chmod 755 .smite/hooks/pre-tool-use
```

## Uninstallation

To completely remove the quality gate:

```bash
# Remove the hook
rm -f .smite/hooks/pre-tool-use/judge-hook.js

# Remove config (optional)
rm -f .smite/quality.json

# Remove audit logs (optional)
rm -f .smite/judge-audit.log

# Uninstall dependencies
cd plugins/quality-gate
npm uninstall
```

## Next Steps

- Read the [README](./README.md) for detailed usage
- Check [quality.example.json](./quality.example.json) for configuration options
- Review the [MARKETPLACE.md](./MARKETPLACE.md) for feature list
- Report issues at [GitHub Issues](https://github.com/pamacea/smite/issues)

## Support

- Documentation: [README.md](./README.md)
- Issues: [GitHub Issues](https://github.com/pamacea/smite/issues)
- Discussions: [GitHub Discussions](https://github.com/pamacea/smite/discussions)
