/**
 * Refactoring Types
 *
 * Type definitions for the refactoring API.
 *
 * @module api/refactor-types
 */

/**
 * Refactoring type
 */
export enum RefactorType {
  SIMPLIFY = 'simplify',
  REMOVE_DEAD_CODE = 'remove_dead_code',
  OPTIMIZE_STRUCTURE = 'optimize_structure',
  RENAME_VARIABLES = 'rename_variables',
  EXTRACT_FUNCTION = 'extract_function',
}

/**
 * Refactoring result
 */
export interface RefactorResult {
  /** Type of refactoring performed */
  type: RefactorType;

  /** Files modified */
  modifiedFiles: string[];

  /** Number of changes made */
  changeCount: number;

  /** Success status */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Diff of changes */
  diff?: string;

  /** Backup file path */
  backupPath?: string;
}

/**
 * Refactoring options
 */
export interface RefactorOptions {
  /** Whether to create backup */
  createBackup?: boolean;

  /** Whether to apply changes */
  applyChanges?: boolean;

  /** Maximum file size to process (bytes) */
  maxFileSize?: number;

  /** File patterns to include */
  includePatterns?: string[];

  /** File patterns to exclude */
  excludePatterns?: string[];

  /** Dry run (don't modify files) */
  dryRun?: boolean;
}

/**
 * Code complexity metrics
 */
export interface ComplexityMetrics {
  /** Cyclomatic complexity */
  cyclomatic: number;

  /** Nesting depth */
  nestingDepth: number;

  /** Function length */
  functionLength: number;

  /** Parameter count */
  parameterCount: number;
}
