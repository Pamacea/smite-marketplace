/**
 * Agent Telemetry & Analytics System
 *
 * Track agent performance, token usage, costs, and quality metrics.
 *
 * Benefits:
 * - Understand which agents perform best
 * - Optimize costs by routing to right models
 * - Identify patterns and areas for improvement
 * - Data-driven decisions on agent usage
 */

import { z } from 'zod';

export const AgentEventSchema = z.object({
  timestamp: z.date(),
  agent: z.string(),
  model: z.string(),
  task: z.string(),
  duration: z.number(), // milliseconds
  tokens: z.object({
    input: z.number(),
    output: z.number(),
    total: z.number()
  }),
  cost: z.number(), // USD
  success: z.boolean(),
  quality_score: z.number().optional(), // 1-10
  error?: z.string()
});

export type AgentEvent = z.infer<typeof AgentEventSchema>;

export const AgentStatsSchema = z.object({
  agent: z.string(),
  tasks_completed: z.number(),
  avg_duration: z.number(),
  avg_cost: z.number(),
  success_rate: z.number(),
  avg_quality_score: z.number(),
  total_tokens: z.number(),
  total_cost: z.number(),
  last_used: z.date(),
  common_patterns: z.array(z.string()),
  model_usage: z.record(z.string(), z.number())
});

export type AgentStats = z.infer<typeof AgentStatsSchema>;

export interface TelemetryConfig {
  enabled: boolean;
  storage_path: string;
  retention_days: number;
  anonymize_data: boolean;
  track_model_usage: boolean;
  track_token_costs: boolean;
  track_performance: boolean;
}

/**
 * Telemetry Manager
 */
export class TelemetryManager {
  private config: TelemetryConfig;
  private events: AgentEvent[] = [];
  private stats: Map<string, AgentStats> = new Map();

  constructor(config?: Partial<TelemetryConfig>) {
    this.config = {
      enabled: true,
      storage_path: '.claude/telemetry/',
      retention_days: 30,
      anonymize_data: false,
      track_model_usage: true,
      track_token_costs: true,
      track_performance: true,
      ...config
    };
  }

  /**
   * Initialize telemetry system
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('⚠ Telemetry disabled');
      return;
    }

    await this.loadEvents();
    await this.calculateStats();
    console.log('✓ Telemetry system initialized');
  }

  /**
   * Record an agent event
   */
  async recordEvent(event: Omit<AgentEvent, 'timestamp'>): Promise<void> {
    if (!this.config.enabled) return;

    const fullEvent: AgentEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(fullEvent);

    // Update stats
    await this.updateStats(fullEvent);

    // Persist to disk
    await this.saveEvents();
  }

  /**
   * Get statistics for an agent
   */
  getAgentStats(agentName: string): AgentStats | undefined {
    return this.stats.get(agentName);
  }

  /**
   * Get all agent statistics
   */
  getAllStats(): AgentStats[] {
    return Array.from(this.stats.values()).sort((a, b) =>
      b.tasks_completed - a.tasks_completed
    );
  }

  /**
   * Get model usage breakdown
   */
  getModelUsage(): Record<string, { usage: number; cost: number; tokens: number }> {
    const modelStats: Record<string, { usage: number; cost: number; tokens: number }> = {};

    for (const event of this.events) {
      if (!modelStats[event.model]) {
        modelStats[event.model] = { usage: 0, cost: 0, tokens: 0 };
      }

      modelStats[event.model].usage++;
      modelStats[event.model].cost += event.cost;
      modelStats[event.model].tokens += event.tokens.total;
    }

    return modelStats;
  }

