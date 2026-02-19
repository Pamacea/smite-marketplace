---
name: build
description: Unified implementation agent with 12-flag system + auto-detection + memory integration
version: 3.0.0
---

# Implement Skill - Unified Agent v3.0

## 🔴 TOOL GATEKEEPER - NON-NEGOTIABLE

═══════════════════════════════════════════════════
🚫 PROHIBITED WITHOUT EXCEPTION:
   grep | egrep | find | ack | ag | ls | dir | glob

✅ MANDATORY REPLACEMENT:
   grepai search "pattern" | /toolkit search "query"

🎯 DECISION TREE:
   Need to search code? → grepai search or /toolkit search (NOT grep/ls/find)
   Need to implement? → /studio build [flags] "task"
═══════════════════════════════════════════════════

---

## Mission

Provide **ONE unified implementation entry point** with:
- **12 composable flags** for maximum flexibility
- **Auto-detection** for zero-configuration usage
- **Memory integration** for continuous improvement
- **Progress tracking** for transparent workflow
- **Quality metrics** for objective validation
- **Legacy compatibility** for smooth migration

---

## 🎯 Flag System v3.0

### Core Flags (v2.0)

| Flag | Aliases | Effect | Use When |
|------|---------|--------|----------|
| `--speed` | `--fast`, `--quick` | Optimized for velocity | Quick fixes, small features |
| `--scale` | `--thorough`, `--epct` | Comprehensive workflow | Complex features, multiple files |
| `--quality` | `--validate`, `--predator` | Quality gates enabled | Critical code, production-ready |
| `--team` | `--swarm`, `--ralph` | Parallel agent teams | Large projects, multi-domain |

### 🆕 New Flags (v3.0)

| Flag | Effect | Use When |
|------|--------|----------|
| `--clean` | Delete-first philosophy | Refactoring, removing duplication |
| `--test` | TDD mode (RED-GREEN-REFACTOR) | Test-critical features |
| `--debug` | Bug fixing workflow | Fixing existing bugs |
| `--docs` | Auto-documentation | API docs, guides |
| `--git` | Git-aware mode | Working with version control |
| `--branch` | Context-aware behavior | Branch-specific workflows |
| `--profile` | Performance profiling | Performance optimization |
| `--types` | TypeScript improvements | Type safety improvements |

---

## 🤖 Subagent Auto-Activation System

**Studio v3.0 automatically loads specialized agents based on flags and task analysis.**

### Auto-Activation Rules

| Flag Detected | Subagent Auto-Loaded | Trigger Keywords | Disabled With |
|---------------|---------------------|------------------|---------------|
| `--profile` | `workflow/performance-profiler` | "slow", "performance", "optimize", "bottleneck", "latency" | `--no-profile-agent` |
| `--security` | `workflow/security-scanner` | "security", "OWASP", "vulnerability", "audit", "auth", "injection" | `--no-security-agent` |
| `--types` | `workflow/typescript-improver` | "types", "TypeScript", "strict", "any" | `--no-types-agent` |
| `--test` | `testing/tdd-guide` (existing) | "test", "TDD", "coverage", "spec" | `--no-test-agent` |
| `--team` | **Creates Agent Team** | "large", "multi-domain", "parallel" | `--no-team` |

### Activation Messages

When a subagent is auto-activated, you'll see clear feedback:

```
[INFO] Flag --profile detected
[INFO] → Auto-loading: workflow/performance-profiler.agent.md
[INFO] → Capabilities: CPU profiling, Memory profiling, Benchmarking
[INFO] → To disable: --no-profile-agent
```

### Keyword-Based Auto-Detection

**Example 1: Performance profiling triggered without explicit flag**
```bash
/studio build "optimize slow database queries"

# Auto-detects:
# - Keywords: "optimize", "slow"
# → Activates: --profile mode
# → Loads: workflow/performance-profiler.agent.md
```

**Example 2: Security scanning triggered by context**
```bash
/studio build "add authentication to API"

# Auto-detects:
# - Keywords: "authentication"
# → Activates: --security mode
# → Loads: workflow/security-scanner.agent.md
```

**Example 3: TypeScript improvements triggered**
```bash
/studio build "fix type errors in user service"

# Auto-detects:
# - Keywords: "type errors", TypeScript files
# → Activates: --types mode
# → Loads: workflow/typescript-improver.agent.md
```

### Hybrid: Explicit Flag + Auto-Loading

