/**
 * MCP Server Integration - Connect to mgrep MCP server
 *
 * Provides optional MCP integration for:
 * - Server connection management
 * - Query via MCP protocol
 * - Graceful fallback if MCP unavailable
 */
import { MgrepClient, MgrepSearchResult, type MgrepClientConfig } from './client.js';
/**
 * MCP connection status
 */
export declare enum McpConnectionStatus {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    ERROR = "error"
}
/**
 * MCP query options
 */
export interface McpQueryOptions {
    /** Maximum results */
    maxResults?: number;
    /** Include content */
    includeContent?: boolean;
    /** Minimum score threshold */
    minThreshold?: number;
}
/**
 * MCP query result
 */
export interface McpQueryResult {
    /** Success status */
    success: boolean;
    /** Search results */
    results?: MgrepSearchResult[];
    /** Error message if failed */
    error?: string;
    /** Whether fallback was used */
    usedFallback?: boolean;
}
/**
 * MCP client configuration
 */
export interface McpClientConfig {
    /** MCP server host (default: localhost) */
    host?: string;
    /** MCP server port (default: varies by implementation) */
    port?: number;
    /** Connection timeout in milliseconds */
    timeout?: number;
    /** Enable fallback to direct mgrep CLI */
    fallback?: boolean;
}
/**
 * Default MCP configuration
 */
export declare const DEFAULT_MCP_CONFIG: McpClientConfig;
/**
 * MCP Server Integration class
 */
export declare class McpIntegration {
    private client;
    private config;
    private status;
    private serverAvailable;
    constructor(config?: Partial<McpClientConfig>, clientConfig?: Partial<MgrepClientConfig>);
    /**
     * Check if MCP server is running
     * Note: This is a placeholder for actual MCP protocol detection
     */
    private checkServerAvailable;
    /**
     * Connect to MCP server
     */
    connect(): Promise<boolean>;
    /**
     * Disconnect from MCP server
     */
    disconnect(): void;
    /**
     * Get connection status
     */
    getStatus(): McpConnectionStatus;
    /**
     * Execute query via MCP (with fallback)
     */
    query(query: string, path?: string, options?: McpQueryOptions): Promise<McpQueryResult>;
    /**
     * Execute high-precision query via MCP
     */
    highPrecisionQuery(query: string, path?: string): Promise<McpQueryResult>;
    /**
     * Execute high-recall query via MCP
     */
    highRecallQuery(query: string, path?: string): Promise<McpQueryResult>;
    /**
     * Check if MCP integration is available
     */
    isAvailable(): Promise<boolean>;
    /**
     * Get underlying mgrep client
     */
    getClient(): MgrepClient;
}
/**
 * Create MCP integration instance
 */
export declare function createMcp(config?: Partial<McpClientConfig>): McpIntegration;
/**
 * Initialize and connect to MCP server
 */
export declare function initMcp(config?: Partial<McpClientConfig>): Promise<McpIntegration | null>;
//# sourceMappingURL=mcp.d.ts.map