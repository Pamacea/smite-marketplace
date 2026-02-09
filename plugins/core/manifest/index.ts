/**
 * SMITE Plugin Manifest System
 *
 * Central manifest exports for plugin dependency management.
 */

export { ManifestLoader, loadFromPluginRoot } from './loader';
export type { PluginManifest, DependencyGraph } from './loader';

/**
 * Current SMITE version
 * Matches marketplace.json version 1.5.1
 */
export const SMITE_VERSION = '1.5.1';

/**
 * Current core version
 */
export const CORE_VERSION = '1.5.1';
