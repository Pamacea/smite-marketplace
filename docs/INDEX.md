# 📚 SMITE Documentation Hub

Complete documentation for the SMITE v3.0 multi-agent orchestration system.

## 🚀 Quick Start

- **[Main README](../README.md)** - Project overview and installation
- **[Agents Reference](../AGENTS.md)** - Complete agent catalog
- **[Decision Tree](DECISION_TREE.md)** - Choose the right tool for the job

## 📖 Core Guides

### Multi-Agent Orchestration
- **[Ralph Guide](RALPH_GUIDE.md)** - Auto-PRD generation and parallel execution
- **[Spec-First Workflow](SPEC_FIRST.md)** - Think before coding methodology
- **[Web Search Protocol](WEB_SEARCH_FORCE_GUIDE.md)** - Mandatory knowledge verification

### Plugins
- **[Quality Gate](plugins/QUALITY_GATE.md)** - Automatic code review and validation
- **[Docs Editor MCP](plugins/DOCS_EDITOR.md)** - Auto-generated documentation

## 🏗️ Architecture

- **[Code Critiquer Architecture](architecture/architecture-code-critiquer.md)** - Quality Gate system design
- **[Docs Editor Architecture](architecture/architecture-docs-editor-mcp.md)** - MCP server architecture
- **[Marketplace Integration](architecture/us-011-marketplace-integration-summary.md)** - Plugin packaging

## 🛠️ Plugin Documentation

### Core Plugins
- **[Ralph](plugins/ralph/INDEX.md)** → [README](../plugins/ralph/README.md) - Multi-agent orchestrator
- **[Explorer](plugins/explorer/INDEX.md)** → [commands](../plugins/explorer/commands/explore.md) - Codebase analysis
- **[Architect](plugins/architect/INDEX.md)** → [commands](../plugins/architect/commands/design.md) - Design and strategy
- **[Builder](plugins/builder/INDEX.md)** → [commands](../plugins/builder/commands/build.md) - Implementation
- **[Finalize](plugins/finalize/INDEX.md)** → [commands](../plugins/finalize/commands/finalize.md) - QA and documentation
- **[Simplifier](plugins/simplifier/INDEX.md)** → [commands](../plugins/simplifier/commands/simplify.md) - Code refactoring

### Specialized Plugins
- **[Toolkit](plugins/toolkit/INDEX.md)** → [README](../plugins/toolkit/README.md) - Semantic search and analysis
- **[Statusline](plugins/statusline/INDEX.md)** → [README](../plugins/statusline/README.md) - Auto-configuring statusline
- **[Obsidian Note Agent](plugins/obsidian-note-agent/INDEX.md)** → [README](../plugins/obsidian-note-agent/README.md) - Note generation
- **[Shell Aliases](plugins/shell-aliases/INDEX.md)** → [README](../plugins/shell-aliases/README.md) - Shell shortcuts
- **[Auto-Rename Session](plugins/auto-rename-session/INDEX.md)** → [README](../plugins/auto-rename-session/README.md) - Session renaming

### Quality & Documentation
- **[Quality Gate](plugins/quality-gate/README.md)** - Complete plugin documentation
- **[Docs Editor MCP](plugins/docs-editor-mcp/README.md)** - Complete MCP documentation

## 📁 Documentation Structure

```
docs/
├── plugins/              # Plugin-specific documentation
│   ├── ralph/           # Multi-agent orchestrator
│   ├── explorer/        # Codebase analysis
│   ├── architect/       # Design and strategy
│   ├── builder/         # Implementation
│   ├── finalize/        # QA and documentation
│   ├── simplifier/      # Code refactoring
│   ├── smite/           # Essential commands
│   ├── toolkit/         # Semantic search and analysis
│   ├── statusline/      # Auto-configuring statusline
│   ├── obsidian-note-agent/  # Note generation
│   ├── shell-aliases/   # Shell shortcuts
│   ├── auto-rename-session/  # Session renaming
│   ├── quality-gate/    # Quality Gate complete docs
│   ├── docs-editor-mcp/ # Docs Editor MCP docs
│   ├── QUALITY_GATE.md  # Quality Gate quick reference
│   └── DOCS_EDITOR.md   # Docs Editor quick reference
├── architecture/         # System architecture documents
│   ├── architecture-code-critiquer.md
│   ├── architecture-docs-editor-mcp.md
│   └── us-011-marketplace-integration-summary.md
├── guides/              # In-depth guides (future)
├── INDEX.md             # This file
├── DECISION_TREE.md     # Tool selection guide
├── RALPH_GUIDE.md       # Ralph orchestrator guide
└── SPEC_FIRST.md        # Spec-first workflow
```

## 🎯 Common Tasks

### Start a New Project
1. Read [Quick Start](../README.md#-quick-start---lire-avant-tout)
2. Use `/architect --mode=init` to design the system
3. Use `/ralph` to generate PRD and execute in parallel

### Analyze Existing Code
1. Try `/toolkit search "query"` for semantic search (75% token savings)
2. Use `/explorer --task=map-architecture` for codebase mapping
3. Use `/toolkit graph --impact` for dependency analysis

### Fix Bugs
1. Use `/toolkit detect --patterns="security"` for bug detection
2. Use `/debug "bug description"` for systematic debugging
3. Use `/simplifier` to reduce complexity

### Improve Code Quality
1. Install quality gate: `/plugin install quality-gate@smite`
2. Configure: `.smite/quality.json`
3. Run: `/smite:quality-check`

## 📝 Conventions

- **Semantic Search First**: Always use `/toolkit search` or `mgrep` before grep/glob
- **Spec-First**: Generate specs before implementing features
- **Type Safety**: All code must pass `npm run typecheck`
- **Clean Architecture**: Follow patterns in `.claude/rules/engineering.md`

## 🔗 External Resources

- [mgrep.dev](https://www.mgrep.dev/) - Semantic search CLI
- [MCP Specification](https://modelcontextprotocol.io/specification/2025-06-18/)
- [Claude Code Documentation](https://github.com/anthropics/claude-code)

---

**SMITE v3.0** - Zero-debt engineering via multi-agent orchestration
