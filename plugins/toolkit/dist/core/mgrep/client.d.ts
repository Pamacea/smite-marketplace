/**
 * mgrep Client - CLI wrapper for mgrep semantic search
 *
 * Provides interface to mgrep CLI for semantic code search with:
 * - Command execution (search, watch, mcp)
 * - JSON output parsing
 * - Error handling and availability checking
 * - Result normalization
 */
/**
 * mgrep command types
 */
export declare enum MgrepCommand {
    SEARCH = "search",
    WATCH = "watch",
    MCP = "mcp"
}
/**
 * mgrep search options
 */
export interface MgrepSearchOptions {
    /** Case-insensitive search */
    caseInsensitive?: boolean;
    /** Recursive search */
    recursive?: boolean;
    /** Maximum number of results (default: 10) */
    maxCount?: number;
    /** Show content of results */
    content?: boolean;
    /** Generate answer based on results */
    answer?: boolean;
    /** Sync local files before searching */
    sync?: boolean;
    /** Dry run (no actual syncing) */
    dryRun?: boolean;
    /** Disable reranking */
    noRerank?: boolean;
    /** Maximum file size in bytes */
    maxFileSize?: number;
    /** Maximum file count */
    maxFileCount?: number;
    /** Include web search results */
    web?: boolean;
}
/**
 * mgrep search result item
 */
export interface MgrepSearchResult {
    /** File path */
    file: string;
    /** Relevance score (0-1) */
    score: number;
    /** Matching code snippet */
    snippet?: string;
    /** Start line number */
    startLine?: number;
    /** End line number */
    endLine?: number;
    /** Generated answer (if --answer enabled) */
    answer?: string;
}
/**
 * mgrep execution result
 */
export interface MgrepResult {
    /** Success status */
    success: boolean;
    /** Search results */
    results?: MgrepSearchResult[];
    /** Error message if failed */
    error?: string;
    /** Raw output */
    rawOutput?: string;
}
/**
 * mgrep client configuration
 */
export interface MgrepClientConfig {
    /** Path to mgrep executable (default: 'mgrep') */
    executable?: string;
    /** Default max results */
    defaultMaxCount?: number;
    /** Default rerank setting */
    defaultRerank?: boolean;
    /** Request timeout in milliseconds */
    timeout?: number;
}
/**
 * Default configuration
 */
export declare const DEFAULT_MGREP_CLIENT_CONFIG: MgrepClientConfig;
/**
 * mgrep Client class
 */
export declare class MgrepClient {
    private config;
    private available;
    constructor(config?: Partial<MgrepClientConfig>);
    /**
     * Check if mgrep is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Execute mgrep command
     */
    private executeCommand;
    /**
     * Parse mgrep output
     * Note: mgrep doesn't currently support JSON output, so we parse text format
     */
    private parseResults;
    /**
     * Build mgrep search arguments
     */
    private buildSearchArgs;
    /**
     * Execute semantic search
     */
    search(query: string, path?: string, options?: MgrepSearchOptions): Promise<MgrepResult>;
    /**
     * Start watch mode
     */
    watch(query: string, path?: string, options?: MgrepSearchOptions): Promise<MgrepResult>;
    /**
     * Start MCP server
     */
    startMcp(): Promise<MgrepResult>;
    /**
     * Get mgrep version
     */
    getVersion(): Promise<string | null>;
}
//# sourceMappingURL=client.d.ts.map