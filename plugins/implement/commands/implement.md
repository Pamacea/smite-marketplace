# /implement - Unified Implementation Command

> **UNIFIED** implementation entry point - consolidates all implementation approaches

## Usage

```bash
# Quick implementation (like /oneshot)
/implement --quick "Add user profile page"

# Structured 4-phase (like /epct)
/implement --epct "Build a complete dashboard"

# Technical 5-step (like /builder)
/implement --builder --tech=nextjs "Add authentication"

# Modular 8-step (like /predator)
/implement --predator "Implement shopping cart"

# Parallel orchestration (like /ralph)
/implement --ralph "Build full SaaS platform"
```

## Mode Selection

| Mode | Description | Like | Best For | Speed |
|------|-------------|-------|----------|-------|
| `--quick` | Ultra-fast, no planning | `/oneshot` | Quick features, bug fixes | ⚡⚡⚡ |
| `--epct` | 4 structured phases | `/epct` | Complex features, thorough | ⚡⚡ |
| `--builder` | 5 steps + tech subagents | `/builder` | Tech-specific implementation | ⚡ |
| `--predator` | 8 modular steps | `/predator` | Systematic workflow | ⚡ |
| `--ralph` | Parallel orchestration | `/ralph/feature` | Large projects | ⚡⚡⚡ |

## --quick (Quick Mode)

**Like:** `/oneshot` - Ultra-fast implementation

**Workflow:**
```bash
EXPLORE (5-10 min max)
- 1-2 parallel subagents max
- Use /explore --mode=quick
- Find files to edit
- NO PLANNING PHASE

CODE (implement immediately)
- Start coding as soon as basic context available
- Follow existing codebase patterns
- Stay STRICTLY in scope
- NO comments unless necessary
- NO refactoring beyond requirements
- Run autoformatting

TEST (validate quality)
- Run: lint + typecheck (or equivalent)
- Fix errors immediately
- Stay in scope (no full test suite unless requested)
```

**Best for:** Well-defined, small features, bug fixes, UI tweaks

**Time:** 5-10 minutes max

## --epct (4-Phase Structured Mode)

**Like:** `/epct` - Systematic 4-phase implementation

**Workflow:**
```bash
1. EXPLORE (15-20 min)
   - Deep codebase exploration
   - Multi-source research
   - Parallel subagents
   - Output: exploration.md

2. PLAN (20-30 min)
   - Detailed implementation plan
   - File structure
   - Types and interfaces
   - Testing strategy
   - Output: plan.md

3. CODE (30-60 min)
   - Implement following plan
   - Follow best practices
   - Add comprehensive tests
   - Barrel exports
   - Output: implementation

4. TEST (15-30 min)
   - Full test suite
   - Unit, integration, E2E
   - Coverage measurement
   - Fix all failures
   - Output: test-results.md
```

**Best for:** Complex features (3-5 files), thorough implementation

**Time:** 60-90 minutes

## --builder (Technical 5-Step Mode)

**Like:** `/builder` - 5 steps with tech specialization

**Workflow:**
```bash
1. EXPLORE (--explore)
   - /explore --mode=quick
   - Document patterns
   - Output: builder-exploration.md

2. DESIGN (--design)
   - File structure
   - Type definitions
   - Validation schemas
   - Architecture
   - Output: builder-design.md

3. IMPLEMENT (--implement)
   - Launch tech subagent:
     - --tech=nextjs (React 19, RSC, Prisma)
     - --tech=rust (Ownership, async/await)
     - --tech=python (Type hints, FastAPI)
     - --tech=go (Goroutines, interfaces)
   - Output: implementation

4. TEST (--test)
   - Unit tests
   - Integration tests
   - Coverage: 80%+
   - Output: test suite

5. VERIFY (--verify)
   - Linting
   - Type checking
   - Build verification
   - Smoke tests
   - Output: builder-verification.md
```

**Best for:** Tech-specific implementation, framework best practices

**Time:** 60-90 minutes

## --predator (Modular 8-Step Mode)

**Like:** `/predator` - Modular workflow with 8 steps

**Workflow:**
```bash
00_INIT
- Parse flags
- Create output folder
- Output: state.json

01_ANALYZE
- Gather context
- Explore codebase
- Output: 01_ANALYZE.md

02_PLAN
- Create strategy
- Define criteria
- Output: 02_PLAN.md

03_EXECUTE
- Implement using TodoWrite
- Output: 03_EXECUTE.md

04_VALIDATE
- Run quality checks
- Output: 04_VALIDATE.md

05_EXAMINE (optional, --examine)
- Adversarial code review
- Output: 05_EXAMINE.md

06_RESOLVE (optional, if issues)
- Apply fixes
- Output: 06_RESOLVE.md

07_FINISH
- Create PR or complete
- Output: 07_FINISH.md, SUMMARY.md
```

**Best for:** Systematic workflow, quality gates, comprehensive validation

