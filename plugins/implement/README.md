# @smite/implement - Unified Implementation Agent

> **UNIFIED** implementation agent - consollates all implementation approaches

## 🎯 Purpose

Provides a unified entry point for all implementation tasks while **CONSERVING THE UNIQUE UTILITY OF EACH APPROACH**:

- **Quick Mode** (`--quick`) - Like `/oneshot` - Ultra-fast implementation
- **EPCT Mode** (`--epct`) - 4 phases structurées
- **Builder Mode** (`--builder`) - 5 steps with technical subagents
- **Predator Mode** (`--predator`) - 8 modular steps
- **Ralph Mode** (`--ralph`) - Parallel orchestration

**Goal:** One command (`/implement`) with explicit modes to choose the right approach.

## 🚀 Quick Start

```bash
# 1. Install plugin
/plugin install implement@smite

# 2. Quick implementation (like /oneshot)
/implement --quick "Add user profile page"

# 3. Structured 4-phase (like /epct)
/implement --epct "Build a complete dashboard"

# 4. Technical 5-step (like /builder)
/implement --builder --tech=nextjs "Add authentication"

# 5. Modular 8-step (like /predator)
/implement --predator "Implement shopping cart"

# 6. Parallel orchestration (like /ralph)
/implement --ralph "Build full SaaS platform"
```

## 📖 Usage

### Mode Selection

| Mode | Description | Like | Best For | Speed |
|------|-------------|-------|----------|-------|
| `--quick` | Ultra-fast, no planning | `/oneshot` | Quick features, bug fixes | ⚡⚡⚡ |
| `--epct` | 4 phases: Explore → Plan → Code → Test | `/epct` | Complex features, thorough | ⚡⚡ |
| `--builder` | 5 steps: Explore → Design → Implement → Test → Verify | `/builder` | Tech-specific implementation | ⚡ |
| `--predator` | 8 modular steps | `/predator` | Systematic workflow, quality gates | ⚡⚡ |
| `--ralph` | Parallel orchestration | `/ralph/feature` | Large projects, multiple stories | ⚡⚡⚡ |

### --quick (Quick Mode)

**Like:** `/oneshot` - Ultra-fast implementation

**Workflow:**
```
EXPLORE (5-10 min max)
  - 1-2 parallel subagents max
  - Use /explore --mode=quick
  - Be surgical
  - NO PLANNING

CODE (implement immediately)
  - Follow existing patterns
  - Clear variable names
  - Stay STRICTLY in scope
  - NO comments unless necessary
  - NO refactoring beyond requirements

TEST (validate quality)
  - Run: lint + typecheck (or equivalent)
  - Fix errors immediately
  - Stay in scope (no full test suite unless requested)
```

**Best for:** Well-defined, small features, bug fixes, UI tweaks

### --epct (4-Phase Structured Mode)

**Like:** `/epct` - Systematic 4-phase implementation

**Workflow:**
```
1. EXPLORE (5-10 min)
   - Deep codebase exploration
   - Multi-source research
   - Parallel subagents
   - Output: exploration.md

2. PLAN (5-15 min)
   - Detailed implementation plan
   - File structure
   - Types and interfaces
   - Testing strategy
   - Output: plan.md

3. CODE (20-40 min)
   - Launch tech-specific subagent
   - Follow design document
   - Barrel exports
   - Output: implementation

4. TEST (5-15 min)
   - Run tests (unit, integration, coverage)
   - Fix failures
   - Lint + typecheck
   - Smoke tests
   - Output: test-results.md
```

**Best for:** Complex features, multi-file changes, thorough implementation

### --builder (Technical 5-Step Mode)

**Like:** `/builder` - 5 steps with technical specialization

**Workflow:**
```
1. EXPLORE (--explore)
   - /explore --mode=quick
   - Document patterns
   - Identify conventions
   - Output: builder-exploration.md

2. DESIGN (--design)
   - File structure
   - Type definitions
   - Zod validation schemas
   - Data flow
   - Architecture
   - Output: builder-design.md

3. IMPLEMENT (--implement)
   - Launch tech-specific subagent:
     - impl-nextjs - React 19, RSC, Prisma
     - impl-rust - Ownership, async/await
     - impl-python - Type hints, FastAPI
     - impl-go - Goroutines, interfaces
   - Barrel exports
   - Output: implementation

4. TEST (--test)
   - Unit tests
   - Integration tests
   - Component tests
   - Target: 80%+ coverage
   - Output: test-suite

5. VERIFY (--verify)
   - Linting
   - Type checking
   - All tests
   - Build verification
   - Smoke tests
   - Output: builder-verification.md
```

**Best for:** Tech-specific implementation with best practices

### --predator (Modular 8-Step Mode)

**Like:** `/predator` - Modular workflow with 8 steps

