# 04_VALIDATE - Verification

## Instructions

### 1. Run Linting

Check code quality:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

If linting fails:
- Fix all linting errors
- Re-run until clean
- Document fixes

### 2. Run Type Checking

Verify type safety:

```bash
npm run typecheck
# or
npx tsc --noEmit
```

If typecheck fails:
- Fix all type errors
- Re-run until clean
- Document fixes

### 3. Run Build

Ensure build succeeds:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

If build fails:
- Fix build errors
- Re-run until successful
- Document fixes

### 4. Self-Check Implementation

Verify against acceptance criteria:

```markdown
## Self-Check Report

### Functional Requirements
- [ ] <Requirement 1> - <status>
- [ ] <Requirement 2> - <status>
- [ ] <Requirement 3> - <status>

### Non-Functional Requirements
- [ ] Code passes linting - ✅/❌
- [ ] Code passes typecheck - ✅/❌
- [ ] Build succeeds - ✅/❌
- [ ] Tests pass - ✅/❌

### Quality Standards
- [ ] Follows existing patterns - ✅/❌
- [ ] No console.log statements - ✅/❌
- [ ] Proper error handling - ✅/❌
- [ ] Clear variable names - ✅/❌

### Manual Testing
<Test results if applicable>

### Issues Found
<Any issues discovered during validation>
```

### 5. Validation Report

Create validation summary:

```markdown
## Validation Summary

### Linting
Status: <PASS/FAIL>
Errors found: ${N}
Errors fixed: ${N}

### Type Check
Status: <PASS/FAIL>
Errors found: ${N}
Errors fixed: ${N}

### Build
Status: <PASS/FAIL>
Errors found: ${N}
Errors fixed: ${N}

### Acceptance Criteria
Passed: ${P}/${Total}

### Overall Status
<PASS/FAIL>
```

### 6. Save Validation Report

Save to `.claude/.smite/.predator/runs/${timestamp}/04_VALIDATE.md`

### Output

```
✅ VALIDATE COMPLETE
Linting: ${PASS/FAIL}
Type Check: ${PASS/FAIL}
Build: ${PASS/FAIL}
Acceptance Criteria: ${P}/${Total} passed

Overall: ${PASS/FAIL}

Validation report saved to: .claude/.smite/.predator/runs/${timestamp}/04_VALIDATE.md

${if PASS}Next: 05_EXAMINE (if -examine flag)
${if FAIL}Next: Return to 03_EXECUTE or request guidance
```
