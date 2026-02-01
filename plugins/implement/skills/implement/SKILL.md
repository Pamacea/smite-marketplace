---
name: implement
description: Unified implementation agent - consollates all implementation approaches
version: 1.0.0
---

# Implement Skill - Unified Agent

## 🔴 TOOL GATEKEEPER - NON-NEGOTIABLE

═══════════════════════════════════════════════════
🚫 PROHIBITED WITHOUT EXCEPTION:
   grep | egrep | find | ack | ag | ls | dir | glob

✅ MANDATORY REPLACEMENT:
   /explore --mode=quick | grepai search "pattern" | /toolkit search "query"

🎯 DECISION TREE:
   Need to explore? → /explore (NOT grep/ls/find)
   Quick implementation → /implement --quick (skip explore/plan)
   Tech-specific → /implement --builder --tech=nextjs|rust|python|go
   Systematic → /implement --epct or /implement --builder
   Complex orchestration → /implement --ralph

═══════════════════════════════════════════════════

---

## Mission

Provide unified implementation entry point while **CONSERVING THE UNIQUE UTILITY OF EACH APPROACH**:

- **Quick Mode** (`--quick`) - Like `/oneshot` - Ultra-fast, no planning
- **EPCT Mode** (`--epct`) - Like `/epct` - 4 structured phases
- **Builder Mode** (`--builder`) - Like `/builder` - 5 steps + technical subagents
- **Predator Mode** (`--predator`) - Like `/predator` - 8 modular steps
- **Ralph Mode** (`--ralph`) - Like `/ralph/feature` - Parallel orchestration

## Core Principles

- **Choice First** - Explicit modes to choose right approach
- **Conserve Utility** - Each mode has unique strengths
- **Tech-Specific** - Specialized subagents for each stack
- **Quality Gates** - Testing and verification in all modes
- **Documentation** - Clear explanation of when to use each mode

## Mode Selection

### --quick (Quick Mode)

**Like:** `/oneshot` - Ultra-fast implementation

**Purpose:** Maximum speed for well-defined, small tasks

**Workflow:**
```
EXPLORE (5-10 min max)
  - 1-2 parallel subagents max
  - Use /explore --mode=quick
  - Be surgical - know exactly what to search
  - NO PLANNING PHASE

CODE (implement immediately)
  - Start coding as soon as basic context available
  - Follow existing patterns
  - Clear variable/method names
  - STRICTLY in scope - change only what's needed
  - NO comments unless absolutely necessary
  - NO refactoring beyond requirements
  - Run autoformatting when done
  - Fix reasonable linter warnings

TEST (validate quality)
  - Run: lint + typecheck (or equivalent)
  - Fix errors immediately and re-run
  - Stay in scope - no full test suite unless requested
```

**Best for:** Well-defined small features, bug fixes with clear solutions, UI tweaks

**Time:** 5-10 minutes max

### --epct (4-Phase Structured Mode)

**Like:** `/epct` - Systematic 4-phase implementation

**Purpose:** Structured, thorough implementation for complex features

**Workflow:**
```
1. EXPLORE (10-15 min)
   - Deep codebase exploration
   - Multi-source research
   - Document existing patterns
   - Output: exploration.md

2. PLAN (15-20 min)
   - Detailed implementation plan
   - File structure
   - Types and interfaces
   - Testing strategy
   - Output: plan.md

3. CODE (30-60 min)
   - Launch tech-specific subagent
   - Follow plan
   - Barrel exports
   - Output: implementation

4. TEST (10-15 min)
   - Run full test suite
   - All tests passing
   - Coverage measured
   - Output: test-results.md
```

**Best for:** Complex features (3-5 files), thorough implementation, production-ready code

**Time:** 60-90 minutes

### --builder (Technical 5-Step Mode)

**Like:** `/builder` - 5 steps with technical specialization

**Purpose:** Tech-specific best practices with comprehensive workflow

**Workflow:**
```
1. EXPLORE (--explore)
   - /explore --mode=quick
   - Document patterns
   - Output: builder-exploration.md

2. DESIGN (--design)
   - File structure
   - Type definitions
   - Zod validation schemas
   - Data flow
   - Architecture
   - Output: builder-design.md

3. IMPLEMENT (--implement)
   - Launch tech-specific subagent
   - Follow design
   - Barrel exports
   - Output: implementation

4. TEST (--test)
   - Unit tests
   - Integration tests
   - Coverage 80%+
   - Output: test suite

5. VERIFY (--verify)
   - Linting
   - Type checking
   - Build verification
   - Smoke tests
   - Output: builder-verification.md
```

**Tech Stacks:**
- `--tech=nextjs` - React 19, RSC, Prisma, Server Actions
- `--tech=rust` - Ownership, async/await, zero-copy
- `--tech=python` - Type hints, FastAPI, SQLAlchemy 2.0
- `--tech=go` - Goroutines, interfaces, stdlib

**Best for:** Tech-specific implementation, framework best practices

**Time:** 60-90 minutes

### --predator (Modular 8-Step Mode)

**Like:** `/predator` - Systematic workflow with 8 modular steps

**Purpose:** Systematic feature implementation with quality gates

**Workflow:**
```
00_INIT
  - Parse flags
  - Create output folder

01_ANALYZE
  - Gather context
  - Explore codebase
  - Output: analysis.md

02_PLAN
  - Create strategy
  - Define criteria
  - Output: plan.md

03_EXECUTE
  - Implement using TodoWrite
  - Follow plan
  - Output: implementation

04_VALIDATE
  - Run quality checks
  - Test execution
  - Output: validation.md

05_EXAMINE (optional, with --examine)
  - Adversarial code review
  - Security review
  - Output: examination.md

06_RESOLVE (optional, if issues)
  - Fix identified issues
  - Update implementation
  - Output: resolution.md

07_FINISH
  - Create PR or complete
  - Documentation
  - Output: summary.md
```

