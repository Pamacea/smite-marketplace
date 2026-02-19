/**
 * Agent Team Orchestrator
 *
 * Manages configurable agent teams with specialized roles and coordination.
 *
 * Benefits:
 * - Parallel execution by specialized agents
 * - Peer review and validation
 * - Intelligent task distribution
 * - Conflict resolution
 */

import { z } from 'zod';

export const TeamMemberSchema = z.object({
  name: z.string(),
  agent: z.string(),
  model: z.string(),
  role: z.string(),
  responsibilities: z.array(z.string()),
  tools: z.array(z.string()),
  max_iterations: z.number(),
  is_coordinator: z.boolean().default(false)
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const TeamConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  members: z.array(TeamMemberSchema),
  coordination: z.object({
    type: z.enum(['peer-review', 'hierarchical', 'flat']),
    cycle: z.boolean().default(false),
    parallelism: z.object({
      max_concurrent: z.number(),
      independent_tasks_only: z.boolean()
    }),
    communication: z.object({
      direct_messaging: z.boolean(),
      shared_context: z.boolean(),
      status_updates: z.boolean()
    })
  }),
  workflow: z.object({
    distribution: z.object({
      strategy: z.enum(['specialization-based', 'round-robin', 'load-balanced']),
      fallback_to_coordinator: z.boolean(),
      allow_self_assignment: z.boolean()
    }),
    review: z.object({
      peer_review: z.boolean(),
      coordinator_review: z.boolean(),
      review_threshold: z.number()
    }),
    conflict_resolution: z.object({
      escalate_to_coordinator: z.boolean(),
      voting: z.boolean(),
      coordinator_decides: z.boolean()
    })
  }),
  quality_gates: z.array(z.object({
    gate: z.string(),
    enabled: z.boolean(),
    reviewers: z.array(z.string()),
    criteria: z.array(z.string())
  })),
  rules: z.array(z.string()),
  metrics: z.object({
    track: z.array(z.string()),
    targets: z.record(z.string())
  })
});

export type TeamConfig = z.infer<typeof TeamConfigSchema>;

export interface TaskAssignment {
  id: string;
  assignedTo: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dependencies: string[];
  result?: any;
}

/**
 * Team Orchestrator
 */
export class TeamOrchestrator {
  private teams: Map<string, TeamConfig> = new Map();
  private activeTasks: Map<string, TaskAssignment> = new Map();
  private teamConfigPath: string = '.claude/teams/';

  /**
   * Initialize orchestrator
   */
  async initialize(): Promise<void> {
    await this.loadTeams();
    console.log('✓ Team Orchestrator initialized');
  }

  /**
   * Load all team configurations
   */
  private async loadTeams(): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');

    try {
      const files = await fs.readdir(this.teamConfigPath);
      const teamFiles = files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

      for (const file of teamFiles) {
        const filePath = path.join(this.teamConfigPath, file);
        const content = await fs.readFile(filePath, 'utf-8');

        // Parse YAML (simple implementation)
        const config = this.parseYaml(content);
        const validated = TeamConfigSchema.parse(config);

        this.teams.set(validated.name, validated);
      }

      console.log(`Loaded ${this.teams.size} team configurations`);
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  }

  /**
   * Simple YAML parser (stub - would use yaml library in production)
   */
  private parseYaml(content: string): any {
    // Stub: would use yaml library
    return {};
  }

  /**
   * Get a team configuration
   */
  getTeam(name: string): TeamConfig | undefined {
    return this.teams.get(name);
  }

  /**
   * List all teams
   */
  listTeams(): TeamConfig[] {
    return Array.from(this.teams.values());
  }

  /**
   * Execute a task using a team
   */
  async executeTask(
    teamName: string,
    task: string,
    options?: {
      parallel?: boolean;
      qualityGates?: string[];
    }
  ): Promise<any> {
    const team = this.teams.get(teamName);
    if (!team) {
      throw new Error(`Team not found: ${teamName}`);
    }

    console.log(`🚀 Executing task with team "${teamName}"`);
    console.log(`   Task: ${task}`);

    // Find coordinator
    const coordinator = team.members.find(m => m.is_coordinator);
    if (!coordinator) {
      throw new Error(`Team "${teamName}" has no coordinator`);
    }

    // Plan task distribution
    const assignments = await this.planTaskDistribution(team, task);
    console.log(`📋 Created ${assignments.length} task assignments`);

    // Execute assignments
    const results = options?.parallel
      ? await this.executeParallel(team, assignments)
      : await this.executeSequential(team, assignments);

    // Run quality gates if specified
    if (options?.qualityGates) {
      await this.runQualityGates(team, results, options.qualityGates);
    }

    return {
      results,
      team: teamName,
      task
    };
  }

