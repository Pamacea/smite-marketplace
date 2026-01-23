/**
 * Documentation Generation API
 *
 * APIs for automatic documentation generation including JSDoc comments,
 * README files, and API documentation.
 *
 * @module api/docs
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
    /**
     * Generate JSDoc for a function
     */
    private generateFunctionJSDoc;
    /**
     * Generate JSDoc for a class
     */
    private generateClassJSDoc;
    /**
     * Generate API documentation for a file
     */
    private generateFileAPIDoc;
    /**
     * Generate documentation for a function
     */
    private generateFunctionDoc;
    /**
     * Generate documentation for a class
     */
    private generateClassDoc;
    /**
     * Generate documentation for an interface
     */
    private generateInterfaceDoc;
}
/**
 * Factory function
 */
export declare function createDocumentation(): DocumentationAPI;
//# sourceMappingURL=docs.d.ts.map