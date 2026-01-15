/**
 * RAG Optimizer - Token budget management and optimization strategies
 *
 * Core optimizer that manages read budgets and applies various optimization
 * strategies to minimize token usage while maintaining context quality.
 */

import chalk from 'chalk';
import { SurgeonExtractor, ExtractionMode } from './surgeon.js';
import { SemanticCache } from './cache.js';

/**
 * Token estimation: 4 characters per token (standard approximation)
 */
export const CHARS_PER_TOKEN = 4;

/**
 * Budget threshold levels
 */
export enum BudgetThreshold {
  WARNING = 0.7,  // 70% - warn user
  CRITICAL = 0.9, // 90% - critical warning
}

/**
 * Optimization modes
 */
export enum OptimizationMode {
  LAZY = 'lazy',           // Read files lazily, no optimization
  SURGEON = 'surgeon',     // AST-based extraction (70-85% savings)
  TYPES_ONLY = 'types',    // Only type definitions
  SMART = 'smart',         // Auto-select best strategy
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
export const DEFAULT_CONFIG: OptimizerConfig = {
  maxTokens: 100000,      // 100k tokens default budget
  defaultMode: OptimizationMode.SMART,
  enableCache: true,
  cacheSize: 100,
  cacheTTL: 3600000,      // 1 hour
};

/**
 * RAG Optimizer class
 */
export class RAGOptimizer {
  private budget: ReadBudget;
  private config: OptimizerConfig;
  private surgeon: SurgeonExtractor;
  private cache: SemanticCache;

  constructor(config: Partial<OptimizerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.budget = {
      maxTokens: this.config.maxTokens,
      usedTokens: 0,
      threshold: BudgetThreshold.WARNING,
    };
    this.surgeon = new SurgeonExtractor();
    this.cache = new SemanticCache(
      this.config.cacheSize,
      this.config.cacheTTL
    );
  }

  /**
   * Estimate token count from character count
   */
  estimateTokens(content: string): number {
    return Math.ceil(content.length / CHARS_PER_TOKEN);
  }

  /**
   * Check if adding content would exceed budget
   */
  checkBudget(content: string): { allowed: boolean; usage: number; status: string } {
    const tokens = this.estimateTokens(content);
    const total = this.budget.usedTokens + tokens;
    const usage = total / this.budget.maxTokens;

    let status = '';
    if (usage >= BudgetThreshold.CRITICAL) {
      status = chalk.red(
        `⚠ CRITICAL: ${Math.round(usage * 100)}% of budget used (${total}/${this.budget.maxTokens} tokens)`
      );
    } else if (usage >= BudgetThreshold.WARNING) {
      status = chalk.yellow(
        `⚠ WARNING: ${Math.round(usage * 100)}% of budget used (${total}/${this.budget.maxTokens} tokens)`
      );
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
  async optimize(
    filePath: string,
    content: string,
    mode: OptimizationMode = this.config.defaultMode,
    query?: string
  ): Promise<OptimizationResult> {
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
        optimizedContent = await this.surgeon.extract(content, ExtractionMode.SIGNATURES);
        optimizedTokens = this.estimateTokens(optimizedContent);
        break;

      case OptimizationMode.TYPES_ONLY:
        optimizedContent = await this.surgeon.extract(content, ExtractionMode.TYPES_ONLY);
        optimizedTokens = this.estimateTokens(optimizedContent);
        break;

      case OptimizationMode.SMART:
        // Auto-select based on file size and query
        if (originalTokens > 1000) {
          optimizedContent = await this.surgeon.extract(content, ExtractionMode.SIGNATURES);
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
  enforceBudget(content: string, throwOnError = false): boolean {
    const check = this.checkBudget(content);

    if (check.status) {
      console.log(check.status);
    }

    if (!check.allowed && throwOnError) {
      throw new Error(
        `Budget exceeded: ${this.budget.usedTokens}/${this.budget.maxTokens} tokens`
      );
    }

    return check.allowed;
  }

  /**
   * Get current budget status
   */
  getBudgetStatus(): { used: number; max: number; percentage: number } {
    return {
      used: this.budget.usedTokens,
      max: this.budget.maxTokens,
      percentage: (this.budget.usedTokens / this.budget.maxTokens) * 100,
    };
  }

  /**
   * Reset budget
   */
  resetBudget(): void {
    this.budget.usedTokens = 0;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { hits: number; misses: number; hitRate: number } {
    return this.cache.getStats();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Warn if budget is running low
   */
  warnIfLow(): void {
    const status = this.getBudgetStatus();
    const usage = status.percentage / 100;

    if (usage >= BudgetThreshold.CRITICAL) {
      console.log(
        chalk.red.bold(
          `\n⚠ CRITICAL: ${Math.round(status.percentage)}% of token budget used!\n` +
            `Consider using optimization modes to reduce token usage.\n`
        )
      );
    } else if (usage >= BudgetThreshold.WARNING) {
      console.log(
        chalk.yellow(
          `\n⚠ WARNING: ${Math.round(status.percentage)}% of token budget used.\n`
        )
      );
    }
  }
}
