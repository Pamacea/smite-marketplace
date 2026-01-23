import type { PRD, UserStory } from "./types";
/**
 * Standard PRD location - SINGLE SOURCE OF TRUTH
 */
export declare const STANDARD_PRD_PATH: string;
/**
 * PRD Validator
 * Validates PRD structure and user stories
 */
export declare class PRDValidator {
    /**
     * Validate PRD file path - prevent phantom PRD files
     * ONLY allows .claude/.smite/prd.json - everything else is rejected
     */
    static isValidPRDPath(filePath: string): boolean;
    /**
     * Validate PRD structure with enhanced error messages
     */
    static validate(prd: PRD): void;
    /**
     * Validate individual user story
     */
    static validateUserStory(story: UserStory, index: number): void;
}
//# sourceMappingURL=prd-validator.d.ts.map