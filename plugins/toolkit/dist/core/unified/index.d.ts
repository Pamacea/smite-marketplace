/**
 * Unified Search Module
 *
 * Provides intelligent search routing that automatically selects the best
 * search strategy based on query type and context.
 *
 * @module core/unified
 */
export { SearchStrategy, QueryType, UnifiedSearchOptions, UnifiedSearchResult, QueryAnalysis, StrategyResult, SearchResult, RouterConfig, DEFAULT_ROUTER_CONFIG, } from './types.js';
export { QueryAnalyzer, } from './analyzer.js';
export { SemanticSearchStrategy, LiteralSearchStrategy, HybridSearchStrategy, StrategyFactory, type ISearchStrategy, } from './strategies.js';
export { SearchRouter, } from './router.js';
/**
 * Quick access factory for creating search router
 */
export declare function createSearchRouter(config?: Partial<import('./types.js').RouterConfig>): any;
//# sourceMappingURL=index.d.ts.map