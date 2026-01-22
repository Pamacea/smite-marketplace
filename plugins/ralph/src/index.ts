// SMITE Ralph - Main Entry Point
// Multi-agent orchestrator with parallel execution

export { PRDParser } from "./prd-parser";
export { DependencyGraph } from "./dependency-graph";
export { TaskOrchestrator } from "./task-orchestrator";
export { StateManager } from "./state-manager";
export { PRDGenerator } from "./prd-generator";
export { SpecGenerator } from "./spec-generator";
export { SpecLock } from "./spec-lock";
export * from "./path-utils";
export * from "./logger";
export {
  setupRalphLoop,
  setupAndExecuteLoop,
  readLoopConfig,
  incrementLoopIteration,
  clearLoopFile,
  checkCompletionPromise,
} from "./loop-setup";
export * from "./types";

// Workflow system exports
export { WorkflowEngine, WorkflowEngineOptions } from "./workflow-engine";
export { WorkflowConfigManager, WorkflowConfig } from "./workflow-config";
export * from "./workflow-types";

// Re-export for convenience
import { PRDParser } from "./prd-parser";
import { PRDGenerator } from "./prd-generator";
import { TaskOrchestrator, TaskOrchestratorOptions } from "./task-orchestrator";
import { WorkflowOptions } from "./workflow-types";
import * as path from "path";
import * as fs from "fs";

export interface RalphExecuteOptions {
  maxIterations?: number;
  workflow?: string;
  workflowOptions?: WorkflowOptions;
  mcpEnabled?: boolean;
}

/**
 * Quick start: Execute Ralph from a prompt
 * IMPORTANT: This MERGES with existing PRD instead of overwriting
 *
 * By default, executes ALL stories (no limit). Use maxIterations to limit.
 */
export async function execute(prompt: string, options?: RalphExecuteOptions) {
  try {
    const smiteDir = path.join(process.cwd(), ".claude", ".smite");

    // Generate PRD from prompt
    const newPrd = PRDGenerator.generateFromPrompt(prompt);

    // Merge with existing PRD (preserves completed stories)
    const prdPath = await PRDParser.mergePRD(newPrd);

    // Load merged PRD for execution
    const mergedPrd = await PRDParser.loadFromSmiteDir();
    if (!mergedPrd) {
      throw new Error("Failed to load merged PRD");
    }

    console.log(`\n✅ PRD ready at: ${prdPath}`);
    console.log(`📊 Stories: ${mergedPrd.userStories.length} total`);

    if (options?.workflow) {
      console.log(`🔄 Using workflow: ${options.workflow}`);
    }

    // Execute (no limit by default - completes all stories)
    const orchestratorOptions: TaskOrchestratorOptions = {
      workflow: options?.workflow,
      workflowOptions: options?.workflowOptions,
      mcpEnabled: options?.mcpEnabled ?? true,
    };

    const orchestrator = new TaskOrchestrator(mergedPrd, smiteDir, orchestratorOptions);
    const maxIterations = options?.maxIterations ?? Infinity; // Default: unlimited

    if (maxIterations !== Infinity) {
      console.log(`⚠️  Limited to ${maxIterations} stories`);
    }

    return await orchestrator.execute(maxIterations);
  } catch (error) {
    console.error("❌ Ralph execution failed:", error);
    throw error; // Re-throw for caller to handle
  }
}

/**
 * Execute Ralph from existing PRD file
 */
export async function executeFromPRD(prdPath: string, options?: RalphExecuteOptions) {
  const smiteDir = path.join(process.cwd(), ".claude", ".smite");

  // Validate PRD exists
  try {
    await fs.promises.access(prdPath, fs.constants.F_OK);
  } catch {
    throw new Error(`PRD file not found: ${prdPath}`);
  }

  // Load PRD
  const prd = await PRDParser.parseFromFile(prdPath);

  // Merge with existing PRD at standard location (preserves completed stories)
  const standardPath = await PRDParser.mergePRD(prd);

  console.log(`\n✅ PRD merged to standard location: ${standardPath}`);

  // Load merged PRD for execution
  const mergedPrd = await PRDParser.loadFromSmiteDir();
  if (!mergedPrd) {
    throw new Error("Failed to load merged PRD");
  }

  console.log(`📊 Stories: ${mergedPrd.userStories.length} total`);

  if (options?.workflow) {
    console.log(`🔄 Using workflow: ${options.workflow}`);
  }

  // Execute (no limit by default)
  const orchestratorOptions: TaskOrchestratorOptions = {
    workflow: options?.workflow,
    workflowOptions: options?.workflowOptions,
    mcpEnabled: options?.mcpEnabled ?? true,
  };

  const orchestrator = new TaskOrchestrator(mergedPrd, smiteDir, orchestratorOptions);
  const maxIterations = options?.maxIterations ?? Infinity; // Default: unlimited

  if (maxIterations !== Infinity) {
    console.log(`⚠️  Limited to ${maxIterations} stories`);
  }

  return await orchestrator.execute(maxIterations);
}
