# Step 4: Resolve Issues

**Flag**: `-x` or `--resolve` (execute)
**Required**: `--item=<ID>` to resolve specific validated item

## Purpose

Apply the validated refactoring changes to the codebase using proven refactoring patterns while preserving functionality.

## Prerequisites

✅ Item must be validated (Step 3 completed)
✅ All validation conditions met
✅ Tests added if required
✅ Backup/commit point established

## What To Do

### 1. Load Validation Report

Read `.claude/.smite/refactor-validation-[ID].md` to understand:
- Current code state
- Proposed changes
- Validation conditions
- Risk level
- Success criteria

### 2. Establish Safety Net

Before making changes:

```bash
# Create safety point
git add .
git commit -m "Before refactor: Item #[ID] - [Title]"

# Or create branch for experimental changes
git checkout -b refactor/item-[ID]
```

### 3. Choose Refactoring Pattern

Select appropriate pattern from Martin Fowler's catalog:

```markdown
## Common Refactoring Patterns

### Composing Methods
- **Extract Method**: Turn fragment into method
- **Inline Method**: Move method body into caller
- **Extract Variable**: Simplify expression
- **Inline Temp**: Remove unnecessary temp
- **Replace Temp with Query**: Remove temp
- **Introduce Explaining Variable**: Clarify complex expression
- **Split Temporary Variable**: Separate uses
- **Remove Assignments to Parameters**: Clean code

### Moving Features Between Objects
- **Move Method**: Move to better class
- **Move Field**: Move to better class
- **Extract Class**: Create new class
- **Inline Class**: Merge into another
- **Hide Delegate**: Hide internal details
- **Remove Middle Man**: Reduce delegation
- **Introduce Foreign Method**: Add method to served class
- **Introduce Local Extension**: Add local extension

### Organizing Data
- **Self Encapsulate Field**: Access via methods
- **Replace Data Value with Object**: Expand to object
- **Change Value to Reference**: Use reference
- **Change Reference to Value**: Use value
- **Replace Magic Numbers**: Extract constants
- **Encapsulate Collection**: Hide collection
- **Replace Record with Data Class**: Use class
- **Replace Type Code with Class**: Use classes
- **Replace Type Code with Subclasses**: Use polymorphism
- **Replace Conditional with Polymorphism**: Use polymorphism
- **Introduce Null Object**: Eliminate null checks

### Simplifying Conditional Expressions
- **Decompose Conditional**: Extract methods
- **Consolidate Conditional Expression**: Combine conditions
- **Consolidate Duplicate Conditional Fragments**: Remove duplication
- **Replace Nested Conditional with Guard Clauses**: Reduce nesting
- **Replace Conditional with Polymorphism**: Use polymorphism
- **Introduce Null Object**: Eliminate null checks

### Simplifying Method Calls
- **Rename Method**: Better name
- **Add Parameter**: Add data
- **Remove Parameter**: Remove unused
- **Separate Query from Modifier**: CQS
- **Parameterize Method**: Make more general
- **Replace Parameter with Explicit Methods**: Be explicit
- **Preserve Whole Object**: Pass object
- **Replace Parameter with Methods**: Use methods
- **Introduce Parameter Object**: Group parameters
- **Remove Setting Method**: Make immutable
- **Hide Method**: Reduce API
- **Replace Constructor with Factory Method**: Use factory
- **Encapsulate Downcast**: Remove casts
- **Replace Error Code with Exception**: Use exceptions
- **Replace Exception with Test**: Check first

### Dealing with Generalization
- **Pull Up Method**: Move to superclass
- **Pull Up Field**: Move to superclass
- **Pull Up Constructor Body**: Common init
- **Push Down Method**: Move to subclass
- **Push Down Field**: Move to subclass
- **Extract Subclass**: Create subclass
- **Extract Superclass**: Create superclass
- **Extract Interface**: Create interface
- **Collapse Hierarchy**: Merge
- **Form Template Method**: Template pattern
- **Replace Inheritance with Delegation**: Use delegation
- **Replace Delegation with Inheritance**: Use inheritance
```

