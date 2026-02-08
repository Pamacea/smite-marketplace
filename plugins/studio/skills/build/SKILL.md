---
name: implement
description: Unified implementation agent with 4-flag system (speed, scale, quality, team) + auto-detection
version: 2.0.0
---

# Implement Skill - Unified Agent v2.0

## 🔴 TOOL GATEKEEPER - NON-NEGOTIABLE

═══════════════════════════════════════════════════
🚫 PROHIBITED WITHOUT EXCEPTION:
   grep | egrep | find | ack | ag | ls | dir | glob

✅ MANDATORY REPLACEMENT:
   /explore --mode=quick | grepai search "pattern" | /toolkit search "query"

🎯 DECISION TREE:
   Need to explore? → /explore (NOT grep/ls/find)
   Quick implementation → /studio build --speed
   Thorough implementation → /studio build --scale
   Quality-critical → /studio build --quality
   Team collaboration → /studio build --team
   No flags → AUTO-DETECTION

═══════════════════════════════════════════════════

---

## Mission

Provide **ONE unified implementation entry point** with:
- **4 modifiable flags** for composable behavior
- **Auto-detection** for zero-configuration usage
- **Legacy compatibility** for smooth migration

---

## 🎯 4-Flag System

### The Flags

| Flag | Aliases | Effect | Use When |
|------|---------|--------|----------|
| `--speed` | `--fast`, `--quick` | Optimized for velocity | Quick fixes, small features |
| `--scale` | `--thorough`, `--epct` | Comprehensive workflow | Complex features, multiple files |
| `--quality` | `--validate`, `--predator` | Quality gates enabled | Critical code, production-ready |
| `--team` | `--swarm`, `--ralph` | Parallel agent teams | Large projects, multi-domain |

### Flag Philosophy

**Flags are MODIFIERS, not modes.** They combine naturally:

```bash
# Single flag - simple behavior
/studio build --speed "fix button"

# Multiple flags - composed behavior
/studio build --speed --team "quick parallel fix"
/studio build --scale --quality "thorough + validated"
/studio build --scale --team "large parallel project"
/studio build --scale --quality --team "maximum power"
```

---

## 🤖 Auto-Detection (Default Behavior)

**When no flags are provided**, the system analyzes the task and selects appropriate behavior.

### Detection Rules

| Signal | Detected Profile |
|--------|------------------|
| < 100 chars, no "and/with" | `--speed` |
| Contains "feature/build/create" + 3-5 files | `--scale` |
| Contains "SaaS/platform/system" | `--team` |
| Contains "critical/security/payment" | `--quality` |
| Contains words: "refactor/cleanup/organize" | `--scale --quality` |

### Examples

```bash
# Auto-detects as --speed
/studio build "fix login button"

# Auto-detects as --scale
/studio build "build user dashboard with authentication"

# Auto-detects as --team
/studio build "create full SaaS platform with billing"

# Auto-detects as --quality
/studio build "implement payment processing system"
```

---

## 📋 Flag Combinations

### Common Patterns

| Command | Behavior | Like |
|---------|----------|------|
| `/studio build "..."` | Auto-detected | Smart default |
| `/studio build --speed "..."` | Quick, surgical | `--quick` (legacy) |
| `/studio build --scale "..."` | EPCT workflow | `--epct` (legacy) |
| `/studio build --quality "..."` | Quality gates + workflow | `--predator` (legacy) |
| `/studio build --team "..."` | Parallel agents | `--ralph` (legacy) |
| `/studio build --speed --team "..."` | Quick parallel | NEW |
| `/studio build --scale --quality "..."` | Thorough + validated | Enhanced EPCT |
| `/studio build --scale --team "..."` | Parallel thorough | Enhanced Ralph |
| `/studio build --scale --quality --team "..."` | Maximum power | Full orchestration |

### Tech Stack Specification

Tech selection works with ANY combination:

```bash
/studio build --scale --tech=nextjs "..."
/studio build --speed --tech=rust "..."
/studio build --quality --tech=python --team "..."
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

## 📖 Flag Details

### --speed (Fast Mode)

**Purpose:** Maximum velocity for well-defined tasks

**Workflow:**
```
EXPLORE (surgical, 5 min)
  - 1-2 targeted searches
  - Find files to edit
  - NO planning phase

CODE (immediate)
  - Follow existing patterns
  - Strict scope discipline
  - No refactoring beyond requirements
  - No comments (self-documenting code)

TEST (basic)
  - lint + typecheck only
  - Fix errors, stay in scope
```

**Time:** 5-10 minutes

**Best for:** Bug fixes, UI tweaks, small features

### --scale (Thorough Mode)

**Purpose:** Comprehensive, structured implementation

**Workflow:**
```
1. EXPLORE (15 min)
   - Deep codebase exploration
   - Multi-source research
   - Parallel subagents
   - Output: exploration.md

