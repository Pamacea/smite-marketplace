# 06_RESOLVE - Issue Resolution (Debug)

## Instructions

### 1. Initialize Resolution Tasks

Create task list from critical issues:

```markdown
## Fix Improvement Tasks

### Critical Issues
- [ ] [Issue 1] - <Fix strategy>
- [ ] [Issue 2] - <Fix strategy>
- [ ] [Issue 3] - <Fix strategy>
```

### 2. Improve Fix Sequentially

For each critical issue:

```markdown
#### Improving: ${Issue}

**Issue**: ${description}
**Severity**: Critical
**Agent**: ${Agent}
**Recommendation**: ${recommendation}

**Improvement Applied**:
<Description of improvement>

**Files Modified**:
- ${file1} - ${changes}
- ${file2} - ${changes}

✅ Improved

**Re-verification**:
<How improvement was verified>
```

### 3. Re-Validate After Improvements

After fixing all critical issues:

```markdown
## Re-Validation

### Bug Still Fixed?
Run original bug reproduction:
- Attempt 1: ✅/❌
- Attempt 2: ✅/❌
- Attempt 3: ✅/❌

Status: ${STILL_FIXED/REgressed}

### Quality Checks
- Linting: ✅/❌
- Type Check: ✅/❌
- Build: ✅/❌
- Tests: ✅/❌

### Regression Check
Test related functionality:
- ${feature1}: ✅/❌
- ${feature2}: ✅/❌
- ${feature3}: ✅/❌
```

### 4. Update Issues Log

```markdown
## Improvement Log

### Issues Improved: ${N}

**Issue 1**: ${description}
- Improvement: ${improvement}
- Files: ${files}
- Verified: ✅

**Issue 2**: ${description}
- Improvement: ${improvement}
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

Save to `.predator/debug/runs/${ts}/06_RESOLVE.md`

### Output

```
🔧 RESOLVE COMPLETE

Issues Improved: ${N}/${Total}
Files Modified: ${M}
Re-Validation: ${PASS/FAIL}
Bug Still Fixed: ${YES/NO}

Deferred Issues: ${D}
(See report for details)

Resolution saved to: .predator/debug/runs/${ts}/06_RESOLVE.md

Next: 07_FINISH
```
