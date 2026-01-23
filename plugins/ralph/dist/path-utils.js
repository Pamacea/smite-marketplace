"use strict";
// SMITE Ralph - Path Utilities
// Path sanitization and validation for security
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
exports.sanitizePath = sanitizePath;
exports.validateSafePath = validateSafePath;
exports.sanitizePaths = sanitizePaths;
exports.sanitizeJoin = sanitizeJoin;
exports.isPathChild = isPathChild;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Sanitize a file path to prevent path traversal attacks
 * Ensures the path is within the allowed base directory
 *
 * @param userPath - User-provided file path
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns Sanitized absolute path
 * @throws Error if path tries to escape base directory
 */
function sanitizePath(userPath, allowedBase = process.cwd()) {
    // Resolve to absolute path
    const resolvedPath = path.resolve(userPath);
    // Resolve allowed base to absolute path
    const resolvedBase = path.resolve(allowedBase);
    // Check if the resolved path is within the allowed base
    const relativePath = path.relative(resolvedBase, resolvedPath);
    // If relative path starts with '..', it's trying to escape
    if (relativePath.startsWith("..")) {
        throw new Error(`Path traversal detected: ${userPath} tries to escape allowed base directory ${resolvedBase}`);
    }
    return resolvedPath;
}
/**
 * Validate that a path is safe and within allowed boundaries
 *
 * @param userPath - User-provided file path
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns true if path is safe
 * @throws Error if path is unsafe
 */
function validateSafePath(userPath, allowedBase = process.cwd()) {
    const sanitized = sanitizePath(userPath, allowedBase);
    // Ensure the file exists (optional, based on use case)
    try {
        fs.accessSync(sanitized, fs.constants.F_OK);
        return true;
    }
    catch {
        // File doesn't exist, but path is safe
        return true;
    }
}
/**
 * Sanitize multiple paths at once
 *
 * @param paths - Array of user-provided paths
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns Array of sanitized paths
 * @throws Error if any path is unsafe
 */
function sanitizePaths(paths, allowedBase = process.cwd()) {
    return paths.map((p) => sanitizePath(p, allowedBase));
}
/**
 * Join path segments and sanitize the result
 *
 * @param segments - Path segments to join
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns Sanitized joined path
 */
function sanitizeJoin(...segments) {
    const joined = path.join(...segments);
    return sanitizePath(joined);
}
/**
 * Check if a path is a child of another path
 *
 * @param childPath - Potential child path
 * @param parentPath - Potential parent path
 * @returns true if childPath is within parentPath
 */
function isPathChild(childPath, parentPath) {
    const resolvedChild = path.resolve(childPath);
    const resolvedParent = path.resolve(parentPath);
    const relative = path.relative(resolvedParent, resolvedChild);
    return !relative.startsWith("..");
}
//# sourceMappingURL=path-utils.js.map