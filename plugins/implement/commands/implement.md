# /implement - Unified Implementation Command v2.0

> **ONE command to rule them all** - 4 composable flags with auto-detection

## Quick Start

```bash
# Auto-detection (recommended for beginners)
/implement "fix login button"

# With flags
/implement --speed "quick fix"
/implement --scale "build feature"
/implement --quality "critical system"
/implement --team "large project"

# Compose flags
/implement --speed --team "quick parallel"
/implement --scale --quality "thorough + validated"
/implement --scale --quality --team "maximum power"
```

---

## 🎯 4-Flag System

| Flag | Effect | When to Use |
|------|--------|-------------|
| `--speed` | Fast, surgical | Quick fixes, small features |
| `--scale` | Comprehensive workflow | Complex features, multi-file |
| `--quality` | Quality gates enabled | Critical code, production |
| `--team` | Parallel agent teams | Large projects, multi-domain |

### Aliases

| Flag | Also Known As |
|------|---------------|
| `--speed` | `--fast`, `--quick` |
| `--scale` | `--thorough`, `--epct` |
| `--quality` | `--validate`, `--predator` |
| `--team` | `--swarm`, `--ralph` |

---

## 🤖 Auto-Detection

No flags? The system analyzes your task and chooses:

```bash
# These are equivalent:
/implement "fix button"
/implement --speed "fix button"

# Auto-detects --scale
/implement "build user dashboard with charts"

# Auto-detects --team
/implement "create full SaaS platform"

# Auto-detects --quality
/implement "implement payment system"
```

### Detection Rules

| Signal | Detected As |
|--------|-------------|
| Short, simple task | `--speed` |
| "feature/build/create" | `--scale` |
| "SaaS/platform/system" | `--team` |
| "critical/security/payment" | `--quality` |
| "refactor/cleanup" | `--scale --quality` |

---

## 📋 Common Patterns

| Command | Behavior | Time |
|---------|----------|------|
| `/implement "..."` | Auto-detected | Variable |
| `/implement --speed "..."` | Quick fix | 5-10 min |
| `/implement --scale "..."` | Full EPCT | 60-90 min |
| `/implement --quality "..."` | Quality gates | 60-120 min |
| `/implement --team "..."` | Parallel agents | 2-3x faster |
| `/implement --scale --team "..."` | Parallel thorough | Variable |
| `/implement --speed --team "..."` | Quick parallel (NEW!) | Fast×2 |
| `/implement --scale --quality --team "..."` | Everything | Maximum |

---

## 🔧 Tech Stack

Works with ANY flag combination:

```bash
/implement --scale --tech=nextjs "..."
/implement --speed --tech=rust "..."
/implement --quality --tech=python --team "..."
```

Available: `nextjs`, `rust`, `python`, `go`

---

## 🔄 Legacy Migration

Old commands still work (with deprecation notice):

| Old | New |
|-----|-----|
| `/oneshot` | `/implement --speed` |
| `/epct` | `/implement --scale` |
| `/predator` | `/implement --quality` |
| `/ralph` | `/implement --scale --team` |
| `/builder` | `/implement --scale --tech=*` |
| `/implement --quick` | `/implement --speed` |
| `/implement --epct` | `/implement --scale` |
| `/implement --predator` | `/implement --quality` |
| `/implement --ralph` | `/implement --scale --team` |
| `/implement --builder` | `/implement --scale --tech=*` |

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

**Version:** 2.0.0 | **Last updated:** 2026-02-06
