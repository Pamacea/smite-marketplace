# @smite/explore - Unified Exploration Agent

> **UNIFIED** code exploration with native semantic search - consolidates all exploration workflows

## 🎯 Purpose

Provides a unified exploration experience by consolidating:
- `basics/explore` - Deep codebase exploration
- `toolkit/explore` - Codebase explorator
- `builder/explore` - Semantic search (step 1)
- `ralph/analyze` - Analysis step in workflows

**Goal:** One clear entry point for all exploration tasks.

## 🚀 Quick Start

```bash
# 1. Install plugin
/plugin install explore@smite

# 2. Deep exploration
/explore --mode=deep "How does the payment system work?"

# 3. Quick search
/explore --mode=quick "Authentication components"

# 4. Semantic search (native)
/explore --mode=semantic "Pattern repository"

# 5. Impact analysis
/explore --mode=impact src/auth/jwt.ts
```

## 📖 Usage

### Mode Selection

| Mode | Description | Best For | Speed |
|------|-------------|----------|-------|
| `--mode=deep` | Deep exploration with multi-source research | Understanding new projects, architecture | ⚡⚡ |
| `--mode=quick` | Fast, targeted search | Finding specific files/functions | ⚡⚡⚡ |
| `--mode=pattern` | Find code patterns | Identifying architectural patterns | ⚡⚡ |
| `--mode=impact` | Impact analysis | Understanding change blast radius | ⚡⚡ |
| `--mode=semantic` | Native semantic search via grepai | Complex queries, cross-file concepts | ⚡⚡ |

### Type Flags

```bash
# Architecture exploration
/explore --type=architecture "Design of the app"

# Code exploration
/explore --type=code "Implementation of auth"

# Pattern search
/explore --type=patterns "Repository pattern"

# Test exploration
/explore --type=tests "Integration tests for payments"
```

### Depth Flags

```bash
# Shallow (surface only)
/explore --mode=quick --depth=shallow

# Medium (standard)
/explore --mode=deep --depth=medium

# Deep (thorough)
/explore --mode=deep --depth=deep
```

### Output Flags

```bash
# Files (list of files)
/explore --output=files

# Summary (concise)
/explore --output=summary

# Details (comprehensive)
/explore --output=details

# Tree (dependency tree)
/explore --output=tree
```

### Format Flags

```bash
# Markdown (readable)
/explore --format=markdown

# JSON (machine-readable)
/explore --format=json

# ASCII tree
/explore --format=tree
```

### Grepai Integration

**Native semantic search via grepai:**

```bash
# Semantic search (native, no toolkit needed)
/explore --mode=semantic "how to implement JWT refresh?"

# Hybrid search (semantic + literal)
/explore --mode=semantic --hybrid "authentication flow"

# Context optimization (70-85% token savings)
/explore --mode=semantic --optimize "payment processing logic"

# Ranking (relevance ranking)
/explore --mode=semantic --ranking "user registration"
```

## 🔧 Workflows

### Deep Exploration (--mode=deep)

Comprehensive exploration with multi-source research:

```
1. RESEARCH
   - Semantic search (grepai)
   - Literal search (if semantic fails)
   - Web search (for external context)
   - Documentation (README, docs/)

2. ANALYZE
   - File structure and organization
   - Dependencies and imports
   - Design patterns and architecture
   - Code conventions and style

3. SUMMARIZE
   - Key findings
   - File references
   - Architecture diagram (ASCII)
   - Trade-offs and decisions

Output: .claude/.smite/explore-deep.md
```

### Quick Search (--mode=quick)

Fast, targeted search for specific files/functions:

```
1. SEARCH (semantic first, then literal)
   - grepai search
   - Fallback to literal search
   - Ranking by relevance

2. FILTER
   - By file type (component, service, util)
   - By directory (src/auth, src/api)
   - By recent changes (git log)

3. OUTPUT
   - List of relevant files
   - Code snippets
   - Function signatures

Output: Terminal (or --output=files)
```

