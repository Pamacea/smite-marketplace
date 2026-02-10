# Migration Guide: Core v1.5 → v1.6

## Breaking Changes

### Directory Restructure

The core plugin has been reorganized with a new `infrastructure/` directory structure.

**Old Structure:**
```
plugins/core/
├── templates/
├── validation/
├── platform/
├── parallel/
├── adversarial/     (DELETED)
├── learning/        (DELETED)
├── teaching/        (DELETED)
└── data/            (DELETED)
```

**New Structure:**
```
plugins/core/
├── infrastructure/
│   ├── templates/
│   ├── validation/
│   ├── platform/
│   ├── parallel/
│   └── docs/
│       ├── MIGRATION_1.5_to_1.6.md
│       ├── API.md
│       ├── ARCHITECTURE.md
│       └── INTEGRATION.md
├── src/
├── examples/
└── scripts/
```

---

## Update Required

### 1. Template Include Paths

**Before:**
```markdown
<!-- @include ../../core/templates/warnings.md#MANDATORY -->
```

**After:**
```markdown
<!-- @include ../../core/infrastructure/templates/warnings.md#MANDATORY -->
```

### 2. Validation Schema Paths

**Before:**
```json
{
  "$schema": "../core/validation/schemas/plugin.schema.json"
}
```

**After:**
```json
{
  "$schema": "../core/infrastructure/validation/schemas/plugin.schema.json"
}
```

### 3. Platform Detection Imports

**Before:**
```javascript
import { detectPlatform } from '@/core/platform/platform-detector'
```

**After:**
```javascript
import { detectPlatform } from '@/core/infrastructure/platform/platform-detector'
```

---

## Removed Modules

The following modules have been **removed** without replacement:

- `adversarial/` - No longer needed (use SMITE's built-in safeguards)
- `learning/` - No longer needed (use standard training patterns)
- `teaching/` - No longer needed (use documentation)
- `data/` - No longer needed (use environment-specific configs)

---

## New Documentation

All documentation has been consolidated in `infrastructure/docs/`:

- **MIGRATION_1.5_to_1.6.md** - This file
- **API.md** - Core API reference (moved from `docs/`)
- **ARCHITECTURE.md** - Architecture overview (moved from `docs/`)
- **INTEGRATION.md** - Integration guide (moved from `docs/`)

---

## Version Updates

**Core version:** `1.5.1` → `1.6.5`
**SMITE version:** `1.5.1` → `1.6.5`

Update `plugin-manifest.json`:
```json
{
  "version": "1.6.5",
  "smite": "1.6.5"
}
```

---

## Migration Checklist

- [ ] Update template include paths
- [ ] Update validation schema references
- [ ] Update platform detection imports
- [ ] Remove references to deleted modules
- [ ] Update documentation links
- [ ] Test all commands that depend on core

---

## Rollback

If you need to rollback, revert to the pre-migration commit:
```bash
git revert <commit-hash>
```

---

**Last Updated:** 2026-02-10
**Core Version:** 1.6.5
