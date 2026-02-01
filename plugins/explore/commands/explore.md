# /explore - Unified Exploration Command

> **UNIFIED** code exploration with native semantic search

## Usage

```bash
# Deep exploration
/explore --mode=deep "How does the payment system work?"

# Quick search
/explore --mode=quick "Authentication components"

# Pattern search
/explore --mode=pattern "Repository pattern"

# Impact analysis
/explore --mode=impact src/auth/jwt.ts

# Semantic search (native grepai)
/explore --mode=semantic "How to implement JWT refresh?"
```

## Mode Selection

| Mode | Description | Speed | Output |
|------|-------------|-------|--------|
| `--mode=deep` | Deep exploration with multi-source research | ⚡⚡ | File |
| `--mode=quick` | Fast, targeted search | ⚡⚡⚡ | Terminal |
| `--mode=pattern` | Find code patterns | ⚡⚡ | File |
| `--mode=impact` | Impact analysis | ⚡⚡ | File |
| `--mode=semantic` | Native semantic search via grepai | ⚡⚡ | Terminal |

## Type Flags

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

## Depth Flags

```bash
# Shallow (surface only)
/explore --mode=quick --depth=shallow

# Medium (standard)
/explore --mode=deep --depth=medium

# Deep (thorough)
/explore --mode=deep --depth=deep
```

## Output Flags

| Flag | Description |
|------|-------------|
| `--output=files` | List of files (default) |
| `--output=summary` | Concise summary |
| `--output=details` | Comprehensive details |
| `--output=tree` | ASCII tree structure |

## Format Flags

```bash
# Markdown (readable)
/explore --format=markdown

# JSON (machine-readable)
/explore --format=json

# ASCII tree
/explore --format=tree
```

## Grepai Integration

**Native semantic search via grepai (no toolkit needed):**

```bash
# Semantic search
/explore --mode=semantic "Authentication with OAuth"

# Hybrid search (semantic + literal)
/explore --mode=semantic --hybrid "User registration flow"

# Context optimization (70-85% token savings)
/explore --mode=semantic --optimize "Payment processing logic"

# Limit results
/explore --mode=semantic --limit=20 "JWT token refresh"

# Relevance ranking
/explore --mode=semantic --ranking "User registration"
```

## Examples

### Deep Exploration

```bash
# Understand entire system
/explore --mode=deep "How does the payment system work?"

# Architecture analysis
/explore --mode=deep --type=architecture "SaaS dashboard design"

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

## Output

All artifacts saved to `.claude/.smite/`:

| Mode | File | Purpose |
|------|------|---------|
| Deep | `explore-deep.md` | Comprehensive findings |
| Pattern | `explore-patterns.md` | Pattern documentation |
| Impact | `explore-impact.md` | Impact assessment |

## Migration Guide

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
/explore --mode=semantic "Authentication patterns"
```

### From ralph/analyze

**Old workflow:**
```json
{
  "steps": ["analyze", ...]
}
```

**New workflow:**
```json
{
  "steps": ["explore", ...]
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| grepai not found | Install grepai: `npm install -g grepai-cli` |
| MXBAI_API_KEY missing | Set environment variable |
| No semantic results | Use `--hybrid` flag |
| Too many results | Use `--limit` flag |
| Slow search | Use `--optimize` flag |

## Best Practices

1. **Start with semantic search** - Use `/explore --mode=semantic` first
2. **Choose appropriate mode** - deep for understanding, quick for finding
3. **Use type flags** - Specify what you're looking for
4. **Leverage grepai** - Native integration, 75% token savings
5. **Review outputs** - Check generated files for insights

---

**Version:** 1.0.0
**Last Updated:** 2025-02-01
**SMITE Version:** 3.1.0
**Author:** Pamacea
