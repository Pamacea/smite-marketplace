"use strict";
/**
 * MCP Server Integration - Connect to mgrep MCP server
 *
 * Provides optional MCP integration for:
 * - Server connection management
 * - Query via MCP protocol
 * - Graceful fallback if MCP unavailable
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpIntegration = exports.DEFAULT_MCP_CONFIG = exports.McpConnectionStatus = void 0;
exports.createMcp = createMcp;
exports.initMcp = initMcp;
const chalk_1 = __importDefault(require("chalk"));
const client_js_1 = require("./client.js");
/**
 * MCP connection status
 */
var McpConnectionStatus;
(function (McpConnectionStatus) {
    McpConnectionStatus["DISCONNECTED"] = "disconnected";
    McpConnectionStatus["CONNECTING"] = "connecting";
    McpConnectionStatus["CONNECTED"] = "connected";
    McpConnectionStatus["ERROR"] = "error";
})(McpConnectionStatus || (exports.McpConnectionStatus = McpConnectionStatus = {}));
/**
 * Default MCP configuration
 */
exports.DEFAULT_MCP_CONFIG = {
    host: 'localhost',
    timeout: 5000,
    fallback: true,
};
/**
 * MCP Server Integration class
 */
class McpIntegration {
    constructor(config, clientConfig) {
        this.status = McpConnectionStatus.DISCONNECTED;
        this.serverAvailable = false;
        this.config = { ...exports.DEFAULT_MCP_CONFIG, ...config };
        this.client = new client_js_1.MgrepClient(clientConfig);
    }
    /**
     * Check if MCP server is running
     * Note: This is a placeholder for actual MCP protocol detection
     */
    async checkServerAvailable() {
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
    async connect() {
        this.status = McpConnectionStatus.CONNECTING;
        try {
            this.serverAvailable = await this.checkServerAvailable();
            if (this.serverAvailable) {
                this.status = McpConnectionStatus.CONNECTED;
                console.log(chalk_1.default.green('✓ Connected to mgrep MCP server'));
                return true;
            }
            else {
                this.status = McpConnectionStatus.DISCONNECTED;
                console.warn(chalk_1.default.yellow('⚠️  mgrep MCP server not available'));
                return false;
            }
        }
        catch (error) {
            this.status = McpConnectionStatus.ERROR;
            console.error(chalk_1.default.red(`✗ Failed to connect to MCP server: ${error}`));
            return false;
        }
    }
    /**
     * Disconnect from MCP server
     */
    disconnect() {
        this.status = McpConnectionStatus.DISCONNECTED;
        this.serverAvailable = false;
    }
    /**
     * Get connection status
     */
    getStatus() {
        return this.status;
    }
    /**
     * Execute query via MCP (with fallback)
     */
    async query(query, path, options) {
        // If MCP server is not available and fallback is enabled, use direct CLI
        if (!this.serverAvailable) {
            if (this.config.fallback) {
                console.warn(chalk_1.default.yellow('⚠️  MCP unavailable, using direct mgrep CLI'));
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
            }
            else {
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
        }
        catch (error) {
            return {
                success: false,
                error: `MCP query failed: ${error}`,
            };
        }
    }
    /**
     * Execute high-precision query via MCP
     */
    async highPrecisionQuery(query, path) {
        return this.query(query, path, {
            maxResults: 10,
            includeContent: true,
            minThreshold: 0.7,
        });
    }
    /**
     * Execute high-recall query via MCP
     */
    async highRecallQuery(query, path) {
        return this.query(query, path, {
            maxResults: 50,
            includeContent: true,
            minThreshold: 0.2,
        });
    }
    /**
     * Check if MCP integration is available
     */
    async isAvailable() {
        return this.checkServerAvailable();
    }
    /**
     * Get underlying mgrep client
     */
    getClient() {
        return this.client;
    }
}
exports.McpIntegration = McpIntegration;
/**
 * Create MCP integration instance
 */
function createMcp(config) {
    return new McpIntegration(config);
}
/**
 * Initialize and connect to MCP server
 */
async function initMcp(config) {
    const mcp = new McpIntegration(config);
    const connected = await mcp.connect();
    return connected ? mcp : null;
}
//# sourceMappingURL=mcp.js.map