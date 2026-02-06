# 🔥 SMITE v4.0.0

**Multi-agent orchestration with 4-flag composable system**

---

## 🚀 Quick Start

```bash
# Step 1: Add marketplace
/plugin marketplace add Pamacea/smite

# Step 2: Install core (REQUIRED)
/plugin install core@smite

# Step 3: Install unified agents
/plugin install refactor@smite
/plugin install explore@smite
/plugin install implement@smite

# Step 4: Install supporting plugins (optional)
/plugin install agents@smite      # Architect, Builder
/plugin install basics@smite      # Commit, Note, etc.
/plugin install shell@smite       # Shell aliases
/plugin install auto-rename@smite # Session renaming

# Step 5: Use it!
/implement "fix login button"           # Auto-detects
/implement --speed "quick fix"         # Explicit
/implement --scale "build feature"     # Thorough
/implement --team "large project"      # Parallel
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

## 🆕 What's New in v4.0.0

### The 4-Flag Revolution

**Simplified from 10+ modes to 4 composable flags:**

| Old (v3.5) | New (v4.0) | Benefit |
|-----------|------------|---------|
| `/implement --quick` | `/implement --speed` | Clearer intent |
| `/implement --epct` | `/implement --scale` | Clearer intent |
| `/implement --predator` | `/implement --quality` | Clearer intent |
| `/implement --ralph` | `/implement --team` | Matches Claude Code |
| `/implement --builder` | `/implement --scale --tech=*` | Consistent |

### Key Improvements

- **4 composable flags** instead of 10+ mutually exclusive modes
- **Auto-detection** for zero-configuration usage
- **Claude Code Agent Teams** native integration
- **Better UX**: Flags can be combined for custom behavior
- **Backward compatible**: All old commands still work

### New Combinations

```bash
# NEW: Quick parallel implementation
/implement --speed --team "quick parallel fix"

# NEW: Thorough + validated
/implement --scale --quality "production feature"

# NEW: Maximum power
/implement --scale --quality --team "critical SaaS system"
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
/implement --speed "fix button"

# Multiple flags - composed behavior
/implement --speed --team "quick parallel"
/implement --scale --quality "thorough + validated"
/implement --scale --quality --team "maximum power"
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
/implement "fix login button"

# Auto-detects as --scale
/implement "build user dashboard with authentication"

# Auto-detects as --team
/implement "create full SaaS platform with billing"

# Auto-detects as --quality
/implement "implement payment processing system"
```

---

## 🛠️ Unified Agents

### 1. /implement - Unified Implementation

**NEW in v4.0: 4-flag system**

```bash
# Auto-detection (smart default)
/implement "fix button"

# Explicit flags
/implement --speed "quick fix"
/implement --scale "build feature"
/implement --quality "critical system"
/implement --team "large project"

# Tech stack (works with any flags)
/implement --scale --tech=nextjs "..."
```

**Best for:** All implementation tasks

---

### 2. /refactor - Unified Refactoring

```bash
/refactor --quick "Improve code"
/refactor --full "Refactor entire module"
/refactor --scope=bug "Fix issue"
/refactor --analyze "Analyze problems"
```

**Best for:** Code improvement, bug fixes, quality assurance

---

### 3. /explore - Unified Exploration

```bash
/explore --mode=deep "How does payment work?"
/explore --mode=semantic "Find authentication code"
/explore --mode=quick "Search components"
```

**Best for:** Understanding codebase, finding files, code search

**75% token savings** with native grepai integration

---

## 📋 Quick Commands

| Command | Purpose | When to use |
|---------|---------|-------------|
| `/implement "..."` | Auto-detected implementation | Smart default |
| `/implement --speed` | Quick fix | Small tasks |
| `/implement --scale` | Thorough implementation | Complex features |
| `/implement --quality` | Quality-gated implementation | Critical code |
| `/implement --team` | Parallel agents | Large projects |
| `/refactor --quick` | Quick refactoring | Code improvements |
| `/explore --mode=semantic` | Semantic code search | ALWAYS before exploring |
| `/architect` | Architecture design | Design systems |
| `/note write inbox` | Quick note | Capture ideas |

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
| `/implement --quick` | `/implement --speed` |
| `/implement --epct` | `/implement --scale` |
| `/implement --predator` | `/implement --quality` |
| `/implement --ralph` | `/implement --scale --team` |
| `/implement --builder` | `/implement --scale --tech=*` |

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
SMITE v4.0.0 (SIMPLIFIÉ)
├───────────────────────────────────────────────┐
│ AGENTS UNIFIÉS (point d'entrée unique)     │
├───────────────────────────────────────────────┤
│                                             │
│  1. /implement (4-FLAG SYSTEM)              │
│     - Auto-détection intelligente           │
│     - Flags composables: speed, scale,      │
│                       quality, team         │
│     - Agent Teams natif Claude Code         │
│                                             │
│  2. /refactor                                 │
│     - Refactorisation unifiée               │
│                                             │
│  3. /explore                                  │
│     - Exploration + grepai native (75%)      │
│                                             │
├───────────────────────────────────────────────┤
│ PLUGINS SUPPORT (spécialités)            │
├───────────────────────────────────────────────┤
│                                             │
│  1. agents/ - Architect, Builder               │
│  2. basics/ - Commit, Note, etc.              │
│  3. shell/ - Alias shell                       │
│  4. auto-rename/ - Renommage sessions         │
│                                             │
└───────────────────────────────────────────────┘
```

---

## 📁 Structure

```
smite/
├── .claude-plugin/           # Marketplace manifest
├── plugins/
│   ├── core/                # REQUIRED - shared utilities
│   ├── implement/           # NEW v4.0 - 4-flag system
│   │   ├── skills/
│   │   │   ├── implement/   # Main skill
│   │   │   ├── teams/       # Agent Teams integration
│   │   │   ├── speed/       # Quick workflows
│   │   │   ├── scale/       # Thorough workflows
│   │   │   └── quality/     # Quality gates
│   ├── refactor/            # Unified refactoring
│   ├── explore/             # Unified exploration
│   ├── agents/              # Specialized agents
│   ├── basics/              # Essential commands
│   ├── shell/               # Shell aliases
│   └── auto-rename/         # Session renaming
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

- **[Implement Guide](plugins/implement/README.md)** - Complete 4-flag documentation
- **[Teams Integration](plugins/implement/skills/teams/SKILL.md)** - Agent Teams guide
- **[Migration Guide](MIGRATION_V4.0.0.md)** - Complete migration guide

---

## 🔧 Installation

### Minimal Installation

```bash
/plugin marketplace add Pamacea/smite
/plugin install core@smite
/plugin install refactor@smite
/plugin install explore@smite
/plugin install implement@smite
```

### Full Installation

```bash
/plugin marketplace add Pamacea/smite
/plugin install core@smite
/plugin install refactor@smite
/plugin install explore@smite
/plugin install implement@smite
/plugin install agents@smite
/plugin install basics@smite
/plugin install shell@smite
/plugin install auto-rename@smite
```

---

## 📝 License

MIT License - see LICENSE file for details.

---

**SMITE v4.0.0** • **4-Flag System** • **Auto-Detection** • **Agent Teams** • **Simplified**

**License:** MIT • **Repository:** [github.com/Pamacea/smite](https://github.com/Pamacea/smite)
