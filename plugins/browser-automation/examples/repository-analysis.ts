/**
 * Repository Feature Module - Usage Examples
 *
 * This file demonstrates how to use the RepositoryFeature module
 * for GitHub repository analysis without cloning.
 *
 * @examples
 */

import {
  RepositoryFeature,
  createRepositoryFeature,
  RepositoryValidationError,
} from '../src/features/repository.feature.js';

// ============================================================================
// Example 1: Basic Repository Operations
// ============================================================================

/**
 * Read a single file from a repository
 */
async function example1_ReadFile() {
  console.log('\n=== Example 1: Read Repository File ===\n');

  const feature = createRepositoryFeature();

  const result = await feature.readRepoFile(
    'vitejs',
    'vite',
    '/README.md'
  );

  if (result.success) {
    console.log('File content (first 200 chars):');
    console.log(result.data.substring(0, 200) + '...');
  } else {
    console.error('Error:', result.error.message);
  }
}

/**
 * Get repository structure
 */
async function example2_GetStructure() {
  console.log('\n=== Example 2: Get Repository Structure ===\n');

  const feature = createRepositoryFeature();

  const result = await feature.getRepoStructure(
    'vitejs',
    'vite',
    '/src'
  );

  if (result.success) {
    console.log('Repository structure:');
    console.log(result.data);
  } else {
    console.error('Error:', result.error.message);
  }
}

/**
 * Search repository documentation
 */
async function example3_SearchDocs() {
  console.log('\n=== Example 3: Search Repository Docs ===\n');

  const feature = createRepositoryFeature();

  const result = await feature.searchRepoDocs(
    'vitejs',
    'vite',
    'How to configure plugins',
    'en'
  );

  if (result.success) {
    console.log('Search results:');
    console.log(result.data);
  } else {
    console.error('Error:', result.error.message);
  }
}

// ============================================================================
// Example 2: Comprehensive Repository Analysis
// ============================================================================

/**
 * Analyze a repository comprehensively
 */
async function example4_AnalyzeRepo() {
  console.log('\n=== Example 4: Comprehensive Repository Analysis ===\n');

  const feature = createRepositoryFeature();

  const result = await feature.analyzeRepo('vitejs', 'vite', {
    includeReadme: true,
    includePackageJson: true,
    searchQuery: 'configuration',
  });

  if (result.success) {
    const analysis = result.data;

    console.log('Repository:', analysis.repoName);
    console.log('\n--- Structure ---');
    console.log(analysis.structure.substring(0, 500) + '...');

    if (analysis.readme) {
      console.log('\n--- README Preview ---');
      console.log(analysis.readme.substring(0, 300) + '...');
    }

    if (analysis.packageJson) {
      console.log('\n--- Package Info ---');
      const pkg = analysis.packageJson as any;
      console.log('Name:', pkg.name);
      console.log('Version:', pkg.version);
      console.log('Description:', pkg.description);
    }

    if (analysis.searchResults) {
      console.log('\n--- Search Results ---');
      console.log(analysis.searchResults.substring(0, 300) + '...');
    }
  } else {
    console.error('Error:', result.error.message);
  }
}

// ============================================================================
// Example 3: Batch File Reading
// ============================================================================

/**
 * Read multiple files in batch
 */
async function example5_BatchRead() {
  console.log('\n=== Example 5: Batch File Reading ===\n');

  const feature = createRepositoryFeature();

  const files = [
    '/README.md',
    '/LICENSE',
    '/package.json',
    '/.gitignore',
  ];

  const result = await feature.batchReadFiles(
    'vitejs',
    'vite',
    files,
    true, // continue on error
    3 // max concurrent
  );

  if (result.success) {
    console.log(`Successfully read ${result.data.length} files:\n`);

    result.data.forEach((file) => {
      if (file.success) {
        console.log(`✓ ${file.path} (${file.size} bytes)`);
        console.log(`  Preview: ${file.content.substring(0, 100)}...`);
      } else {
        console.log(`✗ ${file.path} - Error: ${file.error}`);
      }
      console.log();
    });
  } else {
    console.error('Error:', result.error.message);
  }
}

// ============================================================================
// Example 4: Repository Insights
// ============================================================================

/**
 * Get repository insights
 */
async function example6_GetInsights() {
  console.log('\n=== Example 6: Repository Insights ===\n');

  const feature = createRepositoryFeature();

  const result = await feature.getRepositoryInsights('vitejs', 'vite');

  if (result.success) {
    const insights = result.data;

    console.log('Repository:', insights.repoName);
    console.log('Language:', insights.language || 'Unknown');

    if (insights.description) {
      console.log('\nDescription:');
      console.log(insights.description);
    }

    if (insights.mainFiles.length > 0) {
      console.log('\nMain Files:');
      insights.mainFiles.forEach((file) => {
        console.log(`  - ${file.path} (${file.purpose})`);
      });
    }

    if (insights.dependencies && insights.dependencies.length > 0) {
      console.log('\nKey Dependencies:');
      insights.dependencies.slice(0, 10).forEach((dep) => {
        console.log(`  - ${dep}`);
      });
    }

    if (insights.keyTopics.length > 0) {
      console.log('\nKey Topics:');
      insights.keyTopics.forEach((topic) => {
        console.log(`  - ${topic}`);
      });
    }
  } else {
    console.error('Error:', result.error.message);
  }
}

