# 🔥 SMITE v1.5.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/Pamacea/smite)](https://github.com/Pamacea/smite/releases/latest)
[![CI](https://github.com/Pamacea/smite/actions/workflows/ci.yml/badge.svg)](https://github.com/Pamacea/smite/actions)



**Multi-agent orchestration with 4-flag composable system**

---

## 🚀 Quick Start

```bash
# Step 1: Add marketplace
/plugin marketplace add Pamacea/smite

# Step 2: Install core (REQUIRED)
/plugin install core

# Step 3: Install unified agents
/plugin install refactor
/plugin install explore
/plugin install implement

# Step 4: Install supporting plugins (optional)
/plugin install agents      # Architect, Builder
/plugin install basics      # Commit, Note, etc.
/plugin install shell       # Shell aliases
/plugin install auto-rename # Session renaming

# Step 5: Use it!
/studio build "fix login button"           # Auto-detects
/studio build --speed "quick fix"         # Explicit
/studio build --scale "build feature"     # Thorough
/studio build --team "large project"      # Parallel
```

---

## Usage

Add Swarm Mode & tmux to your settings.json !

```
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "tmux"
} 
```

## 🆕 What's New in v1.5.0

### The 4-Flag Revolution

**Simplified from 10+ modes to 4 composable flags:**

| Old (v3.5) | New (v4.0) | Benefit |
|-----------|------------|---------|
| `/studio build --quick` | `/studio build --speed` | Clearer intent |
| `/studio build --epct` | `/studio build --scale` | Clearer intent |
| `/studio build --predator` | `/studio build --quality` | Clearer intent |
| `/studio build --ralph` | `/studio build --team` | Matches Claude Code |
| `/studio build --builder` | `/studio build --scale --tech=*` | Consistent |

### Key Improvements

- **4 composable flags** instead of 10+ mutually exclusive modes
- **Auto-detection** for zero-configuration usage
- **Claude Code Agent Teams** native integration
- **Better UX**: Flags can be combined for custom behavior
- **Backward compatible**: All old commands still work

### New Combinations

```bash
# NEW: Quick parallel implementation
/studio build --speed --team "quick parallel fix"

# NEW: Thorough + validated
/studio build --scale --quality "production feature"

# NEW: Maximum power
/studio build --scale --quality --team "critical SaaS system"
```

---

## 🎯 The 4-Flag System

### The Flags

| Flag | Aliases | Effect | When to Use |
|------|---------|--------|-------------|
| `--speed` | `--fast`, `--quick` | Fast, surgical | Quick fixes, small features |
| `--scale` | `--thorough`, `--epct` | Comprehensive workflow | Complex features, multi-file |
| `--quality` | `--validate`, `--predator` | Quality gates enabled | Critical code, production |
| `--team` | `--swarm`, `--ralph` | Parallel agent teams | Large projects, multi-domain |

### Philosophy

**Flags are MODIFIERS, not modes.** They combine naturally:

```bash
# Single flag - simple behavior
/studio build --speed "fix button"

# Multiple flags - composed behavior
/studio build --speed --team "quick parallel"
/studio build --scale --quality "thorough + validated"
/studio build --scale --quality --team "maximum power"
```

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

### Examples

```bash
# Auto-detects as --speed
/studio build "fix login button"

# Auto-detects as --scale
/studio build "build user dashboard with authentication"

# Auto-detects as --team
/studio build "create full SaaS platform with billing"

# Auto-detects as --quality
/studio build "implement payment processing system"
```

---

## 🛠️ Unified Agents

### 1. /studio build - Unified Implementation

**NEW in v4.0: 4-flag system**

```bash
# Auto-detection (smart default)
/studio build "fix button"

# Explicit flags
/studio build --speed "quick fix"
/studio build --scale "build feature"
/studio build --quality "critical system"
/studio build --team "large project"

# Tech stack (works with any flags)
/studio build --scale --tech=nextjs "..."
```

**Best for:** All implementation tasks

---

### 2. /studio refactor - Unified Refactoring

```bash
/studio refactor --quick "Improve code"
/studio refactor --full "Refactor entire module"
/studio refactor --scope=bug "Fix issue"
/studio refactor --analyze "Analyze problems"
```

**Best for:** Code improvement, bug fixes, quality assurance

---

### 3. /studio explore - Unified Exploration

```bash
/studio explore --mode=deep "How does payment work?"
/studio explore --mode=semantic "Find authentication code"
/studio explore --mode=quick "Search components"
```

**Best for:** Understanding codebase, finding files, code search

**75% token savings** with native grepai integration

---

## 📋 Quick Commands

| Command | Purpose | When to use |
|---------|---------|-------------|
| `/studio build "..."` | Auto-detected implementation | Smart default |
| `/studio build --speed` | Quick fix | Small tasks |
| `/studio build --scale` | Thorough implementation | Complex features |
| `/studio build --quality` | Quality-gated implementation | Critical code |
| `/studio build --team` | Parallel agents | Large projects |
| `/studio refactor --quick` | Quick refactoring | Code improvements |
| `/studio explore --mode=semantic` | Semantic code search | ALWAYS before exploring |
| `/studio architect` | Architecture design | Design systems |
| `/note write inbox` | Quick note | Capture ideas |

---

## 🔄 Migration Guide

### For Users

Old commands still work (with deprecation notice):

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

### For Developers

```javascript
// Old
await implement({ mode: 'quick', task: 'fix bug' })

// New
await implement({ flags: ['speed'], task: 'fix bug' })

// Composable
await implement({ flags: ['scale', 'quality'], task: 'feature' })
```

---

## 📊 Comparison: v3.5 vs v4.0

| Aspect | v3.5 | v4.0 | Improvement |
|--------|------|------|-------------|
| Implementation modes | 5 modes | 4 flags | **Simpler** |
| Composable | No | Yes | **More flexible** |
| Auto-detection | No | Yes | **Zero-config** |
| Agent Teams | Ralph only | Native integration | **Better** |
| Learning curve | Steep | Gentle | **Easier** |
| Total combinations | 5 | 15+ (4²-1) | **More options** |

---

## 🏗️ Architecture

```
SMITE v1.5.0 (UNIFIED 3-PLUGIN ARCHITECTURE)
├───────────────────────────────────────────────┐
│ STUDIO UNIFIED AGENTS (point d'entrée)     │
├───────────────────────────────────────────────┤
│                                             │
│  1. /studio build (4-FLAG SYSTEM)              │
│     - Auto-détection intelligente           │
│     - Flags composables: speed, scale,      │
│                       quality, team         │
│     - Agent Teams natif Claude Code         │
│                                             │
│  2. /studio refactor                                 │
│     - Refactorisation unifiée               │
│                                             │
│  3. /studio explore                                  │
│     - Exploration + grepai native (75%)      │
│                                             │
├───────────────────────────────────────────────┤
│ CORE INFRASTRUCTURE (requis)              │
├───────────────────────────────────────────────┤
│  - Templates, validation schemas              │
│  - Platform detection & utilities             │
│  - Parallel execution infrastructure          │
├───────────────────────────────────────────────┤
│ ESSENTIALS (optionnel)                      │
├───────────────────────────────────────────────┤
│  - Auto-rename (session naming)               │
│  - Shell aliases (cc, ccc)                    │
│                                             │
└───────────────────────────────────────────────┘
```

---

## 📁 Structure

```
smite/
├── .claude-plugin/           # Marketplace manifest (v1.5.0)
├── plugins/
│   ├── core/                # REQUIRED - shared utilities & infrastructure
│   ├── studio/              # UNIFIED - dev workflow (explore, architect, build, refactor)
│   │   ├── skills/
│   │   │   ├── build/       # 4-flag implementation system
│   │   │   │   ├── teams/   # Agent Teams integration
│   │   │   │   ├── speed/   # Quick workflows
│   │   │   │   ├── scale/   # Thorough workflows
│   │   │   │   └── quality/ # Quality gates
│   │   │   ├── explore/     # Semantic code search
│   │   │   ├── architect/   # Architecture design
│   │   │   └── refactor/    # Systematic refactoring
│   └── essentials/          # Productivity tools (auto-rename, shell aliases)
├── docs/                    # Documentation
└── README.md                # This file
```

---

## 🚨 Breaking Changes

### Renamed Flags

| v3.5 | v4.0 | Status |
|------|------|--------|
| `--quick` | `--speed` | Alias supported |
| `--epct` | `--scale` | Alias supported |
| `--predator` | `--quality` | Alias supported |
| `--ralph` | `--team` | Alias supported |
| `--builder` | `--scale --tech=*` | Alias supported |

**Note**: All old flags still work but show a deprecation notice.

---

## 📚 Documentation

- **[Implement Guide](plugins/studio build/README.md)** - Complete 4-flag documentation
- **[Teams Integration](plugins/studio build/skills/teams/SKILL.md)** - Agent Teams guide
- **[Migration Guide](MIGRATION_V4.0.0.md)** - Complete migration guide

---

## 🔧 Installation

### Minimal Installation

```bash
/plugin marketplace add Pamacea/smite
/plugin install core
/plugin install refactor
/plugin install explore
/plugin install implement
```

### Full Installation

```bash
/plugin marketplace add Pamacea/smite
/plugin install core
/plugin install refactor
/plugin install explore
/plugin install implement
/plugin install agents
/plugin install basics
/plugin install shell
/plugin install auto-rename
```

---

## 📝 License

MIT License - see LICENSE file for details.

---

**SMITE v1.5.0** • **4-Flag System** • **Auto-Detection** • **Unified Architecture** • **Production Ready**

**License:** MIT • **Repository:** [github.com/Pamacea/smite](https://github.com/Pamacea/smite)
