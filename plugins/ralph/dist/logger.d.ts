export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    SILENT = 4
}
/**
 * Log entry structure
 */
export interface LogEntry {
    level: LogLevel;
    levelName: string;
    timestamp: string;
    message: string;
    context?: Record<string, any>;
    error?: Error;
}
/**
 * Structured logger with levels and formatting
 */
export declare class Logger {
    private static currentLevel;
    private static logs;
    private static readonly MAX_LOGS;
    /**
     * Set the minimum log level
     */
    static setLevel(level: LogLevel): void;
    /**
     * Get current log level
     */
    static getLevel(): LogLevel;
    /**
     * Log a debug message
     */
    static debug(message: string, context?: Record<string, any>): void;
    /**
     * Log an info message
     */
    static info(message: string, context?: Record<string, any>): void;
    /**
     * Log a warning message
     */
    static warn(message: string, context?: Record<string, any>): void;
    /**
     * Log an error message
     */
    static error(message: string, error?: Error, context?: Record<string, any>): void;
    /**
     * Core logging method
     */
    private static log;
    /**
     * Format a log entry for output
     */
    private static formatEntry;
    /**
     * Get all log entries
     */
    static getLogs(): LogEntry[];
    /**
     * Clear all logs
     */
    static clearLogs(): void;
    /**
     * Get logs filtered by level
     */
    static getLogsByLevel(level: LogLevel): LogEntry[];
    /**
     * Export logs as JSON string
     */
    static exportLogs(): string;
    /**
     * Create a child logger with additional context
     */
    static createChild(defaultContext: Record<string, any>): ChildLogger;
}
/**
 * Child logger with preset context
 */
export declare class ChildLogger {
    private defaultContext;
    constructor(defaultContext: Record<string, any>);
    debug(message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, error?: Error, context?: Record<string, any>): void;
}
//# sourceMappingURL=logger.d.ts.map