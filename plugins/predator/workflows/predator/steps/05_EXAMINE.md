# 05_EXAMINE - Adversarial Code Review

## Instructions

### 1. Launch Multi-Agent Review

Launch parallel adversarial reviewers:

```markdown
## Launching Adversarial Review Agents

### Agent 1: Security Reviewer
<instructions>
Review the implementation for security vulnerabilities:
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization issues
- Data exposure
- Input validation
- Output encoding
</instructions>

### Agent 2: Code Quality Reviewer
<instructions>
Review for code quality issues:
- Code smells
- Anti-patterns
- Performance issues
- Maintainability concerns
- Duplicated code
- Complex logic
</instructions>

### Agent 3: Logic Reviewer
<instructions>
Review for logical correctness:
- Edge cases
- Error handling
- Race conditions
- State consistency
- Data flow
- Business logic
</instructions>

### Agent 4: Architecture Reviewer
<instructions>
Review architectural decisions:
- Pattern consistency
- Separation of concerns
- Coupling/cohesion
- Scalability
- Testability
</instructions>
```

### 2. Aggregate Findings

Collect all findings from agents:

```markdown
## Review Findings

### Critical Issues (Must Fix)
- [Issue] - <Agent> - <Recommendation>

### High Priority (Should Fix)
- [Issue] - <Agent> - <Recommendation>

### Medium Priority (Consider Fixing)
- [Issue] - <Agent> - <Recommendation>

### Low Priority (Nice to Have)
- [Issue] - <Agent> - <Recommendation>

### False Positives (Can Ignore)
- [Issue] - <Agent> - <Reason>
```

### 3. Prioritize Issues

Create action plan:

```markdown
## Issue Resolution Plan

### Must Fix Before Completion
1. [Critical Issue] - <Fix strategy>
2. [Critical Issue] - <Fix strategy>

### Should Fix if Time Permits
1. [High Priority Issue] - <Fix strategy>
2. [High Priority Issue] - <Fix strategy>

### Can Defer
1. [Medium/Low Issue] - <Reason>
```

### 4. Save Review Report

Save to `.claude/.smite/.predator/runs/${timestamp}/05_EXAMINE.md`

### Output

```
🔍 EXAMINE COMPLETE

Review Summary:
- Critical Issues: ${C}
- High Priority: ${H}
- Medium Priority: ${M}
- Low Priority: ${L}

Agents Consulted:
- Security Reviewer ✅
- Code Quality Reviewer ✅
- Logic Reviewer ✅
- Architecture Reviewer ✅

Review report saved to: .claude/.smite/.predator/runs/${timestamp}/05_EXAMINE.md

${if C > 0}Next: 06_RESOLVE (critical issues found)
${if C == 0}Next: 07_FINISH (no critical issues)
```
