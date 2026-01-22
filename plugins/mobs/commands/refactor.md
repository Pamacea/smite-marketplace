---
description: "Systematic code refactoring with validation and resolution workflow"
argument-hint: "[-a -r -v -x -t] [--scope=file|directory|recent|all] [--item=<ID>]"
---

# /refactor - Systematic Code Refactoring

Intelligent code refactoring with comprehensive validation, ensuring safe improvements while preserving functionality.

## ⚠️ MANDATORY: Use Toolkit First for Analysis

**BEFORE analyzing code for refactoring, you MUST:**

1. **Try `/toolkit detect --patterns="complexity,duplication"`** - Find code smells
2. **Try `/toolkit graph --impact`** - Understand refactoring impact
3. **Try `/toolkit search`** - Find similar patterns to consolidate

**ONLY proceed with manual exploration if:**
- Toolkit is unavailable OR
- Toolkit explicitly fails to provide results

**Reference:** `plugins/toolkit/README.md`

---

## 🎯 Refactor Workflow

Systematic 5-step process for safe code refactoring:

```bash
# Complete workflow
/refactor -a -r -v -x -t --scope=recent

# Step-by-step
/refactor -a              # Step 1: Analyze code
/refactor -r              # Step 2: Review & prioritize
/refactor -v --item=3     # Step 3: Validate changes
/refactor -x --item=3     # Step 4: Resolve issues
/refactor -t --item=3     # Step 5: Verify results

# Quick refactor (low-risk items only)
/refactor --quick
```

## Workflow Steps

### Step 1: Analyze (`-a` or `--analyze`)

Detect and catalog all code quality issues.

**What it does:**
- Scans for complexity issues
- Identifies code duplications
- Detects code smells
- Analyzes maintainability
- Calculates technical debt score

**Output**: `.claude/.smite/refactor-analysis.md`

```bash
/refactor -a --scope=recent
/refactor -a --scope=file src/components/UserForm.tsx
/refactor -a --scope=all
```

### Step 2: Review (`-r` or `--review`)

Review detected issues and create action plan.

**What it does:**
- Prioritizes by business value
- Assesses impact and risk
- Estimates effort
- Creates action plan
- Defines success metrics

**Output**: `.claude/.smite/refactor-review.md`

```bash
/refactor -r
```

### Step 3: Validate (`-v` or `--validate`)

Validate that changes are safe before implementing.

**What it does:**
- Verifies functionality preservation
- Analyzes test coverage
- Assesses impact and risks
- Identifies prerequisites
- Approves/rejects changes

**Output**: `.claude/.smite/refactor-validation-[ID].md`

```bash
/refactor -v --item=3
```

**Outcomes**:
- ✅ **APPROVED** - Safe to proceed
- ⚠️ **CONDITIONAL** - Proceed with conditions
- ❌ **REJECTED** - Unsafe to proceed

### Step 4: Resolve (`-x` or `--resolve`)

Apply validated refactoring changes.

**What it does:**
- Applies proven refactoring patterns
- Makes incremental changes
- Tests continuously
- Commits in logical steps
- Documents all changes

**Output**: `.claude/.smite/refactor-resolution-[ID].md`

```bash
/refactor -x --item=3
```

**Uses patterns from**: Martin Fowler's Refactoring catalog

### Step 5: Verify (`-t` or `--test` or `--verify`)

Comprehensive verification of results.

**What it does:**
- Runs all tests
- Checks types
- Measures improvements
- Verifies no regressions
- Assesses deployment readiness

**Output**: `.claude/.smite/refactor-verification-[ID].md`

```bash
/refactor -t --item=3
/refactor -t --scope=all
```

## Option Flags

### Workflow Flags

| Flag | Long Form | Purpose |
|------|-----------|---------|
| `-a` | `--analyze` | Detect code quality issues |
| `-r` | `--review` | Review and prioritize issues |
| `-v` | `--validate --item=<ID>` | Validate specific change |
| `-x` | `--resolve --item=<ID>` | Apply refactoring |
| `-t` | `--test` or `--verify` | Verify results |
| `--quick` | None | Auto-refactor low-risk items |
| `--full` | None | Run complete workflow |

### Scope Flags

| Flag | Purpose |
|------|---------|
| `--scope=file <path>` | Refactor specific file |
| `--scope=directory <path>` | Refactor entire directory |
| `--scope=recent` | Refactor recent changes (default) |
| `--scope=all` | Refactor entire codebase |

### Filter Flags

| Flag | Purpose |
|------|---------|
| `--severity=critical` | Only critical issues |
| `--type=complexity` | Specific issue type |
| `--exclude=node_modules` | Exclude directories |

## Subagent Collaboration

The refactor workflow leverages three specialized subagents:

### 1. Reviewer Subagent
**Purpose**: Analyze and prioritize issues

**Launched by**: Step 2 (`-r` flag)

**Capabilities**:
- Issue classification and prioritization
- Impact assessment
- Effort estimation
- Risk evaluation
- Action plan creation

