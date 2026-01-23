"use strict";
/**
 * Search Strategies
 *
 * Implements different search strategies that can be used by the unified router.
 *
 * @module core/unified/strategies
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyFactory = exports.HybridSearchStrategy = exports.LiteralSearchStrategy = exports.SemanticSearchStrategy = void 0;
const types_js_1 = require("./types.js");
const client_js_1 = require("../mgrep/client.js");
const search_js_1 = require("../mgrep/search.js");
const mappers_js_1 = require("../mgrep/mappers.js");
/**
 * Semantic search strategy using mgrep
 */
class SemanticSearchStrategy {
    constructor(config) {
        this.name = types_js_1.SearchStrategy.SEMANTIC;
        this.client = new client_js_1.MgrepClient(config);
        this.semanticSearch = new search_js_1.SemanticSearch({
            maxResults: config?.maxResults || 50,
        });
    }
    async search(query, options) {
        const startTime = Date.now();
        try {
            const maxResults = options.maxResults || 50;
            const result = await this.semanticSearch.search(query, undefined, {
                maxResults,
            });
            const results = (0, mappers_js_1.mapMgrepResults)(result.results);
            return {
                strategy: this.name,
                score: result.results.length > 0 ? result.results[0].score : 0,
                results,
                executionTime: Date.now() - startTime,
                metadata: {
                    totalResults: result.results.length,
                    usedFallback: result.stats.usedFallback,
                },
            };
        }
        catch (error) {
            return {
                strategy: this.name,
                score: 0,
                results: [],
                executionTime: Date.now() - startTime,
                metadata: {
                    error: error instanceof Error ? error.message : String(error),
                },
            };
        }
    }
}
exports.SemanticSearchStrategy = SemanticSearchStrategy;
/**
 * Literal search strategy using grep-like patterns
 */
class LiteralSearchStrategy {
    constructor(config) {
        this.name = types_js_1.SearchStrategy.LITERAL;
        this.client = new client_js_1.MgrepClient(config);
    }
    async search(query, options) {
        const startTime = Date.now();
        try {
            const maxResults = options.maxResults || 50;
            const result = await this.client.search(query, undefined, {
                maxCount: maxResults,
                recursive: true,
                content: true,
                caseInsensitive: true,
            });
            if (!result.success || !result.results) {
                return {
                    strategy: this.name,
                    score: 0,
                    results: [],
                    executionTime: Date.now() - startTime,
                    metadata: {
                        error: result.error || 'Search failed',
                    },
                };
            }
            const results = (0, mappers_js_1.mapMgrepResults)(result.results);
            return {
                strategy: this.name,
                score: results.length > 0 ? 1.0 : 0,
                results,
                executionTime: Date.now() - startTime,
                metadata: {
                    totalResults: results.length,
                },
            };
        }
        catch (error) {
            return {
                strategy: this.name,
                score: 0,
                results: [],
                executionTime: Date.now() - startTime,
                metadata: {
                    error: error instanceof Error ? error.message : String(error),
                },
            };
        }
    }
}
exports.LiteralSearchStrategy = LiteralSearchStrategy;
/**
 * Hybrid search strategy combining semantic and literal
 */
class HybridSearchStrategy {
    constructor(config) {
        this.name = types_js_1.SearchStrategy.HYBRID;
        this.semantic = new SemanticSearchStrategy(config);
        this.literal = new LiteralSearchStrategy(config);
    }
    async search(query, options) {
        const startTime = Date.now();
        try {
            // Run both strategies in parallel
            const [semanticResult, literalResult] = await Promise.all([
                this.semantic.search(query, options),
                this.literal.search(query, options),
            ]);
            // Merge and deduplicate results
            const mergedResults = this.mergeResults(semanticResult.results, literalResult.results);
            // Calculate combined score
            const combinedScore = Math.max(semanticResult.score, literalResult.score, mergedResults.length > 0 ? mergedResults[0].score || 0 : 0);
            return {
                strategy: this.name,
                score: combinedScore,
                results: mergedResults,
                executionTime: Date.now() - startTime,
                metadata: {
                    semanticResults: semanticResult.results.length,
                    literalResults: literalResult.results.length,
                    mergedResults: mergedResults.length,
                },
            };
        }
        catch (error) {
            return {
                strategy: this.name,
                score: 0,
                results: [],
                executionTime: Date.now() - startTime,
                metadata: {
                    error: error instanceof Error ? error.message : String(error),
                },
            };
        }
    }
    /**
     * Merge results from multiple strategies
     */
    mergeResults(...resultSets) {
        const mergedMap = new Map();
        for (const results of resultSets) {
            for (const result of results) {
                const key = `${result.filePath}:${result.lineNumber}`;
                const existing = mergedMap.get(key);
                if (!existing || (result.score && existing.score && result.score > existing.score)) {
                    mergedMap.set(key, result);
                }
            }
        }
        // Sort by score descending
        return Array.from(mergedMap.values()).sort((a, b) => {
            const scoreA = a.score || 0;
            const scoreB = b.score || 0;
            return scoreB - scoreA;
        });
    }
}
exports.HybridSearchStrategy = HybridSearchStrategy;
/**
 * Strategy factory
 */
class StrategyFactory {
    constructor(config) {
        this.strategies = new Map();
        this.strategies.set(types_js_1.SearchStrategy.SEMANTIC, new SemanticSearchStrategy(config));
        this.strategies.set(types_js_1.SearchStrategy.LITERAL, new LiteralSearchStrategy(config));
        this.strategies.set(types_js_1.SearchStrategy.HYBRID, new HybridSearchStrategy(config));
    }
    /**
     * Get a strategy by name
     */
    getStrategy(strategy) {
        const s = this.strategies.get(strategy);
        if (!s) {
            throw new Error(`Unknown strategy: ${strategy}`);
        }
        return s;
    }
    /**
     * Get all available strategies
     */
    getAllStrategies() {
        return Array.from(this.strategies.values());
    }
}
exports.StrategyFactory = StrategyFactory;
//# sourceMappingURL=strategies.js.map