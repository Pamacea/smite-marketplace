/**
 * Core Module
 *
 * Core functionality and utilities for the SMITE Toolkit.
 *
 * @module core
 */

// Constants
export * from './constants.js';

// RAG module exports
export * from './rag/index.js';

// Utils exports
export * from './utils/index.js';

// mgrep client exports
export {
  MgrepClient,
  MgrepCommand,
  createClient,
  createSemanticSearch,
  createMcpIntegration,
  type MgrepSearchOptions,
  type MgrepSearchResult,
  type MgrepResult,
  type MgrepClientConfig,
  type McpQueryOptions,
  type McpQueryResult,
  type McpClientConfig,
  DEFAULT_MGREP_CLIENT_CONFIG,
  DEFAULT_SEARCH_CONFIG,
  DEFAULT_MCP_CONFIG,
} from './mgrep/index.js';

// Unified search exports (renamed to avoid conflicts)
export {
  QueryAnalyzer,
  SearchRouter,
  SemanticSearchStrategy,
  LiteralSearchStrategy,
  HybridSearchStrategy,
  StrategyFactory,
  createSearchRouter,
  SearchStrategy as UnifiedSearchStrategy,
  QueryType,
  type UnifiedSearchOptions,
  type UnifiedSearchResult,
  type QueryAnalysis,
  type StrategyResult,
  type RouterConfig,
  DEFAULT_ROUTER_CONFIG,
} from './unified/index.js';
