---
name: adversarial
description: Adversarial quality challenge mode - "Prove it works"
version: 1.0.0
---

# Adversarial Mode Skill

## Mission

Challenge implementation work to find edge cases, security issues, performance problems, and UX gaps.

## Philosophy

> **"Prove to me this works"** > *"Est-ce que ça marche ?"*

The adversarial agent actively looks for:
- Edge cases not covered
- Performance bottlenecks
- Security vulnerabilities
- UX problems
- Missing error handling

## When Used

```bash
/implement --MODE --adversarial "Build feature"
```

Or auto-activates for:
- Critical code (auth, payment, security-sensitive)
- Production deployment imminent
- `--predator --parallel=2`

## Challenge Checklist

### 1. Functional Completeness
- [ ] All happy paths covered?
- [ ] Input validations complete?
- [ ] Error messages useful?
- [ ] Business edge cases handled?

### 2. Error Handling
- [ ] API failure handled?
- [ ] Database down handled?
- [ ] Invalid data handled?
- [ ] Timeouts managed?
- [ ] Retries appropriate?

### 3. Performance
- [ ] No N+1 queries?
- [ ] Large datasets paginated?
- [ ] Expensive computations cached?
- [ ] No memory leaks?

### 4. Security
- [ ] Inputs validated/sanitized?
- [ ] Sensitive data protected?
- [ ] Permissions checked?
- [ ] No XSS/SQLi vulnerabilities?

### 5. UX Edge Cases
- [ ] Empty state handled?
- [ ] Loading state handled?
- [ ] Error state handled?
- [ ] Success feedback clear?
- [ ] Extreme data values handled?

## Challenge Workflow

```
1. REVIEW implementation
   ↓
2. IDENTIFY issues using checklist
   ↓
3. CREATE challenge report
   ↓
4. PRESENT challenges to implementer
   ↓
5. VERIFY fixes
   ↓
6. APPROVE or re-challenge
```

## Challenge Message Template

```markdown
## ❓ Challenge: [Title]

**Severity:** HIGH/MEDIUM/LOW

**Problem:**
[Description of what's wrong or missing]

**Current Behavior:**
[What happens now]

**Expected Behavior:**
[What should happen]

**Impact:**
[What could go wrong]

**Suggested Fix:**
[How to fix it]

**Thoughts?**
```

## Report Template

```markdown
## Adversarial Report - [Feature]

### Summary
[Overall assessment: PASS/CONDITIONAL/FAIL]

### Critical Issues
1. **[Title]** (Severity)
   - Problem: [...]
   - Location: `file:line`
   - Impact: [...]
   - Fix: [...]

### Edge Cases Found
1. **[Case]** - Scenario, Current, Expected, Fix

### Performance Concerns
1. **[Issue]** - Problem, Impact, Fix

### Security Notes
1. **[Note]** - Concern, Severity, Fix

### Missing Tests
- [ ] Test for [scenario]

### Recommendations
1. [Suggestion]

### Final Verdict
**[PASS/CONDITIONAL/FAIL]**
```

## Integration

Works with:
- `/implement --epct --adversarial`
- `/implement --builder --adversarial`
- `/implement --predator --adversarial`
- `/refactor --full --adversarial`

## Configuration

```json
{
  "adversarial": {
    "strictness": "medium",
    "checklist": {
      "functional": true,
      "errors": true,
      "performance": true,
      "security": true,
      "ux": true
    }
  }
}
```

---

*Adversarial Skill v1.0.0*
