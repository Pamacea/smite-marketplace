# Step 2: Review Issues

**Flag**: `-r` or `--review`

## Purpose

Review detected issues, prioritize them, estimate effort, and create an action plan for refactoring.

## What To Do

### 1. Load Analysis Report

Read `.claude/.smite/refactor-analysis.md` or `refactor-analysis.json`

### 2. Prioritization Framework

Use this framework to prioritize issues:

```markdown
## Priority Matrix

### Priority 1 (Critical) 🔴
**Criteria:**
- Complexity > 15
- Security vulnerabilities
- Performance bottlenecks
- Blocks other work
- High business impact

**Examples:**
- God object blocking team velocity
- Critical path complexity
- Memory leaks
- Type safety violations

### Priority 2 (High) 🟠
**Criteria:**
- Complexity 11-15
- High duplication rate
- Major code smells
- Affects multiple files
- Medium business impact

**Examples:**
- Long parameter lists
- Feature envy
- Significant duplication

### Priority 3 (Medium) 🟡
**Criteria:**
- Complexity 8-10
- Minor code smells
- Limited duplication
- Localized impact
- Low business impact

**Examples:**
- Poor naming
- Magic numbers
- Minor duplications

### Priority 4 (Low) 🟢
**Criteria:**
- Complexity < 8
- Style issues
- Cosmetic problems
- Very low impact

**Examples:**
- Comment formatting
- Minor naming improvements
- Dead code removal
```

### 3. Impact Assessment

For each issue, assess:

```markdown
## Impact Assessment Template

### Issue #[ID]: [Title]

#### Business Impact
- **User-facing**: [Yes/No] - [Explanation]
- **Revenue impact**: [High/Medium/Low/None]
- **Team velocity**: [Blocked/Slowed/Neutral]
- **Maintenance burden**: [High/Medium/Low]

#### Technical Impact
- **Affected files**: [N]
- **Dependencies**: [List]
- **Test coverage**: [X%]
- **Risk of breakage**: [High/Medium/Low]
- **Performance impact**: [Critical/Noticeable/None]

#### Effort Estimation
- **Complexity**: [Simple/Medium/Complex]
- **Estimated time**: [X hours]
- **Risk level**: [High/Medium/Low]
- **Requires**: [Design review/Tests/Refactoring/etc]

#### Recommendation
- **Priority**: [1/2/3/4]
- **Action**: [Refactor/Extract/Rename/Delete/etc]
- **Confidence**: [High/Medium/Low]
```

### 4. Generate Review Report

Create comprehensive review:

```markdown
# Refactoring Review Report

**Date**: [Timestamp]
**Reviewer**: Refactor Agent
**Analysis**: Based on refactor-analysis.md

## Executive Summary

**Total Issues**: [N]
- Priority 1 (Critical): [N] 🔴
- Priority 2 (High): [N] 🟠
- Priority 3 (Medium): [N] 🟡
- Priority 4 (Low): [N] 🟢

**Estimated Effort**:
- Total time: [X hours]
- Quick wins (< 30min): [N]
- Medium tasks (30min-2h): [N]
- Large tasks (> 2h): [N]

**Risk Distribution**:
- High risk: [N]
- Medium risk: [N]
- Low risk: [N]

## Priority 1 Issues (Critical) 🔴

### 1. [Issue Title]
**Location**: `src/components/UserForm.tsx:45`
**Type**: Complexity
**Severity**: Critical

**Impact**:
- Business: [Description]
- Technical: [Description]
- Risk: [High/Medium/Low]

**Proposed Solution**:
- Method: [Extract method/Introduce parameter object/etc]
- Steps: [Step 1, Step 2, Step 3]
- Estimated time: [X min/hours]
- Confidence: [High/Medium/Low]

**Validation Requirements**:
- [ ] Test coverage adequate
- [ ] Impact analysis needed
- [ ] Performance testing required
- [ ] Security review needed

### 2. [Issue Title]
[Same format]

## Priority 2 Issues (High) 🟠

[Same format as above]

## Priority 3 Issues (Medium) 🟡

[Same format as above]

## Priority 4 Issues (Low) 🟢

[Same format as above]

## Action Plan

### Quick Wins (Today)
These can be done immediately with low risk:

1. [Issue] - [X min] - [Brief description]
2. [Issue] - [X min] - [Brief description]
**Total**: [X minutes]

### This Week
Medium effort, high value:

1. [Issue] - [X hours] - [Brief description]
2. [Issue] - [X hours] - [Brief description]
**Total**: [X hours]

### This Sprint
Larger items requiring planning:

1. [Issue] - [X hours] - [Brief description]
2. [Issue] - [X hours] - [Brief description]
**Total**: [X hours]

### Backlog
Lower priority or high risk:

1. [Issue] - [X hours] - [Brief description]
2. [Issue] - [X hours] - [Brief description]

## Recommendations

### Immediate Actions
1. [Most important action]
2. [Second important action]
3. [Third important action]

### Process Improvements
1. [Suggestion to prevent recurrence]
2. [Tooling recommendation]
3. [Team training suggestion]

### Technical Debt Strategy
- **Current**: [X/100] - [Status]
- **Target**: [Y/100] - [Status]
- **Strategy**: [Description]

## Risk Assessment

### High Risk Items
These require careful planning and testing:

1. [Issue] - [Risk description] - [Mitigation]

### Medium Risk Items
These require standard precautions:

1. [Issue] - [Risk description] - [Mitigation]

## Success Metrics

Track these metrics after refactoring:

- **Complexity**: Target reduction [X]%
- **Duplication**: Target reduction [Y]%
- **Test coverage**: Target [Z]%
- **Technical debt**: Target score [N/100]

## Appendix

### Excluded Items
These were detected but excluded from refactoring:

1. [Item] - Reason: [Explanation]

### Requires Discussion
These need team discussion:

1. [Item] - Reason: [Explanation]
```

### 5. Create Action Items JSON

```json
{
  "timestamp": "2025-01-22T10:30:00Z",
  "quickWins": [
    {
      "id": 1,
      "title": "Rename poorly named variable",
      "file": "src/utils/helpers.ts",
      "line": 23,
      "estimatedMinutes": 5,
      "risk": "low"
    }
  ],
  "thisWeek": [
    {
      "id": 2,
      "title": "Extract validation logic",
      "file": "src/components/UserForm.tsx",
      "line": 45,
      "estimatedHours": 1,
      "risk": "medium"
    }
  ],
  "thisSprint": [
    {
      "id": 3,
      "title": "Break down god object",
      "file": "src/models/Data.ts",
      "estimatedHours": 4,
      "risk": "high"
    }
  ]
}
```

### 6. Save Report

- Location: `.claude/.smite/refactor-review.md`
- Machine-readable: `.claude/.smite/refactor-review.json`

## Output

- ✅ Prioritized issue list
- ✅ Impact assessment for each issue
- ✅ Effort estimates
- ✅ Action plan with timelines
- ✅ Risk assessment
- ✅ Success metrics defined
- ✅ Saved to `.claude/.smite/refactor-review.md`

## Next Step

Proceed to `03-validate.md` (use `-v --item=<ID>`) to validate specific changes before implementing

## MCP Tools Used

- ✅ Impact analysis (from toolkit)
- ✅ Dependency graph (understand blast radius)
- ✅ Test coverage analysis
- ✅ Type checking (identify risk areas)
