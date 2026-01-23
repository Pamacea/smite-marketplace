/**
 * Refactoring Operations
 *
 * Individual refactoring operations that can be applied to source files.
 *
 * @module api/refactor-operations
 */
import { SourceFile } from 'ts-morph';
/**
 * Simplify expressions
 * Note: Not yet implemented - would use ts-morph to simplify complex expressions
 *
 * @param sourceFile - Source file to process
 * @returns Number of changes made
 */
export declare function simplifyExpressions(sourceFile: SourceFile): number;
/**
 * Remove unnecessary braces
 * Note: Not yet implemented - would identify single-statement blocks
 *
 * @param sourceFile - Source file to process
 * @returns Number of changes made
 */
export declare function removeUnnecessaryBraces(sourceFile: SourceFile): number;
/**
 * Simplify conditionals
 * Note: Not yet implemented - would simplify complex boolean expressions
 *
 * @param sourceFile - Source file to process
 * @returns Number of changes made
 */
export declare function simplifyConditionals(sourceFile: SourceFile): number;
/**
 * Remove unused imports
 *
 * @param sourceFile - Source file to process
 * @returns Number of imports removed
 */
export declare function removeUnusedImports(sourceFile: SourceFile): number;
/**
 * Remove unused variables
 * Note: Not yet implemented - would identify variables declared but never used
 *
 * @param sourceFile - Source file to process
 * @returns Number of variables removed
 */
export declare function removeUnusedVariables(sourceFile: SourceFile): number;
/**
 * Remove unreachable code
 * Note: Not yet implemented - would identify code after return statements
 *
 * @param sourceFile - Source file to process
 * @returns Number of statements removed
 */
export declare function removeUnreachableCode(sourceFile: SourceFile): number;
/**
 * Organize imports
 * Note: Not yet implemented - would group and sort imports
 *
 * @param sourceFile - Source file to process
 * @returns Number of imports reorganized
 */
export declare function organizeImports(sourceFile: SourceFile): number;
/**
 * Sort class members
 * Note: Not yet implemented - would sort members by visibility and type
 *
 * @param sourceFile - Source file to process
 * @returns Number of members sorted
 */
export declare function sortClassMembers(sourceFile: SourceFile): number;
/**
 * Extract magic numbers to constants
 * Note: Not yet implemented - would identify and extract magic numbers
 *
 * @param sourceFile - Source file to process
 * @returns Number of constants extracted
 */
export declare function extractConstants(sourceFile: SourceFile): number;
//# sourceMappingURL=refactor-operations.d.ts.map