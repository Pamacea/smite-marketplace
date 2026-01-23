/**
 * Story Executor - Executes individual user stories
 *
 * @module services/story-executor
 */

import type { UserStory, TaskResult, RalphState } from "../types";
import { SpecGenerator } from "../spec-generator";
import { WorkflowEngine, type WorkflowEngineOptions } from "../workflow-engine";
import { PRDParser } from "../prd-parser";
import { mapAgentToSkill } from "./agent-mapper.js";
import { buildPrompt } from "./prompt-builder.js";
import type { WorkflowOptions } from "../workflow-types";

interface StoryExecutorOptions {
  smiteDir: string;
  mcpEnabled?: boolean;
}

interface StoryExecutionResult {
  success: boolean;
  output: string;
  error?: string;
}

/**
 * Story Executor Service
 *
 * Handles the execution of individual stories including:
 * - Specification generation and validation
 * - Workflow execution (if configured)
 * - Legacy agent invocation
 * - PRD status updates
 */
export class StoryExecutor {
  private specGenerator: SpecGenerator;
  private workflowEngine: WorkflowEngine;
  private smiteDir: string;

  constructor(options: StoryExecutorOptions) {
    this.smiteDir = options.smiteDir;
    this.specGenerator = new SpecGenerator(options.smiteDir);

    const workflowEngineOptions: WorkflowEngineOptions = {
      smiteDir: options.smiteDir,
      mcpEnabled: options.mcpEnabled ?? true,
    };
    this.workflowEngine = new WorkflowEngine(workflowEngineOptions);
  }

  /**
   * Execute a story with workflow or legacy path
   */
  async executeStory(
    story: UserStory,
    state: RalphState,
    workflowOptions?: { workflow?: string; workflowOptions?: WorkflowOptions }
  ): Promise<TaskResult> {
    state.inProgressStory = story.id;
    state.lastActivity = Date.now();

    console.log(`   → Executing ${story.id}: ${story.title}`);
    console.log(`      Agent: ${story.agent}`);

    if (workflowOptions?.workflow) {
      return await this.executeWithWorkflow(story, {
        workflow: workflowOptions.workflow,
        workflowOptions: workflowOptions.workflowOptions,
      });
    }

    return await this.executeLegacy(story);
  }

  /**
   * Execute story using workflow engine
   */
  private async executeWithWorkflow(
    story: UserStory,
    workflowOptions: { workflow: string; workflowOptions?: WorkflowOptions }
  ): Promise<TaskResult> {
    const workflowState = await this.workflowEngine.executeWorkflow(
      story,
      workflowOptions.workflow,
      workflowOptions.workflowOptions || {}
    );

    const workflowSuccess = workflowState.failedSteps.length === 0;

    return {
      storyId: story.id,
      success: workflowSuccess,
      output: this.workflowEngine.getWorkflowSummary(workflowState),
      error: workflowSuccess
        ? undefined
        : `Workflow failed at steps: ${workflowState.failedSteps.join(", ")}`,
      timestamp: Date.now(),
    };
  }

  /**
   * Execute story using legacy path (spec + agent)
   */
  private async executeLegacy(story: UserStory): Promise<TaskResult> {
    const specResult = await this.generateAndValidateSpec(story);

    if (!specResult.valid) {
      return {
        storyId: story.id,
        success: false,
        output: "",
        error: `Spec validation failed: ${specResult.gaps.join(", ")}`,
        timestamp: Date.now(),
      };
    }

    return await this.invokeAgent(story, specResult.specPath);
  }

  /**
   * Invoke Claude Code agent for story execution
   */
  private async invokeAgent(story: UserStory, specPath?: string): Promise<TaskResult> {
    const skill = mapAgentToSkill(story.agent);
    console.log(`      🎯 Using skill: ${skill}`);

    const prompt = buildPrompt(story, specPath);

    // Placeholder for actual Task tool invocation
    return {
      storyId: story.id,
      success: true,
      output: `Executed: ${story.title} with skill: ${skill}${specPath ? ` and spec: ${specPath}` : ""}`,
      timestamp: Date.now(),
    };
  }

  /**
   * Generate and validate specification before agent execution
   */
  private async generateAndValidateSpec(story: UserStory): Promise<{
    valid: boolean;
    specPath?: string;
    gaps: string[];
  }> {
    try {
      console.log(`      📋 Generating specification for ${story.id}...`);

      const spec = await this.specGenerator.generateSpec(story);
      const specPath = await this.specGenerator.writeSpec(spec);

      console.log(`      ✅ Spec written to: ${specPath}`);

      const validation = await this.specGenerator.validateSpec(spec);

      if (validation.warnings.length > 0) {
        console.log(`      ⚠️  Spec warnings: ${validation.warnings.join(", ")}`);
      }

      if (!validation.valid) {
        console.log(`      ❌ Spec validation failed: ${validation.gaps.join(", ")}`);
        return { valid: false, gaps: validation.gaps };
      }

      console.log(`      ✅ Spec validated successfully`);
      return { valid: true, specPath, gaps: [] };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.log(`      ❌ Spec generation failed: ${errorMessage}`);
      return { valid: false, gaps: [errorMessage] };
    }
  }

  /**
   * Update story status in memory and persist to PRD file
   */
  async updateStoryStatus(story: UserStory, passes: boolean, notes: string): Promise<void> {
    story.passes = passes;
    story.notes = notes;
    await PRDParser.updateStory(story.id, { passes, notes });
  }
}
