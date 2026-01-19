/**
 * Core Judge Orchestrator
 * Main validator that coordinates all analysis components
 */

import * as ts from 'typescript';
import { TypeScriptParser } from './parser';
import { ComplexityAnalyzer } from './analyzers/complexity';
import { SecurityScanner } from './analyzers/security';
import { SemanticChecker } from './analyzers/semantic';
import { FeedbackGenerator } from './feedback';
import { ConfigManager } from './config';
import { JudgeLogger } from './logger';
import { TestRunner } from './test-runner';
import {
  JudgeHookInput,
  JudgeHookOutput,
  ValidationResults,
  Decision,
  ValidationIssue,
  ASTAnalysisContext,
  TestMetrics,
} from './types';

export class Judge {
  private configManager: ConfigManager;
  private logger: JudgeLogger;
  private parser: TypeScriptParser;
  private feedbackGenerator: FeedbackGenerator;
  private testRunner: TestRunner;
  private startTime: number = 0;

  constructor(cwd: string) {
    this.configManager = new ConfigManager(cwd);
    const config = this.configManager.getConfig();

    this.logger = new JudgeLogger(cwd, config.logLevel);
    this.parser = new TypeScriptParser(this.logger);
    this.feedbackGenerator = new FeedbackGenerator(this.logger, cwd);
    this.testRunner = new TestRunner(this.logger, cwd);

    this.logger.info('judge', 'Judge initialized', {
      enabled: config.enabled,
      logLevel: config.logLevel,
      testsEnabled: config.tests.enabled,
    });
  }

