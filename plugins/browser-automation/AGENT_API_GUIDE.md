# Agent API Quick Reference

**@smite/browser-automation** - Agent-friendly browser automation for research, analysis, and debugging.

## Quick Import

```typescript
import {
  // Search capabilities
  searchWeb,
  searchAndRead,
  searchMultiple,

  // Read capabilities
  readWebPage,
  batchRead,
  extractStructuredData,

  // Analyze capabilities
  analyzeImage,
  extractText,
  diagnoseError,
  analyzeUI,
  compareUI,

  // Repository capabilities
  readRepoFile,
  getRepoStructure,
  searchRepoDocs,
  analyzeRepo,

  // Workflow capabilities
  researchTopic,
  debugError,
  analyzeLibrary,
  auditCodebase,

  // Utilities
  isSuccess,
  unwrap,
} from '@smite/browser-automation';
```

## Result Pattern

All functions return `Result<T, Error>`:

```typescript
const result = await searchWeb('query');

if (result.success) {
  console.log(result.data);  // Access data
} else {
  console.error(result.error); // Handle error
}

// Or use utilities
if (isSuccess(result)) {
  const data = unwrap(result);
}
```

## Capability Categories

### 1. SEARCH

**Simple search:**
```typescript
const results = await searchWeb('Next.js 15 documentation');
// Returns: Result<WebSearchResult[], Error>
```

**Search + read top results:**
```typescript
const research = await searchAndRead('TypeScript best practices', {
  maxResults: 5,
  readLimit: 3
});
// Returns: Result<SearchAndReadResult, Error>
```

**Parallel searches:**
```typescript
const multi = await searchMultiple([
  'React Server Components',
  'Next.js 15 features'
]);
// Returns: Result<MultiSearchResult, Error>
```

**Deep research:**
```typescript
const findings = await research('machine learning for developers', {
  depth: 2,
  breadth: 3
});
// Returns: Result<EnhancedSearchResult, Error>
```

### 2. READ

**Read single page:**
```typescript
const content = await readWebPage('https://example.com', {
  returnFormat: 'markdown',
  retainImages: true
});
// Returns: Result<WebReaderResponse, Error>
```

**Read multiple pages:**
```typescript
const pages = await batchRead([
  'https://example.com/page1',
  'https://example.com/page2'
], { concurrency: 3 });
// Returns: Result<BatchReadResults, Error>
```

**Extract structured data:**
```typescript
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  price: z.number()
});

const data = await extractStructuredData('https://example.com', schema);
// Returns: Result<ExtractedData, Error>
```

### 3. ANALYZE

**Analyze image:**
```typescript
const analysis = await analyzeImage(
  'https://example.com/image.png',
  'Describe the main elements'
);
// Returns: Result<string, Error>
```

**Extract text from screenshot:**
```typescript
const text = await extractText(
  'screenshot.png',
  'Extract all code',
  'typescript'  // Optional language hint
);
// Returns: Result<string, Error>
```

**Diagnose error:**
```typescript
const diagnosis = await diagnoseError(
  'error.png',
  'How do I fix this?',
  'During npm install'
);
// Returns: Result<string, Error>
```

**Analyze UI design:**
```typescript
const ui = await analyzeUI(
  'design.png',
  'code',  // 'code' | 'prompt' | 'spec' | 'description'
  'Generate React component'
);
// Returns: Result<string, Error>
```

**Compare UIs:**
```typescript
const diff = await compareUI(
  'expected.png',
  'actual.png',
  'Compare layout and spacing'
);
// Returns: Result<string, Error>
```

### 4. REPOSITORY

**Read repo file:**
```typescript
const code = await readRepoFile('vitejs/vite', 'README.md');
// Returns: Result<string, Error>
```

**Get repo structure:**
```typescript
const structure = await getRepoStructure('vitejs/vite', '/src');
// Returns: Result<DirectoryStructure[], Error>
```

**Search repo docs:**
```typescript
const docs = await searchRepoDocs('vitejs/vite', 'plugin API', 'en');
// Returns: Result<SearchResult[], Error>
```

**Full repo analysis:**
```typescript
const analysis = await analyzeRepo('facebook/react', {
  includeFileCount: true,
  includeLanguages: true
});
// Returns: Result<RepositoryAnalysis, Error>
```

### 5. WORKFLOW

**Research topic:**
```typescript
const findings = await researchTopic('React Server Components', {
  depth: 3,
  includeCodeExamples: true,
  sources: ['web', 'github']
});
// Returns: Result<ResearchTopicResult, Error>
```

**Debug error:**
```typescript
const solution = await debugError(
  'error.png',
  'During npm test',
  { searchForSolutions: true }
);
// Returns: Result<DebugErrorResult, Error>
```

**Analyze library:**
```typescript
const analysis = await analyzeLibrary('zustand', 'state management', {
  checkLatestVersion: true,
  analyzeExamples: true,
  checkAlternatives: true
});
// Returns: Result<AnalyzeLibraryResult, Error>
```

