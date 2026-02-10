# SMITE Core Architecture

## Overview

SMITE Core is the foundational infrastructure layer for all SMITE plugins. It provides shared utilities, validation schemas, templates, and cross-platform capabilities.

**Version:** 1.6.5
**Last Updated:** 2026-02-10

---

## Design Principles

### 1. DRY (Don't Repeat Yourself)

Common patterns defined once, referenced everywhere. Templates and schemas eliminate duplication across plugins.

### 2. Type Safety

JSON schemas validate configurations at load time, catching errors before runtime.

### 3. Cross-Platform

Platform detection and abstraction ensures consistent behavior across Windows, macOS, and Linux.

### 4. Parallel-First

Git worktree-based parallel execution enables scalable multi-agent workflows.

---

## Directory Structure

```
plugins/core/
├── infrastructure/          # Core infrastructure
│   ├── templates/          # Reusable markdown templates
│   │   ├── command-header.md
│   │   ├── warnings.md
│   │   ├── metadata.md
│   │   └── plan-mode-first.md
│   ├── validation/         # JSON schemas
│   │   └── schemas/
│   │       ├── design-styles.schema.json
│   │       ├── vaults.schema.json
│   │       ├── templates.schema.json
│   │       └── plugin.schema.json
│   ├── platform/           # Cross-platform utilities
│   │   └── platform-detector.md
│   ├── parallel/           # Parallel execution
│   │   ├── worktree-orchestrator.md
│   │   └── parallel-task-template.md
│   └── docs/               # Documentation
│       ├── API.md
│       ├── ARCHITECTURE.md
│       ├── INTEGRATION.md
│       └── MIGRATION_1.5_to_1.6.md
├── src/                    # Source code
│   ├── config/             # Configuration management
│   ├── hooks/              # Hook registry
│   ├── platform/           # Platform detection
│   ├── template/           # Template engine
│   ├── utils/              # Utilities
│   └── validation/         # Validation utilities
├── examples/               # Example plugins
│   ├── simple-plugin/
│   └── advanced-plugin/
├── scripts/                # Build and utility scripts
├── manifest/               # Plugin manifests
├── plugin-manifest.json    # Core manifest
└── README.md
```

---

## Core Components

### Template Engine

Provides reusable markdown templates with variable substitution.

**Key Features:**
- Frontmatter generation
- Warning messages
- Metadata footers
- Plan mode templates (OBLIGATORY)

**Pattern:**
```markdown
<!-- @include ../../core/infrastructure/templates/warnings.md#MANDATORY -->
```

---

### Validation Layer

JSON schemas validate all SMITE configuration files.

**Schema Types:**
- Plugin manifests (`plugin.schema.json`)
- Design styles (`design-styles.schema.json`)
- Vault configs (`vaults.schema.json`)
- Templates (`templates.schema.json`)

**Validation Flow:**
1. Load configuration file
2. Parse `$schema` reference
3. Validate against schema
4. Return errors or continue

---

### Platform Abstraction

Detects and abstracts platform-specific differences.

**Supported Platforms:**
- Windows (MINGW/MSYS/CYGWIN)
- macOS (darwin)
- Linux (default)

**Pattern:**
```bash
PLATFORM=$(detect_platform)
case $PLATFORM in
  windows) ... ;;
  mac) ... ;;
  linux) ... ;;
esac
```

---

### Parallel Execution

Git worktree-based orchestration for multi-agent workflows.

**Benefits:**
- Isolated workspaces
- No Git conflicts
- Scalable to N agents
- Automatic cleanup

**Workflow:**
1. Create N worktrees
2. Assign tasks to agents
3. Execute in parallel
4. Merge results
5. Cleanup worktrees

---

## Integration Patterns

### Plugin Development

1. **Reference templates** for consistent structure
2. **Validate configs** with core schemas
3. **Use platform detection** for cross-platform support
4. **Leverage parallel execution** for performance

### Dependency Management

Plugins declare dependencies in `plugin-manifest.json`:

```json
{
  "depends_on": ["core"],
  "mcp_tools": ["filesystem", "brave-search"],
  "hooks": {
    "pre_install": "scripts/setup.sh",
    "post_install": "scripts/verify.sh"
  }
}
```

---

## Versioning

**Semantic Versioning:** Major.Minor.Patch

- **Major:** Breaking changes
- **Minor:** New features, backward compatible
- **Patch:** Bug fixes, documentation

**Current Version:** 1.6.5

---

## Migration

See `MIGRATION_1.5_to_1.6.md` for migration guide from v1.5.

---

## Contributing

When contributing to SMITE Core:

1. **Add templates** to `infrastructure/templates/`
2. **Create schemas** in `infrastructure/validation/schemas/`
3. **Document changes** in `infrastructure/docs/`
4. **Update version** in `plugin-manifest.json`
5. **Test integration** with dependent plugins

---

## License

MIT

---

## Repository

https://github.com/Pamacea/smite
