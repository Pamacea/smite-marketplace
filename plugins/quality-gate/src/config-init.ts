/**
 * Configuration Initialization CLI
 * Interactive command-line interface for generating quality-gate configuration
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { JudgeConfig, DEFAULT_CONFIG } from './types';
import { OverridePresets } from './config-overrides';

/**
 * Project type detection result
 */
interface ProjectDetection {
  type: 'nodejs' | 'python' | 'mixed' | 'unknown';
  frameworks: string[];
  hasTests: boolean;
  testFramework?: string;
}

/**
 * Interactive CLI for configuration initialization
 */
export class ConfigInitCLI {
  private rl: readline.Interface;
  private configPath: string;

  constructor(cwd: string) {
    this.configPath = path.join(cwd, '.claude', '.smite', 'quality.json');
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Start interactive configuration
   */
  async initialize(): Promise<void> {
    console.log('\n========================================');
    console.log('  Smite Quality Gate Configuration');
    console.log('========================================\n');

    // Check if config already exists
    if (fs.existsSync(this.configPath)) {
      const overwrite = await this.question(
        'Configuration file already exists. Overwrite? (y/N): ',
      );
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Aborting.');
        this.rl.close();
        return;
      }
    }

    // Detect project type
    const detection = this.detectProject();
    console.log(`\nDetected project type: ${detection.type}`);
    if (detection.frameworks.length > 0) {
      console.log(`Detected frameworks: ${detection.frameworks.join(', ')}`);
    }

    // Generate config based on detection and user input
    const config = await this.generateConfig(detection);

    // Save configuration
    this.saveConfig(config);

    console.log('\n✓ Configuration saved to:', this.configPath);
    console.log('\nYou can now customize the configuration by editing the file manually.');
    console.log('See documentation for all available options.\n');

    this.rl.close();
  }

  /**
   * Detect project type and characteristics
   */
  private detectProject(): ProjectDetection {
    const cwd = process.cwd();
    const result: ProjectDetection = {
      type: 'unknown',
      frameworks: [],
      hasTests: false,
    };

    // Check for Node.js
    if (fs.existsSync(path.join(cwd, 'package.json'))) {
      result.type = 'nodejs';

      // Detect frameworks
      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(cwd, 'package.json'), 'utf-8'),
      );

