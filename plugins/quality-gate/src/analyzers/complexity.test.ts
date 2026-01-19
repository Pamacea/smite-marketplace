/**
 * Complexity Analyzer Tests
 * Tests for cyclomatic complexity, cognitive complexity, and nesting depth analysis
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as ts from 'typescript';
import { ComplexityAnalyzer } from './complexity';
import { TypeScriptParser } from '../parser';
import { JudgeLogger } from '../logger';
import { ASTAnalysisContext, ComplexityThresholds, ValidationIssue } from '../types';

describe('ComplexityAnalyzer', () => {
  let parser: TypeScriptParser;
  let logger: JudgeLogger;
  let thresholds: ComplexityThresholds;

  beforeEach(() => {
    logger = new JudgeLogger(process.cwd(), 'error');
    parser = new TypeScriptParser(logger);
    thresholds = {
      maxCyclomaticComplexity: 10,
      maxCognitiveComplexity: 15,
      maxNestingDepth: 4,
      maxFunctionLength: 50,
      maxParameterCount: 5,
    };
  });

  describe('Cyclomatic Complexity', () => {
    it('should calculate complexity of 1 for simple function', () => {
      const code = `
        function simpleFunction() {
          const x = 1;
          return x;
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

      const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
      analyzer.analyze(sourceFile, context);

      expect(context.metrics.complexity.cyclomaticComplexity).toBe(1);
      expect(context.issues.length).toBe(0);
    });

    it('should detect high cyclomatic complexity', () => {
      const code = `
        function complexFunction(x: number) {
          if (x > 0) {
            if (x > 10) {
              for (let i = 0; i < x; i++) {
                switch (i) {
                  case 1:
                    break;
                  case 2:
                    break;
                  default:
                    break;
                }
              }
            }
          } else if (x < 0) {
            while (x < 0) {
              x++;
            }
          }
          return x;
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

      const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
      analyzer.analyze(sourceFile, context);

      expect(context.metrics.complexity.cyclomaticComplexity).toBeGreaterThan(10);
      expect(context.issues.some((i) => i.rule === 'complexity-max-complexity')).toBe(true);
    });

    it('should count decision points correctly', () => {
      const code = `
        function countDecisionPoints(a: boolean, b: boolean, c: boolean) {
          if (a) {                  // +1
            if (b) {                // +1
              for (let i = 0; i < 10; i++) { // +1
                if (c) {            // +1
                  return true;
                }
              }
            }
          }
          return a && b && c;       // +2 for two &&
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions[0].complexity).toBe(6); // 1 (base) + 5 decision points
    });

    it('should handle ternary operators', () => {
      const code = `
        function ternaryTest(x: number) {
          return x > 0 ? x : -x;  // +1 for ternary
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions[0].complexity).toBe(2); // 1 (base) + 1 (ternary)
    });
  });

  describe('Cognitive Complexity', () => {
    it('should calculate cognitive complexity', () => {
      const code = `
        function cognitiveTest(x: number) {
          if (x > 0) {        // +1 (nesting 0)
            if (x > 10) {     // +1 (nesting 1) +1 = 2
              return x;       // nesting level 2
            }
          }
          return x;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions[0].cognitiveComplexity).toBeGreaterThan(0);
    });

    it('should detect high cognitive complexity', () => {
      const code = `
        function highCognitive(x: number) {
          if (x > 0) {
            if (x > 10) {
              if (x > 20) {
                if (x > 30) {
                  for (let i = 0; i < 10; i++) {
                    if (i > 5) {
                      return x;
                    }
                  }
                }
              }
            }
          }
          return x;
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

      const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
      analyzer.analyze(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'complexity-max-cognitive-complexity')).toBe(true);
    });
  });

  describe('Nesting Depth', () => {
    it('should calculate nesting depth', () => {
      const code = `
        function nestingTest(x: number) {
          if (x > 0) {        // depth 1
            if (x > 10) {     // depth 2
              for (let i = 0; i < 10; i++) { // depth 3
                if (i > 5) {  // depth 4
                  return x;
                }
              }
            }
          }
          return x;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions[0].nestingDepth).toBe(4);
    });

    it('should detect excessive nesting', () => {
      const code = `
        function deeplyNested(x: number) {
          if (x > 0) {
            if (x > 10) {
              if (x > 20) {
                if (x > 30) {
                  if (x > 40) {  // depth 5 - exceeds threshold
                    return x;
                  }
                }
              }
            }
          }
          return x;
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

      const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
      analyzer.analyze(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'complexity-max-nesting')).toBe(true);
      const nestingIssue = context.issues.find((i) => i.rule === 'complexity-max-nesting');
      expect(nestingIssue?.severity).toBe('warning');
    });
  });

  describe('Function Length', () => {
    it('should calculate function length', () => {
      const code = `
        function longFunction() {
          const a = 1;
          const b = 2;
          const c = 3;
          const d = 4;
          const e = 5;
          return a + b + c + d + e;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions[0].length).toBeGreaterThan(0);
    });

    it('should detect excessive function length', () => {
      // Create a function with 60 lines
      const lines = Array.from({ length: 60 }, (_, i) => `  const x${i} = ${i};`).join('\n');
      const code = `
        function veryLongFunction() {
${lines}
          return sum;
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

      const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
      analyzer.analyze(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'complexity-max-length')).toBe(true);
    });
  });

  describe('Parameter Count', () => {
    it('should count function parameters', () => {
      const code = `
        function paramTest(a: number, b: number, c: number) {
          return a + b + c;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions[0].parameterCount).toBe(3);
    });

    it('should detect excessive parameter count', () => {
      const code = `
        function tooManyParams(
          a: number,
          b: number,
          c: number,
          d: number,
          e: number,
          f: number
        ) {
          return a + b + c + d + e + f;
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

      const analyzer = new ComplexityAnalyzer(parser, logger, thresholds);
      analyzer.analyze(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'complexity-max-parameters')).toBe(true);
    });
  });

  describe('Arrow Functions', () => {
    it('should analyze arrow functions', () => {
      const code = `
        const arrow = (x: number) => {
          if (x > 0) {
            return x;
          }
          return 0;
        };
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('arrow');
    });

    it('should analyze concise arrow functions', () => {
      const code = `
        const concise = (x: number) => x * 2;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('arrow');
    });
  });

  describe('Method Declarations', () => {
    it('should analyze class methods', () => {
      const code = `
        class MyClass {
          myMethod(x: number) {
            return x * 2;
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('myMethod');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty function', () => {
      const code = `
        function empty() {}
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
      expect(functions[0].complexity).toBe(1);
    });

    it('should handle function with no return', () => {
      const code = `
        function noReturn(x: number) {
          const y = x * 2;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
    });

    it('should handle async functions', () => {
      const code = `
        async function asyncFunction() {
          await Promise.resolve();
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('asyncFunction');
    });

    it('should handle generator functions', () => {
      const code = `
        function* generatorFunction() {
          yield 1;
          yield 2;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('generatorFunction');
    });
  });
});
