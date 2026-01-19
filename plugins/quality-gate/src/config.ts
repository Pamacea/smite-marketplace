/**
 * Configuration Management
 * Load and validate judge configuration from .smite/quality.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { JudgeConfig, DEFAULT_CONFIG } from './types';

export class ConfigManager {
  private configPath: string;
  private config: JudgeConfig;

  constructor(cwd: string) {
    this.configPath = path.join(cwd, '.smite', 'quality.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from file or use defaults
   */
  private loadConfig(): JudgeConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const fileContent = fs.readFileSync(this.configPath, 'utf-8');
        const userConfig = JSON.parse(fileContent);
        return this.mergeConfigs(DEFAULT_CONFIG, userConfig);
      }
    } catch (error) {
      console.error(`[Judge] Error loading config from ${this.configPath}:`, error);
      console.error('[Judge] Using default configuration');
    }
    return { ...DEFAULT_CONFIG };
  }

  /**
   * Merge user config with defaults (user config takes precedence)
   */
  private mergeConfigs(defaults: JudgeConfig, user: Partial<JudgeConfig>): JudgeConfig {
    return {
      ...defaults,
      ...user,
      complexity: { ...defaults.complexity, ...user.complexity },
      semantics: {
        ...defaults.semantics,
        ...user.semantics,
        checks: user.semantics?.checks || defaults.semantics.checks,
      },
      security: {
        ...defaults.security,
        rules: user.security?.rules || defaults.security.rules,
      },
      output: { ...defaults.output, ...user.output },
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): JudgeConfig {
    return this.config;
  }

  /**
   * Check if a file should be validated based on include/exclude patterns
   */
  shouldValidateFile(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Check exclude patterns first
    for (const pattern of this.config.exclude) {
      if (this.matchPattern(normalizedPath, pattern)) {
        return false;
      }
    }

    // Check include patterns
    for (const pattern of this.config.include) {
      if (this.matchPattern(normalizedPath, pattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Simple glob pattern matching (supports * and ** wildcards)
   */
  private matchPattern(filePath: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }
}
