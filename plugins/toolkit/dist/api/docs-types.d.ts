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
export declare enum DocFormat {
    JSDOC = "jsdoc",
    MARKDOWN = "markdown",
    HTML = "html",
    JSON = "json"
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
export declare const DEFAULT_TEMPLATES: Record<DocFormat, DocTemplate>;
//# sourceMappingURL=docs-types.d.ts.map