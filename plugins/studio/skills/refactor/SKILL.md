---
name: refactor
description: MANDATORY gate before ANY refactoring task in smite project. Invoke FIRST when cleaning up code, improving structure, or optimizing - provides systematic validation with 6 modes (--quick, --full, --analyze, --review, --resolve, --verify) plus 3 specialized modes (--profile for performance, --security for vulnerabilities, --types for TypeScript) with auto-team activation for complex refactors. Specific phrases: 'refactor this', 'clean up code', 'improve this function', 'optimize this', 'restructure this module'. (user)
version: 2.0.0
---

# Refactor Skill - Unified Agent v2.0

## 🔴 TOOL GATEKEEPER - NON-NEGOTIABLE

═════════════════════════════════════════════════════
🚫 PROHIBITED WITHOUT EXCEPTION:
   grep | egrep | find | ack | ag | ls | dir | glob

✅ MANDATORY REPLACEMENT:
   grepai search "pattern" | /toolkit search "query"

🎯 DECISION TREE:
   Need to search? → grepai or /toolkit search
   Need to read?    → Read tool (NOT cat/head)
═════════════════════════════════════════════════════

---

## Mission

Provide unified, systematic code refactoring through comprehensive validation, ensuring safe improvements while preserving functionality.

**Version 2.0 adds:** Performance profiling, security scanning, and TypeScript improvement modes.

---

## When to Use

- **Cleaning up code**: "Clean up this function"
- **Improving structure**: "Refactor this module"
- **Optimizing performance**: "Optimize slow code"
- **Fixing security issues**: "Fix security vulnerabilities"
- **Improving types**: "Fix TypeScript errors"
- **Removing duplication**: "Remove duplicate code"

### Examples
```bash
# Quick cleanup
/studio refactor --quick

# Full refactor with analysis
/studio refactor --full --scope=recent

# Performance optimization
/studio refactor --profile --scope=all

# Security audit
/studio refactor --security --scope=directory:src/auth

# Type safety improvement
/studio refactor --types --scope=recent
```

---

## When NOT to Use

- ❌ **New feature implementation** (use `/studio build` instead)
- ❌ **Simple fixes** (use inline editing)
- ❌ **Renaming only** (use Edit tool)
- ❌ **Documentation updates** (use Edit tool directly)
- ❌ **Configuration changes** (use Edit tool)
- ❌ **Test writing** (use `/studio build --test`)

---

## 📋 Plan Mode First (OBLIGATOIRE)

**TOUJOURS** créer un plan avant toute refactorisation significative.

### Quand Plan Mode est requis

- Modifier plus de 2 fichiers
- Restructurer un module
- Lancer des subagents (classifier, validator, resolver)
- Mode analyze/full/resolve

### Template de Plan

```markdown
## Plan: Refactor [Module/Fichier]

### Objectifs
- [ ] [Objectif principal: réduire complexité, éliminer duplication, etc.]

### Fichiers
À analyser: `path/to/file`
À modifier: `path/to/file` - [raison]

### Approche
1. Analyser l'état actuel
2. Identifier les améliorations
3. Appliquer les changements incrémentalement
4. Valider après chaque changement

### Risques
- [Regression] → Tests après chaque changement
- [Casser l'API] → Vérifier les appels

### Validation
- [ ] Tous les tests passent
- [ ] Aucune régression
- [ ] Complexité réduite

**Confirmer pour procéder ?**
```

---

## ⚡ Auto-Team (DEFAULT)

**Les équipes d'agents s'activent AUTOMATIQUEMENT** pour les refactors complexes.

### Critères d'Auto-Activation

| Critère | Seuil | Team Size |
|---------|-------|-----------|
| Fichiers à analyser | ≥ 5 | 2 agents |
| Modes | analyze/full/profile/security/types | 2-3 agents |
| Complexité détectée | haute | 2-3 agents |

### Désactiver

```bash
/studio refactor --full --no-team
/studio refactor --analyze --no-team
```

---

## 🎯 Core Principles

- **Safety First** - Validate all changes before implementation
- **Incremental** - Small, verifiable steps
- **Evidence-Based** - Use metrics to guide decisions
- **Test Continuously** - Run tests after each change
- **Document Thoroughly** - Explain what and why

---

## 🤖 Subagent Auto-Activation System

**Studio Refactor v2.0 automatically loads specialized agents and creates teams based on modes and scope.**

