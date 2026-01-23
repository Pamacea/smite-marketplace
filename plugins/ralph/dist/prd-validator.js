"use strict";
// SMITE Ralph - PRD Validator
// PRD structure and user story validation
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRDValidator = exports.STANDARD_PRD_PATH = void 0;
const path = __importStar(require("path"));
const error_utils_1 = require("./error-utils");
/**
 * Standard PRD location - SINGLE SOURCE OF TRUTH
 */
exports.STANDARD_PRD_PATH = path.join(".claude", ".smite", "prd.json");
/**
 * PRD Validator
 * Validates PRD structure and user stories
 */
class PRDValidator {
    /**
     * Validate PRD file path - prevent phantom PRD files
     * ONLY allows .claude/.smite/prd.json - everything else is rejected
     */
    static isValidPRDPath(filePath) {
        const resolved = path.resolve(filePath);
        const standard = path.resolve(exports.STANDARD_PRD_PATH);
        // Check if it's the standard PRD path
        if (resolved === standard) {
            return true;
        }
        // Check if it's a phantom PRD (prd-*.json, prd-fix.json, etc.)
        const basename = path.basename(filePath);
        if (basename.startsWith('prd') && basename !== 'prd.json') {
            console.error(`❌ REJECTED: Phantom PRD file detected: ${filePath}`);
            console.error(`   Ralph ONLY uses: ${exports.STANDARD_PRD_PATH}`);
            console.error(`   Please delete '${basename}' and use the standard PRD file.`);
            throw new Error(`Invalid PRD path: ${basename}. Ralph only supports .claude/.smite/prd.json. ` +
                `Do not create alternate PRD files like prd-fix.json or prd-*.json.`);
        }
        return false;
    }
    /**
     * Validate PRD structure with enhanced error messages
     */
    static validate(prd) {
        if (!prd.project) {
            throw (0, error_utils_1.createValidationError)("PRD", "missing project name", {
                details: "The 'project' field is required",
            });
        }
        if (!prd.branchName) {
            throw (0, error_utils_1.createValidationError)("PRD", "missing branch name", {
                details: "The 'branchName' field is required",
            });
        }
        if (!prd.description) {
            throw (0, error_utils_1.createValidationError)("PRD", "missing description", {
                details: "The 'description' field is required",
            });
        }
        if (!prd.userStories || !Array.isArray(prd.userStories)) {
            throw (0, error_utils_1.createValidationError)("PRD", "invalid user stories", {
                details: "The 'userStories' field must be an array",
            });
        }
        if (prd.userStories.length === 0) {
            throw (0, error_utils_1.createValidationError)("PRD", "no user stories", {
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
                    throw (0, error_utils_1.createValidationError)("UserStory", `invalid dependency: ${dep}`, {
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
    static validateUserStory(story, index) {
        if (!story.id)
            throw new Error(`Story at index ${index} missing id`);
        if (!story.title)
            throw new Error(`Story ${story.id} missing title`);
        if (!story.description)
            throw new Error(`Story ${story.id} missing description`);
        if (!story.acceptanceCriteria || !Array.isArray(story.acceptanceCriteria)) {
            throw new Error(`Story ${story.id} must have acceptanceCriteria array`);
        }
        if (story.acceptanceCriteria.length === 0) {
            throw new Error(`Story ${story.id} must have at least one acceptance criterion`);
        }
        if (typeof story.priority !== "number" || story.priority < 1 || story.priority > 10) {
            throw new Error(`Story ${story.id} must have priority between 1-10`);
        }
        if (!story.agent)
            throw new Error(`Story ${story.id} must specify an agent`);
        if (!Array.isArray(story.dependencies)) {
            throw new Error(`Story ${story.id} must have dependencies array`);
        }
        if (typeof story.passes !== "boolean") {
            throw new Error(`Story ${story.id} must have passes boolean`);
        }
    }
}
exports.PRDValidator = PRDValidator;
//# sourceMappingURL=prd-validator.js.map