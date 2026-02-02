---
name: learn
description: Auto-learning system - Captures knowledge from sessions
version: 1.0.0
---

# Learn Skill - Auto-Learning

## Mission

Capture and organize knowledge from Claude Code sessions to make future sessions smarter.

## Core Principles

- **Automatic extraction** - Learn from every significant session
- **Safe accumulation** - Store in `rules/project/learnings.md`, not main CLAUDE.md
- **User approval** - Always show changes before applying
- **Organized structure** - Patterns, decisions, solutions, pitfalls

## Usage

```bash
/learn --recent           # Learn from last session
/learn --from=session-id  # Learn from specific session
/learn --all              # Learn from all unprocessed sessions
/learn --show             # Show current learnings
```

## What Gets Extracted

### 1. Patterns Discovered
```typescript
// Example: Project-specific naming
export const useAuth = () => { ... }  // Not useAuthentication
```

### 2. Architecture Decisions
```
Decision: Use Server Actions instead of API routes
Reason: Better type safety, simpler code
Date: 2025-02-02
```

### 3. Reusable Solutions
```
Problem: Prisma connection pooling in serverless
Solution: Use lazy singleton pattern
Files: src/lib/db.ts
```

### 4. Pitfalls to Avoid
```
Error: Vercel timeout on cold start
Cause: Prisma lazy loading
Fix: Warm connection on edge function init
```

## Extraction Template

For each session, extract:

```markdown
## Session Learning - [Date]

### Task Accomplished
[Brief description]

### Files Modified
- `path/to/file` - [reason]

### Patterns Found
[New conventions discovered]

### Technical Decisions
[Choices made and why]

### Problems Solved
[Issues and resolutions]

### Key Takeaways
[What to remember next time]
```

## Output Format

Proposed update to `rules/project/learnings.md`:

```markdown
## New Learnings - [Date]

### Patterns
- [Pattern 1]: [description]

### Decisions
- [Decision 1]: [reason]

### Solutions
- [Solution 1]: [code reference]

### Pitfalls
- [Pitfall 1]: [symptom → fix]

---
**Apply these changes?** (y/n)
```

## Integration

Auto-extracted at end of:
- `/implement --epct` (if ≥3 files)
- `/implement --builder` (always)
- `/implement --predator` (always)
- `/refactor --full` (always)
- `/explore --mode=deep` (if patterns found)

## Configuration

```json
{
  "learn": {
    "enabled": true,
    "target": "rules/project/learnings.md",
    "autoExtract": true,
    "minComplexity": 3,
    "requireApproval": true
  }
}
```

---

*Learn Skill v1.0.0*
