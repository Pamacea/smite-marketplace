/**
 * Agent-Friendly Usage Examples
 *
 * This file demonstrates how AI agents can effectively use the @smite/browser-automation
 * API for common tasks like research, debugging, library analysis, and code auditing.
 *
 * Run examples:
 * ```bash
 * npm run build
 * ts-node examples/agent-usage.ts
 * ```
 */

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
  isFailure,
  unwrap,
  unwrapOr,
  map,
  andThen,
  retry,
  all,
  allSettled,
} from '@smite/browser-automation';

import { z } from 'zod';

// ============================================================================
// EXAMPLE 1: Web Research
// ============================================================================

/**
 * Example: Research a new technology
 *
 * Use case: An agent needs to understand "React Server Components"
 * before implementing them in a project.
 */
async function example1_researchTechnology() {
  console.log('\n=== Example 1: Researching React Server Components ===\n');

  // Method 1: Simple web search
  const searchResults = await searchWeb('React Server Components documentation');

  if (isSuccess(searchResults)) {
    console.log(`Found ${searchResults.data.length} results`);

    // Extract URLs from top 3 results
    const topUrls = searchResults.data.slice(0, 3).map(r => r.url);
    console.log('Top URLs:', topUrls);
  }

  // Method 2: Search and read in one go
  const research = await searchAndRead('React Server Components best practices', {
    maxResults: 5,
    readLimit: 3
  });

  if (isSuccess(research)) {
    console.log(`\nResearch Summary:`);
    console.log(`- Search results: ${research.searchResults.length}`);
    console.log(`- Pages read: ${research.readResults.length}`);

    // Process read results
    research.readResults.forEach(result => {
      if (result.success && result.data) {
        console.log(`\nRead ${result.data.content?.length} chars from ${result.url}`);
      }
    });
  }

  // Method 3: Deep research workflow
  const deepResearch = await researchTopic('React Server Components', {
    depth: 2,
    includeCodeExamples: true,
    sources: ['web', 'github']
  });

  if (isSuccess(deepResearch)) {
    console.log(`\nDeep Research Results:`);
    console.log(`- Sources analyzed: ${deepResearch.data.sourcesAnalyzed}`);
    console.log(`- Key insights: ${deepResearch.data.keyInsights.length}`);
    console.log(`- Code examples: ${deepResearch.data.codeExamples?.length || 0}`);
  }
}

// ============================================================================
// EXAMPLE 2: Error Debugging
// ============================================================================

/**
 * Example: Debug an error from a screenshot
 *
 * Use case: User provides an error screenshot, agent diagnoses
 * the issue and searches for solutions.
 */
async function example2_debugError() {
  console.log('\n=== Example 2: Debugging Error ===\n');

  // Assume we have an error screenshot
  const errorImagePath = 'error-screenshot.png';

  // Method 1: Extract error details
  const errorText = await extractText(
    errorImagePath,
    'Extract the error message and stack trace'
  );

  if (isSuccess(errorText)) {
    console.log('Extracted error:\n', errorText.data);
  }

  // Method 2: Full debugging workflow
  const diagnosis = await debugError(
    errorImagePath,
    'During npm install after upgrading dependencies',
    {
      searchForSolutions: true,
      includeStacktrace: true,
      maxSearchResults: 5
    }
  );

  if (isSuccess(diagnosis)) {
    console.log('\nDebug Results:');
    console.log(`- Root cause: ${diagnosis.data.rootCause}`);
    console.log(`- Solutions found: ${diagnosis.data.solutions.length}`);
    console.log(`- Related issues: ${diagnosis.data.relatedIssues?.length || 0}`);

    // Display solutions
    diagnosis.data.solutions.slice(0, 3).forEach((solution, idx) => {
      console.log(`\nSolution ${idx + 1}: ${solution.summary}`);
      console.log(`  Source: ${solution.source}`);
    });
  }
}

// ============================================================================
// EXAMPLE 3: Library Analysis
// ============================================================================

/**
 * Example: Analyze a library before using it
 *
 * Use case: Agent needs to recommend a state management solution
 * for a React project.
 */
async function example3_analyzeLibrary() {
  console.log('\n=== Example 3: Analyzing Zustand Library ===\n');

  // Analyze zustand for React state management
  const analysis = await analyzeLibrary('zustand', 'state management in React', {
    checkLatestVersion: true,
    analyzeExamples: true,
    checkAlternatives: true,
    readDocumentation: true
  });

  if (isSuccess(analysis)) {
    console.log('Library Analysis:');
    console.log(`- Version: ${analysis.data.version}`);
    console.log(`- Description: ${analysis.data.description}`);
    console.log(`- Best use cases: ${analysis.data.bestUseCases.join(', ')}`);
    console.log(`- Key features: ${analysis.data.features.length}`);

    if (analysis.data.codeExamples) {
      console.log(`\nCode Examples: ${analysis.data.codeExamples.length}`);
      analysis.data.codeExamples.slice(0, 2).forEach(example => {
        console.log(`\n${example.title}:`);
        console.log(example.code.slice(0, 200) + '...');
      });
    }

    if (analysis.data.alternatives) {
      console.log(`\nAlternatives: ${analysis.data.alternatives.join(', ')}`);
    }
  }
}

