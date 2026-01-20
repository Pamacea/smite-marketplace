import { exec } from "node:child_process";
import { promisify } from "node:util";
const execAsync = promisify(exec);
/**
 * Execute git command with timeout
 */
async function execGit(cmd) {
    try {
        const { stdout } = await execAsync(cmd, {
            timeout: 500, // 500ms timeout
            windowsHide: true,
        });
        return stdout.toString().trim();
    }
    catch {
        return "";
    }
}
/**
 * Get git status information
 */
export async function getGitStatus() {
    const result = {
        branch: null,
        changes: 0,
        staged: 0,
        unstaged: 0,
        isDirty: false,
        additions: 0,
        deletions: 0,
        modifications: 0,
    };
    try {
        // Get branch name with timeout
        const branchOutput = await execGit("git branch --show-current");
        result.branch = branchOutput || null;
        // Get porcelain status with timeout
        const statusOutput = await execGit("git status --porcelain");
        if (statusOutput) {
            const statusLines = statusOutput.split("\n").filter(Boolean);
            for (const line of statusLines) {
                if (!line)
                    continue;
                const index = line[0];
                const workTree = line[1];
                // Count staged changes (first character not space or ?)
                if (index !== " " && index !== "?") {
                    result.staged++;
                }
                // Count unstaged changes (second character not space)
                if (workTree !== " ") {
                    result.unstaged++;
                    result.modifications++;
                }
                result.changes++;
            }
            result.isDirty = result.changes > 0;
        }
        // Get line additions/deletions with numstat (unstaged changes only)
        const diffOutput = await execGit("git diff --numstat");
        if (diffOutput) {
            const lines = diffOutput.split("\n").filter(Boolean);
            for (const line of lines) {
                const parts = line.split("\t");
                if (parts.length >= 2) {
                    const additions = parseInt(parts[0], 10) || 0;
                    const deletions = parseInt(parts[1], 10) || 0;
                    result.additions += additions;
                    result.deletions += deletions;
                }
            }
        }
    }
    catch {
        // Not in git repo or git not available
        return result;
    }
    return result;
}
