/**
 * Test Runner Module
 * Executes and parses test output from multiple test frameworks
 *
 * Supports:
 * - Jest (JavaScript/TypeScript)
 * - Vitest (JavaScript/TypeScript)
 * - Mocha (JavaScript/TypeScript)
 * - pytest (Python)
 */

import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { JudgeLogger } from './logger';
import { TestResults, TestConfig, TestFailure, FrameworkDetection } from './types';

export class TestRunner {
  private logger: JudgeLogger;
  private cwd: string;

  constructor(logger: JudgeLogger, cwd: string) {
    this.logger = logger;
    this.cwd = cwd;
  }

  /**
   * Main entry point - run tests based on config
   */
  async runTests(config: TestConfig): Promise<TestResults> {
    const startTime = Date.now();

    // Check if test execution is enabled
    if (!config.enabled) {
      this.logger.debug('test-runner', 'Test execution is disabled in configuration');
      return {
        passed: true,
        skipped: true,
        framework: 'none',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        failures: [],
        executionTimeMs: 0,
      };
    }

    // Detect test framework if not specified
    const framework = config.framework || (await this.detectFramework());

    if (framework === 'none') {
      this.logger.info('test-runner', 'No test framework detected, skipping test execution');
      return {
        passed: true,
        skipped: true,
        framework: 'none',
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        failures: [],
        executionTimeMs: 0,
      };
    }

    this.logger.info('test-runner', `Running tests with ${framework}`, {
      command: config.command || 'auto-detected',
      timeout: config.timeoutMs,
    });

    try {
      // Execute tests
      const command = config.command || this.getDefaultCommand(framework);
      const result = await this.executeTestCommand(command, config.timeoutMs);

      // Parse output based on framework
      const parsed = this.parseTestOutput(result.stdout, result.stderr, framework);

      const executionTimeMs = Date.now() - startTime;

      this.logger.info('test-runner', `Test execution completed`, {
        framework,
        total: parsed.totalTests,
        passed: parsed.passedTests,
        failed: parsed.failedTests,
        time: executionTimeMs,
      });

      return {
        ...parsed,
        executionTimeMs,
      };
    } catch (error) {
      this.logger.error('test-runner', 'Test execution failed', error);

      // Return failure results
      return {
        passed: false,
        skipped: false,
        framework,
        totalTests: 0,
        passedTests: 0,
        failedTests: 1,
        skippedTests: 0,
        failures: [
          {
            testFile: 'unknown',
            testName: 'Test Execution Error',
            message: error instanceof Error ? error.message : String(error),
            stackTrace: error instanceof Error ? error.stack : undefined,
            line: 0,
            column: 0,
          },
        ],
        executionTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Get default test command for framework
   */
  private getDefaultCommand(framework: FrameworkDetection): string {
    switch (framework) {
      case 'jest':
        return 'npm test --';
      case 'vitest':
        return 'npm test --';
      case 'mocha':
        return 'npm test';
      case 'pytest':
        return 'pytest';
      default:
        return 'npm test';
    }
  }

  /**
   * Detect the test framework used in the project
   */
  private async detectFramework(): Promise<FrameworkDetection> {
    const packageJsonPath = path.join(this.cwd, 'package.json');

    // Check for package.json (Node.js projects)
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

        // Check for Jest
        if (deps.jest || deps['@jest/globals']) {
          this.logger.debug('test-runner', 'Detected Jest framework');
          return 'jest';
        }

        // Check for Vitest
        if (deps.vitest) {
          this.logger.debug('test-runner', 'Detected Vitest framework');
          return 'vitest';
        }

        // Check for Mocha
        if (deps.mocha) {
          this.logger.debug('test-runner', 'Detected Mocha framework');
          return 'mocha';
        }

        // Check for test scripts
        if (packageJson.scripts) {
          const testScript = packageJson.scripts.test || '';
          if (testScript.includes('jest')) return 'jest';
          if (testScript.includes('vitest')) return 'vitest';
          if (testScript.includes('mocha')) return 'mocha';
        }
      } catch (error) {
        this.logger.warn('test-runner', 'Failed to read package.json', error);
      }
    }

    // Check for pytest (Python projects)
    const pyprojectToml = path.join(this.cwd, 'pyproject.toml');
    const requirementsTxt = path.join(this.cwd, 'requirements.txt');
    const setupPy = path.join(this.cwd, 'setup.py');

    if (
      fs.existsSync(pyprojectToml) ||
      fs.existsSync(requirementsTxt) ||
      fs.existsSync(setupPy)
    ) {
      // Check if pytest is installed
      try {
        const result = await this.executeCommand('pytest', ['--version'], 5000);
        if (result.stdout.includes('pytest')) {
          this.logger.debug('test-runner', 'Detected pytest framework');
          return 'pytest';
        }
      } catch {
        // pytest not found
      }
    }

    this.logger.debug('test-runner', 'No test framework detected');
    return 'none';
  }

  /**
   * Execute test command and capture output
   */
  private async executeTestCommand(
    command: string,
    timeoutMs: number
  ): Promise<{ stdout: string; stderr: string; exitCode: number | null }> {
    return new Promise((resolve, reject) => {
      const [cmd, ...args] = command.split(' ');

      this.logger.debug('test-runner', `Executing command: ${cmd} ${args.join(' ')}`);

      const child = spawn(cmd, args, {
        cwd: this.cwd,
        shell: true,
        env: {
          ...process.env,
          // Force CI mode for consistent output
          CI: 'true',
          // Disable colors for parsing
          FORCE_COLOR: '0',
          NO_COLOR: '1',
        },
      });

      let stdout = '';
      let stderr = '';
      let killed = false;

      // Set timeout
      const timeout = setTimeout(() => {
        this.logger.warn('test-runner', `Test execution timeout after ${timeoutMs}ms`);
        child.kill('SIGTERM');
        killed = true;
      }, timeoutMs);

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timeout);
        resolve({ stdout, stderr, exitCode: killed ? -1 : code });
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Execute a simple command (for framework detection)
   */
  private async executeCommand(
    command: string,
    args: string[],
    timeoutMs: number
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: this.cwd,
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
      }, timeoutMs);

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', () => {
        clearTimeout(timeout);
        resolve({ stdout, stderr });
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Parse test output based on framework
   */
  private parseTestOutput(
    stdout: string,
    stderr: string,
    framework: FrameworkDetection
  ): Omit<TestResults, 'executionTimeMs'> {
    const output = stdout + '\n' + stderr;

    switch (framework) {
      case 'jest':
        return this.parseJestOutput(output);
      case 'vitest':
        return this.parseVitestOutput(output);
      case 'mocha':
        return this.parseMochaOutput(output);
      case 'pytest':
        return this.parsePytestOutput(output);
      default:
        return {
          passed: true,
          skipped: true,
          framework: 'none',
          totalTests: 0,
          passedTests: 0,
          failedTests: 0,
          skippedTests: 0,
          failures: [],
        };
    }
  }

  /**
   * Parse Jest output
   */
  private parseJestOutput(output: string): Omit<TestResults, 'executionTimeMs'> {
    const failures: TestFailure[] = [];
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    // Try to parse JSON output first
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const json = JSON.parse(jsonMatch[0]);
        if (json.testResults) {
          // Jest JSON format
          for (const suite of json.testResults) {
            for (const result of suite.assertionResults) {
              totalTests++;
              if (result.status === 'passed') passedTests++;
              else if (result.status === 'failed') {
                failedTests++;
                failures.push({
                  testFile: suite.name,
                  testName: result.title.join(' > '),
                  message: result.failureMessages?.join('\n') || 'Unknown error',
                  stackTrace: result.failureMessages?.join('\n'),
                  line: 0,
                  column: 0,
                });
              } else if (result.status === 'skipped') {
                skippedTests++;
              }
            }
          }
        }
      } catch {
        // Not JSON, fall through to text parsing
      }
    }

    // Parse text output
    if (totalTests === 0) {
      // Extract test counts
      const testsMatch = output.match(/Tests:\s+(\d+)\s+total,/);
      if (testsMatch) {
        totalTests = parseInt(testsMatch[1], 10);
      }

      const passedMatch = output.match(/passed:\s+(\d+)/);
      if (passedMatch) {
        passedTests = parseInt(passedMatch[1], 10);
      }

      const failedMatch = output.match(/failed:\s+(\d+)/);
      if (failedMatch) {
        failedTests = parseInt(failedMatch[1], 10);
      }

      // Extract failures
      const failureBlocks = output.split(/●|✗/);
      for (const block of failureBlocks) {
        if (block.includes('Expected:') || block.includes('Received:')) {
          const lines = block.trim().split('\n');
          const testName = lines[0]?.trim() || 'Unknown test';
          const message = lines.slice(1, 5).join('\n').trim();

          // Extract file location
          const fileMatch = block.match(/(.+?):(\d+):(\d+)/);
          const testFile = fileMatch?.[1] || 'unknown';
          const line = fileMatch?.[2] ? parseInt(fileMatch[2], 10) : 0;
          const column = fileMatch?.[3] ? parseInt(fileMatch[3], 10) : 0;

          failures.push({
            testFile,
            testName,
            message: message || 'Test failed',
            stackTrace: block,
            line,
            column,
          });
        }
      }
    }

    return {
      passed: failedTests === 0,
      skipped: false,
      framework: 'jest',
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      failures,
    };
  }

