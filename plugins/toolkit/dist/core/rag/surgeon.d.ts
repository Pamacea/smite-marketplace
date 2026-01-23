/**
 * Surgeon Extractor - AST-based code extraction
 *
 * Uses TypeScript Compiler API (via ts-morph) to extract specific code
 * patterns, achieving 70-85% token savings vs full file reads.
 */
/**
 * Extraction modes
 */
export declare enum ExtractionMode {
    SIGNATURES = "signatures",// Function/class signatures only
    TYPES_ONLY = "types",// Only type definitions
    IMPORTS_ONLY = "imports",// Only import statements
    EXPORTS_ONLY = "exports",// Only export statements
    FULL = "full"
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
export declare const DEFAULT_SURGEON_CONFIG: SurgeonConfig;
/**
 * Surgeon Extractor class
 */
export declare class SurgeonExtractor {
    private config;
    private project;
    constructor(config?: Partial<SurgeonConfig>);
    /**
     * Extract code based on mode
     */
    extract(content: string, mode: ExtractionMode): Promise<string>;
    /**
     * Extract function and class signatures
     */
    private extractSignatures;
    /**
     * Extract only type definitions
     */
    private extractTypes;
    /**
     * Extract import statements
     */
    private extractImports;
    /**
     * Extract export statements
     */
    private extractExports;
    /**
     * Build function signature
     */
    private buildFunctionSignature;
    /**
     * Build class signature
     */
    private buildClassSignature;
    /**
     * Build method signature
     */
    private buildMethodSignature;
    /**
     * Build interface signature
     */
    private buildInterfaceSignature;
    /**
     * Build type alias signature
     */
    private buildTypeAliasSignature;
    /**
     * Build enum signature
     */
    private buildEnumSignature;
    /**
     * Extract import lines
     */
    private extractImportLines;
    /**
     * Extract export lines
     */
    private extractExportLines;
    /**
     * Analyze file structure
     */
    analyze(content: string): ExtractionResult;
}
//# sourceMappingURL=surgeon.d.ts.map