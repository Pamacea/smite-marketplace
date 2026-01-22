# 03_EXECUTE - Implementation

## Instructions

### 1. Initialize TodoWrite

Create task list from plan:

```markdown
## Implementation Tasks

### Phase 1: File Creation
- [ ] Create path/to/file1.ts
- [ ] Create path/to/file2.ts

### Phase 2: Modifications
- [ ] Modify path/to/file3.ts
- [ ] Modify path/to/file4.ts

### Phase 3: Integration
- [ ] Update imports/exports
- [ ] Verify wiring
```

### 2. Implement Step by Step

For each task in the plan:

#### Create New Files
```markdown
#### Task: Create ${file}

**File**: ${file}
**Purpose**: ${purpose}
**Dependencies**: ${deps}

<Implementation details>

✅ Created ${file}
```

#### Modify Existing Files
```markdown
#### Task: Modify ${file}

**File**: ${file}
**Changes**: ${changes}
**Risk**: ${risk}

<Implementation details>

✅ Modified ${file}
```

### 3. Update TodoWrite

After each task:
```markdown
- Mark task as [completed]
- Move to next task
- Update progress
```

### 4. Track Changes

Maintain change log:

```markdown
## Change Log

### Files Created
- `path/to/file1.ts` - 125 lines
- `path/to/file2.ts` - 87 lines

### Files Modified
- `path/to/file3.ts` - +45/-12 lines
- `path/to/file4.ts` - +23/-5 lines

### Total Changes
- Files created: ${N}
- Files modified: ${M}
- Lines added: ${A}
- Lines removed: ${R}
```

### 5. Follow Best Practices

- **Code Style**: Match existing conventions
- **Naming**: Use clear, descriptive names
- **Comments**: Minimal, only when necessary
- **DRY**: Don't repeat yourself (x2 ok, x3 extract)
- **Scope**: Stay strictly in scope

### 6. Save Implementation Log

Save to `.predator/runs/${timestamp}/03_EXECUTE.md`

### Output

```
✅ EXECUTE COMPLETE
Implementation Summary:
- Files created: ${N}
- Files modified: ${M}
- Lines added: ${A}
- Lines removed: ${R}

All tasks completed:
${task list}

Implementation log saved to: .predator/runs/${timestamp}/03_EXECUTE.md

Next: 04_VALIDATE
```
