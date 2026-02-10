# SMITE Core API Reference

## Overview

SMITE Core provides shared infrastructure for all SMITE plugins, including validation schemas, templates, platform detection, and parallel execution utilities.

**Version:** 1.6.5
**Last Updated:** 2026-02-10

---

## Modules

### Templates

Location: `infrastructure/templates/`

Standard markdown templates for command definitions.

#### Available Templates

- `command-header.md` - Standard frontmatter with variables
- `warnings.md` - Common warning messages
- `metadata.md` - Version/footer templates
- `plan-mode-first.md` - Planning template (OBLIGATORY)

#### Usage

```markdown
<!-- @include ../../core/infrastructure/templates/warnings.md#MANDATORY -->
```

#### Variables (command-header.md)

- `{{DESCRIPTION}}` - Command description
- `{{MODEL}}` - Default model (default: haiku)
- `{{ARGUMENT_HINT}}` - Command arguments
- `{{VERSION}}` - Version number

---

### Validation

Location: `infrastructure/validation/schemas/`

JSON schemas for configuration validation.

#### Available Schemas

- `design-styles.schema.json` - Design style definitions
- `vaults.schema.json` - Vault configurations
- `templates.schema.json` - Note template definitions
- `plugin.schema.json` - Plugin manifests

#### Usage

```json
{
  "$schema": "../core/infrastructure/validation/schemas/plugin.schema.json",
  "id": "my-plugin",
  "version": "1.0.0",
  ...
}
```

---

### Platform Detection

Location: `infrastructure/platform/`

Cross-platform utilities for Windows, macOS, and Linux.

#### Platform Detector

```bash
detect_platform() {
  if uname | grep -qE "(MINGW|MSYS|CYGWIN)"; then
    echo "windows"
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "mac"
  else
    echo "linux"
  fi
}
```

#### Usage

```bash
PLATFORM=$(detect_platform)
case $PLATFORM in
  windows) echo "Running on Windows" ;;
  mac) echo "Running on macOS" ;;
  linux) echo "Running on Linux" ;;
esac
```

---

### Parallel Execution

Location: `infrastructure/parallel/`

Git worktree-based parallel execution infrastructure.

#### Worktree Orchestrator

Creates isolated Git worktrees for parallel agent execution.

**Usage:**
```bash
/implement --scale --parallel=3
/refactor --full --parallel=2
/explore --mode=deep --parallel=4
```

**How it works:**
1. Creates N Git worktrees alongside main repository
2. Assigns each worktree a specific sub-task
3. Agents work in isolation, then merge results
4. Worktrees are cleaned up after completion

**Full documentation:** `infrastructure/parallel/worktree-orchestrator.md`

---

## Dependency Resolution

The core plugin provides dependency management utilities:

**Reference:** `dependency-resolution.md`

- Plugin dependency patterns
- MCP tool availability checks
- Graceful degradation strategies
- Error message templates

---

## Integration

### Used By

- `/studio` - All studio commands
- `/basics` - Essential commands (oneshot, epct, debug, explore)
- `/mobs` - Specialized agents (architect, builder, refactor)
- All future SMITE plugins

### How to Integrate

1. **Reference templates** in command definitions
2. **Use validation schemas** in configuration files
3. **Import platform utilities** for cross-platform support
4. **Leverage parallel execution** for performance

---

## Version

**Core Version:** 1.6.5
**SMITE Version:** 1.6.5
**Last Updated:** 2026-02-10

---

## Repository

https://github.com/Pamacea/smite
