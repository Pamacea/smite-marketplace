---
name: git-integration
description: Lightweight git integration wrapper that generates smart git commands based on SMITE 4-flag system
version: 1.5.1
---

# Git Integration Skill

## Mission

Provide lightweight git workflow integration for SMITE by generating smart git commands based on the 4-flag system. Does NOT reimplement git - wraps existing git plugins.

## Core Workflow

1. **Input**: User runs `/git [action] [options]`
2. **Process**: Analyze SMITE flags and session context to generate appropriate git commands
3. **Output**: Generated git command or integration with existing git plugins

## Key Principles

- **Don't reimplement git**: Use existing git plugins (git-master, hook-git-auto-backup)
- **SMITE-aware**: Generate commands based on 4-flag context
- **Conventional commits**: Enforce commit message standards
- **Lightweight**: Minimal wrapper, not a full git implementation

## Integration

### Recommended Git Plugins

This skill works best with these existing marketplace plugins:

1. **git-master** (JosiahSiegel marketplace)
   - Installation: `/plugin install git-master@josiahsiegel-marketplace`
   - Features: Complete git toolset, Windows support, conventional commits

2. **hook-git-auto-backup** (Dev-GOM marketplace)
   - Installation: `/plugin install hook-git-auto-backup@dev-gom-plugins`
   - Features: Auto-commit after sessions, prevents work loss

### Usage

```bash
# Generate smart commit command
/git commit
# Output: git commit -m "feat(studio): implement feature X"

# Create feature branch
/git branch user-auth
# Output: git checkout -b feature/user-auth

# Enhanced status
/git status
# Output: Enhanced git status with SMITE context

# Changelog generation
/git changelog
# Output: Generate CHANGELOG.md from commits

# Version bump
/git version patch
# Output: Bump version, create tag, push
```

### Configuration

Create `.claude/.smite/git-integration.json`:

```json
{
  "enabled": true,
  "defaults": {
    "type": "chore",
    "scope": "smite",
    "baseBranch": "main"
  },
  "conventionalCommits": {
    "enabled": true,
    "types": ["feat", "fix", "refactor", "docs", "chore", "test", "build"],
    "scopes": ["build", "refactor", "explore", "git", "core", "studio", "essentials"]
  },
  "branches": {
    "namingConvention": "conventional",
    "protectedBranches": ["main", "master", "develop"]
  },
  "smiteIntegration": {
    "detectFlags": true,
    "includeSession": true,
    "autoGenerateMessage": true
  }
}
```

## 4-Flag Integration

### --speed (Quick Mode)

```bash
# Quick fix commit
/git commit
# Generates: git commit -m "chore: quick fix"

# Quick branch
/git branch fix
# Generates: git checkout -b hotfix/quick-fix-{timestamp}
```

### --scale (Thorough Mode)

```bash
# Feature commit
/git commit
# Generates: git commit -m "feat(build): implement feature X with full workflow"

# Feature branch
/git branch user-dashboard
# Generates: git checkout -b feature/user-dashboard-{timestamp}
```

### --quality (Quality Mode)

```bash
# Refactor commit
/git commit
# Generates: git commit -m "refactor(core): code improvements for validation"

# Quality-focused workflow
/git commit --validate
# Runs pre-commit hooks, validates message, then commits
```

### --team (Multi-Agent Mode)

```bash
# Multi-agent feature commit
/git commit
# Generates: git commit -m "feat(multi-agent): parallel implementation of X"

# Team branch
/git branch multi-agent-feature
# Generates: git checkout -b feature/multi-agent-{feature}-{timestamp}
```

## Conventional Commit Format

```bash
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code improvement
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `test`: Testing additions
- `build`: Build system changes

**Scopes**: build, refactor, explore, git, core, studio, essentials

## Error Handling

- If git plugin not installed: Suggest installation
- If git command fails: Show error and recovery steps
- If commit message invalid: Show conventional commit format

## Success Criteria

- ✅ Generates smart git commands based on SMITE flags
- ✅ Integrates with existing git plugins
- ✅ Enforces conventional commit format
- ✅ Provides clear installation instructions
- ✅ Works across all platforms

## Version

**Current**: 1.5.1
**Compatible with**: SMITE Core 1.5.1+
