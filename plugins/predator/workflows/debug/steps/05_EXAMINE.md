# 05_EXAMINE - Fix Review (Debug)

## Instructions

### 1. Launch Multi-Agent Review

Review the bug fix from multiple perspectives:

```markdown
## Launching Fix Review Agents

### Agent 1: Correctness Reviewer
<instructions>
Verify the fix is correct:
- Does it address the root cause?
- Does it fix the bug completely?
- Are there edge cases not handled?
- Could the bug reoccur?
</instructions>

### Agent 2: Safety Reviewer
<instructions>
Review for safety issues:
- Are there new bugs introduced?
- Is error handling appropriate?
- Could this break other functionality?
- Are there performance concerns?
</instructions>

### Agent 3: Code Quality Reviewer
<instructions>
Review code quality:
- Does it follow existing patterns?
- Is it maintainable?
- Is it clear and readable?
- Are there better approaches?
</instructions>

### Agent 4: Test Coverage Reviewer
<instructions>
Review test coverage:
- Are all scenarios covered?
- Are edge cases tested?
- Is regression testing adequate?
- Are there missing test cases?
```

### 2. Aggregate Findings

```markdown
## Fix Review Findings

### Critical Issues (Must Fix)
- [Issue] - <Agent> - <Recommendation>

### High Priority (Should Fix)
- [Issue] - <Agent> - <Recommendation>

### Medium Priority (Consider Fixing)
- [Issue] - <Agent> - <Recommendation>

### Suggestions (Optional)
- [Suggestion] - <Agent> - <Reason>

### Confirmations (Good Practices)
- [Confirmation] - <Agent> - <What was done well>
```

### 3. Verify Fix Robustness

```markdown
## Fix Robustness Check

### Root Cause Addressed
- [ ] Root cause correctly identified
- [ ] Fix addresses root cause (not symptom)
- [ ] Bug cannot reoccur with this fix

### Edge Cases Covered
- [ ] Normal case: ${tested}
- [ ] Edge case 1: ${tested}
- [ ] Edge case 2: ${tested}
- [ ] Error case: ${tested}

### Error Handling
- [ ] Appropriate error handling
- [ ] Graceful failure
- [ ] Clear error messages

### Performance
- [ ] No performance regression
- [ ] Efficient implementation
- [ ] Scalable solution
```

### 4. Save Review Report

Save to `.claude/.smite/.predator/debug/runs/${ts}/05_EXAMINE.md`

### Output

```
🔍 EXAMINE COMPLETE

Fix Review Summary:
- Critical Issues: ${C}
- High Priority: ${H}
- Medium Priority: ${M}
- Confirmations: ${K}

Robustness:
- Root cause addressed: ✅/❌
- Edge cases covered: ✅/❌
- Error handling: ✅/❌
- Performance: ✅/❌

Review saved to: .claude/.smite/.predator/debug/runs/${ts}/05_EXAMINE.md

${if C > 0}Next: 06_RESOLVE (critical issues found)
${if C == 0}Next: 07_FINISH (fix is solid)
```
