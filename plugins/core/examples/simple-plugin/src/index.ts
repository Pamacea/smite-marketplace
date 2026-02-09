/**
 * Simple SMITE Plugin Example
 *
 * Minimal plugin showing basic SMITE core integration.
 */

import { loadFromPluginRoot, ManifestLoader } from '@smite/core';

/**
 * Plugin entry point
 */
export async function load(): Promise<void> {
  // Load plugin manifests from current directory
  const loader = await loadFromPluginRoot([__dirname]);

  // Get this plugin's manifest
  const manifest = loader.get('simple-example');
  if (manifest) {
    console.log(`✅ Loaded ${manifest.name} v${manifest.version}`);
  }
}

/**
 * Plugin unload handler
 */
export async function unload(): Promise<void> {
  console.log('👋 Simple plugin unloaded');
}
