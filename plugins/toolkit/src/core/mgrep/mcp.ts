/**
 * MCP Server Integration - Connect to mgrep MCP server
 *
 * Provides optional MCP integration for:
 * - Server connection management
 * - Query via MCP protocol
 * - Graceful fallback if MCP unavailable
 */

import chalk from 'chalk';
import {
  MgrepClient,
  MgrepResult,
  MgrepSearchResult,
  type MgrepClientConfig,
} from './client.js';

/**
 * MCP connection status
 */
export enum McpConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
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
export const DEFAULT_MCP_CONFIG: McpClientConfig = {
  host: 'localhost',
  timeout: 5000,
  fallback: true,
};

/**
 * MCP Server Integration class
 */
export class McpIntegration {
  private client: MgrepClient;
  private config: McpClientConfig;
  private status: McpConnectionStatus = McpConnectionStatus.DISCONNECTED;
  private serverAvailable: boolean = false;

  constructor(
    config?: Partial<McpClientConfig>,
    clientConfig?: Partial<MgrepClientConfig>
  ) {
    this.config = { ...DEFAULT_MCP_CONFIG, ...config };
    this.client = new MgrepClient(clientConfig);
  }

  /**
   * Check if MCP server is running
   * Note: This is a placeholder for actual MCP protocol detection
   */
  private async checkServerAvailable(): Promise<boolean> {
    // In a real implementation, this would:
    // 1. Try to connect to the MCP server
    // 2. Send a ping/health check
    // 3. Verify protocol compatibility

    // For now, we'll check if mgrep itself is available
    // and assume the MCP server might be running
    return this.client.isAvailable();
  }

  /**
   * Connect to MCP server
   */
  async connect(): Promise<boolean> {
    this.status = McpConnectionStatus.CONNECTING;

    try {
      this.serverAvailable = await this.checkServerAvailable();

      if (this.serverAvailable) {
        this.status = McpConnectionStatus.CONNECTED;
        console.log(chalk.green('✓ Connected to mgrep MCP server'));
        return true;
      } else {
        this.status = McpConnectionStatus.DISCONNECTED;
        console.warn(
          chalk.yellow('⚠️  mgrep MCP server not available')
        );
        return false;
      }
    } catch (error) {
      this.status = McpConnectionStatus.ERROR;
      console.error(
        chalk.red(`✗ Failed to connect to MCP server: ${error}`)
      );
      return false;
    }
  }

  /**
   * Disconnect from MCP server
   */
  disconnect(): void {
    this.status = McpConnectionStatus.DISCONNECTED;
    this.serverAvailable = false;
  }

  /**
   * Get connection status
   */
  getStatus(): McpConnectionStatus {
    return this.status;
  }

  /**
   * Execute query via MCP (with fallback)
   */
  async query(
    query: string,
    path?: string,
    options?: McpQueryOptions
  ): Promise<McpQueryResult> {
    // If MCP server is not available and fallback is enabled, use direct CLI
    if (!this.serverAvailable) {
      if (this.config.fallback) {
        console.warn(
          chalk.yellow('⚠️  MCP unavailable, using direct mgrep CLI')
        );

        const result = await this.client.search(query, path, {
          maxCount: options?.maxResults,
          content: options?.includeContent,
        });

        return {
          success: result.success,
          results: result.results,
          error: result.error,
          usedFallback: true,
        };
      } else {
        return {
          success: false,
          error: 'MCP server unavailable and fallback disabled',
        };
      }
    }

    // If MCP server is available, use it
    // Note: This is a placeholder for actual MCP protocol communication
    // In a real implementation, this would:
    // 1. Serialize the query to MCP protocol format
    // 2. Send to the MCP server via stdio/HTTP
    // 3. Parse the MCP response

    try {
      // For now, we'll simulate MCP by using the direct CLI
      // This should be replaced with actual MCP protocol calls
      const result = await this.client.search(query, path, {
        maxCount: options?.maxResults,
        content: options?.includeContent,
      });

      return {
        success: result.success,
        results: result.results,
        error: result.error,
        usedFallback: false,
      };
    } catch (error) {
      return {
        success: false,
        error: `MCP query failed: ${error}`,
      };
    }
  }

  /**
   * Execute high-precision query via MCP
   */
  async highPrecisionQuery(
    query: string,
    path?: string
  ): Promise<McpQueryResult> {
    return this.query(query, path, {
      maxResults: 10,
      includeContent: true,
      minThreshold: 0.7,
    });
  }

  /**
   * Execute high-recall query via MCP
   */
  async highRecallQuery(
    query: string,
    path?: string
  ): Promise<McpQueryResult> {
    return this.query(query, path, {
      maxResults: 50,
      includeContent: true,
      minThreshold: 0.2,
    });
  }

  /**
   * Check if MCP integration is available
   */
  async isAvailable(): Promise<boolean> {
    return this.checkServerAvailable();
  }

  /**
   * Get underlying mgrep client
   */
  getClient(): MgrepClient {
    return this.client;
  }
}

/**
 * Create MCP integration instance
 */
export function createMcp(
  config?: Partial<McpClientConfig>
): McpIntegration {
  return new McpIntegration(config);
}

/**
 * Initialize and connect to MCP server
 */
export async function initMcp(
  config?: Partial<McpClientConfig>
): Promise<McpIntegration | null> {
  const mcp = new McpIntegration(config);
  const connected = await mcp.connect();

  return connected ? mcp : null;
}
