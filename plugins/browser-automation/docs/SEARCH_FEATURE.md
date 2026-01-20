# Search Feature Module

Layer 2 feature module for advanced web search and research capabilities.

## Overview

The Search Feature Module provides high-level, agent-friendly search functionality built on top of the MCP client layer. It enables web search with advanced filters, parallel multi-query search, and integrated search + read workflows.

## Installation

```typescript
import {
  SearchFeature,
  searchWeb,
  searchAndRead,
  searchMultiple,
  research,
} from '@smite/browser-automation/features';
```

## Core Features

### 1. Web Search (`searchWeb`)

Basic web search with optional filters and result enrichment.

**Type Signature:**
```typescript
async searchWeb(
  query: string,
  options?: SearchFeatureOptions
): Promise<Result<EnhancedSearchResult[]>>
```

**Options:**
- `query` (required): Search query string
- `timeRange`: Filter by recency (`'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear' | 'noLimit'`)
- `domainFilter`: Limit to specific domains (string or array of strings)
- `location`: Target location (`'cn' | 'us'`)
- `contentSize`: Result detail level (`'medium' | 'high'`)
- `maxResults`: Maximum number of results to return
- `enrich`: Add domain and timestamp metadata (default: `true`)

**Examples:**

```typescript
// Basic search
const results = await searchWeb('Browser automation tools');
if (results.success) {
  console.log(`Found ${results.data.length} results`);
  results.data.forEach(item => {
    console.log(`${item.title} - ${item.url}`);
  });
}

// Search recent results
const recent = await searchWeb('AI news', {
  timeRange: 'oneWeek',
  location: 'us'
});

// Search specific domains
const docs = await searchWeb('TypeScript patterns', {
  domainFilter: ['github.com', 'typescriptlang.org']
});

// Limit results
const limited = await searchWeb('programming tutorials', {
  maxResults: 10,
  timeRange: 'oneMonth'
});
```

**Result Type:**
```typescript
interface EnhancedSearchResult {
  title: string;        // Result title
  url: string;          // Result URL
  summary: string;      // Result summary/description
  siteName: string;     // Site name
  favicon?: string;     // Favicon URL
  publishedDate?: string; // Publication date
  domain: string;       // Extracted domain name
  timestamp: string;    // Timestamp (published date or now)
  extractedAt: string;  // When result was extracted
}
```

---

### 2. Search and Read (`searchAndRead`)

Search the web and automatically read the top N results.

**Type Signature:**
```typescript
async searchAndRead(
  query: string,
  options?: SearchAndReadOptions
): Promise<Result<SearchAndReadResult>>
```

**Options:**
- `readCount`: Number of top results to read (default: `3`)
- `readOptions`: Options passed to URL reader
  - `returnFormat`: `'markdown' | 'text'`
  - `retainImages`: Keep image references
  - `timeout`: Request timeout in seconds
  - `useCache`: Use cached responses
- `searchOptions`: Options passed to search

**Examples:**

```typescript
// Basic search and read
const result = await searchAndRead('MCP browser automation', {
  readCount: 5
});

if (result.success) {
  console.log(`Read ${result.data.successfulReads} pages`);
  console.log(`Total results: ${result.data.totalResults}`);

  // Access content
  for (const [url, content] of result.data.content) {
    console.log(`\n## ${url}\n`);
    console.log(content.substring(0, 500) + '...');
  }
}

// With custom read options
const result = await searchAndRead('React hooks tutorial', {
  readCount: 3,
  readOptions: {
    returnFormat: 'markdown',
    retainImages: false,
    useCache: true
  },
  searchOptions: {
    timeRange: 'oneMonth'
  }
});
```

**Result Type:**
```typescript
interface SearchAndReadResult {
  query: string;                              // Original query
  searchResults: EnhancedSearchResult[];      // Top N results
  content: Map<string, string>;               // URL -> content mapping
  totalResults: number;                       // Total search results
  successfulReads: number;                    // Successfully read pages
}
```

---

### 3. Multi-Query Search (`searchMultiple`)

Search multiple queries in parallel or sequentially.

**Type Signature:**
```typescript
async searchMultiple(
  queries: string[],
  options?: MultiSearchOptions
): Promise<Result<MultiSearchResult>>
```

**Options:**
- `parallel`: Execute in parallel (default: `true`)
- `maxConcurrency`: Max concurrent searches (default: `3`)
- `commonOptions`: Apply to all searches
  - All `SearchFeatureOptions` except `query`

**Examples:**

```typescript
// Parallel comparison search
const result = await searchMultiple(
  ['React hooks', 'Vue composition API', 'Svelte stores'],
  { parallel: true }
);