2. PLAN (20 min)
   - Detailed implementation plan
   - File structure
   - Types and interfaces
   - Testing strategy
   - Output: plan.md

3. CODE (30-60 min)
   - Follow plan
   - Tech-specific best practices
   - Barrel exports
   - Output: implementation

4. TEST (15 min)
   - Full test suite
   - Unit, integration, E2E
   - Coverage measured
   - Output: test-results.md
```

**Time:** 60-90 minutes

**Best for:** Complex features, multi-file changes, production code

### --quality (Quality Mode)

**Purpose:** Implementation with comprehensive quality gates

**Workflow:**
```
Follows --scale workflow PLUS:

00_INIT
  - Create output folder
  - Parse flags

01_ANALYZE
  - Gather context
  - Explore codebase
  - Output: analysis.md

02_PLAN
  - Create strategy
  - Define criteria
  - Output: plan.md

03_EXECUTE
  - Implement using plan
  - Output: implementation

04_VALIDATE
  - Quality checks:
    * Linting
    * Type checking
    * Unit tests
    * Integration tests
  - Output: validation.md

05_EXAMINE (adversarial)
  - Second agent challenges implementation
  - Security review
  - Performance check
  - Output: examination.md

06_RESOLVE (if issues found)
  - Fix identified issues
  - Output: resolution.md

07_FINISH
  - Summary
  - Output: summary.md
```

**Time:** 60-120 minutes

**Best for:** Critical systems, security-sensitive code, production features

### --team (Team Mode)

**Purpose:** Parallel agent orchestration using Claude Code Agent Teams

**Workflow:**
```
1. Create team
   - Enable CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
   - Spawn teammates for different aspects

2. Assign tasks
   - Shared task list
   - Dependencies tracked
   - Self-organizing claim system

3. Parallel execution
   - Each teammate has own context
   - Direct messaging between agents
   - Coordinate via shared state

4. Synthesis
   - Aggregate results
   - Merge implementations
   - Final validation
```

**Time:** 2-3x faster than sequential for large projects

**Best for:** Large projects, multi-domain features, independent components

**Requirements:**
- Claude Code v2.1.32+
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

---

## 🔧 Technical Subagents

| Subagent | Tech Stack | When Used |
|----------|-----------|-----------|
| `impl-nextjs` | React 19, RSC, Prisma | `--tech=nextjs` |
| `impl-rust` | Ownership, async/await | `--tech=rust` |
| `impl-python` | Type hints, FastAPI | `--tech=python` |
| `impl-go` | Goroutines, interfaces | `--tech=go` |

Tech subagents work with ANY flag combination.

---

## 📊 Comparison: Legacy vs New

| Legacy | New v2.0 | Benefit |
|--------|----------|---------|
| `/studio build --quick` | `/studio build --speed` | Clearer intent |
| `/studio build --epct` | `/studio build --scale` | Clearer intent |
| `/studio build --predator` | `/studio build --quality` | Clearer intent |
| `/studio build --ralph` | `/studio build --team` | Matches Claude Code |
| `/studio build --builder` | `/studio build --scale --tech=*` | Consistent |
| No equivalent | `/studio build --speed --team` | Quick parallel! |
| No equivalent | `/studio build --scale --quality --team` | Composable! |

---

## 🎯 Decision Guide

### Quick Decision Tree

```
Need to implement?
├─ Simple fix / small feature? → /studio build --speed
├─ Complex / multi-file? → /studio build --scale
├─ Quality-critical / security? → /studio build --quality
├─ Large project / multi-domain? → /studio build --team
├─ Not sure? → /studio build (auto-detect)
└─ Need specific combination? → Compose flags!
```

### Combination Guide

```
Too slow? Add --speed
Not thorough enough? Add --scale
Quality issues? Add --quality
Too large for one agent? Add --team
```

---

## ✅ Success Criteria

- ✅ Correct flag(s) chosen for task
- ✅ Implementation follows flag behavior
- ✅ Tests passing (flag-appropriate level)
- ✅ No regressions
- ✅ Code quality maintained

---

## 🚀 Best Practices

1. **Start with auto-detection** - Let the system choose, then refine
2. **Compose flags** - Don't be afraid to combine
3. **Use --speed for trivial changes** - Skip the ceremony
4. **Use --scale for real features** - Invest in planning
5. **Use --quality for critical code** - Pay the quality tax
6. **Use --team for large projects** - Leverage parallelism
7. **Specify tech stack** - Always use `--tech=*` for tech-specific work

---

*Implement Skill v2.0.0 - 4-flag system with auto-detection*
