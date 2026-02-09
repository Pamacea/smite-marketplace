/**
 * SMITE Configuration Manager
 *
 * Load, merge, and validate plugin configurations with inheritance and overrides.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

export interface PluginConfig {
  [key: string]: unknown;
}

export interface ConfigLoadOptions {
  env?: string;
  overrides?: PluginConfig;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Configuration Manager for SMITE plugins
 */
export class ConfigManager {
  private cache = new Map<string, PluginConfig>();

  /**
   * Load plugin configuration from .claude/.smite/
   */
  async loadPluginConfig(
    pluginName: string,
    options: ConfigLoadOptions = {}
  ): Promise<PluginConfig> {
    const cacheKey = `${pluginName}-${options.env || 'default'}`;

    // Return cached config if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Build config path hierarchy
    const configPaths = this.getConfigPaths(pluginName, options.env);

    // Load and merge configs
    let mergedConfig: PluginConfig = {};

    for (const configPath of configPaths) {
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(content) as PluginConfig;
        mergedConfig = this.mergeConfigs(mergedConfig, config);
      } catch (error) {
        // File doesn't exist or is invalid - continue with defaults
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.warn(`[ConfigManager] Failed to load ${configPath}:`, error);
        }
      }
    }

    // Apply environment variable substitutions
    mergedConfig = this.substituteEnvVars(mergedConfig);

    // Apply overrides if provided
    if (options.overrides) {
      mergedConfig = this.mergeConfigs(mergedConfig, options.overrides);
    }

    // Cache the result
    this.cache.set(cacheKey, mergedConfig);

    return mergedConfig;
  }

  /**
   * Get config file paths in priority order (low to high)
   */
  private getConfigPaths(pluginName: string, env?: string): string[] {
    const smiteRoot = process.env.SMOTE_ROOT || '.claude/.smite';
    const paths: string[] = [];

    // Base config (lowest priority)
    paths.push(path.join(smiteRoot, `${pluginName}.json`));

    // Environment-specific config
    if (env) {
      paths.push(path.join(smiteRoot, `${pluginName}.${env}.json`));
    }

    // Local override (highest priority)
    paths.push(path.join(smiteRoot, 'local', `${pluginName}.json`));

    return paths;
  }

  /**
   * Deep merge multiple configurations
   * Later configs override earlier ones
   */
  mergeConfigs(...configs: PluginConfig[]): PluginConfig {
    return configs.reduce((merged, config) => {
      return this.deepMerge(merged, config);
    }, {});
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(target: PluginConfig, source: PluginConfig): PluginConfig {
    const result = { ...target };

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (this.isObject(sourceValue) && this.isObject(targetValue)) {
        result[key] = this.deepMerge(
          targetValue as PluginConfig,
          sourceValue as PluginConfig
        );
      } else {
        result[key] = sourceValue;
      }
    }

    return result;
  }

  /**
   * Substitute environment variables in config values
   * Supports ${VAR_NAME} syntax
   */
  private substituteEnvVars(config: PluginConfig): PluginConfig {
    if (typeof config === 'string') {
      return config.replace(/\$\{([^}]+)\}/g, (_, varName) => {
        return process.env[varName] || `\${${varName}}`;
      }) as PluginConfig;
    }

    if (Array.isArray(config)) {
      return config.map(item => this.substituteEnvVars(item)) as PluginConfig;
    }

    if (this.isObject(config)) {
      const result: PluginConfig = {};
      for (const [key, value] of Object.entries(config)) {
        result[key] = this.substituteEnvVars(value);
      }
      return result;
    }

    return config;
  }

  /**
   * Validate config against JSON schema (basic validation)
   */
  async validateConfig(
    config: unknown,
    schemaPath: string
  ): Promise<ValidationResult> {
    try {
      // Load schema
      const schemaContent = await fs.readFile(schemaPath, 'utf-8');
      const schema = JSON.parse(schemaContent);

      // Basic validation (for now - can be enhanced with ajv or similar)
      const errors: string[] = [];

      if (this.isObject(config)) {
        // Check required fields from schema
        if (schema.required) {
          for (const required of schema.required) {
            if (!(required in config)) {
              errors.push(`Missing required field: ${required}`);
            }
          }
        }

        // Check types based on schema properties
        if (schema.properties) {
          for (const [prop, propSchema] of Object.entries(schema.properties)) {
            if (prop in config) {
              const value = (config as PluginConfig)[prop];
              const propDef = propSchema as { type?: string; enum?: string[] };

              if (propDef.type && typeof value !== propDef.type) {
                errors.push(
                  `${prop}: Expected ${propDef.type}, got ${typeof value}`
                );
              }

              if (propDef.enum && !propDef.enum.includes(value as string)) {
                errors.push(
                  `${prop}: Must be one of ${propDef.enum.join(', ')}`
                );
              }
            }
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Failed to load schema: ${error}`],
      };
    }
  }

  /**
   * Clear config cache (useful for hot-reload)
   */
  clearCache(pluginName?: string): void {
    if (pluginName) {
      // Clear all cached entries for this plugin
      for (const key of this.cache.keys()) {
        if (key.startsWith(pluginName)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Check if value is a plain object
   */
  private isObject(value: unknown): value is PluginConfig {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof RegExp)
    );
  }
}
