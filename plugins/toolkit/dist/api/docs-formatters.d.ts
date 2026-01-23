/**
 * Documentation Formatters
 *
 * Functions for generating documentation in various formats.
 *
 * @module api/docs-formatters
 */
import type { SourceFile } from 'ts-morph';
import type { FunctionDeclaration, ClassDeclaration, InterfaceDeclaration } from 'ts-morph';
import { DocFormat } from './docs-types';
import type { DocumentationOptions } from './docs-types';
/**
 * Generate JSDoc for a function
 */
export declare function generateFunctionJSDoc(func: FunctionDeclaration, options?: DocumentationOptions): string | null;
/**
 * Generate JSDoc for a class
 */
export declare function generateClassJSDoc(cls: ClassDeclaration, options?: DocumentationOptions): string | null;
/**
 * Generate documentation for a function
 */
export declare function generateFunctionDoc(func: FunctionDeclaration, format: DocFormat, options?: DocumentationOptions): string;
/**
 * Generate documentation for a class
 */
export declare function generateClassDoc(cls: ClassDeclaration, format: DocFormat, options?: DocumentationOptions): string;
/**
 * Generate documentation for an interface
 */
export declare function generateInterfaceDoc(iface: InterfaceDeclaration, format: DocFormat, options?: DocumentationOptions): string;
/**
 * Generate API documentation for a file
 */
export declare function generateFileAPIDoc(sourceFile: SourceFile, format: DocFormat, options?: DocumentationOptions): Promise<string>;
//# sourceMappingURL=docs-formatters.d.ts.map