**Workflow:**
```
00_INIT → 01_ANALYZE → 02_PLAN → 03_EXECUTE → 04_VALIDATE → 05_EXAMINE → 06_RESOLVE → 07_FINISH

Steps loaded on-demand for token optimization
```

**Best for:** Systematic workflow, quality gates, comprehensive validation

### --ralph (Parallel Orchestration Mode)

**Like:** `/ralph/feature` - Parallel execution of independent stories

**Workflow:**
```
1. Generate PRD from natural language
2. Parse into user stories
3. Build dependency graph
4. Execute independent stories in parallel (2-3x speedup)
5. Track progress and commit
```

**Best for:** Large projects, multiple independent components, SaaS platforms

## 🔧 Subagents

### Technical Subagents (Reused from MOBS)

| Subagent | Tech Stack | Purpose |
|----------|-----------|---------|
| `impl-nextjs` | React 19, RSC, Prisma, Server Actions | Next.js implementation |
| `impl-rust` | Ownership, async/await, zero-copy | Rust implementation |
| `impl-python` | Type hints, FastAPI, SQLAlchemy 2.0 | Python implementation |
| `impl-go` | Goroutines, interfaces, standard library | Go implementation |

## 🔍 Integration

### With Explore

All modes use `/explore` for context gathering:

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

## 📊 Comparison Table

| Mode | Speed | Quality | Scope | Complexity | Best For |
|------|-------|---------|-------|------------|----------|
| `--quick` | ⚡⚡⚡ | ⚡⚡ | Small | Low | Quick features, bug fixes |
| `--epct` | ⚡⚡ | ⚡⚡⚡ | Medium | Medium | Complex features |
| `--builder` | ⚡ | ⚡⚡⚡ | Large | High | Tech-specific |
| `--predator` | ⚡⚡ | ⚡⚡⚡⚡ | Large | High | Systematic workflow |
| `--ralph` | ⚡⚡⚡ | ⚡⚡ | Very Large | Very High | Large projects |

## 📝 Examples

### Quick Implementation

```bash
# Like /oneshot
/implement --quick "Add dark mode toggle to settings"
```

### Structured 4-Phase

```bash
# Like /epct
/implement --epct "Build a complete dashboard with charts and filters"
```

### Technical Implementation

```bash
# Like /builder with Next.js
/implement --builder --tech=nextjs "Add JWT authentication"

# Like /builder with Rust
/implement --builder --tech=rust "Build high-performance data processor"
```

### Modular 8-Step

```bash
# Like /predator
/implement --predator "Implement shopping cart with persistence"
```

### Parallel Orchestration

```bash
# Like /ralph
/implement --ralph "Build a full SaaS platform"
```

## 🔧 Configuration

Config file: `.claude/.smite/implement.json`

```json
{
  "defaults": {
    "mode": "builder",
    "tech": "detect"
  },
  "modes": {
    "quick": {
      "timeLimit": "10m",
      "skipPlanning": true
    },
    "epct": {
      "phases": ["explore", "plan", "code", "test"],
      "timePerPhase": "15m"
    },
    "builder": {
      "steps": ["explore", "design", "implement", "test", "verify"],
      "techStacks": ["nextjs", "rust", "python", "go"]
    },
    "predator": {
      "steps": ["init", "analyze", "plan", "execute", "validate", "examine", "resolve", "finish"]
    },
    "ralph": {
      "parallel": true,
      "maxParallel": 3
    }
  }
}
```

## 🚨 Migration Guide

### From oneshot

**Old:**
```bash
/oneshot "Add user profile page"
```

**New:**
```bash
/implement --quick "Add user profile page"
```

### From epct

**Old:**
```bash
/epct "Build a complete dashboard"
```

**New:**
```bash
/implement --epct "Build a complete dashboard"
```

### From builder

**Old:**
```bash
/builder -e -d -i -t -v "Add authentication"
```

**New:**
```bash
/implement --builder --tech=nextjs "Add authentication"
```

### From predator

**Old:**
```bash
/predator "Implement shopping cart"
```

**New:**
```bash
/implement --predator "Implement shopping cart"
```

### From ralf/feature

**Old:**
```bash
/ralph "Build full SaaS platform"
```

**New:**
```bash
/implement --ralph "Build full SaaS platform"
```

## 📚 Documentation

- **[Complete Guide](../../docs/IMPLEMENT_GUIDE.md)** - Complete implementation guide
- **[Mode Documentation](MODES.md)** - Detailed mode documentation
- **[Examples](examples/)** - Sample implementations
- **[Migration Guide](MIGRATION.md)** - Migrating from old agents

## 🤝 Contributing

Found a bug or have a suggestion? Open an issue at:
https://github.com/Pamacea/smite/issues

## 📄 License

MIT License - see LICENSE file for details.

---

**Version:** 1.0.0
**Last Updated:** 2025-02-01
**SMITE Version:** 3.1.0
**Author:** Pamacea
