/**
 * End-to-End Tests
 * Complete workflow tests: code production -> critique -> doc update
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Judge } from './judge';
import { ConfigManager } from './config';
import { JudgeConfig, JudgeHookInput } from './types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('E2E Tests', () => {
  let testDir: string;
  let judge: Judge;
  let config: JudgeConfig;

  beforeEach(async () => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quality-gate-e2e-'));

    // Create project structure
    fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
    fs.mkdirSync(path.join(testDir, '.smite'), { recursive: true });

    // Create comprehensive config
    config = {
      enabled: true,
      logLevel: 'error',
      maxRetries: 3,
      include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
      complexity: {
        maxCyclomaticComplexity: 10,
        maxCognitiveComplexity: 15,
        maxNestingDepth: 4,
        maxFunctionLength: 50,
        maxParameterCount: 5,
      },
      semantics: {
        enabled: true,
        checks: [
          { type: 'api-contract', enabled: true, severity: 'error' },
          { type: 'type-consistency', enabled: true, severity: 'error' },
          { type: 'naming', enabled: true, severity: 'warning' },
        ],
      },
      security: {
        enabled: true,
        rules: [
          { id: 'sql-injection', enabled: true },
          { id: 'xss-vulnerability', enabled: true },
          { id: 'weak-crypto', enabled: true },
          { id: 'hardcoded-secret', enabled: true },
        ],
      },
      tests: {
        enabled: false,
        timeoutMs: 60000,
        failOnTestFailure: true,
      },
      mcp: {
        enabled: false, // Disabled for E2E tests (no MCP server running)
        serverPath: './node_modules/@smite/docs-editor-mcp/dist/index.js',
        triggers: {
          openAPI: { enabled: true, filePatterns: ['**/routes/**/*.ts'], frameworks: ['express'] },
          readme: { enabled: true, filePatterns: ['**/src/**/*.ts'] },
          jsdoc: { enabled: true, filePatterns: ['**/*.ts'] },
        },
      },
      output: {
        format: 'text',
        includeCodeSnippets: true,
        maxSuggestions: 5,
      },
    };

    fs.writeFileSync(
      path.join(testDir, '.smite', 'quality.json'),
      JSON.stringify(config, null, 2)
    );

    judge = new Judge(testDir);
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Complete Workflow: Production to Critique to Fix', () => {
    it('should detect issues, provide feedback, and allow corrected code', async () => {
      const sessionId = 'e2e-workflow-session';

      // Step 1: Initial problematic code
      const problematicCode = `
        function processData(data: any) {
          const userId = req.params.id;
          const query = db.query(\`SELECT * FROM users WHERE id = \${userId}\`);

          if (data.value > 0) {
            if (data.value > 10) {
              if (data.value > 20) {
                if (data.value > 30) {
                  if (data.value > 40) {
                    return query;
                  }
                }
              }
            }
          }
          return null;
        }
      `;

      const input1: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'src', 'processor.ts'),
          content: problematicCode,
        },
      };

      const result1 = await judge.validate(input1);

      // Should deny due to multiple issues
      expect(result1.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(result1.hookSpecificOutput.permissionDecisionReason).toBeTruthy();

      // Step 2: Fixed code addressing all issues
      const fixedCode = `
        interface ProcessDataOptions {
          value: number;
        }

        function processData(options: ProcessDataOptions): number | null {
          const userId = req.params.id;
          // Use parameterized query instead
          const query = db.query('SELECT * FROM users WHERE id = ?', [userId]);

          // Reduced nesting depth
          if (options.value <= 0) {
            return null;
          }
          if (options.value <= 10) {
            return null;
          }
          if (options.value <= 20) {
            return null;
          }
          if (options.value <= 30) {
            return null;
          }
          if (options.value <= 40) {
            return null;
          }

          return options.value;
        }
      `;

      const input2: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Edit',
        tool_input: {
          file_path: path.join(testDir, 'src', 'processor.ts'),
          old_string: problematicCode,
          new_string: fixedCode,
        },
      };

      const result2 = await judge.validate(input2);

      // Should allow after fixes
      expect(result2.hookSpecificOutput.permissionDecision).toBe('allow');
    });

    it('should handle iterative improvements', async () => {
      const sessionId = 'iterative-session';

      // Iteration 1: High complexity
      const code1 = `
        function complex(x: number) {
          if (x > 0) {
            if (x > 10) {
              if (x > 20) {
                if (x > 30) {
                  if (x > 40) {
                    return x;
                  }
                }
              }
            }
          }
          return 0;
        }
      `;

      const input1: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'src', 'iterative.ts'),
          content: code1,
        },
      };

      const result1 = await judge.validate(input1);
      expect(result1.hookSpecificOutput.permissionDecision).toBe('deny');

      // Iteration 2: Reduced complexity
      const code2 = `
        function complex(x: number) {
          if (x <= 0) return 0;
          if (x <= 10) return 0;
          if (x <= 20) return 0;
          if (x <= 30) return 0;
          if (x <= 40) return 0;
          return x;
        }
      `;

      const input2: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Edit',
        tool_input: {
          file_path: path.join(testDir, 'src', 'iterative.ts'),
          old_string: code1,
          new_string: code2,
        },
      };

      const result2 = await judge.validate(input2);
      expect(result2.hookSpecificOutput.permissionDecision).toBe('allow');
    });
  });

  describe('Real-World Scenarios', () => {
    it('should validate Express API route', async () => {
      const expressRoute = `
        import { Request, Response } from 'express';

        export async function getUserHandler(req: Request, res: Response): Promise<void> {
          const userId = req.params.id;

          // SQL injection vulnerability
          const user = await db.query(\`SELECT * FROM users WHERE id = \${userId}\`);

          // XSS vulnerability
          res.send(\`<div>Welcome \${user.name}</div>\`);

          return;
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'express-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'routes', 'users.ts'),
          content: expressRoute,
        },
      };

      const result = await judge.validate(input);

      // Should detect security vulnerabilities
      expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(result.hookSpecificOutput.permissionDecisionReason).toBeTruthy();
    });

    it('should validate React component', async () => {
      const reactComponent = `
        import React from 'react';

        interface UserProfileProps {
          data: any;
          name: string;
        }

        export function UserProfile(props: UserProfileProps) {
          const content = props.data;

          return (
            <div>
              {/* XSS vulnerability */}
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <h1>{props.name}</h1>
            </div>
          );
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'react-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'components', 'UserProfile.tsx'),
          content: reactComponent,
        },
      };

      const result = await judge.validate(input);

      // Should detect XSS and semantic issues
      expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
    });

    it('should validate utility library', async () => {
      const utilityCode = `
        /**
         * Format a date to ISO string
         */
        export function formatDate(dateInput: any): string {
          const date = dateInput as Date;
          return date.toISOString();
        }

        /**
         * Calculate sum of numbers
         */
        function Calculate_Sum(numbers: number[]): number {
          return numbers.reduce((a, b) => a + b, 0);
        }

        export const MAX_RETRIES = 3;
        export const API_URL = 'https://api.example.com';
      `;

      const input: JudgeHookInput = {
        session_id: 'utility-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'src', 'utils.ts'),
          content: utilityCode,
        },
      };

      const result = await judge.validate(input);

      // Should detect semantic issues
      expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
    });
  });

  describe('Performance with Real Codebases', () => {
    it('should handle multiple files efficiently', async () => {
      const files = [
        {
          path: path.join(testDir, 'src', 'file1.ts'),
          content: `export function func1() { return 1; }`,
        },
        {
          path: path.join(testDir, 'src', 'file2.ts'),
          content: `export function func2() { return 2; }`,
        },
        {
          path: path.join(testDir, 'src', 'file3.ts'),
          content: `export function func3() { return 3; }`,
        },
      ];

      const startTime = Date.now();

      for (const file of files) {
        const input: JudgeHookInput = {
          session_id: 'multi-file-session',
          transcript_path: '/tmp/transcript.json',
          cwd: testDir,
          hook_event_name: 'PreToolUse',
          tool_name: 'Write',
          tool_input: {
            file_path: file.path,
            content: file.content,
          },
        };

        await judge.validate(input);
      }

      const duration = Date.now() - startTime;

      // Should complete in reasonable time (< 5 seconds for 3 simple files)
      expect(duration).toBeLessThan(5000);
    });

    it('should handle large file', async () => {
      // Generate a moderately large file
      const lines: string[] = [];
      for (let i = 0; i < 100; i++) {
        lines.push(`
          export function function${i}(param1: number, param2: string): boolean {
            if (param1 > ${i}) {
              return true;
            }
            return false;
          }
        `);
      }

      const largeCode = lines.join('\n');

      const input: JudgeHookInput = {
        session_id: 'large-file-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'src', 'large.ts'),
          content: largeCode,
        },
      };

      const startTime = Date.now();
      const result = await judge.validate(input);
      const duration = Date.now() - startTime;

      expect(result).toBeDefined();
      // Should complete in reasonable time (< 10 seconds)
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Edge Cases and Corner Cases', () => {
    it('should handle TypeScript with all type features', async () => {
      const advancedTypes = `
        type ComplexType = {
          [K in keyof ObjectType]: ObjectType[K];
        };

        interface GenericInterface<T> {
          value: T;
          getValue(): T;
        }

        export class GenericClass<T extends string> implements GenericInterface<T> {
          constructor(public value: T) {}

          getValue(): T {
            return this.value;
          }

          async transform<R>(fn: (val: T) => Promise<R>): Promise<R> {
            return fn(this.value);
          }
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'advanced-types-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'src', 'generics.ts'),
          content: advancedTypes,
        },
      };

      const result = await judge.validate(input);

      expect(result).toBeDefined();
    });

    it('should handle decorators and experimental features', async () => {
      const decoratorCode = `
        function sealed(constructor: Function) {
          Object.seal(constructor);
          Object.seal(constructor.prototype);
        }

        @sealed
        class MyClass {
          @log
          method() {
            return 42;
          }
        }

        function log(target: any, key: string, descriptor: PropertyDescriptor) {
          const original = descriptor.value;
          descriptor.value = function (...args: any[]) {
            console.log(\`Called \${key}\`);
            return original.apply(this, args);
          };
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'decorators-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'src', 'decorators.ts'),
          content: decoratorCode,
        },
      };

      const result = await judge.validate(input);

      expect(result).toBeDefined();
    });
  });
});
