# SMITE Git Integration

**Version**: 1.5.1
**Type**: Lightweight wrapper (not a full git implementation)

---

## Overview

SMITE Git Integration provides smart git command generation based on the SMITE 4-flag system. It does NOT reimplement git - it wraps existing git plugins and generates intelligent commands.

## Quick Start

### 1. Install Recommended Git Plugins

```bash
# Complete git toolset
/plugin install git-master@josiahsiegel-marketplace

# Auto-commit after sessions
/plugin install hook-git-auto-backup@dev-gom-plugins
```

### 2. Use Git Integration

```bash
# Smart commit (auto-generates message)
/git commit

# Custom commit message
/git commit "feat(core): add configuration manager"

# Create branch
/git branch user-auth

# Enhanced status
/git status

# Generate changelog
/git changelog

# Bump version
/git version patch
```

---

## SMITE Flag Integration

The git integration detects SMITE flags and generates appropriate commands:

### `--speed` (Quick Mode)

```bash
/git commit
# Generates: git commit -m "chore: quick fix"

/git branch hotfix
# Generates: git checkout -b hotfix/quick-fix-{timestamp}
```

### `--scale` (Thorough Mode)

```bash
/git commit
# Generates: git commit -m "feat(build): implement feature X with full workflow"

/git branch feature-name
# Generates: git checkout -b feature/feature-name-{timestamp}
```

### `--quality` (Quality Mode)

```bash
/git commit
# Generates: git commit -m "refactor(core): code improvements for validation"
```

### `--team` (Multi-Agent Mode)

```bash
/git commit
# Generates: git commit -m "feat(multi-agent): parallel implementation of X"
```

---

## Conventional Commit Format

All commits follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code improvement
- `docs`: Documentation changes
- `chore`: Maintenance tasks
- `test`: Testing additions
- `build`: Build system changes

### Scopes

- `build`: Build system
- `refactor`: Refactoring
- `explore`: Code exploration
- `git`: Git integration
- `core`: Core infrastructure
- `studio`: Studio plugin
- `essentials`: Essentials plugin

### Examples

```bash
# Feature
git commit -m "feat(core): add configuration manager"

# Bug fix
git commit -m "fix(validation): handle null values correctly"

# Refactor
git commit -m "refactor(studio): simplify command parsing"

# Documentation
git commit -m "docs(core): add integration examples"
```

---

## Configuration

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

---

## Branch Management

### Naming Conventions

```bash
# Feature branches
/git branch user-auth
# Creates: feature/user-auth-{timestamp}

# Hotfix branches
/git branch login-bug
# Creates: hotfix/login-bug-{timestamp}

# Bugfix branches
/git branch ui-glitch
# Creates: bugfix/ui-glitch-{timestamp}
```

### Protected Branches

The following branches are protected by default:
- `main`
- `master`
- `develop`

To add more protected branches, update the configuration:

```json
{
  "branches": {
    "protectedBranches": ["main", "master", "develop", "production", "staging"]
  }
}
```

---

## Advanced Usage

### Commit with Options

```bash
# Amend last commit
/git commit --amend

# Skip hooks
/git commit --no-verify
```

### Version Bumping

```bash
# Patch version (1.5.1 → 1.5.2)
/git version patch

# Minor version (1.5.1 → 1.6.0)
/git version minor

# Major version (1.5.1 → 2.0.0)
/git version major
```

### Changelog Generation

```bash
# Generate changelog since last tag
/git changelog

# Output format:
# # Changelog
#
# ### Feat
# - Add user authentication (abc1234)
# - Implement OAuth flow (def5678)
#
# ### Fix
# - Fix login bug (ghi9012)
```

---

## Integration with Git Plugins

### git-master

Comprehensive git toolset with Windows support.

**Installation**:
```bash
/plugin install git-master@josiahsiegel-marketplace
```

**Features**:
- Complete git expertise
- Git Bash path conversion
- Stash import/export
- Shell detection
- Branch management
- Conventional commits

### hook-git-auto-backup

Auto-commit after sessions to prevent work loss.

**Installation**:
```bash
/plugin install hook-git-auto-backup@dev-gom-plugins
```

**Features**:
- Auto-commit after each session
- Configurable commit messages
- Handles unstaged changes
- Session-based backup

---

## Troubleshooting

### Git Plugin Not Installed

**Error**: `Git plugin not found`

**Solution**:
```bash
/plugin install git-master@josiahsiegel-marketplace
```

### Invalid Commit Message

**Error**: `Invalid commit message format`

**Solution**: Follow conventional commit format:
```
type(scope): description
```

### Branch Already Exists

**Error**: `Branch already exists`

**Solution**:
```bash
git checkout existing-branch
# Or
git branch -D existing-branch
/git branch new-branch-name
```

---

## Best Practices

1. **Always use conventional commits**: Ensures consistency and enables automation
2. **Use SMITE flags**: Let the system generate appropriate commit messages
3. **Protect main branches**: Prevent direct commits to main/master
4. **Write clear descriptions**: Keep commit messages concise but descriptive
5. **Use branches for features**: Never work directly on main
6. **Generate changelogs**: Keep track of changes between releases

---

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [git-master Plugin](https://github.com/JosiahSiegel/claude-code-marketplace)
- [hook-git-auto-backup Plugin](https://github.com/Dev-GOM/claude-code-marketplace)
- [SMITE Documentation](https://github.com/Pamacea/smite)

---

## Version

**Current**: 1.5.1
**SMITE Core Required**: 1.5.1+
