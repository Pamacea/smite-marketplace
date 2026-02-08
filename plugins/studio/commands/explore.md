# /studio explore - Unified Exploration Command

> **STUDIO** code exploration with native semantic search

## Usage

```bash
# Deep exploration
/studio explore --mode=deep "How does the payment system work?"

# Quick search
/studio explore --mode=quick "Authentication components"

# Pattern search
/studio explore --mode=pattern "Repository pattern"

# Impact analysis
/studio explore --mode=impact src/auth/jwt.ts

# Semantic search (native grepai)
/studio explore --mode=semantic "How to implement JWT refresh?"
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
/studio explore --type=architecture "Design of the app"

# Code exploration
/studio explore --type=code "Implementation of auth"

# Pattern search
/studio explore --type=patterns "Repository pattern"

# Test exploration
/studio explore --type=tests "Integration tests for payments"
```

## Depth Flags

```bash
# Shallow (surface only)
/studio explore --mode=quick --depth=shallow

# Medium (standard)
/studio explore --mode=deep --depth=medium

# Deep (thorough)
/studio explore --mode=deep --depth=deep
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
/studio explore --format=markdown

# JSON (machine-readable)
/studio explore --format=json

# ASCII tree
/studio explore --format=tree
```

## Grepai Integration

**Native semantic search via grepai (no toolkit needed):**

```bash
# Semantic search
/studio explore --mode=semantic "Authentication with OAuth"

# Hybrid search (semantic + literal)
/studio explore --mode=semantic --hybrid "User registration flow"

# Context optimization (70-85% token savings)
/studio explore --mode=semantic --optimize "Payment processing logic"

# Limit results
/studio explore --mode=semantic --limit=20 "JWT token refresh"

# Relevance ranking
/studio explore --mode=semantic --ranking "User registration"
```

## Examples

### Deep Exploration

```bash
# Understand entire system
/studio explore --mode=deep "How does the payment system work?"

# Architecture analysis
/studio explore --mode=deep --type=architecture "SaaS dashboard design"

# With depth specification
/studio explore --mode=deep --depth=deep "Microservices architecture"
```

### Quick Search

```bash
# Find specific components
/studio explore --mode=quick "Authentication components"

# With type filter
/studio explore --mode=quick --type=code "JWT token logic"

# With output format
/studio explore --mode=quick --format=json "User registration"
```

### Pattern Search

```bash
# Find repository pattern
/studio explore --mode=pattern "Repository pattern"

# With output
/studio explore --mode=pattern --output=files "Factory pattern"

# Format as tree
/studio explore --mode=pattern --format=tree "Strategy pattern"
```

### Impact Analysis

```bash
# Analyze impact before changes
/studio explore --mode=impact src/auth/jwt.ts

# With details
/studio explore --mode=impact --output=details src/features/auth/

# Format as tree
/studio explore --mode=impact --format=tree src/services/payment/
```

### Semantic Search

```bash
# Native semantic search
/studio explore --mode=semantic "How to implement JWT refresh token?"

# Hybrid search (better precision)
/studio explore --mode=semantic --hybrid "Authentication flow with OAuth"

# Optimized context (token savings)
/studio explore --mode=semantic --optimize "Payment gateway integration"

# With ranking
/studio explore --mode=semantic --ranking "User registration with email verification"
```

### Combined Flags

```bash
# Type + Depth + Output
/studio explore --type=code --depth=deep --output=details "Payment processing"

# Mode + Format + Depth
/studio explore --mode=semantic --format=json --depth=medium "API authentication"

# Type + Mode + Output
/studio explore --type=architecture --mode=pattern --output=tree "Microservices"
```

## Output

All artifacts saved to `.claude/.smite/`:

| Mode | File | Purpose |
|------|------|---------|
| Deep | `explore-deep.md` | Comprehensive findings |
| Pattern | `explore-patterns.md` | Pattern documentation |
| Impact | `explore-impact.md` | Impact assessment |

## Migration Guide

### From basics/studio explore

**Old:**
```bash
/studio explore "How does the payment system work?"
```

**New:**
```bash
/studio explore --mode=deep "How does the payment system work?"
```

### From toolkit/studio explore

**Old:**
```bash
/toolkit explore "Authentication components"
```

**New:**
```bash
/studio explore --mode=quick "Authentication components"
```

### From toolkit/search

**Old:**
```bash
/toolkit search "Pattern repository"
```

**New:**
```bash
/studio explore --mode=semantic --hybrid "Pattern repository"
```

### From toolkit/graph

**Old:**
```bash
/toolkit graph --impact src/auth/jwt.ts
```

**New:**
```bash
/studio explore --mode=impact src/auth/jwt.ts
```

### From builder/studio explore

**Old:**
```bash
# In builder step 1: Explore with semantic search
```

**New:**
```bash
# Direct semantic search
/studio explore --mode=semantic "Authentication patterns"
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

1. **Start with semantic search** - Use `/studio explore --mode=semantic` first
2. **Choose appropriate mode** - deep for understanding, quick for finding
3. **Use type flags** - Specify what you're looking for
4. **Leverage grepai** - Native integration, 75% token savings
5. **Review outputs** - Check generated files for insights

---

**Version:** 1.0.0
**Last Updated:** 2025-02-01
**SMITE Version:** 3.1.0
**Author:** Pamacea
