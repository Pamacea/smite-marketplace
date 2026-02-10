# SMITE Core Integration Guide

## Overview

This guide explains how to integrate SMITE Core into your plugins.

**Version:** 1.6.5
**Last Updated:** 2026-02-10

---

## Prerequisites

- SMITE v1.6.5 or higher
- Core plugin installed
- Git (for parallel execution)

---

## Step 1: Declare Dependency

In your plugin's `plugin-manifest.json`:

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "depends_on": ["core"],
  "smite": "1.6.5"
}
```

---

## Step 2: Reference Templates

### Command Headers

```markdown
<!-- @include ../../core/infrastructure/templates/command-header.md -->
```

### Warnings

```markdown
<!-- @include ../../core/infrastructure/templates/warnings.md#MANDATORY -->
```

### Plan Mode (OBLIGATORY)

```markdown
<!-- @include ../../core/infrastructure/templates/plan-mode-first.md -->
```

---

## Step 3: Use Validation Schemas

### Plugin Manifest

```json
{
  "$schema": "../core/infrastructure/validation/schemas/plugin.schema.json",
  "id": "my-plugin",
  "version": "1.0.0"
}
```

### Custom Configs

Create your own schema referencing core types:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "pluginConfig": {
      "$ref": "../core/infrastructure/validation/schemas/plugin.schema.json"
    }
  }
}
```

---

## Step 4: Platform Detection

### Shell Scripts

```bash
# Source platform detector
source "$(dirname "$0")/../core/infrastructure/platform/platform-detector.sh"

PLATFORM=$(detect_platform)
case $PLATFORM in
  windows)
    # Windows-specific code
    ;;
  mac)
    # macOS-specific code
    ;;
  linux)
    # Linux-specific code
    ;;
esac
```

### Node.js

```javascript
import { detectPlatform } from '@/core/infrastructure/platform/platform-detector'

const platform = detectPlatform()
if (platform === 'windows') {
  // Windows-specific code
}
```

---

## Step 5: Parallel Execution

### Enable Parallel Mode

```bash
/studio build --scale --parallel=3
```

### Worktree Template

```markdown
<!-- @include ../../core/infrastructure/parallel/parallel-task-template.md -->
```

### Custom Parallel Workflows

```bash
# Create worktrees
git worktree add ../project-worktree-1 main
git worktree add ../project-worktree-2 main

# Execute in parallel
(cd ../project-worktree-1 && agent1 --task "feature-a") &
(cd ../project-worktree-2 && agent2 --task "feature-b") &

# Wait for completion
wait

# Cleanup
git worktree remove ../project-worktree-1
git worktree remove ../project-worktree-2
```

---

## Step 6: Error Handling

### Standardized Errors

Use core error templates:

```markdown
<!-- @include ../../core/infrastructure/templates/warnings.md#ERROR_HANDLING -->
```

### MCP Tool Fallback

```javascript
import { checkMCPTools } from '@/core/src/utils/mcp-checker'

const tools = checkMCPTools(['filesystem', 'brave-search'])
if (!tools.filesystem) {
  // Fallback behavior
}
```

---

## Examples

### Simple Command

```markdown
<!-- @include ../../core/infrastructure/templates/command-header.md -->

# My Command

Description here...

<!-- @include ../../core/infrastructure/templates/warnings.md#MANDATORY -->

## Implementation

...

<!-- @include ../../core/infrastructure/templates/metadata.md -->
```

### Plugin with Validation

```json
{
  "$schema": "../core/infrastructure/validation/schemas/plugin.schema.json",
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "smite": "1.6.5",
  "depends_on": ["core"],
  "provides": ["my-feature"],
  "config": {
    "enabled": true,
    "options": {}
  }
}
```

### Cross-Platform Script

```bash
#!/usr/bin/env bash

# Load core utilities
source "$(dirname "$0")/../core/infrastructure/platform/platform-detector.sh"

PLATFORM=$(detect_platform)

case $PLATFORM in
  windows)
    echo "Running on Windows"
    # Use Windows paths
    SCRIPT_PATH="$(cygpath -w "$SCRIPT_PATH")"
    ;;
  mac|linux)
    echo "Running on Unix-like system"
    # Use Unix paths
    ;;
esac
```

---

## Troubleshooting

### Template Not Found

**Error:** `Cannot find template '../../core/infrastructure/templates/...'`

**Solution:** Check relative path from your file to core plugin.

### Schema Validation Failed

**Error:** `Configuration does not match schema`

**Solution:** Run `smite validate --plugin my-plugin` to see detailed errors.

### Platform Detection Fails

**Error:** `Unable to detect platform`

**Solution:** Ensure Git is installed and `uname` command is available.

### Parallel Execution Hangs

**Error:** Agents not completing

**Solution:** Check for Git conflicts and ensure worktrees are properly cleaned up.

---

## Best Practices

1. **Always declare core dependency** in plugin-manifest.json
2. **Use templates** for consistent structure
3. **Validate all configs** with schemas
4. **Test on all platforms** (Windows, macOS, Linux)
5. **Clean up worktrees** after parallel execution
6. **Document custom schemas** clearly
7. **Handle MCP tool unavailability** gracefully

---

## API Reference

See `API.md` for detailed API documentation.

---

## Architecture

See `ARCHITECTURE.md` for architecture overview.

---

## Migration

See `MIGRATION_1.5_to_1.6.md` if upgrading from v1.5.

---

## Support

- **Issues:** https://github.com/Pamacea/smite/issues
- **Discussions:** https://github.com/Pamacea/smite/discussions

---

**Last Updated:** 2026-02-10
**Core Version:** 1.6.5
