# @smite/implement - Unified Implementation Agent v2.0

> **ONE command, FOUR flags, INFINITE possibilities**

## 🎯 What's New in v2.0

**Simplified from 10+ modes to 4 composable flags:**

| Old Way | New Way |
|---------|---------|
| `/implement --quick` | `/implement --speed` |
| `/implement --epct` | `/implement --scale` |
| `/implement --predator` | `/implement --quality` |
| `/implement --ralph` | `/implement --team` |
| `/implement --builder` | `/implement --scale --tech=*` |

**Key improvements:**
- **4 flags** instead of 10+ modes
- **Auto-detection** for zero-configuration
- **Composable** - combine flags for custom behavior
- **Claude Code Agent Teams** integration

---

## 🚀 Quick Start

```bash
# Auto-detection (smart default)
/implement "fix login button"

# Explicit flags
/implement --speed "quick fix"
/implement --scale "build feature"
/implement --quality "critical system"
/implement --team "large project"

# Combine flags
/implement --speed --team "quick parallel"
/implement --scale --quality "thorough + validated"
/implement --scale --quality --team "maximum power"
```

---

## 🎯 The 4 Flags

### --speed (Fast Mode)

Optimized for velocity with minimal overhead.

**Best for:** Bug fixes, UI tweaks, small features

**Time:** 5-10 minutes

```bash
/implement --speed "fix button alignment"
/implement --fast "add dark mode toggle"
```

### --scale (Thorough Mode)

Comprehensive 4-phase workflow (EPCT).

**Best for:** Complex features, multi-file changes, production code

**Time:** 60-90 minutes

```bash
/implement --scale "build user dashboard"
/implement --thorough "refactor authentication module"
```

### --quality (Quality Mode)

Full workflow with comprehensive quality gates (Predator).

**Best for:** Critical systems, security-sensitive code

**Time:** 60-120 minutes

```bash
/implement --quality "implement payment processing"
/implement --validate "add user permissions"
```

### --team (Team Mode)

Parallel agent orchestration using Claude Code Agent Teams.

**Best for:** Large projects, multi-domain features

**Time:** 2-3x faster than sequential

```bash
/implement --team "build full SaaS platform"
/implement --swarm "create multi-feature system"
```

**Requirements:**
- Claude Code v2.1.32+
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`

---

## 🤖 Auto-Detection

No flags? The system analyzes your task and chooses:

```bash
# Auto-detects --speed
/implement "fix button"

# Auto-detects --scale
/implement "build dashboard with charts"

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

## 📋 Flag Combinations

Flags are **modifiers, not modes** - they combine naturally:

| Command | Behavior |
|---------|----------|
| `/implement --speed` | Quick fix |
| `/implement --scale` | Full EPCT |
| `/implement --quality` | Quality gates |
| `/implement --team` | Parallel agents |
| `/implement --speed --team` | Quick parallel (NEW!) |
| `/implement --scale --quality` | Thorough + validated |
| `/implement --scale --team` | Parallel thorough |
| `/implement --scale --quality --team` | Everything |

---

## 🔧 Tech Stack Support

Works with ANY flag combination:

```bash
/implement --scale --tech=nextjs "..."
/implement --speed --tech=rust "..."
/implement --quality --tech=python --team "..."
```

**Available:** `nextjs`, `rust`, `python`, `go`

---

## 🔄 Migration Guide

### For Users

Old commands still work (with deprecation notice):

| Old Command | New Command |
|-------------|-------------|
| `/oneshot` | `/implement --speed` |
| `/epct` | `/implement --scale` |
| `/predator` | `/implement --quality` |
| `/ralph` | `/implement --scale --team` |
| `/builder --tech=nextjs` | `/implement --scale --tech=nextjs` |

### For Developers

Update your workflows:

```javascript
// Old
await implement({ mode: 'quick', task: 'fix bug' })

// New
await implement({ flags: ['speed'], task: 'fix bug' })

// Composable
await implement({ flags: ['scale', 'quality'], task: 'feature' })
```

---

## 📊 Comparison Table

| Aspect | v1.0 | v2.0 |
|--------|------|------|
| Modes | 10+ | 4 flags |
| Composable | No | Yes |
| Auto-detection | No | Yes |
| Agent Teams | Ralph only | Native integration |
| Learning curve | Steep | Gentle |

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

## 📁 Project Structure

```
plugins/implement/
├── commands/
│   └── implement.md          # Command reference
├── skills/
│   ├── implement/
│   │   └── SKILL.md          # Main skill (v2.0)
│   ├── teams/
│   │   └── SKILL.md          # Agent Teams integration
│   ├── coordinator/
│   │   └── SKILL.md          # Shared state management
│   ├── adversarial/
│   │   └── SKILL.md          # Quality challenge mode
│   └── speed/
│       └── SKILL.md          # Quick workflows
├── config/
│   ├── shared-state-schema.json
│   └── shared-state-template.json
└── README.md
```

---

## 🚨 Breaking Changes

### Renamed Flags

| v1.0 | v2.0 | Status |
|------|------|--------|
| `--quick` | `--speed` | Alias supported |
| `--epct` | `--scale` | Alias supported |
| `--predator` | `--quality` | Alias supported |
| `--ralph` | `--team` | Alias supported |
| `--builder` | `--scale --tech=*` | Alias supported |

### Deprecated Commands

These still work but show deprecation notice:
- `/oneshot`
- `/epct`
- `/predator`
- `/ralph`
- `/builder`

---

## 📚 Documentation

- **[Skill Reference](skills/implement/SKILL.md)** - Complete skill documentation
- **[Teams Integration](skills/teams/SKILL.md)** - Agent Teams guide
- **[Command Reference](commands/implement.md)** - Quick reference

---

## 🤝 Contributing

Found a bug or have a suggestion? Open an issue at:
https://github.com/Pamacea/smite/issues

---

## 📄 License

MIT License - see LICENSE file for details.

---

**Version:** 2.0.0 | **Last Updated:** 2026-02-06 | **SMITE Version:** 4.0.0
