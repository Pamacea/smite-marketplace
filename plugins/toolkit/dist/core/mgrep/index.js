"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MCP_CONFIG = exports.McpConnectionStatus = exports.initMcp = exports.createMcp = exports.McpIntegration = exports.mapMgrepResults = exports.mapMgrepResultToSearchResult = exports.DEFAULT_SEARCH_CONFIG = exports.createSearch = exports.SemanticSearch = exports.DEFAULT_MGREP_CLIENT_CONFIG = exports.MgrepCommand = exports.MgrepClient = void 0;
exports.createClient = createClient;
exports.createSemanticSearch = createSemanticSearch;
exports.createMcpIntegration = createMcpIntegration;
// Client exports
var client_js_1 = require("./client.js");
Object.defineProperty(exports, "MgrepClient", { enumerable: true, get: function () { return client_js_1.MgrepClient; } });
Object.defineProperty(exports, "MgrepCommand", { enumerable: true, get: function () { return client_js_1.MgrepCommand; } });
Object.defineProperty(exports, "DEFAULT_MGREP_CLIENT_CONFIG", { enumerable: true, get: function () { return client_js_1.DEFAULT_MGREP_CLIENT_CONFIG; } });
// Search exports
var search_js_1 = require("./search.js");
Object.defineProperty(exports, "SemanticSearch", { enumerable: true, get: function () { return search_js_1.SemanticSearch; } });
Object.defineProperty(exports, "createSearch", { enumerable: true, get: function () { return search_js_1.createSearch; } });
Object.defineProperty(exports, "DEFAULT_SEARCH_CONFIG", { enumerable: true, get: function () { return search_js_1.DEFAULT_SEARCH_CONFIG; } });
// Mapper exports
var mappers_js_1 = require("./mappers.js");
Object.defineProperty(exports, "mapMgrepResultToSearchResult", { enumerable: true, get: function () { return mappers_js_1.mapMgrepResultToSearchResult; } });
Object.defineProperty(exports, "mapMgrepResults", { enumerable: true, get: function () { return mappers_js_1.mapMgrepResults; } });
// MCP exports
var mcp_js_1 = require("./mcp.js");
Object.defineProperty(exports, "McpIntegration", { enumerable: true, get: function () { return mcp_js_1.McpIntegration; } });
Object.defineProperty(exports, "createMcp", { enumerable: true, get: function () { return mcp_js_1.createMcp; } });
Object.defineProperty(exports, "initMcp", { enumerable: true, get: function () { return mcp_js_1.initMcp; } });
Object.defineProperty(exports, "McpConnectionStatus", { enumerable: true, get: function () { return mcp_js_1.McpConnectionStatus; } });
Object.defineProperty(exports, "DEFAULT_MCP_CONFIG", { enumerable: true, get: function () { return mcp_js_1.DEFAULT_MCP_CONFIG; } });
/**
 * Quick access factory for creating mgrep client
 */
function createClient(config) {
    const { MgrepClient: Client } = require('./client.js');
    return new Client(config);
}
/**
 * Quick access factory for creating semantic search
 */
function createSemanticSearch(config) {
    const { SemanticSearch: Search } = require('./search.js');
    return new Search(config);
}
/**
 * Quick access factory for creating MCP integration
 */
function createMcpIntegration(config) {
    const { McpIntegration: Mcp } = require('./mcp.js');
    return new Mcp(config);
}
//# sourceMappingURL=index.js.map