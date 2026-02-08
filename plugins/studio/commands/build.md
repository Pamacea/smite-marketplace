# /studio build - Unified Implementation Command

> **ONE command to implement features** - 4 composable flags with auto-detection

## Quick Start

```bash
# Auto-detection (recommended for beginners)
/studio build "fix login button"

# With flags
/studio build --speed "quick fix"
/studio build --scale "build feature"
/studio build --quality "critical system"
/studio build --team "large project"

# Compose flags
/studio build --speed --team "quick parallel"
/studio build --scale --quality "thorough + validated"
/studio build --scale --quality --team "maximum power"
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
/studio build "fix button"
/studio build --speed "fix button"

# Auto-detects --scale
/studio build "build user dashboard with charts"

# Auto-detects --team
/studio build "create full SaaS platform"

# Auto-detects --quality
/studio build "implement payment system"
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
| `/studio build "..."` | Auto-detected | Variable |
| `/studio build --speed "..."` | Quick fix | 5-10 min |
| `/studio build --scale "..."` | Full EPCT | 60-90 min |
| `/studio build --quality "..."` | Quality gates | 60-120 min |
| `/studio build --team "..."` | Parallel agents | 2-3x faster |
| `/studio build --scale --team "..."` | Parallel thorough | Variable |
| `/studio build --speed --team "..."` | Quick parallel (NEW!) | Fast×2 |
| `/studio build --scale --quality --team "..."` | Everything | Maximum |

---

## 🔧 Tech Stack

Works with ANY flag combination:

```bash
/studio build --scale --tech=nextjs "..."
/studio build --speed --tech=rust "..."
/studio build --quality --tech=python --team "..."
```

Available: `nextjs`, `rust`, `python`, `go`

---

## 🔄 Legacy Migration

Old commands still work (with deprecation notice):

| Old | New |
|-----|-----|
| `/oneshot` | `/studio build --speed` |
| `/epct` | `/studio build --scale` |
| `/predator` | `/studio build --quality` |
| `/ralph` | `/studio build --scale --team` |
| `/builder` | `/studio build --scale --tech=*` |
| `/studio build --quick` | `/studio build --speed` |
| `/studio build --epct` | `/studio build --scale` |
| `/studio build --predator` | `/studio build --quality` |
| `/studio build --ralph` | `/studio build --scale --team` |
| `/studio build --builder` | `/studio build --scale --tech=*` |

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

**Version:** 2.0.0 | **Last updated:** 2026-02-06
