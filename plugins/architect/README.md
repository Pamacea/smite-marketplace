# Architect

> Design & strategy agent (init + strategy + design + brainstorm)

## 🎯 Purpose

Provides complete architectural guidance from project initialization to design specifications. Generates specs that guide Builder implementation with **Spec-Lock Policy** enforcement.

**Target Audience**: Developers starting new projects or needing system design guidance

## 🚀 Quick Start

```bash
# Install
/plugin install architect@smite

# Initialize project
/design --mode=init "Setup Next.js 14 with TypeScript and Tailwind"

# Create design system
/design --mode=design "Create modern design system with tokens"

# Business strategy
/design --mode=strategy "SaaS platform pricing model"

# Brainstorm solutions
/design --mode=brainstorm "How to improve user retention"
```

## 📖 Usage

### Init Mode - New Projects

```bash
/design --mode=init "Setup Next.js with shadcn/ui"
```

**Output**: Project structure, configs, dependencies, setup instructions

### Design Mode - UI/UX

```bash
/design --mode=design "Create design system with primary colors"
```

**Output**: Design tokens, component library, user flows, style guide

### Strategy Mode - Business Planning

```bash
/design --mode=strategy "SaaS dashboard with analytics"
```

**Output**: Market analysis, competitive landscape, business plan, KPIs

### Brainstorm Mode - Creative Solutions

```bash
/design --mode=brainstorm "Improve mobile app engagement"
```

**Output**: Solution concepts, innovation roadmap, implementation plan

## 🔧 Configuration

### Required

- **Context**: Project requirements or existing codebase
- **Output location**: `.claude/.smite/current_spec.md`

### Optional

- **`--mode`**: init | strategy | design | brainstorm
- **`--tech`**: Force tech stack (nextjs, rust, python)

## 🔗 Integration

- **Requires**: toolkit (semantic search for codebase analysis)
- **Feeds into**: builder (implements from spec)
- **Works with**: explorer (understand existing patterns)

**Workflow**: Architect → Builder → Finalize

**Spec-Lock**: Builder cannot deviate from Architect's spec

## 📚 Documentation

- **[Spec-First Guide](../../docs/SPEC_FIRST.md)** - Complete spec-driven workflow
- **[Design System](../../docs/plugins/architect/)** - Architecture documentation

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Spec incomplete | Use toolkit to analyze existing patterns first |
| Builder deviates | Spec-Lock prevents deviation - update spec instead |
| Tech stack unclear | Let Architect auto-detect based on requirements |

## 🎯 Spec-Lock Policy

**Critical**: Once spec is generated, Builder cannot deviate.

**If gap detected**:
1. Builder stops and requests spec update
2. Architect revises spec
3. Builder resumes with complete spec

**Why**: Prevents architecture drift and scope creep.

---
**Version**: 3.1.0 | **Category**: development | **Author**: Pamacea
