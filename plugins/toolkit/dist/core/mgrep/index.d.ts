/**
 * mgrep (Semantic Search) Module
 *
 * Provides semantic code search capabilities using mgrep CLI:
 * - CLI client wrapper
 * - High-level search API
 * - Optional MCP server integration
 *
 * @module core/mgrep
 */
export { MgrepClient, MgrepCommand, type MgrepSearchOptions, type MgrepSearchResult, type MgrepResult, type MgrepClientConfig, DEFAULT_MGREP_CLIENT_CONFIG, } from './client.js';
export { SemanticSearch, createSearch, type SearchResult, type SearchConfig, type SearchStats, type SearchResponse, DEFAULT_SEARCH_CONFIG, } from './search.js';
export { mapMgrepResultToSearchResult, mapMgrepResults, } from './mappers.js';
export { McpIntegration, createMcp, initMcp, McpConnectionStatus, type McpQueryOptions, type McpQueryResult, type McpClientConfig, DEFAULT_MCP_CONFIG, } from './mcp.js';
/**
 * Quick access factory for creating mgrep client
 */
export declare function createClient(config?: Partial<import('./client.js').MgrepClientConfig>): any;
/**
 * Quick access factory for creating semantic search
 */
export declare function createSemanticSearch(config?: Partial<import('./search.js').SearchConfig>): any;
/**
 * Quick access factory for creating MCP integration
 */
export declare function createMcpIntegration(config?: Partial<import('./mcp.js').McpClientConfig>): any;
//# sourceMappingURL=index.d.ts.map