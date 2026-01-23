/**
 * Unified Search Router
 *
 * Main router that intelligently routes search queries to the appropriate
 * search strategy based on query analysis and available data.
 *
 * @module core/unified/router
 */
import { UnifiedSearchOptions, UnifiedSearchResult, RouterConfig } from './types.js';
/**
 * Unified Search Router
 */
export declare class SearchRouter {
    private analyzer;
    private strategyFactory;
    private config;
    private cache;
    constructor(config?: Partial<RouterConfig>);
    /**
     * Perform a unified search
     */
    search(query: string, options?: UnifiedSearchOptions): Promise<UnifiedSearchResult>;
    /**
     * Execute search with strategy and fallbacks
     */
    private executeSearch;
    /**
     * Generate cache key from query and options
     */
    private getCacheKey;
    /**
     * Clear the search cache
     */
    clearCache(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        size: number;
        maxSize: number;
    };
    /**
     * Get router configuration
     */
    getConfig(): RouterConfig;
    /**
     * Update router configuration
     */
    updateConfig(updates: Partial<RouterConfig>): void;
    /**
     * Get the max cache size
     */
    get maxCacheSize(): number;
}
//# sourceMappingURL=router.d.ts.map