# 03_EXECUTE - Fix Implementation

## Instructions

### 1. Initialize TodoWrite

Create investigation tasks:

```markdown
## Investigation Tasks

### Hypothesis Testing
- [ ] Test Hypothesis 1: ${title}
- [ ] Test Hypothesis 2: ${title}
- [ ] Test Hypothesis 3: ${title}

### Fix Implementation
- [ ] Implement fix once root cause confirmed
- [ ] Verify fix resolves bug
- [ ] Check for side effects
```

### 2. Test Hypotheses Sequentially

For each hypothesis:

```markdown
#### Testing Hypothesis ${N}: ${title}

**Hypothesis**: ${description}

**Test Steps**:
1. ${step1}
2. ${step2}
3. ${step3}

**Test Execution**:
<Execute test steps>

**Result**:
${CONFIRMED/REJECTED}

**Evidence**:
${what_confirms_or_rejects}

${if CONFIRMED}✅ Root cause identified!
${if REJECTED}❌ Not the root cause, move to next hypothesis
```

### 3. Implement Fix

Once root cause is confirmed:

```markdown
#### Implementing Fix

**Root Cause**: ${confirmed_root_cause}

**Fix Strategy**:
${fix_approach}

**Files to Modify**:
- ${file1} - ${changes}
- ${file2} - ${changes}

**Implementation**:
<Code changes>

✅ Fix implemented
```

### 4. Update TodoWrite

Mark tasks complete as you progress:

```markdown
### Progress Update

- [x] Test Hypothesis 1: ${title} - ${result}
- [x] Test Hypothesis 2: ${title} - ${result}
- [ ] Test Hypothesis 3: ${title}
- [x] Implement fix
- [ ] Verify fix
```

### 5. Track Changes

```markdown
## Change Log

### Files Modified
- `path/to/file1.ts` - ${change_description}
- `path/to/file2.ts` - ${change_description}

### Changes Made
${detailed_description_of_changes}

### Lines Changed
- Added: ${N}
- Removed: ${M}
- Modified: ${O}
```

### 6. Test Fix Immediately

Verify the fix works:

```markdown
## Fix Verification

### Test Case 1: Original Bug Reproduction
**Steps**: ${reproduction_steps}
**Expected**: ${bug_no_longer_occurs}
**Actual**: ${result}
**Status**: ✅/❌

### Test Case 2: Normal Functionality
**Steps**: ${normal_usage}
**Expected**: ${works_correctly}
**Actual**: ${result}
**Status**: ✅/❌
```

### 7. Loop Until Fixed (Respect max_attempts)

If fix doesn't work:
- Increment attempt counter
- If attempts < max_attempts: Return to hypothesis testing
- If attempts >= max_attempts: Request guidance

### 8. Save Execution Log

Save to `.claude/.smite/.predator/debug/runs/${ts}/03_EXECUTE.md`

### Output

```
🔧 EXECUTE COMPLETE

Hypothesis Testing:
- Tested: ${N}/${Total}
- Root Cause: ${confirmed_hypothesis}

Fix Applied:
- Files modified: ${M}
- Lines changed: ${A}/${R}
- Attempts: ${attempts}

Verification:
- Bug fixed: ✅/❌
- Functionality preserved: ✅/❌

Execution log saved to: .claude/.smite/.predator/debug/runs/${ts}/03_EXECUTE.md

Next: 04_VALIDATE (comprehensive verification)
```