// ============================================================================
// EXAMPLE 4: Repository Auditing
// ============================================================================

/**
 * Example: Audit a codebase before contributing
 *
 * Use case: Agent needs to understand the codebase structure
 * and identify patterns before making changes.
 */
async function example4_auditCodebase() {
  console.log('\n=== Example 4: Auditing Codebase ===\n');

  // Audit a repository
  const audit = await auditCodebase('vitejs/vite', {
    checkPatterns: true,
    analyzeStructure: true,
    detectIssues: true,
    maxFiles: 50
  });

  if (isSuccess(audit)) {
    console.log('Codebase Audit:');
    console.log(`- Pattern score: ${audit.data.patternScore}/100`);
    console.log(`- Issues found: ${audit.data.issues.length}`);
    console.log(`- Patterns detected: ${audit.data.patterns.length}`);

    // Display top patterns
    console.log('\nTop Patterns:');
    audit.data.patterns.slice(0, 5).forEach(pattern => {
      console.log(`- ${pattern.name}: ${pattern.occurrence} occurrences`);
    });

    // Display critical issues
    const criticalIssues = audit.data.issues.filter(i => i.severity === 'high');
    if (criticalIssues.length > 0) {
      console.log(`\nCritical Issues: ${criticalIssues.length}`);
      criticalIssues.forEach(issue => {
        console.log(`- ${issue.description} (${issue.location})`);
      });
    }
  }

  // Alternative: Manual repository exploration
  console.log('\nManual Repository Exploration:\n');

  // 1. Get repository structure
  const structure = await getRepoStructure('vitejs/vite', '/src');
  if (isSuccess(structure)) {
    console.log(`Repository structure of /src:`);
    structure.data.forEach(item => {
      console.log(`  ${item.type === 'directory' ? '📁' : '📄'} ${item.name}`);
    });
  }

  // 2. Read key files
  const readme = await readRepoFile('vitejs/vite', 'README.md');
  if (isSuccess(readme)) {
    console.log(`\nREADME length: ${readme.data.length} chars`);
    console.log('First 200 chars:', readme.data.slice(0, 200) + '...');
  }

  // 3. Search documentation
  const docs = await searchRepoDocs('vitejs/vite', 'plugin API', 'en');
  if (isSuccess(docs)) {
    console.log(`\nDocumentation search results: ${docs.data.length}`);
    docs.data.slice(0, 3).forEach(doc => {
      console.log(`- ${doc.title}: ${doc.url}`);
    });
  }
}

// ============================================================================
// EXAMPLE 5: Parallel Operations
// ============================================================================

/**
 * Example: Execute multiple operations in parallel
 *
 * Use case: Agent needs to gather information from multiple sources
 * efficiently.
 */
async function example5_parallelOperations() {
  console.log('\n=== Example 5: Parallel Operations ===\n');

  // Method 1: Parallel searches
  const parallelSearches = await searchMultiple([
    'React Server Components',
    'Next.js 15 features',
    'TypeScript 5.3 new features'
  ]);

  if (isSuccess(parallelSearches)) {
    console.log('Parallel search results:');
    parallelSearches.queries.forEach(query => {
      console.log(`- ${query.query}: ${query.results.length} results`);
    });
  }

  // Method 2: Using all() utility
  const results = await all([
    () => searchWeb('React hooks'),
    () => searchWeb('Vue composition API'),
    () => searchWeb('Svelte stores')
  ]);

  if (isSuccess(results)) {
    console.log('\nAll searches completed successfully');
    results.data.forEach((searchResults, idx) => {
      console.log(`Search ${idx + 1}: ${searchResults.length} results`);
    });
  }

  // Method 3: Using allSettled() (ignore failures)
  const settledResults = await allSettled([
    () => searchWeb('React'),
    () => searchWeb('Vue'),
    () => searchWeb('Angular')
  ]);

  console.log('\nAllSettled results:');
  const successful = settledResults.filter(isSuccess);
  const failed = settledResults.filter(isFailure);

  console.log(`- Successful: ${successful.length}`);
  console.log(`- Failed: ${failed.length}`);
}

// ============================================================================
// EXAMPLE 6: Result Composition
// ============================================================================

/**
 * Example: Chain operations using functional utilities
 *
 * Use case: Agent needs to perform multi-step operations
 * with proper error handling.
 */
