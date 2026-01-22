# 07_FINISH - Completion

## Instructions

### 1. Generate Summary Report

Compile all workflow data:

```markdown
# Predator Workflow Summary

## Task
${task}

## Execution Time
Start: ${start_time}
End: ${end_time}
Duration: ${duration}

## Workflow Steps
✅ 00_INIT - Configuration complete
✅ 01_ANALYZE - Context gathered
✅ 02_PLAN - Strategy created
✅ 03_EXECUTE - Implementation complete
✅ 04_VALIDATE - Verification passed
${if examine}✅ 05_EXAMINE - Review complete
${if resolve}✅ 06_RESOLVE - Issues fixed
✅ 07_FINISH - Workflow complete

## Deliverables

### Files Created (${N})
- `path/to/file1.ts` - ${purpose}
- `path/to/file2.ts` - ${purpose}

### Files Modified (${M})
- `path/to/file3.ts` - ${changes}
- `path/to/file4.ts` - ${changes}

### Statistics
- Lines added: ${A}
- Lines removed: ${R}
- Files touched: ${T}
- Issues found: ${I}
- Issues resolved: ${R}

## Quality Metrics
- Linting: ✅ PASS
- Type Check: ✅ PASS
- Build: ✅ PASS
- Acceptance Criteria: ${P}/${Total} ✅

## Artifacts
- Analysis: .predator/runs/${timestamp}/01_ANALYZE.md
- Plan: .predator/runs/${timestamp}/02_PLAN.md
- Execution: .predator/runs/${timestamp}/03_EXECUTE.md
- Validation: .predator/runs/${timestamp}/04_VALIDATE.md
${if examine}- Review: .predator/runs/${timestamp}/05_EXAMINE.md
${if resolve}- Resolution: .predator/runs/${timestamp}/06_RESOLVE.md

## Final Status
✅ WORKFLOW COMPLETE
```

### 2. Check -pr Flag

#### If -pr flag is set:

Create pull request:

```bash
# Commit changes
git add .
git commit -m "feat: ${task}

- Implement ${task}
- Files created: ${N}
- Files modified: ${M}
- All acceptance criteria met
- Validation passed
${if examine}- Code review completed
${if resolve}- All critical issues resolved

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Create PR
gh pr create \
  --title "feat: ${task}" \
  --body "$(cat .predator/runs/${timestamp}/PR_DESCRIPTION.md)" \
  --base main \
  --head feature/$(slugify "${task}")
```

PR Description Template:
```markdown
## Summary
${task}

## Changes
- Files created: ${N}
- Files modified: ${M}

## Validation
- ✅ Linting passed
- ✅ Type check passed
- ✅ Build successful
- ✅ Acceptance criteria met
${if examine}- ✅ Code review completed
${if resolve}- ✅ All critical issues resolved

## Checklist
- [ ] Code follows project patterns
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Clear variable names
- [ ] Tests added/updated (if applicable)

🤖 Generated with [Claude Code](https://claude.com/claude-code) using Predator workflow
```

#### If -pr flag is NOT set:

Complete workflow locally:

```bash
# Commit changes
git add .
git commit -m "feat: ${task}

- Implement ${task}
- Files created: ${N}
- Files modified: ${M}
- All acceptance criteria met

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3. Save Final Report

Save to `.predator/runs/${timestamp}/07_FINISH.md` and `.predator/runs/${timestamp}/SUMMARY.md`

### 4. Clean Up (Optional)

Archive workflow artifacts:

```bash
# If successful, archive
mv .predator/runs/${timestamp} .predator/archive/

# Keep only recent runs in .predator/runs/
```

### Output

```
╔════════════════════════════════════════╗
║         PREDATOR COMPLETE               ║
╠════════════════════════════════════════╣
║                                         ║
║ ✅ Task: ${task}                        ║
║ ✅ Duration: ${duration}                ║
║ ✅ Files: ${N} created, ${M} modified   ║
║ ✅ Quality: All checks passed           ║
║                                         ║
${if pr}║ 📝 PR Created: ${pr_url}            ║
${else}║ 💾 Committed to local               ║
║                                         ║
║ 📁 Artifacts:                           ║
║    .predator/runs/${timestamp}/        ║
║                                         ║
╚════════════════════════════════════════╝

Workflow complete!
```
