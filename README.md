# 🔥 SMITE v3.1

**Zero-debt engineering agents with multi-agent parallel orchestration (2-3x faster)**

---

## ⚡ Quick Start

```bash
# Install
/plugin marketplace add Pamacea/smite
/plugin install ralph@smite

# Execute
/ralph "Build a todo app with authentication"
```

**CRITICAL: Always use semantic search before exploring code** (75% token savings)
```bash
/toolkit search "authentication flow"    # 1st choice (75% savings)
mgrep "authentication"                   # 2nd choice (semantic search)
```

**Why?** Traditional: 180k tokens → Toolkit: 45k tokens. **See:** [DECISION_TREE.md](docs/DECISION_TREE.md)

---

## 🚀 What's New in v3.1

### ✨ **Refactored Documentation**
- **50% shorter READMEs** (300 → 150 lines)
- **50% shorter SKILLs** (200 → 100 lines)
- **Standardized templates** across all plugins
- **Official Anthropic schema** compliance

### 🔧 **Marketplace Improvements**
- **$schema validation** for marketplace.json
- **Uniform versioning** (all plugins 3.1.0)
- **Categories** (orchestration, analysis, development, quality, productivity)
- **Tags + keywords** for discoverability

### 📚 **New Guides**
- [RALPH_GUIDE.md](docs/RALPH_GUIDE.md) - Complete Ralph usage
- [SPEC_FIRST.md](docs/SPEC_FIRST.md) - Spec-first workflow

---

## 🤖 Core Plugins (13)

### Orchestration
**[ralph](plugins/ralph)** - Multi-agent orchestrator with parallel execution (2-3x speedup)
```bash
/ralph "Build a REST API"
/loop "Full SaaS platform"  # Auto-iterating
```

### Analysis
**[toolkit](plugins/toolkit)** - Token optimization + semantic search (75% savings)
```bash
/toolkit search "query" --mode=hybrid
/toolkit explore --task=find-function
/toolkit graph --impact
```

**[explorer](plugins/explorer)** - Codebase exploration & dependency mapping
```bash
/explore --task=map-architecture
/explore --task=find-patterns
```

### Development
**[architect](plugins/architect)** - Design & strategy (init + strategy + design + brainstorm)
```bash
/design --mode=init "Setup Next.js"
/design --mode=strategy "Product roadmap"
```

**[builder](plugins/builder)** - Implementation (Next.js, Rust, Python)
```bash
/build "Implement authentication"
/build --tech=nextjs "Build dashboard"
```

**[smite](plugins/smite)** - Essential commands (oneshot, epct, apex, debug, commit, pr)
```bash
/oneshot "Add user login"    # Ultra-fast
/debug "Fix memory leak"
/commit
```

### Quality
**[finalize](plugins/finalize)** - QA + documentation (test + review + lint + docs)
```bash
/finalize                    # Full QA + Docs
/finalize --mode=qa
/finalize --mode=docs
```

**[quality-gate](plugins/quality-gate)** - Automated code review (complexity + security + semantics)
```bash
/quality-check --staged     # Only staged files
/quality-check --changed    # Only modified files
```

**[simplifier](plugins/simplifier)** - Code simplification & refactoring
```bash
/simplifier                  # Recent changes
/simplifier --scope=all
```

### Productivity
**[statusline](plugins/statusline)** - Auto-configuring statusline (tokens, git, session)
**[obsidian-note-agent](plugins/obsidian-note-agent)** - AI-powered note writing
**[docs-editor-mcp](plugins/docs-editor-mcp)** - Automatic documentation maintenance
**[shell-aliases](plugins/shell-aliases)** - Shell shortcuts (cc, ccc)
**[auto-rename-session](plugins/auto-rename-session)** - Intelligent session renaming

---

## 📊 Ralph Parallel Execution

```json
{
  "project": "TodoApp",
  "userStories": [
    { "id": "US-001", "title": "Setup Next.js", "dependencies": [] },
    { "id": "US-002", "title": "Build UI", "dependencies": ["US-001"] },
    { "id": "US-003", "title": "Add auth", "dependencies": ["US-001"] }
  ]
}
```

**Execution:** `Batch 1: [US-001] → Batch 2: [US-002, US-003] ← PARALLEL!`

**Speedup:**
- Small projects: 20-30% faster
- Medium projects: 40-50% faster
- Complex projects: 50-60% faster

---

## 📁 Structure

```
smite/
├── .claude-plugin/           # Marketplace manifest
│   └── marketplace.json      # 14 plugins catalog
├── .claude/
│   └── .smite/              # State (PRD, spec, quality config)
├── plugins/                  # 13 plugins
│   ├── ralph/               # Orchestrator
│   ├── toolkit/             # Token optimization
│   ├── architect/           # Design
│   ├── builder/             # Implementation
│   ├── finalize/            # QA + docs
│   ├── explorer/            # Analysis
│   ├── simplifier/          # Refactor
│   ├── quality-gate/        # Validation
│   ├── smite/               # Commands
│   ├── statusline/          # Status UI
│   ├── obsidian-note-agent/ # Notes
│   ├── docs-editor-mcp/     # Docs sync
│   ├── shell-aliases/       # Shortcuts
│   └── auto-rename-session/ # Naming
├── docs/                    # Documentation hub
└── README.md                # This file
```

---

## 📚 Documentation

- **[All docs](docs/INDEX.md)** - Complete documentation index
- **[Plugins](plugins/README.md)** - 13 plugins catalog
- **[Ralph Guide](docs/RALPH_GUIDE.md)** - Complete Ralph usage
- **[Spec-First](docs/SPEC_FIRST.md)** - Spec-driven workflow
- **[Decision Tree](docs/DECISION_TREE.md)** - Tool selection guide

---

## 🔄 Updating

```bash
/plugin marketplace update smite
/plugin update --all
```

---

**SMITE v3.1** • **14 plugins** • **Official Anthropic schema** • **Refactored documentation** • **Zero-debt engineering**

**License:** MIT • **Repository:** [github.com/Pamacea/smite](https://github.com/Pamacea/smite)
