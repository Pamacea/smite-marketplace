/**
 * Semantic Checker Tests
 * Tests for semantic analysis including naming conventions, type consistency, etc.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as ts from 'typescript';
import { SemanticChecker } from './semantic';
import { TypeScriptParser } from '../parser';
import { JudgeLogger } from '../logger';
import { ASTAnalysisContext, SemanticCheckConfig, ValidationIssue } from '../types';

describe('SemanticChecker', () => {
  let parser: TypeScriptParser;
  let logger: JudgeLogger;

  beforeEach(() => {
    logger = new JudgeLogger(process.cwd(), 'error');
    parser = new TypeScriptParser(logger);
  });

  describe('Naming Conventions', () => {
    it('should enforce camelCase for functions', () => {
      const code = `
        function MyFunction() {
          return 42;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(true);
      expect(context.metrics.semantics.namingViolations).toBe(1);
    });

    it('should allow camelCase function names', () => {
      const code = `
        function myFunction() {
          return 42;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(false);
    });

    it('should allow private function names (starting with _)', () => {
      const code = `
        function _privateFunction() {
          return 42;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(false);
    });

    it('should enforce camelCase for variables', () => {
      const code = `
        const MyVariable = 42;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(true);
    });

    it('should allow UPPER_CASE constants', () => {
      const code = `
        const MAX_RETRIES = 3;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(false);
    });

    it('should provide correct suggestion for fixing naming', () => {
      const code = `
        function MyFunction() {}
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      const namingIssue = context.issues.find((i) => i.rule === 'semantic-naming-convention');
      expect(namingIssue?.suggestion).toContain("myFunction");
    });
  });

  describe('Type Consistency', () => {
    it('should detect "any" type usage', () => {
      const code = `
        function processData(data: any) {
          return data;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [
        { type: 'type-consistency', enabled: true, severity: 'error' },
      ];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-no-any')).toBe(true);
      expect(context.metrics.semantics.typeInconsistencies).toBe(1);
    });

    it('should allow specific types', () => {
      const code = `
        function processData(data: string) {
          return data;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [
        { type: 'type-consistency', enabled: true, severity: 'error' },
      ];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-no-any')).toBe(false);
    });

    it('should detect type assertions', () => {
      const code = `
        const value = unknownValue as string;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [
        { type: 'type-consistency', enabled: true, severity: 'error' },
      ];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'semantic-no-type-assertion')).toBe(true);
    });

    it('should provide suggestion for "any" type', () => {
      const code = `
        function processData(data: any) {
          return data;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [
        { type: 'type-consistency', enabled: true, severity: 'error' },
      ];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      const anyIssue = context.issues.find((i) => i.rule === 'semantic-no-any');
      expect(anyIssue?.suggestion).toContain('unknown');
    });
  });

  describe('Check Configuration', () => {
    it('should respect disabled checks', () => {
      const code = `
        function MyFunction() {}
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: false, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.length).toBe(0);
    });

    it('should support warning severity', () => {
      const code = `
        function MyFunction() {}
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'warning' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      const namingIssue = context.issues.find((i) => i.rule === 'semantic-naming-convention');
      expect(namingIssue?.severity).toBe('warning');
    });
  });

  describe('Edge Cases', () => {
    it('should handle anonymous functions', () => {
      const code = `
        const fn = function() {
          return 42;
        };
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      // Anonymous function declarations don't trigger naming violations
      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(false);
    });

    it('should handle arrow functions', () => {
      const code = `
        const Arrow_Function = () => {
          return 42;
        };
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'naming', enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      // Arrow functions aren't checked for naming (only variable names are)
      // The variable name should trigger a violation
      expect(context.issues.some((i) => i.rule === 'semantic-naming-convention')).toBe(true);
    });

    it('should handle empty files', () => {
      const code = ``;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [
        { type: 'naming', enabled: true, severity: 'error' },
        { type: 'type-consistency', enabled: true, severity: 'error' },
      ];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      expect(context.issues.length).toBe(0);
    });

    it('should handle unknown check types gracefully', () => {
      const code = `
        function myFunction() {}
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
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

      const checks: SemanticCheckConfig[] = [{ type: 'unknown-check' as any, enabled: true, severity: 'error' }];
      const checker = new SemanticChecker(parser, logger, checks);
      checker.check(sourceFile, context);

      // Unknown checks should not crash, just log warning
      expect(context.issues.length).toBe(0);
    });
  });
});
