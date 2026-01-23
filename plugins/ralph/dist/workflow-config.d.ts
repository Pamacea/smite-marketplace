import { Workflow, WorkflowOptions, WorkflowStepId } from "./workflow-types";
export interface WorkflowConfig {
    version: string;
    lastUpdated: string;
    workflows: Record<string, Workflow>;
}
export declare class WorkflowConfigManager {
    private configPath;
    private config;
    constructor(configPath?: string);
    load(): Promise<WorkflowConfig>;
    getWorkflow(workflowId: string): Promise<Workflow | null>;
    getDefaultWorkflow(): Promise<Workflow>;
    listWorkflows(): Promise<Workflow[]>;
    getWorkflowSteps(workflowId: string): Promise<WorkflowStepId[]>;
    resolveWorkflowSteps(workflow: Workflow, options: WorkflowOptions): WorkflowStepId[];
    validateOptions(workflow: Workflow, options: WorkflowOptions): void;
}
//# sourceMappingURL=workflow-config.d.ts.map