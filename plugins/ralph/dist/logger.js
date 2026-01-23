"use strict";
// SMITE Ralph - Structured Logging Framework
// Simple, lightweight logging with levels and formatting
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildLogger = exports.Logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 4] = "SILENT";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Structured logger with levels and formatting
 */
class Logger {
    /**
     * Set the minimum log level
     */
    static setLevel(level) {
        Logger.currentLevel = level;
    }
    /**
     * Get current log level
     */
    static getLevel() {
        return Logger.currentLevel;
    }
    /**
     * Log a debug message
     */
    static debug(message, context) {
        Logger.log(LogLevel.DEBUG, message, context);
    }
    /**
     * Log an info message
     */
    static info(message, context) {
        Logger.log(LogLevel.INFO, message, context);
    }
    /**
     * Log a warning message
     */
    static warn(message, context) {
        Logger.log(LogLevel.WARN, message, context);
    }
    /**
     * Log an error message
     */
    static error(message, error, context) {
        Logger.log(LogLevel.ERROR, message, context, error);
    }
    /**
     * Core logging method
     */
    static log(level, message, context, error) {
        if (level < Logger.currentLevel) {
            return;
        }
        const entry = {
            level,
            levelName: LogLevel[level],
            timestamp: new Date().toISOString(),
            message,
            context,
            error,
        };
        // Store log entry
        Logger.logs.push(entry);
        if (Logger.logs.length > Logger.MAX_LOGS) {
            Logger.logs.shift(); // Remove oldest log
        }
        // Format and output
        const formatted = Logger.formatEntry(entry);
        console.log(formatted);
    }
    /**
     * Format a log entry for output
     */
    static formatEntry(entry) {
        const parts = [
            `[${entry.timestamp}]`,
            `[${entry.levelName}]`,
            entry.message,
        ];
        if (entry.context) {
            const contextStr = Object.entries(entry.context)
                .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
                .join(" ");
            parts.push(`(${contextStr})`);
        }
        if (entry.error) {
            parts.push(`\n${entry.error.stack || entry.error.message}`);
        }
        return parts.join(" ");
    }
    /**
     * Get all log entries
     */
    static getLogs() {
        return [...Logger.logs];
    }
    /**
     * Clear all logs
     */
    static clearLogs() {
        Logger.logs = [];
    }
    /**
     * Get logs filtered by level
     */
    static getLogsByLevel(level) {
        return Logger.logs.filter((log) => log.level === level);
    }
    /**
     * Export logs as JSON string
     */
    static exportLogs() {
        return JSON.stringify(Logger.logs, null, 2);
    }
    /**
     * Create a child logger with additional context
     */
    static createChild(defaultContext) {
        return new ChildLogger(defaultContext);
    }
}
exports.Logger = Logger;
Logger.currentLevel = LogLevel.INFO;
Logger.logs = [];
Logger.MAX_LOGS = 1000; // Prevent memory leaks
/**
 * Child logger with preset context
 */
class ChildLogger {
    constructor(defaultContext) {
        this.defaultContext = defaultContext;
    }
    debug(message, context) {
        Logger.debug(message, { ...this.defaultContext, ...context });
    }
    info(message, context) {
        Logger.info(message, { ...this.defaultContext, ...context });
    }
    warn(message, context) {
        Logger.warn(message, { ...this.defaultContext, ...context });
    }
    error(message, error, context) {
        Logger.error(message, error, { ...this.defaultContext, ...context });
    }
}
exports.ChildLogger = ChildLogger;
//# sourceMappingURL=logger.js.map