# Refactor Agent Documentation

Complete documentation for the Refactor agent - systematic code refactoring with validation and resolution.

## Quick Links

### Refactor Documentation
- **[Complete Workflow Guide](REFACTOR_WORKFLOW.md)** - Step-by-step workflow guide
- **[Command Reference](../../commands/refactor.md)** - Command flags and usage
- **[Skill Definition](../../skills/refactor/SKILL.md)** - Agent skill and capabilities

### Workflow Steps
- **[Step 1: Analyze](../../steps/refactor/01-analyze.md)** - Detect code quality issues (`-a`)
- **[Step 2: Review](../../steps/refactor/02-review.md)** - Review and prioritize (`-r`)
- **[Step 3: Validate](../../steps/refactor/03-validate.md)** - Validate changes (`-v`)
- **[Step 4: Resolve](../../steps/refactor/04-resolve.md)** - Apply refactoring (`-x`)
- **[Step 5: Verify](../../steps/refactor/05-verify.md)** - Verify results (`-t`)

### Subagents
- **[Reviewer Subagent](../../skills/reviewer/SKILL.md)** - Code review and prioritization
- **[Validator Subagent](../../skills/validator/SKILL.md)** - Safety and validation
- **[Resolver Subagent](../../skills/resolver/SKILL.md)** - Refactoring implementation

### Other Mobs Agents
See [../../README.md](../../README.md) for complete mobs plugin documentation.

## Features

### 🔄 Systematic Workflow

The Refactor agent provides a structured 5-step process:

1. **Analyze** - Detect all code quality issues
2. **Review** - Prioritize and create action plan
3. **Validate** - Ensure changes are safe
4. **Resolve** - Apply refactoring patterns
5. **Verify** - Confirm improvements

### 🎯 Subagent Collaboration

Three specialized subagents ensure quality:

- **Reviewer** - Expert code review and prioritization
- **Validator** - Comprehensive safety validation
- **Resolver** - Pattern-based refactoring implementation

### 📊 Metrics & Tracking

Track improvements with before/after metrics:
- Cyclomatic complexity
- Test coverage
- Maintainability index
- Technical debt score

### ✅ Validation-First Approach

Every change is validated before implementation:
- Functionality preservation verification
- Test coverage analysis
- Impact assessment
- Risk evaluation

## Quick Start

```bash
# Quick refactor (low-risk items)
/refactor --quick

# Complete workflow
/refactor -a -r -v -x -t --scope=recent

# Step-by-step
/refactor -a              # Detect issues
/refactor -r              # Plan changes
/refactor -v --item=3     # Validate item 3
/refactor -x --item=3     # Resolve item 3
/refactor -t --item=3     # Verify item 3
```

## What Gets Detected

- **Complexity Issues** - High cyclomatic/cognitive complexity
- **Code Smells** - God objects, long parameter lists, etc.
- **Duplications** - Repeated code patterns
- **Maintainability** - Poor naming, magic values, dead code

## Common Patterns

- Extract Method
- Introduce Parameter Object
- Replace Magic Numbers
- Decompose Conditional
- Extract Class
- Move Method

## Best Practices

1. **Always validate before resolving** - Safety first
2. **Start with quick wins** - Build momentum
3. **Test continuously** - After each change
4. **Commit often** - Small, logical commits
5. **Document changes** - Clear explanations

## Output Files

All workflow artifacts saved in `.claude/.smite/`:

- `refactor-analysis.md` - Detected issues
- `refactor-review.md` - Prioritized action plan
- `refactor-validation-[ID].md` - Safety assessment
- `refactor-resolution-[ID].md` - Changes applied
- `refactor-verification-[ID].md` - Final verification

## Version

**Version**: 2.0.0 (formerly Simplifier)
**Last Updated**: 2025-01-22

## Resources

- [Refactoring.guru](https://refactoring.guru/) - Refactoring patterns
- [Martin Fowler's Book](https://refactoring.com/) - Industry standard
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/) - Best practices
