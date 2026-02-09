/**
 * SMITE Error Handler
 *
 * Standardized error handling for SMITE plugins.
 */

/**
 * SMITE Error with code and details
 */
export class SmiteError extends Error {
  constructor(
    message: string,
    public code: string,
    public plugin?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SmiteError';
    Error.captureStackTrace?.(this, SmiteError);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      plugin: this.plugin,
      details: this.details,
      stack: this.stack,
    };
  }
}

/**
 * Validation Error
 */
export class ValidationError extends SmiteError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', undefined, details);
    this.name = 'ValidationError';
  }
}

/**
 * Configuration Error
 */
export class ConfigurationError extends SmiteError {
  constructor(message: string, plugin?: string, details?: unknown) {
    super(message, 'CONFIG_ERROR', plugin, details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Plugin Load Error
 */
export class PluginLoadError extends SmiteError {
  constructor(pluginName: string, details?: unknown) {
    super(
      `Failed to load plugin: ${pluginName}`,
      'PLUGIN_LOAD_ERROR',
      pluginName,
      details
    );
    this.name = 'PluginLoadError';
  }
}

/**
 * Error Handler for SMITE
 */
export class ErrorHandler {
  /**
   * Handle error with appropriate strategy
   */
  static handle(error: Error): void {
    if (error instanceof SmiteError) {
      ErrorHandler.handleSmiteError(error);
    } else {
      ErrorHandler.handleGenericError(error);
    }
  }

  /**
   * Handle SMITE errors
   */
  private static handleSmiteError(error: SmiteError): void {
    const formatted = ErrorHandler.format(error);
    console.error(formatted);

    // Log to file if in production
    if (process.env.NODE_ENV === 'production') {
      ErrorHandler.logToFile(error);
    }
  }

  /**
   * Handle generic errors
   */
  private static handleGenericError(error: Error): void {
    console.error(`[SMITE] Unexpected error: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
  }

  /**
   * Format error for user display
   */
  static format(error: Error): string {
    if (error instanceof SmiteError) {
      const parts = [
        `[${error.code}]`,
        error.plugin ? `(${error.plugin})` : '',
        error.message,
      ].filter(Boolean);

      let formatted = parts.join(' ');

      if (error.details) {
        formatted += '\nDetails: ' + JSON.stringify(error.details, null, 2);
      }

      return formatted;
    }

    return error.message;
  }

  /**
   * Log error to file
   */
  private static logToFile(error: Error): void {
    // TODO: Implement file logging
    // For now, just console.error
    console.error('[ErrorHandler] File logging not yet implemented');
  }

  /**
   * Wrap error in SMITE error
   */
  static wrap(
    error: Error,
    code: string,
    plugin?: string,
    details?: unknown
  ): SmiteError {
    if (error instanceof SmiteError) {
      return error;
    }

    return new SmiteError(error.message, code, plugin, details);
  }

  /**
   * Create error from unknown value
   */
  static fromUnknown(value: unknown): Error {
    if (value instanceof Error) {
      return value;
    }

    if (typeof value === 'string') {
      return new Error(value);
    }

    return new Error(String(value));
  }
}

/**
 * Async error wrapper for try-catch patterns
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorCode: string,
  plugin?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw ErrorHandler.wrap(
      ErrorHandler.fromUnknown(error),
      errorCode,
      plugin
    );
  }
}

/**
 * Sync error wrapper for try-catch patterns
 */
export function tryCatchSync<T>(
  fn: () => T,
  errorCode: string,
  plugin?: string
): T {
  try {
    return fn();
  } catch (error) {
    throw ErrorHandler.wrap(
      ErrorHandler.fromUnknown(error),
      errorCode,
      plugin
    );
  }
}