### Auto-Activation Rules for Specialized Modes

| Mode Detected | Subagent Auto-Loaded | Trigger Keywords | Disabled With |
|---------------|---------------------|------------------|---------------|
| `--profile` | `workflow/performance-profiler` | "slow", "performance", "optimize", "bottleneck" | `--no-profile-agent` |
| `--security` | `workflow/security-scanner` | "security", "OWASP", "vulnerability", "audit" | `--no-security-agent` |
| `--types` | `workflow/typescript-improver` | "types", "TypeScript", "strict", "any" | `--no-types-agent` |
| `--team` | **Creates Agent Team** | Multiple modes, large scope | `--no-team` |

### Auto-Activation Rules for Agent Teams

| Condition | Team Size | Team Composition | Disabled With |
|-----------|-----------|------------------|---------------|
| ≥5 files to analyze | 2 agents | Analyzer + Resolver | `--no-team` |
| High complexity detected | 2-3 agents | Analyzer + Reviewer (+ Resolver) | `--no-team` |
| `--profile --security` (combined) | 2 agents | PerformanceProfiler + SecurityScanner | `--no-team` |
| `--profile --security --types` (all) | 3 agents | Perf + Security + Types | `--no-team` |

### Activation Messages

**Specialized Agent:**
```
[INFO] Mode --profile detected
[INFO] → Auto-loading: workflow/performance-profiler.agent.md
[INFO] → Focus: CPU profiling, Memory profiling, Benchmarking
[INFO] → To disable: --no-profile-agent
```

**Agent Team:**
```
[INFO] Complex refactor detected (7 files, high complexity)
[INFO] → Auto-activating: --team mode
[INFO] → Spawning 2 agents:
[INFO]    1. Analyzer (code smells, complexity)
[INFO]    2. Resolver (apply refactoring patterns)
[INFO] → To disable: --no-team
```

### Example: Multi-Agent Refactor

```bash
# User command
/studio refactor --profile --security --scope=all

# System analysis:
├─ Mode: --profile → Loads: workflow/performance-profiler.agent.md
├─ Mode: --security → Loads: workflow/security-scanner.agent.md
├─ Scope: --scope=all (large) → Activates: --team
└─ Complexity: high → Team size: 3 agents

# Agent Team spawned:
🤖 Agent 1: Performance Specialist
   - CPU profiling
   - Memory profiling
   - Bottleneck identification

🤖 Agent 2: Security Specialist
   - OWASP Top 10 scan
   - Vulnerability classification (P0/P1)
   - Security fixes

🤖 Agent 3: Coordinator
   - Merges analysis reports
   - Prioritizes fixes
   - Verifies no conflicts

# Execution:
1. Parallel analysis (all 3 agents work simultaneously)
2. Merge findings
3. Prioritize by severity (P0 security, P0 performance, P1 security, etc.)
4. Apply fixes in priority order
5. Verify improvements
6. Consolidated report

# Result:
- Performance improved ≥20%
- All P0/P1 security vulnerabilities fixed
- No regressions
- Before/after metrics documented
```

### Disabling Auto-Activation

**Disable specialized agent:**
```bash
/studio refactor --profile --scope=recent --no-profile-agent
# → Won't load workflow/performance-profiler.agent.md
# → Uses built-in performance patterns only
```

**Disable team mode:**
```bash
/studio refactor --full --scope=all --no-team
# → Sequential execution (not parallel)
# → Single agent does all work
```

**Disable all auto-activation:**
```bash
/studio refactor --full --no-agents --no-team
# → No specialized agents
# → No agent teams
# → Core refactor skill only
```

### Agent Loading Priority

```
1. Explicit mode (--profile, --security, --types)
   ↓
2. Explicit team flag (--team)
   ↓
3. Auto-activation by scope/complexity
   - ≥5 files → team size 2
   - High complexity → team size 2-3
   - Multiple modes → parallel execution
   ↓
4. Default behavior (single agent)
```

### Example: Full Auto-Activation Flow