// ============================================================================
// Example 5: Validation and Error Handling
// ============================================================================

/**
 * Demonstrate validation and error handling
 */
async function example7_ValidationErrors() {
  console.log('\n=== Example 7: Validation and Error Handling ===\n');

  const feature = createRepositoryFeature();

  // Invalid repo name format
  console.log('Testing invalid repo name...');
  try {
    feature.parseRepoName('invalid-repo-name');
  } catch (error) {
    if (error instanceof RepositoryValidationError) {
      console.log('Validation Error:');
      console.log(`  Field: ${error.field}`);
      console.log(`  Value: ${error.value}`);
      console.log(`  Message: ${error.message}`);
    }
  }

  // Empty file path
  console.log('\nTesting empty file path...');
  const result = await feature.readRepoFile('vitejs', 'vite', '');
  if (!result.success) {
    console.log('Error:', result.error.message);
  }
}

// ============================================================================
// Example 6: Agent Workflow - Repository Research
// ============================================================================

/**
 * Complete workflow for researching a repository
 * This demonstrates how an AI agent would use the feature
 */
async function example8_RepositoryResearch() {
  console.log('\n=== Example 8: Repository Research Workflow ===\n');

  const feature = createRepositoryFeature();
  const owner = 'facebook';
  const repo = 'react';

  console.log(`Researching repository: ${owner}/${repo}\n`);

  // Step 1: Get repository overview
  console.log('Step 1: Getting repository insights...');
  const insightsResult = await feature.getRepositoryInsights(owner, repo);

  if (insightsResult.success) {
    const insights = insightsResult.data;
    console.log(`✓ Language: ${insights.language}`);
    console.log(`✓ Description: ${insights.description?.substring(0, 100)}...`);
  }

  // Step 2: Explore structure
  console.log('\nStep 2: Exploring repository structure...');
  const structureResult = await feature.getRepoStructure(owner, repo);

  if (structureResult.success) {
    console.log('✓ Structure retrieved');
    console.log(structureResult.data.substring(0, 300) + '...');
  }

  // Step 3: Read key files
  console.log('\nStep 3: Reading key files...');
  const keyFiles = ['/README.md', '/package.json', '/LICENSE'];
  const filesResult = await feature.batchReadFiles(owner, repo, keyFiles);

  if (filesResult.success) {
    const successful = filesResult.data.filter((f) => f.success);
    console.log(`✓ Read ${successful.length}/${keyFiles.length} files`);
  }

  // Step 4: Search for specific topic
  console.log('\nStep 4: Searching documentation...');
  const searchResult = await feature.searchRepoDocs(
    owner,
    repo,
    'getting started with hooks',
    'en'
  );

  if (searchResult.success) {
    console.log('✓ Search completed');
    console.log(searchResult.data.substring(0, 200) + '...');
  }

  console.log('\n✓ Repository research complete!');
}

// ============================================================================
// Example 7: Compare Multiple Repositories
// ============================================================================

/**
 * Compare insights from multiple repositories
 */
async function example9_CompareRepos() {
  console.log('\n=== Example 9: Compare Multiple Repositories ===\n');

  const feature = createRepositoryFeature();

  const repos = [
    { owner: 'vitejs', repo: 'vite' },
    { owner: 'facebook', repo: 'react' },
    { owner: 'vercel', repo: 'next.js' },
  ];

  console.log('Comparing repositories...\n');

  for (const { owner, repo } of repos) {
    const result = await feature.getRepositoryInsights(owner, repo);

    if (result.success) {
      const insights = result.data;
      console.log(`${owner}/${repo}:`);
      console.log(`  Language: ${insights.language || 'Unknown'}`);
      console.log(`  Dependencies: ${insights.dependencies?.length || 0}`);
      console.log(`  Topics: ${insights.keyTopics.slice(0, 3).join(', ')}`);
      console.log();
    }
  }
}

// ============================================================================
// Main: Run All Examples
// ============================================================================

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Repository Feature Module - Usage Examples              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // Basic operations
    await example1_ReadFile();
    await example2_GetStructure();
    await example3_SearchDocs();

    // Comprehensive analysis
    await example4_AnalyzeRepo();

    // Batch operations
    await example5_BatchRead();

    // Insights
    await example6_GetInsights();

    // Validation
    await example7_ValidationErrors();

    // Workflows
    await example8_RepositoryResearch();

    // Comparison
    await example9_CompareRepos();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║   All examples completed!                                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Example failed:', error);
  }
}

// Run examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}

export {
  example1_ReadFile,
  example2_GetStructure,
  example3_SearchDocs,
  example4_AnalyzeRepo,
  example5_BatchRead,
  example6_GetInsights,
  example7_ValidationErrors,
  example8_RepositoryResearch,
  example9_CompareRepos,
};
