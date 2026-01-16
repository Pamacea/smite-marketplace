/**
 * API Module
 *
 * Main user-facing APIs for the SMITE Toolkit.
 *
 * @module api
 */

// Search API exports
export {
  CodeSearchAPI,
  createCodeSearch,
  OutputFormat,
  type CodeSearchOptions,
  type CodeSearchResult,
  type CodeSearchResponse,
  type SearchFilters,
} from './search.js';

// Semantic Analysis API exports
export {
  SemanticAnalysisAPI,
  createSemanticAnalysis,
  type SemanticAnalysisOptions,
  type SimilarityResult,
  type ClusterResult,
  type PatternResult,
} from './semantic.js';

// Bug Detection API exports
export {
  BugDetectionAPI,
  createBugDetection,
  BugSeverity,
  BugCategory,
  type BugResult,
  type BugDetectionOptions,
} from './bugs.js';

// Refactoring API exports
export {
  RefactoringAPI,
  createRefactoring,
  RefactorType,
  type RefactorResult,
  type RefactorOptions,
} from './refactor.js';

// Documentation Generation API exports
export {
  DocumentationAPI,
  createDocumentation,
  DocFormat,
  type DocumentationResult,
  type DocumentationOptions,
} from './docs.js';
