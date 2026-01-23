/**
 * Documentation Generation API
 *
 * APIs for automatic documentation generation including JSDoc comments,
 * README files, and API documentation.
 *
 * @module api/docs
 */

import { Project, type SourceFile } from 'ts-morph';
import {
  DocFormat,
  type DocumentationResult,
  type DocumentationOptions,
} from './docs-types';
import {
  generateJSDocForFile,
  generateREADMEForProject,
  generateAPIDocsForFiles,
} from './docs-generators';
import { errorMessage } from '../core/utils/error-handler';

/**
 * Documentation Generation API class
 */
export class DocumentationAPI {
  private project: Project;

  constructor() {
    this.project = new Project({
      skipFileDependencyResolution: true,
      compilerOptions: {
        allowJs: true,
      },
    });
  }

  /**
   * Generate JSDoc comments for a file
   */
  async generateJSDoc(
    filePath: string,
    options?: DocumentationOptions
  ): Promise<DocumentationResult> {
    try {
      const sourceFile = this.addSourceFile(filePath);
      return generateJSDocForFile(sourceFile, filePath, options);
    } catch (error) {
      return {
        format: DocFormat.JSDOC,
        content: '',
        files: [],
        success: false,
        error: errorMessage(error),
      };
    }
  }

  /**
   * Generate README for a project
   */
  async generateREADME(
    projectPath: string,
    options?: DocumentationOptions
  ): Promise<DocumentationResult> {
    return generateREADMEForProject(projectPath, options);
  }

  /**
   * Generate API documentation
   */
  async generateAPIDocs(
    sourcePath: string,
    options?: DocumentationOptions
  ): Promise<DocumentationResult> {
    try {
      const format = options?.format || DocFormat.MARKDOWN;

      // Add source files to project
      const sourceFiles = this.project.addSourceFilesAtPaths(sourcePath);

      const result = await generateAPIDocsForFiles(sourceFiles, format, options);

      // Save to file if requested
      let outputPath: string | undefined;
      if (options?.saveToFile && options?.outputDir) {
        const path = await import('path');
        const fs = await import('fs/promises');

        outputPath = path.join(options.outputDir, `API.${format === DocFormat.MARKDOWN ? 'md' : format}`);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, result.content, 'utf-8');
      }

      return { ...result, outputPath };
    } catch (error) {
      return {
        format: options?.format || DocFormat.MARKDOWN,
        content: '',
        files: [],
        success: false,
        error: errorMessage(error),
      };
    }
  }

  /**
   * Generate documentation for all types
   */
  async generateDocs(
    sourcePath: string,
    options?: DocumentationOptions
  ): Promise<DocumentationResult> {
    // Default to generating API docs
    return this.generateAPIDocs(sourcePath, options);
  }

  /**
   * Add source file to project
   */
  private addSourceFile(filePath: string): SourceFile | null {
    try {
      return this.project.addSourceFileAtPath(filePath);
    } catch {
      return null;
    }
  }
}

/**
 * Factory function
 */
export function createDocumentation(): DocumentationAPI {
  return new DocumentationAPI();
}

// Re-export types for convenience
export * from './docs-types';