  /**
   * Parse Vitest output
   */
  private parseVitestOutput(output: string): Omit<TestResults, 'executionTimeMs'> {
    const failures: TestFailure[] = [];
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    // Vitest has similar output to Jest, reuse Jest parser
    const jestResult = this.parseJestOutput(output);
    return {
      ...jestResult,
      framework: 'vitest',
    };
  }

  /**
   * Parse Mocha output
   */
  private parseMochaOutput(output: string): Omit<TestResults, 'executionTimeMs'> {
    const failures: TestFailure[] = [];
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    // Extract test counts
    const passingMatch = output.match(/(\d+)\s+passing/);
    if (passingMatch) {
      passedTests = parseInt(passingMatch[1], 10);
    }

    const failingMatch = output.match(/(\d+)\s+failing/);
    if (failingMatch) {
      failedTests = parseInt(failingMatch[1], 10);
    }

    const pendingMatch = output.match(/(\d+)\s+pending/);
    if (pendingMatch) {
      skippedTests = parseInt(pendingMatch[1], 10);
    }

    totalTests = passedTests + failedTests + skippedTests;

    // Extract failures
    const failurePattern = /(\d+)\)\s+([^\n]+)\n\s+Error:\s+([^\n]+)(?:\n\s+at\s+([^\n]+?):?(\d+)?:?(\d+)?)/g;
    let match;

