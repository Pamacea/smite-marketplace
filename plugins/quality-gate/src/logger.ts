/**
 * Logging and Audit Trail
 * Structured logging for debugging and audit purposes
 */

import * as fs from 'fs';
import * as path from 'path';
import { JudgeHookInput, ValidationResults } from './types';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class JudgeLogger {
  private logFile: string;
  private auditFile: string;
  private logLevel: LogLevel;

  constructor(cwd: string, logLevel: LogLevel = 'info') {
    const smiteDir = path.join(cwd, '.claude', '.smite');
    this.logFile = path.join(smiteDir, 'judge-debug.log');
    this.auditFile = path.join(smiteDir, 'judge-audit.log');
    this.logLevel = logLevel;

    // Ensure .claude/.smite directory exists
    if (!fs.existsSync(smiteDir)) {
      fs.mkdirSync(smiteDir, { recursive: true });
    }
  }

  /**
   * Check if a message should be logged based on log level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Log a message to the debug log file
   */
  log(level: LogLevel, category: string, message: string, details?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      details,
      sessionId: process.env.CLAUDE_SESSION_ID || 'unknown',
    };

    try {
      fs.appendFileSync(this.logFile, JSON.stringify(entry) + '\n');

      // Also output to stderr for visibility
      const stderrMessage = `[Judge ${level.toUpperCase()}] ${category}: ${message}`;
      if (level === 'error' || level === 'warn') {
        console.error(stderrMessage);
      } else {
        console.error(stderrMessage);
      }
    } catch (error) {
      // Silently fail if we can't write to log file
      console.error(`[Judge] Failed to write to log file:`, error);
    }
  }

  /**
   * Log validation results to audit log
   */
  logValidation(input: JudgeHookInput, results: ValidationResults): void {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      sessionId: input.session_id,
      file: input.tool_input.file_path,
      tool: input.tool_name,
      decision: results.decision,
      confidence: results.confidence,
      analysisTimeMs: results.analysisTimeMs,
      issuesCount: results.issues.length,
      issues: results.issues.map((i) => ({
        type: i.type,
        severity: i.severity,
        message: i.message,
        location: i.location,
      })),
      metrics: {
        complexity: results.metrics.complexity,
        security: results.metrics.security,
        semantics: results.metrics.semantics,
      },
    };

    try {
      fs.appendFileSync(this.auditFile, JSON.stringify(auditEntry) + '\n');
      this.log('info', 'audit', `Validation ${results.decision}ed for ${input.tool_input.file_path}`);
    } catch (error) {
      this.log('error', 'audit', 'Failed to write audit log', error);
    }
  }

  /**
   * Convenience methods for different log levels
   */
  debug(category: string, message: string, details?: unknown): void {
    this.log('debug', category, message, details);
  }

  info(category: string, message: string, details?: unknown): void {
    this.log('info', category, message, details);
  }

  warn(category: string, message: string, details?: unknown): void {
    this.log('warn', category, message, details);
  }

  error(category: string, message: string, details?: unknown): void {
    this.log('error', category, message, details);
  }
}
