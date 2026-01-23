/**
 * Enhanced error class with additional context
 */
export declare class ContextualError extends Error {
    readonly context: ErrorContext;
    readonly originalError?: Error;
    constructor(message: string, context: ErrorContext, originalError?: Error);
    /**
     * Format error with full context
     */
    toString(): string;
}
/**
 * Error context information
 */
export interface ErrorContext {
    /** The operation being performed when error occurred */
    operation?: string;
    /** File or resource path involved */
    filePath?: string;
    /** Additional details */
    details?: string;
    /** Stack trace */
    stack?: string;
    /** Any other relevant data */
    [key: string]: any;
}
/**
 * Create a contextual error with standard information
 *
 * @param message - Error message
 * @param context - Error context
 * @param originalError - Original error (if wrapping)
 * @returns Enhanced error object
 */
export declare function createError(message: string, context?: Partial<ErrorContext>, originalError?: Error): ContextualError;
/**
 * Wrap an error with additional context
 *
 * @param error - Original error
 * @param message - New message
 * @param context - Additional context
 * @returns Wrapped error
 */
export declare function wrapError(error: Error, message: string, context?: Partial<ErrorContext>): ContextualError;
/**
 * Create a file operation error with standard context
 *
 * @param operation - File operation (read, write, delete, etc.)
 * @param filePath - File path
 * @param originalError - Original error
 * @returns Contextual error
 */
export declare function createFileError(operation: string, filePath: string, originalError?: Error): ContextualError;
/**
 * Create a parsing error with context
 *
 * @param filePath - File being parsed
 * @param parseError - Original parse error
 * @returns Contextual error
 */
export declare function createParseError(filePath: string, parseError?: Error): ContextualError;
/**
 * Create a validation error with context
 *
 * @param entity - Entity being validated
 * @param reason - Validation failure reason
 * @param context - Additional context
 * @returns Contextual error
 */
export declare function createValidationError(entity: string, reason: string, context?: Partial<ErrorContext>): ContextualError;
/**
 * Safely execute an async function with error context
 *
 * @param fn - Function to execute
 * @param context - Error context
 * @returns Promise with result or contextual error
 */
export declare function withErrorContext<T>(fn: () => Promise<T>, context: Partial<ErrorContext>): Promise<T>;
/**
 * Format error for logging
 *
 * @param error - Error to format
 * @returns Formatted error string
 */
export declare function formatError(error: Error): string;
//# sourceMappingURL=error-utils.d.ts.map