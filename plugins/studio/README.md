# studio

Complete development workflow - build, refactor.

**Version:** 2.0.0 | **SMITE Version:** 1.6.6+

## Overview

SMITE Studio unifies the entire development lifecycle into one cohesive plugin. It combines feature implementation and systematic refactoring into a seamless workflow with **12 composable flags**, **memory integration**, and **agent team orchestration**.

**Merged from:** `/agents`, `/implement`, `/refactor`

**What's New in v2.0:**
- 🆕 8 new flags: `--clean`, `--test`, `--debug`, `--docs`, `--git`, `--branch`, `--profile`, `--types`
- 🧠 Memory integration (claude-mem)
- 📊 Progress indicators
- 📏 Quality metrics reporting
- 🤖 Enhanced agent teams for refactor

---

## Commands

### /studio build

Feature implementation with 12 composable flags and auto-detection.

```bash
# Auto-detection (recommended)
/studio build "fix login button"

# Core flags (v2.0)
/studio build --speed "quick fix"
/studio build --scale "build feature"
/studio build --quality "critical system"
/studio build --team "large project"

# NEW flags (v3.0)
/studio build --clean "refactor, remove duplicates"
/studio build --test "TDD mode"
/studio build --debug "fix bug"
/studio build --docs "with documentation"
/studio build --git "git-aware"
/studio build --branch "context-aware"

# Compose flags
/studio build --clean --scale "refactor user service"
/studio build --test --quality "TDD + 100% coverage"
/studio build --speed --team "quick parallel"
```

**Core Flags:**
- `--speed` - Fast, surgical (quick fixes)
- `--scale` - Comprehensive workflow (complex features)
- `--quality` - Quality gates enabled (critical code)
- `--team` - Parallel agent teams (large projects)

**New Flags:**
- `--clean` - Delete-first philosophy (remove before adding)
- `--test` - TDD mode (RED-GREEN-REFACTOR)
- `--debug` - Bug fixing workflow
- `--docs` - Auto-documentation
- `--git` - Git-aware mode
- `--branch` - Context-aware (branch-specific)
- `--profile` - Performance profiling
- `--types` - TypeScript improvements

**Tech Stack Support:**
- Next.js 16 (TypeScript, Tailwind CSS, Zustand, TanStack Query)
- Rust (Actix/Axum, SQLx)
- Python (FastAPI, SQLAlchemy)
- Go (Gin/Echo, GORM)

**See:** [skills/build/SKILL.md](./skills/build/SKILL.md)

---

### /studio refactor

Systematic code refactoring with 3 new specialized modes.

```bash
# Quick refactoring (auto-fix low-risk)
/studio refactor --quick

# Full workflow
/studio refactor --full

# NEW: Specialized modes (v2.0)
/studio refactor --profile "performance bottlenecks"
/studio refactor --security "OWASP audit"
/studio refactor --types "improve type safety"

# With agent teams
/studio refactor --security --team

# With specific scope
/studio refactor --full --scope=file:src/auth/jwt.ts
```

**Core Modes:**
- `--quick` - Auto-fix low-risk items
- `--full` - Complete refactoring workflow
- `--analyze` - Analysis only
- `--review` - Review and prioritize
- `--resolve` - Apply changes
- `--verify` - Verify results

**New Modes (v2.0):**
- `--profile` - Performance profiling mode
- `--security` - Security scanning mode (OWASP Top 10)
- `--types` - TypeScript improvement mode (remove `any`, improve coverage)

**Agent Teams:**
- `--team` - Orchestrate multiple Claude Code agents in parallel
- Auto-activated for complex refactors (≥5 files or high complexity)

**Scopes:**
- `--scope=recent` - Recent changes only
- `--scope=file:PATH` - Specific file
- `--scope=directory:PATH` - Entire directory
- `--scope=all` - Entire codebase
- `--scope=bug` - Bug fixing mode

**See:** [skills/refactor/SKILL.md](./skills/refactor/SKILL.md)

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
- `claude-mem` - For memory integration (recommended)

---

## Configuration

Configuration file: `.claude/.smite/studio.json`

```json
{
  "build": {
    "defaults": {
      "flag": "scale"
    },
    "memory": {
      "enabled": true,
      "autoSave": true
    }
  },
  "refactor": {
    "defaults": {
      "scope": "recent",
      "riskThreshold": 30,
      "complexityThreshold": 8,
      "coverageTarget": 80
    },
    "security": {
      "owaspTop10": true,
      "dependencyCheck": true
    },
    "types": {
      "strictMode": true,
      "allowAny": false,
      "coverageTarget": 95
    },
    "performance": {
      "improvementTarget": 20
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
# 1. Build features with TDD
/studio build --test --scale "Build user authentication"

# 2. Verify security
/studio refactor --security --scope=directory:src/features/auth

# 3. Improve types
/studio refactor --types --scope=directory:src/features/auth

# 4. Quick refactor as needed
/studio refactor --quick
```

