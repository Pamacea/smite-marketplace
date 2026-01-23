/**
 * API Module
 *
 * Main user-facing APIs for the SMITE Toolkit.
 *
 * @module api
 */
export { CodeSearchAPI, createCodeSearch, OutputFormat, type CodeSearchOptions, type CodeSearchResult, type CodeSearchResponse, type SearchFilters, } from './search.js';
export { SemanticAnalysisAPI, createSemanticAnalysis, type SemanticAnalysisOptions, type SimilarityResult, type ClusterResult, type PatternResult, } from './semantic.js';
export { BugDetectionAPI, createBugDetection, BugSeverity, BugCategory, type BugResult, type BugDetectionOptions, } from './bugs.js';
export { RefactoringAPI, createRefactoring, RefactorType, type RefactorResult, type RefactorOptions, } from './refactor.js';
export { DocumentationAPI, createDocumentation, DocFormat, type DocumentationResult, type DocumentationOptions, } from './docs.js';
//# sourceMappingURL=index.d.ts.map