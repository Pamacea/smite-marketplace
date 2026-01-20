# Testing Guidelines

**Version:** 2.0.0
**Purpose:** Comprehensive testing guide for browser-automation plugin

---

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Structure](#test-structure)
- [Test Categories](#test-categories)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Test Fixtures](#test-fixtures)
- [Mocking MCP Calls](#mocking-mcp-calls)
- [Performance Testing](#performance-testing)
- [Integration Testing](#integration-testing)
- [Coverage Requirements](#coverage-requirements)

---

## Testing Philosophy

### Principles

1. **Test at boundaries**: Test MCP wrappers, feature modules, and workflows
2. **Mock external dependencies**: Don't call real MCP servers in unit tests
3. **Test error paths**: Every error case should have a test
4. **Use Result types**: Tests should verify `success: true/false`
5. **Performance matters**: Include performance tests for critical paths

### What to Test

| Layer | What to Test | Example |
|:---|:---|:---|
| **Layer 1 (MCP)** | Error handling, parameter validation | Timeout, rate limit, connection errors |
| **Layer 2 (Features)** | Business logic, data transformation | Search result parsing, markdown conversion |
| **Layer 3 (Workflows)** | Orchestration, retry logic | Research workflow, debug workflow |
| **Layer 4 (API)** | Input validation, output formatting | CLI commands, agent API |

---

## Test Structure

### Directory Layout

```
tests/
├── unit/                      # Unit tests (no MCP calls)
│   ├── features/
│   │   ├── search/
│   │   ├── read/
│   │   ├── vision/
│   │   └── repo/
│   ├── workflows/
│   └── utils/
├── integration/              # Integration tests (with MCP)
│   ├── mcp/
│   └── features/
├── performance/              # Performance benchmarks
│   ├── batch-operations.test.ts
│   └── search-performance.test.ts
├── fixtures/                 # Test data and assets
│   ├── images/
│   ├── html/
│   └── mock-responses/
├── setup.ts                  # Test setup
└── teardown.ts              # Test cleanup
```

### Test File Template

```typescript
/**
 * Tests for [Feature Name]
 *
 * Purpose: [What this tests]
 * Coverage: [Unit/Integration/Performance]
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { functionToTest } from '../../src/features/[feature]';

describe('Feature Name', () => {
  // Setup
  beforeEach(async () => {
    // Initialize test environment
  });

  // Cleanup
  afterEach(async () => {
    // Clean up resources
  });

  // Unit tests
  describe('Unit Tests', () => {
    it('should handle valid input', async () => {
      // Arrange
      const input = 'test';

      // Act
      const result = await functionToTest(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should validate input correctly', async () => {
      // Arrange
      const input = ''; // Invalid input

      // Act & Assert
      await expect(functionToTest(input)).rejects.toThrow(ZodError);
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    it('should call MCP server correctly', async () => {
      // Test with real MCP server (if available)
    });
  });

  // Error cases
  describe('Error Handling', () => {
    it('should handle timeout errors', async () => {
      // Test timeout handling
    });

    it('should handle rate limit errors', async () => {
      // Test rate limit handling
    });

    it('should handle connection errors', async () => {
      // Test connection error handling
    });
  });
});
```

---

## Test Categories

### 1. Unit Tests

**Purpose**: Test business logic without MCP calls

**Characteristics**:
- Fast (< 10ms per test)
- No external dependencies
- Mocked MCP responses
- Test pure functions

**Example**:

```typescript
describe('parseSearchResults', () => {
  it('should extract titles and URLs', () => {
    // Arrange
    const mockResponse = {
      results: [
        {
          title: 'Test Result',
          url: 'https://example.com',
          summary: 'Test summary',
          website_name: 'Example'
        }
      ]
    };

    // Act
    const parsed = parseSearchResults(mockResponse);

    // Assert
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Test Result');
    expect(parsed[0].url).toBe('https://example.com');
    expect(parsed[0].source).toBe('Example');
  });

  it('should handle empty results', () => {
    // Arrange
    const mockResponse = { results: [] };

    // Act
    const parsed = parseSearchResults(mockResponse);

    // Assert
    expect(parsed).toHaveLength(0);
  });

  it('should filter out invalid URLs', () => {
    // Arrange
    const mockResponse = {
      results: [
        { title: 'Valid', url: 'https://example.com', summary: '' },
        { title: 'Invalid', url: 'not-a-url', summary: '' }
      ]
    };

    // Act
    const parsed = parseSearchResults(mockResponse);

    // Assert
    expect(parsed).toHaveLength(1);
    expect(parsed[0].url).toBe('https://example.com');
  });
});
```

---

### 2. Integration Tests

**Purpose**: Test MCP server integration

**Characteristics**:
- Slower (100ms - 5s per test)
- Require MCP servers running
- Test real server responses
- May require network access

**Setup**:

```typescript
// tests/integration/setup.ts
export async function setupIntegrationTests() {
  // Check if MCP servers are available
  const serversAvailable = await checkMcpServers();

  if (!serversAvailable) {
    console.warn('MCP servers not available. Skipping integration tests.');
    process.env.INTEGRATION_TESTS = 'false';
  } else {
    process.env.INTEGRATION_TESTS = 'true';
  }
}
```

**Example**:

```typescript
describe('searchWeb - Integration', () => {
  beforeEach(async () => {
    if (process.env.INTEGRATION_TESTS === 'false') {
      return; // Skip tests
    }
  });

  it('should return real search results', async () => {
    // Arrange
    const query = 'TypeScript 5';

    // Act
    const result = await searchWeb(query, { maxResults: 5 });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].title).toBeDefined();
    expect(result.data[0].url).toBeDefined();
    expect(result.data[0].url).toMatch(/^https?:\/\//);
  });

  it('should respect time range filter', async () => {
    // Arrange
    const query = 'AI news 2025';
    const timeRange = 'oneWeek' as const;

    // Act
    const result = await searchWeb(query, { timeRange });

    // Assert
    expect(result.success).toBe(true);
    // Results should be from last week
    result.data.forEach(item => {
      const date = new Date(item.publishedDate || '');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      expect(date.getTime()).toBeGreaterThanOrEqual(weekAgo.getTime());
    });
  });
});
```

---

### 3. Feature Tests

**Purpose**: Test feature-specific workflows

**Characteristics**:
- Test complete features
- May involve multiple MCP calls
- Test domain-specific logic

**Example: Vision Feature**:

```typescript
describe('Vision Feature', () => {
  describe('analyzeImage', () => {
    it('should analyze UI screenshot', async () => {
      // Arrange
      const imagePath = './tests/fixtures/images/ui-screenshot.png';
      const prompt = 'Describe the UI layout and components';

      // Act
      const result = await analyzeImage(imagePath, prompt);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toContain('layout');
      expect(result.data).toContain('component');
    });

    it('should handle image not found', async () => {
      // Arrange
      const imagePath = './non-existent.png';

      // Act
      const result = await analyzeImage(imagePath, 'test');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain('not found');
    });

    it('should determine correct vision tool', async () => {
      // Test tool selection logic
      const tool1 = determineVisionTool('Describe the UI');
      expect(tool1).toBe('ui_to_artifact');

      const tool2 = determineVisionTool('Extract all text');
      expect(tool2).toBe('extract_text_from_screenshot');

      const tool3 = determineVisionTool('What error is this?');
      expect(tool3).toBe('diagnose_error_screenshot');
    });
  });
});
```

**Example: Repository Feature**:

```typescript
describe('Repository Feature', () => {
  describe('getRepoStructure', () => {
    it('should fetch repository structure', async () => {
      // Arrange
      const repo = 'vitejs/vite';

      // Act
      const result = await getRepoStructure(repo);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('files');
      expect(result.data.files.length).toBeGreaterThan(0);
    });

    it('should handle invalid repo format', async () => {
      // Arrange
      const invalidRepo = 'not-a-valid-repo';

      // Act
      const result = await getRepoStructure(invalidRepo);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ValidationError);
    });

    it('should fetch specific path', async () => {
      // Arrange
      const repo = 'vitejs/vite';
      const path = '/src';

      // Act
      const result = await getRepoStructure(repo, path);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data.path).toBe('/src');
    });
  });
});
```

---

### 4. Workflow Tests

**Purpose**: Test multi-step workflows

**Characteristics**:
- Test orchestration logic
- Test retry and fallback behavior
- Test result aggregation

**Example: Research Workflow**:

```typescript
describe('researchTopic Workflow', () => {
  it('should complete full research workflow', async () => {
    // Arrange
    const topic = 'React 19 new features';
    const options = {
      depth: 2,
      breadth: 3,
      includeCodeExamples: true,
      sources: ['web', 'github'] as const
    };

    // Act
    const result = await researchTopic(topic, options);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('sourcesAnalyzed');
    expect(result.data).toHaveProperty('keyInsights');
    expect(result.data).toHaveProperty('codeExamples');
    expect(result.data).toHaveProperty('summary');
    expect(result.data.sourcesAnalyzed).toBeGreaterThan(0);
  });

  it('should handle search failure gracefully', async () => {
    // Arrange
    const topic = 'test';
    const options = { depth: 1, breadth: 0 }; // Will fail

    // Act
    const result = await researchTopic(topic, options);

    // Assert - should return error, not throw
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should aggregate results from multiple sources', async () => {
    // Test aggregation logic
  });
});
```

---

### 5. Performance Tests

**Purpose**: Validate performance characteristics

**Characteristics**:
- Measure execution time
- Test memory usage
- Validate concurrency limits

**Example**:

```typescript
describe('Performance Tests', () => {
  describe('batchRead', () => {
    it('should process 100 URLs in under 30 seconds', async () => {
      // Arrange
      const urls = Array(100).fill('https://example.com');

      // Act
      const start = Date.now();
      const result = await batchRead(urls, { concurrency: 10 });
      const duration = Date.now() - start;

      // Assert
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(30000); // 30 seconds
      console.log(`Processed 100 URLs in ${duration}ms`);
    });

    it('should respect concurrency limit', async () => {
      // Arrange
      const urls = Array(20).fill('https://example.com');
      const concurrency = 5;

      // Act
      const result = await batchRead(urls, { concurrency });

      // Assert - verify no more than `concurrency` simultaneous requests
      // (This would require mocking to verify)
      expect(result.success).toBe(true);
    });
  });

  describe('searchWeb', () => {
    it('should complete within 5 seconds', async () => {
      // Arrange
      const query = 'performance test';

      // Act
      const start = Date.now();
      const result = await searchWeb(query);
      const duration = Date.now() - start;

      // Assert
      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(5000);
      console.log(`Search completed in ${duration}ms`);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory in batch operations', async () => {
      // Arrange
      const urls = Array(50).fill('https://example.com');

      // Act
      const memoryBefore = process.memoryUsage().heapUsed;
      await batchRead(urls);
      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryDelta = memoryAfter - memoryBefore;

      // Assert - memory increase should be reasonable
      // (This is a rough check; in practice use more sophisticated tools)
      expect(memoryDelta).toBeLessThan(50 * 1024 * 1024); // 50MB
    });
  });
});
```

---

## Writing Tests

### Test Naming

Use descriptive test names that follow the pattern:

```typescript
describe('Feature', () => {
  describe('functionName', () => {
    it('should [expected behavior] when [condition]', async () => {
      // Examples:
      it('should return search results when query is valid', async () => {});
      it('should throw ValidationError when query is empty', async () => {});
      it('should handle timeout when MCP server is slow', async () => {});
    });
  });
});
```

### AAA Pattern (Arrange-Act-Assert)

```typescript
it('should filter results by domain', async () => {
  // Arrange - Set up test data and conditions
  const query = 'test query';
  const domainFilter = 'example.com';

  // Act - Execute the function being tested
  const result = await searchWeb(query, { domainFilter });

  // Assert - Verify the result
  expect(result.success).toBe(true);
  result.data.forEach(item => {
    expect(item.url).toContain('example.com');
  });
});
```

### Testing Result Types

```typescript
it('should return success result on valid input', async () => {
  const result = await functionToTest('valid input');

  // Check success
  expect(result.success).toBe(true);

  // Access data (TypeScript knows it's safe)
  expect(result.data).toBeDefined();
  expect(result.data.property).toBe('expected value');
});

it('should return error result on invalid input', async () => {
  const result = await functionToTest('');

  // Check failure
  expect(result.success).toBe(false);

  // Access error
  expect(result.error).toBeDefined();
  expect(result.error.message).toContain('validation');
});
```

### Testing Async Code

```typescript
it('should handle async operations', async () => {
  // Use async/await
  const result = await asyncFunction();

  expect(result).toBeDefined();
});

it('should timeout after specified duration', async () => {
  // Test timeout
  const result = await Promise.race([
    asyncFunction(),
    timeoutAfter(5000).then(() => { throw new Error('Timeout'); })
  ]);

  expect(result).toBeDefined();
});
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- search.test.ts

# Run tests matching pattern
npm test -- --testPathPattern=vision

# Run tests in specific folder
npm test -- tests/unit/features/search
```

### Test Categories

```bash
# Unit tests only
npm test -- --testPathPattern=unit

# Integration tests only
npm test -- --testPathPattern=integration

# Performance tests only
npm test -- --testPathPattern=performance
```

### Coverage

```bash
# Generate coverage report
npm test -- --coverage

# Coverage with threshold
npm test -- --coverage --coverageThreshold='{"global":{"lines":80}}'

# View coverage in HTML
open coverage/lcov-report/index.html
```

### Debugging Tests

```bash
# Run single test with logging
npm test -- --testNamePattern="should return results" --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Test Fixtures

### Image Fixtures

Place test images in `tests/fixtures/images/`:

```
tests/fixtures/images/
├── ui-screenshot.png          # UI analysis tests
├── error-message.png          # Error diagnosis tests
├── chart.png                  # Data viz tests
├── code-screenshot.png        # OCR tests
└── blank.png                  # Edge case tests
```

### HTML Fixtures

Place HTML samples in `tests/fixtures/html/`:

```html
<!-- tests/fixtures/html/sample-page.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <h1>Heading</h1>
  <p>Content</p>
</body>
</html>
```

### Mock Responses

Place MCP response mocks in `tests/fixtures/mock-responses/`:

```json
// tests/fixtures/mock-responses/search-results.json
{
  "results": [
    {
      "title": "Test Result",
      "url": "https://example.com",
      "summary": "Test summary",
      "favicon": "https://example.com/favicon.ico",
      "website_name": "Example"
    }
  ]
}
```

### Using Fixtures in Tests

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Feature', () => {
  it('should process image fixture', async () => {
    const imagePath = join(__dirname, '../fixtures/images/ui-screenshot.png');
    const result = await analyzeImage(imagePath, 'Describe UI');
    expect(result.success).toBe(true);
  });

  it('should use mock response', async () => {
    const mockResponse = JSON.parse(
      readFileSync(join(__dirname, '../fixtures/mock-responses/search-results.json'), 'utf-8')
    );

    // Mock MCP call to return this response
    jest.mocked(callMcpTool).mockResolvedValue(mockResponse);

    const result = await searchWeb('test');
    expect(result.data).toEqual(mockResponse.results);
  });
});
```

---

## Mocking MCP Calls

### Dependency Injection Pattern

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

// tests/unit/features/search/web-search.test.ts
describe('searchWeb', () => {
  it('should handle MCP errors', async () => {
    // Create mock client
    const mockClient = {
      call: jest.fn().mockRejectedValue(new Error('MCP unavailable'))
    };

    // Test with mock client
    const result = await searchWeb('test', {}, mockClient);

    expect(result.success).toBe(false);
    expect(mockClient.call).toHaveBeenCalledWith(
      'web-search-prime',
      'webSearchPrime',
      { query: 'test' }
    );
  });
});
```

### Jest Mocks

```typescript
// tests/setup.ts
import { callMcpTool } from '../src/mcp/client';

// Mock MCP client
jest.mock('../src/mcp/client', () => ({
  callMcpTool: jest.fn()
}));

// Use in tests
import { callMcpTool } from '../src/mcp/client';

describe('Feature', () => {
  beforeEach(() => {
    // Reset mock before each test
    jest.mocked(callMcpTool).mockReset();
  });

  it('should call MCP with correct parameters', async () => {
    // Setup mock response
    jest.mocked(callMcpTool).mockResolvedValue({
      results: [{ title: 'Test', url: 'https://example.com' }]
    });

    // Test
    const result = await searchWeb('test query');

    // Verify
    expect(callMcpTool).toHaveBeenCalledWith(
      'web-search-prime',
      'webSearchPrime',
      { search_query: 'test query' }
    );
    expect(result.success).toBe(true);
  });
});
```

---

## Coverage Requirements

### Coverage Goals

| Metric Type | Minimum Target | Preferred Target |
|:---|---:|---:|
| **Statements** | 80% | 90% |
| **Branches** | 75% | 85% |
| **Functions** | 80% | 90% |
| **Lines** | 80% | 90% |

### Critical Areas (100% Coverage Required)

- Input validation (Zod schemas)
- Error handling
- MCP wrapper functions
- Result type transformations
- Security-related code

### Generating Coverage Report

```bash
# Run with coverage
npm test -- --coverage

# View specific file coverage
npm test -- --coverage --collectCoverageFrom='src/features/search/**/*.ts'

# Exclude files from coverage
npm test -- --coverage --coveragePathIgnorePatterns='tests/'
```

### Interpreting Coverage

```bash
# Example output:
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.42 |    82.14 |   88.24 |   86.36|
 search             |   90.00 |    85.71 |   100.00 |   90.00|
  web-search.ts     |   90.00 |    85.71 |   100.00 |   90.00| 45-48
 read               |   80.00 |    75.00 |    80.00 |   82.35|
  web-page.ts       |   80.00 |    75.00 |    80.00 |   82.35| 67,89
--------------------|---------|----------|---------|---------|-------------------
```

**Uncovered lines need tests!**

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Run unit tests
        run: npm test -- --testPathPattern=unit

      - name: Run integration tests (if MCP available)
        run: npm test -- --testPathPattern=integration
        continue-on-error: true

      - name: Generate coverage
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Best Practices

### DO's

- ✅ Write tests before fixing bugs (TDD)
- ✅ Test error paths as thoroughly as happy paths
- ✅ Use descriptive test names
- ✅ Mock external dependencies
- ✅ Keep tests fast (< 100ms per unit test)
- ✅ Test edge cases and boundaries
- ✅ Use fixtures for consistent test data
- ✅ Clean up resources in `afterEach`

### DON'Ts

- ❌ Don't test third-party libraries
- ❌ Don't write brittle tests that break easily
- ❌ Don't use real MCP servers in unit tests
- ❌ Don't ignore test failures
- ❌ Don't commit commented-out tests
- ❌ Don't write tests that are too specific
- ❌ Don't skip tests without explanation

---

## Debugging Failed Tests

### Common Issues

1. **Timeout Errors**
   - Increase timeout: `it('slow test', async () => {}, 10000)`
   - Check MCP server availability
   - Verify network connectivity

2. **Mock Not Working**
   - Verify mock path matches import
   - Check mock is called before test
   - Use `jest.mocked()` for TypeScript

3. **Async Test Issues**
   - Always use `async/await`
   - Return promises when not using await
   - Use `done` callback for callbacks

4. **Flaky Tests**
   - Add delays for MCP server warmup
   - Use fixed test data instead of live queries
   - Implement retry logic for external calls

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [SMITE Engineering Rules](../../.claude/rules/engineering.md)

---

**Last Updated**: 2026-01-20
**Maintainer**: @pamacea
