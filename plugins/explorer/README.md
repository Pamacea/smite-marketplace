# Explorer

> Codebase exploration, dependency mapping & pattern discovery

## 🎯 Purpose

Analyzes codebase architecture through intelligent search, mapping dependencies, finding patterns, and detecting bugs. Uses toolkit for **75% token savings**.

**Target Audience**: Developers understanding complex codebases

## 🚀 Quick Start

```bash
# Install
/plugin install explorer@smite

# Find function
/explore --task=find-function "authenticateUser"

# Map architecture
/explore --task=map-architecture

# Find patterns
/explore --task=find-patterns
```

## 📖 Usage

### Find Function

```bash
/explore --task=find-function "where is the login logic?"
```

**Output**: Function location, signature, callers, dependencies, tests

### Map Architecture

```bash
/explore --task=map-architecture
```

**Output**: Architecture diagram, layers, modules, data flow, patterns

### Find Dependencies

```bash
/explore --task=find-deps --scope=src/auth
```

**Output**: Dependency graph, circular deps, unused imports, critical paths

### Analyze Impact

```bash
/explore --task=analyze-impacts --file=src/auth/login.ts
```

**Output**: Blast radius, affected tests, docs to update, risk assessment

## 🔧 Configuration

### Required

- **Codebase**: Project to analyze
- **Toolkit**: Mandatory for semantic search

### Optional

- **`--task`**: Task type (find-function, find-component, map-architecture, etc.)
- **`--scope`**: Analysis scope (file, module, full)
- **`--format`**: Output format (markdown, json, diagram)

## 🔗 Integration

- **Requires**: toolkit (semantic search - MANDATORY)
- **Works with**: architect (design analysis), builder (implementation context)
- **Used by**: All agents for codebase understanding

**Workflow**: Explorer → Architect (design) → Builder (implement)

## 📚 Documentation

- **[Architecture Guide](../../docs/plugins/explorer/)** - Complete analysis guide
- **[Decision Tree](../../docs/DECISION_TREE.md)** - Tool selection

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Too many results | Refine search with `--scope` or specific query |
| Function not found | Try broader search or check for aliases/renames |
| Dependencies complex | Use `--format=diagram` for visualization |
| Slow analysis | Use `--scope` to limit analysis area |

## 🎯 8 Workflows

1. **find-function** - Locate functions and implementations
2. **find-component** - Find UI components and relations
3. **find-bug** - Investigate bug patterns
4. **find-deps** - Map dependencies
5. **map-architecture** - Complete architecture analysis
6. **analyze-impacts** - Blast radius analysis
7. **find-improvements** - Identify optimization opportunities
8. **find-patterns** - Design/anti-pattern discovery

---
**Version**: 3.1.0 | **Category**: analysis | **Author**: Pamacea
