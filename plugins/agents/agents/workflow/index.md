# Workflow Agents

Specialized workflow agents for Studio v2.0 integration with auto-activation support.

## Overview

These agents are automatically loaded by Studio v2.0 when specific flags are used, providing specialized workflows for performance, security, and TypeScript improvements.

## Available Agents

### 🚀 Performance Profiler Agent

**File:** `performance-profiler.agent.md`

**Auto-activated by:**
- Flag: `--profile`
- Keywords: "slow", "performance", "optimize", "bottleneck", "latency"

**Purpose:**
- Identify performance bottlenecks
- Measure before/after metrics
- Apply systematic optimization
- Target: ≥20% improvement

**Workflow:**
1. ANALYZE (15 min) - CPU/memory profiling, identify bottlenecks
2. OPTIMIZE (30-45 min) - Apply optimizations (quick wins → medium → complex)
3. MEASURE (15 min) - Verify improvement with before/after metrics
4. REGRESSION TEST (10 min) - Add performance tests

**Common Fixes:**
- N+1 queries → Eager loading (80-90% improvement)
- Slow functions → Memoization (50-70% improvement)
- Large bundle → Code splitting (30-50% improvement)
- Re-renders → React.memo (40-60% improvement)

### 🔒 Security Scanner Agent

**File:** `security-scanner.agent.md`

**Auto-activated by:**
- Flag: `--security`
- Keywords: "security", "OWASP", "vulnerability", "audit", "auth", "injection"

**Purpose:**
- OWASP Top 10 compliance scanning
- Vulnerability classification (P0/P1/P2/P3)
- Security fixes with tests
- Prevent regressions

**Workflow:**
1. SCAN (20 min) - OWASP Top 10 + dependency audit + config scan
2. CLASSIFY (10 min) - Prioritize by severity (P0: Critical, P1: High)
3. FIX (30-60 min) - Fix P0 first, then P1, add security tests
4. VERIFY (15 min) - Re-run scan, verify all P0/P1 fixed

**OWASP Top 10 Coverage:**
1. Broken Access Control
2. Cryptographic Failures
3. Injection (SQL, NoSQL, OS, LDAP)
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Auth Failures
8. Data Integrity Failures
9. Logging Failures
10. SSRF

### 🔤 TypeScript Improver Agent

**File:** `typescript-improver.agent.md`

**Auto-activated by:**
- Flag: `--types`
- Keywords: "types", "TypeScript", "strict", "any"
- File extensions: `.ts`, `.tsx`

**Purpose:**
- Eliminate all `any` from production code
- Improve type coverage to ≥95%
- Enable strict mode
- Add Zod validation at boundaries

**Workflow:**
1. ANALYZE (15 min) - Count `any`, measure coverage, classify severity
2. PRIORITIZE (5 min) - P0 (critical paths), P1 (casts), P2 (exports)
3. FIX (30-45 min) - Replace `any`, add Zod, enable strict mode
4. VERIFY (10 min) - `tsc --strict` passing, coverage ≥95%

**Type Improvements:**
- Replace `any` with proper types
- Add Zod schemas at boundaries (API, env vars, user input)
- Remove unsafe casts with type guards
- Enable strict mode in tsconfig.json
- Add utility types (Partial, Required, Pick, Omit)

### 📋 Planner Agent

**File:** `planner.agent.md`

**Purpose:**
- Implementation planning
- Architecture design
- File structure
- Risk assessment

### 👁️ Code Reviewer Agent

**File:** `code-reviewer.agent.md`

**Purpose:**
- Adversarial code review
- Quality assessment
- Best practices verification
- Improvement suggestions

### 🛡️ Security Reviewer Agent

**File:** `security-reviewer.agent.md`

**Purpose:**
- Security-focused code review
- Vulnerability identification
- Security best practices
- OWASP compliance

### 🧪 TDD Guide Agent

**File:** `tdd-guide.agent.md`

**Auto-activated by:**
- Flag: `--test`
- Keywords: "test", "TDD", "coverage", "spec"

**Purpose:**
- Test-driven development workflow
- RED-GREEN-REFACTOR cycle
- Test coverage strategies
- Best practices

## Auto-Activation System

### How It Works

```bash
# Example 1: Explicit flag
/studio build --profile "optimize slow code"
# → Auto-loads: workflow/performance-profiler.agent.md

# Example 2: Keyword detection
/studio build "optimize slow database queries"
# → Detects: "optimize", "slow"
# → Auto-activates: --profile mode
# → Loads: workflow/performance-profiler.agent.md

# Example 3: Multiple agents
/studio refactor --profile --security --scope=all
# → Loads: performance-profiler.agent.md + security-scanner.agent.md
# → Creates Agent Team (parallel execution)
```

### Disabling Auto-Activation

```bash
# Disable specific agent
/studio build --profile "task" --no-profile-agent

# Disable all agents
/studio build --scale "task" --no-agents
```

## Integration with Studio

### Build Command

```bash
# Auto-activation with flags
/studio build --profile --security --types "critical feature"

# Agents loaded:
✅ workflow/performance-profiler.agent.md
✅ workflow/security-scanner.agent.md
✅ workflow/typescript-improver.agent.md

# Result:
- Performance optimized (≥20% improvement)
- OWASP compliant (all P0/P1 fixed)
- Type safe (zero `any`, ≥95% coverage)
```

### Refactor Command

```bash
# Auto-activation with team mode
/studio refactor --profile --security --team --scope=all

# Agent Team created:
🤖 Agent 1: Performance Specialist
🤖 Agent 2: Security Specialist
🤖 Agent 3: Coordinator

# Parallel analysis → Merged findings → Prioritized fixes → Verification
```

## Creating New Workflow Agents

### Template

```markdown
---
name: [agent-name]
description: [Brief description]
domain: workflow
version: 1.0.0
---

# [Agent Name] Agent

## Mission
[What this agent specializes in]

## Stack
[Technologies and tools]

## Patterns
[Code patterns and examples]

## Workflow
[Step-by-step process]

## Integration
[How it works with Studio]

## Success Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Auto-Activation

**Triggered by:**
- Flag: `--[flag-name]`
- Keywords: "keyword1", "keyword2"
- File patterns: `**/*.ts`

**Disabled with:** `--no-[flag-name]-agent`
```

### Registration

After creating a new agent:

1. Add to this index.md
2. Update `../README.md` with new agent
3. Add to Studio build/refactor skills if auto-activation needed
4. Test with: `/studio build --[flag] "test task"`

## Dependencies

- **Studio Plugin v2.0+** - For auto-activation system
- **Core Plugin** - For validation and utilities

## Version History

- **v1.1.0** (2026-02-19) - Added performance-profiler, security-scanner, typescript-improver
- **v1.0.0** (2026-02-10) - Initial workflow agents (planner, code-reviewer, security-reviewer, tdd-guide)

---

**Maintained by:** SMITE Core Team
**License:** MIT