### 2. Validator Subagent
**Purpose**: Validate change safety

**Launched by**: Step 3 (`-v` flag)

**Capabilities**:
- Functionality preservation verification
- Test coverage analysis
- Impact analysis
- Risk assessment
- Approval decision

### 3. Resolver Subagent
**Purpose**: Apply refactoring changes

**Launched by**: Step 4 (`-x` flag)

**Capabilities**:
- Apply refactoring patterns
- Incremental changes
- Continuous testing
- Documentation
- Safe commits

## Usage Examples

### Quick Refactor (Low-Risk Items)

```bash
# Automatically refactor safe items
/refactor --quick

# Equivalent to
/refactor -a -r
# Then auto-resolves items with:
# - Risk score < 30
# - Complexity < 8
# - Test coverage > 80%
```

### Complete Workflow

```bash
# Full workflow for recent changes
/refactor -a -r -v -x -t --scope=recent

# Step by step with review
/refactor -a              # Detect issues
/refactor -r              # Review and plan
/refactor -v --item=1     # Validate item 1
/refactor -x --item=1     # Resolve item 1
/refactor -t --item=1     # Verify item 1
```

### Specific File

```bash
# Analyze and refactor specific file
/refactor -a --scope=file src/components/UserForm.tsx
/refactor -r
/refactor -v --item=3
/refactor -x --item=3
/refactor -t --item=3
```

### By Severity

```bash
# Only critical issues
/refactor -a --severity=critical
/refactor -r
```

## What Gets Detected

### Complexity Issues
- High cyclomatic complexity (> 10)
- High cognitive complexity (> 15)
- Deep nesting (> 4 levels)
- Long functions (> 50 lines)
- Long parameter lists (> 5 params)

### Code Smells
- God objects/classes
- Feature envy
- Long parameter lists
- Shotgun surgery
- Divergent change
- Lazy classes
- Data clumps

### Duplications
- Identical code blocks
- Similar patterns (3+ occurrences)
- Copy-pasted logic
- Repeated structures

### Maintainability
- Poor naming
- Magic numbers/strings
- Dead code
- Commented code
- TODO/FIXME comments

## Output Files

| File | Location | Purpose |
|------|----------|---------|
| Analysis | `.claude/.smite/refactor-analysis.md` | All detected issues |
| Review | `.claude/.smite/refactor-review.md` | Prioritized action plan |
| Validation | `.claude/.smite/refactor-validation-[ID].md` | Safety assessment |
| Resolution | `.claude/.smite/refactor-resolution-[ID].md` | Changes applied |
| Verification | `.claude/.smite/refactor-verification-[ID].md` | Final verification |

## Metrics Tracked

### Complexity Metrics
- Cyclomatic complexity
- Cognitive complexity
- Nesting depth
- Function length
- Parameter count

### Quality Metrics
- Maintainability index
- Code duplication
- Test coverage
- Type safety score
- Technical debt

### Improvement Tracking
- Before/after comparison
- Percentage reduction
- Coverage improvement
- Debt reduction

## MCP Tools Integration

When toolkit plugin is available, Refactor leverages:

- **Bug Detection** - `ToolkitAPI.Detect.issues()`
- **Semantic Search** - Find similar patterns
- **Dependency Graph** - `ToolkitAPI.DependencyGraph.build()`
- **Impact Analysis** - `ToolkitAPI.Analysis.impact()`
- **Refactoring API** - Safe code transformations

## Best Practices

1. **Always validate before resolving** - Don't skip validation
2. **Run tests continuously** - After each small change
3. **Commit in logical steps** - Small, reviewable commits
4. **Start with quick wins** - Build momentum
5. **Handle high-risk items carefully** - Extra validation

## When To Use

**Use Refactor when:**
- Code complexity is high
- Duplications exist
- Code smells detected
- Technical debt accumulating
- Hard to maintain code
- After feature implementation

**Before committing:**
- Run Refactor on recent changes
- Verify improvements
- Ensure tests passing
- Commit with confidence

## Workflow Example

```bash
# 1. Analyze recent changes
/refactor -a --scope=recent
# Output: 15 issues found

# 2. Review and prioritize
/refactor -r
# Output: 3 quick wins, 5 medium, 7 large

# 3. Validate a quick win
/refactor -v --item=1
# Output: ✅ APPROVED (low risk)

# 4. Resolve
/refactor -x --item=1
# Output: Refactored successfully

# 5. Verify
/refactor -t --item=1
# Output: ✅ Verified, all tests passing
```

## Integration

**Works with:**
- /architect (design review)
- /builder (before simplifying)
- ralph (orchestration)

## Documentation

See [docs/refactor/](docs/refactor/) for:
- [Complete Workflow Guide](docs/refactor/REFACTOR_WORKFLOW.md)
- [Step-by-Step Details](docs/refactor/INDEX.md)
- [Subagent Skills](skills/)
- [Workflow Steps](steps/refactor/)

## Version

**Version**: 2.0.0 (formerly Simplifier)
**Last Updated**: 2025-01-22
