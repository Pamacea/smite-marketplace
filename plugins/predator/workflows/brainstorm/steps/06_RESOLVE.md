# 06_RESOLVE - Refinement (Brainstorm)

## Instructions

### 1. Initialize Refinement Tasks

```markdown
## Refinement Tasks

### Address Process Issues
- [ ] [Issue 1] - <Improvement strategy>
- [ ] [Issue 2] - <Improvement strategy>

### Fill Solution Gaps
- [ ] [Gap 1] - <Enhancement strategy>
- [ ] [Gap 2] - <Enhancement strategy>

### Address Stakeholder Concerns
- [ ] [Concern 1] - <Mitigation strategy>
- [ ] [Concern 2] - <Mitigation strategy>

### Mitigate Risk Concerns
- [ ] [Risk 1] - <Additional mitigation>
- [ ] [Risk 2] - <Additional mitigation>
```

### 2. Refine Solutions

For each issue:

```markdown
#### Addressing: ${Issue}

**Issue**: ${description}
**Source**: ${Reviewer}
**Impact**: ${how_this_affects_quality}

**Refinement Applied**:
<Description of improvement>

**Solution Impact**:
- Solution 1: ${impact_on_solution_1}
- Solution 2: ${impact_on_solution_2}
- Solution 3: ${impact_on_solution_3}

✅ Addressed
```

### 3. Update Solutions

Incorporate improvements:

```markdown
## Updated Solutions

### Solution #1: ${title} (Updated)

**Original Description**: ${original}

**Improvements Made**:
- ${improvement1}
- ${improvement2}

**Updated Score**: ${new_score} (was ${old_score})

**Updated Assessment**:
${new_evaluation}

### Solution #2: ${title} (Updated)
[Same structure]

### Solution #3: ${title} (Updated)
[Same structure]
```

### 4. Re-Validate

After refinements:

```markdown
## Re-Validation

### Solutions Still Valid
- Solution 1: ✅ VALIDATED
- Solution 2: ✅ VALIDATED
- Solution 3: ✅ VALIDATED

### Quality Check
- All concerns addressed: ✅/❌
- Solutions improved: ✅/❌
- Stakeholders satisfied: ✅/❌
- Risks mitigated: ✅/❌

### Overall Status
${READY_FOR_DELIVERY/NEEDS_MORE_WORK}
```

### 5. Update Issues Log

```markdown
## Refinement Log

### Issues Addressed: ${N}

**Issue 1**: ${description}
- Refinement: ${refinement}
- Impact: ${impact}
- Verified: ✅

**Issue 2**: ${description}
- Refinement: ${refinement}
- Impact: ${impact}
- Verified: ✅

### Deferred Issues: ${M}

**Issue 1**: ${description}
- Reason: ${reason}
- Recommendation: ${recommendation}
```

### 6. Save Refinement Report

Save to `.predator/brainstorm/runs/${ts}/06_RESOLVE.md`

### Output

```
🔧 RESOLVE COMPLETE

Issues Addressed: ${N}/${Total}
Solutions Improved: ${N}
Re-Validation: ${PASS/FAIL}

Deferred Issues: ${D}
(See report for details)

Refinement saved to: .predator/brainstorm/runs/${ts}/06_RESOLVE.md

Next: 07_FINISH
```
