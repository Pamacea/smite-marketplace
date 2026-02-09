/**
 * Advanced SMITE Plugin - Hooks Example
 *
 * Demonstrates hook registration and lifecycle management.
 */

import {
  HookRegistry,
  getGlobalHookRegistry,
  type HookContext,
} from '@smite/core';

const PLUGIN_NAME = 'advanced-example';

/**
 * Register plugin hooks
 */
export function registerHooks(registry: HookRegistry): void {
  // Register plugin load hook
  registry.register('plugin.load', async (context: HookContext) => {
    console.log(`[Advanced] Plugin loaded: ${context.pluginName}`);
  }, PLUGIN_NAME);

  // Register config change hook
  registry.register('config.change', async (context: HookContext) => {
    console.log('[Advanced] Config changed, reloading...');
    await reloadConfig(context);
  }, PLUGIN_NAME, 10); // Higher priority

  // Register command.before hook
  registry.register('command.before', async (context: HookContext) => {
    console.log(`[Advanced] Before command: ${context.commandName}`);
  }, PLUGIN_NAME);
}

/**
 * Reload configuration
 */
async function reloadConfig(context: HookContext): Promise<void> {
  // Config reload logic here
  console.log('[Advanced] Configuration reloaded');
}
