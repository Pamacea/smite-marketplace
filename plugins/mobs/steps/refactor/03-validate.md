# Step 3: Validate Changes

**Flag**: `-v` or `--validate`
**Required**: `--item=<ID>` to validate specific item

## Purpose

Validate that proposed refactoring changes are safe, preserve functionality, and have adequate test coverage before implementation.

## What To Do

### 1. Load Review Report

Read `.claude/.smite/refactor-review.md` to get item details.

### 2. Identify Change Item

From `--item=<ID>` flag, locate the specific change to validate.

### 3. Validation Framework

Perform comprehensive validation:

```markdown
## Validation Checklist

### Functionality Preservation ✅
- [ ] Behavior unchanged
- [ ] API contracts maintained
- [ ] Side effects identified
- [ ] Edge cases covered
- [ ] Error handling preserved

### Test Coverage ✅
- [ ] Existing tests adequate
- [ ] Tests pass before changes
- [ ] Tests identified for update
- [ ] New tests planned if needed
- [ ] Coverage target: [X]%

### Impact Analysis ✅
- [ ] Direct dependencies mapped
- [ ] Indirect dependencies mapped
- [ ] Consumers identified
- [ ] Breaking changes: None/Expected
- [ ] Migration path defined

### Type Safety ✅
- [ ] Types preserved
- [ ] No `any` introduced
- [ ] Type errors: None
- [ ] Generic constraints valid
- [ ] Null safety maintained

### Performance ✅
- [ ] No regression expected
- [ ] Benchmarking if critical
- [ ] Memory impact: Neutral/Improved
- [ ] Algorithmic complexity: Same/Improved
- [ ] Hot path considerations

### Security ✅
- [ ] No new vulnerabilities
- [ ] Input validation maintained
- [ ] Access control preserved
- [ ] Data sanitization unchanged
- [ ] Secrets handling safe

### Maintainability ✅
- [ ] Code clearer after change
- [ ] Naming improved
- [ ] Documentation updated
- [ ] Comments accurate
- [ ] Future changes easier

### Compatibility ✅
- [ ] Backward compatible
- [ ] Version implications: None
- [ ] Deprecation needed: No
- [ ] Migration required: No
- [ ] External API stable
```

### 4. Detailed Validation Analysis

For each item:

