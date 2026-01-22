# 🚀 SMITE - Quick Reference

## 🎯 I'm here to...

- **Build features**: `/build` or `/ralph`
- **Fix bugs**: `/debug`
- **Explore code**: `/explore` or `/toolkit search`
- **Quality check**: `/finalize`

## 🔍 Mandatory Workflow

**CRITICAL: ALWAYS use semantic search before ANY code exploration.**

1. **ALWAYS** use `/toolkit search "query"` first (75% token savings, 2x precision)
2. **NEVER** use Grep/Glob first (wastes tokens)
3. **Spec-first**: Architect → Builder → Finalize

**Why?** Traditional search: 180k tokens. Toolkit: 45k tokens. **75% savings.**

## 🛠️ Quick Commands

| Command | Purpose | When to use |
|---------|---------|-------------|
| `/ralph "prompt"` | Multi-agent orchestration | Complex features (2-3x speedup) |
| `/build --feature=name` | Implement feature | Spec-driven development |
| `/debug` | Fix bugs systematically | Any bug/issue |
| `/finalize` | QA + documentation | Before committing |
| `/toolkit search "query"` | Semantic code search | ALWAYS before exploring |

## 📚 Documentation

- **All docs**: [docs/INDEX.md](docs/INDEX.md)
- **Plugins**: [plugins/README.md](plugins/README.md)
- **Ralph guide**: [docs/RALPH_GUIDE.md](docs/RALPH_GUIDE.md) (coming soon)
- **Spec-first**: [docs/SPEC_FIRST.md](docs/SPEC_FIRST.md) (coming soon)

## 🛡️ Quality Gate

**ALL code changes are automatically validated.**

- **Complexity**: Max 10 cyclomatic, 15 cognitive
- **Security**: SQL injection, XSS, weak crypto, secrets
- **Semantics**: Type consistency, naming conventions

**Config**: `.claude/.smite/quality.json`

**Usage**:
```bash
/quality-check --staged    # Only staged files
/quality-check --changed   # Only modified files
```

## 🎯 Key Principles

- **Type-Safe**: Zod schemas, strict TypeScript
- **Clean Code**: DRY, immutable, pure functions
- **Barrel Exports**: One `index.ts` per folder
- **Zero-Debt**: Fix issues as you create them

## 📂 Project Standards

```
src/
├── validation/    # Zod schemas
├── components/ui/ # Shadcn atoms
├── core/          # Business logic
└── **/index.ts    # Barrels required
```

---
**Version**: 3.1.0 | **Docs**: [docs/INDEX.md](docs/INDEX.md) | **Last updated**: 2025-01-22
