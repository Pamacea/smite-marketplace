/**
 * Agent Memory System - Claude-mem Integration
 *
 * Enables agents to learn from their experiences and reuse knowledge across sessions.
 *
 * Benefits:
 * - Agents learn successful patterns
 * - Mistakes are remembered and avoided
 * - Decisions are documented with rationale
 * - Workflows become repeatable
 */

import { z } from 'zod';

// Memory categories
export const MemoryCategory = z.enum([
  'solutions',      // Working code patterns
  'mistakes',       // What NOT to do
  'decisions',      // Tech choices + rationale
  'workflows'       // Repeatable processes
]);

export type MemoryCategory = z.infer<typeof MemoryCategory>;

export interface AgentMemory {
  id: string;
  category: MemoryCategory;
  title: string;
  content: string;
  tags: string[];
  project?: string;
  technology?: string;
  createdAt: Date;
  updatedAt: Date;
  accessCount: number;
  success?: boolean; // For solutions/mistakes
}

export interface MemorySearchOptions {
  query: string;
  category?: MemoryCategory;
  project?: string;
  technology?: string;
  limit?: number;
}

/**
 * Agent Memory Manager
 *
 * Integrates with claude-mem MCP for persistent memory storage
 */
export class AgentMemoryManager {
  private initialized = false;

  /**
   * Initialize memory system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Check if claude-mem MCP is available
    try {
      await this.checkMcpAvailable();
      this.initialized = true;
      console.log('✓ Agent Memory System initialized');
    } catch (error) {
      console.warn('⚠ claude-mem not available, memory disabled');
      console.warn('  Install: npx @modelcontextprotocol/server-memory');
    }
  }

  /**
   * Check if MCP is available
   */
  private async checkMcpAvailable(): Promise<boolean> {
    // This would integrate with actual MCP
    // For now, we'll stub it
    return true;
  }

  /**
   * Save a memory
   */
  async save(memory: Omit<AgentMemory, 'id' | 'createdAt' | 'updatedAt' | 'accessCount'>): Promise<string> {
    if (!this.initialized) {
      throw new Error('Memory system not initialized');
    }

    const newMemory: AgentMemory = {
      ...memory,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0
    };

    // Save to memory store (MCP call)
    await this.saveToMcp(newMemory);

    console.log(`💾 Saved memory: ${newMemory.title} (${newMemory.category})`);
    return newMemory.id;
  }

  /**
   * Search memories
   */
  async search(options: MemorySearchOptions): Promise<AgentMemory[]> {
    if (!this.initialized) {
      return [];
    }

    // Search memory store (MCP call)
    const results = await this.searchMcp(options);

    // Update access counts
    for (const memory of results) {
      await this.incrementAccessCount(memory.id);
    }

    console.log(`🔍 Found ${results.length} memories for "${options.query}"`);
    return results;
  }

  /**
   * Get a specific memory by ID
   */
  async get(id: string): Promise<AgentMemory | null> {
    if (!this.initialized) {
      return null;
    }

    const memory = await this.getFromMcp(id);
    if (memory) {
      await this.incrementAccessCount(id);
    }

    return memory;
  }

  /**
   * Update a memory
   */
  async update(id: string, updates: Partial<Omit<AgentMemory, 'id' | 'createdAt'>>): Promise<void> {
    if (!this.initialized) {
      throw new Error('Memory system not initialized');
    }

    await this.updateInMcp(id, {
      ...updates,
      updatedAt: new Date()
    });

    console.log(`✏️ Updated memory: ${id}`);
  }

  /**
   * Delete a memory
   */
  async delete(id: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Memory system not initialized');
    }

    await this.deleteFromMcp(id);
    console.log(`🗑️ Deleted memory: ${id}`);
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<{
    totalMemories: number;
    byCategory: Record<MemoryCategory, number>;
    mostAccessed: AgentMemory[];
    recentMemories: AgentMemory[];
  }> {
    if (!this.initialized) {
      return {
        totalMemories: 0,
        byCategory: {
          solutions: 0,
          mistakes: 0,
          decisions: 0,
          workflows: 0
        },
        mostAccessed: [],
        recentMemories: []
      };
    }

    return this.getStatsFromMcp();
  }

  /**
   * Auto-save successful implementation
   */
  async saveSuccess(
    title: string,
    implementation: string,
    context: {
      technology: string;
      project?: string;
      tags?: string[];
    }
  ): Promise<string> {
    return this.save({
      category: 'solutions',
      title,
      content: implementation,
      technology: context.technology,
      project: context.project,
      tags: ['success', ...context.tags || []],
      success: true
    });
  }

