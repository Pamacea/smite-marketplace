# 05_EXAMINE - Adversarial Review (Brainstorm)

## Instructions

### 1. Launch Multi-Agent Review

Review the brainstorming process and solutions:

```markdown
## Launching Review Agents

### Agent 1: Process Reviewer
<instructions>
Review the brainstorming process:
- Was the idea generation diverse enough?
- Were the challenges fair and thorough?
- Was the synthesis objective?
- Were there biases in the process?
- What could improve the process?
</instructions>

### Agent 2: Solution Reviewer
<instructions>
Review the top solutions:
- Are solutions truly innovative?
- Are solutions practical and actionable?
- Are there better solutions not considered?
- Are solutions missing key considerations?
- Are there gaps in the evaluation?
</instructions>

### Agent 3: Stakeholder Reviewer
<instructions>
Review from stakeholder perspectives:
- User perspective: Are user needs met?
- Business perspective: Is there business value?
- Technical perspective: Is it technically sound?
- Operational perspective: Can it be maintained?
- Are all stakeholder interests considered?
</instructions>

### Agent 4: Risk Analyst
<instructions>
Review risks thoroughly:
- Are risks properly identified?
- Are risk mitigations realistic?
- Are there hidden risks not considered?
- Are failure scenarios addressed?
- Is the risk level acceptable?
</instructions>
```

### 2. Aggregate Findings

```markdown
## Review Findings

### Process Issues (if any)
- [Issue] - <Reviewer> - <Recommendation>

### Solution Gaps (if any)
- [Gap] - <Reviewer> - <Recommendation>

### Stakeholder Concerns (if any)
- [Concern] - <Reviewer> - <Recommendation>

### Risk Concerns (if any)
- [Concern] - <Reviewer> - <Recommendation>

### Strengths (What was done well)
- [Strength] - <Reviewer>
- [Strength] - <Reviewer>
```

### 3. Re-evaluate Solutions

Based on review findings:

```markdown
## Re-evaluation

### Solutions Requiring Revision
${solutions_that_need_improvement}

### New Considerations
${new_factors_to_consider}

### Adjusted Rankings
${if_rankings_changed}
```

### 4. Save Review Report

Save to `.predator/brainstorm/runs/${ts}/05_EXAMINE.md`

### Output

```
🔍 EXAMINE COMPLETE

Review Summary:
- Process Issues: ${N}
- Solution Gaps: ${N}
- Stakeholder Concerns: ${N}
- Risk Concerns: ${N}

Strengths Identified: ${S}

Re-evaluation:
- Solutions requiring revision: ${N}
- New considerations: ${N}

Review saved to: .predator/brainstorm/runs/${ts}/05_EXAMINE.md

${if N > 0}Next: 06_RESOLVE (address concerns)
${if N == 0}Next: 07_FINISH (solutions are solid)
```