    while ((match = failurePattern.exec(output)) !== null) {
      const [, index, testName, message, file, line, column] = match;

      failures.push({
        testFile: file || 'unknown',
        testName: testName.trim(),
        message: message.trim(),
        stackTrace: match[0],
        line: line ? parseInt(line, 10) : 0,
        column: column ? parseInt(column, 10) : 0,
      });
    }

    return {
      passed: failedTests === 0,
      skipped: false,
      framework: 'mocha',
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      failures,
    };
  }

  /**
   * Parse pytest output
   */
  private parsePytestOutput(output: string): Omit<TestResults, 'executionTimeMs'> {
    const failures: TestFailure[] = [];
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;

    // Extract summary line
    const summaryMatch = output.match(/(\d+)\s+passed,\s*(\d+)\s*failed(?:,\s*(\d+)\s*skipped)?/);
    if (summaryMatch) {
      passedTests = parseInt(summaryMatch[1], 10);
      failedTests = parseInt(summaryMatch[2], 10);
      skippedTests = summaryMatch[3] ? parseInt(summaryMatch[3], 10) : 0;
      totalTests = passedTests + failedTests + skippedTests;
    }

    // Extract failures
    const failureSections = output.split(/FAILED\s+/);
    for (const section of failureSections) {
      if (!section.includes('::')) continue;

      const lines = section.trim().split('\n');
      const header = lines[0] || '';
      const testNameMatch = header.match(/(.+?)::(.+)/);

      if (testNameMatch) {
        const testFile = testNameMatch[1];
        const testName = testNameMatch[2];

        // Extract error message (usually after the header)
        const messageLines = lines.slice(1, 10);
        const message = messageLines.join('\n').trim();

        // Extract line number from header or error
        const lineMatch = header.match(/:(\d+)/);
        const line = lineMatch ? parseInt(lineMatch[1], 10) : 0;

        failures.push({
          testFile,
          testName,
          message: message || 'Test failed',
          stackTrace: section,
          line,
          column: 0,
        });
      }
    }

    return {
      passed: failedTests === 0,
      skipped: false,
      framework: 'pytest',
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      failures,
    };
  }
}
