/**
 * Refactoring API
 *
 * APIs for automated refactoring including code simplification,
 * dead code elimination, and structure optimization.
 *
 * @module api/refactor
 */
import { type SourceFile } from 'ts-morph';
import { type RefactorResult, type RefactorOptions, type ComplexityMetrics } from './refactor-types';
/**
 * Refactoring API class
 */
export declare class RefactoringAPI {
    private project;
    constructor();
    /**
     * Simplify code
     */
    simplifyCode(filePath: string, options?: RefactorOptions): Promise<RefactorResult>;
    /**
     * Remove dead code
     */
    removeDeadCode(filePath: string, options?: RefactorOptions): Promise<RefactorResult>;
    /**
     * Optimize code structure
     */
    optimizeStructure(filePath: string, options?: RefactorOptions): Promise<RefactorResult>;
    /**
     * Calculate code complexity
     */
    calculateComplexity(sourceFile: SourceFile): ComplexityMetrics;
}
/**
 * Factory function
 */
export declare function createRefactoring(): RefactoringAPI;
export * from './refactor-types';
//# sourceMappingURL=refactor.d.ts.map