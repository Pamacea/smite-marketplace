# 02_PLAN - Debug Strategy

## Instructions

### 1. Create Hypothesis List

Based on analysis, list possible root causes:

```markdown
## Hypotheses

### Hypothesis 1: ${title}
**Probability**: High/Medium/Low
**Root Cause**: ${description}
**Evidence**: ${supporting_evidence}
**Test Strategy**: ${how_to_test}

### Hypothesis 2: ${title}
**Probability**: High/Medium/Low
**Root Cause**: ${description}
**Evidence**: ${supporting_evidence}
**Test Strategy**: ${how_to_test}

### Hypothesis 3: ${title}
...
```

### 2. Define Investigation Strategy

Order hypotheses by probability:

```markdown
## Investigation Strategy

### Priority 1: Test Hypothesis ${N}
${hypothesis_title}

**Steps**:
1. ${step1}
2. ${step2}
3. ${step3}

**Expected Result**: ${what_confirms_hypothesis}

### Priority 2: Test Hypothesis ${N}
${hypothesis_title}

**Steps**:
...

**Expected Result**: ${what_confirms_hypothesis}
```

### 3. Define Acceptance Criteria

What constitutes a successful fix:

```markdown
## Acceptance Criteria

### Bug Fix Verification
- [ ] Bug no longer occurs
- [ ] Original functionality preserved
- [ ] No side effects introduced

### Validation
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] Related tests pass

### Regression Testing
- [ ] Test related functionality
- [ ] Test edge cases
- [ ] Test error scenarios
```

### 4. Risk Assessment

```markdown
## Risk Assessment

### Fix Complexity
- Low: ${simple_one_liner}
- Medium: ${requires_refactoring}
- High: ${architectural_change}

### Potential Side Effects
- ${side_effect_1}
- ${side_effect_2}

### Affected Areas
- ${area_1}
- ${area_2}
```

### 5. User Approval (unless -auto)

If not auto mode, confirm strategy:

```
📋 DEBUG STRATEGY READY

Hypotheses to Test: ${N}
Priority: ${hypothesis_1}

Approach:
${strategy}

Ready to investigate? (y/n)
```

### 6. Save Plan

Save to `.claude/.smite/.predator/debug/runs/${ts}/02_PLAN.md`

### Output

```
📋 PLAN COMPLETE
Hypotheses: ${N} identified
Priority: ${top_hypothesis}
Strategy: ${investigation_approach}

Plan saved to: .claude/.smite/.predator/debug/runs/${ts}/02_PLAN.md

Next: 03_EXECUTE (test hypotheses and fix)
```
