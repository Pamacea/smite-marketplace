// SMITE Ralph - Error Utilities
// Enhanced error messages with context for better debugging

import * as path from "path";

/**
 * Enhanced error class with additional context
 */
export class ContextualError extends Error {
  public readonly context: ErrorContext;
  public readonly originalError?: Error;

  constructor(message: string, context: ErrorContext, originalError?: Error) {
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
  toString(): string {
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
export function createError(
  message: string,
  context: Partial<ErrorContext> = {},
  originalError?: Error
): ContextualError {
  const fullContext: ErrorContext = {
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
export function wrapError(error: Error, message: string, context: Partial<ErrorContext> = {}): ContextualError {
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
export function createFileError(operation: string, filePath: string, originalError?: Error): ContextualError {
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
export function createParseError(filePath: string, parseError?: Error): ContextualError {
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
export function createValidationError(entity: string, reason: string, context: Partial<ErrorContext> = {}): ContextualError {
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
export async function withErrorContext<T>(
  fn: () => Promise<T>,
  context: Partial<ErrorContext>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw createError(
      error instanceof Error ? error.message : "Unknown error",
      context,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Format error for logging
 *
 * @param error - Error to format
 * @returns Formatted error string
 */
export function formatError(error: Error): string {
  if (error instanceof ContextualError) {
    return error.toString();
  }

  return `${error.name}: ${error.message}\n${error.stack}`;
}