  /**
   * Get cost analysis
   */
  getCostAnalysis(days: number = 30): {
    total_cost: number;
    avg_daily_cost: number;
    by_model: Record<string, number>;
    by_agent: Record<string, number>;
    trend: 'increasing' | 'decreasing' | 'stable';
  } {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentEvents = this.events.filter(e => e.timestamp >= cutoff);

    const total_cost = recentEvents.reduce((sum, e) => sum + e.cost, 0);
    const avg_daily_cost = total_cost / days;

    const by_model: Record<string, number> = {};
    const by_agent: Record<string, number> = {};

    for (const event of recentEvents) {
      by_model[event.model] = (by_model[event.model] || 0) + event.cost;
      by_agent[event.agent] = (by_agent[event.agent] || 0) + event.cost;
    }

    // Calculate trend
    const midPoint = new Date(cutoff);
    midPoint.setDate(midPoint.getDate() + days / 2);

    const firstHalf = recentEvents.filter(e => e.timestamp < midPoint);
    const secondHalf = recentEvents.filter(e => e.timestamp >= midPoint);

    const firstHalfCost = firstHalf.reduce((sum, e) => sum + e.cost, 0);
    const secondHalfCost = secondHalf.reduce((sum, e) => sum + e.cost, 0);

    let trend: 'increasing' | 'decreasing' | 'stable';
    if (secondHalfCost > firstHalfCost * 1.1) {
      trend = 'increasing';
    } else if (secondHalfCost < firstHalfCost * 0.9) {
      trend = 'decreasing';
    } else {
      trend = 'stable';
    }

    return {
      total_cost,
      avg_daily_cost,
      by_model,
      by_agent,
      trend
    };
  }

  /**
   * Get performance insights
   */
  getPerformanceInsights(): {
    fastest_agent: { agent: string; avg_time: number };
    slowest_agent: { agent: string; avg_time: number };
    highest_quality: { agent: string; avg_score: number };
    most_reliable: { agent: string; success_rate: number };
    recommendations: string[];
  } {
    const allStats = this.getAllStats();

    if (allStats.length === 0) {
      return {
        fastest_agent: { agent: 'N/A', avg_time: 0 },
        slowest_agent: { agent: 'N/A', avg_time: 0 },
        highest_quality: { agent: 'N/A', avg_score: 0 },
        most_reliable: { agent: 'N/A', success_rate: 0 },
        recommendations: ['No data available yet']
      };
    }

    const fastest = allStats.reduce((min, s) =>
      s.avg_duration < min.avg_duration ? s : min
    );

    const slowest = allStats.reduce((max, s) =>
      s.avg_duration > max.avg_duration ? s : max
    );

    const highestQuality = allStats.reduce((max, s) =>
      (s.avg_quality_score || 0) > (max.avg_quality_score || 0) ? s : max
    );

    const mostReliable = allStats.reduce((max, s) =>
      s.success_rate > max.success_rate ? s : max
    );

    // Generate recommendations
    const recommendations: string[] = [];

    // Cost optimization
    const modelUsage = this.getModelUsage();
    const haikuUsage = modelUsage['claude-haiku-4-5']?.usage || 0;
    const totalUsage = Object.values(modelUsage).reduce((sum, m) => sum + m.usage, 0);
    const haikuRatio = haikuUsage / totalUsage;

    if (haikuRatio < 0.3) {
      recommendations.push('Consider using Haiku for more discovery tasks (currently < 30%)');
    }

    // Quality issues
    for (const stat of allStats) {
      if (stat.success_rate < 0.85) {
        recommendations.push(`${stat.agent} has low success rate (${(stat.success_rate * 100).toFixed(0)}%). Consider reviewing prompts.`);
      }
      if ((stat.avg_quality_score || 0) < 7) {
        recommendations.push(`${stat.agent} has low quality score (${stat.avg_quality_score?.toFixed(1)}/10). Add more examples.`);
      }
    }

    // Performance issues
    if (slowest.avg_duration > fastest.avg_duration * 3) {
      recommendations.push(`${slowest.agent} is significantly slower than ${fastest.agent}. Consider optimization.`);
    }

    return {
      fastest_agent: { agent: fastest.agent, avg_time: fastest.avg_duration },
      slowest_agent: { agent: slowest.agent, avg_time: slowest.avg_duration },
      highest_quality: { agent: highestQuality.agent, avg_score: highestQuality.avg_quality_score || 0 },
      most_reliable: { agent: mostReliable.agent, success_rate: mostReliable.success_rate },
      recommendations
    };
  }

