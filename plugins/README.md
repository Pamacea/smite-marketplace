# SMITE Plugin Marketplace v4.0

Official plugin marketplace for the Smite Code Quality & Documentation System.

## Overview

The Smite Plugin Marketplace v4.0 introduces a **simplified architecture** with **3 curated plugins** (down from 7), providing a clearer, more focused development experience.

**Key changes in v4.0:**
- **Consolidation**: 7 plugins → 3 plugins
- **Simpler commands**: Namespaced under `/studio` and `/rename`
- **Better integration**: All development tools in one plugin
- **Ecosystem maturity**: Production-ready with comprehensive migration path

## Quick Start

```bash
# 1. Install core infrastructure (required)
/plugin install core

# 2. Install development workflow (recommended)
/plugin install studio

# 3. (Optional) Install productivity tools
/plugin install essentials
```

## Available Plugins

### Infrastructure

#### [/core](./core/README.md)

Shared utilities, templates, and validation schemas.

**Version:** 3.6.0 | **Required:** Yes

**Features:**
- Markdown templates for commands
- JSON validation schemas
- Cross-platform utilities
- Platform detection
- Parallel execution infrastructure

---

### Development

#### [/studio](./studio/README.md)

Complete development workflow - explore, architect, build, refactor.

**Version:** 1.0.0 | **Required:** Yes

**Commands:**
- `/studio explore` - Code exploration with 4 modes (deep, quick, semantic, impact)
- `/studio architect` - Architecture and design system creation
- `/studio build` - Feature implementation with 4 flags (speed, scale, quality, team)
- `/studio refactor` - Systematic code refactoring

**Features:**
- **Exploration**: Native semantic search via grepai (75% token savings)
- **Architecture**: Creative workflow with MCP tools, 5 UI style variations
- **Implementation**: Auto-detection, 4 composable flags, multi-tech stack support
- **Refactoring**: Systematic validation, bug fixing, code quality improvement

**Tech Stack Support:**
- Next.js 15 (TypeScript, Tailwind CSS, Zustand, TanStack Query)
- Rust (Actix/Axum, SQLx)
- Python (FastAPI, SQLAlchemy)
- Go (Gin/Echo, GORM)

---

### Productivity

#### [/essentials](./essentials/README.md)

Productivity utilities - auto-rename, shell aliases.

**Version:** 1.0.0 | **Required:** No

**Commands:**
- `/rename [custom-name]` - Automatic session renaming
- `/install-aliases` - Cross-platform shell aliases (cc/ccc)

**Features:**
- **Auto-rename**: Smart session naming based on context
- **Shell aliases**: Global shortcuts for Claude Code (cc, ccc)
- **Cross-platform**: PowerShell, Bash, Zsh, cmd.exe support

---

## Migration from v3.x

**Upgrading from SMITE v3.x?** See the [Migration Guide](./MIGRATION_v3_to_v4.md).

### Quick Migration Summary

| v3.x Plugin | v4.0 Plugin |
|-------------|-------------|
| `/core` | `/core` (no changes) |
| `/agents` | `/studio` |
| `/implement` | `/studio` |
| `/explore` | `/studio` |
| `/refactor` | `/studio` |
| `/shell` | `/essentials` |
| `/auto-rename` | `/essentials` |

### Command Mapping

**Old → New:**
- `/implement` → `/studio build`
- `/architect` → `/studio architect`
- `/builder` → `/studio build`
- `/explore` → `/studio explore`
- `/refactor` → `/studio refactor`
- `/rename` → `/rename` (no change)
- `/install-aliases` → `/install-aliases` (no change)

---

## Plugin Discovery

### By Category

**Infrastructure:**
- /core - Shared utilities

**Development:**
- /studio - Complete workflow

**Productivity:**
- /essentials - Utilities

### By Use Case

**Starting a new project:**
```bash
/studio architect --mode=init "Build a SaaS platform"
/studio architect --mode=design "Create design system"
/studio build --scale "Implement core features"
```

**Working on existing code:**
```bash
/studio explore --mode=deep "How does authentication work?"
/studio explore --mode=impact src/features/auth/
/studio build --scale "Add OAuth2 provider"
/studio refactor --quick
```

**Quick fixes:**
```bash
/studio build --speed "Fix button bug"
/studio refactor --scope=bug "TypeError in auth"
```

**Large projects:**
```bash
/studio build --team "Build full SaaS platform"
```

---

## Installation

### Standard Installation

```bash
# Core (required)
/plugin install core

# Studio (recommended)
/plugin install studio

# Essentials (optional)
/plugin install essentials
```

### Post-Installation

**Studio:**
- Configuration: `.claude/.smite/studio.json`
- No post-install steps required

**Essentials:**
```bash
# Install shell aliases (optional)
/install-aliases
```

---

## Configuration

All plugins use JSON configuration files in `.claude/.smite/`:

| Plugin | Config File |
|--------|-------------|
| studio | `.claude/.smite/studio.json` |
| essentials | `.claude/.smite/essentials.json` |

**Example studio.json:**
```json
{
  "explore": {
    "defaults": {
      "mode": "deep"
    }
  },
  "build": {
    "defaults": {
      "flag": "scale"
    }
  },
  "refactor": {
    "defaults": {
      "scope": "recent"
    }
  }
}
```

---

## Version Compatibility

| Plugin | SMITE Version | Node Version |
|--------|---------------|--------------|
| /core | >=3.1.0 | >=18.0.0 |
| /studio | >=4.0.0 | >=18.0.0 |
| /essentials | >=4.0.0 | >=18.0.0 |

**External Dependencies:**
- `grepai-cli` (optional, for semantic search in studio)

---

## Plugin Registry

The [index.json](./index.json) file contains metadata for all plugins:
- Plugin name and version
- Description and category
- Dependencies and features
- Installation commands
- Compatibility requirements

**Usage:**
```bash
# List all plugins
/plugin list

# Get plugin info
/plugin info studio

# Search plugins
/plugin search "development"
```

---

## Support

**Documentation:**
- [SMITE Docs](https://github.com/Pamacea/smite/docs)
- [Migration Guide](./MIGRATION_v3_to_v4.md)

**Community:**
- [GitHub Issues](https://github.com/Pamacea/smite/issues)
- [GitHub Discussions](https://github.com/Pamacea/smite/discussions)

**Contributing:**
- See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## License

All SMITE plugins are released under the MIT License.

---

**Version:** 4.0.0 | **Last Updated:** 2026-02-08
