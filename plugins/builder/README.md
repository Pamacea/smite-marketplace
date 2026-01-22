# Builder

> Implementation agent with tech specialization (Next.js, Rust, Python)

## 🎯 Purpose

Implements features from Architect's specifications with tech stack specialization. Follows **Spec-Lock Policy** - cannot deviate from approved spec.

**Target Audience**: Developers implementing features from specifications

## 🚀 Quick Start

```bash
# Install
/plugin install builder@smite

# Implement from spec
/build --feature=user-auth

# Auto-detect tech stack
/build "Add task CRUD operations"

# Force tech stack
/build --tech=nextjs "Build dashboard with charts"
/build --tech=rust "Implement API with Axum"
/build --tech=python "Create FastAPI endpoints"
```

## 📖 Usage

### From Architect Spec

```bash
# 1. Architect generates spec
/design --mode=design "User authentication system"

# 2. Builder implements from spec
/build --feature=user-auth
```

### Auto-Detection Mode

```bash
/build "Implement search and filtering"
```

Builder analyzes codebase and detects:
- Framework (Next.js, Express, etc.)
- Language (TypeScript, Rust, Python)
- Patterns (server components, hooks, etc.)
- Database (Prisma, SQLAlchemy, SQLx)

### Tech Specialization

**Next.js**:
- Server Components by default
- Server Actions for mutations
- TanStack Query for client state
- Prisma for database

**Rust**:
- Tokio async runtime
- Axum web framework
- SQLx for database
- Error handling with Result/Option

**Python**:
- FastAPI framework
- Pydantic validation
- SQLAlchemy 2.0 async
- Type hints with mypy

### Design Mode

```bash
/build --design "Convert Figma design to components"
```

- Figma → React components
- SVG optimization
- Design tokens extraction
- Responsive implementation

## 🔧 Configuration

### Required

- **Spec file**: `.claude/.smite/current_spec.md` (from Architect)
- **Codebase**: Existing project structure

### Optional

- **`--tech`**: Force tech stack (nextjs, rust, python)
- **`--design`**: Enable design-to-code mode
- **`--feature`**: Specific feature to implement

## 🔗 Integration

- **Requires**: architect (spec generation), toolkit (semantic search)
- **Works with**: finalize (QA after implementation)
- **Spec-Lock**: Cannot deviate from Architect's spec

**Workflow**: Architect (spec) → Builder (implement) → Finalize (QA)

## 📚 Documentation

- **[Spec-First Guide](../../docs/SPEC_FIRST.md)** - Spec-driven workflow
- **[Tech Stack Docs](../../docs/plugins/builder/)** - Framework-specific guides

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Spec incomplete | Use `/design` to update Architect's spec |
| Tech stack unclear | Let Builder auto-detect or use `--tech` flag |
| Pattern inconsistent | Use toolkit to search existing patterns first |

## 🎯 Spec-Lock Policy

**Critical**: Builder implements EXACTLY what Architect specified.

**If gap detected**:
1. Builder stops and requests spec update
2. Architect revises spec
3. Builder resumes

**Why**: Prevents architecture drift and scope creep.

---
**Version**: 3.1.0 | **Category**: development | **Author**: Pamacea
