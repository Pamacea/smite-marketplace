import { WorkflowOptions, WorkflowState } from "./workflow-types";
import { UserStory } from "./types";
export interface WorkflowEngineOptions {
    smiteDir: string;
    mcpEnabled?: boolean;
}
export declare class WorkflowEngine {
    private configManager;
    private specGenerator;
    private smiteDir;
    private mcpEnabled;
    constructor(options: WorkflowEngineOptions);
    executeWorkflow(story: UserStory, workflowId: string, options?: WorkflowOptions): Promise<WorkflowState>;
    private initializeWorkflowState;
    private executeStep;
    private executeAnalyzeStep;
    private executePlanStep;
    private executeExecuteStep;
    private executeReviewStep;
    private executeResolveStep;
    private executeVerifyStep;
    private executeCompleteStep;
    private mapAgentToSkill;
    getWorkflowSummary(state: WorkflowState): string;
}
//# sourceMappingURL=workflow-engine.d.ts.map