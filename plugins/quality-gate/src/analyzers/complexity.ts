/**
 * Complexity Analyzer
 * Analyze code complexity metrics and flag issues
 */

import * as ts from 'typescript';
import { TypeScriptParser } from '../parser';
import { JudgeLogger } from '../logger';
import { ASTAnalysisContext, FunctionInfo, ValidationIssue, ComplexityThresholds } from '../types';

export class ComplexityAnalyzer {
  private parser: TypeScriptParser;
  private logger: JudgeLogger;
  private thresholds: ComplexityThresholds;

  constructor(parser: TypeScriptParser, logger: JudgeLogger, thresholds: ComplexityThresholds) {
    this.parser = parser;
    this.logger = logger;
    this.thresholds = thresholds;
  }

  /**
   * Analyze complexity of a source file
   */
  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    this.logger.debug('complexity', 'Starting complexity analysis');

    // Extract all functions
    const functions = this.parser.extractFunctions(sourceFile);

    this.logger.debug('complexity', `Found ${functions.length} functions`);

    // Analyze each function
    for (const func of functions) {
      this.analyzeFunction(func, sourceFile, context);
    }

    // Update metrics
    context.metrics.complexity.totalFunctions = functions.length;
    context.metrics.complexity.highComplexityFunctions = functions.filter(
      (f) => f.complexity > this.thresholds.maxCyclomaticComplexity
    ).length;

    this.logger.info('complexity', 'Complexity analysis complete', {
      totalFunctions: functions.length,
      highComplexityFunctions: context.metrics.complexity.highComplexityFunctions,
    });
  }

  /**
   * Analyze a single function for complexity issues
   */
  private analyzeFunction(func: FunctionInfo, sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    // Check cyclomatic complexity
    if (func.complexity > this.thresholds.maxCyclomaticComplexity) {
      const issue: ValidationIssue = {
        type: 'complexity',
        severity: 'error',
        location: {
          file: sourceFile.fileName,
          line: func.startLine,
          column: func.startColumn,
        },
        message: `Function '${func.name}' has cyclomatic complexity of ${func.complexity} (threshold: ${this.thresholds.maxCyclomaticComplexity})`,
        rule: 'complexity-max-complexity',
        suggestion: 'Break this function into smaller functions to reduce complexity',
        codeSnippet: sourceFile.getText().split('\n').slice(func.startLine - 1, func.startLine + 2).join('\n'),
      };
      context.issues.push(issue);
    }

    // Check cognitive complexity
    if (func.cognitiveComplexity > this.thresholds.maxCognitiveComplexity) {
      const issue: ValidationIssue = {
        type: 'complexity',
        severity: 'error',
        location: {
          file: sourceFile.fileName,
          line: func.startLine,
          column: func.startColumn,
        },
        message: `Function '${func.name}' has cognitive complexity of ${func.cognitiveComplexity} (threshold: ${this.thresholds.maxCognitiveComplexity})`,
        rule: 'complexity-max-cognitive-complexity',
        suggestion: 'Simplify control flow and reduce nesting to improve readability',
      };
      context.issues.push(issue);
    }

    // Check nesting depth
    if (func.nestingDepth > this.thresholds.maxNestingDepth) {
      const issue: ValidationIssue = {
        type: 'complexity',
        severity: 'warning',
        location: {
          file: sourceFile.fileName,
          line: func.startLine,
          column: func.startColumn,
        },
        message: `Function '${func.name}' has nesting depth of ${func.nestingDepth} (threshold: ${this.thresholds.maxNestingDepth})`,
        rule: 'complexity-max-nesting',
        suggestion: 'Extract nested logic into separate functions to reduce nesting',
      };
      context.issues.push(issue);
    }

    // Check function length
    if (func.length > this.thresholds.maxFunctionLength) {
      const issue: ValidationIssue = {
        type: 'complexity',
        severity: 'warning',
        location: {
          file: sourceFile.fileName,
          line: func.startLine,
          column: func.startColumn,
        },
        message: `Function '${func.name}' is ${func.length} lines long (threshold: ${this.thresholds.maxFunctionLength} lines)`,
        rule: 'complexity-max-length',
        suggestion: 'Consider breaking this function into smaller, more focused functions',
      };
      context.issues.push(issue);
    }

    // Check parameter count
    if (func.parameterCount > this.thresholds.maxParameterCount) {
      const issue: ValidationIssue = {
        type: 'complexity',
        severity: 'warning',
        location: {
          file: sourceFile.fileName,
          line: func.startLine,
          column: func.startColumn,
        },
        message: `Function '${func.name}' has ${func.parameterCount} parameters (threshold: ${this.thresholds.maxParameterCount})`,
        rule: 'complexity-max-parameters',
        suggestion: 'Consider using an object parameter to group related parameters',
      };
      context.issues.push(issue);
    }

    // Update metrics with max values
    context.metrics.complexity.cyclomaticComplexity = Math.max(
      context.metrics.complexity.cyclomaticComplexity,
      func.complexity
    );
    context.metrics.complexity.cognitiveComplexity = Math.max(
      context.metrics.complexity.cognitiveComplexity,
      func.cognitiveComplexity
    );
    context.metrics.complexity.nestingDepth = Math.max(
      context.metrics.complexity.nestingDepth,
      func.nestingDepth
    );
    context.metrics.complexity.functionLength = Math.max(
      context.metrics.complexity.functionLength,
      func.length
    );
    context.metrics.complexity.parameterCount = Math.max(
      context.metrics.complexity.parameterCount,
      func.parameterCount
    );
  }
}
