// SMITE Ralph - PRD Validator
// PRD structure and user story validation

import * as path from "path";
import type { PRD, UserStory } from "./types";
import { createValidationError } from "./error-utils";

/**
 * Standard PRD location - SINGLE SOURCE OF TRUTH
 */
export const STANDARD_PRD_PATH = path.join(".claude", ".smite", "prd.json");

/**
 * PRD Validator
 * Validates PRD structure and user stories
 */
export class PRDValidator {
  /**
   * Validate PRD file path - prevent phantom PRD files
   * ONLY allows .claude/.smite/prd.json - everything else is rejected
   */
  static isValidPRDPath(filePath: string): boolean {
    const resolved = path.resolve(filePath);
    const standard = path.resolve(STANDARD_PRD_PATH);

    // Check if it's the standard PRD path
    if (resolved === standard) {
      return true;
    }

    // Check if it's a phantom PRD (prd-*.json, prd-fix.json, etc.)
    const basename = path.basename(filePath);
    if (basename.startsWith('prd') && basename !== 'prd.json') {
      console.error(`❌ REJECTED: Phantom PRD file detected: ${filePath}`);
      console.error(`   Ralph ONLY uses: ${STANDARD_PRD_PATH}`);
      console.error(`   Please delete '${basename}' and use the standard PRD file.`);
      throw new Error(
        `Invalid PRD path: ${basename}. Ralph only supports .claude/.smite/prd.json. ` +
        `Do not create alternate PRD files like prd-fix.json or prd-*.json.`
      );
    }

    return false;
  }

  /**
   * Validate PRD structure with enhanced error messages
   */
  static validate(prd: PRD): void {
    if (!prd.project) {
      throw createValidationError("PRD", "missing project name", {
        details: "The 'project' field is required",
      });
    }
    if (!prd.branchName) {
      throw createValidationError("PRD", "missing branch name", {
        details: "The 'branchName' field is required",
      });
    }
    if (!prd.description) {
      throw createValidationError("PRD", "missing description", {
        details: "The 'description' field is required",
      });
    }
    if (!prd.userStories || !Array.isArray(prd.userStories)) {
      throw createValidationError("PRD", "invalid user stories", {
        details: "The 'userStories' field must be an array",
      });
    }
    if (prd.userStories.length === 0) {
      throw createValidationError("PRD", "no user stories", {
        details: "PRD must have at least one user story",
      });
    }

    // Validate each user story
    prd.userStories.forEach((story, index) => {
      this.validateUserStory(story, index);
    });

    // Validate dependencies exist
    const storyIds = new Set(prd.userStories.map((s) => s.id));
    prd.userStories.forEach((story) => {
      story.dependencies.forEach((dep) => {
        if (!storyIds.has(dep)) {
          throw createValidationError("UserStory", `invalid dependency: ${dep}`, {
            operation: "validateDependencies",
            details: `Story ${story.id} depends on non-existent story ${dep}`,
          });
        }
      });
    });
  }

  /**
   * Validate individual user story
   */
  static validateUserStory(story: UserStory, index: number): void {
    if (!story.id) throw new Error(`Story at index ${index} missing id`);
    if (!story.title) throw new Error(`Story ${story.id} missing title`);
    if (!story.description) throw new Error(`Story ${story.id} missing description`);
    if (!story.acceptanceCriteria || !Array.isArray(story.acceptanceCriteria)) {
      throw new Error(`Story ${story.id} must have acceptanceCriteria array`);
    }
    if (story.acceptanceCriteria.length === 0) {
      throw new Error(`Story ${story.id} must have at least one acceptance criterion`);
    }
    if (typeof story.priority !== "number" || story.priority < 1 || story.priority > 10) {
      throw new Error(`Story ${story.id} must have priority between 1-10`);
    }
    if (!story.agent) throw new Error(`Story ${story.id} must specify an agent`);
    if (!Array.isArray(story.dependencies)) {
      throw new Error(`Story ${story.id} must have dependencies array`);
    }
    if (typeof story.passes !== "boolean") {
      throw new Error(`Story ${story.id} must have passes boolean`);
    }
  }
}