### 4. Apply Refactoring

Follow this process:

```markdown
## Refactoring Process

### Phase 1: Preparation
1. ✅ Read current code
2. ✅ Understand behavior
3. ✅ Identify test coverage
4. ✅ Plan changes step by step

### Phase 2: Incremental Changes
For each small change:

1. **Make change**
   ```typescript
   // Apply refactoring pattern
   ```

2. **Run tests**
   ```bash
   npm test -- [relevant-test-file]
   ```

3. **Check types**
   ```bash
   npm run typecheck
   ```

4. **Verify behavior**
   - Manual test if needed
   - Check console/logs
   - Verify edge cases

5. **Commit if working**
   ```bash
   git add .
   git commit -m "Refactor: [small step]"
   ```

6. **Rollback if broken**
   ```bash
   git reset --hard HEAD
   ```

### Phase 3: Verification
1. ✅ All tests passing
2. ✅ No type errors
3. ✅ Linting clean
4. ✅ Manual verification
5. ✅ Performance check (if critical)
```

### 5. Document Changes

Create resolution report:

```markdown
# Resolution Report: Item #[ID]

## Summary

**Title**: [Issue title]
**Location**: `src/file.ts:line`
**Pattern Applied**: [Refactoring pattern name]
**Timestamp**: [ISO timestamp]

## Before

```typescript
// Original code
function originalFunction(param1: string, param2: number, param3: boolean, param4: object, param5: any[]) {
  // [Lines of code]
  if (complexCondition) {
    // nested logic
    if (anotherCondition) {
      // more nesting
    }
  }
  return result;
}
```

**Metrics**:
- Lines: [X]
- Complexity: [X]
- Parameters: [X]
- Nesting: [X]
- Test coverage: [X]%

## After

```typescript
// Refactored code
function simplifiedFunction(config: ProcessConfig) {
  const validated = validateConfig(config);
  const result = processData(validated);
  return formatResult(result);
}

function validateConfig(config: ProcessConfig): ValidatedConfig {
  // Clear validation logic
}

function processData(config: ValidatedConfig): ProcessResult {
  // Clear processing logic
}

function formatResult(result: ProcessResult): FormattedResult {
  // Clear formatting logic
}
```

**Metrics**:
- Lines: [X]
- Complexity: [X]
- Parameters: [X]
- Nesting: [X]
- Test coverage: [X]%

## Changes Applied

### Refactoring Steps

1. **Extract Method**: `validateConfig`
   - Extracted validation logic
   - Reduced complexity from 15 to 5
   - Improved testability

2. **Introduce Parameter Object**: `ProcessConfig`
   - Replaced 5 parameters with object
   - Added type safety
   - Improved extensibility

3. **Decompose Conditional**: Guard clauses
   - Replaced nested if with early returns
   - Reduced nesting from 4 to 1
   - Improved readability

### Files Modified

1. `src/components/UserForm.tsx`
   - Modified `handleSubmit` function
   - Added 3 new helper functions
   - Updated imports

### New Files Created

1. `src/types/forms.ts` (if needed)
   - Added `ProcessConfig` interface
   - Added related types

### Tests Updated

1. `src/components/__tests__/UserForm.test.tsx`
   - Updated tests for new signature
   - Added tests for helper functions
   - All tests passing ✅

## Test Results

```bash
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        2.345s
```

✅ **All tests passing**

## Type Check Results

```bash
src/components/UserForm.tsx:45:12 - error: Type 'string' is not assignable to type 'number'
```

✅ **No type errors**

## Lint Results

```bash
✅ All linting rules passed
```

## Metrics Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Cyclomatic Complexity | 18 | 5 | -72% ✅ |
| Cognitive Complexity | 24 | 8 | -67% ✅ |
| Lines of Code | 67 | 78 | +16% |
| Function Length | 67 | 22 avg | -67% ✅ |
| Parameter Count | 5 | 1 | -80% ✅ |
| Nesting Depth | 4 | 1 | -75% ✅ |
| Test Coverage | 75% | 95% | +27% ✅ |

## Performance Impact

- **Execution Time**: [X]ms → [X]ms ([±X]%)
- **Memory**: [X]MB → [X]MB ([±X]%)
- **Algorithmic Complexity**: O(n²) → O(n) ✅

✅ **Performance improved**

## Behavior Verification

### Test Cases
- ✅ Normal input: Works as before
- ✅ Edge case 1: Fixed (was broken)
- ✅ Edge case 2: Works as before
- ✅ Error case: Works as before

### Manual Testing
- ✅ Tested in browser
- ✅ Verified UI behavior
- ✅ Checked console logs
- ✅ No errors thrown

## Breaking Changes

- **API Changes**: None ✅
- **Behavior Changes**: None ✅
- **Migration Required**: No ✅

## Documentation Updates

- ✅ Code comments updated
- ✅ JSDoc added/updated
- ✅ README updated (if needed)
- ✅ Type documentation updated

## Git Commits

```
abc1234 - Refactor: Extract validation logic from UserForm
def5678 - Refactor: Introduce ProcessConfig parameter object
ghi9012 - Refactor: Add guard clauses to reduce nesting
```

## Rollback Plan

If issues arise:

```bash
# Rollback to before refactor
git revert abc1234 def5678 ghi9012

