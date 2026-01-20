---
name: Pull Request
about: Propose changes to the browser-automation plugin
title: '[TYPE]: Brief description'
labels: ''
assignees: ''
---

## 📋 Summary

<!-- Briefly describe what this PR does and why -->

This PR addresses [issue #] by implementing/fixing/...

## 🎯 Type of Change

<!-- Mark relevant options with an 'x' -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Test additions/updates

## 🔧 Related Issues

<!-- Link to related issues using 'fixes #123' or 'related to #123' -->

- Fixes #
- Related to #

## 📝 Description

<!-- Detailed description of changes made -->

### Changes Made

1. **[Feature/Change 1]**
   - Description
   - Files modified: `path/to/file.ts`

2. **[Feature/Change 2]**
   - Description
   - Files modified: `path/to/file.ts`

### Technical Details

<!-- Explain technical implementation decisions -->

- **MCP Server Impact**: Does this change affect MCP server integration? (yes/no)
  - If yes, which servers: (web-reader, web-search-prime, zai-mcp-server)
  - Impact: (backward compatible/breaking change/new feature)

- **API Changes**: Are there breaking changes to the public API?
  - List any breaking changes

- **Performance Impact**: Does this affect performance?
  - Describe any performance implications

## ✅ Checklist

<!-- Mark completed items with an 'x' -->

### Code Quality
- [ ] Code follows SMITE engineering rules (`.claude/rules/engineering.md`)
- [ ] TypeScript strict mode passes (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Zod schemas defined for all input validation
- [ ] Result<T, E> types used for error handling
- [ ] Pure functions preferred for business logic
- [ ] Barrel exports (`index.ts`) updated if needed

### Testing
- [ ] Unit tests added/updated for new functionality
- [ ] Integration tests added for MCP-based workflows
- [ ] Performance tests included if applicable
- [ ] All tests pass (`npm test`)
- [ ] Test coverage maintained above 80%

### MCP-Specific
- [ ] MCP server calls properly typed
- [ ] Error handling covers MCP timeout/rate limit scenarios
- [ ] Fallback behavior documented if MCP server unavailable
- [ ] New MCP tools registered (if applicable)

### Documentation
- [ ] README.md updated (for user-facing changes)
- [ ] JSDoc comments added/updated for public APIs
- [ ] Examples provided for new features
- [ ] Architecture doc updated (ARCHITECTURE.md)
- [ ] Migration guide updated if breaking changes

### Browser Automation Specific
- [ ] Feature module follows layered architecture
- [ ] Workflow orchestrator updated if workflow changes
- [ ] Agent API updated if public API changes
- [ ] CLI commands updated if needed
- [ ] Vision features tested with image inputs
- [ ] GitHub research features tested

## 🧪 Testing

### Test Environment
- Node.js version: <!-- e.g., 18.17.0 -->
- OS: <!-- e.g., Windows 11, macOS 14, Ubuntu 22.04 -->
- MCP servers: <!-- List versions if known -->

### Test Cases
<!-- Describe how this was tested -->

1. **Unit Tests**
   ```typescript
   // Example test
   describe('newFeature', () => {
     it('should handle valid input', async () => {
       const result = await newFeature({ param: 'value' });
       expect(result.success).toBe(true);
     });
   });
   ```

2. **Integration Tests**
   - Tested with MCP server: (web-reader/web-search/zai-mcp)
   - Test scenarios:
     - Scenario 1: Description
     - Scenario 2: Description

3. **Manual Testing**
   - CLI commands tested:
     ```bash
     browse [command] [args]
     ```
   - API usage tested:
     ```typescript
     import { function } from '@smite/browser-automation';
     ```

### Performance Tests
<!-- If applicable, include performance benchmarks -->

| Operation | Before | After | Improvement |
|:---|---:|---:|:---|
| Operation name | 100ms | 80ms | 20% faster |

## 📸 Screenshots/Demo

<!-- If UI changes or CLI output, include screenshots or demo recordings -->

### Before
<!-- Screenshot or output -->

### After
<!-- Screenshot or output -->

## 🔄 Migration Notes

<!-- If breaking changes, provide migration guide -->

### Breaking Changes

1. **Change Description**
   - Old: `oldFunction(param1, param2)`
   - New: `newFunction({ param1, param2 })`
   - Migration: Search/replace pattern

### Migration Example

```typescript
// Before (v2.0)
import { oldFunction } from '@smite/browser-automation';
const result = await oldFunction('param1', 'param2');

// After (v2.1)
import { newFunction } from '@smite/browser-automation';
const result = await newFunction({ param1: 'param1', param2: 'param2' });
```

## 📚 Documentation Updates

<!-- Link to documentation updates -->

- README.md: [Link to section]
- ARCHITECTURE.md: [Link to section]
- API docs: [Link to section]
- Examples: [Link to examples]

## 🚀 Deployment

- [ ] Changes merged to main branch
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated
- [ ] Release notes prepared
- [ ] Tested in production environment

## 🤔 Additional Notes

<!-- Any additional context, questions, or concerns -->

---

## 👨‍💻 Reviewer Checklist

<!-- For reviewers to check -->

- [ ] Code quality meets SMITE standards
- [ ] Tests are comprehensive and pass
- [ ] Documentation is complete and accurate
- [ ] No breaking changes without proper documentation
- [ ] MCP integration is correct
- [ ] Performance impact acceptable
- [ ] Security implications considered
- [ ] Backward compatibility maintained (unless breaking change documented)

## 💬 Review Discussion

<!-- Use this section for review comments and resolutions -->

### Review Comment 1
- **Reviewer**: @username
- **Comment**: Question about implementation
- **Resolution**: Explanation and action taken

---

**Ready to merge?** [ ] Yes [ ] No

If no, what's blocking?
-
-
