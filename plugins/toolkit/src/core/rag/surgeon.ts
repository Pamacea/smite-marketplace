/**
 * Surgeon Extractor - AST-based code extraction
 *
 * Uses TypeScript Compiler API (via ts-morph) to extract specific code
 * patterns, achieving 70-85% token savings vs full file reads.
 *
 * This is a facade that delegates to specialized extractor modules.
 *
 * @module core/rag/surgeon
 */

import { Project, type SourceFile } from 'ts-morph';
import {
  ExtractionMode,
  type ExtractionResult,
  type SurgeonConfig,
  DEFAULT_SURGEON_CONFIG,
} from './extractors/types.js';
import {
  buildFunctionSignature,
  buildClassSignature,
  buildMethodSignature,
} from './extractors/signature-extractor.js';
import {
  buildInterfaceSignature,
  buildTypeAliasSignature,
  buildEnumSignature,
} from './extractors/type-extractor.js';
import {
  extractImportLines,
  extractExportLines,
} from './extractors/import-export-extractor.js';
import { analyzeFileStructure } from './extractors/file-structure-analyzer.js';

/**
 * Surgeon Extractor class (Facade)
 *
 * Orchestrates extraction using specialized sub-modules.
 */
export class SurgeonExtractor {
  private config: SurgeonConfig;
  private project: Project;

  constructor(config: Partial<SurgeonConfig> = {}) {
    this.config = { ...DEFAULT_SURGEON_CONFIG, ...config };
    this.project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: {
        allowJs: true,
        checkJs: false,
      },
    });
  }

  /**
   * Extract code based on mode
   */
  async extract(content: string, mode: ExtractionMode): Promise<string> {
    try {
      const sourceFile = this.project.createSourceFile('temp.ts', content);

      let extracted = '';

      switch (mode) {
        case ExtractionMode.SIGNATURES:
          extracted = this.extractSignatures(sourceFile);
          break;
        case ExtractionMode.TYPES_ONLY:
          extracted = this.extractTypes(sourceFile);
          break;
        case ExtractionMode.IMPORTS_ONLY:
          extracted = this.extractImports(sourceFile);
          break;
        case ExtractionMode.EXPORTS_ONLY:
          extracted = this.extractExports(sourceFile);
          break;
        case ExtractionMode.FULL:
        default:
          extracted = content;
          break;
      }

      this.project.removeSourceFile(sourceFile);
      return extracted.trim();
    } catch (error) {
      console.warn(`AST parsing failed, returning original content: ${error}`);
      return content;
    }
  }

  /**
   * Extract function and class signatures
   */
  private extractSignatures(sourceFile: SourceFile): string {
    const lines: string[] = [];

    if (this.config.includeImports) {
      lines.push(...extractImportLines(sourceFile));
    }

    sourceFile.getFunctions().forEach((func) => {
      const signature = buildFunctionSignature(func);
      if (signature) lines.push(signature);
    });

    sourceFile.getClasses().forEach((cls) => {
      const signature = buildClassSignature(cls);
      if (signature) lines.push(signature);

      cls.getMethods().forEach((method) => {
        const methodSig = buildMethodSignature(method, cls.getName());
        if (methodSig) lines.push(methodSig);
      });
    });

    sourceFile.getInterfaces().forEach((iface) => {
      const signature = buildInterfaceSignature(iface);
      if (signature) lines.push(signature);
    });

    sourceFile.getTypeAliases().forEach((alias) => {
      const signature = buildTypeAliasSignature(alias);
      if (signature) lines.push(signature);
    });

    if (this.config.includeExports) {
      lines.push(...extractExportLines(sourceFile));
    }

    return lines.join('\n\n');
  }

  /**
   * Extract only type definitions
   */
  private extractTypes(sourceFile: SourceFile): string {
    const lines: string[] = [];

    if (this.config.includeImports) {
      lines.push(...extractImportLines(sourceFile));
    }

    sourceFile.getInterfaces().forEach((iface) => {
      const signature = buildInterfaceSignature(iface);
      if (signature) lines.push(signature);
    });

    sourceFile.getTypeAliases().forEach((alias) => {
      const signature = buildTypeAliasSignature(alias);
      if (signature) lines.push(signature);
    });

    sourceFile.getEnums().forEach((enumDecl) => {
      const signature = buildEnumSignature(enumDecl);
      if (signature) lines.push(signature);
    });

    return lines.join('\n\n');
  }

  /**
   * Extract import statements
   */
  private extractImports(sourceFile: SourceFile): string {
    return extractImportLines(sourceFile).join('\n');
  }

  /**
   * Extract export statements
   */
  private extractExports(sourceFile: SourceFile): string {
    return extractExportLines(sourceFile).join('\n');
  }

  /**
   * Analyze file structure
   */
  analyze(content: string): ExtractionResult {
    return analyzeFileStructure(content, this.project);
  }
}

// Re-export types for convenience
export { ExtractionMode, type ExtractionResult, type SurgeonConfig };
export { DEFAULT_SURGEON_CONFIG };
