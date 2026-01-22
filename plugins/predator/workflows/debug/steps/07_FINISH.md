# 07_FINISH - Debug Completion

## Instructions

### 1. Generate Debug Summary

Compile all debug workflow data:

```markdown
# Debug Workflow Summary

## Bug
${bug_description}

## Execution Time
Start: ${start_time}
End: ${end_time}
Duration: ${duration}

## Workflow Steps
✅ 00_INIT - Debug session initialized
✅ 01_ANALYZE - Root cause identified
✅ 02_PLAN - Fix strategy created
✅ 03_EXECUTE - Fix implemented (${attempts} attempts)
✅ 04_VALIDATE - Fix verified
${if examine}✅ 05_EXAMINE - Fix reviewed
${if resolve}✅ 06_RESOLVE - Improvements applied
✅ 07_FINISH - Debug session complete

## Root Cause
${confirmed_root_cause}

## Fix Applied
**Strategy**: ${fix_approach}
**Files Modified**: ${M}
**Lines Changed**: +${A}/-${R}

### Files Changed
- `path/to/file1.ts` - ${changes}
- `path/to/file2.ts` - ${changes}

## Verification
- Bug fixed: ✅ (consistent across ${N} tests)
- Linting: ✅ PASS
- Type Check: ✅ PASS
- Build: ✅ PASS
- Tests: ✅ PASS
- Regression: ✅ No side effects

## Hypotheses Tested
${N} hypotheses tested
- Hypothesis ${N1}: ${result}
- Hypothesis ${N2}: ${result}

## Artifacts
- Analysis: .predator/debug/runs/${ts}/01_ANALYZE.md
- Plan: .predator/debug/runs/${ts}/02_PLAN.md
- Execution: .predator/debug/runs/${ts}/03_EXECUTE.md
- Validation: .predator/debug/runs/${ts}/04_VALIDATE.md
${if examine}- Review: .predator/debug/runs/${ts}/05_EXAMINE.md
${if resolve}- Resolution: .predator/debug/runs/${ts}/06_RESOLVE.md

## Final Status
✅ BUG FIXED
```

### 2. Check -pr Flag

#### If -pr flag is set:

Create pull request:

```bash
# Commit changes
git add .
git commit -m "fix: ${bug_description}

- Fix ${bug_type} in ${component}
- Root cause: ${root_cause}
- Files modified: ${M}
- Verification: bug resolved, no side effects
- Regression tests: passing

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Create PR
gh pr create \
  --title "fix: ${bug_title}" \
  --body "$(cat .predator/debug/runs/${ts}/PR_DESCRIPTION.md)" \
  --base main \
  --head fix/$(slugify "${bug_title}")
```

PR Description Template:
```markdown
## Bug Fix
${bug_description}

## Root Cause
${root_cause}

## Fix
${fix_description}

## Verification
- ✅ Bug resolved (tested ${N} times)
- ✅ No side effects
- ✅ Regression tests pass
- ✅ All quality checks pass

## Files Changed
- Modified: ${M}

## Checklist
- [ ] Root cause addressed
- [ ] Edge cases handled
- [ ] Error handling appropriate
- [ ] No performance regression
- [ ] Tests added/updated

🤖 Generated with [Claude Code](https://claude.com/claude-code) using Debug workflow
```

#### If -pr flag is NOT set:

Complete locally:

```bash
# Commit changes
git add .
git commit -m "fix: ${bug_description}

- Fix ${bug_type} in ${component}
- Root cause: ${root_cause}
- Bug verified resolved

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

### 3. Save Final Report

Save to `.predator/debug/runs/${ts}/07_FINISH.md` and `.predator/debug/runs/${ts}/SUMMARY.md`

### 4. Archive (Optional)

```bash
# If successful, move to archive
mv .predator/debug/runs/${ts} .predator/debug/archive/
```

### Output

```
╔════════════════════════════════════════╗
║          DEBUG COMPLETE                 ║
╠════════════════════════════════════════╣
║                                         ║
║ 🐛 Bug: ${bug_description}              ║
║ ✅ Fixed in: ${duration}                ║
║ 🔍 Root cause: ${root_cause}            ║
║ 🔧 Files modified: ${M}                 ║
║                                         ║
║ Quality: All checks passed              ║
║ Regression: None detected               ║
║                                         ║
${if pr}║ 📝 PR Created: ${pr_url}            ║
${else}║ 💾 Committed to local               ║
║                                         ║
║ 📁 Artifacts:                           ║
║    .predator/debug/runs/${ts}/         ║
║                                         ║
╚════════════════════════════════════════╝

Bug fixed! 🎉
```