```bash
# User command
/studio refactor "fix slow code with security issues and type errors"

# System analysis:
├─ Keywords: "slow" → Activates: --profile
├─ Keywords: "security" → Activates: --security
├─ Keywords: "type errors" → Activates: --types
├─ Scope: implicit (recent changes)
└─ Complexity: auto-detected

# Agents loaded:
✅ workflow/performance-profiler.agent.md
✅ workflow/security-scanner.agent.md
✅ workflow/typescript-improver.agent.md

# Team creation (high complexity):
🤖 Agent Team: 3 agents
   1. Performance Specialist (CPU/memory profiling)
   2. Security Specialist (OWASP scan, P0/P1 fixes)
   3. TypeScript Specialist (remove `any`, improve coverage)

# Execution:
1. ANALYZE (parallel, all 3 agents)
   - Performance: Identify bottlenecks
   - Security: Scan vulnerabilities
   - Types: Count `any`, measure coverage

2. CLASSIFY (merge findings)
   - P0: Critical security + Critical performance
   - P1: High security + High performance
   - P2: Type safety improvements

3. FIX (sequential by priority)
   - Fix P0 security (SQL injection, auth bypass)
   - Fix P0 performance (N+1 queries)
   - Fix P1 security (XSS, data exposure)
   - Fix P1 performance (slow functions)
   - Fix P2 types (remove `any`, add Zod)

4. VERIFY
   - All P0/P1 fixed
   - Performance improved ≥20%
   - Type coverage ≥95%
   - No regressions

# Result:
- Comprehensive security audit report
- Performance comparison (before/after)
- Type health report (95%+ coverage)
- All vulnerabilities fixed
- All improvements documented
```

---

## 📋 Mode Selection

### --quick (Quick Mode)

**Purpose:** Auto-fix low-risk items

**Criteria:**
- Risk score < 30
- Complexity < 8
- Test coverage > 80%

**Workflow:**
1. Identify low-risk items
2. Apply refactoring patterns
3. Test after each change
4. Commit safe changes

**Output:** Applied changes (no analyze/review)

### --full (Full Mode - Default)

**Purpose:** Complete refactoring workflow

**Workflow:**
1. ANALYZE - Detect issues
2. REVIEW - Classify and prioritize
3. RESOLVE - Apply changes
4. VERIFY - Validate results

**Output:** Complete documentation

### --analyze (Analysis Only)

**Purpose:** Detect and catalog issues

**Steps:**
1. Complexity analysis (cyclomatic, cognitive, nesting)
2. Duplication detection
3. Code smell identification
4. Maintainability assessment
5. Technical debt scoring

**Output:** `.claude/.smite/studio refactor-analysis.md`

### --review (Review and Prioritize)

**Purpose:** Create action plan

**Steps:**
1. Classify by severity (P1-P4)
2. Assess business impact
3. Estimate effort and risk
4. Identify quick wins
5. Create timeline

**Output:** `.claude/.smite/studio refactor-review.md`

### --resolve (Resolve Specific Items)

**Purpose:** Apply validated refactoring

**Steps:**
1. Load item from review
2. Apply proven patterns
3. Make incremental changes
4. Test continuously
5. Document changes
6. Commit logically

**Output:** `.claude/.smite/studio refactor-resolution-[ID].md`

### --verify (Verify Results)

**Purpose:** Comprehensive verification

**Steps:**
1. All tests passing
2. No type errors
3. Metrics improved
4. No regressions
5. Deployment ready

**Output:** `.claude/.smite/studio refactor-verification.md`

---

## 🚀 NEW: Specialized Modes v2.0

### --profile (Performance Profiling Mode)

**Purpose:** Identify and fix performance bottlenecks

**When to Use:**
- Functions are slow
- Memory usage is high
- Need optimization metrics

**Workflow:**
```
ANALYZE (performance, 15 min)
  - Identify slow functions
  - Measure execution time
  - Check memory usage
  - Find N+1 queries
  - Profile hot paths
  - Output: profile.md with metrics

OPTIMIZE (systematic, 30-45 min)
  1. Quick wins:
     - Cache repeated computations
     - Remove unnecessary loops
     - Optimize database queries
     - Add pagination

  2. Medium effort:
     - Lazy loading
     - Code splitting
     - Memoization
     - Debouncing/throttling

  3. Complex (if needed):
     - Algorithm optimization
     - Data structure changes
     - Parallel processing

MEASURE (before/after)
  - Benchmark before
  - Apply changes
  - Benchmark after
  - Verify improvement
  - Output: comparison.md
```

**Example:**
```bash
# Profile recent changes
/studio refactor --profile --scope=recent

# Profile specific file
/studio refactor --profile --scope=file:src/services/user.ts

# Full codebase profiling
/studio refactor --profile --scope=all
```

