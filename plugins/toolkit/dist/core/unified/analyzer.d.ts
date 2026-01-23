/**
 * Query Analyzer
 *
 * Analyzes search queries to determine their type and recommend
 * the appropriate search strategy.
 *
 * @module core/unified/analyzer
 */
import { QueryAnalysis } from './types.js';
/**
 * Query Analyzer class
 */
export declare class QueryAnalyzer {
    /**
     * Analyze a search query
     */
    analyze(query: string): QueryAnalysis;
    /**
     * Get alternative strategies to try if primary fails
     */
    private getAlternativeStrategies;
}
//# sourceMappingURL=analyzer.d.ts.map