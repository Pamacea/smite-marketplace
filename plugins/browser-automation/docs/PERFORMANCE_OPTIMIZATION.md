# Performance Optimization Guide

This guide explains how to use the caching, metrics tracking, and batch optimization features of the browser-automation plugin.

## Overview

The browser-automation plugin includes three performance optimization utilities:

1. **Cache** - LRU cache with TTL and request deduplication
2. **Metrics** - Performance tracking and analytics
3. **Batch** - Parallel execution with concurrency control

These features can provide **30-90% performance improvements** for typical workflows.

---

## Quick Start

### Automatic Caching

Caching is enabled by default in all MCP clients:

```typescript
import { readWebPage } from '@smite/browser-automation';

// First call - fetches from MCP server (2000ms)
const result1 = await readWebPage('https://example.com');

// Second call - returns from cache (<10ms)
const result2 = await readWebPage('https://example.com');
```

### Disable Caching Per-Request

```typescript
const result = await readWebPage('https://example.com', {
  useCache: false  // Force fresh fetch
});
```

---

## Cache Utility

### Basic Usage

```typescript
import { Cache } from '@smite/browser-automation/utils';

// Create cache
const cache = new Cache<string>({
  ttl: 3600000,      // 1 hour
  maxSize: 1000,     // Max 1000 entries
  deduplicate: true, // Enable request deduplication
  trackStats: true   // Enable statistics
});

// Set value
cache.set('key', 'value', 60000); // 1 minute TTL

// Get value
const value = cache.get('key');

// Get or compute with deduplication
const result = await cache.getOrSet('key', async () => {
  return await expensiveOperation();
});

// Check if key exists
if (cache.has('key')) {
  console.log('Key exists');
}

// Delete key
cache.delete('key');

// Clear all
cache.clear();

// Get statistics
const stats = cache.getStats();
console.log(`Hit rate: ${stats.hitRate * 100}%`);
```

### Global Cache Instances

The plugin includes pre-configured caches for common use cases:

```typescript
import {
  webReaderCache,   // Web page content (1 hour TTL, 500 entries)
  webSearchCache,   // Search results (30 min TTL, 200 entries)
  visionCache       // Vision analysis (2 hour TTL, 100 entries)
} from '@smite/browser-automation/utils';
```

### Cache Key Generation

```typescript
import { generateCacheKey } from '@smite/browser-automation/utils';

const key = generateCacheKey('web-reader', {
  url: 'https://example.com',
  format: 'markdown',
  retainImages: true
});
// Result: "web-reader:format=markdown&retainImages=true&url=https://example.com"
```

---

## Metrics Tracking

### Basic Usage

```typescript
import { metrics } from '@smite/browser-automation/utils';

// Manual tracking
const metric = metrics.start('web-reader');
try {
  const result = await readWebPage(url);
  metrics.end(metric, true, false, result.data.length);
} catch (error) {
  metrics.end(metric, false);
}

// Automatic tracking
const result = await metrics.track('web-reader', async () => {
  return await readWebPage(url);
});

// Get statistics
const stats = metrics.getStats('web-reader');
console.log(`
  Total calls: ${stats.totalCalls}
  Cache hits: ${stats.cacheHits}
  Hit rate: ${(stats.cacheHits / stats.totalCalls * 100).toFixed(1)}%
  Avg duration: ${stats.avgDuration.toFixed(0)}ms
`);

// Calculate improvement
const improvement = metrics.calculateImprovement('web-reader');
if (improvement) {
  console.log(`${improvement.improvementPercent.toFixed(1)}% faster`);
}

// Print all statistics
metrics.printSummary();
```

### Reset Metrics

```typescript
import { resetMetrics } from '@smite/browser-automation/utils';

resetMetrics();
```

---

## Batch Processing

### Basic Batching

