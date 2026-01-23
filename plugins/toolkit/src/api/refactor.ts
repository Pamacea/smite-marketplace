/**
 * Refactoring API
 *
 * APIs for automated refactoring including code simplification,
 * dead code elimination, and structure optimization.
 *
 * @module api/refactor
 */

import { Project, type SourceFile } from 'ts-morph';
import { refactorError } from '../core/utils/error-handler';
import {
  RefactorType,
  type RefactorResult,
  type RefactorOptions,
  type ComplexityMetrics,
} from './refactor-types';
import {
  generateDiff,
  calculateNestingDepth,
  createBackup,
  addSourceFile,
} from './refactor-utils';
import {
  simplifyExpressions,
  removeUnnecessaryBraces,
  simplifyConditionals,
  removeUnusedImports,
  removeUnusedVariables,
  removeUnreachableCode,
  organizeImports,
  sortClassMembers,
  extractConstants,
} from './refactor-operations';

/**
 * Refactoring API class
 */
export class RefactoringAPI {
  private project: Project;

  constructor() {
    this.project = new Project({
      skipFileDependencyResolution: true,
      compilerOptions: {
        allowJs: true,
      },
    });
  }

  /**
   * Simplify code
   */
  async simplifyCode(
    filePath: string,
    options?: RefactorOptions
  ): Promise<RefactorResult> {
    try {
      const dryRun = options?.dryRun ?? false;

      // Load source file
      const sourceFile = addSourceFile(this.project, filePath);
      if (!sourceFile) {
        return {
          type: RefactorType.SIMPLIFY,
          modifiedFiles: [],
          changeCount: 0,
          success: false,
          error: 'Failed to load source file',
        };
      }

      // Create backup if needed
      let backupPath: string | undefined;
      if (options?.createBackup && !dryRun) {
        backupPath = await createBackup(filePath);
      }

      const oldText = sourceFile.getFullText();
      let changeCount = 0;

      // Simplify complex expressions
      changeCount += simplifyExpressions(sourceFile);

      // Remove unnecessary braces
      changeCount += removeUnnecessaryBraces(sourceFile);

      // Simplify conditionals
      changeCount += simplifyConditionals(sourceFile);

      const newText = sourceFile.getFullText();

      // Generate diff
      const diff = generateDiff(oldText, newText);

      // Apply changes if not dry run
      if (!dryRun && changeCount > 0) {
        if (options?.applyChanges !== false) {
          sourceFile.saveSync();
        }
      }

      return {
        type: RefactorType.SIMPLIFY,
        modifiedFiles: changeCount > 0 ? [filePath] : [],
        changeCount,
        success: true,
        diff,
        backupPath,
      };
    } catch (err) {
      return refactorError(RefactorType.SIMPLIFY, err);
    }
  }

  /**
   * Remove dead code
   */
  async removeDeadCode(
    filePath: string,
    options?: RefactorOptions
  ): Promise<RefactorResult> {
    try {
      const dryRun = options?.dryRun ?? false;

      // Load source file
      const sourceFile = addSourceFile(this.project, filePath);
      if (!sourceFile) {
        return {
          type: RefactorType.REMOVE_DEAD_CODE,
          modifiedFiles: [],
          changeCount: 0,
          success: false,
          error: 'Failed to load source file',
        };
      }

      // Create backup if needed
      let backupPath: string | undefined;
      if (options?.createBackup && !dryRun) {
        backupPath = await createBackup(filePath);
      }

      const oldText = sourceFile.getFullText();
      let changeCount = 0;

      // Remove unused imports
      changeCount += removeUnusedImports(sourceFile);

      // Remove unused variables
      changeCount += removeUnusedVariables(sourceFile);

      // Remove unreachable code
      changeCount += removeUnreachableCode(sourceFile);

      const newText = sourceFile.getFullText();

      // Generate diff
      const diff = generateDiff(oldText, newText);

      // Apply changes if not dry run
      if (!dryRun && changeCount > 0) {
        if (options?.applyChanges !== false) {
          sourceFile.saveSync();
        }
      }

      return {
        type: RefactorType.REMOVE_DEAD_CODE,
        modifiedFiles: changeCount > 0 ? [filePath] : [],
        changeCount,
        success: true,
        diff,
        backupPath,
      };
    } catch (err) {
      return refactorError(RefactorType.REMOVE_DEAD_CODE, err);
    }
  }

  /**
   * Optimize code structure
   */
  async optimizeStructure(
    filePath: string,
    options?: RefactorOptions
  ): Promise<RefactorResult> {
    try {
      const dryRun = options?.dryRun ?? false;

      // Load source file
      const sourceFile = addSourceFile(this.project, filePath);
      if (!sourceFile) {
        return {
          type: RefactorType.OPTIMIZE_STRUCTURE,
          modifiedFiles: [],
          changeCount: 0,
          success: false,
          error: 'Failed to load source file',
        };
      }

      // Create backup if needed
      let backupPath: string | undefined;
      if (options?.createBackup && !dryRun) {
        backupPath = await createBackup(filePath);
      }

      const oldText = sourceFile.getFullText();
      let changeCount = 0;

      // Reorganize imports
      changeCount += organizeImports(sourceFile);

      // Sort class members
      changeCount += sortClassMembers(sourceFile);

      // Extract magic numbers to constants
      changeCount += extractConstants(sourceFile);

      const newText = sourceFile.getFullText();

      // Generate diff
      const diff = generateDiff(oldText, newText);

      // Apply changes if not dry run
      if (!dryRun && changeCount > 0) {
        if (options?.applyChanges !== false) {
          sourceFile.saveSync();
        }
      }

      return {
        type: RefactorType.OPTIMIZE_STRUCTURE,
        modifiedFiles: changeCount > 0 ? [filePath] : [],
        changeCount,
        success: true,
        diff,
        backupPath,
      };
    } catch (err) {
      return refactorError(RefactorType.OPTIMIZE_STRUCTURE, err);
    }
  }

  /**
   * Calculate code complexity
   */
  calculateComplexity(sourceFile: SourceFile): ComplexityMetrics {
    const functions = sourceFile.getFunctions();

    let totalCyclomatic = 0;
    let maxNestingDepth = 0;
    let maxFunctionLength = 0;
    let maxParameterCount = 0;

    for (const func of functions) {
      // Cyclomatic complexity (simplified)
      const body = func.getBody()?.getText() || '';
      const decisions = (body.match(/if|for|while|case|catch/g) || []).length;
      totalCyclomatic += decisions + 1;

      // Nesting depth
      const maxDepth = calculateNestingDepth(body);
      maxNestingDepth = Math.max(maxNestingDepth, maxDepth);

      // Function length
      const lines = body.split('\n').length;
      maxFunctionLength = Math.max(maxFunctionLength, lines);

      // Parameter count
      const params = func.getParameters().length;
      maxParameterCount = Math.max(maxParameterCount, params);
    }

    return {
      cyclomatic: functions.length > 0 ? totalCyclomatic / functions.length : 0,
      nestingDepth: maxNestingDepth,
      functionLength: maxFunctionLength,
      parameterCount: maxParameterCount,
    };
  }
}

/**
 * Factory function
 */
export function createRefactoring(): RefactoringAPI {
  return new RefactoringAPI();
}

// Re-export types for convenience
export * from './refactor-types';