```bash
# Explicit flag (clear intent)
/studio build --profile "optimize user list"

# Process:
# 1. User explicitly sets --profile
# 2. System loads: workflow/performance-profiler.agent.md
# 3. Applies performance patterns
# 4. Reports before/after metrics

# Same as implicit (auto-detected)
/studio build "optimize slow user list"

# Process:
# 1. System detects keywords: "optimize", "slow"
# 2. Auto-activates: --profile mode
# 3. Loads: workflow/performance-profiler.agent.md
# 4. Same result with less typing!
```

### Disabling Auto-Activation

**Disable specific agent:**
```bash
/studio build --profile "optimize code" --no-profile-agent
# → Won't load workflow/performance-profiler.agent.md
# → Uses built-in performance patterns only
```

**Disable all agents:**
```bash
/studio build --scale "build feature" --no-agents
# → No specialized agents loaded
# → Uses core build skill only
```

### Agent Loading Priority

```
1. Explicit flag (--profile, --security, --types)
   ↓
2. Explicit agent (--agent=workflow/performance-profiler)
   ↓
3. Auto-detection (keywords in task)
   ↓
4. Tech-specific agent (--tech=nextjs, --tech=rust)
   ↓
5. Default behavior
```

### Example: Full Auto-Activation Flow

```bash
# User command
/studio build "optimize slow authentication with proper types"

# System analysis:
├─ Keywords: "optimize", "slow" → Activates --profile
├─ Keywords: "authentication" → Activates --security
├─ Keywords: "types" → Activates --types
├─ File detection: .ts files → Activates --types
└─ Tech detection: --tech (if specified)

# Agents loaded:
✅ workflow/performance-profiler.agent.md
✅ workflow/security-scanner.agent.md
✅ workflow/typescript-improver.agent.md

# Execution order:
1. Performance profiling (identify bottlenecks)
2. Security scanning (OWASP compliance)
3. TypeScript improvements (type safety)
4. Implementation with all patterns applied

# Result:
- Optimized performance (≥20% improvement)
- OWASP Top 10 compliant
- Zero `any`, type coverage ≥95%
- Proper commit message (if --git)
- Memory saved to claude-mem
```

---

## 🚀 NEW: Flag Details

### --clean (Delete-First Mode)

**Purpose:** Implement "Delete First" philosophy - remove before adding

**Philosophy:**
- Best code is no code
- Delete duplication before creating new
- Simplify over abstracting

**Workflow:**
```
EXPLORE (delete-focused, 10 min)
  - Search for existing implementations
  - Count occurrences of similar code
  - Identify what can be removed
  - Find components to compose

PLAN (minimal)
  - List deletions planned
  - List additions after deletions
  - Verify nothing breaks

CODE (delete-first, 20-30 min)
  1. DELETE first:
     - Remove duplicated code
     - Delete unused components
     - Simplify abstractions
  2. THEN add:
     - Implement new feature
     - Compose existing components
     - Use variant props

TEST (verify)
  - Verify nothing broke
  - Test new implementation
  - Measure code reduction
```

**Example:**
```bash
# Refactor with delete-first
/studio build --clean --scale "refactor user service"

# Quick duplicate removal
/studio build --clean --speed "remove duplicate buttons"

# Validated refactor
/studio build --clean --quality "simplify auth flow"
```

**Success Criteria:**
- Net code reduction (removed > added)
- Zero duplication
- Tests passing
- No regressions

---

### --test (TDD Mode)

**Purpose:** Force Test-Driven Development (RED-GREEN-REFACTOR)

**Philosophy:**
- Tests first, implementation second
- Specifications drive design
- Failing tests guide implementation

**Workflow:**
```
PLAN (test specs)
  - Define test scenarios
  - Specify acceptance criteria
  - Set coverage targets

CODE - RED (5-10 min)
  - Write failing tests first
  - Describe behavior, not implementation
  - Test edge cases
  - Output: test suite (all failing)

CODE - GREEN (15-30 min)
  - Implement minimum to pass tests
  - No extra code
  - Make tests pass one by one
  - Output: tests passing

CODE - REFACTOR (if needed)
  - Clean up implementation
  - Keep tests green
  - Extract abstractions
  - Output: clean code + passing tests

TEST (coverage)
  - Verify coverage ≥ 80%
  - All tests passing
  - No testTODOs left
  - Output: coverage report
```

