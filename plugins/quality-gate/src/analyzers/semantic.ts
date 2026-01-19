/**
 * Semantic Consistency Checker
 * Check for API contract violations, type inconsistencies, and naming issues
 *
 * Note: This is a basic implementation for Phase 1.
 * Full integration with SemanticAnalysisAPI will be added in Phase 2.
 */

import * as ts from 'typescript';
import { TypeScriptParser } from '../parser';
import { JudgeLogger } from '../logger';
import { ASTAnalysisContext, ValidationIssue, SemanticCheckConfig } from '../types';

export class SemanticChecker {
  private parser: TypeScriptParser;
  private logger: JudgeLogger;
  private checks: SemanticCheckConfig[];

  constructor(parser: TypeScriptParser, logger: JudgeLogger, checks: SemanticCheckConfig[]) {
    this.parser = parser;
    this.logger = logger;
    this.checks = checks.filter((c) => c.enabled);
  }

  /**
   * Perform semantic analysis on source file
   */
  check(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    this.logger.debug('semantic', 'Starting semantic analysis');

    for (const checkConfig of this.checks) {
      switch (checkConfig.type) {
        case 'naming':
          this.checkNaming(sourceFile, context, checkConfig);
          break;
        case 'type-consistency':
          this.checkTypeConsistency(sourceFile, context, checkConfig);
          break;
        case 'api-contract':
          this.logger.debug('semantic', 'API contract checking not yet implemented (Phase 2)');
          break;
        case 'duplicate-code':
          this.logger.debug('semantic', 'Duplicate code checking not yet implemented (Phase 2)');
          break;
        default:
          this.logger.warn('semantic', `Unknown check type: ${checkConfig.type}`);
      }
    }

    this.logger.info('semantic', 'Semantic analysis complete', {
      issuesFound: context.issues.filter((i) => i.type === 'semantic').length,
    });
  }

  /**
   * Check for naming convention violations
   */
  private checkNaming(sourceFile: ts.SourceFile, context: ASTAnalysisContext, config: SemanticCheckConfig): void {
    this.parser.traverseAST(sourceFile, (node) => {
      // Check function names (should be camelCase)
      if (ts.isFunctionDeclaration(node) && node.name) {
        const name = node.name.getText();
        if (!this.isCamelCase(name) && !this.isPrivate(name)) {
          const { line, column } = this.parser.getLineAndColumn(sourceFile, node.name.getStart());
          const issue: ValidationIssue = {
            type: 'semantic',
            severity: config.severity as 'error' | 'warning',
            location: {
              file: sourceFile.fileName,
              line,
              column,
            },
            message: `Function '${name}' should use camelCase naming convention`,
            rule: 'semantic-naming-convention',
            suggestion: `Rename function to '${this.toCamelCase(name)}'`,
          };
          context.issues.push(issue);
          context.metrics.semantics.namingViolations++;
        }
      }

      // Check variable declarations
      if (ts.isVariableStatement(node)) {
        const declarations = node.declarationList.declarations;
        for (const decl of declarations) {
          if (ts.isIdentifier(decl.name)) {
            const name = decl.name.getText();
            if (!this.isCamelCase(name) && !this.isConstant(name)) {
              const { line, column } = this.parser.getLineAndColumn(sourceFile, decl.name.getStart());
              const issue: ValidationIssue = {
                type: 'semantic',
                severity: config.severity as 'error' | 'warning',
                location: {
                  file: sourceFile.fileName,
                  line,
                  column,
                },
                message: `Variable '${name}' should use camelCase naming convention`,
                rule: 'semantic-naming-convention',
                suggestion: `Rename variable to '${this.toCamelCase(name)}'`,
              };
              context.issues.push(issue);
              context.metrics.semantics.namingViolations++;
            }
          }
        }
      }
    });
  }

  /**
   * Check for basic type inconsistencies
   * Note: Full type checking requires TypeScript type checker integration (Phase 2)
   */
  private checkTypeConsistency(sourceFile: ts.SourceFile, context: ASTAnalysisContext, config: SemanticCheckConfig): void {
    this.parser.traverseAST(sourceFile, (node) => {
      // Check for 'any' type usage by checking keyword type
      if (node.kind === ts.SyntaxKind.AnyKeyword) {
        const { line, column } = this.parser.getLineAndColumn(sourceFile, node.getStart());
        const issue: ValidationIssue = {
          type: 'semantic',
          severity: config.severity as 'error' | 'warning',
          location: {
            file: sourceFile.fileName,
            line,
            column,
          },
          message: 'Avoid using "any" type - it reduces type safety',
          rule: 'semantic-no-any',
          suggestion: 'Use specific types or "unknown" with type guards',
        };
        context.issues.push(issue);
        context.metrics.semantics.typeInconsistencies++;
      }

      // Check for explicit type assertions (as)
      if (ts.isAsExpression(node)) {
        const { line, column } = this.parser.getLineAndColumn(sourceFile, node.getStart());
        const issue: ValidationIssue = {
          type: 'semantic',
          severity: 'warning',
          location: {
            file: sourceFile.fileName,
            line,
            column,
          },
          message: 'Type assertion detected - consider using type guards instead',
          rule: 'semantic-no-type-assertion',
          suggestion: 'Use type guards or proper type inference',
        };
        context.issues.push(issue);
        context.metrics.semantics.typeInconsistencies++;
      }
    });
  }

  /**
   * Helper: Check if name is camelCase
   */
  private isCamelCase(name: string): boolean {
    return /^[a-z][a-zA-Z0-9]*$/.test(name);
  }

  /**
   * Helper: Check if name is private (starts with _)
   */
  private isPrivate(name: string): boolean {
    return name.startsWith('_');
  }

  /**
   * Helper: Check if name is constant (UPPER_CASE)
   */
  private isConstant(name: string): boolean {
    return /^[A-Z][A-Z0-9_]*$/.test(name);
  }

  /**
   * Helper: Convert to camelCase
   */
  private toCamelCase(name: string): string {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }
}