**Metrics Collected:**
- Execution time (ms)
- Memory usage (MB)
- Database query count
- Network requests
- Bundle size (if applicable)

**Success Criteria:**
- Measurable performance improvement (≥ 20%)
- No functionality broken
- Tests passing
- Before/after metrics documented

---

### --security (Security Scanning Mode)

**Purpose:** Detect and fix security vulnerabilities

**When to Use:**
- Security audit required
- OWASP compliance
- Production deployment prep
- Handling sensitive data

**Workflow:**
```
SCAN (security analysis, 20 min)
  - OWASP Top 10 vulnerabilities
  - Injection attacks (SQL, NoSQL, OS, LDAP)
  - XSS vulnerabilities
  - CSRF protection
  - Authentication/Authorization issues
  - Sensitive data exposure
  - Cryptographic issues
  - Dependency vulnerabilities
  - Output: security-scan.md

CLASSIFY (severity, 10 min)
  P0 - Critical (immediate fix required)
    - Remote code execution
    - SQL injection
    - Authentication bypass

  P1 - High (fix ASAP)
    - XSS attacks
    - Sensitive data exposure
    - Broken authentication

  P2 - Medium (fix soon)
    - CSRF missing
    - Weak cryptography
    - Dependency vulnerabilities

  P3 - Low (fix when possible)
    - Information disclosure
    - Missing headers

FIX (prioritized, 30-60 min)
  1. Fix P0 critical vulnerabilities
  2. Fix P1 high vulnerabilities
  3. Add security tests
  4. Document security measures
  - Output: security-fix.md

VERIFY (validate)
  - Re-run security scan
  - Verify all P0/P1 fixed
  - Add regression tests
  - Security tests passing
  - Output: security-verification.md
```

**Example:**
```bash
# Security scan on recent changes
/studio refactor --security --scope=recent

# Full security audit
/studio refactor --security --scope=all

# Security scan specific directory
/studio refactor --security --scope=directory:src/auth
```

**OWASP Top 10 Checked:**
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server-Side Request Forgery (SSRF)

**Success Criteria:**
- All P0/P1 vulnerabilities fixed
- Security tests added
- No new vulnerabilities introduced
- Documentation updated

---

### --types (TypeScript Improvement Mode)

**Purpose:** Improve type safety and eliminate `any`

**When to Use:**
- TypeScript code with poor types
- `any` types scattered
- Missing type definitions
- Type errors

**Workflow:**
```
ANALYZE (type health, 15 min)
  - Count `any` usage
  - Find type assertions (`as`)
  - Missing type annotations
  - Implicit any types
  - Type coverage %
  - Output: type-analysis.md

PRIORITIZE (by severity, 5 min)
  P0 - Explicit `any` in critical paths
  P1 - Type assertions without validation
  P2 - Missing type annotations
  P3 - Implicit any in safe contexts

FIX (systematic, 30-45 min)
  1. Replace `any` with proper types:
     - Create interfaces/types
     - Use generics
     - Add Zod validation at boundaries
     - Use utility types (Partial, Required, etc.)

  2. Remove unsafe casts:
     - Add type guards
     - Use Zod schemas
     - Add validation functions

  3. Improve type coverage:
     - Add return types
     - Type all parameters
     - Remove `@ts-ignore`
     - Fix `@ts-expect-error`

VERIFY (typescript strict, 10 min)
  - Run `tsc --noAny --strict`
  - All type errors resolved
  - Type coverage ≥ 95%
  - Zero `any` in production code
  - Output: type-verification.md
```

**Example:**
```bash
# Type improvement on recent changes
/studio refactor --types --scope=recent

# Type safety for entire project
/studio refactor --types --scope=all

# Fix types in specific module
/studio refactor --types --scope=directory:src/features/auth
```

**Type Improvements:**
- Replace `any` with proper types
- Add Zod validation at boundaries
- Create utility types
- Remove type assertions
- Add type guards
- Enable strict mode

**Success Criteria:**
- Zero `any` in production code
- Type coverage ≥ 95%
- `tsc --strict` passing
- No type assertions without validation
- Zod schemas at boundaries

---

## Scope Options

### --scope=recent (Default)

Analyze and refactor recent changes only.

### --scope=file:PATH

Refactor specific file.

```bash
/studio refactor --full --scope=file:src/auth/jwt.ts
```

