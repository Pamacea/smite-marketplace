# Quality Gate Troubleshooting Guide

**Common issues and solutions for the Smite Quality Gate system.**

---

## Table of Contents

- [Quick Diagnosis](#quick-diagnosis)
- [Installation Issues](#installation-issues)
- [Hook Not Triggering](#hook-not-triggering)
- [Configuration Issues](#configuration-issues)
- [Validation Issues](#validation-issues)
- [Performance Issues](#performance-issues)
- [MCP Integration Issues](#mcp-integration-issues)
- [Test Execution Issues](#test-execution-issues)
- [Debugging Tips](#debugging-tips)
- [Getting Help](#getting-help)

---

## Quick Diagnosis

### Health Check Script

Run this script to diagnose common issues:

```bash
#!/bin/bash
# quality-gate-check.sh

echo "=== Quality Gate Health Check ==="
echo

# 1. Check installation
echo "1. Checking installation..."
if command -v judge-hook &> /dev/null; then
  echo "   ✓ judge-hook is installed"
  judge-hook --version
else
  echo "   ✗ judge-hook is not installed"
  echo "   Run: npm run install-hook"
fi
echo

# 2. Check configuration
echo "2. Checking configuration..."
if [ -f ".claude/.smite/quality.json" ]; then
  echo "   ✓ Configuration file exists"
  quality-config validate .claude/.smite/quality.json
else
  echo "   ✗ Configuration file not found"
  echo "   Run: npm run init-config"
fi
echo

# 3. Check log file
echo "3. Checking logs..."
if [ -f ".claude/.smite/judge-audit.log" ]; then
  echo "   ✓ Audit log exists"
  echo "   Last 5 entries:"
  tail -5 .claude/.smite/judge-audit.log | grep '"decision"'
else
  echo "   ℹ No audit log yet (no validations run)"
fi
echo

# 4. Check MCP server
echo "4. Checking MCP integration..."
MCP_ENABLED=$(grep -o '"enabled"[[:space:]]*:[[:space:]]*true' .claude/.smite/quality.json | grep mcp -A 1 | tail -1)
if [ -n "$MCP_ENABLED" ]; then
  echo "   ✓ MCP is enabled in config"
  MCP_PATH="./node_modules/@smite/docs-editor-mcp/dist/index.js"
  if [ -f "$MCP_PATH" ]; then
    echo "   ✓ MCP server exists"
  else
    echo "   ✗ MCP server not found"
    echo "   Run: cd plugins/docs-editor-mcp && npm run build"
  fi
else
  echo "   ℹ MCP is disabled"
fi
echo

echo "=== Health Check Complete ==="
```

**Usage:**
```bash
chmod +x quality-gate-check.sh
./quality-gate-check.sh
```

---

## Installation Issues

### Problem: Hook Not Installed

**Symptoms:**
- `judge-hook: command not found`
- Code changes are not validated

**Solutions:**

1. **Install the hook:**
```bash
cd plugins/quality-gate
npm run install-hook
```

2. **Verify installation:**
```bash
judge-hook --version
```

3. **Check npm global bin:**
```bash
npm bin -g
# Ensure this path is in your $PATH
```

---

### Problem: Build Errors

**Symptoms:**
- TypeScript compilation errors
- `Cannot find module` errors

**Solutions:**

1. **Clean and rebuild:**
```bash
cd plugins/quality-gate
npm run clean
npm install
npm run build
```

2. **Check TypeScript version:**
```bash
npm list typescript
# Should be 5.3.0 or higher
```

3. **Verify node version:**
```bash
node --version
# Should be 18+ or 20+
```

---

## Hook Not Triggering

### Problem: Code Changes Not Validated

**Symptoms:**
- Writing/editing files doesn't trigger validation
- No validation output in Claude Code

**Diagnosis:**

1. **Check if hook is installed:**
```bash
judge-hook --version
```

2. **Check configuration exists:**
```bash
ls .claude/.smite/quality.json
```

3. **Check if enabled:**
```bash
quality-config show | grep enabled
```

**Solutions:**

1. **Enable quality gate:**
```json
{
  "enabled": true
}
```

2. **Check file patterns:**
```bash
# Your files must match include patterns
quality-config show | grep -A 10 include
```

3. **Verify hook path:**
```bash
# Hook should be in PATH
which judge-hook
```

---

### Problem: Specific Files Not Validated

**Symptoms:**
- Some files are validated, others are not

**Diagnosis:**

1. **Check include/exclude patterns:**
```bash
quality-config show
```

2. **Test file matching:**
```javascript
// In Node.js
const minimatch = require('minimatch');

function testPattern(filePath, patterns) {
  return patterns.some(pattern => minimatch(filePath, pattern));
}

// Test your file
console.log(testPattern('src/api/users.ts', ['**/*.ts'])); // true
console.log(testPattern('src/api/users.test.ts', ['**/*.test.ts'])); // true
```

**Solutions:**

1. **Adjust include patterns:**
```json
{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/src/**/*.ts"
  ]
}
```

2. **Check exclude patterns:**
```json
{
  "exclude": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/node_modules/**"
  ]
}
```

3. **Use debug logging:**
```json
{
  "logLevel": "debug"
}
```

Check logs for file filtering decisions:
```bash
grep "File excluded" .claude/.smite/judge-audit.log
```

---

## Configuration Issues

### Problem: Invalid Configuration

**Symptoms:**
- Error loading configuration
- Default settings being used

**Diagnosis:**

```bash
quality-config validate .claude/.smite/quality.json
```

**Solutions:**

1. **Fix JSON syntax:**
```bash
# Validate JSON
cat .claude/.smite/quality.json | jq
```

2. **Check against schema:**
```bash
# Schema is at plugins/quality-gate/config-schema.json
# Compare your config with examples in CONFIG_REFERENCE.md
```

3. **Use interactive config:**
```bash
npm run init-config
```

---

### Problem: Overrides Not Working

**Symptoms:**
- Per-file overrides don't apply
- All files use same rules

**Diagnosis:**

1. **Check override order:**
```json
{
  "overrides": [
    { "files": "**/*.ts", "complexity": { ... } },      // Applied first
    { "files": "**/core/**/*.ts", "complexity": { ... } } // Applied last (wins)
  ]
}
```

2. **Test pattern matching:**
```javascript
// Test if your file matches the pattern
const pattern = "**/core/**/*.ts";
const filePath = "src/core/validation.ts";

const regex = pattern
  .replace(/\*\*/g, '.*')
  .replace(/\*/g, '[^/]*')
  .replace(/\?/g, '.');

console.log(new RegExp(`^${regex}$`).test(filePath)); // Should be true
```

**Solutions:**

1. **Reorder overrides (specific last):**
```json
{
  "overrides": [
    {
      "files": "**/*.ts",
      "complexity": { "maxCyclomaticComplexity": 15 }
    },
    {
      "files": "**/core/**/*.ts",
      "complexity": { "maxCyclomaticComplexity": 5 }
    }
  ]
}
```

2. **Use absolute patterns:**
```json
{
  "overrides": [
    {
      "files": "src/core/**/*.ts",
      "complexity": { "maxCyclomaticComplexity": 5 }
    }
  ]
}
```

3. **Enable debug logging:**
```bash
export SMITE_QUALITY_LOG_LEVEL=debug
# Check logs for override application
```

---

### Problem: Environment Variables Ignored

**Symptoms:**
- Environment variables don't override config

**Diagnosis:**

```bash
# Check if variable is set
echo $SMITE_QUALITY_ENABLED

# Check config
quality-config show | grep enabled
```

**Solutions:**

1. **Verify variable name (case-sensitive):**
```bash
# Correct
export SMITE_QUALITY_ENABLED=false

# Incorrect
export smite_quality_enabled=false
export SMITE_QUALITY_enabled=false
```

2. **Restart Claude Code:**
```bash
# Environment variables are read at startup
# Restart after setting variables
```

3. **Check boolean values:**
```bash
# Use true/false, not 1/0
export SMITE_QUALITY_ENABLED=true  # Correct
export SMITE_QUALITY_ENABLED=1     # Incorrect
```

---

## Validation Issues

### Problem: False Positives

**Symptoms:**
- Valid code is rejected
- Rules trigger incorrectly

**Common False Positives:**

1. **Complexity rules**
   - Nested callbacks
   - Error handling try/catch blocks
   - Type guards

2. **Security rules**
   - String concatenation (not user input)
   - HTML templating (sanitized)
   - Test fixtures

**Solutions:**

1. **Adjust thresholds:**
```json
{
  "complexity": {
    "maxCyclomaticComplexity": 15,
    "maxCognitiveComplexity": 20
  }
}
```

2. **Use per-file overrides:**
```json
{
  "overrides": [
    {
      "files": "**/legacy/**/*.ts",
      "complexity": { "maxCyclomaticComplexity": 20 }
    }
  ]
}
```

3. **Disable specific rules:**
```json
{
  "security": {
    "rules": [
      { "id": "weak-crypto", "enabled": false }
    ]
  }
}
```

4. **Report false positives:**
```bash
# File an issue on GitHub
# Include: code snippet, config, expected behavior
```

---

### Problem: Parse Errors

**Symptoms:**
- "Failed to parse file" errors
- Syntax errors reported

**Diagnosis:**

1. **Check TypeScript syntax:**
```bash
tsc --noEmit path/to/file.ts
```

2. **Verify TypeScript version:**
```bash
npm list typescript
```

**Solutions:**

1. **Fix syntax errors:**
```typescript
// Check for:
// - Missing semicolons
// - Unmatched brackets
// - Invalid TypeScript syntax
```

2. **Exclude problematic files:**
```json
{
  "exclude": [
    "**/*.generated.ts",
    "**/vendor/**/*.ts"
  ]
}
```

3. **Check tsconfig compatibility:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs"
  }
}
```

---

### Problem: Too Many Issues

**Symptoms:**
- Validation fails with many issues
- Overwhelming feedback

**Solutions:**

1. **Focus on critical issues first:**
```json
{
  "security": {
    "enabled": true,
    "rules": [
      { "id": "sql-injection", "enabled": true },
      { "id": "xss-vulnerability", "enabled": true }
      // Disable less critical rules initially
    ]
  }
}
```

2. **Incremental approach:**
```json
// Start with lenient settings
{
  "complexity": {
    "maxCyclomaticComplexity": 20
  },
  "semantics": {
    "enabled": false
  }
}

// Gradually tighten as code improves
```

3. **Use fix-on-violation workflow:**
```json
{
  "maxRetries": 1
}
```

Fix issues incrementally rather than all at once.

---

## Performance Issues

### Problem: Slow Validation

**Symptoms:**
- Validation takes too long
- Delays in code editing

**Diagnosis:**

1. **Check analysis time:**
```bash
grep "analysisTimeMs" .claude/.smite/judge-audit.log | tail -10
```

2. **Profile with debug mode:**
```bash
export SMITE_QUALITY_LOG_LEVEL=debug
# Check timestamps in logs
```

**Solutions:**

1. **Disable tests (slow):**
```json
{
  "tests": {
    "enabled": false
  }
}
```

2. **Reduce file scope:**
```json
{
  "include": [
    "src/**/*.ts",
    "lib/**/*.ts"
    // Remove broad patterns like "**/*.ts"
  ]
}
```

3. **Exclude generated files:**
```json
{
  "exclude": [
    "**/*.generated.ts",
    "**/dist/**",
    "**/build/**"
  ]
}
```

---

### Problem: High Memory Usage

**Symptoms:**
- Memory increases over time
- System slowdown

**Diagnosis:**

```bash
# Check memory usage
ps aux | grep judge-hook

# Monitor during validation
watch -n 1 'ps aux | grep judge-hook'
```

**Solutions:**

1. **Clear audit log:**
```bash
# Archive old logs
mv .claude/.smite/judge-audit.log .claude/.smite/judge-audit.log.old
```

2. **Disable verbose logging:**
```json
{
  "logLevel": "warn"  // Instead of "debug"
}
```

3. **Restart Claude Code periodically:**
   - Clear accumulated state
   - Free memory

---

## MCP Integration Issues

### Problem: MCP Server Not Found

**Symptoms:**
- "Failed to connect to MCP server"
- Documentation not updating

**Diagnosis:**

1. **Check MCP server exists:**
```bash
ls -la ./node_modules/@smite/docs-editor-mcp/dist/index.js
```

2. **Verify server path in config:**
```bash
quality-config show | grep serverPath
```

**Solutions:**

1. **Install MCP server:**
```bash
cd plugins/docs-editor-mcp
npm install
npm run build
```

2. **Update server path:**
```json
{
  "mcp": {
    "serverPath": "./node_modules/@smite/docs-editor-mcp/dist/index.js"
  }
}
```

3. **Use absolute path:**
```bash
export SMITE_QUALITY_MCP_SERVER_PATH=/absolute/path/to/mcp-server.js
```

---

### Problem: Documentation Not Updating

**Symptoms:**
- MCP is enabled but docs don't update
- No errors in logs

**Diagnosis:**

1. **Check MCP trigger patterns:**
```bash
quality-config show | grep -A 20 triggers
```

2. **Check audit log for MCP activity:**
```bash
grep "Triggering documentation" .claude/.smite/judge-audit.log
```

**Solutions:**

1. **Verify trigger patterns match your files:**
```json
{
  "mcp": {
    "triggers": {
      "openAPI": {
        "filePatterns": ["**/routes/**/*.ts", "**/api/**/*.ts"]
      }
    }
  }
}
```

2. **Check for critical issues:**
   - MCP tools won't run if there are critical security issues
   - Fix critical issues first

3. **Manually trigger MCP tools:**
```bash
docs-sync openapi --project-path . --output openapi.json
```

---

## Test Execution Issues

### Problem: Tests Failing During Validation

**Symptoms:**
- Validations fail due to test failures
- Tests pass locally but fail in quality gate

**Diagnosis:**

1. **Run tests manually:**
```bash
npm test
```

2. **Check test configuration:**
```bash
quality-config show | grep -A 10 tests
```

**Solutions:**

1. **Fix failing tests:**
```bash
npm test -- --coverage --watchAll=false
```

2. **Adjust test timeout:**
```json
{
  "tests": {
    "timeoutMs": 120000
  }
}
```

3. **Use specific test command:**
```json
{
  "tests": {
    "command": "npm run test:unit"
  }
}
```

4. **Disable fail-on-test-failure:**
```json
{
  "tests": {
    "failOnTestFailure": false
  }
}
```

---

### Problem: Test Framework Not Detected

**Symptoms:**
- Tests skipped (framework: "none")
- "No test framework detected"

**Solutions:**

1. **Explicitly specify framework:**
```json
{
  "tests": {
    "framework": "vitest"
  }
}
```

2. **Specify test command:**
```json
{
  "tests": {
    "command": "npm test"
  }
}
```

---

## Debugging Tips

### Enable Debug Mode

```bash
export SMITE_QUALITY_LOG_LEVEL=debug
```

Or in config:
```json
{
  "logLevel": "debug"
}
```

### Check Audit Logs

```bash
# View recent validations
tail -20 .claude/.smite/judge-audit.log | jq

# View only denials
grep '"decision": "deny"' .claude/.smite/judge-audit.log | tail -10

# View specific session
grep "session-123" .claude/.smite/judge-audit.log

# View issues
grep '"issuesCount"' .claude/.smite/judge-audit.log
```

### Manual Validation

```bash
# Validate a specific file
quality-check src/index.ts

# With custom config
quality-check --config .claude/.smite/quality-dev.json src/index.ts

# Output JSON
quality-check --format json src/index.ts | jq
```

### Configuration Testing

```bash
# Validate config
quality-config validate .claude/.smite/quality.json

# Show current config
quality-config show

# Show defaults
quality-config show-defaults

# Test file matching
quality-config test-file-pattern "src/api/users.ts"
```

### MCP Testing

```bash
# Test MCP connection
docs-sync openapi --project-path . --dry-run

# Check MCP server
node ./node_modules/@smite/docs-editor-mcp/dist/index.js
```

---

## Getting Help

### Before Asking for Help

1. **Run health check:**
```bash
./quality-gate-check.sh
```

2. **Gather information:**
```bash
# OS and version
uname -a

# Node version
node --version

# Quality gate version
judge-hook --version

# Config
quality-config show

# Recent logs
tail -50 .claude/.smite/judge-audit.log
```

3. **Create minimal reproduction:**
   - Smallest config that shows issue
   - Minimal code example
   - Steps to reproduce

### Report Issues

**GitHub Issues:** https://github.com/pamacea/smite/issues

**Include:**
- OS and Node version
- Quality gate version
- Configuration file
- Minimal code example
- Error messages
- Audit log excerpt

### Community

- **Discord:** [Smite Discord Server]
- **Discussions:** https://github.com/pamacea/smite/discussions
- **Documentation:** https://github.com/pamacea/smite/tree/main/plugins/quality-gate

---

## Quick Reference

### Common Commands

```bash
# Installation
npm run install-hook

# Configuration
npm run init-config
quality-config validate .claude/.smite/quality.json
quality-config show

# Manual validation
quality-check src/index.ts

# Documentation sync
docs-sync openapi --project-path .
docs-sync readme --project-path .

# Logs
tail -f .claude/.smite/judge-audit.log
grep "deny" .claude/.smite/judge-audit.log
```

### Environment Variables

```bash
# Disable quality gate
export SMITE_QUALITY_ENABLED=false

# Debug mode
export SMITE_QUALITY_LOG_LEVEL=debug

# Disable tests
export SMITE_QUALITY_TESTS_ENABLED=false

# Custom test command
export SMITE_QUALITY_TESTS_COMMAND="npm run test:fast"
```

### Config Patterns

```json
// Strict (core libraries)
{ "complexity": { "maxCyclomaticComplexity": 5 } }

// Lenient (legacy code)
{ "complexity": { "maxCyclomaticComplexity": 20 } }

// Tests only
{ "tests": { "enabled": true, "failOnTestFailure": true } }

// Security only
{ "security": { "enabled": true } }
```

---

## Related Documentation

- [README.md](README.md) - User guide
- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) - Configuration reference
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [INTEGRATION.md](INTEGRATION.md) - Integration guide
- [examples/](examples/) - Usage examples

---

**Last Updated:** 2025-01-19
