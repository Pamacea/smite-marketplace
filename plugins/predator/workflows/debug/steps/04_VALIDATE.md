# 04_VALIDATE - Fix Verification

## Instructions

### 1. Verify Bug is Resolved

Comprehensive bug fix verification:

```markdown
## Bug Fix Verification

### Original Bug Test
**Reproduction Steps**:
1. ${step1}
2. ${step2}
3. ${step3}

**Expected**: Bug no longer occurs
**Actual**: ${result}
**Status**: ✅ PASS / ❌ FAIL

### Multiple Repetitions
Run the test ${N} times to ensure it's consistently fixed:
- Attempt 1: ✅/❌
- Attempt 2: ✅/❌
- Attempt 3: ✅/❌
- Attempt 4: ✅/❌
- Attempt 5: ✅/❌
```

### 2. Run Regression Tests

Ensure no side effects:

```markdown
## Regression Testing

### Related Functionality
- [ ] ${feature1} - ✅/❌
- [ ] ${feature2} - ✅/❌
- [ ] ${feature3} - ✅/❌

### Edge Cases
- [ ] ${edge_case1} - ✅/❌
- [ ] ${edge_case2} - ✅/❌
- [ ] ${edge_case3} - ✅/❌

### Error Scenarios
- [ ] ${error_scenario1} - ✅/❌
- [ ] ${error_scenario2} - ✅/❌
```

### 3. Check for Side Effects

```markdown
## Side Effect Check

### Performance
- Before: ${performance_metric}
- After: ${performance_metric}
- Impact: ${acceptable/unacceptable}

### Memory
- Before: ${memory_usage}
- After: ${memory_usage}
- Impact: ${acceptable/unacceptable}

### Dependencies
- Broken imports: ${yes/no}
- Circular dependencies: ${yes/no}
- API compatibility: ${yes/no}
```

### 4. Run Quality Checks

```bash
# Linting
npm run lint
# or
yarn lint

# Type Check
npm run typecheck
# or
npx tsc --noEmit

# Build
npm run build
# or
yarn build

# Tests
npm test -- ${related_tests}
# or
yarn test ${related_tests}
```

### 5. Self-Check Fix

```markdown
## Fix Quality Check

### Code Quality
- [ ] Follows existing patterns
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Clear variable names
- [ ] Appropriate comments

### Fix Correctness
- [ ] Addresses root cause (not just symptom)
- [ ] Minimal changes (principle of least change)
- [ ] No new bugs introduced
- [ ] Handle edge cases

### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic commented if necessary
```

### 6. Validation Report

```markdown
## Validation Summary

### Bug Fix
Status: ✅ RESOLVED / ❌ NOT RESOLVED
Consistency: ${N}/${N} attempts successful

### Quality Checks
- Linting: ✅ PASS / ❌ FAIL
- Type Check: ✅ PASS / ❌ FAIL
- Build: ✅ PASS / ❌ FAIL
- Tests: ✅ PASS / ❌ FAIL

### Regression
Related features: ✅ PASS / ❌ FAIL
Edge cases: ✅ PASS / ❌ FAIL
Side effects: ${detected/none}

### Overall Status
✅ READY / ❌ NEEDS WORK
```

### 7. Save Validation Report

Save to `.claude/.smite/.predator/debug/runs/${ts}/04_VALIDATE.md`

### Output

```
✅ VALIDATE COMPLETE

Bug Fix: ${RESOLVED/NOT_RESOLVED}
Consistency: ${N}/${N} successful attempts

Quality Checks:
- Linting: ${PASS/FAIL}
- Type Check: ${PASS/FAIL}
- Build: ${PASS/FAIL}
- Tests: ${PASS/FAIL}

Regression: ${PASS/FAIL}
Side Effects: ${detected/none}

Overall: ${READY/NEEDS_WORK}

Validation saved to: .claude/.smite/.predator/debug/runs/${ts}/04_VALIDATE.md

${if READY}Next: 05_EXAMINE (if -examine flag)
${if NOT_READY}Next: Return to 03_EXECUTE or request guidance
```
