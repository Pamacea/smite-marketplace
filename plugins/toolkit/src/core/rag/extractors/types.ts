/**
 * Shared types for extractor modules
 *
 * @module core/rag/extractors/types
 */

/**
 * Extraction modes
 */
export enum ExtractionMode {
  SIGNATURES = 'signatures',
  TYPES_ONLY = 'types',
  IMPORTS_ONLY = 'imports',
  EXPORTS_ONLY = 'exports',
  FULL = 'full',
}

/**
 * Extraction result
 */
export interface ExtractionResult {
  content: string;
  lines: number;
  functions: number;
  classes: number;
  types: number;
  imports: number;
}

/**
 * Surgeon configuration
 */
export interface SurgeonConfig {
  includeJSDoc: boolean;
  includeImports: boolean;
  includeExports: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_SURGEON_CONFIG: SurgeonConfig = {
  includeJSDoc: false,
  includeImports: true,
  includeExports: true,
};
