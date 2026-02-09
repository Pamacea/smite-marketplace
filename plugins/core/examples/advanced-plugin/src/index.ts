/**
 * Advanced SMITE Plugin Example
 *
 * Full-featured plugin demonstrating all core capabilities.
 */

import {
  HookRegistry,
  ConfigManager,
  SchemaValidator,
  PlatformDetector,
  TemplateEngine,
  Logger,
  getGlobalHookRegistry,
  type PluginConfig,
} from '@smite/core';

import { registerHooks } from './hooks';
import { loadConfig, validateConfig } from './config';
import { validateUserInput } from './validation';

const PLUGIN_NAME = 'advanced-example';
const logger = new Logger(undefined, 'AdvancedPlugin');

/**
 * Plugin entry point
 */
export async function load(): Promise<void> {
  logger.info('Loading advanced plugin...');

  // 1. Register hooks
  const registry = getGlobalHookRegistry();
  registerHooks(registry);
  logger.info('Hooks registered');

  // 2. Load configuration
  const config = await loadConfig();
  logger.info('Configuration loaded');

  // 3. Validate configuration
  const isValid = await validateConfig(config);
  if (!isValid) {
    logger.warn('Using default configuration');
  }

  // 4. Detect platform
  const detector = new PlatformDetector();
  const platform = detector.detect();
  logger.info('Running on', platform.os, platform.arch);

  // 5. Test template engine
  const engine = new TemplateEngine();
  const output = engine.process('Hello {{name}}!', { name: 'SMITE' });
  logger.info('Template test:', output);

  // 6. Test validation
  await validateUserInput({
    name: 'John Doe',
    email: '[email protected]',
    age: 30,
  });

  logger.info('Advanced plugin loaded successfully');
}

/**
 * Plugin unload handler
 */
export async function unload(): Promise<void> {
  const registry = getGlobalHookRegistry();
  registry.unregisterPlugin(PLUGIN_NAME);

  logger.info('Advanced plugin unloaded');
}
