"use strict";
/**
 * Semantic Search API - High-level search interface
 *
 * Provides semantic search capabilities with:
 * - Query-based search
 * - Result ranking and filtering
 * - Fallback to RAG-only mode
 * - Configurable thresholds and limits
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSearch = exports.DEFAULT_SEARCH_CONFIG = void 0;
exports.createSearch = createSearch;
const chalk_1 = __importDefault(require("chalk"));
const client_js_1 = require("./client.js");
/**
 * Default search configuration
 */
exports.DEFAULT_SEARCH_CONFIG = {
    maxResults: 20,
    minThreshold: 0.3,
    rerank: true,
    includeContent: true,
    recursive: true,
    fallbackToRag: true,
};
/**
 * Semantic Search class
 */
class SemanticSearch {
    constructor(config, clientConfig) {
        this.config = { ...exports.DEFAULT_SEARCH_CONFIG, ...config };
        this.client = new client_js_1.MgrepClient(clientConfig);
    }
    /**
     * Determine result quality based on score
     */
    getQuality(score) {
        if (score >= 0.7)
            return 'high';
        if (score >= 0.5)
            return 'medium';
        return 'low';
    }
    /**
     * Filter and rank results
     */
    filterAndRankResults(results, config) {
        let filtered = results;
        // Apply threshold filter
        if (config.minThreshold !== undefined) {
            filtered = filtered.filter((r) => r.score >= config.minThreshold);
        }
        // Sort by score (descending)
        filtered.sort((a, b) => b.score - a.score);
        // Apply max results limit
        if (config.maxResults !== undefined) {
            filtered = filtered.slice(0, config.maxResults);
        }
        // Add rank and quality metadata
        return filtered.map((result, index) => ({
            ...result,
            rank: index + 1,
            quality: this.getQuality(result.score),
        }));
    }
    /**
     * Calculate search statistics
     */
    calculateStats(totalResults, filteredResults, startTime, usedFallback) {
        const avgScore = filteredResults.length > 0
            ? filteredResults.reduce((sum, r) => sum + r.score, 0) /
                filteredResults.length
            : 0;
        return {
            totalResults,
            filteredResults: filteredResults.length,
            avgScore,
            duration: Date.now() - startTime,
            usedFallback,
        };
    }
    /**
     * Execute semantic search
     */
    async search(query, path, options) {
        const startTime = Date.now();
        const searchConfig = { ...this.config, ...options };
        // Check if mgrep is available
        const isAvailable = await this.client.isAvailable();
        if (!isAvailable) {
            if (searchConfig.fallbackToRag) {
                console.warn(chalk_1.default.yellow('⚠️  mgrep unavailable, falling back to RAG-only mode'));
                return {
                    results: [],
                    stats: this.calculateStats(0, [], startTime, true),
                    error: 'mgrep unavailable - RAG fallback not yet implemented',
                };
            }
            else {
                return {
                    results: [],
                    stats: this.calculateStats(0, [], startTime, false),
                    error: 'mgrep is not available and fallback is disabled',
                };
            }
        }
        // Build mgrep search options
        const mgrepOptions = {
            maxCount: searchConfig.maxResults,
            noRerank: !searchConfig.rerank,
            recursive: searchConfig.recursive,
            content: searchConfig.includeContent,
        };
        // Execute search
        const result = await this.client.search(query, path, mgrepOptions);
        if (!result.success) {
            return {
                results: [],
                stats: this.calculateStats(0, [], startTime, false),
                error: result.error || 'Search failed',
            };
        }
        // Filter and rank results
        const rankedResults = this.filterAndRankResults(result.results || [], searchConfig);
        return {
            results: rankedResults,
            stats: this.calculateStats(result.results?.length || 0, rankedResults, startTime, false),
        };
    }
    /**
     * Quick search with default options
     */
    async quickSearch(query, path) {
        return this.search(query, path);
    }
    /**
     * High-precision search (stricter thresholds)
     */
    async highPrecisionSearch(query, path) {
        return this.search(query, path, {
            minThreshold: 0.7,
            rerank: true,
            maxResults: 10,
        });
    }
    /**
     * High-recall search (more results, lower threshold)
     */
    async highRecallSearch(query, path) {
        return this.search(query, path, {
            minThreshold: 0.2,
            rerank: false,
            maxResults: 50,
        });
    }
    /**
     * Get search client
     */
    getClient() {
        return this.client;
    }
    /**
     * Check if semantic search is available
     */
    async isAvailable() {
        return this.client.isAvailable();
    }
}
exports.SemanticSearch = SemanticSearch;
/**
 * Create a semantic search instance with default config
 */
function createSearch(config) {
    return new SemanticSearch(config);
}
//# sourceMappingURL=search.js.map