  /**
   * Main validation entry point
   */
  async validate(input: JudgeHookInput): Promise<JudgeHookOutput> {
    this.startTime = Date.now();

    const config = this.configManager.getConfig();

    // Check if judge is enabled
    if (!config.enabled) {
      return this.allow('Quality gate is disabled in configuration');
    }

    // Extract file path and content
    const filePath = input.tool_input.file_path;
    const content =
      'content' in input.tool_input ? input.tool_input.content : input.tool_input.new_string;

    this.logger.info('judge', `Starting validation for ${filePath}`, {
      tool: input.tool_name,
      contentLength: content.length,
    });

    // Check if file should be validated
    if (!this.configManager.shouldValidateFile(filePath)) {
      this.logger.debug('judge', `File excluded from validation: ${filePath}`);
      return this.allow(`File excluded from validation: ${filePath}`);
    }

    // Parse code
    const sourceFile = this.parser.parseCode(filePath, content);
    if (!sourceFile) {
      this.logger.warn('judge', `Failed to parse ${filePath}, allowing with warning`);
      return this.ask(`Failed to parse ${filePath}. The code may have syntax errors.`);
    }

    // Initialize analysis context
    const context: ASTAnalysisContext = {
      sourceFile,
      config,
      issues: [],
      metrics: {
        complexity: {
          cyclomaticComplexity: 0,
          cognitiveComplexity: 0,
          nestingDepth: 0,
          functionLength: 0,
          parameterCount: 0,
          totalFunctions: 0,
          highComplexityFunctions: 0,
        },
        security: {
          criticalIssues: 0,
          errorIssues: 0,
          warningIssues: 0,
          categories: {
            injection: 0,
            xss: 0,
            crypto: 0,
            auth: 0,
            dataExposure: 0,
          },
        },
        semantics: {
          apiContractViolations: 0,
          typeInconsistencies: 0,
          namingViolations: 0,
          duplicateCodeInstances: 0,
        },
      },
    };

    try {
      // Run complexity analysis
      const complexityAnalyzer = new ComplexityAnalyzer(this.parser, this.logger, config.complexity);
      complexityAnalyzer.analyze(sourceFile, context);

      // Run security scanning
      if (config.security.enabled) {
        const securityScanner = new SecurityScanner(this.parser, this.logger, config.security.rules);
        securityScanner.scan(sourceFile, context);
      }

      // Run semantic checks
      if (config.semantics.enabled) {
        const semanticChecker = new SemanticChecker(this.parser, this.logger, config.semantics.checks);
        semanticChecker.check(sourceFile, context);
      }

      // Run tests if enabled
      let testMetrics: TestMetrics | undefined;
      if (config.tests.enabled) {
        const testResults = await this.testRunner.runTests(config.tests);

        // Add test failures as validation issues
        if (!testResults.skipped && testResults.failures.length > 0) {
          for (const failure of testResults.failures) {
            context.issues.push({
              type: 'test',
              severity: config.tests.failOnTestFailure ? 'error' : 'warning',
              location: {
                file: failure.testFile,
                line: failure.line,
                column: failure.column,
              },
              message: `Test failure: ${failure.testName}`,
              rule: 'test-failure',
              suggestion: failure.message,
            });
          }
        }

        // Store test metrics
        testMetrics = {
          totalTests: testResults.totalTests,
          passedTests: testResults.passedTests,
          failedTests: testResults.failedTests,
          skippedTests: testResults.skippedTests,
          failures: testResults.failures,
        };

        context.metrics.tests = testMetrics;
      }

      // Calculate analysis time
      const analysisTimeMs = Date.now() - this.startTime;

      // Make decision
      const results: ValidationResults = {
        decision: this.makeDecision(context),
        confidence: this.calculateConfidence(context),
        issues: context.issues,
        metrics: context.metrics,
        analysisTimeMs,
      };

      // Log validation results
      this.logger.logValidation(input, results);

      // Handle decision
      if (results.decision === 'allow') {
        this.logger.info('judge', `Validation passed for ${filePath}`);
        this.feedbackGenerator.clearRetryState();
        return this.allow('Code quality validation passed');
      } else {
        this.logger.warn('judge', `Validation failed for ${filePath}`, {
          issuesCount: results.issues.length,
          critical: results.issues.filter((i) => i.severity === 'critical').length,
        });

        // Check if max retries reached
        if (this.feedbackGenerator.hasMaxRetriesReached(config.maxRetries)) {
          this.logger.warn('judge', 'Max retries reached, allowing with warning');
          this.feedbackGenerator.clearRetryState();
          return this.allow('⚠️ Maximum validation retries reached. Proceeding with potential quality issues.');
        }

        // Update retry state
        this.feedbackGenerator.updateRetryState(
          input.session_id,
          filePath,
          content,
          results,
          config.maxRetries
        );

        // Generate correction prompt
        const retryState = this.feedbackGenerator.loadRetryState();
        const correctionPrompt = this.feedbackGenerator.generateCorrectionPrompt(
          {
            sessionId: input.session_id,
            filePath,
            retryCount: retryState?.retryCount || 1,
            maxRetries: config.maxRetries,
          },
          results
        );

        return this.deny(correctionPrompt);
      }
    } catch (error) {
      this.logger.error('judge', 'Validation error', error);
      return this.ask(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Make allow/deny decision based on issues found
   */
  private makeDecision(context: ASTAnalysisContext): Decision {
    const { issues, metrics } = context;

    // Critical issues always deny
    if (issues.some((i) => i.severity === 'critical')) {
      return 'deny';
    }

    // Error issues deny
    if (issues.some((i) => i.severity === 'error')) {
      return 'deny';
    }

    // Security issues always deny
    if (metrics.security.criticalIssues > 0 || metrics.security.errorIssues > 0) {
      return 'deny';
    }

    // Test failures deny if configured to do so
    if (metrics.tests && metrics.tests.failedTests > 0) {
      const config = this.configManager.getConfig();
      if (config.tests.failOnTestFailure) {
        return 'deny';
      }
    }

    // Allow if no issues or only warnings
    return 'allow';
  }

  /**
   * Calculate confidence score for the decision
   */
  private calculateConfidence(context: ASTAnalysisContext): number {
    const { issues, metrics } = context;

    // Start with 100% confidence
    let confidence = 1.0;

    // Reduce confidence based on issues
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical':
          confidence -= 0.3;
          break;
        case 'error':
          confidence -= 0.2;
          break;
        case 'warning':
          confidence -= 0.05;
          break;
      }
    }

    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Generate allow response
   */
  private allow(reason: string): JudgeHookOutput {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        permissionDecisionReason: reason,
      },
    };
  }

  /**
   * Generate deny response
   */
  private deny(reason: string): JudgeHookOutput {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    };
  }

  /**
   * Generate ask response
   */
  private ask(reason: string): JudgeHookOutput {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    };
  }
}
