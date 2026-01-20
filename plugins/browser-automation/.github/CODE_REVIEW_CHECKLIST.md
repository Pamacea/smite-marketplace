# Code Review Checklist

**Purpose**: Quick reference for reviewers and contributors to ensure code quality standards

---

## Pre-Merge Checklist

### Code Quality

- [ ] **TypeScript Strict Mode**
  - Run `npm run typecheck` - no errors
  - No `any` types used (use `unknown` or specific types)
  - Proper type inference from Zod schemas

- [ ] **Linting**
  - Run `npm run lint` - no warnings
  - Code follows project formatting rules
  - No console.log statements left in production code

- [ ] **Zod Validation**
  - All external input validated with Zod schemas
  - Schemas defined in `src/types/` or feature modules
  - Validation errors provide helpful messages

- [ ] **Error Handling**
  - All functions return `Result<T, E>` type
  - Error cases tested alongside success cases
  - MCP errors properly wrapped and handled

- [ ] **Pure Functions**
  - Business logic is pure (no side effects)
  - Side effects isolated to MCP wrappers or CLI layer
  - Functions are testable without mocking complex dependencies

### MCP Integration

- [ ] **MCP Wrappers (Layer 1)**
  - Defined in `src/mcp/` directory
  - One file per MCP server
  - Zod schema for MCP parameters
  - Always return `Result<T, McpError>`

- [ ] **Error Handling**
  - Timeout errors handled with retry or fallback
  - Rate limit errors handled with delay and retry
  - Connection errors provide helpful messages
  - No unhandled promise rejections

- [ ] **Type Safety**
  - MCP call parameters typed
  - Response types defined
  - No unchecked `any` from MCP responses

### Testing

- [ ] **Unit Tests**
  - Test pure functions without MCP calls
  - Test validation logic
  - Test error paths
  - All tests passing

- [ ] **Integration Tests**
  - Test MCP server integration
  - Test with real MCP responses (if available)
  - Skip if MCP servers unavailable (graceful degradation)

- [ ] **Test Coverage**
  - Coverage maintained above 80%
  - Critical paths have 100% coverage
  - New features fully tested

- [ ] **Performance Tests**
  - Included for performance-sensitive features
  - Benchmarks show acceptable performance
  - No regressions introduced

### Documentation

- [ ] **README.md**
  - Updated for user-facing changes
  - Usage examples provided
  - New features documented

- [ ] **JSDoc Comments**
  - All public APIs have JSDoc
  - Parameters documented with types
  - Return types documented
  - Examples provided for complex functions

- [ ] **Architecture Documentation**
  - ARCHITECTURE.md updated for design changes
  - New patterns documented
  - Rationale explained for non-obvious decisions

- [ ] **API Documentation**
  - API reference updated
  - New types exported and documented
  - Breaking changes highlighted

### Browser Automation Specific

- [ ] **Layered Architecture**
  - Layer 4 (API/CLI): Ergonomic functions, CLI commands
  - Layer 3 (Workflows): Multi-step orchestration
  - Layer 2 (Features): Domain-specific logic
  - Layer 1 (MCP): Server communication

- [ ] **Feature Modules**
  - Located in `src/features/[feature-name]/`
  - Barrel exports in `index.ts`
  - Pure business logic
  - Result types returned

- [ ] **Vision Features**
  - Image paths validated
  - Tool selection logic tested
  - Error messages for unsupported formats

- [ ] **GitHub Features**
  - Repo format validated (owner/repo)
  - API errors handled
  - Rate limiting considered

- [ ] **CLI Commands**
  - Flags documented in help text
  - Options match API parameters
  - Error messages user-friendly

### Security

- [ ] **Input Validation**
  - All user input validated
  - No regex injection vulnerabilities
  - URL validation for web requests
  - Path validation for file operations

- [ ] **Secrets Management**
  - No hardcoded secrets
  - No API keys in source code
  - Environment variables used appropriately

- [ ] **Dependencies**
  - No vulnerabilities in `npm audit`
  - Dependencies up to date
  - License compatibility checked

### Performance

- [ ] **Concurrency**
  - Batch operations use controlled concurrency
  - No unbounded parallelism
  - Memory usage reasonable

- [ ] **Timeouts**
  - MCP calls have appropriate timeouts
  - Long operations have progressive timeouts
  - Cancel/abort logic implemented where needed

- [ ] **Caching**
  - Cache invalidation strategy defined
  - No stale data returned
  - Cache bypass option available

---

## Common Review Feedback

### Must Fix (Blocking)

1. **Missing Zod Validation**
   - **Issue**: External input not validated with Zod schema
   - **Fix**: Add schema and call `.parse()` at entry point
   - **Example**:
     ```typescript
     // Bad
     export function search(query: string) { }

     // Good
     const schema = z.object({ query: z.string().min(1) });
     export function search(args: unknown) {
       const { query } = schema.parse(args);
     }
     ```

