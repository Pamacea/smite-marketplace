# Refactor Agent - Complete Workflow Guide

Comprehensive guide to the systematic code refactoring workflow with validation and resolution.

## Overview

The Refactor agent provides a structured, safe approach to improving code quality through proven refactoring patterns with comprehensive validation at each step.

## The 5-Step Workflow

```
Analyze → Review → Validate → Resolve → Verify
   -a       -r        -v         -x        -t
```

### Why This Workflow?

1. **Safety First** - Validate before making changes
2. **Incremental** - Small, verifiable steps
3. **Traceable** - Documentation at each stage
4. **Collaborative** - Subagents for each expertise
5. **Measurable** - Track improvements

## Quick Start

### For Beginners

```bash
# Quick refactor (low-risk items only)
/refactor --quick

# This will:
# 1. Analyze recent changes
# 2. Review and prioritize
# 3. Auto-resolve safe items:
#    - Risk score < 30
#    - Complexity < 8
#    - Test coverage > 80%
```

### For Experienced Users

```bash
# Complete workflow with control
/refactor -a -r -v -x -t --scope=recent

# Or step-by-step
/refactor -a              # Detect issues
/refactor -r              # Plan changes
/refactor -v --item=3     # Validate item 3
/refactor -x --item=3     # Resolve item 3
/refactor -t --item=3     # Verify item 3
```

## Step-by-Step Deep Dive

### Step 1: Analyze (`-a`)

**Purpose**: Detect all code quality issues

**What it finds**:
- Complexity issues (cyclomatic, cognitive, nesting)
- Code duplications
- Code smells (god objects, long parameter lists, etc.)
- Maintainability issues (naming, magic values, dead code)

**Output**: `.claude/.smite/refactor-analysis.md`

**Example**:
```bash
/refactor -a --scope=recent

# Detects:
# - 5 complexity issues
# - 3 duplications
# - 7 code smells
# Technical debt score: 72/100
```

### Step 2: Review (`-r`)

**Purpose**: Prioritize and create action plan

**What it does**:
- Classifies by severity (P1-P4)
- Assesses business impact
- Estimates effort
- Identifies quick wins
- Creates timeline

**Output**: `.claude/.smite/refactor-review.md`

**Example**:
```bash
/refactor -r

# Produces:
# - 2 quick wins (< 30min each)
# - 5 medium tasks (30min-2h each)
# - 8 large tasks (> 2h each)
# Total estimated time: 12 hours
```

### Step 3: Validate (`-v`)

**Purpose**: Ensure changes are safe

**What it checks**:
- Functionality preservation
- Test coverage adequacy
- Impact and dependencies
- Type safety
- Performance impact
- Security considerations

**Output**: `.claude/.smite/refactor-validation-[ID].md`

**Possible outcomes**:
- ✅ **APPROVED** - Safe to proceed
- ⚠️ **CONDITIONAL** - Proceed with conditions
- ❌ **REJECTED** - Unsafe, needs work

**Example**:
```bash
/refactor -v --item=3

# Validates: Extract validation logic
# Risk Score: 15/100 (Very Low)
# Functionality: ✅ Preserved
# Tests: ✅ Adequate (85%)
# Decision: ✅ APPROVED
# Confidence: High
```

### Step 4: Resolve (`-x`)

**Purpose**: Apply refactoring changes

**What it does**:
- Applies proven patterns
- Makes incremental changes
- Tests continuously
- Commits in logical steps
- Documents everything

**Output**: `.claude/.smite/refactor-resolution-[ID].md`

**Common patterns**:
- Extract Method
- Introduce Parameter Object
- Replace Magic Numbers
- Decompose Conditional
- Extract Class
- Move Method

**Example**:
```bash
/refactor -x --item=3

# Applies: Extract Method pattern
# - Extracts validateConfig()
# - Extracts processData()
# - Extracts formatResult()
# Complexity: 18 → 5 (-72%)
# All tests: ✅ Passing
```

