/**
 * SMITE Core Infrastructure
 *
 * Shared utilities, configuration, hooks, validation, platform detection,
 * templates, and error handling for all SMITE plugins.
 *
 * @version 1.5.1
 */

// Manifest System
export { ManifestLoader, loadFromPluginRoot } from '../manifest/loader';
export type { PluginManifest, DependencyGraph } from '../manifest/loader';
export { SMITE_VERSION, CORE_VERSION } from '../manifest';

// Configuration Manager
export { ConfigManager } from './config/loader';
export type { PluginConfig, ConfigLoadOptions, ValidationResult } from './config/loader';

// Hook Registry
export {
  HookRegistry,
  getGlobalHookRegistry,
} from './hooks/registry';
export type { HookEvent, HookContext, HookHandler, HookRegistration } from './hooks/registry';

// Runtime Validation
export { SchemaValidator } from './validation/validator';
export type { ValidationResult as SchemaValidationResult, SchemaDefinition } from './validation/validator';

// Platform Detection
export {
  PlatformDetector,
  getGlobalPlatformDetector,
  getPlatformInfo,
} from './platform/detector';
export type { PlatformInfo, OSType, ShellType, PlatformFeature } from './platform/detector';

// Template Engine
export { TemplateEngine } from './template/engine';
export type { TemplateContext, TemplateOptions } from './template/engine';

// Utilities
export { Logger, LogLevel, getGlobalLogger } from './utils/logger';
export type { LogEntry } from './utils/logger';

export {
  SmiteError,
  ValidationError,
  ConfigurationError,
  PluginLoadError,
  ErrorHandler,
  tryCatch,
  tryCatchSync,
} from './utils/error';

export {
  parseSemver,
  formatSemver,
  compareVersions,
  satisfiesVersion,
  bumpVersion,
  getVersionRange,
} from './utils/version';
export type { Semver } from './utils/version';
