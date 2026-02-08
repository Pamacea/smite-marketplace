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
   grepai search "pattern" | /studio explore --mode=semantic "query"

🎯 DECISION TREE:
   Need to search? → grepai or /studio explore --mode=semantic
   Need to explore? → /studio explore --mode=deep
   Need to read?    → Read tool (NOT cat/head)
═══════════════════════════════════════════════════

---

## Mission

Provide unified code exploration through deep analysis, native semantic search, and multi-source research.

## 📋 Plan Mode First (OBLIGATOIRE)

**TOUJOURS** créer un plan avant toute exploration complexe.

### Quand Plan Mode est requis

- Mode deep
- Lancer des subagents pour exploration
- Recherche multi-source
- Impact analysis

### Exception

Recherche simple: mode quick/semantic, 1-2 fichiers

### Template de Plan

```markdown
## Plan: Explorer [Sujet]

### Objectifs
- [ ] [Comprendre X, trouver Y, analyser Z]

### Sources
- Codebase: [quelles parties]
- Documentation: [quels fichiers]
- Web: [quelles recherches]

### Subagents (si applicable)
1. **Recherche codebase**: "[Question précise]"
2. **Recherche web**: "[Question précise]"
3. **Analyse patterns**: "[Question précise]"

### Résultat attendu
- [ ] Liste de fichiers pertinents
- [ ] Diagramme d'architecture (si applicable)
- [ ] Explication du fonctionnement

### Sortie
- Fichier: `.claude/.smite/studio explore-[topic].md`

**Confirmer pour procéder ?**
```

## ⚡ Auto-Parallel (DEFAULT)

**Le parallélisme s'active AUTOMATIQUEMENT** pour les explorations complexes.

### Critères d'Auto-Activation

| Critère | Seuil | Parallel |
|---------|-------|----------|
| Mode | deep | 2-3 |
| Sources nécessaires | ≥ 3 (code + web + docs) | 3 |
| Complexité de la requête | architecture/patterns | 2 |

### Désactiver

```bash
/studio explore --mode=deep --no-parallel "Simple question"
```

---

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

Output: .claude/.smite/studio explore-deep.md
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

Output: .claude/.smite/studio explore-patterns.md
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

Output: .claude/.smite/studio explore-impact.md
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

### --parallel=N / AUTO (Multi-Angle Exploration)

**Purpose:** Explore from multiple angles simultaneously

**⚡ AUTO-ACTIVÉ** pour mode deep (multi-source requis)

**Désactiver avec:** `--no-parallel`

**How it works:**
```
1. Create N Git worktrees alongside main repo
2. Each worktree explores different aspect
3. Results merged for comprehensive understanding
4. Worktrees cleaned up after completion
```

**Parallel Strategies by Mode:**

| Mode | --parallel=2 | --parallel=3 | --parallel=4 |
|------|--------------|--------------|--------------|
| `--deep` | wt-1: Codebase, wt-2: Web | wt-1: Codebase, wt-2: Web, wt-3: Docs | wt-1: Codebase, wt-2: Web, wt-3: Docs, wt-4: Patterns |
| `--quick` | wt-1: Semantic, wt-2: Literal | wt-1: Semantic, wt-2: Literal, wt-3: File-search | N/A |
| `--pattern` | wt-1: Design patterns, wt-2: Code patterns | wt-1: Design, wt-2: Code, wt-3: Architecture | N/A |
| `--impact` | wt-1: Upstream deps, wt-2: Downstream consumers | wt-1: Upstream, wt-2: Downstream, wt-3: Config | N/A |
| `--semantic` | wt-1: Code search, wt-2: Docs search | wt-1: Code, wt-2: Docs, wt-3: Web | N/A |

**Examples:**
```bash
# Deep exploration with codebase + web research
/studio explore --mode=deep --parallel=2 "How does the payment system work?"

# Comprehensive multi-source research
/studio explore --mode=deep --parallel=4 "Authentication architecture"

# Pattern search from multiple angles
/studio explore --mode=pattern --parallel=2 "Repository pattern usage"

# Complete impact analysis
/studio explore --mode=impact --parallel=3 "Impact of changing JWT library"
```

**Merge Strategy:**
- Consolidate findings from all worktrees
- Deduplicate file references
- Merge architecture diagrams
- Create unified exploration report

**Best for:** Complex topics, multi-source research, comprehensive understanding

## Type Flags

### --type=architecture

Explore design and architecture:

```bash
/studio explore --mode=deep --type=architecture "Design of SaaS dashboard"

# Architecture only (skip implementation)
/studio explore --mode=deep --type=architecture "Microservices design"
```

**Focus:**
- Design system
- Component architecture
- Data flow
- API contracts

### --type=code

Explore implementation details:

```bash
/studio explore --mode=deep --type=code "Implementation of auth system"

# Code only (skip design)
/studio explore --mode=deep --type=code "JWT token logic"
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
/studio explore --mode=pattern --type=patterns "Repository pattern"

# With output
/studio explore --mode=pattern --type=patterns --output=files "Factory pattern"
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
/studio explore --mode=deep --type=tests "Integration tests for payments"

# Test patterns
/studio explore --mode=pattern --type=tests "Test fixture patterns"
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
/studio explore --mode=quick --depth=shallow "Auth components"
```

**Analysis:**
- File names
- Directory structure
- Exports
- Minimal code snippets

### --depth=medium (Standard)

Standard-depth exploration:

```bash
/studio explore --mode=deep --depth=medium "Payment processing"
```

**Analysis:**
- File structure
- Dependencies
- Key functions
- Main patterns

### --depth=deep (Thorough)

Deep exploration with full analysis:

```bash
/studio explore --mode=deep --depth=deep "Microservices architecture"
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
/studio explore --mode=quick --output=files "Auth components"
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
/studio explore --mode=deep --output=summary "Payment system"
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
/studio explore --mode=deep --output=details "Auth system"
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
/studio explore --mode=deep --format=markdown "Payment processing"
```

### --format=json (Machine-Readable)

Output in JSON format:

```bash
/studio explore --mode=quick --format=json "Auth components"
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
/studio explore --mode=deep --format=tree "Project structure"
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
/studio explore --mode=semantic "How to implement JWT refresh token?"

# Hybrid search (semantic + literal)
/studio explore --mode=semantic --hybrid "Authentication flow with OAuth"

# Context optimization (70-85% token savings)
/studio explore --mode=semantic --optimize "Payment gateway integration"

# Ranking (relevance ranking)
/studio explore --mode=semantic --ranking "User registration with email verification"
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

1. **Start with semantic search** - Use /studio explore --mode=semantic first
2. **Choose appropriate mode** - deep for understanding, quick for finding
3. **Use type flags** - Specify what you're looking for
4. **Leverage grepai** - Native integration, 75% token savings
5. **Review outputs** - Check generated files for insights

## Integration

- **Reads from:** Codebase, docs/, web search
- **Writes to:** Terminal, .claude/.smite/studio explore-*.md
- **Works with:** All SMITE agents
- **Replaces:** basics/studio explore, toolkit/studio explore, builder/studio explore, ralph/analyze

---

*Explore Skill v1.0.0 - Unified code exploration*