### Working on Existing Codebase

```bash
# 1. Delete-first refactor
/studio build --clean --scale "Remove duplication in user service"

# 2. Type safety improvements
/studio refactor --types --scope=recent

# 3. Performance optimization
/studio refactor --profile --scope=recent
```

### Quick Bug Fix

```bash
# 1. Debug the issue
/studio build --debug "TypeError in auth"

# 2. Fix with git integration
/studio build --debug --git "fix TypeError"

# 3. Verify no regressions
/studio refactor --verify
```

### Full Feature with Documentation

```bash
# 1. TDD + documentation
/studio build --test --docs --scale "Build payment API"

# 2. Security audit
/studio refactor --security --scope=directory:src/features/payment

# 3. Performance profile
/studio refactor --profile --scope=directory:src/features/payment
```

---

## Features

### Implementation (v3.0)
- **12 composable flags**: Speed, scale, quality, team, clean, test, debug, docs, git, branch, profile, types
- **Auto-detection**: Zero-configuration for beginners
- **Multi-tech stack**: Next.js, Rust, Python, Go
- **Memory integration**: Automatic pattern learning with claude-mem
- **Progress tracking**: Transparent workflow indicators
- **Quality metrics**: Objective validation reports
- **Parallel execution**: 2-3x speedup with --team flag

### Refactoring (v2.0)
- **Safety first**: Validate all changes
- **Incremental**: Small, verifiable steps
- **Evidence-based**: Use metrics to guide decisions
- **Test continuously**: Run tests after each change
- **Performance profiling**: Identify bottlenecks
- **Security scanning**: OWASP Top 10 audit
- **TypeScript improvements**: Remove `any`, improve coverage
- **Agent teams**: Multi-agent orchestration

---

## 🆕 What's New in v2.0

### New Build Flags (8 new)

| Flag | Purpose | Example |
|------|---------|---------|
| `--clean` | Delete-first philosophy | `/studio build --clean --scale` |
| `--test` | TDD mode | `/studio build --test --quality` |
| `--debug` | Bug fixing | `/studio build --debug --git` |
| `--docs` | Auto-documentation | `/studio build --docs --scale` |
| `--git` | Git-aware mode | `/studio build --git --scale` |
| `--branch` | Context-aware | `/studio build --branch` |
| `--profile` | Performance profiling | `/studio build --profile --scale` |
| `--types` | TypeScript improvements | `/studio build --types --scale` |

### New Refactor Modes (3 new)

| Mode | Purpose | Example |
|------|---------|---------|
| `--profile` | Performance profiling | `/studio refactor --profile --scope=recent` |
| `--security` | Security scanning (OWASP) | `/studio refactor --security --scope=all` |
| `--types` | TypeScript improvement | `/studio refactor --types --scope=all` |

### Enhanced Features

- 🧠 **Memory Integration**: Automatic pattern saving to claude-mem
- 📊 **Progress Indicators**: Real-time workflow progress
- 📏 **Quality Metrics**: Code quality reports after each build
- 🤖 **Agent Teams**: Parallel execution for refactoring
- ⚡ **Auto-Detection**: Enhanced with new flags

---

## Command Mapping

### Legacy → Studio v2.0

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

- **[build](./skills/build/SKILL.md)** - Feature implementation agent v3.0
- **[refactor](./skills/refactor/SKILL.md)** - Code refactoring agent v2.0

---

## Comparison: v1.0 vs v2.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| Build flags | 4 | 12 |
| Refactor modes | 6 | 9 |
| Memory integration | ❌ | ✅ |
| Progress indicators | ❌ | ✅ |
| Quality metrics | ❌ | ✅ |
| Performance profiling | ❌ | ✅ |
| Security scanning | ❌ | ✅ |
| TypeScript mode | ❌ | ✅ |
| Git integration | ❌ | ✅ |
| Agent teams (build) | ✅ | ✅ |
| Agent teams (refactor) | ❌ | ✅ |

---

## Examples

### Delete-First Refactor

```bash
# Remove duplication before adding new code
/studio build --clean --scale "refactor user service"

# Result: Net code reduction, zero duplication
```

### TDD with Quality Gates

```bash
# Test-driven development with 100% coverage
/studio build --test --quality "payment processing"

# Result: Tests first, coverage ≥ 95%, all passing
```

### Security Audit

```bash
# Full OWASP Top 10 scan
/studio refactor --security --scope=all

# Result: All P0/P1 vulnerabilities fixed, security tests added
```

### Type Safety Improvement

```bash
# Remove all `any`, improve type coverage
/studio refactor --types --scope=all

# Result: Zero `any`, coverage ≥ 95%, tsc --strict passing
```

### Comprehensive Feature

```bash
# Full feature with everything
/studio build --test --docs --quality --git "Build OAuth2 provider"

# Result: TDD, documented, validated, proper commit message
```

---

## License

MIT

---

**Version:** 2.0.0 | **Last Updated:** 2026-02-19