  /**
   * Plan how to distribute tasks among team members
   */
  private async planTaskDistribution(
    team: TeamConfig,
    task: string
  ): Promise<TaskAssignment[]> {
    const assignments: TaskAssignment[] = [];

    // For each team member, determine responsibilities
    for (const member of team.members) {
      if (member.is_coordinator) continue;

      // Check if task matches member's responsibilities
      const relevant = member.responsibilities.some(resp =>
        task.toLowerCase().includes(resp.toLowerCase())
      );

      if (relevant) {
        assignments.push({
          id: this.generateId(),
          assignedTo: member.name,
          description: `Execute task portion for ${member.role}`,
          status: 'pending',
          dependencies: []
        });
      }
    }

    // Add coordinator oversight task
    const coordinator = team.members.find(m => m.is_coordinator);
    if (coordinator) {
      assignments.push({
        id: this.generateId(),
        assignedTo: coordinator.name,
        description: 'Coordinate and review team work',
        status: 'pending',
        dependencies: assignments.filter(a => a.assignedTo !== coordinator.name).map(a => a.id)
      });
    }

    return assignments;
  }

  /**
   * Execute tasks in parallel
   */
  private async executeParallel(
    team: TeamConfig,
    assignments: TaskAssignment[]
  ): Promise<Map<string, any>> {
    const results = new Map<string, any>();

    // Group independent tasks
    const independentTasks = assignments.filter(a =>
      a.dependencies.length === 0 && !team.members.find(m => m.name === a.assignedTo)?.is_coordinator
    );

    // Execute independent tasks in parallel
    const maxConcurrent = team.coordination.parallelism.max_concurrent;
    const chunks = this.chunkArray(independentTasks, maxConcurrent);

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async assignment => {
        const member = team.members.find(m => m.name === assignment.assignedTo);
        if (!member) return null;

        console.log(`⚡ ${member.name} working...`);
        const result = await this.executeForMember(member, assignment);
        results.set(assignment.id, result);
        return result;
      });

      await Promise.all(chunkPromises);
    }

    // Execute dependent tasks (coordinator review)
    const dependentTasks = assignments.filter(a => a.dependencies.length > 0);
    for (const assignment of dependentTasks) {
      const member = team.members.find(m => m.name === assignment.assignedTo);
      if (!member) continue;

      console.log(`🔍 ${member.name} reviewing...`);
      const result = await this.executeForMember(member, assignment);
      results.set(assignment.id, result);
    }

    return results;
  }

  /**
   * Execute tasks sequentially
   */
  private async executeSequential(
    team: TeamConfig,
    assignments: TaskAssignment[]
  ): Promise<Map<string, any>> {
    const results = new Map<string, any>();

    for (const assignment of assignments) {
      const member = team.members.find(m => m.name === assignment.assignedTo);
      if (!member) continue;

      console.log(`▶️ ${member.name} working...`);
      const result = await this.executeForMember(member, assignment);
      results.set(assignment.id, result);
    }

    return results;
  }

  /**
   * Execute task for a specific team member
   */
  private async executeForMember(
    member: TeamMember,
    assignment: TaskAssignment
  ): Promise<any> {
    // This would spawn a sub-agent with the member's configuration
    // For now, stub implementation
    return {
      member: member.name,
      role: member.role,
      result: `Executed ${assignment.description}`
    };
  }

  /**
   * Run quality gates
   */
  private async runQualityGates(
    team: TeamConfig,
    results: Map<string, any>,
    gateNames: string[]
  ): Promise<void> {
    for (const gateName of gateNames) {
      const gate = team.quality_gates.find(g => g.gate === gateName);
      if (!gate || !gate.enabled) continue;

      console.log(`🚦 Running quality gate: ${gateName}`);

      for (const reviewer of gate.reviewers) {
        const member = team.members.find(m => m.name === reviewer);
        if (!member) continue;

        console.log(`  👤 ${member.role} reviewing...`);
        // Review would happen here
      }
    }
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get team statistics
   */
  getTeamStats(teamName: string) {
    const team = this.teams.get(teamName);
    if (!team) return null;

    return {
      name: team.name,
      memberCount: team.members.length,
      coordinators: team.members.filter(m => m.is_coordinator).length,
      qualityGates: team.quality_gates.filter(g => g.enabled).length,
      parallelism: team.coordination.parallelism.max_concurrent
    };
  }
}

/**
 * Global team orchestrator instance
 */
export const teamOrchestrator = new TeamOrchestrator();

/**
 * Initialize team system
 */
export async function initTeamSystem(): Promise<void> {
  await teamOrchestrator.initialize();
}

/**
 * Quick access functions
 */
export const Team = {
  execute: (teamName: string, task: string, options?: { parallel?: boolean; qualityGates?: string[] }) =>
    teamOrchestrator.executeTask(teamName, task, options),

  list: () =>
    teamOrchestrator.listTeams(),

  get: (name: string) =>
    teamOrchestrator.getTeam(name),

  stats: (name: string) =>
    teamOrchestrator.getTeamStats(name)
};
