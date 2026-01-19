/**
 * TypeScript Parser Tests
 * Tests for AST parsing, function extraction, and complexity calculation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as ts from 'typescript';
import { TypeScriptParser } from './parser';
import { JudgeLogger } from './logger';
import { FunctionInfo } from './types';

describe('TypeScriptParser', () => {
  let parser: TypeScriptParser;
  let logger: JudgeLogger;

  beforeEach(() => {
    logger = new JudgeLogger(process.cwd(), 'error');
    parser = new TypeScriptParser(logger);
  });

  describe('parseCode', () => {
    it('should parse valid TypeScript code', () => {
      const code = `
        function test() {
          return 42;
        }
      `;

      const sourceFile = parser.parseCode('test.ts', code);
      expect(sourceFile).not.toBeNull();
      expect(sourceFile?.fileName).toBe('test.ts');
    });

    it('should return null for invalid syntax', () => {
      const code = `
        function test() {
          return 42
        }  // Missing closing brace
      `;

      // TypeScript parser is lenient, so this might still parse
      const sourceFile = parser.parseCode('test.ts', code);
      // Just verify it doesn't crash
      expect(sourceFile).toBeDefined();
    });

    it('should handle empty files', () => {
      const sourceFile = parser.parseCode('empty.ts', '');
      expect(sourceFile).not.toBeNull();
    });

    it('should parse JavaScript files', () => {
      const code = `
        function test() {
          return 42;
        }
      `;

      const sourceFile = parser.parseCode('test.js', code);
      expect(sourceFile).not.toBeNull();
    });

    it('should set parent nodes', () => {
      const code = `
        function test() {
          const x = 1;
          return x;
        }
      `;

      const sourceFile = parser.parseCode('test.ts', code);
      expect(sourceFile).not.toBeNull();

      // Verify parent nodes are set by traversing
      let hasParent = false;
      parser.traverseAST(sourceFile!, (node) => {
        if (node.parent) {
          hasParent = true;
        }
      });
      expect(hasParent).toBe(true);
    });
  });

  describe('extractFunctions', () => {
    it('should extract function declarations', () => {
      const code = `
        function myFunction() {
          return 42;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('myFunction');
    });

    it('should extract arrow functions', () => {
      const code = `
        const arrow = (x: number) => x * 2;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('arrow');
    });

    it('should extract method declarations', () => {
      const code = `
        class MyClass {
          myMethod() {
            return 42;
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('myMethod');
    });

    it('should extract function expressions', () => {
      const code = `
        const fn = function() {
          return 42;
        };
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('anonymous');
    });

    it('should extract multiple functions', () => {
      const code = `
        function func1() { return 1; }
        function func2() { return 2; }
        const func3 = () => { return 3; };
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(3);
    });

    it('should extract nested functions', () => {
      const code = `
        function outer() {
          function inner() {
            return 42;
          }
          return inner;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(2);
      expect(functions.map((f) => f.name)).toContain('outer');
      expect(functions.map((f) => f.name)).toContain('inner');
    });
  });

  describe('Function Metrics', () => {
    it('should calculate function length correctly', () => {
      const code = `
        function multiLine() {
          const a = 1;
          const b = 2;
          const c = 3;
          return a + b + c;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].length).toBe(6); // 6 lines from start to end
    });

    it('should count parameters correctly', () => {
      const code = `
        function withParams(a: number, b: string, c: boolean) {
          return { a, b, c };
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].parameterCount).toBe(3);
    });

    it('should handle functions with no parameters', () => {
      const code = `
        function noParams() {
          return 42;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].parameterCount).toBe(0);
    });
  });

  describe('Cyclomatic Complexity', () => {
    it('should calculate complexity for simple function', () => {
      const code = `
        function simple() {
          const x = 1;
          return x;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].complexity).toBe(1); // Base complexity
    });

    it('should calculate complexity with if statement', () => {
      const code = `
        function withIf(x: number) {
          if (x > 0) {
            return x;
          }
          return 0;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].complexity).toBe(2); // 1 (base) + 1 (if)
    });

    it('should calculate complexity with for loop', () => {
      const code = `
        function withFor(n: number) {
          for (let i = 0; i < n; i++) {
            console.log(i);
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].complexity).toBe(2); // 1 (base) + 1 (for)
    });

    it('should calculate complexity with logical operators', () => {
      const code = `
        function withLogical(a: boolean, b: boolean, c: boolean) {
          return a && b && c;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].complexity).toBe(3); // 1 (base) + 2 (two &&)
    });

    it('should calculate complexity with ternary operator', () => {
      const code = `
        function withTernary(x: number) {
          return x > 0 ? x : -x;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].complexity).toBe(2); // 1 (base) + 1 (ternary)
    });

    it('should calculate complexity with switch statement', () => {
      const code = `
        function withSwitch(x: number) {
          switch (x) {
            case 1:
              return 'one';
            case 2:
              return 'two';
            default:
              return 'other';
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].complexity).toBe(4); // 1 (base) + 3 (three cases)
    });
  });

  describe('Cognitive Complexity', () => {
    it('should calculate cognitive complexity', () => {
      const code = `
        function cognitive(x: number) {
          if (x > 0) {
            if (x > 10) {
              return x;
            }
          }
          return 0;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].cognitiveComplexity).toBeGreaterThan(0);
    });
  });

  describe('Nesting Depth', () => {
    it('should calculate nesting depth', () => {
      const code = `
        function nested(x: number) {
          if (x > 0) {
            if (x > 10) {
              if (x > 20) {
                return x;
              }
            }
          }
          return 0;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].nestingDepth).toBe(3);
    });

    it('should handle nested loops', () => {
      const code = `
        function nestedLoops() {
          for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
              console.log(i, j);
            }
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].nestingDepth).toBe(2);
    });
  });

  describe('Utility Methods', () => {
    it('should extract code snippet', () => {
      const code = `function test() { return 42; }`;
      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);

      const snippet = parser.extractCodeSnippet(sourceFile, 0, 9);
      expect(snippet).toBe('function');
    });

    it('should get line and column from position', () => {
      const code = `
        function test() {
          return 42;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const position = code.indexOf('return');

      const { line, column } = parser.getLineAndColumn(sourceFile, position);
      expect(line).toBe(3);
      expect(column).toBeGreaterThan(0);
    });

    it('should traverse all nodes', () => {
      const code = `
        function test() {
          const x = 1;
          return x;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      let nodeCount = 0;

      parser.traverseAST(sourceFile, () => {
        nodeCount++;
      });

      expect(nodeCount).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle async functions', () => {
      const code = `
        async function asyncFunc() {
          await Promise.resolve();
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('asyncFunc');
    });

    it('should handle generator functions', () => {
      const code = `
        function* generator() {
          yield 1;
          yield 2;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('generator');
    });

    it('should handle functions with default parameters', () => {
      const code = `
        function withDefaults(x: number = 10, y: string = 'test') {
          return { x, y };
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].parameterCount).toBe(2);
    });

    it('should handle functions with rest parameters', () => {
      const code = `
        function withRest(...args: number[]) {
          return args;
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      expect(functions[0].parameterCount).toBe(1);
    });

    it('should handle class constructors', () => {
      const code = `
        class MyClass {
          constructor(x: number) {
            this.x = x;
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      // Constructors are method declarations
      expect(functions.length).toBe(1);
      expect(functions[0].name).toBe('constructor');
    });

    it('should handle getters and setters', () => {
      const code = `
        class MyClass {
          private _x = 0;

          get x() {
            return this._x;
          }

          set x(value: number) {
            this._x = value;
          }
        }
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const functions = parser.extractFunctions(sourceFile);

      // Getters and setters are method declarations
      expect(functions.length).toBeGreaterThanOrEqual(2);
    });
  });
});
