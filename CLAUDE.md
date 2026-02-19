# 🚀 SMITE - Quick Reference v1.6.6

## 🎯 I'm here to...

- **Build features**: `/studio build` (with 4 composable flags)
- **Fix bugs**: `/studio build --speed` or `/studio refactor --scope=bug`
- **Discover agents**: `/agents discover --tech=nextjs`
- **Refactor code**: `/studio refactor`

---

## 🛠️ The New 4-Flag System

**ONE command, FOUR composable flags:**

```bash
# Auto-detection (smart default)
/studio build "fix button"

# With flags
/studio build --speed "quick fix"
/studio build --scale "build feature"
/studio build --quality "critical system"
/studio build --team "large project"

# Combine flags!
/studio build --speed --team "quick parallel"
/studio build --scale --quality "thorough + validated"
/studio build --scale --quality --team "maximum power"
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
| `/studio build "..."` | Auto-detected implementation | Smart default |
| `/studio build --speed` | Quick fix | Small tasks |
| `/studio build --scale` | Thorough implementation | Complex features |
| `/studio build --quality` | Quality-gated implementation | Critical code |
| `/studio build --team` | Parallel agents | Large projects |
| `/studio build --tech=nextjs` | Tech-specific implementation | Next.js projects |
| `/agents discover --tech=nextjs` | Find specialized agents | Agent discovery |
| `/agents list` | List all available agents | Agent overview |
| `/studio refactor --scope=bug` | Bug fixing | Any bug/issue |
| `/rename` | Session renaming | Productivity |

---

## 🔍 Agents Plugin Usage

**Discover specialized agents for your tech stack:**

```bash
# Find agents for specific technology
/agents discover --tech=nextjs
/agents discover --tech=react
/agents discover --tech=python
/agents discover --tech=rust

# List all available agents
/agents list

# Use discovered agents in your build
/studio build --tech=nextjs --scale "Build auth feature"
```

### Agent Discovery Examples

```bash
# Next.js specialist agent
/agents discover --tech=nextjs
# → Finds: nextjs-architect, nextjs-builder, nextjs-tester

# Full-stack with team
/studio build --team --tech=nextjs "Build SaaS platform"
# → Automatically assigns specialist agents
```

---

## 🔄 Legacy Commands (Still Work)

| Old Command | New Command |
|-------------|-------------|
| `/oneshot` | `/studio build --speed` |
| `/epct` | `/studio build --scale` |
| `/predator` | `/studio build --quality` |
| `/ralph` | `/studio build --scale --team` |
| `/builder --tech=nextjs` | `/studio build --scale --tech=nextjs` |
| `/studio build --quick` | `/studio build --speed` |
| `/studio build --epct` | `/studio build --scale` |
| `/studio build --predator` | `/studio build --quality` |
| `/studio build --ralph` | `/studio build --scale --team` |
| `/studio build --builder` | `/studio build --scale --tech=*` |

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
- **Studio**: [plugins/studio/README.md](plugins/studio/README.md)
- **Essentials**: [plugins/essentials/README.md](plugins/essentials/README.md)
- **Migration**: [plugins/MIGRATION_v3_to_v4.md](plugins/MIGRATION_v3_to_v4.md)

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
├─ Simple/quick? → /studio build --speed
├─ Complex/multi-file? → /studio build --scale
├─ Quality-critical? → /studio build --quality
├─ Large/multi-domain? → /studio build --team
├─ Not sure? → /studio build (auto-detect)
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

**Version**: 2.0.0 | **Last updated**: 2026-02-19
