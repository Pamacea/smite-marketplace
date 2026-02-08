---
description: "Complete development workflow orchestration - explore, architect, build, refactor"
argument-hint: "<command> [options]"
---

# /studio - Unified Development Workflow

> **ONE command for your entire development lifecycle**

## Quick Start

```bash
# Explore codebase
/studio explore --mode=deep "How does payment work?"

# Design architecture
/studio architect --mode=design "Create design system"

# Build features
/studio build --scale "Build user dashboard"

# Refactor code
/studio refactor --scope=cleanup "Clean up code"
```

---

## Available Commands

### /studio explore

Code exploration with native semantic search and 4 specialized modes.

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

**See:** `commands/explore.md` for complete reference

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

**See:** `commands/architect.md` for complete reference

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

**See:** `commands/build.md` for complete reference

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

**See:** `commands/refactor.md` for complete reference

---

## Typical Workflow

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

---

## Configuration

Configuration file: `.claude/.smite/studio.json`

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

## Migration from v3.x

### From /architect

```bash
# Old
/architect --mode=init "Build SaaS"

# New
/studio architect --mode=init "Build SaaS"
```

### From /implement

```bash
# Old
/implement --scale "Build feature"

# New
/studio build --scale "Build feature"
```

### From /explore

```bash
# Old
/explore --mode=deep "How does it work?"

# New
/studio explore --mode=deep "How does it work?"
```

### From /refactor

```bash
# Old
/refactor --full

# New
/studio refactor --full
```

---

## Best Practices

1. **Explore before building** - Use `/studio explore` to understand the codebase
2. **Design before implementing** - Use `/studio architect` for architecture decisions
3. **Choose appropriate flags** - Match flags to task complexity
4. **Refactor continuously** - Use `/studio refactor --quick` regularly
5. **Review outputs** - Check generated files in `.claude/.smite/`

---

**Version:** 1.0.0 | **SMITE Version:** 4.0.0 | **Last Updated:** 2026-02-08
