"use strict";
/**
 * Refactoring Utilities
 *
 * Utility functions for the refactoring API.
 *
 * @module api/refactor-utils
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDiff = generateDiff;
exports.calculateNestingDepth = calculateNestingDepth;
exports.createBackup = createBackup;
exports.addSourceFile = addSourceFile;
/**
 * Generate diff between two texts
 *
 * @param oldText - Original text
 * @param newText - Modified text
 * @returns Unified diff string
 */
function generateDiff(oldText, newText) {
    const lines1 = oldText.split('\n');
    const lines2 = newText.split('\n');
    const diff = [];
    for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
        const line1 = lines1[i];
        const line2 = lines2[i];
        if (line1 !== line2) {
            if (line1 !== undefined) {
                diff.push(`- ${line1}`);
            }
            if (line2 !== undefined) {
                diff.push(`+ ${line2}`);
            }
        }
    }
    return diff.join('\n');
}
/**
 * Calculate nesting depth of code
 *
 * @param text - Code text to analyze
 * @returns Maximum nesting depth
 */
function calculateNestingDepth(text) {
    let maxDepth = 0;
    let currentDepth = 0;
    for (const char of text) {
        if (char === '{') {
            currentDepth++;
            maxDepth = Math.max(maxDepth, currentDepth);
        }
        else if (char === '}') {
            currentDepth--;
        }
    }
    return maxDepth;
}
/**
 * Create backup of file
 *
 * @param filePath - Path to file to backup
 * @returns Path to backup file
 */
async function createBackup(filePath) {
    const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
    const backupPath = `${filePath}.backup`;
    await fs.copyFile(filePath, backupPath);
    return backupPath;
}
/**
 * Add source file to project
 *
 * @param project - ts-morph Project instance
 * @param filePath - Path to source file
 * @returns SourceFile or null if loading failed
 */
function addSourceFile(project, filePath) {
    try {
        return project.addSourceFileAtPath(filePath);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=refactor-utils.js.map