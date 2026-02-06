---
name: scale
description: Thorough implementation mode - comprehensive EPCT workflow
version: 1.0.0
---

# Scale Skill - Thorough Implementation

## Mission

Execute comprehensive, structured implementation for complex features with full planning and validation.

---

## 🎯 When to Use

**Perfect for:**
- Multi-file features (3-10 files)
- New components with business logic
- API endpoints with validation
- Database schema changes
- Features requiring tests
- Production-ready code

**NOT for:**
- Quick fixes (use `--speed`)
- Simple typos (use `--speed`)
- Exploratory work (use `/explore`)

---

## 📋 Workflow: EPCT (4 Phases)

### Phase 1: EXPLORE (15-20 minutes)

```markdown
1. Deep codebase exploration
   - /explore --mode=deep "topic"
   - grepai search "patterns"
   - /toolkit search "related features"

2. Multi-source research (parallel agents)
   - Agent 1: Find similar patterns
   - Agent 2: Find type definitions
   - Agent 3: Check latest docs

3. Document existing patterns
   - File structure
   - Naming conventions
   - Import patterns
   - Barrel exports

4. Output: exploration.md
```

### Phase 2: PLAN (20-30 minutes)

```markdown
1. Detailed implementation plan
   - File structure
   - Types and interfaces
   - Data flow
   - Edge cases

2. Testing strategy
   - Unit tests
   - Integration tests
   - E2E tests (if needed)

3. Dependencies identification
   - What needs to be created first
   - What can be done in parallel

4. Output: plan.md
```

### Phase 3: CODE (30-60 minutes)

```markdown
1. Launch tech-specific subagent if --tech specified
   - impl-nextjs for Next.js
   - impl-rust for Rust
   - impl-python for Python
   - impl-go for Go

2. Follow plan systematically
   - Create files in order
   - Follow best practices
   - Add barrel exports
   - Use existing patterns

3. Self-documenting code
   - Clear names > comments
   - Type annotations
   - Zod validation schemas

4. Output: implementation/
```

### Phase 4: TEST (15-30 minutes)

```markdown
1. Run full test suite
   - Unit tests for new code
   - Integration tests
   - E2E tests if applicable
   - Coverage measurement (80%+ target)

2. Fix all failures
   - Analyze each failure
   - Fix root cause
   - Re-run until passing

3. Output: test-results.md
```

---

## 📊 Example

```bash
# Usage
/implement --scale "build user dashboard with authentication"

# Aliases
/implement --thorough "..."
/implement --epct "..."
```

### What Happens

```
You: /implement --scale "build user dashboard"

Phase 1: EXPLORE (parallel, 3 agents, 15 min)
  Agent 1: Find dashboard patterns
  Agent 2: Find auth components
  Agent 3: Find routing patterns
  → Output: exploration.md

Phase 2: PLAN (20 min)
  → Output: plan.md with file structure, types, tests

Phase 3: CODE (45 min, 1 tech subagent)
  → impl-nextjs builds following plan
  → Output: implementation/

Phase 4: TEST (20 min)
  → Unit + integration + coverage
  → Output: test-results.md

Done! (90-120 minutes total)
```

---

## 🔧 Tech Stack Integration

Works with `--tech` flag for specialized implementation:

```bash
/implement --scale --tech=nextjs "..."
  → React 19, RSC, Prisma, Server Actions

/implement --scale --tech=rust "..."
  → Ownership, async/await, zero-copy

/implement --scale --tech=python "..."
  → Type hints, FastAPI, SQLAlchemy 2.0

/implement --scale --tech=go "..."
  → Goroutines, interfaces, stdlib
```

---

## ✅ Success Criteria

- ✅ Exploration documented
- ✅ Plan created and followed
- ✅ Implementation complete
- ✅ All tests passing
- ✅ Coverage 80%+
- ✅ Lint clean
- ✅ Typecheck passes
- ✅ Barrel exports present
- ✅ Zero tech debt

---

## 📁 Output Files

```
.claude/.smite/implement-{timestamp}/
├── exploration.md      # Phase 1 output
├── plan.md             # Phase 2 output
├── implementation/
│   ├── src/
│   │   └── [new files]
│   └── [modified files]
└── test-results.md     # Phase 4 output
```

---

## 🔄 Related Flags

| Flag | When to use instead |
|------|---------------------|
| `--speed` | Quick fixes, small changes |
| `--quality` | Critical systems, need validation |
| `--team` | Large projects, parallel needed |
| `--scale --quality` | Thorough + quality gates |
| `--scale --team` | Thorough + parallel |

---

## 💡 Tips

1. **Invest in planning** - Good plan saves implementation time
2. **Follow patterns** - Consistency with existing code
3. **Test as you go** - Don't leave testing for the end
4. **Barrel exports** - One `index.ts` per folder
5. **Zod validation** - Parse, don't validate

---

## ⏱️ Time Budget

| Phase | Budget | Action |
|-------|--------|--------|
| EXPLORE | 15-20 min | Deep research, patterns |
| PLAN | 20-30 min | Detailed plan |
| CODE | 30-60 min | Implementation |
| TEST | 15-30 min | Full suite |
| **Total** | **80-140 min** | |

---

## 🚨 Anti-Patterns

### AVOID:

```markdown
❌ Skipping planning phase
   → Use --speed instead

❌ Not writing tests
   → Use --speed instead

❌ Ignoring existing patterns
   → Maintain consistency

❌ Over-engineering
   → Keep it simple

❌ Adding "nice to have" features
   → Stay in scope
```

---

*Scale Skill v1.0.0 - Thorough implementation with EPCT workflow*
