# 🔄 Ralph Plugin Documentation

Multi-agent orchestrator for SMITE with PRD generation and parallel execution.

## Quick Links

- **[Main README](../../../plugins/ralph/README.md)** - Quick start and overview
- **[Commands](#commands)** - All available commands
- **[Skills](#skills)** - Agent skills documentation

## Commands

- **[/loop](../../../plugins/ralph/commands/loop.md)** - Auto-iterating execution
- **[/ralph](../../../plugins/ralph/commands/ralph.md)** - Manual Ralph commands

## Skills

- **[Ralph Skill](../../../plugins/ralph/skills/ralph/SKILL.md)** - Complete skill reference

## Overview

Ralph is the multi-agent orchestrator that:
- Generates PRDs from natural language descriptions
- Executes user stories in parallel batches
- Implements spec-first workflow
- Provides auto-loop functionality for long sessions
- Accumulates PRDs instead of overwriting

## Quick Start

```bash
/ralph "Build a todo app with authentication"
/loop "Build a SaaS platform"
```

See the [main README](../../../plugins/ralph/README.md) for complete documentation.
