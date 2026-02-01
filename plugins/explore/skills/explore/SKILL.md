---
name: explore
description: Unified code exploration with native semantic search
version: 1.0.0
---

# Explore Skill - Unified Agent

## 🔴 TOOL GATEKEEPER - NON-NEGOTIABLE

═══════════════════════════════════════════════════
🚫 PROHIBITED WITHOUT EXCEPTION:
   grep | egrep | find | ack | ag | ls | dir | glob

✅ MANDATORY REPLACEMENT:
   grepai search "pattern" | /explore --mode=semantic "query"

🎯 DECISION TREE:
   Need to search? → grepai or /explore --mode=semantic
   Need to explore? → /explore --mode=deep
   Need to read?    → Read tool (NOT cat/head)
═══════════════════════════════════════════════════

---

## Mission

Provide unified code exploration through deep analysis, native semantic search, and multi-source research.

## Core Principles

- **Deep Understanding** - Analyze architecture, patterns, and conventions
- **Native Semantic Search** - Direct grepai integration (75% token savings)
- **Multi-Source Research** - Codebase, docs, web search
- **Evidence-Based** - Provide file references and examples
- **Clear Output** - Structured summaries with actionable insights

## Mode Selection

### --mode=deep (Deep Exploration)

**Purpose:** Comprehensive understanding of complex topics

**Workflow:**
```
1. SEARCH (multi-source)
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

### --mode=quick (Quick Search)

**Purpose:** Fast, targeted search for specific files/functions

**Workflow:**
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

### --mode=pattern (Pattern Search)

**Purpose:** Find architectural and design patterns

**Workflow:**
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

### --mode=impact (Impact Analysis)

**Purpose:** Understand change blast radius before implementation

**Workflow:**
```
1. ANALYZE (dependency graph)
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

### --mode=semantic (Native Semantic Search)

**Purpose:** Native semantic search via grepai

**Workflow:**
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

## Type Flags

### --type=architecture

Explore design and architecture:

```bash
/explore --mode=deep --type=architecture "Design of SaaS dashboard"

# Architecture only (skip implementation)
/explore --mode=deep --type=architecture "Microservices design"
```

**Focus:**
- Design system
- Component architecture
- Data flow
- API contracts

### --type=code

Explore implementation details:

```bash
/explore --mode=deep --type=code "Implementation of auth system"

# Code only (skip design)
/explore --mode=deep --type=code "JWT token logic"
```

**Focus:**
- Code structure
- Implementation patterns
- Algorithms
- Data structures

### --type=patterns

Find architectural patterns:

```bash
# Pattern search
/explore --mode=pattern --type=patterns "Repository pattern"

# With output
/explore --mode=pattern --type=patterns --output=files "Factory pattern"
```

**Focus:**
- Design patterns
- Architectural patterns
- Code organization
- Best practices

### --type=tests

Explore testing infrastructure:

```bash
# Test exploration
/explore --mode=deep --type=tests "Integration tests for payments"

# Test patterns
/explore --mode=pattern --type=tests "Test fixture patterns"
```

**Focus:**
- Test structure
- Test patterns
- Coverage
- Testing tools

## Depth Flags

### --depth=shallow (Surface Only)

Fast exploration of surface-level code:

```bash
/explore --mode=quick --depth=shallow "Auth components"
```

**Analysis:**
- File names
- Directory structure
- Exports
- Minimal code snippets

### --depth=medium (Standard)

Standard-depth exploration:

```bash
/explore --mode=deep --depth=medium "Payment processing"
```

**Analysis:**
- File structure
- Dependencies
- Key functions
- Main patterns

### --depth=deep (Thorough)

Deep exploration with full analysis:

```bash
/explore --mode=deep --depth=deep "Microservices architecture"
```

**Analysis:**
- Complete architecture
- All dependencies
- All patterns
- Full documentation

## Output Flags

### --output=files (List of Files)

Output list of relevant files:

```bash
/explore --mode=quick --output=files "Auth components"
```

**Output format:**
```
src/auth/
├── components/
│   ├── LoginForm.tsx
│   └── AuthButton.tsx
└── services/
    └── authService.ts
```

### --output=summary (Concise)

Output concise summary:

```bash
/explore --mode=deep --output=summary "Payment system"
```

**Output format:**
```markdown
# Payment System - Summary

## Architecture
- Gateway: src/api/payment.ts
- Service: src/services/payment.ts
- Provider: src/providers/stripe.ts

## Key Components
- PaymentGateway - API layer
- PaymentService - Business logic
- StripeProvider - Stripe integration

## Patterns
- Repository pattern for data access
- Strategy pattern for providers
```

### --output=details (Comprehensive)

Output full details:

```bash
/explore --mode=deep --output=details "Auth system"
```

**Output format:**
```markdown
# Authentication System - Details

[Full comprehensive analysis...]
```

## Format Flags

### --format=markdown (Readable)

Output in readable Markdown format:

```bash
/explore --mode=deep --format=markdown "Payment processing"
```

### --format=json (Machine-Readable)

Output in JSON format:

```bash
/explore --mode=quick --format=json "Auth components"
```

**Output format:**
```json
{
  "files": ["src/auth/..."],
  "snippets": [...]
}
```

### --format=tree (ASCII Tree)

Output as ASCII tree:

```bash
/explore --mode=deep --format=tree "Project structure"
```

**Output format:**
```
src/
├── auth/
├── api/
└── services/
```

## Grepai Integration

### Native Semantic Search

Direct grepai CLI integration (no toolkit plugin needed):

```bash
# Semantic search
/explore --mode=semantic "How to implement JWT refresh token?"

# Hybrid search (semantic + literal)
/explore --mode=semantic --hybrid "Authentication flow with OAuth"

# Context optimization (70-85% token savings)
/explore --mode=semantic --optimize "Payment gateway integration"

# Ranking (relevance ranking)
/explore --mode=semantic --ranking "User registration with email verification"
```

### Grepai Optimization Flags

| Flag | Description | Token Savings |
|------|-------------|---------------|
| `--optimize` | Signatures only | 70-85% |
| `--hybrid` | Semantic + literal | 2x precision |
| `--limit=N` | Limit to N results | Variable |
| `--ranking` | Relevance ranking | 2x accuracy |

## Subagent Collaboration

### Searcher Subagent

**Purpose:** Search via grepai

**Launched by:** All modes (semantic search)

**Capabilities:**
- Query understanding
- Semantic search via grepai
- Hybrid search (semantic + literal)
- Relevance ranking
- Result extraction

**Output:** Ranked results with context

### Analyzer Subagent

**Purpose:** Code and structure analysis

**Launched by:** Deep mode (--mode=deep)

**Capabilities:**
- File structure analysis
- Dependency graph
- Pattern identification
- Architecture analysis
- Convention detection

**Output:** Comprehensive analysis report

## Best Practices

1. **Start with semantic search** - Use /explore --mode=semantic first
2. **Choose appropriate mode** - deep for understanding, quick for finding
3. **Use type flags** - Specify what you're looking for
4. **Leverage grepai** - Native integration, 75% token savings
5. **Review outputs** - Check generated files for insights

## Integration

- **Reads from:** Codebase, docs/, web search
- **Writes to:** Terminal, .claude/.smite/explore-*.md
- **Works with:** All SMITE agents
- **Replaces:** basics/explore, toolkit/explore, builder/explore, ralph/analyze

---

*Explore Skill v1.0.0 - Unified code exploration*
