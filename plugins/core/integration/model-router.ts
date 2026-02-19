/**
 * Model Router - Intelligent model selection
 *
 * Automatically selects the best model based on:
 * - Task type and triggers
 * - Complexity analysis
 * - Cost optimization goals
 */

import { z } from 'zod';

export interface ModelRoute {
  name: string;
  model: string;
  description: string;
  triggers: string[];
  max_tokens: number;
  priority: number;
  fallback_to?: string | null;
}

export interface ModelRoutingConfig {
  enabled: boolean;
  strategy: 'smart' | 'cost' | 'quality' | 'speed';
  routes: Record<string, ModelRoute>;
  cost_optimization: {
    enabled: boolean;
    prefer_haiku_for_discovery: boolean;
    upgrade_to_opus_on_failure: boolean;
    max_opus_usage_percent: number;
  };
}

export interface ModelSelection {
  model: string;
  reason: string;
  confidence: number;
  estimated_cost: number;
  estimated_time: number;
}

/**
 * Model Router
 */
export class ModelRouter {
  private config: ModelRoutingConfig;
  private usageStats: Map<string, number> = new Map();

  constructor(config: ModelRoutingConfig) {
    this.config = config;
  }

  /**
   * Select the best model for a given task
   */
  selectModel(task: string, context?: {
    complexity?: 'simple' | 'medium' | 'complex';
    category?: string;
    tools?: string[];
  }): ModelSelection {
    if (!this.config.enabled) {
      // Default to Sonnet if routing disabled
      return {
        model: 'claude-sonnet-4-5',
        reason: 'Model routing disabled',
        confidence: 0.5,
        estimated_cost: 0.15,
        estimated_time: 60
      };
    }

    // Check each route in priority order
    const sortedRoutes = Object.entries(this.config.routes)
      .sort(([, a], [, b]) => a.priority - b.priority);

    for (const [routeName, route] of sortedRoutes) {
      const match = this.matchesRoute(task, route, context);
      if (match.matches && match.confidence > 0.7) {
        this.usageStats.set(route.model, (this.usageStats.get(route.model) || 0) + 1);

        return {
          model: route.model,
          reason: match.reason,
          confidence: match.confidence,
          estimated_cost: this.estimateCost(route.model),
          estimated_time: this.estimateTime(route.model)
        };
      }
    }

    // Fallback to implementation route
    const defaultRoute = this.config.routes['implementation'];
    if (defaultRoute) {
      return {
        model: defaultRoute.model,
        reason: 'Default implementation route',
        confidence: 0.5,
        estimated_cost: this.estimateCost(defaultRoute.model),
        estimated_time: this.estimateTime(defaultRoute.model)
      };
    }

    // Ultimate fallback
    return {
      model: 'claude-sonnet-4-5',
      reason: 'No matching route, using default',
      confidence: 0.3,
      estimated_cost: 0.15,
      estimated_time: 60
    };
  }

  /**
   * Check if a route matches the task
   */
  private matchesRoute(task: string, route: ModelRoute, context?: any): {
    matches: boolean;
    confidence: number;
    reason: string;
  } {
    const taskLower = task.toLowerCase();
    let confidence = 0;
    const reasons: string[] = [];

    // Check triggers
    for (const trigger of route.triggers) {
      if (taskLower.includes(trigger.toLowerCase())) {
        confidence += 0.3;
        reasons.push(`Trigger match: "${trigger}"`);
      }
    }

    // Check context
    if (context) {
      // Complexity check
      if (context.complexity === 'simple' && route.name === 'discovery') {
        confidence += 0.4;
        reasons.push('Simple task, discovery appropriate');
      }

      if (context.complexity === 'complex' && route.name === 'architecture') {
        confidence += 0.4;
        reasons.push('Complex task, architecture needed');
      }

      // Tools check
      if (context.tools) {
        const hasDiscoveryTools = context.tools.some(t =>
          ['grep', 'glob', 'find'].includes(t)
        );
        if (hasDiscoveryTools && route.name === 'discovery') {
          confidence += 0.3;
          reasons.push('Discovery tools present');
        }
      }
    }

    return {
      matches: confidence > 0.5,
      confidence: Math.min(confidence, 1.0),
      reason: reasons.join(' | ') || route.description
    };
  }

  /**
   * Estimate cost for a model (USD per million tokens)
   */
  private estimateCost(model: string): number {
    const costs: Record<string, number> = {
      'claude-haiku-4-5': 0.25,
      'claude-haiku-4-5': 0.25,
      'claude-sonnet-4-5': 3.00,
      'claude-opus-4-6': 15.00
    };

    return costs[model] || 3.00;
  }

  /**
   * Estimate time for a model (seconds per 1M tokens)
   */
  private estimateTime(model: string): number {
    const times: Record<string, number> = {
      'claude-haiku-4-5': 30,
      'claude-sonnet-4-5': 60,
      'claude-opus-4-6': 90
    };

    return times[model] || 60;
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    return {
      byModel: Object.fromEntries(this.usageStats),
      total: Array.from(this.usageStats.values()).reduce((a, b) => a + b, 0)
    };
  }

  /**
   * Check Opus usage limits
   */
  isOpusUnderLimit(): boolean {
    const stats = this.getUsageStats();
    const total = stats.total;
    const opusUsage = stats.byModel['claude-opus-4-6'] || 0;

    if (!this.config.cost_optimization) {
      return true;
    }

    const opusPercent = (opusUsage / total) * 100;
    return opusPercent <= this.config.cost_optimization.max_opus_usage_percent;
  }
}

/**
 * Global model router instance
 */
export const modelRouter = new ModelRouter({
  enabled: true,
  strategy: 'smart',
  routes: {},
  cost_optimization: {
    enabled: true,
    prefer_haiku_for_discovery: true,
    upgrade_to_opus_on_failure: true,
    max_opus_usage_percent: 15
  }
});

/**
 * Quick access function
 */
export function selectModel(task: string, context?: any): ModelSelection {
  return modelRouter.selectModel(task, context);
}
