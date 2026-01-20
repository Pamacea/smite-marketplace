/**
 * Test script to verify all exports are accessible
 */

import {
  // Search capabilities
  searchWeb,
  searchAndRead,
  searchMultiple,
  research,

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

  // Types
  type Result,
  type WebSearchResult,
  type ResearchTopicResult,

  // Client classes
  McpClients,
  createMpClients,
  WebSearchClient,
  VisionClient,
  RepoClient,

  // Error classes
  McpError,
  McpValidationError,
  RepositoryValidationError,
} from '@smite/browser-automation';

// Test that imports are accessible
console.log('✓ All imports successful');
console.log('✓ Functions:', searchWeb.name);
console.log('✓ Classes:', McpClients.name);
console.log('✓ Error classes:', McpError.name);
console.log('✓ Utilities:', typeof isSuccess === 'function');

// Type checking (compile-time only)
const _testTypeCheck: Result<string, Error> = {
  success: true,
  data: 'test'
};

console.log('✓ Type checking works');
console.log('\n✅ All exports are accessible and properly typed!');
