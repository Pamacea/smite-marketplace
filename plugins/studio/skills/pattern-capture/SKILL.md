---
name: pattern-capture
description: Capture and document reusable code patterns. Use when a successful implementation could be reused in the future.
category: workflow
version: 1.0.0
tags: [patterns, documentation, reuse, best-practices]
triggers: [capture-pattern, save-pattern, document-pattern]
lazy_load: true
---

# Pattern Capture Skill

## Mission

Automatically capture, document, and organize successful code patterns for future reuse. Transform ad-hoc solutions into reusable knowledge.

## When to Use

- **After successful feature implementation**: "That went well, let me save this pattern"
- **When solving a tricky problem**: Document the solution for next time
- **During refactoring**: Extract reusable patterns from existing code
- **Team knowledge sharing**: Document patterns for others to use

## Pattern Template

Every captured pattern follows this structure:

```markdown
# Pattern: [Descriptive Name]

## Context
[When to use this pattern - problem it solves]

## Before
[Code state before applying pattern]

## After
[Code state after applying pattern]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Benefits
- [Benefit 1]
- [Benefit 2]

## Trade-offs
- [Trade-off 1]
- [Trade-off 2]

## Related Patterns
- [Pattern 1]
- [Pattern 2]

## Examples
### Example 1: [Use case]
\`\`\`language
[Code example]
\`\`\`

### Example 2: [Use case]
\`\`\`language
[Code example]
\`\`\`
```

## Capture Workflow

### Step 1: Identify Pattern

Ask yourself:
- What problem did this solve?
- Is this reusable? (Used 3+ times = good candidate)
- What makes this pattern special?

### Step 2: Extract Context

Document:
- **Technology stack**: What languages/frameworks?
- **Problem domain**: Business logic, UI, data, etc.
- **Complexity**: Simple, medium, complex
- **Prerequisites**: What else must exist?

### Step 3: Document Steps

Break down into clear, actionable steps:
1. What to check first
2. What to modify
3. What to verify

### Step 4: Add Examples

Provide:
- **Minimal example**: Simplest case
- **Real-world example**: Actual use case
- **Edge cases**: What to watch for

### Step 5: Categorize

Add tags for discovery:
- **Technology**: `rust`, `nextjs`, `prisma`
- **Domain**: `api`, `ui`, `database`, `auth`
- **Complexity**: `simple`, `medium`, `complex`

## Pattern Categories

### Architecture Patterns
- **Layered architecture**: Separation of concerns
- **CQRS**: Command Query Responsibility Segregation
- **Event-driven**: Async communication patterns
- **Microservices**: Service boundaries

### Code Patterns
- **Error handling**: Result types, exceptions
- **Async patterns**: Promises, async/await, streams
- **Validation**: Input validation, schema validation
- **State management**: Local, global, server state

### Database Patterns
- **Query optimization**: Indexing, N+1 prevention
- **Transaction patterns**: ACID guarantees
- **Migration patterns**: Safe schema changes
- **Caching strategies**: When and what to cache

### Testing Patterns
- **Test structure**: Arrange-Act-Assert
- **Mock strategies**: What to mock vs real
- **Test data**: Factories, fixtures
- **Coverage**: Unit vs integration vs E2E

### Security Patterns
- **Authentication**: JWT, sessions, OAuth
- **Authorization**: RBAC, ABAC, policy checks
- **Input validation**: Sanitization, type checking
- **Output encoding**: XSS prevention

## Auto-Capture Triggers

This skill can be automatically triggered when:

1. **Successful test after failure**: Pattern was the solution
2. **Multi-file refactoring**: Indicates reusable approach
3. **Complex problem solved**: Document for future reference
4. **User explicitly requests**: `/pattern-capture`

## Storage Location

Patterns are stored in:
```
plugins/agents/workflow/patterns/
├── rust/
│   ├── async-refactor.md
│   ├── error-handling.md
│   └── api-endpoint.md
├── nextjs/
│   ├── server-components.md
│   ├── data-fetching.md
│   └── form-validation.md
└── prisma/
    ├── schema-design.md
    ├── query-optimization.md
    └── migrations.md
```

## Discovery

Find patterns using:
```bash
# Search by technology
/pattern list rust

# Search by domain
/pattern list api

# Search by keyword
/pattern list async

# Get specific pattern
/pattern show rust/async-refactor
```

## Quality Checklist

Before saving a pattern, verify:

- [ ] **Clear purpose**: Problem statement is obvious
- [ ] **Reproducible**: Steps are detailed enough
- [ ] **Tested examples**: Code examples actually work
- [ ] **Trade-offs documented**: Not overselling benefits
- [ ] **Well-categorized**: Easy to find later
- [ ] **Version specific**: Notes on tech versions if relevant

## Example: Capturing a Rust Pattern

### Trigger
```bash
/studio build --capture-pattern "Rust async refactor"
```

### Generated Pattern
```markdown
# Pattern: Rust Async Refactor

## Context
Refactor blocking Rust code to use async/await with proper error handling.

## Before
\`\`\`rust
pub fn get_user(id: u32) -> User {
    let conn = db::connect().unwrap();
    let user = conn.query_user(id).unwrap();
    user
}
\`\`\`

## After
\`\`\`rust
pub async fn get_user(id: u32) -> Result<User, DbError> {
    let mut conn = db::connect().await?;
    let user = conn.query_user(id).await?;
    Ok(user)
}
\`\`\`

## Steps
1. Change function signature to `async fn`
2. Change return type to `Result<T, E>`
3. Replace `.unwrap()` with `?` operator
4. Add `.await` to async calls
5. Update call sites to use async/await

## Benefits
- Non-blocking: Other tasks can run during I/O
- Proper error handling: No panics on failure
- Better scalability: Handle more concurrent requests

## Trade-offs
- Complexity: Async code is harder to debug
- Runtime: Requires tokio or async-std
- Not always needed: Blocking is fine for simple scripts

## Related Patterns
- rust-error-handling
- rust-api-endpoint
- tokio-spawning
```

## Integration with Other Skills

This skill works with:
- **tdd-guide**: Capture test patterns
- **code-reviewer**: Extract improvement patterns
- **planner**: Document architectural patterns

## Maintenance

- **Review monthly**: Are patterns still relevant?
- **Update with new tech**: Add patterns for new versions
- **Deprecate old patterns**: Mark as outdated when necessary
- **Merge duplicates**: Consolidate similar patterns

## Success Metrics

A good pattern library:
- ✅ Patterns are found (not recreated)
- ✅ New devs adopt patterns quickly
- ✅ Code consistency improves
- ✅ Fewer repeated discussions
- ✅ Team knowledge grows organically

---

*Version: 1.0.0 | Category: workflow | Last updated: 2026-02-19*