if (result.success) {
  console.log(`Total results: ${result.data.totalResults}`);

  for (const [query, results] of result.data.results) {
    console.log(`${query}: ${results.length} results`);
  }
}

// With common filters
const result = await searchMultiple(
  ['JavaScript', 'TypeScript', 'Python'],
  {
    parallel: true,
    commonOptions: {
      timeRange: 'oneMonth',
      location: 'us',
      maxResults: 10
    }
  }
);

// Sequential execution
const result = await searchMultiple(
  ['query 1', 'query 2', 'query 3'],
  { parallel: false }
);

// Limited concurrency
const queries = Array.from({ length: 20 }, (_, i) => `query ${i}`);
const result = await searchMultiple(queries, {
  parallel: true,
  maxConcurrency: 5
});
```

**Result Type:**
```typescript
interface MultiSearchResult {
  queries: string[];                              // All queries searched
  results: Map<string, EnhancedSearchResult[]>;   // Query -> results mapping
  totalResults: number;                           // Aggregate result count
}
```

---

### 4. Research Workflow (`research`)

Complete research workflow: search → read → summarize.

**Type Signature:**
```typescript
async research(
  query: string,
  readCount?: number
): Promise<Result<string>>
```

**Parameters:**
- `query`: Research topic
- `readCount`: Number of sources to read (default: `3`)

**Examples:**

```typescript
// Basic research
const summary = await research('Browser automation in 2025');

if (summary.success) {
  console.log(summary.data);
  // Output:
  // # Research Summary: Browser automation in 2025
  //
  // ## Sources (3)
  // 1. **[Title]**(url)
  //    summary...
  // 2. **[Title]**(url)
  //    summary...
  //
  // ## Key Findings
  // ### Source 1
  // **URL:** url
  // content preview...
  //
  // ### Source 2
  // ...
}
```

---

## Convenience Methods

The `SearchFeature` class provides additional convenience methods:

### `searchRecent`

Search recent results with a time range filter.

```typescript
const feature = new SearchFeature();

const recent = await feature.searchRecent('AI news', 'oneDay');
// Equivalent to:
await feature.searchWeb('AI news', { timeRange: 'oneDay' });
```

### `searchDomains`

Search specific domains.

```typescript
const docs = await feature.searchDomains(
  'TypeScript generics',
  ['github.com', 'typescriptlang.org']
);
// Equivalent to:
await feature.searchWeb('TypeScript generics', {
  domainFilter: ['github.com', 'typescriptlang.org']
});
```

---

## Use Cases

### 1. Competitive Analysis

```typescript
const competitors = ['asana.com', 'trello.com', 'monday.com'];
const queries = competitors.map(domain =>
  `site:${domain} project management features`
);

const result = await searchMultiple(queries, {
  parallel: true,
  maxConcurrency: 3
});

if (result.success) {
  // Compare features across competitors
  for (const [query, results] of result.data.results) {
    console.log(`\n${query}:`);
    results.slice(0, 5).forEach(r => {
      console.log(`  - ${r.title}`);
    });
  }
}
```

### 2. Documentation Research

```typescript
const docs = await searchAndRead('TypeScript utility types', {
  readCount: 5,
  readOptions: {
    returnFormat: 'markdown',
    retainImages: false
  }
});

if (docs.success) {
  // Extract code examples from documentation
  const examples: string[] = [];

  for (const [url, content] of docs.data.content) {
    const codeBlocks = content.match(/```typescript\n[\s\S]*?\n```/g) || [];
    examples.push(...codeBlocks);
  }

  console.log(`Found ${examples.length} code examples`);
}
```

### 3. Trend Analysis

```typescript
const timeRanges = ['oneDay', 'oneWeek', 'oneMonth'] as const;

const trends = await searchMultiple(
  timeRanges.map(range => `Browser automation ${range}`),
  {
    parallel: true,
    commonOptions: {
      maxResults: 20
    }
  }
);

if (trends.success) {
  // Compare result volumes over time
  for (const [query, results] of trends.data.results) {
    const range = query.split(' ').pop() as string;
    console.log(`${range}: ${results.length} results`);
  }
}
```

### 4. Source Discovery

```typescript
const result = await searchWeb('MCP browser automation GitHub', {
  domainFilter: 'github.com',
  maxResults: 10
});