### Pattern Search (--mode=pattern)

Find architectural and design patterns:

```
1. SEARCH (pattern matching)
   - grepai search for patterns
   - Keyword-based search
   - Cross-reference analysis

2. IDENTIFY
   - Pattern type (repository, factory, strategy)
   - Pattern location (files, modules)
   - Pattern variation

3. DOCUMENT
   - Pattern description
   - Usage examples
   - File locations

Output: .claude/.smite/explore-patterns.md
```

### Impact Analysis (--mode=impact)

Understand change blast radius before implementation:

```
1. ANALYZE
   - Direct dependencies
   - Indirect dependencies
   - Downstream consumers
   - Configuration changes

2. MAP
   - Dependency graph
   - Impact tree (ASCII)
   - Risk levels (high/medium/low)

3. REPORT
   - Critical files
   - Required tests
   - Migration notes

Output: .claude/.smite/explore-impact.md
```

### Semantic Search (--mode=semantic)

Native semantic search via grepai:

```
1. SEARCH (semantic via grepai)
   - Query understanding
   - Code embeddings
   - Semantic similarity

2. RANK (relevance)
   - Score by relevance
   - Top N results
   - Context snippets

3. EXTRACT
   - Code snippets
   - File paths
   - Line numbers
   - Context windows

Output: Terminal (or --output=files)
```

## 🔍 Grepai Integration

### Native Integration

Direct grepai CLI integration (no toolkit plugin needed):

```bash
# Semantic search
/explore --mode=semantic "authentication with OAuth"

# Hybrid search (semantic + literal)
/explore --mode=semantic --hybrid "user registration flow"

# Context optimization
/explore --mode=semantic --optimize "payment gateway integration"

# Limit results
/explore --mode=semantic --limit=20 "JWT token refresh"
```

### Optimization Flags

| Flag | Description | Token Savings |
|------|-------------|---------------|
| `--optimize` | Optimized context (signatures only) | 70-85% |
| `--hybrid` | Hybrid search (semantic + literal) | 2x precision |
| `--limit=N` | Limit to N results | Variable |
| `--ranking` | Relevance ranking | 2x accuracy |

## 📊 Comparison: Before vs After

### Before (Multiple Systems)

| Need | Command | Notes |
|------|---------|-------|
| Deep exploration | `/explore` (basics) | Documentation only |
| Quick search | `/toolkit explore` | Requires toolkit |
| Pattern search | `/toolkit search` | Requires toolkit |
| Impact analysis | `/toolkit graph` | Requires toolkit |
| Semantic search | `grepai search` | CLI only |

### After (Unified /explore)

| Need | Command | Notes |
|------|---------|-------|
| Deep exploration | `/explore --mode=deep` | All-in-one |
| Quick search | `/explore --mode=quick` | Native grepai |
| Pattern search | `/explore --mode=pattern` | Built-in |
| Impact analysis | `/explore --mode=impact` | Built-in |
| Semantic search | `/explore --mode=semantic` | Native grepai |

## 📁 Output Files

| Operation | File Location | Purpose |
|-----------|---------------|---------|
| Deep explore | `.claude/.smite/explore-deep.md` | Comprehensive findings |
| Pattern search | `.claude/.smite/explore-patterns.md` | Pattern documentation |
| Impact analysis | `.claude/.smite/explore-impact.md` | Impact assessment |
| Semantic search | Terminal | Ranked results |

## 🔧 Configuration

### Config File

`.claude/.smite/explore.json`:

```json
{
  "defaults": {
    "mode": "deep",
    "depth": "medium",
    "output": "files",
    "format": "markdown"
  },
  "grepai": {
    "enabled": true,
    "limit": 20,
    "ranking": true,
    "optimize": true
  },
  "exclude": [
    "node_modules/**",
    "dist/**",
    ".claude/**",
    "build/**",
    "*.min.js",
    "*.map"
  ]
}
```

### Environment Variables