**Audit codebase:**
```typescript
const audit = await auditCodebase('owner/repo', {
  checkPatterns: true,
  analyzeStructure: true,
  detectIssues: true,
  maxFiles: 100
});
// Returns: Result<AuditCodebaseResult, Error>
```

## Utility Functions

**Check success:**
```typescript
if (isSuccess(result)) {
  // Handle success
}
```

**Check failure:**
```typescript
if (isFailure(result)) {
  // Handle error
}
```

**Unwrap or throw:**
```typescript
const data = unwrap(result); // Throws if failed
```

**Unwrap or default:**
```typescript
const data = unwrapOr(result, []);
```

**Map transformation:**
```typescript
const urls = map(result, (data) => data.map(x => x.url));
```

**Chain operations:**
```typescript
const result = await andThen(searchResult, (data) => {
  return batchRead(data.map(r => r.url));
});
```

**Retry with backoff:**
```typescript
const result = await retry(
  () => searchWeb('query'),
  5,  // maxAttempts
  2000 // delayMs
);
```

**Parallel execution:**
```typescript
const results = await all([
  () => searchWeb('query1'),
  () => searchWeb('query2')
]);
```

**Parallel settled:**
```typescript
const results = await allSettled([
  () => searchWeb('query1'),
  () => searchWeb('query2')
]);
const successful = results.filter(isSuccess);
```

## Best Practices

1. **Always check results:**
   ```typescript
   const result = await searchWeb('query');
   if (isSuccess(result)) {
     // Use result.data
   }
   ```

2. **Use parallel operations for speed:**
   ```typescript
   // Fast
   const results = await searchMultiple(['q1', 'q2', 'q3']);

   // Slow
   for (const q of ['q1', 'q2', 'q3']) {
     await searchWeb(q);
   }
   ```

3. **Prefer workflows over manual composition:**
   ```typescript
   // Good - one call, comprehensive
   const findings = await researchTopic('React', { depth: 3 });

   // Verbose - multiple calls
   const search = await searchWeb('React');
   const read = await batchRead(...);
   // ...
   ```

4. **Use type exports for type safety:**
   ```typescript
   import type { WebSearchResult, Result } from '@smite/browser-automation';

   function process(result: Result<WebSearchResult[], Error>) {
     // ...
   }
   ```

## Common Workflows

### Research a Technology

```typescript
async function researchTech(techName: string) {
  // Deep research
  const findings = await researchTopic(techName, {
    depth: 3,
    includeCodeExamples: true
  });

  if (isSuccess(findings)) {
    console.log('Key insights:', findings.data.keyInsights);
    console.log('Code examples:', findings.data.codeExamples);
  }

  return findings;
}
```

### Debug Error

```typescript
async function debugErrorFromScreenshot(screenshotPath: string, context: string) {
  // Diagnose + search solutions
  const diagnosis = await debugError(screenshotPath, context, {
    searchForSolutions: true,
    maxSearchResults: 5
  });

  if (isSuccess(diagnosis)) {
    console.log('Root cause:', diagnosis.data.rootCause);
    console.log('Solutions:', diagnosis.data.solutions);
  }

  return diagnosis;
}
```

### Analyze Library

```typescript
async function evaluateLibrary(libName: string, useCase: string) {
  // Comprehensive analysis
  const analysis = await analyzeLibrary(libName, useCase, {
    checkLatestVersion: true,
    readDocumentation: true,
    analyzeExamples: true,
    checkAlternatives: true
  });

  if (isSuccess(analysis)) {
    console.log('Version:', analysis.data.version);
    console.log('Best for:', analysis.data.bestUseCases);
    console.log('Alternatives:', analysis.data.alternatives);
  }

  return analysis;
}
```

### Explore Repository

```typescript
async function exploreRepo(repo: string) {
  // Get structure
  const structure = await getRepoStructure(repo, '/');

  // Read key files
  const readme = await readRepoFile(repo, 'README.md');
  const packageJson = await readRepoFile(repo, 'package.json');

  // Search docs
  const docs = await searchRepoDocs(repo, 'usage', 'en');

  return {
    structure: isSuccess(structure) ? structure.data : null,
    readme: isSuccess(readme) ? readme.data : null,
    packageJson: isSuccess(packageJson) ? packageJson.data : null,
    docs: isSuccess(docs) ? docs.data : null
  };
}
```

## Advanced Usage

### Custom Retry Configuration

```typescript
import { WebSearchClient } from '@smite/browser-automation';

const client = new WebSearchClient({
  maxAttempts: 5,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2
});

const result = await client.search({ query: 'test' });
```

### Batch Processing

```typescript
import { all } from '@smite/browser-automation';

// Process multiple searches in parallel
const results = await all(
  queries.map(q => () => searchWeb(q))
);
```

### Error Recovery

```typescript
import { retry, unwrapOr } from '@smite/browser-automation';

// Retry with fallback
const result = await retry(
  () => searchWeb('query'),
  3,
  1000
);

const data = unwrapOr(result, []); // Fallback to empty array
```

## See Also

- [Full API Documentation](./README.md)
- [Examples](./examples/agent-usage.ts)
- [Type Definitions](./src/index.ts)
