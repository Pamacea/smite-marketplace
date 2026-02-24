---
name: multi-review
description: MANDATORY gate BEFORE merging PR or deploying to production in smite project. Invoke FIRST when 'comprehensive review', 'check security', 'performance review', 'test coverage review', 'code quality audit' - orchestrates parallel review by 4 specialized agents (security, performance, testing, documentation) with consolidated report and scoring. Specific phrases: 'review this PR', 'security audit', 'performance check', 'test review'. (user)
category: workflow
version: 1.0.0
tags: [review, multi-agent, security, performance, testing]
triggers: [review-team, comprehensive-review, multi-review]
lazy_load: true
---

# Multi-Agent Review System

## Mission

Orchestrate parallel code review by specialized agents, each focusing on their domain expertise, then consolidate findings into a unified report.

---

## When to Use

- **Before merging PR**: "Review this PR before merge"
- **Security-critical code**: Auth, payments, data handling
- **Performance concerns**: "Check performance of this code"
- **Test coverage gaps**: "Review test coverage"
- **Documentation**: "Ensure code is well-documented"

### Examples
```bash
# Comprehensive PR review
/studio review --team --all

# Security only
/studio review --team --scope=security

# Performance + testing
/studio review --team --scope=performance,testing
```

---

## When NOT to Use

- ❌ **Single file simple changes** (use standard review)
- ❌ **Quick style fixes** (use linter/formatter)
- ❌ **Trivial changes** (comments, formatting)
- ❌ **Documentation-only changes** (use docs reviewer)
- ❌ **Configuration changes** (review manually)
- ❌ **Local development** (not ready for review)

## Review Agents

### 1. Security Reviewer Agent
**Model:** `claude-opus-4-6` (complex reasoning)

**Focus Areas:**
- OWASP Top 10 vulnerabilities
- Input validation and sanitization
- Authentication and authorization
- Sensitive data handling
- Dependency vulnerabilities
- API security

**Output Format:**
```markdown
## Security Review

### Critical Issues
- [Issue 1]

### Medium Issues
- [Issue 2]

### Recommendations
- [Recommendation 1]

### Security Score: X/10
```

### 2. Performance Reviewer Agent
**Model:** `claude-sonnet-4-5` (implementation focus)

**Focus Areas:**
- Database query optimization
- N+1 query problems
- Memory leaks
- Caching opportunities
- Async operation efficiency
- Bundle size impact

**Output Format:**
```markdown
## Performance Review

### Bottlenecks Found
- [Bottleneck 1]: Impact, Solution

### Optimization Opportunities
- [Opportunity 1]: Expected improvement

### Metrics (if applicable)
- Before: [metric]
- After: [projected metric]

### Performance Score: X/10
```

### 3. Testing Reviewer Agent
**Model:** `claude-sonnet-4-5`

**Focus Areas:**
- Test coverage (unit, integration, E2E)
- Edge cases handled
- Mock strategy
- Test quality and clarity
- Missing test scenarios

**Output Format:**
```markdown
## Testing Review

### Coverage Gaps
- [Gap 1]: Suggested test

### Test Quality Issues
- [Issue 1]: Fix needed

### Missing Edge Cases
- [Case 1]

### Test Score: X/10
```

### 4. Documentation Reviewer Agent
**Model:** `claude-haiku-4-5` (fast review)

**Focus Areas:**
- Function/class documentation
- Inline comments clarity
- README/USAGE docs
- Type definitions
- Examples provided

**Output Format:**
```markdown
## Documentation Review

### Missing Documentation
- [What needs docs]

### Documentation Quality
- [Issues found]

### Suggestions
- [Improvements]

### Documentation Score: X/10
```

## Orchestration Flow

```
┌──────────────────────────────────────────┐
│        Review Coordinator               │
│  (Opus 4.6 - smart orchestration)      │
└─────────────────┬────────────────────────┘
                  │
      ┌───────────┼───────────┬───────────┐
      ▼           ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Security │ │Performance│ │Testing │ │Docs    │
│Reviewer │ │Reviewer │ │Reviewer│ │Reviewer│
└─────────┘ └─────────┘ └─────────┘ └─────────┘
      │           │           │           │
      └───────────┼───────────┴───────────┘
                  ▼
        ┌─────────────────────┐
        │ Consolidated Report │
        └─────────────────────┘
```

## Usage

### Command Line
```bash
# Basic multi-review
/studio review --team --scope=security,performance,testing

# All reviewers
/studio review --team --all

# Specific reviewers only
/studio review --team --scope=security,testing

# With auto-fix
/studio review --team --fix

# Generate report only
/studio review --team --output=report.md
```

### In Studio Build
```bash
/studio build --team --review "Implement user authentication"
# Automatically runs multi-review after implementation
```

## Consolidated Report Format