### Step 5: Verify (`-t`)

**Purpose**: Ensure improvements and no regressions

**What it checks**:
- All tests passing
- No type errors
- Metrics improved
- No regressions
- Deployment ready

**Output**: `.claude/.smite/refactor-verification-[ID].md`

**Example**:
```bash
/refactor -t --item=3

# Results:
# - Tests: ✅ 15/15 passing
# - Types: ✅ No errors
# - Complexity: 18 → 5 (-72%)
# - Coverage: 75% → 95% (+27%)
# - Regressions: ✅ None
# Status: ✅ Verified & Approved
```

## Common Workflows

### Workflow 1: Quick Wins

```bash
# Auto-refactor safe items
/refactor --quick

# Great for:
# - After feature implementation
# - Before committing
# - Regular maintenance
# - Building confidence
```

### Workflow 2: Targeted Refactoring

```bash
# Specific file with issues
/refactor -a --scope=file src/components/UserForm.tsx
/refactor -r
/refactor -v --item=1
/refactor -x --item=1
/refactor -t --item=1
```

### Workflow 3: Batch Processing

```bash
# Handle multiple items
/refactor -a -r

# Then process each:
for item in 1 2 3; do
  /refactor -v --item=$item
  /refactor -x --item=$item
  /refactor -t --item=$item
done
```

### Workflow 4: Critical Issues

```bash
# Focus on critical issues only
/refactor -a --severity=critical
/refactor -r

# Extra validation for critical:
/refactor -v --item=1
# Review validation report carefully
# Get team approval if needed
/refactor -x --item=1
/refactor -t --item=1
# Monitor in production
```

## Subagent Collaboration

### Reviewer Subagent

**Expertise**: Code review and prioritization

**Launched**: Step 2 (`-r`)

**Output**: Prioritized action plan

**Key capabilities**:
- Issue classification
- Impact assessment
- Effort estimation
- Risk evaluation

### Validator Subagent

**Expertise**: Safety and validation

**Launched**: Step 3 (`-v`)

**Output**: Validation decision

**Key capabilities**:
- Functionality verification
- Test coverage analysis
- Risk assessment
- Approval decision

### Resolver Subagent

**Expertise**: Refactoring implementation

**Launched**: Step 4 (`-x`)

**Output**: Refactored code

**Key capabilities**:
- Pattern application
- Incremental changes
- Continuous testing
- Documentation

## Decision Framework

### When to APPROVE

✅ **Risk score 0-50**
✅ **Functionality preserved**
✅ **Tests adequate (> 80%)**
✅ **No breaking changes**
✅ **Performance acceptable**

### When to CONDITIONALLY APPROVE

⚠️ **Risk score 51-75**
⚠️ **Minor concerns**
⚠️ **Additional work needed**
⚠️ **Can proceed with safeguards**

### When to REJECT

❌ **Risk score 76-100**
❌ **Functionality uncertain**
❌ **Tests inadequate**
❌ **Breaking changes**
❌ **Performance regression**

## Metrics & Improvement Tracking

### Before & After Comparison

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Cyclomatic Complexity | 18 | 5 | -72% ✅ |
| Test Coverage | 75% | 95% | +27% ✅ |
| Maintainability Index | 42 | 78 | +86% ✅ |
| Lines of Code | 67 | 78 | +16% |
| Technical Debt | 72/100 | 35/100 | -37 pts ✅ |

### Success Criteria

- ✅ All tests passing
- ✅ No type errors
- ✅ Complexity reduced
- ✅ Coverage increased
- ✅ No regressions
- ✅ Team satisfied

## Best Practices

### 1. Start Small

```bash
# Begin with quick wins
/refactor --quick

# Builds confidence and momentum
# Learn the workflow
# Understand patterns
```

### 2. Validate Everything

```bash
# Never skip validation
/refactor -v --item=X

# Even for "simple" changes
# Prevents surprises
# Ensures safety
```

### 3. Test Continuously