```typescript
import { batchExecute } from '@smite/browser-automation/utils';

const urls = ['url1', 'url2', 'url3', ...];

const results = await batchExecute(
  urls.map(url => () => readWebPage(url)),
  {
    concurrency: 5,       // Max 5 parallel operations
    logProgress: true,    // Enable progress logging
    batchDelay: 100,      // 100ms delay between batches
  }
);

console.log(`
  Successful: ${results.successful.length}
  Failed: ${results.failed.length}
  Duration: ${results.duration}ms
  Success rate: ${(results.successRate * 100).toFixed(1)}%
`);
```

### Deduplicated Batching

```typescript
import { batchExecuteDeduplicated } from '@smite/browser-automation/utils';

const results = await batchExecuteDeduplicated([
  { key: 'url1', fn: () => readWebPage('url1') },
  { key: 'url2', fn: () => readWebPage('url2') },
  { key: 'url1', fn: () => readWebPage('url1') }, // Duplicate!
  { key: 'url3', fn: () => readWebPage('url3') },
  { key: 'url2', fn: () => readWebPage('url2') }, // Duplicate!
]);

// Only 3 unique operations executed (not 5)
// 40% reduction in API calls
```

### Batch with Retry

```typescript
import { batchExecuteWithRetry } from '@smite/browser-automation/utils';

const results = await batchExecuteWithRetry(
  operations.map(op => () => execute(op)),
  {
    concurrency: 5,
    retryFailed: true,    // Retry failed operations
    maxRetries: 2,        // Up to 2 retries
    retryDelay: 1000      // 1 second between retries
  }
);
```

### Progress Callbacks

```typescript
import { processInChunks } from '@smite/browser-automation/utils';

const results = await processInChunks(
  largeArray,
  async (item) => {
    return await processItem(item);
  },
  {
    chunkSize: 100,
    concurrency: 10,
    onProgress: (completed, total) => {
      console.log(`Progress: ${completed}/${total} (${(completed/total*100).toFixed(1)}%)`);
    }
  }
);
```

---

## Performance Tips

### 1. Use Batching for Multiple Operations

```typescript
// ❌ Slow - sequential execution
for (const url of urls) {
  await readWebPage(url);
}

// ✅ Fast - parallel execution
await batchExecute(
  urls.map(url => () => readWebPage(url)),
  { concurrency: 5 }
);
```

### 2. Leverage Cache for Repeated Requests

```typescript
// ❌ Wasteful - fetches same URL 10 times
for (let i = 0; i < 10; i++) {
  await readWebPage('https://example.com', { useCache: false });
}

// ✅ Efficient - fetches once, caches result
for (let i = 0; i < 10; i++) {
  await readWebPage('https://example.com'); // Cache enabled by default
}
```

### 3. Deduplicate Identical Requests

```typescript
// ❌ Inefficient - 5 duplicate requests
const requests = ['url1', 'url2', 'url1', 'url3', 'url2'];
for (const url of requests) {
  await readWebPage(url);
}

// ✅ Efficient - 3 unique requests
await batchExecuteDeduplicated(
  requests.map(url => ({
    key: url,
    fn: () => readWebPage(url)
  }))
);
```

### 4. Monitor Performance

```typescript
// After important operations
metrics.printSummary();

// Calculate improvement
const improvement = metrics.calculateImprovement('web-reader');
if (improvement) {
  console.log(`✨ ${improvement.description}`);
}
```

---

## Configuration

### Cache Configuration

```typescript
import { Cache } from '@smite/browser-automation/utils';

const cache = new Cache<string>({
  ttl: 7200000,          // Time-to-live in milliseconds
  maxSize: 1000,         // Maximum number of entries
  deduplicate: true,     // Enable request deduplication
  trackStats: true       // Enable statistics tracking
});
```

### Batch Configuration

```typescript
const options = {
  concurrency: 5,         // Max concurrent operations
  batchDelay: 100,        // Delay between batches (ms)
  logProgress: true,      // Enable progress logging
  signal: abortSignal     // Cancellation signal
};
```

