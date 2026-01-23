# 02_PLAN - Strategy Creation

## Instructions

### 1. Create File-by-File Strategy

Based on analysis, create detailed implementation plan:

#### Files to Create
```
- path/to/new-file1.ts
  - Purpose: <what it does>
  - Dependencies: <what it needs>
  - Size estimate: <small/medium/large>

- path/to/new-file2.ts
  ...
```

#### Files to Modify
```
- path/to/existing-file1.ts
  - Changes: <what to add/modify>
  - Risk level: <low/medium/high>
  - Dependencies affected: <list>

- path/to/existing-file2.ts
  ...
```

### 2. Define Acceptance Criteria

Clear, measurable criteria:

```markdown
## Acceptance Criteria

### Functional Requirements
- [ ] <Requirement 1>
- [ ] <Requirement 2>
- [ ] <Requirement 3>

### Non-Functional Requirements
- [ ] Code passes linting
- [ ] Code passes typecheck
- [ ] Build succeeds
- [ ] Tests pass (if applicable)

### Quality Standards
- [ ] Follows existing patterns
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Clear variable names
```

### 3. Implementation Order

Sequence the work:

```markdown
## Implementation Steps

1. **Setup** (Create new files)
   - [ ] file1.ts
   - [ ] file2.ts

2. **Core Logic** (Implement main functionality)
   - [ ] file3.ts modifications
   - [ ] file4.ts modifications

3. **Integration** (Wire components together)
   - [ ] Update imports
   - [ ] Add exports

4. **Testing** (Verify implementation)
   - [ ] Manual testing
   - [ ] Automated tests (if applicable)
```

### 4. Risk Assessment

Identify potential issues:

```markdown
## Risk Assessment

### High Risk Items
- <Risk 1> - <Mitigation strategy>
- <Risk 2> - <Mitigation strategy>

### Medium Risk Items
- <Risk 3> - <Mitigation strategy>

### Low Risk Items
- <Risk 4> - <Mitigation strategy>
```

### 5. User Approval (unless -auto)

If not in auto mode, ask user:

```
📋 PLAN READY

Files to Create: ${N}
Files to Modify: ${M}
Estimated Complexity: ${low/medium/high}

Acceptance Criteria:
${criteria}

Ready to proceed? (y/n)
```

### 6. Save Plan

Save to `.claude/.smite/.predator/runs/${timestamp}/02_PLAN.md`

### Output

```
✅ PLAN COMPLETE
- ${N} files to create
- ${M} files to modify
- ${K} acceptance criteria defined
- Plan saved to: .claude/.smite/.predator/runs/${timestamp}/02_PLAN.md

Next: 03_EXECUTE
```
