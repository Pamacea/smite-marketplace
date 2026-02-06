---
name: quality
description: Quality-gated implementation - comprehensive validation and adversarial review
version: 1.0.0
---

# Quality Skill - Quality-Gated Implementation

## Mission

Execute implementation with comprehensive quality gates, adversarial review, and systematic validation.

---

## 🎯 When to Use

**Perfect for:**
- Critical systems (payment, auth, security)
- Production-ready code
- High-reliability requirements
- Security-sensitive features
- Performance-critical code

**NOT for:**
- Quick prototypes (use `--speed`)
- Internal tools (use `--scale`)
- Experimental features (use `--scale`)

---

## 📋 Workflow: 8-Step Quality Process

### Step 00: INIT

```markdown
1. Parse flags and requirements
2. Create output folder
3. Initialize quality config
4. Output: state.json
```

### Step 01: ANALYZE

```markdown
1. Gather context
   - Explore codebase
   - Find similar patterns
   - Check dependencies

2. Identify quality requirements
   - Security considerations
   - Performance requirements
   - Test coverage targets

3. Output: 01_ANALYZE.md
```

### Step 02: PLAN

```markdown
1. Create strategy
   - Implementation approach
   - Quality criteria
   - Success metrics

2. Define criteria
   - Functional requirements
   - Non-functional requirements
   - Edge cases to handle

3. Output: 02_PLAN.md
```

### Step 03: EXECUTE

```markdown
1. Implement using plan
   - Follow best practices
   - Add validation (Zod schemas)
   - Include error handling

2. Use tech-specific subagent if --tech specified
   - impl-nextjs, impl-rust, impl-python, impl-go

3. Output: 03_EXECUTE.md + implementation/
```

### Step 04: VALIDATE

```markdown
1. Quality checks
   - Linting (ESLint, etc.)
   - Type checking (tsc, etc.)
   - Unit tests
   - Integration tests

2. Coverage measurement
   - Target: 80%+
   - Critical paths: 100%

3. Output: 04_VALIDATE.md
```

### Step 05: EXAMINE (Adversarial)

```markdown
1. Second agent challenges implementation
   - Finds edge cases
   - Security review
   - Performance analysis
   - Error handling review

2. Report issues found
   - Security vulnerabilities
   - Performance bottlenecks
   - Logic errors
   - Missing validations

3. Output: 05_EXAMINE.md
```

### Step 06: RESOLVE (if issues)

```markdown
1. Fix identified issues
   - Security fixes
   - Performance improvements
   - Bug fixes
   - Additional tests

2. Re-run validation
   - Ensure all checks pass
   - No regressions

3. Output: 06_RESOLVE.md
```

### Step 07: FINISH

```markdown
1. Final summary
   - What was built
   - Quality metrics
   - Known limitations
   - Next steps

2. Output: 07_FINISH.md + SUMMARY.md
```

---

## 📊 Example

```bash
# Usage
/implement --quality "implement payment processing system"

# Aliases
/implement --validate "..."
/implement --predator "..."
```

### What Happens

```
You: /implement --quality "implement payment system"

00_INIT: Setup quality gates

01_ANALYZE: Deep analysis
  → Security requirements
  → Performance targets
  → Compliance needs

02_PLAN: Quality-focused plan
  → Validation strategy
  → Test coverage plan
  → Security measures

03_EXECUTE: Implementation with quality
  → Zod validation schemas
  → Error handling
  → Logging

04_VALIDATE: Quality checks
  → Lint: PASS
  → Typecheck: PASS
  → Tests: 45/45 PASS
  → Coverage: 87%

05_EXAMINE: Adversarial review
  → Found: 3 security issues
  → Found: 2 performance concerns
  → Found: 1 edge case

06_RESOLVE: Fix all issues
  → Security: Fixed
  → Performance: Optimized
  → Edge case: Handled

07_FINISH: Summary
  → All quality gates PASSED
  → Ready for production

Done! (120 minutes total)
```

---

## 🛡️ Quality Gates

### Must Pass Before Finish

```markdown
✅ Linting (zero warnings preferred)
✅ Type checking (zero errors)
✅ Unit tests (100% pass rate)
✅ Integration tests (100% pass rate)
✅ Coverage (80%+ minimum, 90%+ preferred)
✅ Security review (no critical issues)
✅ Performance review (no bottlenecks)
✅ Error handling (all paths covered)
```

---

## 🔍 Adversarial Review

### What the Second Agent Checks

```markdown
1. Security
   - Input validation
   - SQL injection
   - XSS vulnerabilities
   - Authentication/authorization
   - Sensitive data handling

2. Performance
   - Algorithmic complexity
   - Database queries (N+1, missing indexes)
   - Memory leaks
   - Unnecessary re-renders
   - Cache utilization

3. Edge Cases
   - Empty inputs
   - Null/undefined handling
   - Boundary conditions
   - Concurrent access
   - Error scenarios

4. Code Quality
   - Duplication (DRY)
   - Naming clarity
   - Function complexity
   - Type safety
   - Documentation gaps
```

---

## ✅ Success Criteria

- ✅ All quality gates passed
- ✅ Adversarial review completed
- ✅ Issues resolved (or documented)
- ✅ Tests comprehensive
- ✅ Coverage 80%+
- ✅ Zero high-priority issues
- ✅ Production-ready

---

## 📁 Output Files

```
.claude/.smite/implement-{timestamp}/
├── 00_INIT.md
├── 01_ANALYZE.md
├── 02_PLAN.md
├── 03_EXECUTE.md
├── implementation/
│   └── [code]
├── 04_VALIDATE.md
├── 05_EXAMINE.md
├── 06_RESOLVE.md (if needed)
├── 07_FINISH.md
└── SUMMARY.md
```

---

## 🔄 Related Flags

| Flag | When to use instead |
|------|---------------------|
| `--speed` | Quick fixes, non-critical |
| `--scale` | Standard features, less critical |
| `--team` | Large projects, parallel needed |
| `--quality --team` | Quality + parallel (maximum!) |
| `--scale --quality` | Thorough + validated |

---

## 💡 Tips

1. **Plan for quality** - Design it in from the start
2. **Use Zod** - Parse, don't validate
3. **Test early** - Don't leave testing for the end
4. **Accept challenges** - Adversarial review finds real issues
5. **Document decisions** - Explain trade-offs

---

## ⏱️ Time Budget

| Phase | Budget | Action |
|-------|--------|--------|
| INIT | 2 min | Setup |
| ANALYZE | 10 min | Requirements |
| PLAN | 15 min | Strategy |
| EXECUTE | 45 min | Implementation |
| VALIDATE | 20 min | Quality checks |
| EXAMINE | 20 min | Adversarial |
| RESOLVE | 10 min | Fix issues |
| FINISH | 5 min | Summary |
| **Total** | **127 min** (~2 hours) | |

---

## 🚨 Anti-Patterns

### AVOID:

```markdown
❌ Skipping adversarial review
   → You'll miss issues

❌ Ignoring quality gate failures
   → Not production-ready

❌ Rushing the planning phase
   → Quality starts with design

❌ Treating warnings as acceptable
   → Zero tolerance for quality issues

❌ Skipping edge cases
   → They will fail in production
```

---

*Quality Skill v1.0.0 - Quality-gated implementation with adversarial review*
