/**
 * Documentation Types
 *
 * Type definitions and templates for the documentation API.
 *
 * @module api/docs-types
 */

/**
 * Documentation format
 */
export enum DocFormat {
  JSDOC = 'jsdoc',
  MARKDOWN = 'markdown',
  HTML = 'html',
  JSON = 'json',
}

/**
 * Documentation result
 */
export interface DocumentationResult {
  /** Format of documentation */
  format: DocFormat;

  /** Generated documentation */
  content: string;

  /** Files documented */
  files: string[];

  /** Success status */
  success: boolean;

  /** Error message if failed */
  error?: string;

  /** Output file path (if saved) */
  outputPath?: string;
}

/**
 * Documentation options
 */
export interface DocumentationOptions {
  /** Output format */
  format?: DocFormat;

  /** Whether to include examples */
  includeExamples?: boolean;

  /** Whether to include type information */
  includeTypes?: boolean;

  /** Output directory */
  outputDir?: string;

  /** Template to use */
  template?: string;

  /** Whether to save to file */
  saveToFile?: boolean;
}

/**
 * Documentation template
 */
export interface DocTemplate {
  header: string;
  functionTemplate: string;
  classTemplate: string;
  footer: string;
}

/**
 * Default templates for each documentation format
 */
export const DEFAULT_TEMPLATES: Record<DocFormat, DocTemplate> = {
  [DocFormat.JSDOC]: {
    header: '/**\n * {{description}}\n */',
    functionTemplate: '/**\n * {{description}}\n * {{params}}\n * {{returns}}\n */',
    classTemplate: '/**\n * {{description}}\n * {{properties}}\n * {{methods}}\n */',
    footer: '',
  },
  [DocFormat.MARKDOWN]: {
    header: '# {{title}}\n\n{{description}}',
    functionTemplate: '## {{name}}\n\n{{description}}\n\n**Parameters:**\n{{params}}\n\n**Returns:**\n{{returns}}',
    classTemplate: '## {{name}}\n\n{{description}}\n\n**Properties:**\n{{properties}}\n\n**Methods:**\n{{methods}}',
    footer: '',
  },
  [DocFormat.HTML]: {
    header: '<h1>{{title}}</h1><p>{{description}}</p>',
    functionTemplate: '<h2>{{name}}</h2><p>{{description}}</p><h3>Parameters</h3>{{params}}<h3>Returns</h3>{{returns}}',
    classTemplate: '<h2>{{name}}</h2><p>{{description}}</p><h3>Properties</h3>{{properties}}<h3>Methods</h3>{{methods}}',
    footer: '</body></html>',
  },
  [DocFormat.JSON]: {
    header: '',
    functionTemplate: '',
    classTemplate: '',
    footer: '',
  },
};
