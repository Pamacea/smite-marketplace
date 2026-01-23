/**
 * Code Search API
 *
 * Main user-facing API for searching codebases using the unified search router.
 * Provides multiple search modes, filters, and output formats.
 *
 * @module api/search
 */
import { SearchStrategy } from '../core/unified/index.js';
/**
 * Output format types
 */
export declare enum OutputFormat {
    /** JSON format for programmatic access */
    JSON = "json",
    /** Table format for terminal display */
    TABLE = "table",
    /** Diff format showing code changes */
    DIFF = "diff",
    /** Summary format with key insights */
    SUMMARY = "summary"
}
/**
 * Search filters
 */
export interface SearchFilters {
    /** File pattern filters (glob patterns) */
    filePatterns?: string[];
    /** Language filters (e.g., 'typescript', 'python') */
    languages?: string[];
    /** Date range filter (ISO 8601 dates) */
    dateRange?: {
        start?: string;
        end?: string;
    };
    /** Minimum file size in bytes */
    minFileSize?: number;
    /** Maximum file size in bytes */
    maxFileSize?: number;
}
/**
 * Code search options
 */
export interface CodeSearchOptions {
    /** Search strategy to use */
    strategy?: SearchStrategy;
    /** Maximum number of results to return */
    maxResults?: number;
    /** Output format */
    outputFormat?: OutputFormat;
    /** Search filters */
    filters?: SearchFilters;
    /** Whether to include context */
    includeContext?: boolean;
    /** Number of context lines */
    contextLines?: number;
    /** Minimum relevance score threshold (0-1) */
    minScore?: number;
    /** Whether to cache results */
    useCache?: boolean;
    /** Timeout in milliseconds */
    timeout?: number;
    /** Whether to show progress */
    verbose?: boolean;
}
/**
 * Code search result with metadata
 */
export interface CodeSearchResult {
    /** File path */
    filePath: string;
    /** Line number */
    lineNumber: number;
    /** Matched content */
    content: string;
    /** Relevance score (0-1) */
    score: number;
    /** Context lines */
    context?: {
        before: string[];
        after: string[];
    };
    /** File metadata */
    metadata?: {
        language?: string;
        size?: number;
        lastModified?: string;
    };
}
/**
 * Code search response
 */
export interface CodeSearchResponse {
    /** Search results */
    results: CodeSearchResult[];
    /** Number of results */
    resultCount: number;
    /** Strategy used */
    strategy: SearchStrategy;
    /** Query analysis */
    queryAnalysis: {
        type: string;
        confidence: number;
        recommendedStrategy: string;
    };
    /** Execution time in milliseconds */
    executionTime: number;
    /** Whether results were from cache */
    fromCache: boolean;
    /** Formatted output (if requested) */
    formatted?: string;
}
/**
 * Code Search API class
 */
export declare class CodeSearchAPI {
    private router;
    private defaultOptions;
    constructor(config?: {
        maxCacheSize?: number;
        cacheTTL?: number;
    });
    /**
     * Search code with unified interface
     */
    search(query: string, options?: CodeSearchOptions): Promise<CodeSearchResponse>;
    /**
     * Apply filters to results
     */
    private applyFilters;
    /**
     * Format output according to specified format
     */
    private formatOutput;
    /**
     * Format results as table
     */
    private formatAsTable;
    /**
     * Format results as diff
     */
    private formatAsDiff;
    /**
     * Format results as summary
     */
    private formatAsSummary;
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
}
/**
 * Quick access factory for creating code search API
 */
export declare function createCodeSearch(config?: {
    maxCacheSize?: number;
    cacheTTL?: number;
}): CodeSearchAPI;
//# sourceMappingURL=search.d.ts.map