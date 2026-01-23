import type { PRD } from "./types";
/**
 * PRD Serializer
 * Handles PRD merge, serialization, and hash generation
 */
export declare class PRDSerializer {
    /**
     * Merge new PRD content with existing PRD (preserves completed stories)
     * This is the PREFERRED way to update a PRD.
     *
     * @param existingPrd - The existing PRD from file
     * @param newPrd - The new PRD content to merge
     * @returns Merged PRD
     */
    static merge(existingPrd: PRD, newPrd: PRD): PRD;
    /**
     * Merge descriptions intelligently
     */
    private static mergeDescriptions;
    /**
     * Merge story lists, avoiding duplicates by ID
     * Preserves existing stories with their status (passes, notes)
     */
    private static mergeStories;
    /**
     * Generate hash for PRD content (for change detection)
     */
    static generateHash(prd: PRD): string;
    /**
     * Serialize PRD to JSON string
     */
    static serialize(prd: PRD): string;
    /**
     * Deserialize PRD from JSON string
     */
    static deserialize(json: string): PRD;
}
//# sourceMappingURL=prd-serializer.d.ts.map