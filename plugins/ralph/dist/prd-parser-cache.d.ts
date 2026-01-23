import type { PRD } from "./types";
/**
 * PRD Cache Manager
 * Provides 70-90% reduction in file reads through caching
 */
export declare class PRDCache {
    private static cache;
    static readonly CACHE_TTL_MS = 5000;
    /**
     * Get cached PRD if available and fresh
     */
    static get(filePath: string): PRD | null;
    /**
     * Set PRD in cache
     */
    static set(filePath: string, prd: PRD): Promise<void>;
    /**
     * Invalidate cache entry for a specific file
     */
    static invalidate(filePath: string): void;
    /**
     * Clear all cache entries
     */
    static clear(): void;
    /**
     * Get cache statistics
     */
    static getStats(): {
        size: number;
        keys: string[];
    };
    /**
     * Check if cache has a specific file
     */
    static has(filePath: string): boolean;
}
//# sourceMappingURL=prd-parser-cache.d.ts.map