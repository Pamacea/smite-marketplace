# Search Feature API Cheatsheet

Quick reference for the Search Feature Module.

## Import

```typescript
import {
  SearchFeature,
  searchWeb,
  searchAndRead,
  searchMultiple,
  research,
} from '@smite/browser-automation/features';
```

## Quick Start

### Basic Search

```typescript
const results = await searchWeb('query');
if (results.success) {
  results.data.forEach(item => console.log(item.title));
}
```

### Search and Read

```typescript
const result = await searchAndRead('topic', { readCount: 3 });
if (result.success) {
  for (const [url, content] of result.data.content) {
    console.log(`${url}: ${content.length} chars`);
  }
}
```

### Multi-Query Search

```typescript
const result = await searchMultiple(['q1', 'q2', 'q3']);
if (result.success) {
  console.log(`Total: ${result.data.totalResults}`);
}
```

### Research Workflow

```typescript
const summary = await research('topic');
if (summary.success) {
  console.log(summary.data); // Markdown summary
}
```

## API Reference

### searchWeb(query, options?)

Search the web with optional filters.

```typescript
await searchWeb('query', {
  timeRange: 'oneWeek',      // 'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear' | 'noLimit'
  domainFilter: 'github.com', // string | string[]
  location: 'us',            // 'cn' | 'us'
  contentSize: 'medium',      // 'medium' | 'high'
  maxResults: 10,            // number
  enrich: true               // boolean (default: true)
});
```

### searchAndRead(query, options?)

Search and read top N results.

```typescript
await searchAndRead('query', {
  readCount: 3,
  readOptions: {
    returnFormat: 'markdown', // 'markdown' | 'text'
    retainImages: false,       // boolean
    timeout: 20,               // seconds
    useCache: true             // boolean
  },
  searchOptions: { /* same as searchWeb */ }
});
```

### searchMultiple(queries, options?)

Search multiple queries.

```typescript
await searchMultiple(['q1', 'q2'], {
  parallel: true,        // boolean (default: true)
  maxConcurrency: 3,     // number (default: 3)
  commonOptions: {       // applied to all queries
    timeRange: 'oneMonth'
  }
});
```

### research(query, readCount?)

Full research workflow: search → read → summarize.

```typescript
await research('topic', 3); // readCount = 3
```

## Result Types

### EnhancedSearchResult

```typescript
{
  title: string;
  url: string;
  summary: string;
  siteName: string;
  favicon?: string;
  publishedDate?: string;
  domain: string;        // extracted
  timestamp: string;     // extracted
  extractedAt: string;   // ISO timestamp
}
```

### SearchAndReadResult

```typescript
{
  query: string;
  searchResults: EnhancedSearchResult[];
  content: Map<string, string>;  // URL → content
  totalResults: number;
  successfulReads: number;
}
```

### MultiSearchResult

```typescript
{
  queries: string[];
  results: Map<string, EnhancedSearchResult[]>;  // query → results
  totalResults: number;
}
```

## Error Handling

```typescript
import { isSuccess, isFailure, unwrap } from '@smite/browser-automation/mcp';

const result = await searchWeb('query');

// Pattern matching
if (isSuccess(result)) {
  console.log(result.data);
}

// Unwrap or throw
const data = unwrap(result);

// Safe unwrap
const data = result.success ? result.data : [];
```

## Class API

### SearchFeature

```typescript
const feature = new SearchFeature();

// All search functions available
await feature.searchWeb('query');
await feature.searchAndRead('query', { readCount: 3 });
await feature.searchMultiple(['q1', 'q2']);
await feature.research('topic');

// Convenience methods
await feature.searchRecent('news', 'oneDay');
await feature.searchDomains('docs', ['github.com']);
```

## Common Patterns

### Competitive Analysis

```typescript
const competitors = ['asana.com', 'trello.com', 'monday.com'];
const result = await searchMultiple(
  competitors.map(d => `site:${d} features`),
  { parallel: true }
);
```

### Documentation Research

```typescript
const result = await searchAndRead('TypeScript patterns', {
  readCount: 5,
  readOptions: { returnFormat: 'markdown' }
});

// Extract code examples
for (const [url, content] of result.data.content) {
  const examples = content.match(/```ts\n[\s\S]*?\n```/g) || [];
  console.log(`Found ${examples.length} examples in ${url}`);
}
```

### Trend Analysis

```typescript
const trends = await searchMultiple(
  ['topic today', 'topic this week', 'topic this month'],
  { parallel: true }
);

for (const [query, results] of trends.data.results) {
  console.log(`${query}: ${results.length} results`);
}
```

### Source Discovery

```typescript
const result = await searchWeb('topic github', {
  domainFilter: 'github.com'
});

const repos = result.data
  .map(r => r.url.match(/github\.com\/([^\/]+\/[^\/]+)/)?.[0])
  .filter(Boolean);

console.log('Found repos:', repos);
```

## Performance Tips

1. **Limit reads**: Use `readCount` to avoid reading too many pages
2. **Parallel searches**: Use `searchMultiple` with `parallel: true`
3. **Concurrency control**: Set `maxConcurrency` to avoid rate limits
4. **Filter early**: Use `timeRange` and `domainFilter` to reduce results

## See Also

- Full documentation: `docs/SEARCH_FEATURE.md`
- Demo: `examples/search-feature-demo.ts`
- Tests: `src/features/search.feature.test.ts`