```bash
# Grepai API key (required for semantic search)
MXBAI_API_KEY=your_key_here

# Grepai CLI options
GREPAI_MAX_COUNT=20
GREPAI_RERANK=true
GREPAI_HYBRID=true
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Grepai not found | Install grepai: `npm install -g grepai-cli` |
| MXBAI_API_KEY missing | Set environment variable |
| No semantic results | Use `--hybrid` flag |
| Too many results | Use `--limit` flag |
| Slow search | Use `--optimize` flag |

## 📝 Migration Guide

### From basics/explore

**Old:**
```bash
/explore "How does the payment system work?"
```

**New:**
```bash
/explore --mode=deep "How does the payment system work?"
```

### From toolkit/explore

**Old:**
```bash
/toolkit explore "Authentication components"
```

**New:**
```bash
/explore --mode=quick "Authentication components"
```

### From toolkit/search

**Old:**
```bash
/toolkit search "Pattern repository"
```

**New:**
```bash
/explore --mode=semantic --hybrid "Pattern repository"
```

### From toolkit/graph

**Old:**
```bash
/toolkit graph --impact src/auth/jwt.ts
```

**New:**
```bash
/explore --mode=impact src/auth/jwt.ts
```

### From builder/explore

**Old:**
```bash
# In builder step 1: Explore with semantic search
```

**New:**
```bash
# Direct semantic search
/explore --mode=semantic "authentication patterns"
```

### From ralph/analyze

**Old:**
```json
{
  "steps": ["analyze", ...]
}
```

**New:**
```json
{
  "steps": ["explore", ...]
}
```

## 🎯 Examples

### Deep Exploration

```bash
# Understand entire system
/explore --mode=deep "How does the payment processing system work?"

# Architecture analysis
/explore --mode=deep --type=architecture "Design of the SaaS dashboard"

# With depth specification
/explore --mode=deep --depth=deep "Microservices architecture"
```

### Quick Search

```bash
# Find specific components
/explore --mode=quick "Authentication components"

# With type filter
/explore --mode=quick --type=code "JWT token logic"

# With output format
/explore --mode=quick --format=json "User registration"
```

### Pattern Search

```bash
# Find repository pattern
/explore --mode=pattern "Repository pattern"

# With output
/explore --mode=pattern --output=files "Factory pattern"

# Format as tree
/explore --mode=pattern --format=tree "Strategy pattern"
```

### Impact Analysis

```bash
# Analyze impact before changes
/explore --mode=impact src/auth/jwt.ts

# With details
/explore --mode=impact --output=details src/features/auth/

# Format as tree
/explore --mode=impact --format=tree src/services/payment/
```

### Semantic Search

```bash
# Native semantic search
/explore --mode=semantic "How to implement JWT refresh token?"

# Hybrid search (better precision)
/explore --mode=semantic --hybrid "Authentication flow with OAuth"

# Optimized context (token savings)
/explore --mode=semantic --optimize "Payment gateway integration"

# With ranking
/explore --mode=semantic --ranking "User registration with email verification"
```

### Combined Flags

```bash
# Type + Depth + Output
/explore --type=code --depth=deep --output=details "Payment processing"

# Mode + Format + Depth
/explore --mode=semantic --format=json --depth=medium "API authentication"

# Type + Mode + Output
/explore --type=architecture --mode=pattern --output=tree "Microservices"
```

## 📚 Documentation

- **[Complete Guide](../../docs/EXPLORE_GUIDE.md)** - Complete exploration guide
- **[Grepai Docs](https://grepai.app/)** - Grepai documentation
- **[Examples](examples/)** - Sample exploration sessions
- **[Migration Guide](MIGRATION.md)** - Migrating from old agents

## 🤝 Contributing

Found a bug or have a suggestion? Open an issue at:
https://github.com/Pamacea/smite/issues

## 📄 License

MIT License - see LICENSE file for details.

---

**Version:** 1.0.0
**Last Updated:** 2025-02-01
**SMITE Version:** 3.1.0
**Author:** Pamacea
