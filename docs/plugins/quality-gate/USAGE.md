# Quick Start Guide

## Installation

```bash
cd plugins/quality-gate
npm install
npm run build
npm run install-hook
```

## How to Use

The Quality Gate hook is now active. It will automatically validate all `Write`, `Edit`, and `MultiEdit` operations.

### What Gets Validated

By default, the hook validates:
- **Files**: TypeScript, JavaScript, TSX, JSX
- **Excluded**: Test files, node_modules, dist, build

### Validation Rules

#### Complexity
- Functions with cyclomatic complexity > 10
- Functions with cognitive complexity > 15
- Nesting depth > 4 levels
- Functions longer than 50 lines
- Functions with > 5 parameters

#### Security
- SQL injection patterns
- XSS vulnerabilities (innerHTML, dangerouslySetInnerHTML)
- Weak crypto (md5, sha1, createCipher)
- Hardcoded secrets (password, secret, key, token)

#### Semantics (Optional)
- Type usage (no `any` type)
- Type assertions (`as` keyword)
- Naming conventions (camelCase)

### Configuration

Edit `.claude/.smite/quality.json` in your project root:

```json
{
  "enabled": true,
  "logLevel": "info",
  "maxRetries": 3,
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
  "semantics": {
    "enabled": true,
    "checks": [
      { "type": "type-consistency", "enabled": true, "severity": "error" },
      { "type": "naming", "enabled": false, "severity": "warning" }
    ]
  }
}
```

### What Happens When Validation Fails

1. Claude Code receives a `deny` decision
2. A correction prompt is automatically reinjected into the context
3. The prompt includes:
   - Summary of issues
   - Specific locations (file:line:column)
   - Severity levels
   - Actionable suggestions
   - Retry counter (1/3, 2/3, etc.)

4. Claude can then revise the code

### Retry Logic

- **Max Retries**: 3 (configurable)
- After max retries: Code is allowed with a warning
- Retry state tracked in: `.claude/.smite/judge-retry-state.json`

### Viewing Logs

**Debug Log**: `.claude/.smite/judge-debug.log`
```
{"timestamp":"2025-01-19T10:30:00.000Z","level":"info","category":"judge","message":"Validation passed"}
```

**Audit Log**: `.claude/.smite/judge-audit.log`
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
      "message": "Potential SQL injection",
      "location": {"file": "src/api/users.ts", "line": 45, "column": 10}
    }
  ]
}
```

### Disabling the Hook

Temporarily disable in `.claude/.smite/quality.json`:
```json
{
  "enabled": false
}
```

Or remove from `.claude/hooks.json`.

## Testing

Try writing code with intentional issues:

```typescript
// This will be blocked (SQL injection)
const query = `SELECT * FROM users WHERE id = ${userId}`;

// This will be blocked (XSS)
document.innerHTML = userInput;

// This will be flagged (high complexity)
function complex(x) {
  if (x > 0) {
    for (let i = 0; i < x; i++) {
      if (i % 2 === 0) {
        while (i < 100) {
          // ... deeply nested code
        }
      }
    }
  }
}
```

## Tips

1. **Start with strict settings**: Enable all checks to catch issues early
2. **Adjust thresholds**: Tweak complexity limits based on your codebase
3. **Review audit logs**: Regularly check `.claude/.smite/judge-audit.log` for patterns
4. **Use with tests**: The hook doesn't run on test files by default
5. **Team alignment**: Share `.claude/.smite/quality.json` across your team

## Troubleshooting

**Hook not running?**
- Check that `dist/judge-hook.js` exists (run `npm run build`)
- Verify `.claude/hooks.json` contains the judge hook
- Check log level is set to `debug` in config

**Too many false positives?**
- Adjust thresholds in `.claude/.smite/quality.json`
- Disable specific rules you don't need
- Add file patterns to `exclude` array

**Performance issues?**
- Hook runs in < 2s for most files
- Large files may take longer (30s timeout)
- Check analysis time in audit log

## Support

For issues or questions:
1. Check `.claude/.smite/judge-debug.log`
2. Review the [README.md](README.md)
3. See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