```markdown
# Validation Report: Item #[ID]

## Change Overview

**Title**: [Issue title]
**Location**: `src/file.ts:line`
**Type**: [Complexity/Duplication/Smell/etc]
**Proposed Solution**: [Description]

## Functionality Analysis

### Current Behavior
```typescript
// Current code snippet
```

**Description**: [What it does now]

### Proposed Change
```typescript
// Refactored code snippet
```

**Description**: [What it will do]

### Behavior Comparison
| Aspect | Before | After | Status |
|--------|--------|-------|--------|
| Input handling | [Desc] | [Desc] | ✅ Same |
| Output | [Desc] | [Desc] | ✅ Same |
| Side effects | [Desc] | [Desc] | ✅ Same |
| Error cases | [Desc] | [Desc] | ✅ Same |

**Conclusion**: ✅ Functionality preserved

## Impact Analysis

### Direct Dependencies
Files that import/use this code:

1. `src/fileA.ts` - [Usage pattern]
2. `src/fileB.ts` - [Usage pattern]
3. `src/fileC.ts` - [Usage pattern]

**Impact Assessment**:
- Breaking changes: **None** ✅
- Requires updates: **None** ✅
- Safe to refactor: **Yes** ✅

### Indirect Dependencies
Files that might be indirectly affected:

1. `src/tests/testA.spec.ts` - [Reason]
2. `src/components/ComponentX.tsx` - [Reason]

**Impact Assessment**:
- Secondary effects: **None identified** ✅

## Test Coverage Analysis

### Existing Tests
```typescript
// Relevant test code
```

**Coverage**: [X]%

**Test Scenarios Covered**:
- ✅ [Scenario 1]
- ✅ [Scenario 2]
- ✅ [Scenario 3]

### Test Scenarios Missing
- ⚠️ [Edge case 1] - **Needs test**
- ⚠️ [Edge case 2] - **Needs test**

### Recommendation
**Option A**: Add tests before refactoring
- New tests needed: [N]
- Estimated time: [X min]
- Confidence: High

**Option B**: Refactor first, test after
- Risk: Medium
- Requires careful validation
- Not recommended for critical paths

**Selected**: Option A ✅

## Risk Assessment

### Risks Identified

1. **[Risk Category]**
   - **Probability**: [Low/Medium/High]
   - **Impact**: [Low/Medium/High]
   - **Mitigation**: [Strategy]

### Overall Risk Level: **[Low/Medium/High]**

**Risk Score Calculation**:
- Complexity risk: [X]/5
- Dependency risk: [X]/5
- Test coverage risk: [X]/5
- Business impact risk: [X]/5

**Total**: [XX]/20

**Interpretation**:
- 0-5: Very Low ✅ - Proceed
- 6-10: Low ✅ - Proceed with monitoring
- 11-15: Medium ⚠️ - Proceed with caution
- 16-20: High 🔴 - Requires approval

## Performance Analysis

### Current Performance
- Execution time: [X]ms
- Memory: [X]MB
- Algorithmic complexity: [O(n)]

### Expected Performance
- Execution time: [X]ms ([±X]%)
- Memory: [X]MB ([±X]%)
- Algorithmic complexity: [O(n)]

**Performance Impact**: ✅ Neutral/Improved

### Hot Path Analysis
- **Is this on a hot path?** [Yes/No]
- **If Yes**: ✅ Benchmarking recommended

## Type Safety Validation

### Type Errors Before
```typescript
// Any type errors
```
**Count**: [N]

### Type Errors After (Expected)
```typescript
// Expected type state
```
**Count**: [N]

**Type Safety**: ✅ Maintained/Improved

## Security Validation

### Security Considerations

1. **Input Validation**
   - Current: [Description]
   - After: [Description]
   - Status: ✅ Maintained

2. **Data Sanitization**
   - Current: [Description]
   - After: [Description]
   - Status: ✅ Maintained

3. **Access Control**
   - Current: [Description]
   - After: [Description]
   - Status: ✅ Maintained

**Security Impact**: ✅ No new vulnerabilities

## Prerequisites

### Before Refactoring

- [ ] Add missing tests
- [ ] Document current behavior
- [ ] Create baseline measurements
- [ ] Get approval if risk > medium

### During Refactoring

- [ ] Run tests after each change
- [ ] Check types after each change
- [ ] Verify behavior after each change
- [ ] Monitor performance if critical

### After Refactoring

- [ ] All tests passing
- [ ] No new type errors
- [ ] Performance verified
- [ ] Documentation updated

## Validation Decision

### Summary
- **Functionality**: ✅ Preserved
- **Tests**: ⚠️ Need improvement (Add [N] tests)
- **Impact**: ✅ Low risk
- **Performance**: ✅ Neutral/Improved
- **Security**: ✅ Maintained
- **Types**: ✅ Maintained

### Overall Assessment: **✅ APPROVED**

**Conditions**:
1. Add [N] tests before proceeding
2. Monitor performance after deployment
3. Update documentation

**Confidence**: **High**

### Alternative: **⚠️ CONDITIONAL APPROVAL**

**Conditions**:
1. [Specific condition]
2. [Specific condition]

**Confidence**: **Medium**

### Alternative: **❌ NOT APPROVED**

**Reasons**:
1. [Blocking issue 1]
2. [Blocking issue 2]

**Required Actions**:
1. [Action needed]
2. [Action needed]

## Sign-off

**Validated By**: Refactor Validator Agent
**Timestamp**: [ISO timestamp]
**Decision**: [APPROVED/CONDITIONAL/REJECTED]
**Confidence**: [High/Medium/Low]

**Can proceed to resolution**: [Yes/No]
```

### 5. Save Validation Report

- Location: `.claude/.smite/refactor-validation-[ID].md`

### 6. Update Review Status

Mark item as validated in refactor-review.json:

```json
{
  "items": [
    {
      "id": 1,
      "status": "validated",
      "validation": "approved",
      "confidence": "high",
      "prerequisites": ["Add 2 tests", "Update docs"]
    }
  ]
}
```

## Output

- ✅ Comprehensive validation report
- ✅ Risk assessment with score
- ✅ Test coverage analysis
- ✅ Impact analysis
- ✅ Performance evaluation
- ✅ Security check
- ✅ Approval decision with conditions
- ✅ Saved to `.claude/.smite/refactor-validation-[ID].md`

## Validation Outcomes

### ✅ APPROVED
- Safe to proceed
- Conditions defined (if any)
- Confidence: High

### ⚠️ CONDITIONAL
- Proceed with caution
- Must meet conditions first
- Confidence: Medium
- May need additional review

### ❌ REJECTED
- Unsafe to proceed
- Blocking issues identified
- Must address before retry
- Confidence: Low

## MCP Tools Used

- ✅ Dependency graph (impact analysis)
- ✅ Test coverage tools
- ✅ Type checker (type safety)
- ✅ Static analysis (security)
- ✅ Profiling tools (performance, if critical)

## Next Step

If **APPROVED**: Proceed to `04-resolve.md` (use `-x --item=<ID>`)
If **CONDITIONAL**: Complete prerequisites first
If **REJECTED**: Address blocking issues and re-validate
