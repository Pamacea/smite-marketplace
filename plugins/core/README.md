# SMITE Core v1.6.5

Shared infrastructure for all SMITE plugins.

`★ Insight ─────────────────────────────────────`
**Why core exists:**
1. **DRY principle** - Common patterns defined once
2. **Consistency** - All plugins follow same standards  
3. **Type safety** - JSON schemas validate configs
4. **Simplicity** - Only essential infrastructure
`─────────────────────────────────────────────────`

---

## What's New in v1.6.5

### Restructured Organization

**Before (v1.5.1):**
```
plugins/core/
├── templates/
├── validation/
├── platform/
├── parallel/
├── adversarial/    ← Removed
├── learning/       ← Removed
├── teaching/       ← Removed
└── data/           ← Removed
```

**After (v1.6.5):**
```
plugins/core/
├── infrastructure/
│   ├── templates/      # Markdown templates
│   ├── validation/     # JSON schemas
│   ├── platform/       # Cross-platform
│   ├── parallel/       # Git worktrees
│   └── docs/           # Documentation
└── README.md
```

### Changes

- ✅ **Moved to infrastructure/** - All core utilities organized
- ✅ **Removed modes** - adversarial, learning, teaching, data moved/deprecated
- ✅ **Added docs/** - Centralized documentation
- ✅ **Version bump** - 1.5.1 → 1.6.5

---

## Directory Structure

```
infrastructure/
├── templates/      # Reusable markdown templates
│   ├── command-header.md
│   ├── warnings.md
│   ├── metadata.md
│   └── plan-mode-first.md
├── validation/     # JSON schemas for config validation
│   └── schemas/
│       ├── design-styles.schema.json
│       ├── vaults.schema.json
│       ├── templates.schema.json
│       └── plugin.schema.json
├── platform/       # Cross-platform utilities
│   └── platform-detector.md
├── parallel/       # Parallel execution infrastructure
│   ├── worktree-orchestrator.md
│   └── parallel-task-template.md
└── docs/           # Core documentation
    ├── API.md
    ├── ARCHITECTURE.md
    ├── INTEGRATION.md
    └── MIGRATION_1.5_to_1.6.md
```

---

## Usage

### Using Templates

```markdown
<!-- @include ../../core/infrastructure/templates/warnings.md#MANDATORY -->
```

### Validation Schemas

```json
{
  "$schema": "../core/infrastructure/validation/schemas/plugin.schema.json"
}
```

### Platform Detection

See `infrastructure/platform/platform-detector.md`

### Parallel Execution

See `infrastructure/parallel/worktree-orchestrator.md`

---

## Migration Guide

See `infrastructure/docs/MIGRATION_1.5_to_1.6.md` for detailed migration instructions.

---

## What's NOT in Core Anymore

The following have been **removed** from core v1.6.5:

- ❌ **adversarial/** - Moved to studio/quality/
- ❌ **learning/** - Moved to studio/learning/
- ❌ **teaching/** - Moved to studio/teaching/
- ❌ **data/** - Deprecated

If you need these features, see the **studio** or **agents** plugins.

---

## Version

**Version**: 1.6.5  
**SMITE Version**: 1.6.5  
**Last Updated**: 2026-02-10

---

## Integration

**Used by:**
- studio (v1.6.5+)
- agents (v1.0.0+)
- essentials (v1.6.5+)

All plugins depend on core for shared infrastructure.

---

## License

MIT