# Or reset to safety point
git reset --hard [safety-commit]
```

## Success Criteria

- ✅ All tests passing
- ✅ No type errors
- ✅ Linting clean
- ✅ Behavior preserved
- ✅ Metrics improved
- ✅ Documentation updated

## Status: ✅ COMPLETED

**Refactoring successful**

**Next Steps**:
- Monitor in production
- Gather feedback
- Consider similar improvements elsewhere

## Lessons Learned

1. **What worked well**:
   - [Observation]

2. **What could be improved**:
   - [Observation]

3. **Patterns to reuse**:
   - [Pattern name]

## Sign-off

**Resolved By**: Refactor Resolver Agent
**Timestamp**: [ISO timestamp]
**Validation Reference**: refactor-validation-[ID].md
**Status**: **Completed Successfully** ✅

**Ready for verification**: Yes → Proceed to Step 5
```

### 6. Update Status

Mark as resolved in refactor-review.json:

```json
{
  "items": [
    {
      "id": 1,
      "status": "resolved",
      "resolution": {
        "pattern": "Extract Method",
        "timestamp": "2025-01-22T11:00:00Z",
        "metrics": {
          "complexityBefore": 18,
          "complexityAfter": 5
        }
      }
    }
  ]
}
```

### 7. Create Summary Report

If multiple items resolved:

```markdown
# Batch Resolution Summary

**Items Resolved**: [N]
**Time Taken**: [X] hours
**Tests Status**: All passing ✅

### Metrics Improvement
- Average complexity reduced: [X]%
- Total duplication removed: [X] lines
- Test coverage increased: [X]%

### Issues
- None encountered ✅
```

## Output

- ✅ Refactored code applied
- ✅ All tests passing
- ✅ No type errors
- ✅ Metrics improved
- ✅ Documentation updated
- ✅ Resolution report saved
- ✅ Git commits created

## Common Issues & Solutions

### Tests Failing
```bash
# Debug test failure
npm test -- --no-coverage --verbose

# Check what changed
git diff HEAD~1

# Fix test or revert
```

### Type Errors
```bash
# Check types
npm run typecheck

# Fix type errors
# Add proper types, fix generics, etc.
```

### Behavior Changed
```bash
# Revert immediately
git reset --hard HEAD

# Investigate why
# Re-validate the change
```

## MCP Tools Used

- ✅ Refactoring API (safe transformations)
- ✅ Code generation (helper functions)
- ✅ Type checker (validate types)
- ✅ Test runner (continuous testing)
- ✅ Formatter (maintain style)

## Next Step

Proceed to `05-verify.md` (use `-t --item=<ID>`) to verify the refactoring

## Success Indicators

✅ All tests passing
✅ No regressions
✅ Metrics improved
✅ Code clearer
✅ Team satisfied
