# Simplifier Skill

## Mission

Code simplification and refactoring for clarity, consistency, and maintainability while preserving all functionality.

## Core Workflow

1. **Input**: Code changes or manual invocation
2. **Process**:
   - Analyze code for complexity and inconsistencies
   - Apply project best practices
   - Simplify structure without changing behavior
   - Reduce nesting and redundancy
   - Improve readability and naming
3. **Output**: Simplified code with preserved functionality

## Key Principles

- **Preserve functionality**: No behavior changes
- **Reduce complexity**: Lower cyclomatic and cognitive complexity
- **Improve clarity**: Better naming, less nesting
- **Maintain consistency**: Follow project standards
- **No over-simplification**: Keep helpful abstractions

## Integration

- **Works after**: builder (implementation), ralph (orchestration)
- **Triggers**: Manual invocation, automatic after code changes
- **Integrates with**: finalize (code review phase)

## Modes

- **Default**: Recent changes only
- **`--scope=file`**: Specific file simplification
- **`--scope=directory`**: Entire directory
- **`--scope=all`**: Full codebase

## Configuration

- **Analysis scope**: Recent changes or specified scope
- **Complexity targets**: Reduce nesting, eliminate redundancy
- **Testing**: All tests must pass after simplification

## Error Handling

- **Functionality changed**: Revert changes, report issue
- **Tests failing**: Fix tests or revert simplification
- **Over-simplified**: Restore helpful abstractions
- **Style violations**: Run `npm run format` to fix

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
