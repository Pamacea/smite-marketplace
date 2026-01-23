"use strict";
// SMITE Ralph - PRD Parser
// Parse and validate PRD files
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
exports.PRDParser = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const path_utils_1 = require("./path-utils");
const error_utils_1 = require("./error-utils");
const prd_parser_cache_1 = require("./prd-parser-cache");
const prd_validator_1 = require("./prd-validator");
const prd_serializer_1 = require("./prd-serializer");
class PRDParser {
    /**
     * Parse PRD from JSON file (async) with caching and path sanitization
     */
    static async parseFromFile(filePath) {
        // Sanitize path to prevent traversal attacks
        const fullPath = (0, path_utils_1.sanitizePath)(filePath, process.cwd());
        // Check cache first (70-90% I/O reduction)
        const cached = prd_parser_cache_1.PRDCache.get(fullPath);
        if (cached) {
            return cached;
        }
        // SECURITY: Only allow .claude/.smite/prd.json or explicit user intent
        if (!prd_validator_1.PRDValidator.isValidPRDPath(fullPath)) {
            console.warn(`⚠️  Warning: Non-standard PRD path detected: ${filePath}`);
            console.warn(`   Standard path is: ${prd_validator_1.STANDARD_PRD_PATH}`);
            console.warn(`   Copying to standard location...`);
        }
        try {
            const content = await fs.promises.readFile(fullPath, "utf-8");
            const prd = this.parseFromString(content);
            // Add to cache
            await prd_parser_cache_1.PRDCache.set(fullPath, prd);
            return prd;
        }
        catch (error) {
            throw (0, error_utils_1.wrapError)(error instanceof Error ? error : new Error(String(error)), `Failed to read PRD file`, {
                operation: "parseFromFile",
                filePath: fullPath,
            });
        }
    }
    /**
     * Parse PRD from JSON string with enhanced error context
     */
    static parseFromString(json) {
        try {
            const prd = prd_serializer_1.PRDSerializer.deserialize(json);
            prd_validator_1.PRDValidator.validate(prd);
            return prd;
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                throw (0, error_utils_1.createParseError)("<string>", error);
            }
            throw (0, error_utils_1.wrapError)(error instanceof Error ? error : new Error(String(error)), "Failed to parse PRD", {
                operation: "parseFromString",
                details: "Attempted to parse PRD from JSON string",
            });
        }
    }
    /**
     * Validate PRD structure
     */
    static validate(prd) {
        prd_validator_1.PRDValidator.validate(prd);
    }
    /**
     * Validate individual user story
     */
    static validateUserStory(story, index) {
        prd_validator_1.PRDValidator.validateUserStory(story, index);
    }
    /**
     * Load PRD from .smite directory (async)
     */
    static async loadFromSmiteDir() {
        const prdPath = path.join(process.cwd(), prd_validator_1.STANDARD_PRD_PATH);
        try {
            await fs.promises.access(prdPath, fs.constants.F_OK);
            return await this.parseFromFile(prdPath);
        }
        catch {
            return null;
        }
    }
    /**
     * Save PRD to .smite directory (ONLY valid location) - async
     * WARNING: This OVERWRITES the existing PRD. Use mergePRD() instead to preserve existing stories.
     */
    static async saveToSmiteDir(prd) {
        const smiteDir = path.join(process.cwd(), ".claude", ".smite");
        try {
            await fs.promises.mkdir(smiteDir, { recursive: true });
        }
        catch (error) {
            throw new Error(`Failed to create .smite directory: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        const prdPath = path.join(process.cwd(), prd_validator_1.STANDARD_PRD_PATH);
        try {
            await fs.promises.writeFile(prdPath, prd_serializer_1.PRDSerializer.serialize(prd), "utf-8");
            // Invalidate cache after writing
            prd_parser_cache_1.PRDCache.invalidate(prdPath);
        }
        catch (error) {
            throw new Error(`Failed to write PRD file at ${prdPath}: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        // Clean up any phantom PRD files
        await this.cleanupPhantomPRDs();
        return prdPath;
    }
    /**
     * Merge new PRD content with existing PRD (preserves completed stories) - async
     * This is the PREFERRED way to update a PRD.
     */
    static async mergePRD(newPrd) {
        const existingPrd = await this.loadFromSmiteDir();
        if (!existingPrd) {
            // No existing PRD, just save the new one
            console.log("📄 Creating new PRD");
            return await this.saveToSmiteDir(newPrd);
        }
        // Merge: Keep existing stories, add new ones, update description
        const mergedPrd = prd_serializer_1.PRDSerializer.merge(existingPrd, newPrd);
        console.log(`🔄 Merging PRDs:`);
        console.log(`   Existing: ${existingPrd.userStories.length} stories`);
        console.log(`   New: ${newPrd.userStories.length} stories`);
        console.log(`   Merged: ${mergedPrd.userStories.length} stories`);
        return await this.saveToSmiteDir(mergedPrd);
    }
    /**
     * Update specific story in PRD (e.g., mark as passed) - async
     */
    static async updateStory(storyId, updates) {
        const prd = await this.loadFromSmiteDir();
        if (!prd)
            return false;
        const storyIndex = prd.userStories.findIndex((s) => s.id === storyId);
        if (storyIndex === -1)
            return false;
        // Update story
        prd.userStories[storyIndex] = {
            ...prd.userStories[storyIndex],
            ...updates,
        };
        // Save updated PRD
        await this.saveToSmiteDir(prd);
        return true;
    }
    /**
     * Generate hash for PRD content (for change detection)
     */
    static generateHash(prd) {
        return prd_serializer_1.PRDSerializer.generateHash(prd);
    }
    /**
     * Clean up phantom PRD files (prd-*.json, prd-fix.json, etc. in .smite or root) - async
     * This prevents accumulation of unused PRD files
     */
    static async cleanupPhantomPRDs() {
        try {
            const smiteDir = path.join(process.cwd(), ".claude", ".smite");
            const rootDir = process.cwd();
            // Clean .smite directory - delete ALL prd-*.json except prd.json
            try {
                const files = await fs.promises.readdir(smiteDir);
                for (const file of files) {
                    // Match: prd-fix.json, prd-123.json, prd-backup.json, etc.
                    // BUT NOT: prd.json (the standard file)
                    if (file.startsWith('prd') && file.endsWith('.json') && file !== 'prd.json') {
                        const filePath = path.join(smiteDir, file);
                        console.log(`🧹 Cleaning up phantom PRD: ${file}`);
                        try {
                            await fs.promises.unlink(filePath);
                        }
                        catch (error) {
                            console.warn(`   Failed to delete ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                        }
                    }
                }
            }
            catch {
                // .smite directory doesn't exist yet, skip
            }
            // Clean root directory - warn about phantom PRDs
            try {
                const rootFiles = await fs.promises.readdir(rootDir);
                for (const file of rootFiles) {
                    if (file.startsWith('prd') && file.endsWith('.json') && file !== 'prd.json') {
                        console.warn(`⚠️  Warning: Phantom PRD in root: ${file}`);
                        console.warn(`   Ralph ONLY uses: .claude/.smite/prd.json`);
                        console.warn(`   Please delete: ${file}`);
                    }
                }
            }
            catch {
                // Root directory read failed, skip
            }
        }
        catch (error) {
            // Non-critical: log but don't fail
            console.warn(`Could not cleanup phantom PRDs: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    /**
     * Get the standard PRD path
     */
    static getStandardPRDPath() {
        return path.join(process.cwd(), prd_validator_1.STANDARD_PRD_PATH);
    }
    /**
     * Check if standard PRD exists - async
     */
    static async standardPRDExists() {
        try {
            await fs.promises.access(this.getStandardPRDPath(), fs.constants.F_OK);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Assert that PRD exists - throw error if missing (async)
     */
    static async assertPRDExists(message) {
        const exists = await this.standardPRDExists();
        if (!exists) {
            throw new Error(message ||
                `PRD not found at ${this.getStandardPRDPath()}. Use '/ralph "<prompt>"' to create one.`);
        }
    }
    /**
     * Get cache statistics
     */
    static getCacheStats() {
        return prd_parser_cache_1.PRDCache.getStats();
    }
    /**
     * Clear the PRD cache (useful for testing or force reload)
     */
    static clearCache() {
        prd_parser_cache_1.PRDCache.clear();
    }
}
exports.PRDParser = PRDParser;
// Re-export standard path for convenience
PRDParser.STANDARD_PRD_PATH = prd_validator_1.STANDARD_PRD_PATH;
//# sourceMappingURL=prd-parser.js.map