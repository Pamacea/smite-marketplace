# 🚀 SMITE - Quick Reference v4.0

## 🎯 I'm here to...

- **Build features**: `/implement` (with 4 composable flags)
- **Fix bugs**: `/implement --speed` or `/refactor --scope=bug`
- **Explore code**: `/explore --mode=semantic` or `/toolkit search`
- **Design architecture**: `/architect`
- **Note taking**: `/note write`

---

## 🛠️ The New 4-Flag System

**ONE command, FOUR composable flags:**

```bash
# Auto-detection (smart default)
/implement "fix button"

# With flags
/implement --speed "quick fix"
/implement --scale "build feature"
/implement --quality "critical system"
/implement --team "large project"

# Combine flags!
/implement --speed --team "quick parallel"
/implement --scale --quality "thorough + validated"
/implement --scale --quality --team "maximum power"
```

### The 4 Flags

| Flag | Effect | When to Use |
|------|--------|-------------|
| `--speed` | Fast, surgical | Quick fixes, small features |
| `--scale` | Comprehensive workflow | Complex features, multi-file |
| `--quality` | Quality gates enabled | Critical code, production |
| `--team` | Parallel agent teams | Large projects, multi-domain |

### Aliases

- `--speed` = `--fast`, `--quick`
- `--scale` = `--thorough`, `--epct`
- `--quality` = `--validate`, `--predator`
- `--team` = `--swarm`, `--ralph`

---

## 📋 Quick Commands

| Command | Purpose | When to use |
|---------|---------|-------------|
| `/implement "..."` | Auto-detected implementation | Smart default |
| `/implement --speed` | Quick fix | Small tasks |
| `/implement --scale` | Thorough implementation | Complex features |
| `/implement --quality` | Quality-gated implementation | Critical code |
| `/implement --team` | Parallel agents | Large projects |
| `/architect` | Architecture design | Design systems |
| `/explore --mode=semantic` | Semantic code search | ALWAYS before exploring |
| `/refactor --scope=bug` | Bug fixing | Any bug/issue |
| `/note write inbox` | Quick note | Capture ideas |

---

## 🔍 Mandatory Workflow

**CRITICAL: ALWAYS use semantic search before ANY code exploration.**

1. **ALWAYS** use `/toolkit search "query"` first (75% token savings, 2x precision)
2. **NEVER** use Grep/Glob first (wastes tokens)
3. **Spec-first**: Architect → Builder → Verify

**Why?** Traditional search: 180k tokens. Toolkit: 45k tokens. **75% savings.**

---

## 🔄 Legacy Commands (Still Work)

| Old Command | New Command |
|-------------|-------------|
| `/oneshot` | `/implement --speed` |
| `/epct` | `/implement --scale` |
| `/predator` | `/implement --quality` |
| `/ralph` | `/implement --scale --team` |
| `/builder --tech=nextjs` | `/implement --scale --tech=nextjs` |
| `/implement --quick` | `/implement --speed` |
| `/implement --epct` | `/implement --scale` |
| `/implement --predator` | `/implement --quality` |
| `/implement --ralph` | `/implement --scale --team` |
| `/implement --builder` | `/implement --scale --tech=*` |

---

## 🤖 Auto-Detection

**No flags?** The system analyzes your task and chooses:

| Signal | Detected As |
|--------|-------------|
| Short, simple task | `--speed` |
| "feature/build/create" | `--scale` |
| "SaaS/platform/system" | `--team` |
| "critical/security/payment" | `--quality` |
| "refactor/cleanup" | `--scale --quality` |

---

## 📚 Documentation

- **All docs**: [docs/INDEX.md](docs/INDEX.md)
- **Plugins**: [plugins/README.md](plugins/README.md)
- **Agents**: [plugins/agents/README.md](plugins/agents/README.md)
- **Implement**: [plugins/implement/README.md](plugins/implement/README.md)

---

## 🎯 Key Principles

- **Type-Safe**: Zod schemas, strict TypeScript
- **Clean Code**: DRY, immutable, pure functions
- **Barrel Exports**: One `index.ts` per folder
- **Zero-Debt**: Fix issues as you create them

---

## 📂 Project Standards

```
src/
├── validation/    # Zod schemas
├── components/ui/ # Shadcn atoms
├── core/          # Business logic
└── **/index.ts    # Barrels required
```

---

## 🎯 Decision Guide

```
Need to implement?
├─ Simple/quick? → /implement --speed
├─ Complex/multi-file? → /implement --scale
├─ Quality-critical? → /implement --quality
├─ Large/multi-domain? → /implement --team
├─ Not sure? → /implement (auto-detect)
└─ Combine flags for custom behavior!
```

---

## 🆕 What's New in v4.0

- **Simplified**: 4 flags instead of 10+ modes
- **Auto-detection**: Zero-configuration for beginners
- **Composable**: Combine flags for custom behavior
- **Agent Teams**: Native Claude Code integration
- **Better UX**: Clearer intent, easier to learn

---

**Version**: 4.0.0 | **Last updated**: 2026-02-06
