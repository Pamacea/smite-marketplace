import { PRD, RalphState } from "./types";
import { WorkflowOptions } from "./workflow-types";
export interface LoopOptions {
    maxIterations?: number;
    completionPromise?: string;
    autoExecute?: boolean;
    workflow?: string;
    workflowOptions?: WorkflowOptions;
    mcpEnabled?: boolean;
}
export interface LoopConfig {
    active: boolean;
    iteration: number;
    max_iterations: number;
    completion_promise: string | null;
    started_at: string;
    prd_path: string;
}
/**
 * Setup Ralph Loop with hook-based auto-iteration (async)
 * IMPORTANT: This MERGES with existing PRD instead of overwriting
 */
export declare function setupRalphLoop(prompt: string, options?: LoopOptions): Promise<{
    success: boolean;
    loopFilePath: string;
    prdPath: string;
    prd?: PRD;
    error?: string;
}>;
/**
 * Read loop configuration from file (async)
 */
export declare function readLoopConfig(loopFilePath?: string): Promise<LoopConfig | null>;
/**
 * Update loop iteration counter (async)
 */
export declare function incrementLoopIteration(loopFilePath?: string): Promise<boolean>;
/**
 * Clear loop file (async)
 */
export declare function clearLoopFile(loopFilePath?: string): Promise<boolean>;
/**
 * Check if output contains completion promise
 */
export declare function checkCompletionPromise(output: string, promise: string): boolean;
/**
 * Setup Ralph Loop AND execute automatically
 * This is the convenience function for: "Check PRD, merge prompt, execute"
 *
 * By default, executes ALL stories (no limit). Use maxIterations to limit.
 */
export declare function setupAndExecuteLoop(prompt: string, options?: LoopOptions & {
    maxIterations?: number;
}): Promise<{
    success: boolean;
    loopFilePath: string;
    prdPath: string;
    state?: RalphState;
    error?: string;
}>;
//# sourceMappingURL=loop-setup.d.ts.map