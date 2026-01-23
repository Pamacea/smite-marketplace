/**
 * Refactoring Utilities
 *
 * Utility functions for the refactoring API.
 *
 * @module api/refactor-utils
 */
import type { SourceFile } from 'ts-morph';
import type { Project } from 'ts-morph';
/**
 * Generate diff between two texts
 *
 * @param oldText - Original text
 * @param newText - Modified text
 * @returns Unified diff string
 */
export declare function generateDiff(oldText: string, newText: string): string;
/**
 * Calculate nesting depth of code
 *
 * @param text - Code text to analyze
 * @returns Maximum nesting depth
 */
export declare function calculateNestingDepth(text: string): number;
/**
 * Create backup of file
 *
 * @param filePath - Path to file to backup
 * @returns Path to backup file
 */
export declare function createBackup(filePath: string): Promise<string>;
/**
 * Add source file to project
 *
 * @param project - ts-morph Project instance
 * @param filePath - Path to source file
 * @returns SourceFile or null if loading failed
 */
export declare function addSourceFile(project: Pick<Project, 'addSourceFileAtPath'>, filePath: string): SourceFile | null;
//# sourceMappingURL=refactor-utils.d.ts.map