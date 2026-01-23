"use strict";
// SMITE Ralph - Error Utilities
// Enhanced error messages with context for better debugging
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
exports.ContextualError = void 0;
exports.createError = createError;
exports.wrapError = wrapError;
exports.createFileError = createFileError;
exports.createParseError = createParseError;
exports.createValidationError = createValidationError;
exports.withErrorContext = withErrorContext;
exports.formatError = formatError;
const path = __importStar(require("path"));
/**
 * Enhanced error class with additional context
 */
class ContextualError extends Error {
    constructor(message, context, originalError) {
        super(message);
        this.name = "ContextualError";
        this.context = context;
        this.originalError = originalError;
        // Maintains proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ContextualError);
        }
    }
    /**
     * Format error with full context
     */
    toString() {
        const parts = [this.message];
        if (this.context.operation) {
            parts.push(`\n  Operation: ${this.context.operation}`);
        }
        if (this.context.filePath) {
            parts.push(`\n  File: ${this.context.filePath}`);
        }
        if (this.context.details) {
            parts.push(`\n  Details: ${this.context.details}`);
        }
        if (this.context.stack) {
            parts.push(`\n  Stack:\n${this.context.stack}`);
        }
        if (this.originalError) {
            parts.push(`\n  Caused by: ${this.originalError.message}`);
            if (this.originalError.stack) {
                parts.push(`\n${this.originalError.stack}`);
            }
        }
        return parts.join("");
    }
}
exports.ContextualError = ContextualError;
/**
 * Create a contextual error with standard information
 *
 * @param message - Error message
 * @param context - Error context
 * @param originalError - Original error (if wrapping)
 * @returns Enhanced error object
 */
function createError(message, context = {}, originalError) {
    const fullContext = {
        operation: context.operation || "unknown",
        filePath: context.filePath,
        details: context.details,
        stack: context.stack || new Error().stack,
        ...context,
    };
    return new ContextualError(message, fullContext, originalError);
}
/**
 * Wrap an error with additional context
 *
 * @param error - Original error
 * @param message - New message
 * @param context - Additional context
 * @returns Wrapped error
 */
function wrapError(error, message, context = {}) {
    return createError(message, context, error);
}
/**
 * Create a file operation error with standard context
 *
 * @param operation - File operation (read, write, delete, etc.)
 * @param filePath - File path
 * @param originalError - Original error
 * @returns Contextual error
 */
function createFileError(operation, filePath, originalError) {
    const resolvedPath = path.resolve(filePath);
    const relativePath = path.relative(process.cwd(), resolvedPath);
    return createError(`File ${operation} failed`, {
        operation: `file:${operation}`,
        filePath: relativePath,
        details: `Attempted to ${operation} file at: ${resolvedPath}`,
    });
}
/**
 * Create a parsing error with context
 *
 * @param filePath - File being parsed
 * @param parseError - Original parse error
 * @returns Contextual error
 */
function createParseError(filePath, parseError) {
    return createFileError("parse", filePath, parseError);
}
/**
 * Create a validation error with context
 *
 * @param entity - Entity being validated
 * @param reason - Validation failure reason
 * @param context - Additional context
 * @returns Contextual error
 */
function createValidationError(entity, reason, context = {}) {
    return createError(`Validation failed for ${entity}`, {
        operation: "validation",
        details: reason,
        ...context,
    });
}
/**
 * Safely execute an async function with error context
 *
 * @param fn - Function to execute
 * @param context - Error context
 * @returns Promise with result or contextual error
 */
async function withErrorContext(fn, context) {
    try {
        return await fn();
    }
    catch (error) {
        throw createError(error instanceof Error ? error.message : "Unknown error", context, error instanceof Error ? error : undefined);
    }
}
/**
 * Format error for logging
 *
 * @param error - Error to format
 * @returns Formatted error string
 */
function formatError(error) {
    if (error instanceof ContextualError) {
        return error.toString();
    }
    return `${error.name}: ${error.message}\n${error.stack}`;
}
//# sourceMappingURL=error-utils.js.map