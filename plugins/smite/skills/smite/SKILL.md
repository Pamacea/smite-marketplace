---
name: smite
description: SMITE essential commands - oneshot, debug, commit, explore, memory, and more
version: 3.1.0
---

# SMITE Commands Skill

## Mission

Provide rapid development commands for quick iteration, debugging, and code management workflows.

## Core Workflow

1. **Input**: Command invocation by user or agent
2. **Process**:
   - Execute specialized workflow (oneshot/debug/explore/commit/pr/spec/memory/explain/apex/epct/tasks/cleanup)
   - Apply methodology (Explore→Code→Test, APEX, E-P-C-T, etc.)
   - Handle git operations and documentation
3. **Output**: Completed task with commits/PRs as needed

## Key Principles

- **Quick implementation**: oneshot for well-defined tasks
- **Systematic debugging**: debug for error diagnosis
- **Spec-first development**: spec for complex features
- **Automatic documentation**: memory for knowledge capture
- **Clean git history**: commit/pr with descriptive messages

## Commands

### Quick Implementation
- **`/oneshot`**: Ultra-fast feature implementation (Explore → Code → Test)
- **`/debug`**: Systematic bug debugging with deep analysis
- **`/explore`**: Quick codebase exploration

### Code Management
- **`/commit`**: Quick commit and push with clean messages
- **`/pr`**: Create and push pull request with auto-generated description

### Planning & Documentation
- **`/spec`**: Spec-first workflow (Analyze → Plan → Execute)
- **`/memory`**: Create and update CLAUDE.md files
- **`/explain`**: Analyze and explain architectural patterns

### Advanced Workflows
- **`/apex`**: APEX methodology (Analyze → Plan → Execute → eXamine)
- **`/epct`**: E-P-C-T workflow (Explore → Plan → Code → Test)
- **`/tasks`**: Execute GitHub issues with full EPCT and PR creation

### Utilities
- **`/cleanup`**: Optimize memory bank files
- **`/smite`**: Install all SMITE commands

## Integration

- **Works with**: architect (design), builder (implementation), explorer (analysis), finalize (QA)
- **Typical workflow**: explore → architect → oneshot/apex → commit → finalize → pr
- **Agent usage**: Agents can call these commands for specialized workflows

## Configuration

- **Command selection**: Choose based on task complexity and type
- **Workflow preference**: oneshot (fast), spec (planned), apex (systematic)
- **Git operations**: Automatic staging, clean messages, optional push

## Error Handling

- **Wrong command chosen**: Suggest appropriate alternative
- **Task too complex**: Switch from oneshot to spec/apex
- **Git conflicts**: Report conflict, require manual resolution
- **Documentation missing**: Suggest running /memory

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