  /**
   * Generate analytics report
   */
  generateReport(days: number = 30): string {
    const costAnalysis = this.getCostAnalysis(days);
    const performance = this.getPerformanceInsights();
    const topAgents = this.getAllStats().slice(0, 5);

    let report = '# 📊 Agent Analytics Report\n\n';
    report += `**Period:** Last ${days} days\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;

    // Cost Analysis
    report += '## 💰 Cost Analysis\n\n';
    report += `- **Total Cost:** $${costAnalysis.total_cost.toFixed(2)}\n`;
    report += `- **Daily Average:** $${costAnalysis.avg_daily_cost.toFixed(2)}\n`;
    report += `- **Trend:** ${costAnalysis.trend === 'increasing' ? '📈' : costAnalysis.trend === 'decreasing' ? '📉' : '➡️'} ${costAnalysis.trend}\n\n`;

    report += '### By Model\n\n';
    report += '| Model | Usage | Cost | Tokens |\n';
    report += '|------|-------|------|--------|\n';

    const modelUsage = this.getModelUsage();
    for (const [model, stats] of Object.entries(modelUsage)) {
      report += `| ${model} | ${stats.usage} | $${stats.cost.toFixed(2)} | ${stats.tokens.toLocaleString()} |\n`;
    }
    report += '\n';

    // Top Agents
    report += '## 🤖 Top Agents by Usage\n\n';
    report += '| Agent | Tasks | Success | Avg Time | Quality |\n';
    report += '|-------|-------|---------|----------|----------|\n';

    for (const agent of topAgents) {
      report += `| ${agent.agent} | ${agent.tasks_completed} | ${(agent.success_rate * 100).toFixed(0)}% | ${agent.avg_duration.toFixed(1)}s | ${agent.avg_quality_score?.toFixed(1) || 'N/A'}/10 |\n`;
    }
    report += '\n';

    // Performance Insights
    report += '## ⚡ Performance Insights\n\n';
    report += `- **Fastest:** ${performance.fastest_agent.agent} (${performance.fastest_agent.avg_time.toFixed(1)}s avg)\n`;
    report += `- **Slowest:** ${performance.slowest_agent.agent} (${performance.slowest_agent.avg_time.toFixed(1)}s avg)\n`;
    report += `- **Highest Quality:** ${performance.highest_quality.agent} (${performance.highest_quality.avg_score.toFixed(1)}/10)\n`;
    report += `- **Most Reliable:** ${performance.most_reliable.agent} (${(performance.most_reliable.success_rate * 100).toFixed(0)}% success)\n\n';

    // Recommendations
    if (performance.recommendations.length > 0) {
      report += '## 💡 Recommendations\n\n';
      for (const rec of performance.recommendations) {
        report += `- ${rec}\n`;
      }
      report += '\n';
    }

    return report;
  }

  /**
   * Load events from storage
   */
  private async loadEvents(): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    try {
      const files = await fs.readdir(this.config.storage_path);
      const eventFiles = files.filter(f => f.startsWith('events-') && f.endsWith('.json'));

      for (const file of eventFiles) {
        const filePath = path.join(this.config.storage_path, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const events = JSON.parse(content);

        for (const event of events) {
          const validated = AgentEventSchema.parse({
            ...event,
            timestamp: new Date(event.timestamp)
          });
          this.events.push(validated);
        }
      }

      console.log(`Loaded ${this.events.length} events`);
    } catch (error) {
      console.log('No existing events found');
    }
  }

