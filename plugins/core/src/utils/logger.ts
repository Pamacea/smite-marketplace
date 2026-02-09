/**
 * SMITE Structured Logger
 *
 * Simple logging utility for consistent output formatting.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

/**
 * Structured Logger for SMITE
 */
export class Logger {
  private level: LogLevel;
  private prefix?: string;

  constructor(level: LogLevel = LogLevel.INFO, prefix?: string) {
    this.level = level;
    this.prefix = prefix;
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (level < this.level) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };

    const formatted = this.format(entry);
    this.write(formatted);
  }

  /**
   * Format log entry
   */
  private format(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level];
    const prefix = this.prefix ? `[${this.prefix}] ` : '';
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';

    return `${timestamp} ${level} ${prefix}${entry.message}${context}`;
  }

  /**
   * Write log entry
   */
  private write(formatted: string): void {
    const entry = this.entry;
    if (level === LogLevel.ERROR) {
      console.error(formatted);
    } else if (level === LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Create child logger with prefix
   */
  withPrefix(prefix: string): Logger {
    return new Logger(this.level, this.prefix ? `${this.prefix}:${prefix}` : prefix);
  }
}

/**
 * Global logger instance
 */
let globalLogger: Logger | undefined;

/**
 * Get or create global logger
 */
export function getGlobalLogger(): Logger {
  if (!globalLogger) {
    const logLevel = process.env.SMITE_LOG_LEVEL
      ? LogLevel[process.env.SMITE_LOG_LEVEL as keyof typeof LogLevel]
      : LogLevel.INFO;
    globalLogger = new Logger(logLevel, 'SMITE');
  }
  return globalLogger;
}
