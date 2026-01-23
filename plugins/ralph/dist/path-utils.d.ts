/**
 * Sanitize a file path to prevent path traversal attacks
 * Ensures the path is within the allowed base directory
 *
 * @param userPath - User-provided file path
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns Sanitized absolute path
 * @throws Error if path tries to escape base directory
 */
export declare function sanitizePath(userPath: string, allowedBase?: string): string;
/**
 * Validate that a path is safe and within allowed boundaries
 *
 * @param userPath - User-provided file path
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns true if path is safe
 * @throws Error if path is unsafe
 */
export declare function validateSafePath(userPath: string, allowedBase?: string): boolean;
/**
 * Sanitize multiple paths at once
 *
 * @param paths - Array of user-provided paths
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns Array of sanitized paths
 * @throws Error if any path is unsafe
 */
export declare function sanitizePaths(paths: string[], allowedBase?: string): string[];
/**
 * Join path segments and sanitize the result
 *
 * @param segments - Path segments to join
 * @param allowedBase - Allowed base directory (default: current working directory)
 * @returns Sanitized joined path
 */
export declare function sanitizeJoin(...segments: string[]): string;
/**
 * Check if a path is a child of another path
 *
 * @param childPath - Potential child path
 * @param parentPath - Potential parent path
 * @returns true if childPath is within parentPath
 */
export declare function isPathChild(childPath: string, parentPath: string): boolean;
//# sourceMappingURL=path-utils.d.ts.map