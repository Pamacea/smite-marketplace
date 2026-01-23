export interface GitStatus {
    branch: string | null;
    changes: number;
    staged: number;
    unstaged: number;
    isDirty: boolean;
    additions: number;
    deletions: number;
    modifications: number;
}
/**
 * Get git status information
 */
export declare function getGitStatus(cwd?: string): Promise<GitStatus>;
