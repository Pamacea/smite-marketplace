"use strict";
/**
 * RAG Optimizer - Token budget management and optimization strategies
 *
 * Core optimizer that manages read budgets and applies various optimization
 * strategies to minimize token usage while maintaining context quality.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGOptimizer = exports.DEFAULT_CONFIG = exports.OptimizationMode = exports.BudgetThreshold = exports.CHARS_PER_TOKEN = void 0;
const chalk_1 = __importDefault(require("chalk"));
const surgeon_js_1 = require("./surgeon.js");
const cache_js_1 = require("./cache.js");
/**
 * Token estimation: 4 characters per token (standard approximation)
 */
exports.CHARS_PER_TOKEN = 4;
/**
 * Budget threshold levels
 */
var BudgetThreshold;
(function (BudgetThreshold) {
    BudgetThreshold[BudgetThreshold["WARNING"] = 0.7] = "WARNING";
    BudgetThreshold[BudgetThreshold["CRITICAL"] = 0.9] = "CRITICAL";
})(BudgetThreshold || (exports.BudgetThreshold = BudgetThreshold = {}));
/**
 * Optimization modes
 */
var OptimizationMode;
(function (OptimizationMode) {
    OptimizationMode["LAZY"] = "lazy";
    OptimizationMode["SURGEON"] = "surgeon";
    OptimizationMode["TYPES_ONLY"] = "types";
    OptimizationMode["SMART"] = "smart";
})(OptimizationMode || (exports.OptimizationMode = OptimizationMode = {}));
/**
 * Default configuration
 */
exports.DEFAULT_CONFIG = {
    maxTokens: 100000, // 100k tokens default budget
    defaultMode: OptimizationMode.SMART,
    enableCache: true,
    cacheSize: 100,
    cacheTTL: 3600000, // 1 hour
};
/**
 * RAG Optimizer class
 */
class RAGOptimizer {
    constructor(config = {}) {
        this.config = { ...exports.DEFAULT_CONFIG, ...config };
        this.budget = {
            maxTokens: this.config.maxTokens,
            usedTokens: 0,
            threshold: BudgetThreshold.WARNING,
        };
        this.surgeon = new surgeon_js_1.SurgeonExtractor();
        this.cache = new cache_js_1.SemanticCache(this.config.cacheSize, this.config.cacheTTL);
    }
    /**
     * Estimate token count from character count
     */
    estimateTokens(content) {
        return Math.ceil(content.length / exports.CHARS_PER_TOKEN);
    }
    /**
     * Check if adding content would exceed budget
     */
    checkBudget(content) {
        const tokens = this.estimateTokens(content);
        const total = this.budget.usedTokens + tokens;
        const usage = total / this.budget.maxTokens;
        let status = '';
        if (usage >= BudgetThreshold.CRITICAL) {
            status = chalk_1.default.red(`⚠ CRITICAL: ${Math.round(usage * 100)}% of budget used (${total}/${this.budget.maxTokens} tokens)`);
        }
        else if (usage >= BudgetThreshold.WARNING) {
            status = chalk_1.default.yellow(`⚠ WARNING: ${Math.round(usage * 100)}% of budget used (${total}/${this.budget.maxTokens} tokens)`);
        }
        return {
            allowed: total <= this.budget.maxTokens,
            usage,
            status,
        };
    }
    /**
     * Optimize content based on mode
     */
    async optimize(filePath, content, mode = this.config.defaultMode, query) {
        const originalTokens = this.estimateTokens(content);
        // Check cache first if enabled
        if (this.config.enableCache && query) {
            const cached = await this.cache.get(query, filePath);
            if (cached) {
                return {
                    content: cached.content,
                    originalTokens,
                    optimizedTokens: cached.tokens,
                    savings: ((originalTokens - cached.tokens) / originalTokens) * 100,
                    mode,
                    cacheHit: true,
                };
            }
        }
        // Apply optimization based on mode
        let optimizedContent = content;
        let optimizedTokens = originalTokens;
        switch (mode) {
            case OptimizationMode.SURGEON:
                optimizedContent = await this.surgeon.extract(content, surgeon_js_1.ExtractionMode.SIGNATURES);
                optimizedTokens = this.estimateTokens(optimizedContent);
                break;
            case OptimizationMode.TYPES_ONLY:
                optimizedContent = await this.surgeon.extract(content, surgeon_js_1.ExtractionMode.TYPES_ONLY);
                optimizedTokens = this.estimateTokens(optimizedContent);
                break;
            case OptimizationMode.SMART:
                // Auto-select based on file size and query
                if (originalTokens > 1000) {
                    optimizedContent = await this.surgeon.extract(content, surgeon_js_1.ExtractionMode.SIGNATURES);
                    optimizedTokens = this.estimateTokens(optimizedContent);
                }
                break;
            case OptimizationMode.LAZY:
            default:
                // No optimization, return as-is
                break;
        }
        // Update budget
        this.budget.usedTokens += optimizedTokens;
        // Cache result if enabled
        if (this.config.enableCache && query && mode !== OptimizationMode.LAZY) {
            await this.cache.set(query, filePath, optimizedContent, optimizedTokens);
        }
        return {
            content: optimizedContent,
            originalTokens,
            optimizedTokens,
            savings: ((originalTokens - optimizedTokens) / originalTokens) * 100,
            mode,
            cacheHit: false,
        };
    }
    /**
     * Enforce budget by checking before adding content
     */
    enforceBudget(content, throwOnError = false) {
        const check = this.checkBudget(content);
        if (check.status) {
            console.log(check.status);
        }
        if (!check.allowed && throwOnError) {
            throw new Error(`Budget exceeded: ${this.budget.usedTokens}/${this.budget.maxTokens} tokens`);
        }
        return check.allowed;
    }
    /**
     * Get current budget status
     */
    getBudgetStatus() {
        return {
            used: this.budget.usedTokens,
            max: this.budget.maxTokens,
            percentage: (this.budget.usedTokens / this.budget.maxTokens) * 100,
        };
    }
    /**
     * Reset budget
     */
    resetBudget() {
        this.budget.usedTokens = 0;
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return this.cache.getStats();
    }
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }
    /**
     * Warn if budget is running low
     */
    warnIfLow() {
        const status = this.getBudgetStatus();
        const usage = status.percentage / 100;
        if (usage >= BudgetThreshold.CRITICAL) {
            console.log(chalk_1.default.red.bold(`\n⚠ CRITICAL: ${Math.round(status.percentage)}% of token budget used!\n` +
                `Consider using optimization modes to reduce token usage.\n`));
        }
        else if (usage >= BudgetThreshold.WARNING) {
            console.log(chalk_1.default.yellow(`\n⚠ WARNING: ${Math.round(status.percentage)}% of token budget used.\n`));
        }
    }
}
exports.RAGOptimizer = RAGOptimizer;
//# sourceMappingURL=optimizer.js.map