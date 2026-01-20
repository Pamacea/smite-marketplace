/**
 * Search Feature Demo
 *
 * Demonstrates how to use the search feature module for various use cases.
 *
 * Run with:
 *   ts-node examples/search-feature-demo.ts
 */

import {
  SearchFeature,
  searchWeb,
  searchAndRead,
  searchMultiple,
  research,
} from '../src/features/search.feature.js';
import { isSuccess } from '../src/mcp/index.js';

// ============================================================================
// Demo Functions
// ============================================================================

/**
 * Demo 1: Basic web search
 */
async function demoBasicSearch() {
  console.log('\n=== Demo 1: Basic Web Search ===\n');

  const result = await searchWeb('Browser automation tools');

  if (isSuccess(result)) {
    console.log(`Found ${result.data.length} results:\n`);
    result.data.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ${item.url}`);
      console.log(`   ${item.domain} - ${item.summary.substring(0, 100)}...\n`);
    });
  } else {
    console.error('Search failed:', result.error.message);
  }
}

/**
 * Demo 2: Search with filters
 */
async function demoSearchWithFilters() {
  console.log('\n=== Demo 2: Search with Filters ===\n');

  const searchFeature = new SearchFeature();

  // Recent results from specific location
  const result = await searchFeature.searchWeb('AI news', {
    timeRange: 'oneWeek',
    location: 'us',
    maxResults: 5,
  });

  if (isSuccess(result)) {
    console.log(`Found ${result.data.length} recent results:\n`);
    result.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ${item.url}`);
      console.log(`   Published: ${item.timestamp}\n`);
    });
  } else {
    console.error('Search failed:', result.error.message);
  }
}

/**
 * Demo 3: Search specific domains
 */
async function demoDomainSearch() {
  console.log('\n=== Demo 3: Domain-Specific Search ===\n');

  const searchFeature = new SearchFeature();

  const result = await searchFeature.searchDomains(
    'TypeScript documentation',
    ['github.com', 'typescriptlang.org', 'devblogs.microsoft.com']
  );

  if (isSuccess(result)) {
    console.log(`Found ${result.data.length} results from TypeScript sources:\n`);
    result.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   ${item.url}`);
      console.log(`   ${item.domain}\n`);
    });
  } else {
    console.error('Search failed:', result.error.message);
  }
}

/**
 * Demo 4: Search and read top results
 */
async function demoSearchAndRead() {
  console.log('\n=== Demo 4: Search and Read ===\n');

  const result = await searchAndRead('MCP browser automation', {
    readCount: 3,
    readOptions: {
      returnFormat: 'markdown',
      retainImages: false,
    },
  });

  if (isSuccess(result)) {
    console.log(`Query: ${result.data.query}`);
    console.log(`Total results: ${result.data.totalResults}`);
    console.log(`Successfully read: ${result.data.successfulReads} pages\n`);

    // Show first result preview
    const [firstUrl, firstContent] = result.data.content.entries().next().value;
    console.log(`First source: ${firstUrl}`);
    console.log(`Content preview (${firstContent.length} chars):\n`);
    console.log(firstContent.substring(0, 500) + '...\n');
  } else {
    console.error('Search and read failed:', result.error.message);
  }
}

/**
 * Demo 5: Multi-query search
 */
async function demoMultiSearch() {
  console.log('\n=== Demo 5: Multi-Query Search ===\n');

  const result = await searchMultiple(
    ['React hooks', 'Vue composition API', 'Angular signals'],
    {
      parallel: true,
      commonOptions: {
        timeRange: 'oneMonth',
      },
    }
  );

  if (isSuccess(result)) {
    console.log(`Searched ${result.data.queries.length} queries`);
    console.log(`Total results: ${result.data.totalResults}\n`);

    for (const [query, results] of result.data.results.entries()) {
      console.log(`${query}: ${results.length} results`);
    }
  } else {
    console.error('Multi-search failed:', result.error.message);
  }
}

/**
 * Demo 6: Research workflow
 */
async function demoResearch() {
  console.log('\n=== Demo 6: Research Workflow ===\n');

  const result = await research('Browser automation in 2025', 3);

  if (isSuccess(result)) {
    console.log(result.data);
  } else {
    console.error('Research failed:', result.error.message);
  }
}

/**
 * Demo 7: Convenience methods
 */
async function demoConvenienceMethods() {
  console.log('\n=== Demo 7: Convenience Methods ===\n');

  const searchFeature = new SearchFeature();

  // Search recent
  const recentResult = await searchFeature.searchRecent('JavaScript news', 'oneDay');
  if (isSuccess(recentResult)) {
    console.log(`Recent news: ${recentResult.data.length} results from last 24 hours\n`);
  }

  // Search domains
  const domainResult = await searchFeature.searchDomains(
    'TypeScript patterns',
    'github.com'
  );
  if (isSuccess(domainResult)) {
    console.log(`GitHub TypeScript results: ${domainResult.data.length}\n`);
  }
}

/**
 * Demo 8: Advanced filtering
 */
async function demoAdvancedFiltering() {
  console.log('\n=== Demo 8: Advanced Filtering ===\n');

  const searchFeature = new SearchFeature();

  const result = await searchFeature.searchWeb('programming tutorials', {
    timeRange: 'oneMonth',
    location: 'us',
    contentSize: 'high',
    maxResults: 10,
    enrich: true,
  });

  if (isSuccess(result)) {
    console.log(`Found ${result.data.length} detailed results:\n`);

    // Group by domain
    const byDomain = new Map<string, typeof result.data>();
    result.data.forEach(item => {
      if (!byDomain.has(item.domain)) {
        byDomain.set(item.domain, []);
      }
      byDomain.get(item.domain)!.push(item);
    });

    console.log('Results by domain:');
    for (const [domain, items] of byDomain.entries()) {
      console.log(`  ${domain}: ${items.length} results`);
    }
  } else {
    console.error('Search failed:', result.error.message);
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║        Browser Automation - Search Feature Demo                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  try {
    await demoBasicSearch();
    await demoSearchWithFilters();
    await demoDomainSearch();
    await demoSearchAndRead();
    await demoMultiSearch();
    // await demoResearch(); // Commented out to save API calls
    await demoConvenienceMethods();
    await demoAdvancedFiltering();

    console.log('\n✅ All demos completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run demos
if (require.main === module) {
  main().catch(console.error);
}

export {
  demoBasicSearch,
  demoSearchWithFilters,
  demoDomainSearch,
  demoSearchAndRead,
  demoMultiSearch,
  demoResearch,
  demoConvenienceMethods,
  demoAdvancedFiltering,
};