```markdown
# Multi-Agent Review Report

**Generated:** 2026-02-19 14:30:00
**Reviewers:** Security, Performance, Testing, Documentation
**Files Reviewed:** 12 files, 847 lines

## Overall Score: 7.2/10

### Security Score: 6/10 ⚠️
[Security findings...]

### Performance Score: 8/10 ✅
[Performance findings...]

### Testing Score: 7/10 ⚠️
[Testing findings...]

### Documentation Score: 8/10 ✅
[Documentation findings...]

## Critical Issues (Must Fix)
1. **[SECURITY]** SQL injection vulnerability in user search
   - File: `src/api/users.ts:45`
   - Fix: Use parameterized query
   - Severity: HIGH

2. **[TESTING]** Missing edge case for empty arrays
   - File: `src/utils/array.ts:23`
   - Fix: Add test for empty input
   - Severity: MEDIUM

## Recommendations (Should Fix)
1. **[PERFORMANCE]** Add database index for email lookups
   - Impact: 60% faster queries
   - Effort: LOW

2. **[DOCS]** Document API authentication flow
   - Add example to README
   - Effort: LOW

## Summary
- Total Issues Found: 8
- Critical: 2
- Medium: 4
- Low: 2

**Recommendation:** Address critical issues before merging
```

## Configuration

Create `.claude/review-config.json`:

```json
{
  "multi_review": {
    "enabled": true,
    "reviewers": {
      "security": {
        "enabled": true,
        "model": "claude-opus-4-6",
        "severity_threshold": "medium",
        "rules": ["owasp-top-10", "auth", "data-sanitization"]
      },
      "performance": {
        "enabled": true,
        "model": "claude-sonnet-4-5",
        "metrics": ["query-time", "memory", "bundle-size"],
        "thresholds": {
          "query_time_ms": 100,
          "memory_mb": 512
        }
      },
      "testing": {
        "enabled": true,
        "model": "claude-sonnet-4-5",
        "coverage_target": 80,
        "require_edge_cases": true
      },
      "documentation": {
        "enabled": true,
        "model": "claude-haiku-4-5",
        "require_examples": true,
        "check_types": true
      }
    },
    "output": {
      "format": "markdown",
      "location": ".claude/reviews/",
      "include_suggestions": true,
      "auto_fix": false
    },
    "parallelism": {
      "max_concurrent": 4,
      "timeout_minutes": 10
    }
  }
}
```

## Integration with Git Hooks

Add to `.claude/hooks.json`:

```json
{
  "PreToolUse": [{
    "matcher": "tool == 'Bash' && tool_input.command matches 'git commit'",
    "hooks": [{
      "type": "command",
      "command": "claude /studio review --team --output=git-hook-review.md"
    }]
  }]
}
```

## Best Practices

### 1. Run Reviews Incrementally
Don't wait until PR is ready:
```bash
# After feature implementation
/studio review --team --scope=testing

# Before security review
/studio review --team --scope=security

# Final comprehensive review
/studio review --team --all
```

### 2. Fix Issues Iteratively
```bash
# First pass
/studio review --team --fix

# Re-review fixes
/studio review --team

# Continue until score > 8/10
```

### 3. Customize for Project
Adjust configuration based on project needs:
- **Security-focused**: Enable only security reviewer
- **High-performance**: All reviewers + performance profiler
- **Documentation-heavy**: Enable docs + testing reviewers

## Performance Impact

- **Time**: 2-5 minutes for typical PR (50-200 files)
- **Parallel execution**: 4x faster than sequential
- **Token usage**: ~50k tokens for full review (all 4 agents)
- **Cost**: ~$0.50-1.00 per review (Opus + Sonnet + Haiku)

## Success Metrics

Good multi-review setup:
- ✅ Critical issues caught before merge
- ✅ Consistent review quality
- ✅ Fast feedback (< 5 minutes)
- ✅ Actionable recommendations
- ✅ Team adopts suggestions

## Limitations

- ❌ False positives possible (especially security)
- ❌ Can't replace human judgment entirely
- ❌ May miss business logic errors
- ❌ Requires good test coverage for testing review

## Related Skills

- [Security Scanner](./security-scanner.md)
- [Performance Profiler](./performance-profiler.md)
- [TDD Guide](./tdd-guide.md)
- [Code Reviewer](./code-reviewer.md)

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Running on every commit | Wastes time/cost | Run only before PR merge |
| Reviewing trivial changes | No value added | Skip for formatting/comments |
| Ignoring review findings | Defeats purpose | Address critical issues |
| Running all reviewers unnecessarily | Slows workflow | Select relevant reviewers only |
| Not fixing P0/P1 issues | Security/performance risks | Always fix critical findings |
| Review without tests | Incomplete quality check | Ensure tests pass first |

---

*Version: 1.0.0 | Category: workflow | Last updated: 2026-02-19*
