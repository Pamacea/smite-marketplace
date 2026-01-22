# Finalize Skill

## Mission

Ensure code quality AND documentation completeness through comprehensive testing, review, linting, and documentation updates.

## Core Workflow

1. **Input**: Code changes or feature completion
2. **Process**:
   - Run tests (unit, integration, E2E)
   - Code review (anti-patterns, type safety, technical debt)
   - Fix linting issues (ESLint, Prettier, TypeScript)
   - Performance audit (Lighthouse, bundle size)
   - Update documentation (README, API docs, guides)
   - Create commit with proper message
3. **Output**: Validated, tested, documented feature ready for merge

## Key Principles

- **Zero-debt**: Fix all issues before marking complete
- **Test coverage**: 80% minimum target
- **Type safety**: No `any`, no `@ts-ignore`
- **Documentation**: Always keep docs in sync with code
- **Quality gates**: Use automated validation

## Integration

- **Works after**: builder, ralph
- **Integrates with**: toolkit (search patterns), quality-gate (validation)
- **Triggers**: Manual, pre-commit hooks, Ralph completion

## Modes

- **`--mode=qa`**: Testing + review + lint + performance (no docs)
- **`--mode=docs`**: Documentation updates only (README, API, sync)
- **Default**: Both QA + docs

## Configuration

- **Test frameworks**: Vitest, Jest, Mocha, pytest
- **Linting**: ESLint + Prettier
- **Coverage target**: 80% minimum
- **Performance**: Lighthouse 95+ (web apps)

## Error Handling

- **Tests failing**: Fix failing tests, re-run
- **Lint errors**: Run `lint:fix` or `format`, re-validate
- **Coverage low**: Add tests for uncovered code
- **Performance poor**: Optimize bundle, fix bottlenecks

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
