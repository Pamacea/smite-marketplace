# 04_VALIDATE - Solution Verification

## Instructions

### 1. Verify Solutions Meet Criteria

Check each top solution against success criteria:

```markdown
## Solution Validation

### Solution #1: ${title}

#### Meets Success Criteria?
- [ ] Criteria 1 - ${how_measured} ✅/❌
- [ ] Criteria 2 - ${how_measured} ✅/❌
- [ ] Criteria 3 - ${how_measured} ✅/❌

**Overall**: ${PASSED/FAILED}

### Solution #2: ${title}
[Same structure]

### Solution #3: ${title}
[Same structure]
```

### 2. Check Feasibility

```markdown
## Feasibility Analysis

### Technical Feasibility
- Solution 1: ${feasible_with_notes}
- Solution 2: ${feasible_with_notes}
- Solution 3: ${feasible_with_notes}

### Resource Feasibility
- Solution 1: ${resources_required} - ${feasible/stretched}
- Solution 2: ${resources_required} - ${feasible/stretched}
- Solution 3: ${resources_required} - ${feasible/stretched}

### Timeline Feasibility
- Solution 1: ${estimated_time} - ${feasible/aggressive/unrealistic}
- Solution 2: ${estimated_time} - ${feasible/aggressive/unrealistic}
- Solution 3: ${estimated_time} - ${feasible/aggressive/unrealistic}
```

### 3. Assess Risks

```markdown
## Risk Assessment

### Solution #1: ${title}
**High Risks**:
- ${risk1} - ${mitigation}
- ${risk2} - ${mitigation}

**Medium Risks**:
- ${risk1} - ${mitigation}

**Low Risks**:
- ${risk1} - ${mitigation}

**Overall Risk Level**: ${HIGH/MEDIUM/LOW}

### Solution #2: ${title}
[Same structure]

### Solution #3: ${title}
[Same structure]
```

### 4. Self-Check Quality

```markdown
## Quality Self-Check

### Idea Quality
- [ ] Ideas are original and creative
- [ ] Ideas are well-defined and clear
- [ ] Ideas address the core problem
- [ ] Ideas consider constraints

### Process Quality
- [ ] Sufficient diversity in idea generation
- [ ] Thorough challenge phase completed
- [ ] Fair and objective evaluation
- [ ] Synthesis is logical

### Output Quality
- [ ] Solutions are actionable
- [ ] Recommendations are justified
- [ ] Trade-offs are acknowledged
- [ ] Next steps are clear
```

### 5. Validation Report

```markdown
## Validation Summary

### Solutions Validated
- Solution 1: ${PASSED/FAILED} - ${reason}
- Solution 2: ${PASSED/FAILED} - ${reason}
- Solution 3: ${PASSED/FAILED} - ${reason}

### Feasibility Summary
- Fully feasible: ${N}
- Feasible with effort: ${N}
- Not feasible: ${N}

### Risk Summary
- Low risk solutions: ${N}
- Medium risk solutions: ${N}
- High risk solutions: ${N}

### Recommendations
${which_solutions_to_recommend_and_why}

### Overall Assessment
${overall_quality_of_brainstorm_session}
```

### 6. Save Validation Report

Save to `.predator/brainstorm/runs/${ts}/04_VALIDATE.md`

### Output

```
✅ VALIDATE COMPLETE

Solutions Validated: ${N}/${Total}
Feasible Solutions: ${N}
Low-Risk Solutions: ${N}

Top Recommendation: ${title}

Validation saved to: .predator/brainstorm/runs/${ts}/04_VALIDATE.md

Next: 05_EXAMINE (if -examine flag)
```
