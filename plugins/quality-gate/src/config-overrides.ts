/**
 * Configuration Override System
 * Manages per-file and per-directory configuration overrides
 */

import * as path from 'path';
import { JudgeConfig } from './types';
import { ConfigManager } from './config';

/**
 * Override configuration for specific files or directories
 */
export interface OverrideConfig {
  /**
   * Glob pattern matching files this override applies to.
   * Supports glob patterns with wildcards for flexible matching.
   */
  files: string;

  /**
   * Override complexity thresholds for these files
   */
  complexity?: Partial<JudgeConfig['complexity']>;

  /**
   * Override security rules for these files
   */
  security?: Partial<JudgeConfig['security']>;

  /**
   * Override semantic checks for these files
   */
  semantics?: Partial<JudgeConfig['semantics']>;

  /**
   * Override test configuration for these files
   */
  tests?: Partial<JudgeConfig['tests']>;
}

/**
 * Manages configuration overrides with pattern matching and priority resolution
 */
export class OverrideManager {
  private overrides: Array<{
    pattern: string;
    config: OverrideConfig;
    priority: number;
  }> = [];

  /**
   * Add an override configuration
   * @param config Override configuration
   * @param priority Priority (higher = more specific, overrides lower). Defaults to 0.
   */
  addOverride(config: OverrideConfig, priority: number = 0): void {
    this.overrides.push({
      pattern: config.files,
      config,
      priority,
    });

    // Sort by priority (highest first) for efficient matching
    this.overrides.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove all overrides matching a pattern
   */
  removeOverrides(pattern: string): void {
    this.overrides = this.overrides.filter(o => o.pattern !== pattern);
  }

  /**
   * Clear all overrides
   */
  clearOverrides(): void {
    this.overrides = [];
  }

  /**
   * Get the most specific override for a given file path
   * Returns the override with the highest priority that matches the file
   */
  getOverrideForFile(filePath: string): OverrideConfig | undefined {
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Find the highest priority override that matches
    for (const override of this.overrides) {
      if (this.matchPattern(normalizedPath, override.pattern)) {
        return override.config;
      }
    }

    return undefined;
  }

  /**
   * Apply overrides to base configuration for a specific file
   * @param baseConfig Base configuration
   * @param filePath File path to get overrides for
   * @returns Configuration with overrides applied
   */
  applyOverrides(baseConfig: JudgeConfig, filePath: string): JudgeConfig {
    const override = this.getOverrideForFile(filePath);

    if (!override) {
      return baseConfig;
    }

    return this.mergeOverride(baseConfig, override);
  }

  /**
   * Merge override configuration with base configuration
   */
  private mergeOverride(base: JudgeConfig, override: OverrideConfig): JudgeConfig {
    const result: JudgeConfig = { ...base };

    if (override.complexity) {
      result.complexity = { ...base.complexity, ...override.complexity };
    }

    if (override.security) {
      result.security = {
        ...base.security,
        ...override.security,
        rules: override.security.rules || base.security.rules,
      };
    }

    if (override.semantics) {
      result.semantics = {
        ...base.semantics,
        ...override.semantics,
        checks: override.semantics.checks || base.semantics.checks,
      };
    }

    if (override.tests) {
      result.tests = { ...base.tests, ...override.tests };
    }

    return result;
  }

  /**
   * Check if a file path matches a glob pattern
   */
  private matchPattern(filePath: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }

  /**
   * Get all override patterns
   */
  getPatterns(): string[] {
    return this.overrides.map(o => o.pattern);
  }

  /**
   * Get override count
   */
  getCount(): number {
    return this.overrides.length;
  }
}

/**
 * Preset override configurations for common scenarios
 */
export const OverridePresets = {
  /**
   * Stricter rules for core/critical files
   */
  coreFiles: (): OverrideConfig => ({
    files: '**/core/**/*.ts',
    complexity: {
      maxCyclomaticComplexity: 5,
      maxCognitiveComplexity: 8,
      maxNestingDepth: 3,
      maxFunctionLength: 30,
      maxParameterCount: 4,
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
  }),

  /**
   * More lenient rules for test files
   */
  testFiles: (): OverrideConfig => ({
    files: '**/*.test.ts',
    complexity: {
      maxCyclomaticComplexity: 15,
      maxCognitiveComplexity: 20,
      maxNestingDepth: 5,
      maxFunctionLength: 100,
      maxParameterCount: 8,
    },
    semantics: {
      enabled: false,
      checks: [],
    },
    security: {
      enabled: false,
      rules: [],
    },
  }),

  /**
   * API routes with higher security
   */
  apiRoutes: (): OverrideConfig => ({
    files: '**/api/**/*.ts',
    complexity: {
      maxCyclomaticComplexity: 8,
      maxFunctionLength: 40,
    },
    security: {
      enabled: true,
      rules: [
        { id: 'sql-injection', enabled: true },
        { id: 'xss-vulnerability', enabled: true },
        { id: 'hardcoded-secret', enabled: true },
      ],
    },
  }),

  /**
   * Legacy code with relaxed rules (for gradual improvement)
   */
  legacyCode: (pattern: string): OverrideConfig => ({
    files: pattern,
    complexity: {
      maxCyclomaticComplexity: 20,
      maxCognitiveComplexity: 30,
      maxNestingDepth: 6,
      maxFunctionLength: 100,
    },
    semantics: {
      enabled: false,
      checks: [],
    },
  }),

  /**
   * Configuration files (minimal validation)
   */
  configFiles: (): OverrideConfig => ({
    files: '**/*.config.{js,ts}',
    complexity: {
      maxCyclomaticComplexity: 15,
      maxFunctionLength: 75,
    },
    semantics: {
      enabled: false,
      checks: [],
    },
  }),
};

/**
 * Helper to load overrides from configuration file format
 */
export function loadOverrides(overrides: OverrideConfig[]): OverrideManager {
  const manager = new OverrideManager();

  for (const override of overrides) {
    // Calculate priority based on pattern specificity
    const priority = calculatePatternPriority(override.files);
    manager.addOverride(override, priority);
  }

  return manager;
}

/**
 * Calculate pattern specificity for priority
 * More specific patterns get higher priority
 */
function calculatePatternPriority(pattern: string): number {
  let priority = 0;

  // More path segments = more specific
  const segments = pattern.split('/').filter(s => s !== '**' && s !== '*');
  priority += segments.length * 10;

  // Fewer wildcards = more specific
  const wildcardCount = (pattern.match(/\*/g) || []).length;
  priority -= wildcardCount * 5;

  // File extensions increase specificity
  if (pattern.includes('.')) {
    priority += 5;
  }

  return priority;
}
