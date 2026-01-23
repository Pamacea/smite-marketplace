// SMITE Ralph - PRD Parser
// Parse and validate PRD files

import * as fs from "fs";
import * as path from "path";
import type { PRD, UserStory } from "./types";
import { sanitizePath } from "./path-utils";
import { createFileError, createParseError, wrapError } from "./error-utils";
import { PRDCache } from "./prd-parser-cache";
import { PRDValidator, STANDARD_PRD_PATH } from "./prd-validator";
import { PRDSerializer } from "./prd-serializer";

export class PRDParser {
  // Re-export standard path for convenience
  static readonly STANDARD_PRD_PATH = STANDARD_PRD_PATH;

  /**
   * Parse PRD from JSON file (async) with caching and path sanitization
   */
  static async parseFromFile(filePath: string): Promise<PRD> {
    // Sanitize path to prevent traversal attacks
    const fullPath = sanitizePath(filePath, process.cwd());

    // Check cache first (70-90% I/O reduction)
    const cached = PRDCache.get(fullPath);
    if (cached) {
      return cached;
    }

    // SECURITY: Only allow .claude/.smite/prd.json or explicit user intent
    if (!PRDValidator.isValidPRDPath(fullPath)) {
      console.warn(`⚠️  Warning: Non-standard PRD path detected: ${filePath}`);
      console.warn(`   Standard path is: ${STANDARD_PRD_PATH}`);
      console.warn(`   Copying to standard location...`);
    }

    try {
      const content = await fs.promises.readFile(fullPath, "utf-8");
      const prd = this.parseFromString(content);

      // Add to cache
      await PRDCache.set(fullPath, prd);

      return prd;
    } catch (error) {
      throw wrapError(error instanceof Error ? error : new Error(String(error)), `Failed to read PRD file`, {
        operation: "parseFromFile",
        filePath: fullPath,
      });
    }
  }

  /**
   * Parse PRD from JSON string with enhanced error context
   */
  static parseFromString(json: string): PRD {
    try {
      const prd = PRDSerializer.deserialize(json);
      PRDValidator.validate(prd);
      return prd;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw createParseError("<string>", error);
      }
      throw wrapError(error instanceof Error ? error : new Error(String(error)), "Failed to parse PRD", {
        operation: "parseFromString",
        details: "Attempted to parse PRD from JSON string",
      });
    }
  }

  /**
   * Validate PRD structure
   */
  static validate(prd: PRD): void {
    PRDValidator.validate(prd);
  }

  /**
   * Validate individual user story
   */
  static validateUserStory(story: UserStory, index: number): void {
    PRDValidator.validateUserStory(story, index);
  }

  /**
   * Load PRD from .smite directory (async)
   */
  static async loadFromSmiteDir(): Promise<PRD | null> {
    const prdPath = path.join(process.cwd(), STANDARD_PRD_PATH);
    try {
      await fs.promises.access(prdPath, fs.constants.F_OK);
      return await this.parseFromFile(prdPath);
    } catch {
      return null;
    }
  }

  /**
   * Save PRD to .smite directory (ONLY valid location) - async
   * WARNING: This OVERWRITES the existing PRD. Use mergePRD() instead to preserve existing stories.
   */
  static async saveToSmiteDir(prd: PRD): Promise<string> {
    const smiteDir = path.join(process.cwd(), ".claude", ".smite");
    try {
      await fs.promises.mkdir(smiteDir, { recursive: true });
    } catch (error) {
      throw new Error(
        `Failed to create .smite directory: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    const prdPath = path.join(process.cwd(), STANDARD_PRD_PATH);
    try {
      await fs.promises.writeFile(prdPath, PRDSerializer.serialize(prd), "utf-8");

      // Invalidate cache after writing
      PRDCache.invalidate(prdPath);
    } catch (error) {
      throw new Error(
        `Failed to write PRD file at ${prdPath}: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }

    // Clean up any phantom PRD files
    await this.cleanupPhantomPRDs();

    return prdPath;
  }

  /**
   * Merge new PRD content with existing PRD (preserves completed stories) - async
   * This is the PREFERRED way to update a PRD.
   */
  static async mergePRD(newPrd: PRD): Promise<string> {
    const existingPrd = await this.loadFromSmiteDir();

    if (!existingPrd) {
      // No existing PRD, just save the new one
      console.log("📄 Creating new PRD");
      return await this.saveToSmiteDir(newPrd);
    }

    // Merge: Keep existing stories, add new ones, update description
    const mergedPrd = PRDSerializer.merge(existingPrd, newPrd);

    console.log(`🔄 Merging PRDs:`);
    console.log(`   Existing: ${existingPrd.userStories.length} stories`);
    console.log(`   New: ${newPrd.userStories.length} stories`);
    console.log(`   Merged: ${mergedPrd.userStories.length} stories`);

    return await this.saveToSmiteDir(mergedPrd);
  }

  /**
   * Update specific story in PRD (e.g., mark as passed) - async
   */
  static async updateStory(storyId: string, updates: Partial<UserStory>): Promise<boolean> {
    const prd = await this.loadFromSmiteDir();
    if (!prd) return false;

    const storyIndex = prd.userStories.findIndex((s) => s.id === storyId);
    if (storyIndex === -1) return false;

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
  static generateHash(prd: PRD): string {
    return PRDSerializer.generateHash(prd);
  }

  /**
   * Clean up phantom PRD files (prd-*.json, prd-fix.json, etc. in .smite or root) - async
   * This prevents accumulation of unused PRD files
   */
  private static async cleanupPhantomPRDs(): Promise<void> {
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
            } catch (error) {
              console.warn(`   Failed to delete ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          }
        }
      } catch {
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
      } catch {
        // Root directory read failed, skip
      }
    } catch (error) {
      // Non-critical: log but don't fail
      console.warn(
        `Could not cleanup phantom PRDs: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Get the standard PRD path
   */
  static getStandardPRDPath(): string {
    return path.join(process.cwd(), STANDARD_PRD_PATH);
  }

  /**
   * Check if standard PRD exists - async
   */
  static async standardPRDExists(): Promise<boolean> {
    try {
      await fs.promises.access(this.getStandardPRDPath(), fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Assert that PRD exists - throw error if missing (async)
   */
  static async assertPRDExists(message?: string): Promise<void> {
    const exists = await this.standardPRDExists();
    if (!exists) {
      throw new Error(
        message ||
          `PRD not found at ${this.getStandardPRDPath()}. Use '/ralph "<prompt>"' to create one.`
      );
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; keys: string[] } {
    return PRDCache.getStats();
  }

  /**
   * Clear the PRD cache (useful for testing or force reload)
   */
  static clearCache(): void {
    PRDCache.clear();
  }
}
