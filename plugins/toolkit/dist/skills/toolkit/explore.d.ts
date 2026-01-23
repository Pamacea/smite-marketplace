/**
 * SMITE Toolkit - Explore Skill
 *
 * Specialized explore command using index.json and deps.json
 * Built for fast codebase exploration with minimal token usage
 */
/**
 * Find function in codebase
 */
export declare function findFunction(targetFunction: string): boolean;
/**
 * Find component in codebase
 */
export declare function findComponent(targetComponent: string): boolean;
/**
 * Analyze impacts of changes
 */
export declare function analyzeImpacts(targetPath: string): boolean;
/**
 * Map architecture
 */
export declare function mapArchitecture(): boolean;
/**
 * Find bugs
 */
export declare function findBugs(target: string): boolean;
/**
 * Main explore function
 */
export declare function explore(task: string, target?: string): boolean;
//# sourceMappingURL=explore.d.ts.map