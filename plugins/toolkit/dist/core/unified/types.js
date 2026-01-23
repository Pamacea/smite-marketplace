"use strict";
/**
 * Unified Search Router - Type Definitions
 *
 * Defines the core types and interfaces for the unified search system
 * that integrates RAG, mgrep, semantic search, and hybrid strategies.
 *
 * @module core/unified/types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ROUTER_CONFIG = exports.QueryType = exports.SearchStrategy = void 0;
/**
 * Search strategy types supported by the unified router
 */
var SearchStrategy;
(function (SearchStrategy) {
    /** Automatic strategy selection based on query analysis */
    SearchStrategy["AUTO"] = "auto";
    /** Semantic search using embeddings and similarity matching */
    SearchStrategy["SEMANTIC"] = "semantic";
    /** Literal text search using grep/mgrep */
    SearchStrategy["LITERAL"] = "literal";
    /** Hybrid approach combining semantic and literal search */
    SearchStrategy["HYBRID"] = "hybrid";
})(SearchStrategy || (exports.SearchStrategy = SearchStrategy = {}));
/**
 * Query type detected by the analyzer
 */
var QueryType;
(function (QueryType) {
    /** Natural language query requiring semantic understanding */
    QueryType["NATURAL_LANGUAGE"] = "natural_language";
    /** Code snippet or literal pattern matching */
    QueryType["CODE_PATTERN"] = "code_pattern";
    /** Function/class name lookup */
    QueryType["SYMBOL_LOOKUP"] = "symbol_lookup";
    /** File path or pattern */
    QueryType["FILE_PATH"] = "file_path";
    /** Mixed query combining multiple types */
    QueryType["HYBRID"] = "hybrid";
})(QueryType || (exports.QueryType = QueryType = {}));
/**
 * Default router configuration
 */
exports.DEFAULT_ROUTER_CONFIG = {
    defaultMaxResults: 50,
    defaultTimeout: 30000,
    cacheEnabled: true,
    cacheTTL: 300000, // 5 minutes
    maxCacheSize: 100,
    confidenceThreshold: 0.6,
    enableFallback: true,
    maxFallbacks: 2,
};
//# sourceMappingURL=types.js.map