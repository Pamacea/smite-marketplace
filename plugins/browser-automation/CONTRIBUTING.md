# Contributing to @smite/browser-automation

Thank you for your interest in contributing to the Browser Automation plugin! This document provides comprehensive guidelines for contributing to this MCP-first, AI-powered browser automation system.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [MCP-First Architecture](#mcp-first-architecture)
- [Coding Standards](#coding-standards)
- [Adding New Features](#adding-new-features)
- [Testing Guidelines](#testing-guidelines)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Access to z.ai MCP servers (for testing)

### Initial Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/smite.git
cd smite/plugins/browser-automation

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Development Environment

```bash
# Watch mode for development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Run specific test suite
npm test -- vision.feature.test
```

---

## Development Workflow

### 1. Branching Strategy

Create a descriptive branch from `main`:

```bash
# Feature branches
git checkout -b feature/your-feature-name

# Bug fix branches
git checkout -b fix/your-bug-fix

# Documentation branches
git checkout -b docs/your-doc-change
```

### 2. Making Changes

#### Step 1: Understand the Architecture

Before making changes, read:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - MCP-first design principles
- [README.md](./README.md) - Feature overview and API
- [.smite/browser-automation-architecture.md](./.smite/browser-automation-architecture.md) - Detailed architecture

#### Step 2: Follow the Layered Architecture

The plugin has 4 layers. Know which layer you're modifying:

```
Layer 4: Agent API & CLI          # Public convenience functions
Layer 3: Workflow Orchestrator    # Multi-step workflows
Layer 2: Feature Modules          # Domain capabilities (Search, Read, Vision, Repo)
Layer 1: MCP Client Wrappers      # Type-safe MCP calls
```

#### Step 3: Code with Standards

- **TypeScript strict mode** - All code must pass `npm run typecheck`
- **Zod validation** - All external input validated with Zod schemas
- **Result types** - Use `Result<T, E>` for error handling
- **Pure functions** - Business logic should be pure and testable
- **Barrel exports** - Export via `index.ts` for tree-shaking

#### Step 4: Test Your Changes

```bash
# Unit tests
npm test -- --testPathPattern=unit

# Integration tests (require MCP servers)
npm test -- --testPathPattern=integration

# Performance tests
npm test -- --testPathPattern=performance
```

#### Step 5: Commit Changes

Use conventional commit messages:

```bash
# Feature
git commit -m "feat(search): add domain filtering option"

# Bug fix
git commit -m "fix(vision): handle timeout errors gracefully"

# Documentation
git commit -m "docs(readme): add batch processing examples"

# Breaking change
git commit -m "feat!: migrate search options to object parameter

BREAKING CHANGE: searchWeb() now requires options object
instead of separate parameters"

# Other types
git commit -m "refactor(workflows): extract common logic"
git commit -m "test(vision): add error handling tests"
git commit -m "perf(batch): reduce memory usage"
```

**Commit format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore, perf

**Scopes:** search, read, vision, repo, workflow, mcp, cli, test, docs

### 3. Pull Request Process

#### Create Pull Request

```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR via GitHub CLI
gh pr create --title "feat(scope): brief description" \
             --body "See PR template for details"
```

#### PR Requirements

Your PR must include:

1. **Filled PR template** - Complete all applicable sections
2. **Passing tests** - All CI checks must pass
3. **Code review** - Address all review comments
4. **Documentation** - Update relevant docs for user-facing changes
5. **MCP impact** - Document if MCP integration changes

---

## MCP-First Architecture

### Understanding MCP Servers

This plugin depends on three z.ai MCP servers:

#### 1. web-reader (`mcp__web-reader__webReader`)
- **Purpose**: Fetch URLs and convert to markdown
- **Use for**: Static content extraction, blog posts, docs
- **Location**: `src/mcp/web-reader.ts`

#### 2. web-search-prime (`mcp__web-search-prime__webSearchPrime`)
- **Purpose**: Web search with filters
- **Use for**: Research, finding recent info, competitive analysis
- **Location**: `src/mcp/web-search.ts`

#### 3. zai-mcp-server (`mcp__zai-mcp-server__*`)
- **Purpose**: Multi-modal AI vision and analysis
- **Use for**: Image analysis, OCR, UI understanding, error diagnosis
- **Location**: `src/mcp/zai-mcp.ts`

### Adding MCP Server Calls

When adding new MCP server functionality:

1. **Create wrapper in Layer 1** (`src/mcp/`)

```typescript
// src/mcp/new-server.ts
import { callMcpTool } from './client';
import { z } from 'zod';

// Define Zod schema for input validation
export const newToolSchema = z.object({
  param1: z.string().min(1),
  param2: z.number().optional()
});

// Type-safe wrapper
export async function callNewTool(
  args: z.infer<typeof newToolSchema>
): Promise<Result<NewToolResponse, McpError>> {
  // Validate input
  const validated = newToolSchema.parse(args);

  // Call MCP server
  try {
    const result = await callMcpTool(
      'server-name',     // MCP server name
      'tool_name',       // Tool name
      validated          // Validated parameters
    );

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: new McpError('Tool call failed', error)
    };
  }
}
```

2. **Create feature module in Layer 2** (`src/features/`)

```typescript
// src/features/new-feature.ts
import { callNewTool } from '../mcp/new-server';

export async function newFeature(
  param1: string,
  options?: NewFeatureOptions
): Promise<FeatureResult> {
  // Business logic
  const validated = { param1, param2: options?.value };

  // Call MCP wrapper
  const result = await callNewTool(validated);

  if (!result.success) {
    // Handle error
    return {
      success: false,
      error: result.error.message
    };
  }

  // Process result
  return {
    success: true,
    data: processResult(result.data)
  };
}
```

3. **Export from Agent API in Layer 4** (`src/index.ts`)

```typescript
// src/index.ts
export { newFeature } from './features/new-feature';
```

### MCP Error Handling

Always handle these MCP-specific errors:

```typescript
import {
  McpError,
  McpTimeoutError,
  McpRateLimitError,
  McpConnectionError
} from './mcp/errors';

export async function robustMcpCall() {
  try {
    return await callMcpTool(...);
  } catch (error) {
    if (error instanceof McpTimeoutError) {
      // Retry with longer timeout
      return await callMcpTool(..., { timeout: 60 });
    }
    if (error instanceof McpRateLimitError) {
      // Add delay and retry
      await delay(1000);
      return await callMcpTool(...);
    }
    if (error instanceof McpConnectionError) {
      // MCP server unavailable - return helpful error
      return {
        success: false,
        error: 'MCP server unavailable. Please check your connection.'
      };
    }
    throw error;
  }
}
```

---

## Coding Standards

### TypeScript Guidelines

#### Type Safety

```typescript
// ✅ GOOD - Strict typing
function search(query: string, options?: SearchOptions): Promise<Result<SearchResults, Error>>

// ❌ BAD - Any type
function search(query: any, options?: any): Promise<any>
```

#### Zod Validation

```typescript
// ✅ GOOD - Zod at entry point
import { z } from 'zod';

const searchSchema = z.object({
  query: z.string().min(1),
  maxResults: z.number().min(1).max(50).optional()
});

export async function searchWeb(args: unknown) {
  const validated = searchSchema.parse(args); // Throws if invalid
  // Use validated.data
}

// ❌ BAD - Manual validation
export async function searchWeb(query: string, maxResults?: number) {
  if (!query || typeof query !== 'string') {
    throw new Error('Invalid query');
  }
  // Manual checks scattered throughout
}
```

#### Error Handling

```typescript
// ✅ GOOD - Result type
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export async function readPage(url: string): Promise<Result<PageContent, Error>> {
  try {
    const content = await callMcpTool('web-reader', 'read', { url });
    return { success: true, data: content };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// ❌ BAD - Throwing errors
export async function readPage(url: string): Promise<PageContent> {
  try {
    return await callMcpTool('web-reader', 'read', { url });
  } catch (error) {
    throw new Error('Failed to read page'); // Loses stack trace
  }
}
```

### Code Organization

#### File Structure

```
src/
├── features/          # Layer 2: Feature modules
│   ├── search/
│   │   ├── index.ts
│   │   ├── web-search.ts
│   │   └── batch-search.ts
│   ├── read/
│   ├── vision/
│   └── repo/
├── workflows/         # Layer 3: Workflow orchestrator
│   ├── research.ts
│   ├── debug.ts
│   └── audit.ts
├── mcp/              # Layer 1: MCP wrappers
│   ├── client.ts
│   ├── web-reader.ts
│   ├── web-search.ts
│   └── zai-mcp.ts
├── cli.ts            # CLI commands
├── types.ts          # Shared types
└── index.ts          # Agent API exports
```

#### Barrel Exports

Every directory should have an `index.ts`:

```typescript
// src/features/search/index.ts
export { searchWeb } from './web-search';
export { searchAndRead } from './batch-search';
export { searchMultiple } from './search-multiple';
export type { SearchOptions, SearchResult } from './types';
```

### Naming Conventions

```typescript
// Functions: camelCase with descriptive names
function searchWeb() {}
function batchRead() {}
function analyzeImage() {}

// Types: PascalCase
interface SearchOptions {}
type SearchResult = {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_RESULTS = 10;
const DEFAULT_TIMEOUT = 20000;

// MCP wrappers: call + server name
function callWebReader() {}
function callWebSearch() {}
function callZaiMcp() {}
```

---

## Adding New Features

### Decision Tree: Where to Add Code?

1. **Is it a new MCP server wrapper?**
   - Add to `src/mcp/[server-name].ts`
   - Export from `src/mcp/index.ts`

2. **Is it a new feature/capability?**
   - Add to `src/features/[feature-name]/`
   - Create `index.ts` barrel export
   - Export from `src/index.ts`

3. **Is it a multi-step workflow?**
   - Add to `src/workflows/[workflow-name].ts`
   - Export from `src/index.ts`

4. **Is it a CLI command?**
   - Add to `src/cli.ts`
   - Document in README

### Example: Adding a New Feature

**Scenario**: Add ability to search by date range.

#### Step 1: Update MCP Wrapper (if needed)

```typescript
// src/mcp/web-search.ts
export const dateSearchSchema = z.object({
  query: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
});

export async function searchByDate(args: z.infer<typeof dateSearchSchema>) {
  const validated = dateSearchSchema.parse(args);
  return callMcpTool('web-search-prime', 'webSearchPrime', {
    search_query: validated.query,
    search_recency_filter: calculateDateRange(validated.startDate, validated.endDate)
  });
}
```

#### Step 2: Create Feature Module

```typescript
// src/features/search/date-search.ts
import { searchByDate } from '../../mcp/web-search';

export interface DateSearchOptions {
  query: string;
  startDate: Date;
  endDate: Date;
  maxResults?: number;
}

export async function searchWebByDate(
  query: string,
  startDate: Date,
  endDate: Date,
  options?: Omit<DateSearchOptions, 'query' | 'startDate' | 'endDate'>
) {
  const result = await searchByDate({
    query,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error
    };
  }

  return {
    success: true,
    data: result.data.results.slice(0, options?.maxResults)
  };
}
```

#### Step 3: Export from Feature Index

```typescript
// src/features/search/index.ts
export { searchWebByDate } from './date-search';
export type { DateSearchOptions } from './date-search';
```

#### Step 4: Export from Root

```typescript
// src/index.ts
export { searchWebByDate } from './features/search';
```

#### Step 5: Add Tests

```typescript
// tests/search/date-search.test.ts
import { searchWebByDate } from '../../src/features/search/date-search';

describe('searchWebByDate', () => {
  it('should search within date range', async () => {
    const result = await searchWebByDate(
      'TypeScript 5',
      new Date('2024-01-01'),
      new Date('2024-12-31')
    );

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

#### Step 6: Update Documentation

```markdown
## README.md

### Date Range Search

\`\`\`typescript
import { searchWebByDate } from '@smite/browser-automation';

const results = await searchWebByDate(
  'TypeScript 5',
  new Date('2024-01-01'),
  new Date('2024-12-31'),
  { maxResults: 10 }
);
\`\`\`
```

---

## Testing Guidelines

### Test Structure

```typescript
// tests/[feature]/[feature-name].test.ts
import { functionToTest } from '../../src/features/[feature]';

describe('Feature Name', () => {
  // Unit tests - no MCP calls
  describe('Unit Tests', () => {
    it('should validate input correctly', () => {
      // Test pure logic
    });
  });

  // Integration tests - with MCP
  describe('Integration Tests', () => {
    it('should call MCP server correctly', async () => {
      // Test with mocked MCP
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('should complete within timeout', async () => {
      const start = Date.now();
      await functionToTest();
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000);
    });
  });
});
```

### Test Categories

#### 1. Unit Tests

Test pure functions without MCP calls:

```typescript
describe('parseSearchResults', () => {
  it('should extract titles and URLs', () => {
    const mockResults = [/* mock data */];
    const parsed = parseSearchResults(mockResults);
    expect(parsed).toHaveLength(10);
  });
});
```

#### 2. Integration Tests

Test MCP integration (require MCP servers running):

```typescript
describe('searchWeb', () => {
  it('should return search results', async () => {
    const result = await searchWeb('test query');

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
  });
});
```

#### 3. Feature Tests

Test feature-specific workflows:

```typescript
describe('Vision Feature', () => {
  it('should analyze UI screenshot', async () => {
    const analysis = await analyzeImage(
      './fixtures/ui-screenshot.png',
      'Describe the UI layout'
    );

    expect(analysis.success).toBe(true);
    expect(analysis.data).toContain('layout');
  });
});
```

#### 4. Performance Tests

Measure and validate performance:

```typescript
describe('Batch Operations Performance', () => {
  it('should process 100 URLs in under 30 seconds', async () => {
    const urls = Array(100).fill('https://example.com');
    const start = Date.now();

    const result = await batchRead(urls, { concurrency: 10 });

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(30000);
    expect(result.success).toBe(true);
  });
});
```

### Test Fixtures

Place test fixtures in `tests/fixtures/`:

```
tests/
├── fixtures/
│   ├── images/
│   │   ├── ui-screenshot.png
│   │   ├── error-message.png
│   │   └── chart.png
│   ├── html/
│   │   └── sample-page.html
│   └── mock-responses/
│       └── search-results.json
└── ...
```

### Mocking MCP Calls

Use dependency injection for testing:

```typescript
// src/features/search/web-search.ts
export async function searchWeb(
  query: string,
  options: SearchOptions,
  mcpClient: McpClient = defaultMcpClient // Inject for testing
) {
  const result = await mcpClient.call('web-search-prime', 'webSearchPrime', { query });
  // ...
}

// tests/search/web-search.test.ts
describe('searchWeb', () => {
  it('should handle errors', async () => {
    const mockClient = {
      call: jest.mockRejectedValue(new Error('MCP unavailable'))
    };

    const result = await searchWeb('test', {}, mockClient);
    expect(result.success).toBe(false);
  });
});
```

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests
npm test -- --testPathPattern=integration

# Performance tests
npm test -- --testPathPattern=performance

# Specific test file
npm test -- vision.feature.test.ts

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Code Review Process

### Reviewer Responsibilities

When reviewing a PR, check:

#### 1. Code Quality

- [ ] Follows SMITE engineering rules
- [ ] TypeScript strict mode passes
- [ ] No linting errors
- [ ] Zod validation at entry points
- [ ] Result types for error handling
- [ ] Pure functions for business logic
- [ ] Clear, descriptive names

#### 2. MCP Integration

- [ ] MCP calls properly typed
- [ ] Error handling covers MCP failures
- [ ] Timeout and rate limit handling
- [ ] Fallback behavior documented
- [ ] No unnecessary MCP calls

#### 3. Testing

- [ ] Tests added for new functionality
- [ ] Test coverage > 80%
- [ ] Integration tests for MCP workflows
- [ ] Performance tests if applicable
- [ ] All tests pass

#### 4. Documentation

- [ ] README updated for user-facing changes
- [ ] JSDoc comments for public APIs
- [ ] Examples provided
- [ ] Architecture doc updated if design change

#### 5. MCP-Specific

- [ ] New MCP wrappers follow Layer 1 pattern
- [ ] Features in Layer 2 are testable
- [ ] Workflows in Layer 3 are composable
- [ ] Agent API in Layer 4 exports correctly
- [ ] CLI commands documented

### Review Response Template

```markdown
## Review Feedback

### Must Fix (Blocking)
1. **Issue**: Description
   - **Location**: `file.ts:line`
   - **Fix**: Suggestion

### Should Fix (Recommended)
1. **Issue**: Description
   - **Location**: `file.ts:line`
   - **Suggestion**: Improvement

### Nice to Have
1. **Suggestion**: Optional improvement
   - **Reason**: Why it would be better

### Positive Feedback
- Great implementation of...
- Good test coverage for...
- Clear documentation of...
```

---

## Release Process

Releases are managed by maintainers.

### Version Bump

```bash
# Update version in package.json
npm version patch  # 2.0.0 -> 2.0.1 (bug fixes)
npm version minor  # 2.0.0 -> 2.1.0 (new features)
npm version major  # 2.0.0 -> 3.0.0 (breaking changes)
```

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Migration guide for breaking changes
- [ ] Version updated in package.json
- [ ] Git tag created
- [ ] GitHub release published

### Changelog Format

```markdown
# [2.1.0] - 2026-01-20

## Added
- Date range search feature
- Batch image processing
- Performance optimization for large batches

## Fixed
- Timeout handling in MCP calls
- Memory leak in batch operations

## Changed
- Improved error messages for MCP failures
- Updated Zod schemas for validation

## Breaking Changes
- `searchWeb()` now requires options object instead of separate parameters
  - Migration: See migration guide below

## Migration Guide
### searchWeb API Change
Old: `searchWeb(query, maxResults)`
New: `searchWeb({ query, maxResults })`
```

---

## Getting Help

### Questions?

- Read the [README.md](./README.md) for usage documentation
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions
- Review [GitHub Issues](https://github.com/pamacea/smite/issues)
- Start a [GitHub Discussion](https://github.com/pamacea/smite/discussions)

### Need Support?

- Ask in pull requests if you need clarification during development
- Tag maintainers for urgent review: `@pamacea`
- Check existing [documentation](./docs/) for answers

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Acknowledgments

Thank you for contributing to the Browser Automation plugin! Your contributions help make lightweight, MCP-first browser automation accessible to everyone.

**Built with [MCP technology](https://modelcontextprotocol.io) from [z.ai](https://z.ai)**
**Part of the [SMITE](https://github.com/pamacea/smite) ecosystem**