  /**
   * Save events to storage
   */
  private async saveEvents(): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    const today = new Date().toISOString().split('T')[0];
    const filePath = path.join(this.config.storage_path, `events-${today}.json`);

    await fs.mkdir(this.config.storage_path, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(this.events, null, 2));
  }

  /**
   * Calculate statistics from events
   */
  private async calculateStats(): Promise<void> {
    // Group events by agent
    const agentEvents = new Map<string, AgentEvent[]>();
    for (const event of this.events) {
      if (!agentEvents.has(event.agent)) {
        agentEvents.set(event.agent, []);
      }
      agentEvents.get(event.agent)!.push(event);
    }

    // Calculate stats for each agent
    for (const [agent, events] of agentEvents) {
      const tasks_completed = events.length;
      const total_duration = events.reduce((sum, e) => sum + e.duration, 0);
      const avg_duration = total_duration / tasks_completed;

      const successful_events = events.filter(e => e.success);
      const success_rate = successful_events.length / tasks_completed;

      const avg_quality_score = successful_events.reduce((sum, e) =>
        sum + (e.quality_score || 0), 0
      ) / successful_events.length;

      const total_cost = events.reduce((sum, e) => sum + e.cost, 0);
      const avg_cost = total_cost / tasks_completed;

      const total_tokens = events.reduce((sum, e) => sum + e.tokens.total, 0);

      // Extract common patterns (simplified)
      const common_patterns = this.extractPatterns(events);

      // Model usage breakdown
      const model_usage: Record<string, number> = {};
      for (const event of events) {
        model_usage[event.model] = (model_usage[event.model] || 0) + 1;
      }

      this.stats.set(agent, {
        agent,
        tasks_completed,
        avg_duration,
        avg_cost,
        success_rate,
        avg_quality_score,
        total_tokens,
        total_cost,
        last_used: events[events.length - 1].timestamp,
        common_patterns,
        model_usage
      });
    }
  }

  /**
   * Extract common patterns from events
   */
  private extractPatterns(events: AgentEvent[]): string[] {
    // Simplified pattern extraction
    const taskWords = events.map(e => e.task.toLowerCase().split(/\s+/)).flat();
    const wordFreq = new Map<string, number>();

    for (const word of taskWords) {
      if (word.length > 3) { // Skip short words
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    }

    return Array.from(wordFreq.entries())
      .filter(([_, count]) => count >= events.length * 0.3)
      .map(([word, _]) => word)
      .slice(0, 5);
  }

  /**
   * Update stats after new event
   */
  private async updateStats(event: AgentEvent): Promise<void> {
    // Recalculate all stats for simplicity
    await this.calculateStats();
  }

  /**
   * Clean up old events
   */
  async cleanup(): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.config.retention_days);

    const before = this.events.length;
    this.events = this.events.filter(e => e.timestamp >= cutoff);
    const removed = before - this.events.length;

    if (removed > 0) {
      await this.saveEvents();
      await this.calculateStats();
      console.log(`Cleaned up ${removed} old events`);
    }
  }
}

/**
 * Global telemetry instance
 */
export const telemetry = new TelemetryManager();

/**
 * Initialize telemetry
 */
export async function initTelemetry(): Promise<void> {
  await telemetry.initialize();

  // Run cleanup daily
  setInterval(() => telemetry.cleanup(), 24 * 60 * 60 * 1000);
}

/**
 * Quick access functions
 */
export const Telemetry = {
  record: (event: Omit<AgentEvent, 'timestamp'>) =>
    telemetry.recordEvent(event),

  getStats: (agent: string) =>
    telemetry.getAgentStats(agent),

  getAllStats: () =>
    telemetry.getAllStats(),

  getModelUsage: () =>
    telemetry.getModelUsage(),

  getCostAnalysis: (days?: number) =>
    telemetry.getCostAnalysis(days),

  getInsights: () =>
    telemetry.getPerformanceInsights(),

  generateReport: (days?: number) =>
    telemetry.generateReport(days)
};