  /**
   * Auto-save mistake
   */
  async saveMistake(
    title: string,
    mistake: string,
    solution: string,
    context: {
      technology: string;
      project?: string;
      tags?: string[];
    }
  ): Promise<string> {
    const content = `## Mistake\n${mistake}\n\n## Solution\n${solution}`;

    return this.save({
      category: 'mistakes',
      title,
      content,
      technology: context.technology,
      project: context.project,
      tags: ['mistake', ...context.tags || []],
      success: false
    });
  }

  /**
   * Save architectural decision
   */
  async saveDecision(
    title: string,
    decision: string,
    rationale: string,
    alternatives: string[],
    context: {
      technology: string;
      project?: string;
      tags?: string[];
    }
  ): Promise<string> {
    const content = `## Decision\n${decision}\n\n## Rationale\n${rationale}\n\n## Alternatives Considered\n${alternatives.map((alt, i) => `${i + 1}. ${alt}`).join('\n')}`;

    return this.save({
      category: 'decisions',
      title,
      content,
      technology: context.technology,
      project: context.project,
      tags: ['decision', 'architecture', ...context.tags || []]
    });
  }

  /**
   * Save workflow
   */
  async saveWorkflow(
    title: string,
    steps: string[],
    context: {
      technology: string;
      project?: string;
      tags?: string[];
    }
  ): Promise<string> {
    const content = `## Steps\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;

    return this.save({
      category: 'workflows',
      title,
      content,
      technology: context.technology,
      project: context.project,
      tags: ['workflow', ...context.tags || []]
    });
  }

  // MCP integration stubs (to be replaced with actual MCP calls)

  private async saveToMcp(memory: AgentMemory): Promise<void> {
    // TODO: Integrate with claude-mem MCP
    console.log('[MCP] save:', memory);
  }

  private async searchMcp(options: MemorySearchOptions): Promise<AgentMemory[]> {
    // TODO: Integrate with claude-mem MCP
    console.log('[MCP] search:', options);
    return [];
  }

  private async getFromMcp(id: string): Promise<AgentMemory | null> {
    // TODO: Integrate with claude-mem MCP
    console.log('[MCP] get:', id);
    return null;
  }

  private async updateInMcp(id: string, updates: Partial<AgentMemory>): Promise<void> {
    // TODO: Integrate with claude-mem MCP
    console.log('[MCP] update:', id, updates);
  }

  private async deleteFromMcp(id: string): Promise<void> {
    // TODO: Integrate with claude-mem MCP
    console.log('[MCP] delete:', id);
  }

  private async incrementAccessCount(id: string): Promise<void> {
    // TODO: Integrate with claude-mem MCP
    console.log('[MCP] increment:', id);
  }

  private async getStatsFromMcp(): Promise<{
    totalMemories: number;
    byCategory: Record<MemoryCategory, number>;
    mostAccessed: AgentMemory[];
    recentMemories: AgentMemory[];
  }> {
    // TODO: Integrate with claude-mem MCP
    return {
      totalMemories: 0,
      byCategory: {
        solutions: 0,
        mistakes: 0,
        decisions: 0,
        workflows: 0
      },
      mostAccessed: [],
      recentMemories: []
    };
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Global memory manager instance
 */
export const agentMemory = new AgentMemoryManager();

/**
 * Initialize memory system on import
 */
export async function initMemorySystem(): Promise<void> {
  await agentMemory.initialize();
}

/**
 * Quick access functions for common operations
 */
export const Memory = {
  saveSuccess: (title: string, implementation: string, context: { technology: string; project?: string; tags?: string[] }) =>
    agentMemory.saveSuccess(title, implementation, context),

  saveMistake: (title: string, mistake: string, solution: string, context: { technology: string; project?: string; tags?: string[] }) =>
    agentMemory.saveMistake(title, mistake, solution, context),

  saveDecision: (title: string, decision: string, rationale: string, alternatives: string[], context: { technology: string; project?: string; tags?: string[] }) =>
    agentMemory.saveDecision(title, decision, rationale, alternatives, context),

  saveWorkflow: (title: string, steps: string[], context: { technology: string; project?: string; tags?: string[] }) =>
    agentMemory.saveWorkflow(title, steps, context),

  search: (query: string, options?: Partial<MemorySearchOptions>) =>
    agentMemory.search({ query, ...options }),

  get: (id: string) =>
    agentMemory.get(id),

  stats: () =>
    agentMemory.getStats()
};
