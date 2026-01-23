"use strict";
/**
 * Refactoring API
 *
 * APIs for automated refactoring including code simplification,
 * dead code elimination, and structure optimization.
 *
 * @module api/refactor
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefactoringAPI = void 0;
exports.createRefactoring = createRefactoring;
const ts_morph_1 = require("ts-morph");
const error_handler_1 = require("../core/utils/error-handler");
const refactor_types_1 = require("./refactor-types");
const refactor_utils_1 = require("./refactor-utils");
const refactor_operations_1 = require("./refactor-operations");
/**
 * Refactoring API class
 */
class RefactoringAPI {
    constructor() {
        this.project = new ts_morph_1.Project({
            skipFileDependencyResolution: true,
            compilerOptions: {
                allowJs: true,
            },
        });
    }
    /**
     * Simplify code
     */
    async simplifyCode(filePath, options) {
        try {
            const dryRun = options?.dryRun ?? false;
            // Load source file
            const sourceFile = (0, refactor_utils_1.addSourceFile)(this.project, filePath);
            if (!sourceFile) {
                return {
                    type: refactor_types_1.RefactorType.SIMPLIFY,
                    modifiedFiles: [],
                    changeCount: 0,
                    success: false,
                    error: 'Failed to load source file',
                };
            }
            // Create backup if needed
            let backupPath;
            if (options?.createBackup && !dryRun) {
                backupPath = await (0, refactor_utils_1.createBackup)(filePath);
            }
            const oldText = sourceFile.getFullText();
            let changeCount = 0;
            // Simplify complex expressions
            changeCount += (0, refactor_operations_1.simplifyExpressions)(sourceFile);
            // Remove unnecessary braces
            changeCount += (0, refactor_operations_1.removeUnnecessaryBraces)(sourceFile);
            // Simplify conditionals
            changeCount += (0, refactor_operations_1.simplifyConditionals)(sourceFile);
            const newText = sourceFile.getFullText();
            // Generate diff
            const diff = (0, refactor_utils_1.generateDiff)(oldText, newText);
            // Apply changes if not dry run
            if (!dryRun && changeCount > 0) {
                if (options?.applyChanges !== false) {
                    sourceFile.saveSync();
                }
            }
            return {
                type: refactor_types_1.RefactorType.SIMPLIFY,
                modifiedFiles: changeCount > 0 ? [filePath] : [],
                changeCount,
                success: true,
                diff,
                backupPath,
            };
        }
        catch (err) {
            return (0, error_handler_1.refactorError)(refactor_types_1.RefactorType.SIMPLIFY, err);
        }
    }
    /**
     * Remove dead code
     */
    async removeDeadCode(filePath, options) {
        try {
            const dryRun = options?.dryRun ?? false;
            // Load source file
            const sourceFile = (0, refactor_utils_1.addSourceFile)(this.project, filePath);
            if (!sourceFile) {
                return {
                    type: refactor_types_1.RefactorType.REMOVE_DEAD_CODE,
                    modifiedFiles: [],
                    changeCount: 0,
                    success: false,
                    error: 'Failed to load source file',
                };
            }
            // Create backup if needed
            let backupPath;
            if (options?.createBackup && !dryRun) {
                backupPath = await (0, refactor_utils_1.createBackup)(filePath);
            }
            const oldText = sourceFile.getFullText();
            let changeCount = 0;
            // Remove unused imports
            changeCount += (0, refactor_operations_1.removeUnusedImports)(sourceFile);
            // Remove unused variables
            changeCount += (0, refactor_operations_1.removeUnusedVariables)(sourceFile);
            // Remove unreachable code
            changeCount += (0, refactor_operations_1.removeUnreachableCode)(sourceFile);
            const newText = sourceFile.getFullText();
            // Generate diff
            const diff = (0, refactor_utils_1.generateDiff)(oldText, newText);
            // Apply changes if not dry run
            if (!dryRun && changeCount > 0) {
                if (options?.applyChanges !== false) {
                    sourceFile.saveSync();
                }
            }
            return {
                type: refactor_types_1.RefactorType.REMOVE_DEAD_CODE,
                modifiedFiles: changeCount > 0 ? [filePath] : [],
                changeCount,
                success: true,
                diff,
                backupPath,
            };
        }
        catch (err) {
            return (0, error_handler_1.refactorError)(refactor_types_1.RefactorType.REMOVE_DEAD_CODE, err);
        }
    }
    /**
     * Optimize code structure
     */
    async optimizeStructure(filePath, options) {
        try {
            const dryRun = options?.dryRun ?? false;
            // Load source file
            const sourceFile = (0, refactor_utils_1.addSourceFile)(this.project, filePath);
            if (!sourceFile) {
                return {
                    type: refactor_types_1.RefactorType.OPTIMIZE_STRUCTURE,
                    modifiedFiles: [],
                    changeCount: 0,
                    success: false,
                    error: 'Failed to load source file',
                };
            }
            // Create backup if needed
            let backupPath;
            if (options?.createBackup && !dryRun) {
                backupPath = await (0, refactor_utils_1.createBackup)(filePath);
            }
            const oldText = sourceFile.getFullText();
            let changeCount = 0;
            // Reorganize imports
            changeCount += (0, refactor_operations_1.organizeImports)(sourceFile);
            // Sort class members
            changeCount += (0, refactor_operations_1.sortClassMembers)(sourceFile);
            // Extract magic numbers to constants
            changeCount += (0, refactor_operations_1.extractConstants)(sourceFile);
            const newText = sourceFile.getFullText();
            // Generate diff
            const diff = (0, refactor_utils_1.generateDiff)(oldText, newText);
            // Apply changes if not dry run
            if (!dryRun && changeCount > 0) {
                if (options?.applyChanges !== false) {
                    sourceFile.saveSync();
                }
            }
            return {
                type: refactor_types_1.RefactorType.OPTIMIZE_STRUCTURE,
                modifiedFiles: changeCount > 0 ? [filePath] : [],
                changeCount,
                success: true,
                diff,
                backupPath,
            };
        }
        catch (err) {
            return (0, error_handler_1.refactorError)(refactor_types_1.RefactorType.OPTIMIZE_STRUCTURE, err);
        }
    }
    /**
     * Calculate code complexity
     */
    calculateComplexity(sourceFile) {
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
            const maxDepth = (0, refactor_utils_1.calculateNestingDepth)(body);
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
exports.RefactoringAPI = RefactoringAPI;
/**
 * Factory function
 */
function createRefactoring() {
    return new RefactoringAPI();
}
// Re-export types for convenience
__exportStar(require("./refactor-types"), exports);
//# sourceMappingURL=refactor.js.map