# studio

Complete development workflow - explore, architect, build, refactor.

**Version:** 1.0.0 | **SMITE Version:** 1.5.0

## Overview

SMITE Studio unifies the entire development lifecycle into one cohesive plugin. It combines code exploration, architecture design, feature implementation, and systematic refactoring into a seamless workflow.

**Merged from:** `/agents`, `/implement`, `/explore`, `/refactor`

---

## Commands

### /studio explore

Code exploration with 4 specialized modes and native semantic search.

```bash
# Deep exploration (multi-source research)
/studio explore --mode=deep "How does the payment system work?"

# Quick search (fast targeted)
/studio explore --mode=quick "Authentication components"

# Semantic search (native grepai)
/studio explore --mode=semantic "How to implement JWT refresh?"

# Impact analysis (dependency graph)
/studio explore --mode=impact src/auth/jwt.ts
```

**Modes:**
- `--mode=deep` - Comprehensive understanding with multi-source research
- `--mode=quick` - Fast, targeted search for specific files
- `--mode=semantic` - Native semantic search via grepai (75% token savings)
- `--mode=impact` - Impact analysis before changes

**See:** [commands/explore.md](./commands/explore.md)

---

### /studio architect

Architecture design with creative workflow powered by MCP tools.

```bash
# Initialize new project
/studio architect --mode=init "Build a SaaS platform"

# Create design system
/studio architect --mode=design "Modern dashboard design"

# Business strategy
/studio architect --mode=strategy "Analyze pricing strategy"

# Creative workflow (NEW)
/studio architect -b -w -v -x "Design modern SaaS dashboard"
```

**Modes:**
- `--mode=init` - Project initialization with tech stack
- `--mode=design` - Design system and UI specifications
- `--mode=strategy` - Business and market strategy
- `--mode=brainstorm` - Creative problem-solving

**Creative Workflow:**
- `-b` - Create design brief
- `-w` - Research via WebSearch MCP
- `-v` - Analyze references via Vision MCP
- `-x` - Create interactive previews
- `--select=<style>` - Implement chosen style

**See:** [commands/architect.md](./commands/architect.md)

---

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
  "explore": {
    "defaults": {
      "mode": "deep",
      "depth": "medium",
      "output": "summary"
    },
    "semantic": {
      "optimize": true,
      "hybrid": false,
      "limit": 20
    }
  },
  "architect": {
    "defaults": {
      "mode": "design"
    },
    "design": {
      "styles": ["minimalist", "brutalist", "glassmorphism", "neumorphism", "bento"]
    }
  },
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
# 1. Initialize project
/studio architect --mode=init "Build a project management SaaS"

# 2. Design system
/studio architect --mode=design "Create professional design system"

# 3. Explore existing patterns (if any)
/studio explore --mode=semantic "Repository pattern"

# 4. Build features
/studio build --scale "Build user authentication"

# 5. Refactor as needed
/studio refactor --quick
```

### Working on Existing Codebase

```bash
# 1. Explore the code
/studio explore --mode=deep "How does authentication work?"

# 2. Understand impact
/studio explore --mode=impact src/features/auth/

# 3. Implement changes
/studio build --scale "Add OAuth2 provider"

# 4. Verify quality
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

### Exploration
- **Multi-mode exploration**: Deep, quick, semantic, impact
- **Native semantic search**: Direct grepai integration (75% token savings)
- **Multi-source research**: Codebase, docs, web search
- **Evidence-based**: File references and examples
- **Auto-parallel**: Automatic multi-agent exploration for complex queries

### Architecture
- **Spec-first development**: Complete specs before implementation
- **Creative workflow**: MCP-powered design with 5 UI style variations
- **Tech stack detection**: Automatic stack selection
- **Design tokens**: Semantic naming for consistency
- **Interactive previews**: Live design exploration

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
| `/architect` | `/studio architect` |
| `/builder` | `/studio build` |
| `/implement` | `/studio build` |
| `/explore` | `/studio explore` |
| `/refactor` | `/studio refactor` |
| `/oneshot` | `/studio build --speed` |
| `/epct` | `/studio build --scale` |
| `/predator` | `/studio build --quality` |
| `/ralph` | `/studio build --team` |
| `/toolkit search` | `/studio explore --mode=semantic` |
| `/toolkit explore` | `/studio explore --mode=deep` |
| `/toolkit graph` | `/studio explore --mode=impact` |

**See:** [Migration Guide](../MIGRATION_v3_to_v4.md)

---

## Skills

Studio uses specialized skills for each workflow:

- **[explore](./skills/explore/SKILL.md)** - Code exploration agent
- **[architect](./skills/architect/SKILL.md)** - Architecture design agent
- **[build](./skills/build/SKILL.md)** - Feature implementation agent
- **[refactor](./skills/refactor/SKILL.md)** - Code refactoring agent

---

## License

MIT

---

**Version:** 1.0.0 | **Last Updated:** 2026-02-08
