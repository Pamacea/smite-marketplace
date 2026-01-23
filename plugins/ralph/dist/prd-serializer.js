"use strict";
// SMITE Ralph - PRD Serializer
// PRD merge and serialization operations
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
exports.PRDSerializer = void 0;
const crypto = __importStar(require("crypto"));
/**
 * PRD Serializer
 * Handles PRD merge, serialization, and hash generation
 */
class PRDSerializer {
    /**
     * Merge new PRD content with existing PRD (preserves completed stories)
     * This is the PREFERRED way to update a PRD.
     *
     * @param existingPrd - The existing PRD from file
     * @param newPrd - The new PRD content to merge
     * @returns Merged PRD
     */
    static merge(existingPrd, newPrd) {
        return {
            project: existingPrd.project, // Keep existing project name
            branchName: existingPrd.branchName, // Keep existing branch
            description: this.mergeDescriptions(existingPrd.description, newPrd.description),
            userStories: this.mergeStories(existingPrd.userStories, newPrd.userStories),
        };
    }
    /**
     * Merge descriptions intelligently
     */
    static mergeDescriptions(existing, newDesc) {
        // If new description is significantly different, append it
        if (existing.toLowerCase() === newDesc.toLowerCase()) {
            return existing;
        }
        // Check if new description is already contained in existing
        if (existing.toLowerCase().includes(newDesc.toLowerCase())) {
            return existing;
        }
        // Append new description
        return `${existing}\n\n${newDesc}`;
    }
    /**
     * Merge story lists, avoiding duplicates by ID
     * Preserves existing stories with their status (passes, notes)
     */
    static mergeStories(existing, newStories) {
        const storyMap = new Map();
        // Add existing stories first (preserves completed status)
        existing.forEach((story) => {
            storyMap.set(story.id, story);
        });
        // Add/update new stories
        newStories.forEach((story) => {
            const existingStory = storyMap.get(story.id);
            if (!existingStory) {
                // New story - add it
                console.log(`   ➕ Adding new story: ${story.id}`);
                storyMap.set(story.id, story);
            }
            else {
                // Story exists - update fields but preserve status
                console.log(`   🔄 Updating existing story: ${story.id}`);
                storyMap.set(story.id, {
                    ...existingStory, // Keep existing passes, notes, status
                    title: story.title,
                    description: story.description,
                    acceptanceCriteria: story.acceptanceCriteria,
                    priority: story.priority,
                    agent: story.agent,
                    dependencies: story.dependencies,
                });
            }
        });
        return Array.from(storyMap.values()).sort((a, b) => {
            // Sort by priority, then by ID
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            return a.id.localeCompare(b.id);
        });
    }
    /**
     * Generate hash for PRD content (for change detection)
     */
    static generateHash(prd) {
        const content = JSON.stringify(prd);
        return crypto.createHash("md5").update(content).digest("hex");
    }
    /**
     * Serialize PRD to JSON string
     */
    static serialize(prd) {
        return JSON.stringify(prd, null, 2);
    }
    /**
     * Deserialize PRD from JSON string
     */
    static deserialize(json) {
        return JSON.parse(json);
    }
}
exports.PRDSerializer = PRDSerializer;
//# sourceMappingURL=prd-serializer.js.map