**Best for:** Systematic workflow, quality gates, modular steps

**Time:** 60-120 minutes

### --ralph (Parallel Orchestration Mode)

**Like:** `/ralph/feature` - Parallel execution of independent stories

**Purpose:** Orchestrate multiple agents for complex projects

**Workflow:**
```
1. Generate PRD
   - Auto-generate from natural language
   - Parse into user stories
   - Output: prd.json

2. Build Dependency Graph
   - Analyze dependencies
   - Create batches
   - Execute in parallel
   - 2-3x speedup

3. Execute Stories
   - /implement --ralph (orchestrated)
   - /explore for each story
   - /implement for implementation
   - Track progress

4. Commit and Track
   - Auto-commit after each story
   - Update progress state
   - Output: progress.md
```

**Best for:** Large projects, multiple independent components, SaaS platforms

**Time:** Variable (2-3x faster than sequential)

## Technical Subagents

### impl-nextjs Subagent

**Purpose:** Next.js implementation specialist

**Launched by:** Builder mode with `--tech=nextjs`

**Capabilities:**
- React Server Components (RSC)
- Server Actions for mutations
- Prisma database operations
- TanStack Query for server state
- Shadcn UI components
- Tailwind CSS styling

**Patterns:**
- `app/` directory for routing
- `components/ui/` for Shadcn
- `lib/` for utilities
- `validation/` for Zod schemas
- Barrel exports (`index.ts`)

### impl-rust Subagent

**Purpose:** Rust implementation specialist

**Launched by:** Builder mode with `--tech=rust`

**Capabilities:**
- Ownership and borrowing patterns
- Async/await with tokio
- Error handling with Result<T, E>
- Zero-copy parsing
- Derive macros for serialization

**Patterns:**
- `src/models/` for data structures
- `src/services/` for business logic
- `src/handlers/` for HTTP handlers
- `src/repositories/` for database
- Error types in `src/error.rs`

### impl-python Subagent

**Purpose:** Python implementation specialist

**Launched by:** Builder mode with `--tech=python`

**Capabilities:**
- Type hints everywhere
- Pydantic for validation
- FastAPI for REST API
- SQLAlchemy 2.0 for database
- Async/await for I/O

**Patterns:**
- `src/models/` for Pydantic models
- `src/services/` for business logic
- `src/api/` for FastAPI routes
- `src/repositories/` for database
- `src/main.py` for application entry

### impl-go Subagent

**Purpose:** Go implementation specialist

**Launched by:** Builder mode with --tech=go

**Capabilities:**
- Interfaces for abstraction
- Goroutines for concurrency
- Context propagation
- Standard library preference
- Explicit error handling

**Patterns:**
- `src/models/` for data structures
- `src/services/` for business logic
- `src/handlers/` for HTTP handlers
- `src/repository/` for database
- `src/main.go` for application entry

## Decision Guide

### Quick Decision Tree

```
Need to implement?
├─ Is it simple/quick-fix? → /implement --quick
├─ Is it complex/multi-file? → /implement --epct
├─ Is it tech-specific? → /implement --builder --tech=nextjs|rust|python|go
├─ Is it quality-critical? → /implement --predator
└─ Is it a large project? → /implement --ralph
```

### Comparison Table

| Aspect | Quick | EPCT | Builder | Predator | Ralph |
|--------|-------|------|---------|----------|-------|
| Planning | None | Detailed | Detailed | Detailed | Auto-PRD |
| Exploration | Surgical | Deep | Pattern | Deep | Per story |
| Implementation | Immediate | Structured | Tech-specific | Modular | Orchestrated |
| Testing | Lint+Typecheck | Full suite | 80%+ | Quality gates | Per story |
| Time | 5-10 min | 60-90 min | 60-90 min | 60-120 min | Variable |
| Best For | Small fixes | Complex features | Tech-specific | Systematic | Large projects |

## Integration

- **Requires:** /explore (for context gathering)
- **Uses:** /refactor (after implementation)
- **Compatible with:** All SMITE agents
- **Depends on:** Technical subagents (for builder mode)

## Output Files

| Mode | Files |
|------|-------|
| Quick | Implementation (no planning) |
| EPCT | exploration.md, plan.md, implementation, test-results.md |
| Builder | builder-exploration.md, builder-design.md, implementation, test suite, builder-verification.md |
| Predator | 00_INIT.md, 01_ANALYZE.md, 02_PLAN.md, 03_EXECUTE.md, 04_VALIDATE.md, 05_EXAMINE.md, 06_RESOLVE.md, 07_FINISH.md, SUMMARY.md |
| Ralph | prd.json, progress.md, per-story artifacts |

## Success Criteria

- ✅ Correct mode chosen for task
- ✅ Implementation follows mode's workflow
- ✅ Tests passing (mode-appropriate)
- ✅ No regressions
- ✅ Code quality maintained

## Best Practices

1. **Choose mode carefully** - Each mode has unique strengths
2. **Use /explore first** - Always gather context
3. **Follow mode's workflow** - Don't skip steps
4. **Leverage tech-specific subagents** - For builder mode
5. **Test appropriately** - Quick: lint+typecheck, Others: full suite
6. **Document** - Keep track of decisions

---

*Implement Skill v1.0.0 - Unified implementation agent*
