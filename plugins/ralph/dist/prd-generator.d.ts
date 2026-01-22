import { PRD } from "./types";
export declare class PRDGenerator {
    private static readonly PROJECT_PATTERNS;
    private static readonly ACTION_WORDS;
    private static readonly DEFAULT_STORY_COUNT;
    /**
     * Generate unique story ID based on title and timestamp
     * Same title = same ID (for deduplication)
     * Different title = different ID
     */
    private static generateStoryId;
    static generateFromPrompt(prompt: string, projectName?: string): PRD;
    private static generateBranchName;
    private static extractProjectName;
    private static extractDescription;
    private static titleCase;
    private static generateStories;
    private static detectFeatureStories;
    private static createDefaultStory;
    private static createStory;
    private static extractTechFromAgent;
    static suggestImprovements(prd: PRD): string[];
}
//# sourceMappingURL=prd-generator.d.ts.map