/**
 * Documentation Generators
 *
 * High-level documentation generation functions.
 *
 * @module api/docs-generators
 */
import type { SourceFile } from 'ts-morph';
import { DocFormat } from './docs-types';
import type { DocumentationResult, DocumentationOptions } from './docs-types';
/**
 * Generate JSDoc comments for a file
 */
export declare function generateJSDocForFile(sourceFile: SourceFile | null, filePath: string, options?: DocumentationOptions): Promise<DocumentationResult>;
/**
 * Generate README for a project
 */
export declare function generateREADMEForProject(projectPath: string, options?: DocumentationOptions): Promise<DocumentationResult>;
/**
 * Generate API documentation for multiple source files
 */
export declare function generateAPIDocsForFiles(sourceFiles: SourceFile[], format: DocFormat, options?: DocumentationOptions): Promise<DocumentationResult>;
//# sourceMappingURL=docs-generators.d.ts.map