**Levels:**
```bash
# Basic TDD (critical tests only)
/studio build --test --speed "add user validation"

# Full TDD (complete test suite)
/studio build --test --scale "payment processing"

# Strict TDD (100% coverage required)
/studio build --test --quality "security-critical auth"
```

**Success Criteria:**
- Tests written before implementation
- All tests passing
- Coverage ≥ 80% (or ≥ 95% with --quality)
- Tests describe behavior, not implementation

---

### --debug (Debug Mode)

**Purpose:** Fix existing bugs systematically

**Philosophy:**
- Understand before fixing
- Fix root cause, not symptoms
- Add regression tests

**Workflow:**
```
EXPLORE (error investigation, 10 min)
  - Search for error message in code
  - Find stack trace source
  - Identify code path
  - Understand context
  - Output: investigation.md

ANALYZE (root cause, 10 min)
  - Reproduce the bug
  - Identify root cause
  - Understand why it happens
  - Check related code
  - Output: root_cause.md

FIX (implementation, 15-30 min)
  - Implement fix
  - Add regression test
  - Verify fix works
  - Check for similar bugs
  - Output: fix.md

VERIFY (validation)
  - Test fix works
  - Regression test passes
  - No new bugs introduced
  - Edge cases covered
  - Output: validation.md
```

**Levels:**
```bash
# Quick fix
/studio build --debug --speed "fix TypeError in auth"

# Validated fix
/studio build --debug --quality "critical production bug"

# Fix + refactor
/studio build --debug --clean "fix and simplify"
```

**Success Criteria:**
- Root cause identified
- Fix implemented
- Regression test added
- Bug cannot recur

---

### --docs (Documentation Mode)

**Purpose:** Generate documentation automatically

**Philosophy:**
- Code is truth, docs are reflection
- Document why, not just what
- Self-documenting code first

**Workflow:**
```
CODE (with documentation)
  - Write code with JSDoc/comments
  - Document complex logic
  - Explain "why" not "what"
  - Use self-documenting names

OUTPUT (auto-generation)
  - README.md (30-second hook)
  - API.md (API documentation)
  - GUIDE.md (5-minute storytelling)
  - REFERENCE.md (cheat sheet)

FORMAT (structured)
  - Examples in README
  - Type signatures in API.md
  - Architecture in GUIDE.md
  - Quick reference in REFERENCE.md
```

**Levels:**
```bash
# Basic docs (README only)
/studio build --docs --speed "utility function"

# Full docs (README + API)
/studio build --docs --scale "API endpoints"

# Complete docs (all formats)
/studio build --docs --quality "public library"
```

**Output Structure:**
```
docs/
├── README.md       # Hook, quick start, examples
├── API.md          # All public APIs with types
├── GUIDE.md        # Architecture, patterns, workflows
└── REFERENCE.md    # Quick reference card
```

**Success Criteria:**
- README < 50 lines
- Quick start < 3 commands
- API documentation complete
- Examples runnable

---

### --git (Git-Aware Mode)

**Purpose:** Intelligently work with Git changes

**Workflow:**
```
EXPLORE (git context)
  - git diff to see changes
  - git log for recent commits
  - Understand branch context
  - Check staging area

PLAN (git-aware)
  - Consider modified files
  - Respect branch purpose
  - Plan atomic commits
  - Prepare commit messages

IMPLEMENT (with git)
  - Work on changed files
  - Stage appropriately
  - Suggest commit message
  - Follow Git Flow Master format
```

**Git Flow Master Format:**
```
TYPE: PROJECT_NAME - vX.Y.Z

- Change 1
- Change 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Combinations:**
```bash
# Feature with git integration
/studio build --git --scale "add OAuth"

# Bug fix with proper commit
/studio build --git --debug "fix auth bug"

