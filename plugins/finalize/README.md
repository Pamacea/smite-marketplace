# Finalize

> QA & documentation agent (test + review + lint + docs)

## 🎯 Purpose

Ensures code quality AND documentation completeness through comprehensive testing, review, linting, and documentation updates.

**Target Audience**: Developers validating features before commit/merge

## 🚀 Quick Start

```bash
# Install
/plugin install finalize@smite

# Complete finalization (QA + Docs)
/finalize

# QA only
/finalize --mode=qa

# Documentation only
/finalize --mode=docs
```

## 📖 Usage

### Complete Finalization

```bash
/finalize
```

**What it does**:
1. Run all tests (unit, integration, E2E)
2. Code review (anti-patterns, type safety)
3. Fix linting issues (ESLint, Prettier)
4. Performance audit (Lighthouse, bundle size)
5. Update documentation (README, API docs)
6. Create commit with proper message

### QA Mode

```bash
/finalize --mode=qa
/finalize --mode=qa --type=test      # Run tests only
/finalize --mode=qa --type=review    # Code review only
/finalize --mode=qa --type=lint      # Fix linting only
/finalize --mode=qa --type=perf      # Performance audit
/finalize --mode=qa --type=security  # Security audit
/finalize --mode=qa --type=coverage  # Coverage analysis
```

### Documentation Mode

```bash
/finalize --mode=docs
/finalize --mode=docs --type=readme   # Update README
/finalize --mode=docs --type=api      # Generate API docs
/finalize --mode=docs --type=sync     # Sync all documentation
```

## 🔧 Configuration

### Required

- **Project**: Codebase with tests
- **Test framework**: Vitest, Jest, Mocha, or pytest

### Optional

- **`--mode`**: qa | docs (default: both)
- **`--type`**: Specific task type (test, review, lint, perf, readme, api, sync)
- **Coverage target**: Default 80%

## 🔗 Integration

- **Works after**: builder (implementation), ralph (orchestration)
- **Integrates with**: toolkit (search for patterns), quality-gate (validation)
- **Triggers**: Manual, pre-commit hook, Ralph completion

**Workflow**: Builder → Finalize → Commit

## 📚 Documentation

- **[Quality Gate](../../docs/plugins/quality-gate/)** - Automated validation
- **[Testing Guide](../../docs/plugins/quality-gate/TESTING.md)** - Test strategies

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests failing | Check test output, fix failing tests |
| Lint errors | Run `npm run lint:fix` or `npm run format` |
| Coverage low | Add more tests to reach 80% target |
| Performance poor | Run Lighthouse audit, fix bottlenecks |

## ✅ Quality Standards

**Zero-Debt Standard**:
- ✅ 0 TypeScript errors
- ✅ 0 ESLint errors
- ✅ 80%+ test coverage
- ✅ Lighthouse 95+ (web apps)
- ✅ Documentation complete

---
**Version**: 3.1.0 | **Category**: quality | **Author**: Pamacea
