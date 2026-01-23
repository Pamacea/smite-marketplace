export interface SpecLockState {
    locked: boolean;
    storyId: string;
    gapDescription: string;
    lockedAt: number;
    agent: string;
}
export declare class SpecLock {
    private smiteDir;
    private lockFilePath;
    constructor(smiteDir: string);
    /**
     * Check if spec is currently locked (agent waiting for update)
     */
    isLocked(): Promise<boolean>;
    /**
     * Check if agent should lock (stop execution)
     */
    checkLockCondition(): Promise<boolean>;
    /**
     * Report a logic gap and lock execution
     * Called by agent when it finds a logical inconsistency
     */
    reportGap(storyId: string, agent: string, gapDescription: string): Promise<void>;
    /**
     * Wait for spec update (poll-based)
     * In production, this could use file watching or events
     */
    waitForSpecUpdate(timeoutMs?: number): Promise<boolean>;
    /**
     * Release the lock (spec has been updated)
     * Called by user/orchestrator after fixing the gap
     */
    releaseLock(): Promise<void>;
    /**
     * Get current lock state
     */
    getLockState(): Promise<SpecLockState | null>;
    /**
     * Load lock state from file
     */
    private loadLock;
    /**
     * Save lock state to file
     */
    private saveLock;
    /**
     * Get lock information as formatted string
     */
    getLockInfo(): Promise<string>;
}
//# sourceMappingURL=spec-lock.d.ts.map