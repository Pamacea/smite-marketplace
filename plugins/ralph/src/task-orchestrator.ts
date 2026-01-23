// SMITE Ralph - Task Orchestrator
// Parallel execution engine using Claude Code Task tool

import type { PRD, RalphState, StoryBatch, UserStory, TaskResult } from "./types";
import { DependencyGraph } from "./dependency-graph";
import { StateManager } from "./state-manager";
import { PRDParser } from "./prd-parser";
import { StoryExecutor } from "./services/story-executor.js";
import type { WorkflowOptions } from "./workflow-types";

export interface TaskOrchestratorOptions {
  workflow?: string;
  workflowOptions?: WorkflowOptions;
  mcpEnabled?: boolean;
}

/**
 * Task Orchestrator - Main execution facade
 *
 * Orchestrates the execution of user stories in batches,
 * delegating individual story execution to StoryExecutor.
 */
export class TaskOrchestrator {
  private prd: PRD;
  private dependencyGraph: DependencyGraph;
  private stateManager: StateManager;
  private storyExecutor: StoryExecutor;
  private smiteDir: string;
  private workflowOptions?: TaskOrchestratorOptions;

  private static readonly DEFAULT_MAX_ITERATIONS = Infinity;

  constructor(prd: PRD, smiteDir: string, options?: TaskOrchestratorOptions) {
    this.prd = prd;
    this.smiteDir = smiteDir;
    this.workflowOptions = options;

    this.dependencyGraph = new DependencyGraph(prd);
    this.stateManager = new StateManager(smiteDir);
    this.storyExecutor = new StoryExecutor({
      smiteDir,
      mcpEnabled: options?.mcpEnabled ?? true,
    });
  }

  /**
   * Execute all stories in dependency-optimized batches
   */
  async execute(maxIterations = TaskOrchestrator.DEFAULT_MAX_ITERATIONS): Promise<RalphState> {
    const prdPath = PRDParser.getStandardPRDPath();
    await PRDParser.assertPRDExists();

    const state = await this.stateManager.initialize(maxIterations, prdPath);
    const batches = this.dependencyGraph.generateBatches();

    this.logExecutionStart(batches.length, prdPath);

    for (const batch of batches) {
      if (this.shouldStopExecution(state, maxIterations)) break;
      await this.executeBatch(batch, state);
    }

    await this.finalizeExecution(state, maxIterations);
    return state;
  }

  private logExecutionStart(batchCount: number, prdPath: string): void {
    console.log(`\n🚀 Starting Ralph execution with ${this.prd.userStories.length} stories`);
    console.log(`📄 PRD: ${prdPath}`);
    console.log(`📊 Optimized into ${batchCount} batches (parallel execution)\n`);
  }

  private shouldStopExecution(state: RalphState, maxIterations: number): boolean {
    if (maxIterations === Infinity) {
      const allStoriesCompleted = state.completedStories.length >= this.prd.userStories.length;
      if (allStoriesCompleted) {
        console.log(`\n✅ All ${this.prd.userStories.length} stories completed!`);
        return true;
      }
      return false;
    }

    if (state.currentIteration >= state.maxIterations) {
      const completed = state.completedStories.length;
      const total = this.prd.userStories.length;
      console.log(`\n⚠️  Max iterations (${maxIterations}) reached`);
      console.log(`   Completed: ${completed}/${total} stories`);
      console.log(`   Use --max-iterations=${total} or higher to complete all stories`);
      state.status = "failed";
      return true;
    }

    return false;
  }

  private async executeBatch(batch: StoryBatch, state: RalphState): Promise<void> {
    console.log(`\n📦 Batch ${batch.batchNumber}: ${batch.stories.length} story(ies)`);

    if (batch.canRunInParallel) {
      console.log(`⚡ Running in PARALLEL: ${batch.stories.map((s) => s.id).join(", ")}`);
      await this.executeBatchParallel(batch.stories, state);
    } else {
      const story = batch.stories[0];
      console.log(`📝 Running sequential: ${story.id}`);
      await this.executeStory(story, state);
    }

    state.currentBatch = batch.batchNumber;
    await this.stateManager.save(state);
  }

  private async executeBatchParallel(stories: UserStory[], state: RalphState): Promise<void> {
    console.log(`   → Stories can run in parallel:`);
    const promises = stories.map((story) => this.executeStory(story, state));
    await Promise.all(promises);
  }

  private async executeStory(story: UserStory, state: RalphState): Promise<void> {
    const result = await this.storyExecutor.executeStory(
      story,
      state,
      this.workflowOptions
    );

    await this.processStoryResult(story, state, result);

    state.inProgressStory = null;
    state.currentIteration++;
  }

  private async processStoryResult(
    story: UserStory,
    state: RalphState,
    result: TaskResult
  ): Promise<void> {
    if (result.success) {
      state.completedStories.push(story.id);
      await this.storyExecutor.updateStoryStatus(story, true, result.output);
      console.log("      ✅ PASSED");
      return;
    }

    state.failedStories.push(story.id);
    await this.storyExecutor.updateStoryStatus(story, false, result.error ?? "Unknown error");
    console.log(`      ❌ FAILED: ${result.error}`);
  }

  private async finalizeExecution(state: RalphState, maxIterations: number): Promise<void> {
    if (state.status === "running") {
      state.status = state.failedStories.length === 0 ? "completed" : "failed";
    }

    await this.stateManager.save(state);

    console.log(`\n${state.status === "completed" ? "✅" : "❌"} Ralph execution ${state.status}`);
    console.log(`   Completed: ${state.completedStories.length}/${this.prd.userStories.length}`);
    console.log(`   Failed: ${state.failedStories.length}`);
    console.log(`   Iterations: ${state.currentIteration}/${maxIterations}\n`);
  }

  /**
   * Get execution status
   */
  async getStatus(): Promise<string> {
    const state = await this.stateManager.load();
    if (!state) return "Not started";

    const summary = this.dependencyGraph.getExecutionSummary();

    return `
Ralph Execution Status:
========================
Session: ${state.sessionId}
Status: ${state.status}
Progress: ${state.completedStories.length}/${summary.totalStories} stories
Batch: ${state.currentBatch}/${summary.estimatedBatches}
Iteration: ${state.currentIteration}/${state.maxIterations}

Completed: [${state.completedStories.join(", ") || "None"}]
Failed: [${state.failedStories.join(", ") || "None"}]
In Progress: ${state.inProgressStory || "None"}

Last Activity: ${new Date(state.lastActivity).toISOString()}
    `.trim();
  }
}