```bash
# During resolution:
# After each change
npm test

# Don't batch changes
# Test frequently
# Catch issues early
```

### 4. Commit Often

```bash
# Small logical commits
git commit -m "Refactor: Extract validation logic"

# Not:
git commit -m "Refactor stuff"

# Makes review easier
# Easier to revert if needed
```

### 5. Document Changes

```bash
# Each step creates documentation
# Review the reports
# Understand what changed
# Learn from the process
```

## Common Patterns & Examples

### Pattern 1: Extract Method

**Before**:
```typescript
function handleSubmit(formData: FormData) {
  // 67 lines, complexity 18
  if (formData.username.length < 3) {
    // validation
  }
  if (!formData.email.includes('@')) {
    // validation
  }
  // ... more nested logic
}
```

**After**:
```typescript
function handleSubmit(formData: FormData) {
  const validated = validateFormData(formData);
  const result = processFormData(validated);
  return formatResponse(result);
}

function validateFormData(formData: FormData): ValidatedData {
  // Clear validation logic, complexity 5
}

function processFormData(data: ValidatedData): ProcessResult {
  // Clear processing logic, complexity 4
}

function formatResponse(result: ProcessResult): Response {
  // Clear formatting logic, complexity 3
}
```

### Pattern 2: Introduce Parameter Object

**Before**:
```typescript
function createUser(
  username: string,
  email: string,
  firstName: string,
  lastName: string,
  age: number,
  country: string
) {
  // 6 parameters
}
```

**After**:
```typescript
interface CreateUserConfig {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  country: string;
}

function createUser(config: CreateUserConfig) {
  // Single parameter, extensible
}
```

### Pattern 3: Replace Magic Numbers

**Before**:
```typescript
if (user.age >= 18) {
  // Can vote
}

if (order.total >= 100) {
  // Free shipping
}
```

**After**:
```typescript
const VOTING_AGE = 18;
const FREE_SHIPPING_THRESHOLD = 100;

if (user.age >= VOTING_AGE) {
  // Can vote
}

if (order.total >= FREE_SHIPPING_THRESHOLD) {
  // Free shipping
}
```

## Troubleshooting

### Tests Failing After Refactor

```bash
# 1. Check what changed
git diff HEAD~1

# 2. Run tests with verbose output
npm test -- --no-coverage --verbose

# 3. Options:
#    - Fix test (if behavior should change)
#    - Fix code (if breaking change)
#    - Revert (if unsure)
git reset --hard HEAD
```

### Type Errors

```bash
# 1. Check types
npm run typecheck

# 2. Fix type errors:
#    - Add proper types
#    - Fix generics
#    - Remove type assertions

# 3. Re-validate
/refactor -v --item=X
```

### Validation Rejected

```bash
# 1. Review validation report
cat .claude/.smite/refactor-validation-X.md

# 2. Address blocking issues:
#    - Add tests
#    - Reduce scope
#    - Alternative approach

# 3. Re-validate
/refactor -v --item=X
```

## Output Files Reference

All workflow artifacts saved in `.claude/.smite/`:

- `refactor-analysis.md` - Detected issues
- `refactor-review.md` - Prioritized action plan
- `refactor-validation-[ID].md` - Safety assessment
- `refactor-resolution-[ID].md` - Changes applied
- `refactor-verification-[ID].md` - Final verification

## Integration with Other Agents

**Works with**:
- `/architect` - Design quality review
- `/builder` - Pre-refactoring cleanup
- `/finalize` - Post-refactoring QA
- `ralph` - Orchestrated workflows

## Resources

- [Refactoring.guru](https://refactoring.guru/) - Refactoring patterns catalog
- [Martin Fowler's Book](https://refactoring.com/) - Refactoring bible
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) - Best practices

## See Also

- [Refactor Index](INDEX.md) - All refactor documentation
- [Workflow Steps](../../steps/refactor/) - Detailed step guides
- [Subagent Skills](../../skills/) - Reviewer, Validator, Resolver
