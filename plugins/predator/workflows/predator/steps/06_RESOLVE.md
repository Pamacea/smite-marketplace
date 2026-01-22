# 06_RESOLVE - Issue Resolution

## Instructions

### 1. Initialize Resolution Tasks

Create task list from critical issues:

```markdown
## Resolution Tasks

### Critical Issues
- [ ] [Issue 1] - <Fix strategy>
- [ ] [Issue 2] - <Fix strategy>
- [ ] [Issue 3] - <Fix strategy>
```

### 2. Fix Issues Sequentially

For each critical issue:

```markdown
#### Resolving: ${Issue}

**Issue**: ${description}
**Severity**: Critical
**Agent**: ${Agent}
**Recommendation**: ${recommendation}

**Fix Applied**:
<Description of fix>

**Files Modified**:
- ${file1} - ${changes}
- ${file2} - ${changes}

✅ Resolved

**Verification**:
<How fix was verified>
```

### 3. Re-Validate After Fixes

After fixing all critical issues:

```markdown
## Re-Validation

Running validation pipeline...

### Linting
Status: ${PASS/FAIL}

### Type Check
Status: ${PASS/FAIL}

### Build
Status: ${PASS/FAIL}

### Acceptance Criteria
Passed: ${P}/${Total}

### Regression Check
<Verify original functionality still works>
```

### 4. Update Issues Log

Track all changes:

```markdown
## Resolution Log

### Issues Resolved: ${N}

**Issue 1**: ${description}
- Fix: ${fix}
- Files: ${files}
- Verified: ✅

**Issue 2**: ${description}
- Fix: ${fix}
- Files: ${files}
- Verified: ✅

### Deferred Issues: ${M}

**Issue 1**: ${description}
- Reason: ${reason}
- Recommendation: ${recommendation}

**Issue 2**: ${description}
- Reason: ${reason}
- Recommendation: ${recommendation}
```

### 5. Save Resolution Report

Save to `.predator/runs/${timestamp}/06_RESOLVE.md`

### Output

```
🔧 RESOLVE COMPLETE

Critical Issues Fixed: ${N}/${Total}
Files Modified: ${M}
Re-Validation: ${PASS/FAIL}

Deferred Issues: ${D}
(See report for details)

Resolution report saved to: .predator/runs/${timestamp}/06_RESOLVE.md

Next: 07_FINISH
```