      const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };

      if (deps.express) result.frameworks.push('express');
      if (deps.next || deps['next.js']) result.frameworks.push('nextjs');
      if (deps.fastify) result.frameworks.push('fastify');
      if (deps.koa) result.frameworks.push('koa');

      // Detect test frameworks
      if (deps.jest) {
        result.hasTests = true;
        result.testFramework = 'jest';
      }
      if (deps.vitest) {
        result.hasTests = true;
        result.testFramework = 'vitest';
      }
      if (deps.mocha) {
        result.hasTests = true;
        result.testFramework = 'mocha';
      }
    }

    // Check for Python
    if (fs.existsSync(path.join(cwd, 'requirements.txt')) || fs.existsSync(path.join(cwd, 'pyproject.toml'))) {
      if (result.type === 'nodejs') {
        result.type = 'mixed';
      } else {
        result.type = 'python';
      }

      // Detect pytest
      if (fs.existsSync(path.join(cwd, 'pytest.ini')) || fs.existsSync(path.join(cwd, 'pyproject.toml'))) {
        result.hasTests = true;
        result.testFramework = 'pytest';
      }
    }

    return result;
  }

  /**
   * Generate configuration based on detection and user input
   */
  private async generateConfig(detection: ProjectDetection): Promise<JudgeConfig> {
    const config: JudgeConfig = { ...DEFAULT_CONFIG };

    // Ask about enabling quality gate
    const enabled = await this.question('Enable quality gate? (Y/n): ');
    config.enabled = enabled.toLowerCase() !== 'n';

    if (!config.enabled) {
      return config;
    }

    // Log level
    const logLevel = await this.question(
      'Log level (debug/info/warn/error) [default: info]: ',
    );
    if (['debug', 'info', 'warn', 'error'].includes(logLevel)) {
      config.logLevel = logLevel as any;
    }

    // File patterns
    console.log('\n--- File Patterns ---');
    const includePatterns = await this.question(
      'Include patterns (comma-separated) [default: **/*.ts,**/*.tsx,**/*.js,**/*.jsx]: ',
    );
    if (includePatterns.trim()) {
      config.include = includePatterns.split(',').map(s => s.trim());
    }

    const excludePatterns = await this.question(
      'Exclude patterns (comma-separated) [default: **/*.test.ts,**/*.spec.ts,**/node_modules/**]: ',
    );
    if (excludePatterns.trim()) {
      config.exclude = excludePatterns.split(',').map(s => s.trim());
    }

    // Complexity
    console.log('\n--- Complexity Analysis ---');
    const enableComplexity = await this.question('Enable complexity analysis? (Y/n): ');
    if (enableComplexity.toLowerCase() === 'n') {
      // Set very high thresholds to effectively disable
      config.complexity.maxCyclomaticComplexity = 999;
      config.complexity.maxCognitiveComplexity = 999;
    } else {
      const complexity = await this.question(
        'Max cyclomatic complexity [default: 10]: ',
      );
      if (complexity.trim()) {
        config.complexity.maxCyclomaticComplexity = parseInt(complexity, 10);
      }
    }

    // Security
    console.log('\n--- Security Scanning ---');
    const enableSecurity = await this.question('Enable security scanning? (Y/n): ');
    config.security.enabled = enableSecurity.toLowerCase() !== 'n';

    // Tests
    console.log('\n--- Automated Testing ---');
    if (detection.hasTests) {
      console.log(`Detected test framework: ${detection.testFramework}`);
      const enableTests = await this.question('Enable automated test execution? (y/N): ');
      config.tests.enabled = enableTests.toLowerCase() === 'y';
      if (config.tests.enabled && detection.testFramework) {
        config.tests.framework = detection.testFramework as any;
      }
    } else {
      console.log('No test framework detected. You can enable tests later.');
    }

    // MCP integration
    console.log('\n--- Documentation MCP ---');
    const enableMCP = await this.question('Enable documentation MCP triggers? (y/N): ');
    config.mcp.enabled = enableMCP.toLowerCase() === 'y';

    if (config.mcp.enabled && detection.frameworks.length > 0) {
      console.log(`\nDetected frameworks: ${detection.frameworks.join(', ')}`);
      const enableOpenAPI = await this.question('Enable OpenAPI docs for API routes? (Y/n): ');
      config.mcp.triggers.openAPI.enabled = enableOpenAPI.toLowerCase() !== 'y';
    }

    // Overrides
    console.log('\n--- Configuration Overrides ---');
    const useOverrides = await this.question('Add preset overrides for different file types? (Y/n): ');
    if (useOverrides.toLowerCase() !== 'n') {
      const overrides: any[] = [];

      const coreOverride = await this.question('Add stricter rules for core files? (Y/n): ');
      if (coreOverride.toLowerCase() !== 'n') {
        overrides.push(OverridePresets.coreFiles());
      }

      const testOverride = await this.question('Add lenient rules for test files? (Y/n): ');
      if (testOverride.toLowerCase() !== 'n') {
        overrides.push(OverridePresets.testFiles());
      }

      if (overrides.length > 0) {
        (config as any).overrides = overrides;
      }
    }

    return config;
  }

  /**
   * Save configuration to file
   */
  private saveConfig(config: JudgeConfig): void {
    const configDir = path.dirname(this.configPath);

    // Create .smite directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Write config with comments (using JSON with comments format)
    const configWithComments = this.formatConfigWithComments(config);
    fs.writeFileSync(this.configPath, configWithComments, 'utf-8');
  }

  /**
   * Format configuration with documentation comments
   */
  private formatConfigWithComments(config: JudgeConfig): string {
    return `{
  // Master toggle for the quality gate system
  "enabled": ${config.enabled},

  // Logging verbosity: debug, info, warn, error
  "logLevel": "${config.logLevel}",

  // Maximum retry attempts when validation fails
  "maxRetries": ${config.maxRetries},

  // Glob patterns for files to include in validation
  "include": ${JSON.stringify(config.include, null, 2)},

  // Glob patterns for files to exclude from validation
  "exclude": ${JSON.stringify(config.exclude, null, 2)},

  // Complexity analysis thresholds
  "complexity": ${JSON.stringify(config.complexity, null, 2)},

  // Semantic analysis configuration
  "semantics": ${JSON.stringify(config.semantics, null, 2)},

  // Security vulnerability scanning
  "security": ${JSON.stringify(config.security, null, 2)},

  // Automated test execution
  "tests": ${JSON.stringify(config.tests, null, 2)},

  // MCP documentation integration
  "mcp": ${JSON.stringify(config.mcp, null, 2)},

  // Output formatting options
  "output": ${JSON.stringify(config.output, null, 2)}
  ${(config as any).overrides ? ',\n  "overrides": ' + JSON.stringify((config as any).overrides, null, 2) : ''}
}`;
  }

  /**
   * Ask a question and get user input
   */
  private question(query: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(query, answer => {
        resolve(answer.trim());
      });
    });
  }
}

/**
 * Generate configuration programmatically without CLI
 */
export function generateConfig(options: {
  projectType?: 'nodejs' | 'python' | 'mixed';
  enableTests?: boolean;
  testFramework?: string;
  enableMCP?: boolean;
  frameworks?: string[];
  strictness?: 'strict' | 'moderate' | 'lenient';
}): JudgeConfig {
  const config: JudgeConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  // Adjust strictness
  if (options.strictness === 'strict') {
    config.complexity.maxCyclomaticComplexity = 5;
    config.complexity.maxCognitiveComplexity = 8;
    config.complexity.maxNestingDepth = 3;
  } else if (options.strictness === 'lenient') {
    config.complexity.maxCyclomaticComplexity = 20;
    config.complexity.maxCognitiveComplexity = 30;
    config.complexity.maxNestingDepth = 6;
  }

  // Enable tests
  if (options.enableTests) {
    config.tests.enabled = true;
    if (options.testFramework) {
      config.tests.framework = options.testFramework as any;
    }
  }

  // Enable MCP
  if (options.enableMCP) {
    config.mcp.enabled = true;
  }

  // Framework-specific adjustments
  if (options.frameworks?.includes('nextjs')) {
    config.include.push('**/*.tsx');
    config.mcp.triggers.openAPI.frameworks = ['nextjs'];
  }

  return config;
}

/**
 * Main entry point for CLI
 */
export async function initConfig(cwd: string = process.cwd()): Promise<void> {
  const cli = new ConfigInitCLI(cwd);
  await cli.initialize();
}

// Run if called directly
if (require.main === module) {
  initConfig().catch(error => {
    console.error('Error initializing configuration:', error);
    process.exit(1);
  });
}
