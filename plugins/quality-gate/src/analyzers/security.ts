/**
 * Security Scanner
 * Detect security vulnerabilities using pattern matching and AST analysis
 *
 * References:
 * - 20 Static Analysis Tools for TypeScript: https://www.in-com.com/blog/20-powerful-static-analysis-tools-every-typescript-team-needs/
 * - OWASP Top 10 2021: https://owasp.org/Top10/
 */

import * as ts from 'typescript';
import { TypeScriptParser } from '../parser';
import { JudgeLogger } from '../logger';
import { ASTAnalysisContext, SecurityRule, SecurityRuleConfig, ValidationIssue } from '../types';
import { SECURITY_RULES } from '../types';

export class SecurityScanner {
  private parser: TypeScriptParser;
  private logger: JudgeLogger;
  private rules: SecurityRule[];

  constructor(parser: TypeScriptParser, logger: JudgeLogger, ruleConfigs: SecurityRuleConfig[]) {
    this.parser = parser;
    this.logger = logger;

    // Filter and configure security rules
    this.rules = SECURITY_RULES.filter((rule) => {
      const config = ruleConfigs.find((c) => c.id === rule.id);
      return config?.enabled !== false;
    }).map((rule) => {
      const config = ruleConfigs.find((c) => c.id === rule.id);
      const severity = config?.severity || rule.severity;
      return {
        ...rule,
        severity: severity === 'warning' ? 'error' : severity, // Map warning to error for security
      } as SecurityRule;
    });

    this.logger.debug('security', `Loaded ${this.rules.length} security rules`);
  }

  /**
   * Scan source file for security vulnerabilities
   */
  scan(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    this.logger.debug('security', 'Starting security scan');

    const code = sourceFile.getFullText();

    // Run pattern-based scanning
    for (const rule of this.rules) {
      this.scanWithRule(rule, sourceFile, code, context);
    }

    this.logger.info('security', 'Security scan complete', {
      issuesFound: context.issues.filter((i) => i.type === 'security').length,
    });
  }

  /**
   * Scan using a specific security rule
   */
  private scanWithRule(rule: SecurityRule, sourceFile: ts.SourceFile, code: string, context: ASTAnalysisContext): void {
    let match: RegExpExecArray | null;

    // Reset regex for global search
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);

    while ((match = regex.exec(code)) !== null) {
      const position = match.index;

      // Get line and column
      const { line, column } = this.parser.getLineAndColumn(sourceFile, position);

      // Extract code snippet around the match
      const snippetStart = Math.max(0, position - 50);
      const snippetEnd = Math.min(code.length, position + match[0].length + 50);
      const snippet = code.substring(snippetStart, snippetEnd);

      const issue: ValidationIssue = {
        type: 'security',
        severity: rule.severity as 'critical' | 'error' | 'warning',
        location: {
          file: sourceFile.fileName,
          line,
          column,
        },
        message: rule.message,
        rule: rule.id,
        suggestion: rule.fix,
        codeSnippet: snippet,
      };

      context.issues.push(issue);

      // Update metrics
      if (issue.severity === 'critical') {
        context.metrics.security.criticalIssues++;
      } else if (issue.severity === 'error') {
        context.metrics.security.errorIssues++;
      } else {
        context.metrics.security.warningIssues++;
      }

      // Update category counts
      context.metrics.security.categories[rule.category]++;

      this.logger.debug('security', `Found ${rule.id} at line ${line}`);
    }
  }
}