if (result.success) {
  // Extract repo URLs
  const repos = result.data
    .map(r => {
      const match = r.url.match(/github\.com\/([^\/]+\/[^\/]+)/);
      return match ? `https://${match[0]}` : null;
    })
    .filter((url): url is string => url !== null);

  console.log(`Found ${repos.length} repositories`);
  repos.forEach(repo => console.log(`  - ${repo}`));
}
```

---

## Error Handling

All search functions return a `Result<T, Error>` type:

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };
```

**Pattern matching:**

```typescript
import { isSuccess, isFailure, unwrap, unwrapOr } from '@smite/browser-automation/mcp';

const result = await searchWeb('test query');

// Check success
if (isSuccess(result)) {
  console.log(result.data);
}

// Check failure
if (isFailure(result)) {
  console.error(result.error);
}

// Unwrap or throw
const data = unwrap(result); // Throws if failed

// Unwrap or default
const data = unwrapOr(result, []);
```

---

## Performance Considerations

### Parallel Execution

Multi-query search with parallel execution is significantly faster:

```typescript
// Good: Parallel execution (3-5x faster)
const result = await searchMultiple(queries, { parallel: true });

// Slower: Sequential execution
const result = await searchMultiple(queries, { parallel: false });
```

### Batch Size Control

Limit concurrency to avoid rate limiting:

```typescript
const result = await searchManyQueries(queries, {
  parallel: true,
  maxConcurrency: 3  // Adjust based on API limits
});
```

### Read Optimization

Only read the number of results you need:

```typescript
// Good: Read top 3
const result = await searchAndRead('topic', { readCount: 3 });

// Wasteful: Read all results
const searchResult = await searchWeb('topic');
const allUrls = searchResult.data.map(r => r.url);
const content = await readMultipleUrls(allUrls); // Too many reads!
```

---

## Type Safety

All functions are fully typed. Import types as needed:

```typescript
import type {
  EnhancedSearchResult,
  SearchAndReadResult,
  MultiSearchResult,
  SearchFeatureOptions,
  SearchAndReadOptions,
  MultiSearchOptions,
} from '@smite/browser-automation/features';

// Use types in your code
function processResult(result: EnhancedSearchResult) {
  console.log(`${result.title} from ${result.domain}`);
}
```

---

## Testing

See `src/features/search.feature.test.ts` for comprehensive test examples.

Run tests:

```bash
npm test -- search.feature.test.ts
```

---

## API Reference

### Classes

- **`SearchFeature`**: Main feature class with all search methods

### Functions

- **`searchWeb(query, options?)`**: Quick web search
- **`searchAndRead(query, options?)`**: Search and read top results
- **`searchMultiple(queries, options?)`**: Multi-query search
- **`research(query, readCount?)`**: Research workflow

### Types

- **`EnhancedSearchResult`**: Search result with metadata
- **`SearchAndReadResult`**: Search + content composite result
- **`MultiSearchResult`**: Multi-query search aggregate
- **`SearchFeatureOptions`**: Search configuration
- **`SearchAndReadOptions`**: Search + read configuration
- **`MultiSearchOptions`**: Multi-search configuration

---

## Examples

See `examples/search-feature-demo.ts` for runnable examples.

Run demo:

```bash
ts-node examples/search-feature-demo.ts
```

---

## Related Modules

- **Read Feature**: `src/features/read.feature.ts` - Advanced URL reading
- **Vision Feature**: `src/features/vision.feature.ts` - Image analysis
- **Repository Feature**: `src/features/repository.feature.ts` - GitHub analysis
- **MCP Utils**: `src/mcp/utils.ts` - Workflow helpers

---

## Architecture

The Search Feature Module is part of Layer 2 in the MCP-first architecture:

```
Layer 4: CLI & Agent API
    ↓
Layer 3: Workflow Orchestrator
    ↓
Layer 2: Feature Modules (this module)
    ↓
Layer 1: MCP Client Wrapper
    ↓
z.ai MCP Servers
```

**Dependencies:**
- `WebSearchClient` (MCP Layer 1)
- `WebReaderClient` (MCP Layer 1)

**Used By:**
- Workflow orchestrator (Layer 3)
- CLI commands (Layer 4)
- Agent convenience API (Layer 4)

---

## Contributing

When adding new search features:

1. Add method to `SearchFeature` class
2. Update TypeScript types
3. Add tests to `search.feature.test.ts`
4. Add example to `search-feature-demo.ts`
5. Update this documentation

---

## License

MIT License - See LICENSE file for details.
