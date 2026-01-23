/**
 * SMITE Toolkit - Graph Skill
 *
 * Specialized dependency graph command that reads from deps.json
 * Built for fast dependency analysis and impact assessment
 */
/**
 * Main graph function
 */
export declare function graph(targetPath?: string, options?: {
    impact?: boolean;
    view?: 'tree' | 'json';
}): boolean;
/**
 * Graph with JSON output
 */
export declare function graphJSON(targetPath?: string, options?: {
    impact?: boolean;
}): {
    error: string;
    target?: undefined;
    affectedFiles?: undefined;
    breakingChanges?: undefined;
    nodes?: undefined;
    edges?: undefined;
    issues?: undefined;
} | {
    target: string;
    affectedFiles: {
        file: string;
        risk: "HIGH";
        reason: string;
    }[];
    breakingChanges: number;
    error?: undefined;
    nodes?: undefined;
    edges?: undefined;
    issues?: undefined;
} | {
    target: string;
    nodes: number;
    edges: number;
    issues: {
        circularDeps: string[][];
        deadCode: Array<{
            file: string;
            export: string;
        }>;
    };
    error?: undefined;
    affectedFiles?: undefined;
    breakingChanges?: undefined;
};
//# sourceMappingURL=graph.d.ts.map