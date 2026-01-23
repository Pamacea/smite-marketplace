// SMITE Ralph - PRD Serializer
// PRD merge and serialization operations

import * as crypto from "crypto";
import type { PRD, UserStory } from "./types";

/**
 * PRD Serializer
 * Handles PRD merge, serialization, and hash generation
 */
export class PRDSerializer {
  /**
   * Merge new PRD content with existing PRD (preserves completed stories)
   * This is the PREFERRED way to update a PRD.
   *
   * @param existingPrd - The existing PRD from file
   * @param newPrd - The new PRD content to merge
   * @returns Merged PRD
   */
  static merge(existingPrd: PRD, newPrd: PRD): PRD {
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
  private static mergeDescriptions(existing: string, newDesc: string): string {
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
  private static mergeStories(existing: UserStory[], newStories: UserStory[]): UserStory[] {
    const storyMap = new Map<string, UserStory>();

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
      } else {
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
  static generateHash(prd: PRD): string {
    const content = JSON.stringify(prd);
    return crypto.createHash("md5").update(content).digest("hex");
  }

  /**
   * Serialize PRD to JSON string
   */
  static serialize(prd: PRD): string {
    return JSON.stringify(prd, null, 2);
  }

  /**
   * Deserialize PRD from JSON string
   */
  static deserialize(json: string): PRD {
    return JSON.parse(json) as PRD;
  }
}
