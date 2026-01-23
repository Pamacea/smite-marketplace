/**
 * Bug Detection API
 *
 * APIs for automated bug detection using pattern matching,
 * static analysis, and heuristics.
 *
 * @module api/bugs
 */
/**
 * Bug severity levels
 */
export declare enum BugSeverity {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Bug category
 */
export declare enum BugCategory {
    SYNTAX = "syntax",
    LOGIC = "logic",
    PERFORMANCE = "performance",
    SECURITY = "security",
    STYLE = "style"
}
/**
 * Bug detection result
 */
export interface BugResult {
    /** Bug ID */
    id: string;
    /** Severity level */
    severity: BugSeverity;
    /** Category */
    category: BugCategory;
    /** Title */
    title: string;
    /** Description */
    description: string;
    /** File where bug was found */
    filePath: string;
    /** Line number */
    lineNumber: number;
    /** Code snippet */
    snippet: string;
    /** Suggested fix */
    suggestedFix?: string;
    /** Confidence (0-1) */
    confidence: number;
}
/**
 * Bug detection options
 */
export interface BugDetectionOptions {
    /** Severity threshold */
    minSeverity?: BugSeverity;
    /** Categories to detect */
    categories?: BugCategory[];
    /** Whether to include suggestions */
    includeSuggestions?: boolean;
    /** Maximum number of bugs to report */
    maxBugs?: number;
}
/**
 * Bug pattern definition
 */
interface BugPattern {
    /** Pattern type */
    type: BugCategory;
    /** Severity */
    severity: BugSeverity;
    /** Title */
    title: string;
    /** Description */
    description: string;
    /** Pattern regex */
    pattern: RegExp;
    /** Suggestion template */
    suggestion?: string;
}
/**
 * Bug Detection API class
 */
export declare class BugDetectionAPI {
    private patterns;
    /**
     * Detect bugs in code
     */
    detectBugs(code: string, filePath?: string, options?: BugDetectionOptions): BugResult[];
    /**
     * Generate bug report
     */
    generateReport(bugs: BugResult[]): string;
    /**
     * Compare severity levels
     */
    private severityCompare;
    /**
     * Group bugs by severity
     */
    private groupBySeverity;
    /**
     * Calculate confidence score for a bug
     */
    private calculateConfidence;
    /**
     * Add custom bug pattern
     */
    addPattern(pattern: BugPattern): void;
    /**
     * Get all patterns
     */
    getPatterns(): BugPattern[];
    /**
     * Clear custom patterns
     */
    clearPatterns(): void;
}
/**
 * Factory function
 */
export declare function createBugDetection(): BugDetectionAPI;
export {};
//# sourceMappingURL=bugs.d.ts.map