export type WorkflowStepId = "analyze" | "plan" | "execute" | "review" | "resolve" | "verify" | "complete";
export type MCPTool = "toolkit" | "web-search" | "web-reader" | "vision" | "chrome-devtools";
export interface WorkflowStep {
    id: WorkflowStepId;
    name: string;
    description: string;
    mcpTools?: MCPTool[];
    required: boolean;
    outputs: string[];
    subagent?: string;
}
export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    defaultOptions: WorkflowOptions;
}
export interface WorkflowOptions {
    workflow?: string;
    steps?: WorkflowStepId[];
    from?: WorkflowStepId;
    to?: WorkflowStepId;
    skip?: WorkflowStepId[];
    mcpEnabled?: boolean;
}
export interface WorkflowState {
    workflowId: string;
    currentStep: WorkflowStepId;
    completedSteps: WorkflowStepId[];
    failedSteps: WorkflowStepId[];
    stepResults: Map<WorkflowStepId, WorkflowStepResult>;
    startTime: number;
    lastActivity: number;
}
export interface WorkflowStepResult {
    stepId: WorkflowStepId;
    success: boolean;
    output?: string;
    error?: string;
    duration: number;
    mcpCalls?: string[];
}
export interface WorkflowExecutionContext {
    storyId: string;
    workflow: Workflow;
    state: WorkflowState;
    options: WorkflowOptions;
}
//# sourceMappingURL=workflow-types.d.ts.map