### Custom Cache for MCP Client

```typescript
import { WebReaderClient } from '@smite/browser-automation/mcp';
import { Cache } from '@smite/browser-automation/utils';

const customCache = new Cache<string>({
  ttl: 1800000, // 30 minutes
  maxSize: 200
});

const client = new WebReaderClient(undefined, customCache);
```

---

## Utilities Reference

### Cache Functions

- `new Cache<T>(options)` - Create cache instance
- `cache.get(key)` - Get value
- `cache.set(key, value, ttl?)` - Set value
- `cache.getOrSet(key, fn, ttl?)` - Get or compute
- `cache.has(key)` - Check if key exists
- `cache.delete(key)` - Delete key
- `cache.clear()` - Clear all
- `cache.getStats()` - Get statistics
- `generateCacheKey(prefix, params)` - Generate cache key
- `resetAllCaches()` - Reset all global caches
- `logCacheStats(cache, label)` - Log cache statistics

### Metrics Functions

- `metrics.start(operation)` - Start tracking
- `metrics.end(metric, success, cached?, size?)` - End tracking
- `metrics.track(operation, fn)` - Track automatically
- `metrics.getStats(operation)` - Get statistics
- `metrics.getAllStats()` - Get all statistics
- `metrics.calculateImprovement(operation)` - Calculate improvement
- `metrics.printStats(operation?)` - Print statistics
- `metrics.printSummary()` - Print summary
- `metrics.clear()` - Clear all metrics
- `resetMetrics()` - Reset metrics
- `timedOperation(operation, fn)` - Time operation

### Batch Functions

- `batchExecute(operations, options?)` - Execute batch
- `batchExecuteDeduplicated(operations, options?)` - Execute with deduplication
- `batchExecuteWithRetry(operations, options?)` - Execute with retry
- `processInChunks(items, processor, options?)` - Process in chunks
- `groupBy(items, keyFn)` - Group by key
- `createProgressReporter(total, interval?)` - Create progress reporter

---

## Examples

See the complete demo:

```bash
npm run demo:performance
```

Or view the source:

- `examples/performance-demo.ts` - Performance optimization demo
- `tests/performance/benchmark.test.ts` - Performance benchmarks

---

## Performance Benchmarks

Based on typical usage patterns:

| Scenario | Without Cache | With Cache | Improvement |
|:---------|:--------------|:-----------|:------------|
| **Repeated URL (10x)** | 20,000ms | 2,090ms | **90%** |
| **Batch of 10 URLs** | 20,000ms | 5,000ms | **75%** |
| **Deduplicated requests** | 6,000ms | 2,000ms | **67%** |
| **Mixed workflow** | 30,000ms | 15,000ms | **50%** |

---

## Troubleshooting

### Cache Not Working

1. Check if `useCache` is set to `false`
2. Verify cache isn't being cleared between calls
3. Check TTL hasn't expired
4. Review cache statistics with `cache.getStats()`

### Poor Performance

1. Increase batch concurrency
2. Check cache hit rate
3. Review metrics for slow operations
4. Verify deduplication is working

### Memory Issues

1. Reduce `maxSize` in cache configuration
2. Shorten TTL to expire entries faster
3. Clear cache periodically with `cache.clear()`
4. Monitor memory usage in metrics

---

## Best Practices

1. **Always use caching** unless you need fresh data
2. **Batch operations** when processing multiple items
3. **Monitor metrics** to identify optimization opportunities
4. **Adjust TTL** based on data volatility
5. **Use deduplication** for repeated requests
6. **Set reasonable cache sizes** to limit memory usage
7. **Log progress** for long-running batches
8. **Handle errors** gracefully in batch operations

---

For more information, see:

- [Summary Document](../.smite/US-013-PERFORMANCE-OPTIMIZATION-SUMMARY.md)
- [Architecture](../.smite/browser-automation-architecture.md)
- [API Documentation](./API.md)
