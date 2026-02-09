/**
 * Advanced SMITE Plugin - Configuration Example
 *
 * Demonstrates configuration loading, merging, and validation.
 */

import {
  ConfigManager,
  type PluginConfig,
} from '@smite/core';

const PLUGIN_NAME = 'advanced-example';

/**
 * Load and validate plugin configuration
 */
export async function loadConfig(): Promise<PluginConfig> {
  const configManager = new ConfigManager();

  // Load config with environment overrides
  const config = await configManager.loadPluginConfig(PLUGIN_NAME, {
    env: process.env.NODE_ENV,
  });

  console.log('[Advanced] Configuration loaded:', config);

  return config;
}

/**
 * Validate configuration against schema
 */
export async function validateConfig(config: PluginConfig): Promise<boolean> {
  const configManager = new ConfigManager();

  // Validate against schema
  const result = await configManager.validateConfig(
    config,
    'plugins/core/validation/schemas/plugin-config.schema.json'
  );

  if (!result.valid) {
    console.error('[Advanced] Config validation failed:', result.errors);
    return false;
  }

  console.log('[Advanced] Configuration validated');
  return true;
}
