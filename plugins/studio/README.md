# studio

Complete development workflow - build, refactor.

**Version:** 1.0.0 | **SMITE Version:** 1.5.0

## Overview

SMITE Studio unifies the entire development lifecycle into one cohesive plugin. It combines feature implementation and systematic refactoring into a seamless workflow.

**Merged from:** `/agents`, `/implement`, `/refactor`

---

## Commands

### /studio build

Feature implementation with 4 composable flags and auto-detection.

```bash
# Auto-detection (recommended)
/studio build "fix login button"

# With flags
/studio build --speed "quick fix"
/studio build --scale "build feature"
/studio build --quality "critical system"
/studio build --team "large project"

# Compose flags
/studio build --speed --team "quick parallel"
/studio build --scale --quality "thorough + validated"
```

**Flags:**
- `--speed` - Fast, surgical (quick fixes)
- `--scale` - Comprehensive workflow (complex features)
- `--quality` - Quality gates enabled (critical code)
- `--team` - Parallel agent teams (large projects)

**Tech Stack Support:**
- Next.js 15 (TypeScript, Tailwind CSS, Zustand, TanStack Query)
- Rust (Actix/Axum, SQLx)
- Python (FastAPI, SQLAlchemy)
- Go (Gin/Echo, GORM)

**See:** [commands/build.md](./commands/build.md)

---

### /studio refactor

Systematic code refactoring with comprehensive validation.

```bash
# Quick refactoring (auto-fix low-risk)
/studio refactor --quick

# Full workflow
/studio refactor --full

# Bug fixing
/studio refactor --scope=bug "TypeError in auth"

# With specific scope
/studio refactor --full --scope=file:src/auth/jwt.ts
```

**Modes:**
- `--quick` - Auto-fix low-risk items
- `--full` - Complete refactoring workflow
- `--analyze` - Analysis only
- `--review` - Review and prioritize
- `--resolve` - Apply changes
- `--verify` - Verify results

**Scopes:**
- `--scope=recent` - Recent changes only
- `--scope=file:PATH` - Specific file
- `--scope=directory:PATH` - Entire directory
- `--scope=all` - Entire codebase
- `--scope=bug` - Bug fixing mode

**See:** [commands/refactor.md](./commands/refactor.md)

---

## Installation

```bash
/plugin install studio
```

**Requirements:**
- SMITE v4.0.0 or higher
- core (installed automatically)
- Node.js 18.0.0 or higher

**Optional:**
- `grepai-cli` - For semantic search (`npm install -g grepai-cli`)

---

## Configuration

Configuration file: `.claude/.smite/studio.json`

```json
{
  "build": {
    "defaults": {
      "flag": "scale"
    }
  },
  "refactor": {
    "defaults": {
      "scope": "recent",
      "riskThreshold": 30,
      "complexityThreshold": 8,
      "coverageTarget": 80
    },
    "exclude": [
      "node_modules/**",
      "dist/**",
      ".claude/**"
    ]
  }
}
```

---

## Typical Workflows

### Starting a New Project

```bash
# 1. Build features
/studio build --scale "Build user authentication"

# 2. Refactor as needed
/studio refactor --quick
```

### Working on Existing Codebase

```bash
# 1. Implement changes
/studio build --scale "Add OAuth2 provider"

# 2. Verify quality
/studio refactor --scope=cleanup
```

### Quick Bug Fix

```bash
# 1. Debug the issue
/studio refactor --scope=bug "TypeError in auth"

# 2. Fix it
/studio build --speed "Fix type error in auth service"
```

---

## Features

### Implementation
- **Auto-detection**: Zero-configuration for beginners
- **4 composable flags**: Speed, scale, quality, team
- **Multi-tech stack**: Next.js, Rust, Python, Go
- **Parallel execution**: 2-3x speedup with --team flag
- **Quality gates**: Validation with --quality flag

### Refactoring
- **Safety first**: Validate all changes
- **Incremental**: Small, verifiable steps
- **Evidence-based**: Use metrics to guide decisions
- **Test continuously**: Run tests after each change
- **Bug fixing**: Specialized scope for debugging

---


### Command Mapping

| Old Command | New Command |
|-------------|-------------|
| `/builder` | `/studio build` |
| `/implement` | `/studio build` |
| `/refactor` | `/studio refactor` |
| `/oneshot` | `/studio build --speed` |
| `/epct` | `/studio build --scale` |
| `/predator` | `/studio build --quality` |
| `/ralph` | `/studio build --team` |

**See:** [Migration Guide](../MIGRATION_v3_to_v4.md)

---

## Skills

Studio uses specialized skills for each workflow:

- **[build](./skills/build/SKILL.md)** - Feature implementation agent
- **[refactor](./skills/refactor/SKILL.md)** - Code refactoring agent

---

## License

MIT

---

**Version:** 1.0.0 | **Last Updated:** 2026-02-08