**Time:** 60-120 minutes

## --ralph (Parallel Orchestration Mode)

**Like:** `/ralph/feature` - Parallel execution of independent stories

**Workflow:**
```bash
1. Generate PRD from natural language
   - Auto-generate specification
   - Parse into user stories
   - Output: prd.json

2. Parse Stories
   - Extract user stories from PRD
   - Identify dependencies

3. Build Dependency Graph
   - Create dependency map
   - Identify independent batches
   - 2-3x speedup through parallel execution

4. Execute in Parallel
   - /explore for each story
   - /implement for each story
   - Track progress
   - Commit after each story

5. Track Progress
   - Update progress state
   - Display completion percentage
```

**Best for:** Large projects, multiple independent components, SaaS platforms

**Time:** Variable (2-3x faster than sequential)

## Comparison Table

| Aspect | Quick | EPCT | Builder | Predator | Ralph |
|--------|-------|------|---------|----------|--------|
| Planning | None | Detailed | Detailed | Steps 1-2 | Auto-PRD |
| Exploration | Surgical | Deep | Pattern-based | Steps 1-2 | Per story |
| Implementation | Immediate | Structured | Tech-specific | Step 3 | Parallel |
| Testing | Lint+Type | Full suite | 80%+ coverage | Step 4 | Per story |
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ | ⚡ | ⚡⚡ |
| Quality | Good | Excellent | High | High | High |
| Scope | Small | Medium | Large | Large | Very Large |

## Examples

### Quick Implementation

```bash
# Like /oneshot
/implement --quick "Add dark mode toggle"

# Bug fix
/implement --quick "Fix login button alignment"
```

### Structured 4-Phase

```bash
# Like /epct
/implement --epct "Build a complete dashboard with charts"
```

### Technical Implementation

```bash
# Like /builder with Next.js
/implement --builder --tech=nextjs "Add authentication"

# Like /builder with Rust
/implement --builder --tech=rust "Build high-performance processor"
```

### Modular 8-Step

```bash
# Like /predator
/implement --predator "Implement shopping cart with persistence"

# With adversarial review
/implement --predator --examine "Critical payment system"
```

### Parallel Orchestration

```bash
# Like /ralph
/implement --ralph "Build full SaaS platform"
```

## Integration

### With Explore

All modes use `/explore` for context:

```bash
# Quick exploration
/implement --quick
  -> Uses: /explore --mode=quick

# Deep exploration
/implement --epct
  -> Uses: /explore --mode=deep

# Pattern search
/implement --builder
  -> Uses: /explore --type=code
```

### With Refactor

After implementation, use `/refactor` for quality:

```bash
# Quick refactor
/refactor --quick

# Full refactor
/refactor --full
```

### With Ralph

Ralph uses `/implement --ralph` for parallel execution.

## Output

All artifacts saved to `.claude/.smite/implement-*/`:

| Mode | Files | Purpose |
|------|-------|---------|
| Quick | implementation/ | Code + changes |
| EPCT | exploration.md, plan.md, implementation/ | Full workflow |
| Builder | builder-exploration.md, builder-design.md, implementation/, builder-verification.md | Tech-specific |
| Predator | 00_*.md files, SUMMARY.md | Modular workflow |
| Ralph | prd.json, progress.json, per-story artifacts/ | Orchestration |

## Migration Guide

### From /oneshot

**Old:**
```bash
/oneshot "Add user profile page"
```

**New:**
```bash
/implement --quick "Add user profile page"
```

### From /epct

**Old:**
```bash
/epct "Build a complete dashboard"
```

**New:**
```bash
/implement --epct "Build a complete dashboard"
```

### From /builder

**Old:**
```bash
/builder --tech=nextjs --feature="authentication"
```

**New:**
```bash
/implement --builder --tech=nextjs "Add authentication"
```

### From /predator

**Old:**
```bash
/predator "Implement shopping cart"
```

**New:**
```bash
/implement --predator "Implement shopping cart"
```

### From /ralph/feature

**Old:**
```bash
/ralph "Build full SaaS platform"
```

**New:**
```bash
/implement --ralph "Build full SaaS platform"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Wrong mode chosen | Use decision tree to select appropriate mode |
| Subagent not found | Install missing tech stack or detect automatically |
| Tests failing | Fix all failures before proceeding |
| Type errors | Resolve all type errors before verification |
| Too slow | Use faster mode (quick or epct) |

## Best Practices

1. **Choose mode carefully** - Use decision tree for task type
2. **Explore first** - Always use /explore for context
3. **Follow mode's workflow** - Don't skip steps
4. **Test appropriately** - Quick: lint+typecheck, Others: full suite
5. **Leverage tech subagents** - For builder mode, specify tech stack
6. **Use Ralph for large projects** - 2-3x speedup through parallel execution

---

**Version:** 1.0.0
**Last Updated:** 2025-02-01
**SMITE Version:** 3.1.0
**Author:** Pamacea
