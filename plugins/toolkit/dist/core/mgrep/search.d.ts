/**
 * Semantic Search API - High-level search interface
 *
 * Provides semantic search capabilities with:
 * - Query-based search
 * - Result ranking and filtering
 * - Fallback to RAG-only mode
 * - Configurable thresholds and limits
 */
import { MgrepClient, MgrepSearchResult, type MgrepClientConfig } from './client.js';
/**
 * Search result with extended metadata
 */
export interface SearchResult extends MgrepSearchResult {
    /** Result rank position */
    rank: number;
    /** Result quality indicator */
    quality: 'high' | 'medium' | 'low';
}
/**
 * Search configuration
 */
export interface SearchConfig {
    /** Maximum number of results to return */
    maxResults?: number;
    /** Minimum relevance threshold (0-1) */
    minThreshold?: number;
    /** Enable reranking */
    rerank?: boolean;
    /** Include content snippets */
    includeContent?: boolean;
    /** Recursive search */
    recursive?: boolean;
    /** Fallback to RAG if mgrep unavailable */
    fallbackToRag?: boolean;
}
/**
 * Search statistics
 */
export interface SearchStats {
    /** Total results found */
    totalResults: number;
    /** Results after filtering */
    filteredResults: number;
    /** Average relevance score */
    avgScore: number;
    /** Search duration in milliseconds */
    duration: number;
    /** Whether fallback was used */
    usedFallback: boolean;
}
/**
 * Search response
 */
export interface SearchResponse {
    /** Search results */
    results: SearchResult[];
    /** Search statistics */
    stats: SearchStats;
    /** Error if search failed */
    error?: string;
}
/**
 * Default search configuration
 */
export declare const DEFAULT_SEARCH_CONFIG: SearchConfig;
/**
 * Semantic Search class
 */
export declare class SemanticSearch {
    private client;
    private config;
    constructor(config?: Partial<SearchConfig>, clientConfig?: Partial<MgrepClientConfig>);
    /**
     * Determine result quality based on score
     */
    private getQuality;
    /**
     * Filter and rank results
     */
    private filterAndRankResults;
    /**
     * Calculate search statistics
     */
    private calculateStats;
    /**
     * Execute semantic search
     */
    search(query: string, path?: string, options?: Partial<SearchConfig>): Promise<SearchResponse>;
    /**
     * Quick search with default options
     */
    quickSearch(query: string, path?: string): Promise<SearchResponse>;
    /**
     * High-precision search (stricter thresholds)
     */
    highPrecisionSearch(query: string, path?: string): Promise<SearchResponse>;
    /**
     * High-recall search (more results, lower threshold)
     */
    highRecallSearch(query: string, path?: string): Promise<SearchResponse>;
    /**
     * Get search client
     */
    getClient(): MgrepClient;
    /**
     * Check if semantic search is available
     */
    isAvailable(): Promise<boolean>;
}
/**
 * Create a semantic search instance with default config
 */
export declare function createSearch(config?: Partial<SearchConfig>): SemanticSearch;
//# sourceMappingURL=search.d.ts.map