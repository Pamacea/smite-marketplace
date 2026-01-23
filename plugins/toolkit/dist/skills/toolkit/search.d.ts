/**
 * SMITE Toolkit - Search Skill
 *
 * Specialized search command that reads from index.json
 * Built for 60-87% token savings via pre-built chunks
 */
/**
 * Main search function
 */
export declare function search(query: string, options?: {
    maxResults?: number;
}): boolean;
/**
 * Search with JSON output
 */
export declare function searchJSON(query: string, options?: {
    maxResults?: number;
}): {
    error: string;
    query?: undefined;
    results?: undefined;
    count?: undefined;
} | {
    query: string;
    results: {
        file: string;
        lines: string;
        score: number;
        preview: string;
    }[];
    count: number;
    error?: undefined;
};
//# sourceMappingURL=search.d.ts.map