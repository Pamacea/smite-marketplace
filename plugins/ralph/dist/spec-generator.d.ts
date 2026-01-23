import { UserStory } from "./types";
export interface SpecStep {
    description: string;
    files: string[];
    signatures: string[];
    dependencies: string[];
}
export interface TechnicalSpec {
    storyId: string;
    objective: string;
    approach: string;
    steps: SpecStep[];
    validationCriteria: string[];
    risks: Array<{
        risk: string;
        mitigation: string;
    }>;
    createdAt: number;
}
export interface SpecValidationResult {
    valid: boolean;
    gaps: string[];
    warnings: string[];
}
export declare class SpecGenerator {
    private smiteDir;
    private specsDir;
    constructor(smiteDir: string);
    /**
     * Generate technical specification from user story
     * This extracts the "thinking" phase before any coding begins
     */
    generateSpec(story: UserStory): Promise<TechnicalSpec>;
    /**
     * Write specification to .claude/.smite/current_spec.md
     */
    writeSpec(spec: TechnicalSpec): Promise<string>;
    /**
     * Validate specification for coherence and completeness
     */
    validateSpec(spec: TechnicalSpec): Promise<SpecValidationResult>;
    /**
     * Load current spec if it exists
     */
    loadCurrentSpec(): Promise<TechnicalSpec | null>;
    /**
     * Extract clear objective from user story
     */
    private extractObjective;
    /**
     * Determine technical approach based on story agent and tech
     */
    private determineApproach;
    /**
     * Break down story into implementation steps
     * This is the core "thinking" work that happens before coding
     */
    private breakdownSteps;
    /**
     * Identify potential risks in implementation
     */
    private identifyRisks;
    /**
     * Format specification as markdown
     */
    private formatSpec;
    /**
     * Parse specification from markdown
     */
    private parseSpec;
    /**
     * Ensure required directories exist
     */
    private ensureDirectories;
}
//# sourceMappingURL=spec-generator.d.ts.map