# Refactor with git history awareness
/studio build --git --clean "simplify service"
```

---

### --branch (Context-Aware Mode)

**Purpose:** Behavior adapted to Git branch

**Auto-Detection:**

| Branch Pattern | Detected Behavior |
|----------------|-------------------|
| `feature/*` | `--scale` (new features) |
| `bugfix/*` | `--debug` (fixes) |
| `refactor/*` | `--clean` (refactoring) |
| `main/master` | `--quality` (production) |
| `hotfix/*` | `--debug --quality` (urgent fixes) |
| `docs/*` | `--docs` (documentation) |
| `test/*` | `--test` (test-focused) |

**Usage:**
```bash
# Auto-detect from branch
/studio build --branch "implement auth"

# Explicit override
/studio build --branch=feature/auth "add OAuth"

# Combined with flags
/studio build --branch --scale "large feature"
```

---

## 🧠 NEW: Memory Integration

After each build, automatically save to claude-mem:

**Auto-Save Triggers:**
- ✅ New pattern discovered
- ✅ Architecture decision made
- ✅ Anti-pattern identified
- ✅ Convention established
- ✅ Bug solution found
- ✅ Refactoring technique applied

**Memory Categories:**

| Category | What to Store |
|----------|---------------|
| **Patterns** | Working code patterns |
| **Decisions** | Tech choices + rationale |
| **Anti-Patterns** | What NOT to do |
| **Workflows** | Repeatable processes |
| **Solutions** | Bug fixes and their causes |

**Usage:**
```bash
# Search memory before implementing
"Let me check claude-mem for similar patterns first"

# Save after solving
"Saving successful pattern to claude-mem for future reference"
```

---

## 📊 NEW: Progress Indicators

Show clear progress during implementation:

```
[████████░░] 80% - Coding (3/4 files done)

✓ EXPLORE (5 min) → Found 4 relevant files
✓ PLAN (3 min) → 3-step implementation
→ CODE (15 min) → Implementing feature...
○ TEST (pending)
```

**Phase Breakdown:**
```
Phase 1: EXPLORE ⏱ 5 min
├─ Searching codebase...
├─ Found 4 relevant files
├─ Pattern identified: feature-module
└─ ✓ Complete

Phase 2: PLAN ⏱ 3 min
├─ Creating implementation strategy...
├─ 3 steps identified
├─ Files to modify: 4
└─ ✓ Complete

Phase 3: CODE ⏱ 15 min (in progress)
├─ [████████░░] 80%
├─ File 1/4: ✓ auth.service.ts
├─ File 2/4: ✓ auth.types.ts
├─ File 3/4: ✓ auth.controller.ts
└─ File 4/4: → auth.test.ts (writing...)

Phase 4: TEST ⏱ pending
├─ Run tests
├─ Verify coverage
└─ Check regressions
```

---

## 📏 NEW: Quality Metrics

Report objective quality after build:

```
Code Quality Report
════════════════════════════════════════
Lines Added:        127
Lines Removed:      23 (delete-first!)
Net Change:         +104
Files Touched:      4

Barrel Exports:     ✓ All proper
Type Coverage:      100%
Test Coverage:      85% (target: 80%)
Complexity:         Reduced by 15%

Debt:               -50 lines (net improvement)
Performance:        +20% faster (measured)

Memory:             2 patterns saved to claude-mem
Documentation:      README.md + API.md generated

Status:             ✓ READY FOR MERGE
════════════════════════════════════════
```

**Metrics Collected:**
- Code volume (added/removed/net)
- Test coverage (%)
- Type coverage (%)
- Complexity (cyclomatic)
- Performance (when applicable)
- Technical debt (lines)
- Documentation completeness

---

## 🔄 Flag Combinations

### Power Combinations

| Command | Behavior | Use For |
|---------|----------|---------|
| `/studio build --clean --scale` | Delete-first thorough refactor | Major refactoring |
| `/studio build --test --quality` | TDD with 100% coverage | Critical features |
| `/studio build --debug --git` | Bug fix with proper commit | Production bugs |
| `/studio build --clean --types` | TypeScript improvement | Type safety |
| `/studio build --test --docs --scale` | TDD + docs + thorough | Libraries/APIs |
| `/studio build --debug --clean` | Fix + refactor | Bug with cleanup |
| `/studio build --git --branch --scale` | Full git-aware feature | Feature branches |
| `/studio build --profile --quality` | Performance optimization | Slow code |
| `/studio build --speed --team` | Quick parallel | Large simple tasks |

---

## 🤖 Auto-Detection (Enhanced)

**When no flags are provided**, the system analyzes the task and selects appropriate behavior.

### Enhanced Detection Rules

| Signal | Detected Profile |
|--------|------------------|
| < 100 chars, no "and/with" | `--speed` |
| Contains "feature/build/create" | `--scale` |
| Contains "SaaS/platform/system" | `--team` |
| Contains "critical/security/payment" | `--quality` |
| Contains "refactor/cleanup/remove" | `--clean` |
| Contains "test/TDD/coverage" | `--test` |
| Contains "fix/bug/error/debug" | `--debug` |
| Contains "docs/API/guide" | `--docs` |
| Contains "slow/performance" | `--profile` |
| Contains "types/TypeScript" | `--types` |

### Examples

```bash
# Auto-detects as --speed
/studio build "fix login button"

# Auto-detects as --clean
/studio build "refactor user service, remove duplicates"

# Auto-detects as --test
/studio build "add payment feature with full test coverage"

# Auto-detects as --debug
/studio build "fix TypeError in auth controller"

# Auto-detects as --docs
/studio build "create API with documentation"

# Auto-detects as --scale --test
/studio build "build payment feature with tests"
```

---

## 🔧 Technical Subagents

| Subagent | Tech Stack | When Used |
|----------|-----------|-----------|
| `impl-nextjs` | React 19, RSC, Prisma | `--tech=nextjs` |
| `impl-rust` | Ownership, async/await | `--tech=rust` |
| `impl-python` | Type hints, FastAPI | `--tech=python` |
| `impl-go` | Goroutines, interfaces | `--tech=go` |
| `impl-typescript` | Strict types, Zod | `--types` flag |

---

## ✅ Success Criteria

### Universal Criteria (All Flags)
- ✅ Correct flag(s) chosen for task
- ✅ Implementation follows flag behavior
- ✅ Tests passing (flag-appropriate level)
- ✅ No regressions
- ✅ Code quality maintained

### Additional Criteria by Flag

| Flag | Additional Criteria |
|------|---------------------|
| `--clean` | Net code reduction, zero duplication |
| `--test` | Tests written first, coverage ≥ 80% |
| `--debug` | Root cause identified, regression test added |
| `--docs` | Documentation complete and accurate |
| `--git` | Proper commit message prepared |
| `--profile` | Performance improved, measured |
| `--types` | Type coverage 100%, no `any` |

---

## 🚀 Best Practices

1. **Start with auto-detection** - Let the system choose, then refine
2. **Compose flags naturally** - Combine for custom behavior
3. **Use --clean before --scale** - Delete first, then add
4. **Use --test for critical features** - Invest in test coverage
5. **Use --debug when fixing bugs** - Systematic bug fixing
6. **Use --docs for public APIs** - Good documentation matters
7. **Use --git for version control** - Proper commit messages
8. **Check memory before implementing** - Reuse past solutions
9. **Review metrics after build** - Objective quality assessment

---

## 🎯 Decision Guide (Enhanced)

### Quick Decision Tree

```
Need to implement?
├─ Simple fix / small feature? → /studio build --speed
├─ Complex / multi-file? → /studio build --scale
├─ Quality-critical / security? → /studio build --quality
├─ Large project / multi-domain? → /studio build --team
├─ Refactoring / cleanup? → /studio build --clean
├─ Test-critical feature? → /studio build --test
├─ Bug fixing? → /studio build --debug
├─ Public API / library? → /studio build --docs
├─ Performance issue? → /studio build --profile
├─ Type safety issues? → /studio build --types
├─ Working with Git? → /studio build --git
├─ Branch-specific workflow? → /studio build --branch
├─ Not sure? → /studio build (auto-detect)
└─ Need specific combination? → Compose flags!
```

### Combination Guide

```
Too slow? Add --speed
Not thorough enough? Add --scale
Quality issues? Add --quality
Too large for one agent? Add --team
Too much duplication? Add --clean
Need test coverage? Add --test
Fixing a bug? Add --debug
Need documentation? Add --docs
Using Git? Add --git
Performance issues? Add --profile
Type safety issues? Add --types
Branch-specific? Add --branch
```

---

## 🔄 Legacy Compatibility

### Deprecated Commands (Still Work)

| Old Command | New Equivalent |
|-------------|----------------|
| `/oneshot "..."` | `/studio build --speed "..."` |
| `/epct "..."` | `/studio build --scale "..."` |
| `/predator "..."` | `/studio build --quality "..."` |
| `/ralph "..."` | `/studio build --scale --team "..."` |
| `/builder --tech=nextjs "..."` | `/studio build --scale --tech=nextjs "..."` |
| `/studio build --quick "..."` | `/studio build --speed "..."` |
| `/studio build --epct "..."` | `/studio build --scale "..."` |
| `/studio build --predator "..."` | `/studio build --quality "..."` |
| `/studio build --ralph "..."` | `/studio build --scale --team "..."` |
| `/studio build --builder "..."` | `/studio build --scale --tech=* "..."` |

**Note**: Legacy commands show a deprecation notice but work normally.

---

*Implement Skill v3.0.0 - 12-flag system with memory integration and quality metrics*