### --scope=directory:PATH

Refactor entire directory.

```bash
/studio refactor --full --scope=directory:src/features/auth
```

### --scope=all

Refactor entire codebase.

```bash
/studio refactor --full --scope=all
```

### --scope=bug (Bug Fixing Mode)

Debug and fix specific bugs.

```bash
/studio refactor --scope=bug "TypeError: product.price is not a function"

# With adversarial review
/studio refactor --scope=bug --examine "Critical production bug"
```

---

### --team (Agent Teams Mode)

**Purpose:** Orchestrate multiple Claude Code agents in parallel for comprehensive refactoring

**When to Use:**
- Large refactors requiring multiple perspectives
- Cross-domain improvements (e.g., performance + security + types)
- Complex codebases with many files

**⚡ AUTO-ACTIVÉ** pour modes analyze/full/profile/security/types (≥5 fichiers ou complexité haute)

**How it works:**
```
1. Create Claude Code Agent Team
2. Spawn specialized teammates for different aspects
3. Each teammate has own context and tasks
4. Coordinate via shared task list
5. Aggregate results and synthesize final plan
```

**Team Strategies by Mode:**

| Mode | Team Composition | Responsibilities |
|------|-----------------|-------------------|
| `--full --team` | Analyzer + Reviewer + Resolver | Parallel analysis, review, resolution |
| `--analyze --team` | CodeSmellExpert + ComplexityExpert + SecurityExpert | Multi-angle analysis |
| `--profile --team` | CPUProfiler + MemoryProfiler + NetworkProfiler | Comprehensive profiling |
| `--security --team` | OWASPSpecialist + DependencyAuditor + ConfigReviewer | Full security audit |
| `--types --team` | AnyRemover + AssertionExpert + CoverageSpecialist | Complete type safety |
| `--team --profile --security` | PerformanceSpecialist + SecuritySpecialist | Combined optimization |

**Examples:**
```bash
# Full refactoring with agent team
/studio refactor --full --team

# Deep security analysis with specialist team
/studio refactor --security --team

# Comprehensive improvement (all aspects)
/studio refactor --team --profile --security --types

# Type safety with specialist team
/studio refactor --types --team
```

**Requirements:**
- Claude Code v2.1.32+
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

**Best for:** Large refactors, multi-domain improvements, comprehensive analysis

---

## Common Patterns

### Extract Method

Reduce complexity by extracting methods.

**Before:**
```typescript
function processUserData(user: User) {
  if (!user) return null;
  const cleaned = user.name.trim().toLowerCase();
  const email = user.email.trim().toLowerCase();
  const normalized = email.replace(/@.*/, "");
  return { name: cleaned, email, normalized };
}
```

**After:**
```typescript
function processUserData(user: User) {
  if (!user) return null;
  return {
    name: cleanName(user.name),
    email: cleanEmail(user.email),
    normalized: normalizeEmail(user.email)
  };
}

function cleanName(name: string): string {
  return name.trim().toLowerCase();
}

function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeEmail(email: string): string {
  return email.replace(/@.*/, "");
}
```

### Introduce Parameter Object

Simplify signatures by grouping parameters.

**Before:**
```typescript
function createUser(
  name: string,
  email: string,
  password: string,
  age: number,
  address: string,
  phone: string
) { ... }
```

**After:**
```typescript
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  age: number;
  address: string;
  phone: string;
}

function createUser(params: CreateUserParams) { ... }
```

### Replace Magic Numbers

Improve clarity.

**Before:**
```typescript
if (user.level > 5) {
  user.discount = 0.15;
}
```

**After:**
```typescript
const MIN_LEVEL_FOR_DISCOUNT = 5;
const DEFAULT_DISCOUNT = 0.15;

if (user.level > MIN_LEVEL_FOR_DISCOUNT) {
  user.discount = DEFAULT_DISCOUNT;
}
```

---

## Subagent Collaboration

### Classifier Subagent

**Purpose:** Issue classification and prioritization

**Launched by:** Review step (`--review`)

**Capabilities:**
- Issue classification (P1-P4)
- Business impact assessment
- Effort estimation
- Risk evaluation
- Action plan creation

**Output:** Prioritized review report

### Validator Subagent

**Purpose:** Safety and validation

**Launched by:** Review step (`--review`)

**Capabilities:**
- Functionality preservation verification
- Test coverage analysis
- Impact analysis
- Risk assessment
- Approval decision

