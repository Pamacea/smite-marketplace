# /studio refactor - Unified Refactoring Command

> **STUDIO** code refactoring with systematic validation

## Usage

```bash
# Quick refactoring (auto-fix low-risk items)
/studio refactor --quick

# Full refactoring workflow
/studio refactor --full

# Bug fixing
/studio refactor --scope=bug "TypeError in auth"

# With scope
/studio refactor --full --scope=file:src/auth/jwt.ts
/studio refactor --full --scope=directory:src/features/auth
/studio refactor --full --scope=all

# Step-by-step
/studio refactor --analyze
/studio refactor --review
/studio refactor --resolve --item=ID
/studio refactor --verify
```

## Mode Selection

| Mode | Description | Speed | Scope |
|------|-------------|-------|-------|
| `--quick` | Auto-fix low-risk items | ⚡⚡⚡ | Small |
| `--full` | Complete workflow | ⚡⚡ | Any |
| `--analyze` | Analysis only | ⚡ | Any |
| `--review` | Review & prioritize | ⚡⚡ | Any |
| `--resolve` | Apply changes | ⚡⚡ | Specific |
| `--verify` | Verify results | ⚡ | Any |

## Scope Options

| Option | Description |
|--------|-------------|
| `--scope=recent` (default) | Recent changes only |
| `--scope=file:PATH` | Specific file |
| `--scope=directory:PATH` | Entire directory |
| `--scope=all` | Entire codebase |
| `--scope=bug` | Bug fixing mode |

## Quick Mode

Automatically fixes low-risk items:
- Risk score < 30
- Complexity < 8
- Test coverage > 80%

## Full Mode

Complete workflow:
1. **ANALYZE** - Detect code quality issues
2. **REVIEW** - Classify and prioritize
3. **RESOLVE** - Apply refactoring
4. **VERIFY** - Verify results

## Step-by-Step

Control each step independently:

```bash
# Step 1: Analyze
/studio refactor --analyze

# Step 2: Review
/studio refactor --review

# Step 3: Resolve specific item
/studio refactor --resolve --item=R-003

# Step 4: Verify
/studio refactor --verify
```

## Bug Fixing

```bash
# Debug specific error
/studio refactor --scope=bug "TypeError: product.price is not a function"

# With adversarial review
/studio refactor --scope=bug --examine "Critical production bug"

# With retry limit
/studio refactor --scope=bug --max-attempts=3 "Fix memory leak"
```

## Integration

### With Toolkit

When toolkit is available:
- **Semantic Search** - Find similar patterns
- **Bug Detection** - Pattern-based issue finding
- **Dependency Graph** - Impact analysis
- **Context Builder** - Token-optimized context

### With Ralph

Ralph workflows use `/studio refactor`:
- `refactor` - Refactoring workflow
- `debug` - Debug workflow
- `feature` - Feature workflow

## Examples

### Quick Refactoring

```bash
# Auto-fix low-risk items
/studio refactor --quick

# With scope
/studio refactor --quick --scope=directory:src/components
```

### Full Workflow

```bash
# Complete refactoring
/studio refactor --full

# With custom scope
/studio refactor --full --scope=all
```

### Step-by-Step

```bash
# Analyze only
/studio refactor --analyze

# Review and prioritize
/studio refactor --review

# Resolve specific item
/studio refactor --resolve --item=R-003

# Verify results
/studio refactor --verify
```

### Bug Fixing

```bash
# Debug with stack trace
/studio refactor --scope=bug "TypeError: product.price is not a function"

# Automated fix with verification
/studio refactor --scope=bug --auto "Fix memory leak in useEffect"

# Critical bug with full review
/studio refactor --scope=bug --examine "Production database connection error"
```

## Output

All artifacts saved to `.claude/.smite/`:

| Output | File | Purpose |
|--------|------|---------|
| Analysis | `refactor-analysis.md` | Detected issues |
| Review | `refactor-review.md` | Prioritized action plan |
| Resolution | `refactor-resolution-[ID].md` | Changes applied |
| Verification | `refactor-verification.md` | Final verification |

## Configuration

Config file: `.claude/.smite/studio refactor.json`

```json
{
  "defaults": {
    "scope": "recent",
    "riskThreshold": 30,
    "complexityThreshold": 8,
    "coverageTarget": 80,
    "autoCommit": true
  },
  "exclude": [
    "node_modules/**",
    "dist/**",
    ".claude/**"
  ],
  "patterns": {
    "enabled": ["extract-method", "extract-class", ...]
  }
}
```

## Migration Guide

### From agents/studio refactor

**Old:**
```bash
/studio refactor -a -r -v -x -t
```

**New:**
```bash
/studio refactor --full
```

### From ralph/studio refactor

**Old workflow:**
```json
{
  "steps": ["analyze", "plan", "execute", "review", "resolve", "verify"]
}
```

**New workflow:**
```json
{
  "steps": ["analyze", "review", "resolve", "verify"]
}
```

### From basics/debug

**Old:**
```bash
/debug "TypeError in auth"
```

**New:**
```bash
/studio refactor --scope=bug "TypeError in auth"
```

### From predator/debug

**Old:**
```bash
/debug -examine "Critical bug"
```

**New:**
```bash
/studio refactor --scope=bug --examine "Critical bug"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Config file not found | Run once to create `.claude/.smite/studio refactor.json` |
| Tests failing | Fix all failures before proceeding |
| Type errors | Resolve all type errors before verification |
| Regressions detected | Rollback and investigate |

## Best Practices

1. **Always analyze first** - Understand issues before acting
2. **Validate changes** - Never skip validation step
3. **Start with quick wins** - Build momentum with low-risk items
4. **Test continuously** - After each small change
5. **Commit logically** - Small, reviewable commits
6. **Document thoroughly** - Explain reasoning

---

**Version:** 1.0.0
**Last Updated:** 2025-02-01
**SMITE Version:** 3.1.0
**Author:** Pamacea
