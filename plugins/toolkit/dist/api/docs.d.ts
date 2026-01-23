/**
 * Documentation Generation API
 *
 * APIs for automatic documentation generation including JSDoc comments,
 * README files, and API documentation.
 *
 * @module api/docs
 */
import { type DocumentationResult, type DocumentationOptions } from './docs-types';
/**
 * Documentation Generation API class
 */
export declare class DocumentationAPI {
    private project;
    constructor();
    /**
     * Generate JSDoc comments for a file
     */
    generateJSDoc(filePath: string, options?: DocumentationOptions): Promise<DocumentationResult>;
    /**
     * Generate README for a project
     */
    generateREADME(projectPath: string, options?: DocumentationOptions): Promise<DocumentationResult>;
    /**
     * Generate API documentation
     */
    generateAPIDocs(sourcePath: string, options?: DocumentationOptions): Promise<DocumentationResult>;
    /**
     * Generate documentation for all types
     */
    generateDocs(sourcePath: string, options?: DocumentationOptions): Promise<DocumentationResult>;
    /**
     * Add source file to project
     */
    private addSourceFile;
}
/**
 * Factory function
 */
export declare function createDocumentation(): DocumentationAPI;
export * from './docs-types';
//# sourceMappingURL=docs.d.ts.map