**Output:** Validation report (APPROVED/CONDITIONAL/REJECTED)

### Resolver Subagent

**Purpose:** Refactoring implementation

**Launched by:** Resolve step (`--resolve`)

**Capabilities:**
- Apply refactoring patterns
- Incremental changes
- Continuous testing
- Documentation
- Safe commits

**Output:** Resolved code with documentation

---

## Integration

- **Works with:** toolkit (semantic search, bug detection, dependency graph)
- **Used by:** ralph (refactor workflow), builder (after implementation)
- **Compatible with:** all SMITE agents

---

## Error Handling

- **Tests failing:** Fix or revert changes
- **Validation rejected:** Address blocking issues
- **Type errors:** Resolve before proceeding
- **Regressions detected:** Rollback and investigate

---

## Success Criteria

### Universal Criteria
- ✅ All tests passing
- ✅ No type errors
- ✅ Complexity reduced
- ✅ Coverage increased
- ✅ No regressions
- ✅ Documentation complete

### Mode-Specific Criteria

| Mode | Additional Criteria |
|------|---------------------|
| `--profile` | Performance improved ≥ 20%, measured |
| `--security` | All P0/P1 vulnerabilities fixed |
| `--types` | Zero `any`, coverage ≥ 95%, tsc strict |
| `--clean` | Net code reduction, zero duplication |

---

## Best Practices

1. **Always analyze first** - Understand issues before acting
2. **Validate changes** - Never skip validation step
3. **Start with quick wins** - Build momentum
4. **Test continuously** - After each small change
5. **Commit logically** - Small, reviewable commits
6. **Document thoroughly** - Explain reasoning
7. **Use specialized modes** - `--profile`, `--security`, `--types`
8. **Leverage agent teams** - Use `--team` for complex refactors

---

## Configuration

Default config in `.claude/.smite/studio refactor.json`:

```json
{
  "defaults": {
    "scope": "recent",
    "riskThreshold": 30,
    "complexityThreshold": 8,
    "coverageTarget": 80,
    "autoCommit": true
  },
  "exclude": [
    "node_modules/**",
    "dist/**",
    ".claude/**"
  ],
  "patterns": {
    "enabled": [
      "extract-method",
      "extract-class",
      "introduce-param-object",
      "replace-magic-numbers",
      "decompose-conditional"
    ]
  },
  "security": {
    "owaspTop10": true,
    "dependencyCheck": true,
    "p0Threshold": "critical",
    "p1Threshold": "high"
  },
  "types": {
    "strictMode": true,
    "allowAny": false,
    "coverageTarget": 95
  },
  "performance": {
    "improvementTarget": 20,
    "measureBefore": true,
    "measureAfter": true
  }
}
```

---

## Examples

```bash
# Quick refactor
/studio refactor --quick

# Full workflow with performance profiling
/studio refactor --full --profile

# Security audit
/studio refactor --security --scope=all

# Type safety improvement
/studio refactor --types --scope=directory:src/features

# Comprehensive refactor (all modes with team)
/studio refactor --full --security --types --profile --team

# Bug-specific refactor
/studio refactor --scope=bug "TypeError in auth"

# Team-based performance + security
/studio refactor --profile --security --team
```

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Refactoring without tests | High risk of breaking functionality | Always ensure tests pass first |
| Large refactors in one commit | Hard to review/revert | Break into small, reviewable commits |
| Ignoring complexity scores | Missing the real issues | Focus on high-complexity areas first |
| Skipping ANALYZE phase | Refactoring wrong things | Always analyze before making changes |
| Not measuring results | No objective improvement | Measure before/after metrics |
| Refactoring working code unnecessarily | Waste of time/risk | Only refactor when needed |
| Using --quick for complex changes | Misses important issues | Use --full for complex refactors |
| Fixing style during logic refactor | Mixed concerns, hard to review | Separate style from logic refactors |

---

## Integration with Other Skills

**Requires:**
- **semantic-search** - For finding code to refactor
- **test-runner** - For validation after changes

**Complements:**
- **build** - Use after implementation for cleanup
- **multi-review** - Use for comprehensive review after refactor
- **pattern-capture** - Use after successful refactor to save patterns

**Used by:**
- All smite workflows for code improvement

---

*Refactor Skill v2.0.0 - Enhanced with performance, security, and TypeScript modes*