2. **Missing Error Handling**
   - **Issue**: Function throws instead of returning Result type
   - **Fix**: Wrap in try/catch and return Result
   - **Example**:
     ```typescript
     // Bad
     export async function readPage(url: string) {
       return await mcpCall();
     }

     // Good
     export async function readPage(url: string): Promise<Result<Data, Error>> {
       try {
         const data = await mcpCall();
         return { success: true, data };
       } catch (error) {
         return { success: false, error: error as Error };
       }
     }
     ```

3. **Breaking Changes Not Documented**
   - **Issue**: API change without migration guide
   - **Fix**: Update README with migration section
   - **Example**: Add "Migration Guide" section showing before/after

### Should Fix (Recommended)

1. **Unclear Variable Names**
   - **Issue**: Variables named `data`, `result`, `temp`
   - **Fix**: Use descriptive names
   - **Example**:
     ```typescript
     // Bad
     const d = await search(q);

     // Good
     const searchResults = await searchWeb(query);
     ```

2. **Missing JSDoc**
   - **Issue**: Public function lacks documentation
   - **Fix**: Add JSDoc comment
   - **Example**:
     ```typescript
     /**
      * Searches the web with advanced filtering
      * @param query - Search query string
      * @param options - Search options (maxResults, timeRange, etc.)
      * @returns Result containing search results or error
      */
     export async function searchWeb(
       query: string,
       options?: SearchOptions
     ): Promise<Result<SearchResult[], Error>>
     ```

3. **Test Coverage Below 80%**
   - **Issue**: New feature lacks comprehensive tests
   - **Fix**: Add tests for edge cases and error paths

### Nice to Have

1. **Performance Optimization**
   - **Suggestion**: Could cache repeated MCP calls
   - **Benefit**: Reduce latency, improve UX

2. **Additional Examples**
   - **Suggestion**: Add more usage examples to README
   - **Benefit**: Easier for new users to get started

---

## Review Process

### For Reviewers

1. **Clone the branch**
   ```bash
   git fetch origin
   git checkout feature-branch-name
   npm install
   npm run build
   ```

2. **Run quality checks**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   ```

3. **Review code changes**
   - Read diff on GitHub or with `git diff`
   - Check each file in checklist
   - Test functionality manually if needed

4. **Provide feedback**
   - Use review template below
   - Be specific and constructive
   - Offer examples for improvements

### Review Template

```markdown
## Review Feedback

### Summary
[Brief summary of the PR - e.g., "Adds X feature", "Fixes Y bug"]

### Must Fix (Blocking Merge)
1. **[Issue Title]**
   - **Location**: `file.ts:line`
   - **Problem**: [Description]
   - **Suggested Fix**: [Code example or explanation]

### Should Fix (Recommended)
1. **[Issue Title]**
   - **Location**: `file.ts:line`
   - **Suggestion**: [Improvement]
   - **Reason**: [Why it matters]

### Nice to Have
1. **[Enhancement]**
   - **Suggestion**: [What could be improved]
   - **Priority**: [Low/Medium/High]
   - **Reason**: [Optional - why it would be good]

### Positive Feedback
- [What was done well]
- [What you liked about the implementation]
- [Good patterns followed]

### Overall Assessment
- [ ] Approve as-is
- [ ] Approve after changes
- [ ] Request changes
- [ ] Needs significant work

**Additional Comments**: [Any other thoughts]
```

---

## Quick Reference

### File Locations

| Layer | Location | Purpose |
|:---|:---|:---|
| **Layer 4** | `src/index.ts`, `src/cli.ts` | Agent API & CLI |
| **Layer 3** | `src/workflows/` | Workflow orchestrator |
| **Layer 2** | `src/features/` | Feature modules |
| **Layer 1** | `src/mcp/` | MCP wrappers |
| **Types** | `src/types/` | Shared types & Zod schemas |

### Common Commands

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Tests
npm test                           # All tests
npm test -- --testPathPattern=unit # Unit tests only
npm test -- --coverage            # With coverage

# Build
npm run build
npm run dev                       # Watch mode

# Performance
npm run demo:performance          # Run performance demo
```

### Result Type Pattern

```typescript
// Define
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Use
export async function feature(): Promise<Result<Data, Error>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Handle
const result = await feature();
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Zod Validation Pattern

```typescript
import { z } from 'zod';

// Define schema
const schema = z.object({
  query: z.string().min(1).max(1000),
  maxResults: z.number().min(1).max(50).optional()
});

// Infer type
type Options = z.infer<typeof schema>;

// Use in function
export async function search(options: unknown) {
  // Validates and throws if invalid
  const validated = schema.parse(options);

  // TypeScript knows validated is Options type
  const { query, maxResults = 10 } = validated;
  // ...
}
```

---

**Last Updated**: 2026-01-20
**Maintainer**: @pamacea
