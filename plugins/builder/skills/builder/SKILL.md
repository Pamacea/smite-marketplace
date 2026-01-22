# Builder Skill

## Mission

Implement features from Architect's specifications with framework specialization, following Spec-Lock Policy to prevent architecture drift.

## Core Workflow

1. **Input**: Feature request or spec from Architect
2. **Process**:
   - Read spec from `.claude/.smite/current_spec.md`
   - Auto-detect tech stack or use `--tech` flag
   - Search existing patterns using toolkit (mandatory)
   - Implement following spec exactly
   - Write tests (unit + integration)
   - Validate with typecheck + lint
3. **Output**: Complete, tested feature matching spec

## Key Principles

- **Spec-Lock**: Implement EXACTLY what Architect specified, no more/no less
- **Toolkit-first**: Always search for existing patterns before implementing
- **Type-safe**: Zod validation, TypeScript strict mode
- **Framework patterns**: Follow best practices (Server Components, async/await)
- **Clean code**: DRY, immutable, pure functions

## Integration

- **Requires**: architect (spec), toolkit (semantic search)
- **Reads from**: `.claude/.smite/current_spec.md`
- **Works with**: finalize (QA after implementation)
- **Tech stacks**: Next.js, Rust, Python

## Tech Specialization

- **`--tech=nextjs`**: React 18, Next.js 14, Server Components, Prisma, TanStack Query
- **`--tech=rust`**: Tokio, Axum, SQLx, Serde, async/await
- **`--tech=python`**: FastAPI, Pydantic, SQLAlchemy, async
- **`--design`**: Figma/SVG to code, design tokens, responsive

## Configuration

- **Spec location**: `.claude/.smite/current_spec.md`
- **Auto-detection**: Analyzes package.json, imports, file structure
- **Test framework**: Vitest (Next.js), cargo test (Rust), pytest (Python)

## Error Handling

- **Spec incomplete**: Stop and request Architect to update spec
- **Tech stack unclear**: Auto-detect or use `--tech` flag
- **Pattern not found**: Use toolkit to search existing implementations
- **Typecheck fails**: Fix errors before marking complete

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
