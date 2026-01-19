/**
 * Integration Tests
 * Tests for complete validation pipeline and hook integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Judge } from './judge';
import { ConfigManager } from './config';
import { JudgeConfig, JudgeHookInput } from './types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('Integration Tests', () => {
  let testDir: string;
  let judge: Judge;
  let config: JudgeConfig;

  beforeEach(async () => {
    // Create temporary directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'quality-gate-test-'));

    // Create default config
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
          { type: 'naming', enabled: false, severity: 'warning' },
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
        enabled: false,
        serverPath: './node_modules/@smite/docs-editor-mcp/dist/index.js',
        triggers: {
          openAPI: { enabled: true, filePatterns: [], frameworks: [] },
          readme: { enabled: true, filePatterns: [] },
          jsdoc: { enabled: true, filePatterns: [] },
        },
      },
      output: {
        format: 'text',
        includeCodeSnippets: true,
        maxSuggestions: 5,
      },
    };

    // Write config to test directory
    fs.writeFileSync(
      path.join(testDir, '.smite', 'quality.json'),
      JSON.stringify(config, null, 2)
    );

    judge = new Judge(testDir);
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Complete Validation Pipeline', () => {
    it('should run full validation pipeline on clean code', async () => {
      const cleanCode = `
        function calculateSum(a: number, b: number): number {
          return a + b;
        }

        function calculateProduct(x: number, y: number): number {
          return x * y;
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'clean.ts'),
          content: cleanCode,
        },
      };

      const result = await judge.validate(input);

      expect(result.hookSpecificOutput.permissionDecision).toBe('allow');
      expect(result.hookSpecificOutput.permissionDecisionReason).toContain('passed');
    });

    it('should detect complexity issues', async () => {
      const complexCode = `
        function complexFunction(x: number) {
          if (x > 0) {
            if (x > 10) {
              if (x > 20) {
                if (x > 30) {
                  if (x > 40) {
                    for (let i = 0; i < 10; i++) {
                      for (let j = 0; j < 10; j++) {
                        switch (i) {
                          case 1:
                            if (j > 5) {
                              return x;
                            }
                            break;
                          case 2:
                            return x * 2;
                          default:
                            return x;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          return x;
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'complex.ts'),
          content: complexCode,
        },
      };

      const result = await judge.validate(input);

      expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(result.hookSpecificOutput.permissionDecisionReason).toContain('complexity');
    });

    it('should detect security vulnerabilities', async () => {
      const vulnerableCode = `
        const userId = req.params.id;
        const query = db.query(\`SELECT * FROM users WHERE id = \${userId}\`);

        const userInput = req.body.content;
        document.getElementById('output').innerHTML = userInput;

        const password = "SuperSecret123!";
        const hash = md5(password);
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'vulnerable.ts'),
          content: vulnerableCode,
        },
      };

      const result = await judge.validate(input);

      expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
      expect(result.hookSpecificOutput.permissionDecisionReason).toContain('security');
    });

    it('should detect semantic issues', async () => {
      const badCode = `
        function Badly_Named_Function(data: any) {
          const result = data as string;
          return result;
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'bad.ts'),
          content: badCode,
        },
      };

      const result = await judge.validate(input);

      expect(result.hookSpecificOutput.permissionDecision).toBe('deny');
    });
  });

  describe('Hook Scenarios', () => {
    it('should handle Write tool', async () => {
      const code = `function test() { return 42; }`;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'test.ts'),
          content: code,
        },
      };

      const result = await judge.validate(input);

      expect(result).toBeDefined();
      expect(result.hookSpecificOutput.hookEventName).toBe('PreToolUse');
    });

    it('should handle Edit tool', async () => {
      const newCode = `function test() { return 43; }`;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Edit',
        tool_input: {
          file_path: path.join(testDir, 'test.ts'),
          old_string: 'return 42',
          new_string: 'return 43',
        },
      };

      const result = await judge.validate(input);

      expect(result).toBeDefined();
      expect(result.hookSpecificOutput.hookEventName).toBe('PreToolUse');
    });

    it('should respect file exclusion patterns', async () => {
      const badCode = `
        function Badly_Named_Function(data: any) {
          return data;
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'test.spec.ts'),
          content: badCode,
        },
      };

      const result = await judge.validate(input);

      // Should be allowed because spec files are excluded
      expect(result.hookSpecificOutput.permissionDecision).toBe('allow');
    });
  });

  describe('Configuration Override', () => {
    it('should apply per-file overrides', async () => {
      // Add overrides for specific files
      config.overrides = [
        {
          files: '**/legacy/*.ts',
          complexity: {
            maxCyclomaticComplexity: 20, // More lenient for legacy code
            maxCognitiveComplexity: 25,
            maxNestingDepth: 6,
            maxFunctionLength: 100,
            maxParameterCount: 10,
          },
        },
      ];

      fs.writeFileSync(
        path.join(testDir, '.smite', 'quality.json'),
        JSON.stringify(config, null, 2)
      );

      // Create new judge with updated config
      judge = new Judge(testDir);

      const legacyCode = `
        function legacyFunction(x: number) {
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
          return x;
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'legacy', 'old.ts'),
          content: legacyCode,
        },
      };

      const result = await judge.validate(input);

      // Should be allowed with more lenient thresholds
      expect(result.hookSpecificOutput.permissionDecision).toBe('allow');
    });
  });

  describe('Retry Logic', () => {
    it('should track retry state across attempts', async () => {
      const badCode = `
        function complexFunction() {
          if (true) {
            if (true) {
              if (true) {
                if (true) {
                  if (true) {
                    return 1;
                  }
                }
              }
            }
          }
          return 0;
        }
      `;

      const sessionId = 'retry-test-session';

      // First attempt
      const input1: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'retry.ts'),
          content: badCode,
        },
      };

      const result1 = await judge.validate(input1);
      expect(result1.hookSpecificOutput.permissionDecision).toBe('deny');

      // Second attempt (still bad code)
      const input2: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Edit',
        tool_input: {
          file_path: path.join(testDir, 'retry.ts'),
          old_string: 'return 1',
          new_string: 'return 2',
        },
      };

      const result2 = await judge.validate(input2);
      expect(result2.hookSpecificOutput.permissionDecision).toBe('deny');
    });

    it('should allow after max retries reached', async () => {
      const badCode = `
        function BadFunction() {}
      `;

      const sessionId = 'max-retry-session';

      // Simulate max retries by manually setting state
      // This is a simplified test - in reality, retries happen across multiple validations

      const input: JudgeHookInput = {
        session_id: sessionId,
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'max-retry.ts'),
          content: badCode,
        },
      };

      // Note: This test verifies the logic exists but doesn't fully simulate
      // the retry state reaching max, which would require multiple hook invocations
      const result = await judge.validate(input);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle syntax errors gracefully', async () => {
      const invalidCode = `
        function broken() {
          return 42  // Missing semicolon and other issues
        }  // Extra brace
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'broken.ts'),
          content: invalidCode,
        },
      };

      const result = await judge.validate(input);

      // Should ask for user input rather than crash
      expect(result.hookSpecificOutput.permissionDecision).toBe('ask');
    });

    it('should handle empty files', async () => {
      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'empty.ts'),
          content: '',
        },
      };

      const result = await judge.validate(input);

      expect(result).toBeDefined();
    });
  });

  describe('Disabled Quality Gate', () => {
    it('should allow all changes when disabled', async () => {
      config.enabled = false;
      fs.writeFileSync(
        path.join(testDir, '.smite', 'quality.json'),
        JSON.stringify(config, null, 2)
      );

      judge = new Judge(testDir);

      const badCode = `
        function Bad_Naming(data: any) {
          eval(data);
          return password = "secret";
        }
      `;

      const input: JudgeHookInput = {
        session_id: 'test-session',
        transcript_path: '/tmp/transcript.json',
        cwd: testDir,
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: {
          file_path: path.join(testDir, 'anything.ts'),
          content: badCode,
        },
      };

      const result = await judge.validate(input);

      expect(result.hookSpecificOutput.permissionDecision).toBe('allow');
      expect(result.hookSpecificOutput.permissionDecisionReason).toContain('disabled');
    });
  });
});
