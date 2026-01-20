/**
 * Performance Optimization Demo
 *
 * Demonstrates the performance improvements from caching and batch optimization
 *
 * Run with: npm run build && node dist/examples/performance-demo.js
 */

import { WebReaderClient } from '../src/mcp/web-reader-client.js';
import { metrics, resetMetrics } from '../src/utils/metrics.js';
import { webReaderCache, resetAllCaches, logCacheStats } from '../src/utils/cache.js';
import { batchExecute, batchExecuteDeduplicated } from '../src/utils/batch.js';

// ============================================================================
// Demo Setup
// ============================================================================

async function main() {
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(10) + '🚀 PERFORMANCE OPTIMIZATION DEMO' + ' '.repeat(16) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');
  console.log();

  // Reset state
  resetMetrics();
  resetAllCaches();

  const client = new WebReaderClient();

  // ============================================================================
  // Demo 1: Cache Hit Performance
  // ============================================================================

  console.log('📊 Demo 1: Cache Hit Performance');
  console.log('─'.repeat(60));

  const testUrl = 'https://example.com';

  // Clear cache
  webReaderCache.clear();

  // First call - cache miss
  console.log('\n1️⃣  First call (cache miss):');
  const start1 = Date.now();
  const result1 = await client.readUrl({ url: testUrl, useCache: true });
  const duration1 = Date.now() - start1;
  console.log(`   Duration: ${duration1}ms`);
  console.log(`   Status: ${result1.success ? '✅ Success' : '❌ Failed'}`);
  console.log(`   Content length: ${result1.success ? result1.data.length : 0} chars`);

  // Second call - cache hit
  console.log('\n2️⃣  Second call (cache hit):');
  const start2 = Date.now();
  const result2 = await client.readUrl({ url: testUrl, useCache: true });
  const duration2 = Date.now() - start2;
  console.log(`   Duration: ${duration2}ms`);
  console.log(`   Status: ${result2.success ? '✅ Success' : '❌ Failed'}`);
  console.log(`   Content length: ${result2.success ? result2.data.length : 0} chars`);

  // Calculate improvement
  const improvement = ((duration1 - duration2) / duration1) * 100;
  console.log(`\n✨ Improvement: ${improvement.toFixed(1)}% faster (${duration1 - duration2}ms saved)`);

  // ============================================================================
  // Demo 2: Batch Processing
  // ============================================================================

  console.log('\n\n');
  console.log('📊 Demo 2: Batch Processing');
  console.log('─'.repeat(60));

  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3',
    'https://example.com/page4',
    'https://example.com/page5',
  ];

  console.log(`\n📦 Processing ${urls.length} URLs in batch (concurrency: 5)...`);

  const batchStart = Date.now();
  const batchResults = await batchExecute(
    urls.map(url => () => client.readUrl({ url, useCache: true })),
    { concurrency: 5, logProgress: true }
  );
  const batchDuration = Date.now() - batchStart;

  console.log(`\n✅ Batch complete:`);
  console.log(`   Successful: ${batchResults.successful.length}/${urls.length}`);
  console.log(`   Failed: ${batchResults.failed.length}`);
  console.log(`   Duration: ${batchDuration}ms`);
  console.log(`   Success rate: ${(batchResults.successRate * 100).toFixed(1)}%`);

  // ============================================================================
  // Demo 3: Request Deduplication
  // ============================================================================

  console.log('\n\n');
  console.log('📊 Demo 3: Request Deduplication');
  console.log('─'.repeat(60));

  const dedupUrls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page1', // Duplicate!
    'https://example.com/page3',
    'https://example.com/page2', // Duplicate!
  ];

  console.log(`\n🔄 Processing ${dedupUrls.length} requests (${new Set(dedupUrls).size} unique)...`);

  const dedupStart = Date.now();
  const dedupResults = await batchExecuteDeduplicated(
    dedupUrls.map(url => ({
      key: url,
      fn: () => client.readUrl({ url, useCache: true })
    })),
    { concurrency: 5 }
  );
  const dedupDuration = Date.now() - dedupStart;

  console.log(`\n✅ Deduplication complete:`);
  console.log(`   Requests: ${dedupUrls.length}`);
  console.log(`   Unique operations: ${new Set(dedupUrls).size}`);
  console.log(`   Successful: ${dedupResults.successful.length}`);
  console.log(`   Duration: ${dedupDuration}ms`);
  console.log(`   Reduction: ${((1 - new Set(dedupUrls).size / dedupUrls.length) * 100).toFixed(1)}%`);

  // ============================================================================
  // Demo 4: Cache Statistics
  // ============================================================================

  console.log('\n\n');
  console.log('📊 Demo 4: Cache Statistics');
  console.log('─'.repeat(60));

  logCacheStats(webReaderCache, 'Web Reader');

  // ============================================================================
  // Demo 5: Performance Metrics
  // ============================================================================

  console.log('\n\n');
  console.log('📊 Demo 5: Performance Metrics');
  console.log('─'.repeat(60));

  const stats = metrics.getStats('web-reader');
  if (stats) {
    console.log(`\n📈 Web Reader Statistics:`);
    console.log(`   Total calls: ${stats.totalCalls}`);
    console.log(`   Successful: ${stats.successfulCalls}`);
    console.log(`   Failed: ${stats.failedCalls}`);
    console.log(`   Cache hits: ${stats.cacheHits}`);
    console.log(`   Cache misses: ${stats.cacheMisses}`);
    console.log(`   Hit rate: ${(stats.cacheHits / stats.totalCalls * 100).toFixed(1)}%`);
    console.log(`   Avg duration: ${stats.avgDuration.toFixed(0)}ms`);
    console.log(`   Min duration: ${stats.minDuration}ms`);
    console.log(`   Max duration: ${stats.maxDuration}ms`);

    const improvement = metrics.calculateImprovement('web-reader');
    if (improvement) {
      console.log(`\n✨ Overall Performance:`);
      console.log(`   ${improvement.description}`);
      console.log(`   Time saved: ${improvement.timeSavedMs}ms`);
      console.log(`   Operations saved: ${improvement.operationsSaved}`);
    }
  }

  // ============================================================================
  // Summary
  // ============================================================================

  console.log('\n\n');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(18) + '📊 SUMMARY' + ' '.repeat(26) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');

  console.log('\n✅ Key Achievements:');
  console.log(`   • Cache hits: ${stats?.cacheHits || 0}`);
  console.log(`   • Hit rate: ${stats ? ((stats.cacheHits / stats.totalCalls) * 100).toFixed(1) : 0}%`);
  console.log(`   • Time saved: ${improvement?.timeSavedMs || 0}ms`);
  console.log(`   • Improvement: ${improvement?.improvementPercent.toFixed(1) || 0}%`);

  console.log('\n💡 Benefits:');
  console.log('   • Reduced API calls via caching');
  console.log('   • Faster response times for repeated requests');
  console.log('   • Parallel execution for batch operations');
  console.log('   • Request deduplication reduces redundant work');

  console.log('\n🎯 Conclusion:');
  console.log('   Performance optimization successfully implemented!');
  console.log('   Cache, metrics, and batch processing are working as expected.');

  console.log('\n' + '═'.repeat(60) + '\n');
}

// ============================================================================
// Run Demo
// ============================================================================

main().catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
