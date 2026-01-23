/**
 * RAG Optimizer - Token budget management and optimization strategies
 *
 * Core optimizer that manages read budgets and applies various optimization
 * strategies to minimize token usage while maintaining context quality.
 */
/**
 * Token estimation: 4 characters per token (standard approximation)
 */
export declare const CHARS_PER_TOKEN = 4;
/**
 * Budget threshold levels
 */
export declare enum BudgetThreshold {
    WARNING = 0.7,// 70% - warn user
    CRITICAL = 0.9
}
/**
 * Optimization modes
 */
export declare enum OptimizationMode {
    LAZY = "lazy",// Read files lazily, no optimization
    SURGEON = "surgeon",// AST-based extraction (70-85% savings)
    TYPES_ONLY = "types",// Only type definitions
    SMART = "smart"
}
/**
 * Read budget configuration
 */
export interface ReadBudget {
    maxTokens: number;
    usedTokens: number;
    threshold: BudgetThreshold;
}
/**
 * Optimization result
 */
export interface OptimizationResult {
    content: string;
    originalTokens: number;
    optimizedTokens: number;
    savings: number;
    mode: OptimizationMode;
    cacheHit: boolean;
}
/**
 * Optimizer configuration
 */
export interface OptimizerConfig {
    maxTokens: number;
    defaultMode: OptimizationMode;
    enableCache: boolean;
    cacheSize: number;
    cacheTTL: number;
}
/**
 * Default configuration
 */
export declare const DEFAULT_CONFIG: OptimizerConfig;
/**
 * RAG Optimizer class
 */
export declare class RAGOptimizer {
    private budget;
    private config;
    private surgeon;
    private cache;
    constructor(config?: Partial<OptimizerConfig>);
    /**
     * Estimate token count from character count
     */
    estimateTokens(content: string): number;
    /**
     * Check if adding content would exceed budget
     */
    checkBudget(content: string): {
        allowed: boolean;
        usage: number;
        status: string;
    };
    /**
     * Optimize content based on mode
     */
    optimize(filePath: string, content: string, mode?: OptimizationMode, query?: string): Promise<OptimizationResult>;
    /**
     * Enforce budget by checking before adding content
     */
    enforceBudget(content: string, throwOnError?: boolean): boolean;
    /**
     * Get current budget status
     */
    getBudgetStatus(): {
        used: number;
        max: number;
        percentage: number;
    };
    /**
     * Reset budget
     */
    resetBudget(): void;
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        hits: number;
        misses: number;
        hitRate: number;
    };
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Warn if budget is running low
     */
    warnIfLow(): void;
}
//# sourceMappingURL=optimizer.d.ts.map