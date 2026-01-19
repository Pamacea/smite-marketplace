/**
 * Feedback Generator and Context Re-injection
 * Generate correction prompts and manage retry state
 *
 * This implements the feedback loop mechanism described in the architecture document.
 * When validation fails, it generates a structured correction prompt that is
 * reinjected into the executor context via the permissionDecisionReason field.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ValidationResults, ValidationIssue, RetryState, CodeChangeAttempt, TestFailure } from './types';
import { JudgeLogger } from './logger';

export class FeedbackGenerator {
  private logger: JudgeLogger;
  private retryStatePath: string;

  constructor(logger: JudgeLogger, cwd: string) {
    this.logger = logger;
    this.retryStatePath = path.join(cwd, '.smite', 'judge-retry-state.json');
  }

  /**
   * Generate correction prompt for failed validation
   * This prompt will be reinjected into Claude's context
   */
  generateCorrectionPrompt(
    input: {
      sessionId: string;
      filePath: string;
      retryCount: number;
      maxRetries: number;
    },
    results: ValidationResults
  ): string {
    const { sessionId, filePath, retryCount, maxRetries } = input;

    // Group issues by severity
    const criticalIssues = results.issues.filter((i) => i.severity === 'critical');
    const errorIssues = results.issues.filter((i) => i.severity === 'error');
    const warningIssues = results.issues.filter((i) => i.severity === 'warning');

    // Build the prompt
    let prompt = '🛑 CODE QUALITY GATE - VALIDATION FAILED\n\n';
    prompt += `Your recent code change to \`${filePath}\` has been blocked due to quality issues.\n\n`;

    // Summary section
    prompt += '## Summary\n';
    const summary = this.generateSummary(results);
    prompt += summary;
    prompt += '\n';

    // Critical issues
    if (criticalIssues.length > 0) {
      prompt += '## Critical Issues\n\n';
      for (const issue of criticalIssues) {
        prompt += this.formatIssue(issue, 1);
      }
      prompt += '\n';
    }

    // Error issues
    if (errorIssues.length > 0) {
      prompt += '## Error Issues\n\n';
      for (const issue of errorIssues.slice(0, 5)) {
        // Limit to 5 errors
        prompt += this.formatIssue(issue, 2);
      }
      if (errorIssues.length > 5) {
        prompt += `... and ${errorIssues.length - 5} more error(s)\n\n`;
      }
      prompt += '\n';
    }

    // Warnings (optional - show if no critical/errors)
    if (criticalIssues.length === 0 && errorIssues.length === 0 && warningIssues.length > 0) {
      prompt += '## Warnings\n\n';
      for (const issue of warningIssues.slice(0, 3)) {
        // Limit to 3 warnings
        prompt += this.formatIssue(issue, 3);
      }
      if (warningIssues.length > 3) {
        prompt += `... and ${warningIssues.length - 3} more warning(s)\n\n`;
      }
      prompt += '\n';
    }

    // Test failures section
    if (results.metrics.tests && results.metrics.tests.failedTests > 0) {
      prompt += '## Test Failures\n\n';
      for (const failure of results.metrics.tests.failures.slice(0, 5)) {
        // Limit to 5 test failures
        prompt += this.formatTestFailure(failure);
      }
      if (results.metrics.tests.failures.length > 5) {
        prompt += `... and ${results.metrics.tests.failures.length - 5} more test failure(s)\n\n`;
      }
      prompt += '\n';
    }

    // Suggestions section
    const suggestions = this.generateSuggestions(results);
    if (suggestions) {
      prompt += '## Suggestions\n';
      prompt += suggestions;
      prompt += '\n';
    }

    // Context section
    prompt += '## Context\n';
    prompt += `- Attempt: ${retryCount}/${maxRetries}\n`;
    prompt += `- Confidence score: ${Math.round(results.confidence * 100)}%\n`;
    prompt += `- Analysis time: ${results.analysisTimeMs}ms\n`;

    // Show retry history
    const retryState = this.loadRetryState();
    if (retryState && retryState.previousAttempts.length > 0) {
      prompt += `- Previous attempts: ${retryState.previousAttempts.length}\n`;
    }
    prompt += '\n';

    prompt += 'Please revise your code to address these issues before proceeding.\n';

    return prompt;
  }

  /**
   * Generate a summary of issues
   */
  private generateSummary(results: ValidationResults): string {
    const lines: string[] = [];

    // Complexity summary
    if (results.metrics.complexity.highComplexityFunctions > 0) {
      lines.push(
        `- Complexity: ${results.metrics.complexity.highComplexityFunctions} function(s) exceed threshold`
      );
    }

    // Security summary
    const securityIssues = results.metrics.security.criticalIssues + results.metrics.security.errorIssues;
    if (securityIssues > 0) {
      const categories = Object.entries(results.metrics.security.categories)
        .filter(([_, count]) => count > 0)
        .map(([cat, count]) => `${count} ${cat}`)
        .join(', ');
      lines.push(`- Security: ${securityIssues} issue(s) (${categories})`);
    }

    // Semantic summary
    if (results.metrics.semantics.namingViolations > 0) {
      lines.push(`- Semantics: ${results.metrics.semantics.namingViolations} naming violation(s)`);
    }
    if (results.metrics.semantics.typeInconsistencies > 0) {
      lines.push(`- Semantics: ${results.metrics.semantics.typeInconsistencies} type inconsistency(ies)`);
    }

    // Test summary
    if (results.metrics.tests && results.metrics.tests.failedTests > 0) {
      lines.push(
        `- Tests: ${results.metrics.tests.failedTests}/${results.metrics.tests.totalTests} test(s) failed`
      );
    }

    return lines.length > 0 ? lines.join('\n') : 'No specific issues detected.';
  }

  /**
   * Format a single issue for display
   */
  private formatIssue(issue: ValidationIssue, index: number): string {
    let text = `${index}. **${issue.message}**\n`;

    if (issue.location) {
      text += `   Location: \`${issue.location.file}:${issue.location.line}:${issue.location.column}\`\n`;
    }

    text += `   Rule: \`${issue.rule}\`\n`;

    if (issue.suggestion) {
      text += `   Fix: ${issue.suggestion}\n`;
    }

    if (issue.codeSnippet && issue.codeSnippet.length > 0) {
      // Clean up snippet
      const snippet = issue.codeSnippet.trim().substring(0, 200);
      text += `   \`\`\`\n${snippet}\n   \`\`\`\n`;
    }

    text += '\n';
    return text;
  }

  /**
   * Format a single test failure for display
   */
  private formatTestFailure(failure: TestFailure): string {
    let text = `- **${failure.testName}**\n`;
    text += `   File: \`${failure.testFile}:${failure.line}:${failure.column}\`\n`;

    if (failure.message) {
      // Show first few lines of error message
      const messageLines = failure.message.split('\n').slice(0, 3).join('\n');
      text += `   Error: ${messageLines}\n`;
    }

    text += '\n';
    return text;
  }

  /**
   * Generate actionable suggestions
   */
  private generateSuggestions(results: ValidationResults): string {
    const suggestions: string[] = [];

    // Analyze issues and generate specific suggestions
    for (const issue of results.issues) {
      if (issue.suggestion && !suggestions.includes(issue.suggestion)) {
        suggestions.push(`1. ${issue.suggestion}`);
      }
    }

    return suggestions.length > 0 ? suggestions.join('\n') : '';
  }

  /**
   * Load retry state from file
   */
  loadRetryState(): RetryState | null {
    try {
      if (fs.existsSync(this.retryStatePath)) {
        const content = fs.readFileSync(this.retryStatePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      this.logger.warn('feedback', 'Failed to load retry state', error);
    }
    return null;
  }

  /**
   * Save retry state to file
   */
  saveRetryState(state: RetryState): void {
    try {
      const smiteDir = path.dirname(this.retryStatePath);
      if (!fs.existsSync(smiteDir)) {
        fs.mkdirSync(smiteDir, { recursive: true });
      }

      fs.writeFileSync(this.retryStatePath, JSON.stringify(state, null, 2));
      this.logger.debug('feedback', 'Saved retry state', {
        retryCount: state.retryCount,
        attempts: state.previousAttempts.length,
      });
    } catch (error) {
      this.logger.error('feedback', 'Failed to save retry state', error);
    }
  }

  /**
   * Update retry state after a failed validation
   */
  updateRetryState(
    sessionId: string,
    filePath: string,
    content: string,
    results: ValidationResults,
    maxRetries: number
  ): RetryState {
    const existing = this.loadRetryState();
    const contentHash = this.hashContent(content);

    const newAttempt: CodeChangeAttempt = {
      timestamp: Date.now(),
      filePath,
      contentHash,
      validationResults: results,
    };

    const state: RetryState = existing || {
      sessionId,
      retryCount: 0,
      maxRetries,
      lastFailureTimestamp: 0,
      issuesDetected: [],
      previousAttempts: [],
    };

    // Update state
    state.retryCount++;
    state.lastFailureTimestamp = Date.now();
    state.issuesDetected = results.issues;
    state.previousAttempts.push(newAttempt);

    // Keep only last 5 attempts
    if (state.previousAttempts.length > 5) {
      state.previousAttempts = state.previousAttempts.slice(-5);
    }

    this.saveRetryState(state);
    return state;
  }

  /**
   * Clear retry state (e.g., after successful validation)
   */
  clearRetryState(): void {
    try {
      if (fs.existsSync(this.retryStatePath)) {
        fs.unlinkSync(this.retryStatePath);
        this.logger.debug('feedback', 'Cleared retry state');
      }
    } catch (error) {
      this.logger.warn('feedback', 'Failed to clear retry state', error);
    }
  }

  /**
   * Generate simple hash of content for change detection
   */
  private hashContent(content: string): string {
    // Simple hash function (for production, consider using crypto)
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Check if max retries have been reached
   */
  hasMaxRetriesReached(maxRetries: number): boolean {
    const state = this.loadRetryState();
    return state ? state.retryCount >= maxRetries : false;
  }
}
