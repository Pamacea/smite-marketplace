/**
 * Search Strategies
 *
 * Implements different search strategies that can be used by the unified router.
 *
 * @module core/unified/strategies
 */
import { SearchStrategy, StrategyResult } from './types.js';
/**
 * Base strategy interface
 */
export interface ISearchStrategy {
    /** Strategy name */
    readonly name: SearchStrategy;
    /** Execute search with this strategy */
    search(query: string, options: Record<string, unknown>): Promise<StrategyResult>;
}
/**
 * Semantic search strategy using mgrep
 */
export declare class SemanticSearchStrategy implements ISearchStrategy {
    readonly name = SearchStrategy.SEMANTIC;
    private client;
    private semanticSearch;
    constructor(config?: Record<string, unknown>);
    search(query: string, options: Record<string, unknown>): Promise<StrategyResult>;
}
/**
 * Literal search strategy using grep-like patterns
 */
export declare class LiteralSearchStrategy implements ISearchStrategy {
    readonly name = SearchStrategy.LITERAL;
    private client;
    constructor(config?: Record<string, unknown>);
    search(query: string, options: Record<string, unknown>): Promise<StrategyResult>;
}
/**
 * Hybrid search strategy combining semantic and literal
 */
export declare class HybridSearchStrategy implements ISearchStrategy {
    readonly name = SearchStrategy.HYBRID;
    private semantic;
    private literal;
    constructor(config?: Record<string, unknown>);
    search(query: string, options: Record<string, unknown>): Promise<StrategyResult>;
    /**
     * Merge results from multiple strategies
     */
    private mergeResults;
}
/**
 * Strategy factory
 */
export declare class StrategyFactory {
    private strategies;
    constructor(config?: Record<string, unknown>);
    /**
     * Get a strategy by name
     */
    getStrategy(strategy: SearchStrategy): ISearchStrategy;
    /**
     * Get all available strategies
     */
    getAllStrategies(): ISearchStrategy[];
}
//# sourceMappingURL=strategies.d.ts.map