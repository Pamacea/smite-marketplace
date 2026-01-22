// SMITE Ralph - Workflow Configuration Loader
// Loads and manages workflow definitions

import * as fs from "fs";
import * as path from "path";
import { Workflow, WorkflowOptions, WorkflowStepId } from "./workflow-types";

export interface WorkflowConfig {
  version: string;
  lastUpdated: string;
  workflows: Record<string, Workflow>;
}

export class WorkflowConfigManager {
  private configPath: string;
  private config: WorkflowConfig | null = null;

  constructor(configPath?: string) {
    this.configPath =
      configPath || path.join(__dirname, "..", "config", "workflows.json");
  }

  async load(): Promise<WorkflowConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const configContent = await fs.promises.readFile(this.configPath, "utf-8");
      this.config = JSON.parse(configContent) as WorkflowConfig;
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load workflow config from ${this.configPath}: ${error}`);
    }
  }

  async getWorkflow(workflowId: string): Promise<Workflow | null> {
    const config = await this.load();
    return config.workflows[workflowId] || null;
  }

  async getDefaultWorkflow(): Promise<Workflow> {
    const workflow = await this.getWorkflow("spec-first");
    if (!workflow) {
      throw new Error("Default workflow 'spec-first' not found");
    }
    return workflow;
  }

  async listWorkflows(): Promise<Workflow[]> {
    const config = await this.load();
    return Object.values(config.workflows);
  }

  async getWorkflowSteps(workflowId: string): Promise<WorkflowStepId[]> {
    const workflow = await this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow '${workflowId}' not found`);
    }
    return workflow.steps.map((step) => step.id);
  }

  resolveWorkflowSteps(workflow: Workflow, options: WorkflowOptions): WorkflowStepId[] {
    let steps = workflow.steps.map((s) => s.id);

    if (options.steps && options.steps.length > 0) {
      steps = options.steps;
    } else {
      if (options.from) {
        const fromIndex = steps.indexOf(options.from);
        if (fromIndex >= 0) {
          steps = steps.slice(fromIndex);
        }
      }

      if (options.to) {
        const toIndex = steps.indexOf(options.to);
        if (toIndex >= 0) {
          steps = steps.slice(0, toIndex + 1);
        }
      }

      if (options.skip && options.skip.length > 0) {
        steps = steps.filter((step) => !options.skip!.includes(step));
      }
    }

    return steps;
  }

  validateOptions(workflow: Workflow, options: WorkflowOptions): void {
    if (options.steps) {
      const validSteps = new Set(workflow.steps.map((s) => s.id));
      const invalidSteps = options.steps.filter((s) => !validSteps.has(s));

      if (invalidSteps.length > 0) {
        throw new Error(`Invalid steps: ${invalidSteps.join(", ")}`);
      }
    }

    if (options.from) {
      const validSteps = new Set(workflow.steps.map((s) => s.id));
      if (!validSteps.has(options.from)) {
        throw new Error(`Invalid 'from' step: ${options.from}`);
      }
    }

    if (options.to) {
      const validSteps = new Set(workflow.steps.map((s) => s.id));
      if (!validSteps.has(options.to)) {
        throw new Error(`Invalid 'to' step: ${options.to}`);
      }
    }

    if (options.skip) {
      const validSteps = new Set(workflow.steps.map((s) => s.id));
      const invalidSkip = options.skip.filter((s) => !validSteps.has(s));

      if (invalidSkip.length > 0) {
        throw new Error(`Invalid skip steps: ${invalidSkip.join(", ")}`);
      }
    }
  }
}