async function example6_resultComposition() {
  console.log('\n=== Example 6: Result Composition ===\n');

  // Chain: Search -> Extract URLs -> Read pages
  const searchResult = await searchWeb('Next.js documentation');

  const readResults = await andThen(searchResult, async (results) => {
    const urls = results.slice(0, 3).map(r => r.url);
    return batchRead(urls);
  });

  if (isSuccess(readResults)) {
    console.log(`Successfully read ${readResults.results.length} pages`);
    readResults.results.forEach(result => {
      console.log(`- ${result.url}: ${result.success ? '✓' : '✗'}`);
    });
  }

  // Map: Transform results
  const searchResults = await searchWeb('TypeScript best practices');
  const urls = map(searchResults, (results) =>
    results.map(r => ({ title: r.title, url: r.url }))
  );

  if (isSuccess(urls)) {
    console.log('\nMapped results (title + URL only):');
    urls.data.slice(0, 3).forEach(item => {
      console.log(`- ${item.title}: ${item.url}`);
    });
  }

  // Retry: Handle transient failures
  const reliableSearch = await retry(
    () => searchWeb('flaky search'),
    3,
    1000
  );

  if (isSuccess(reliableSearch)) {
    console.log('\nRetry succeeded!');
  } else {
    console.log('\nRetry failed after all attempts');
  }
}

// ============================================================================
// EXAMPLE 7: Structured Data Extraction
// ============================================================================

/**
 * Example: Extract structured data from web pages
 *
 * Use case: Agent needs to extract product information,
 * article metadata, or other structured content.
 */
async function example7_structuredExtraction() {
  console.log('\n=== Example 7: Structured Data Extraction ===\n');

  // Define schema for product data
  const productSchema = z.object({
    name: z.string(),
    price: z.string(),
    rating: z.string().optional(),
    description: z.string().optional()
  });

  // Extract products from an e-commerce page
  const products = await extractStructuredData(
    'https://example.com/products',
    z.array(productSchema)
  );

  if (isSuccess(products)) {
    console.log(`Extracted ${products.data.length} products`);
    products.data.slice(0, 3).forEach(product => {
      console.log(`\n- ${product.name}`);
      console.log(`  Price: ${product.price}`);
      console.log(`  Rating: ${product.rating || 'N/A'}`);
    });
  }

  // Define schema for article metadata
  const articleSchema = z.object({
    title: z.string(),
    author: z.string(),
    date: z.string(),
    tags: z.array(z.string())
  });

  const article = await extractStructuredData(
    'https://blog.example.com/article',
    articleSchema
  );

  if (isSuccess(article)) {
    console.log('\nArticle metadata:');
    console.log(`Title: ${article.data.title}`);
    console.log(`Author: ${article.data.author}`);
    console.log(`Date: ${article.data.date}`);
    console.log(`Tags: ${article.data.tags.join(', ')}`);
  }
}

// ============================================================================
// EXAMPLE 8: UI Analysis
// ============================================================================

/**
 * Example: Analyze UI designs and compare implementations
 *
 * Use case: Agent needs to verify that implementation matches
 * design or generate code from design.
 */
async function example8_uiAnalysis() {
  console.log('\n=== Example 8: UI Analysis ===\n');

  // Generate code from design
  const codeGeneration = await analyzeUI(
    'https://example.com/design.png',
    'code',
    'Generate a responsive React component with Tailwind CSS'
  );

  if (isSuccess(codeGeneration)) {
    console.log('Generated component code:');
    console.log(codeGeneration.data.slice(0, 500) + '...');
  }

  // Extract design specifications
  const designSpec = await analyzeUI(
    'https://example.com/design.png',
    'spec',
    'Describe colors, spacing, and components'
  );

  if (isSuccess(designSpec)) {
    console.log('\nDesign specification:');
    console.log(designSpec.data);
  }

  // Compare expected vs actual implementation
  const uiDiff = await compareUI(
    'https://example.com/expected.png',
    'https://example.com/actual.png',
    'Focus on layout, spacing, and colors'
  );

  if (isSuccess(uiDiff)) {
    console.log('\nUI Comparison:');
    console.log(uiDiff.data);
  }
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

/**
 * Run all examples sequentially
 * Note: Some examples may fail if services are unavailable
 */
async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║   Agent-Friendly Browser Automation - Usage Examples          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  try {
    await example1_researchTechnology();
  } catch (error) {
    console.error('Example 1 failed:', error);
  }

  try {
    await example2_debugError();
  } catch (error) {
    console.error('Example 2 failed:', error);
  }

  try {
    await example3_analyzeLibrary();
  } catch (error) {
    console.error('Example 3 failed:', error);
  }

  try {
    await example4_auditCodebase();
  } catch (error) {
    console.error('Example 4 failed:', error);
  }

  try {
    await example5_parallelOperations();
  } catch (error) {
    console.error('Example 5 failed:', error);
  }

  try {
    await example6_resultComposition();
  } catch (error) {
    console.error('Example 6 failed:', error);
  }

  try {
    await example7_structuredExtraction();
  } catch (error) {
    console.error('Example 7 failed:', error);
  }

  try {
    await example8_uiAnalysis();
  } catch (error) {
    console.error('Example 8 failed:', error);
  }

  console.log('\n✓ All examples completed!\n');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  example1_researchTechnology,
  example2_debugError,
  example3_analyzeLibrary,
  example4_auditCodebase,
  example5_parallelOperations,
  example6_resultComposition,
  example7_structuredExtraction,
  example8_uiAnalysis,
};
