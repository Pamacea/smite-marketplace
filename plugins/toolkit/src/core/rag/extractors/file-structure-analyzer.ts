/**
 * File Structure Analyzer - Analyzes TypeScript file structure
 *
 * @module core/rag/extractors/file-structure-analyzer
 */

import type { Project } from 'ts-morph';
import type { ExtractionResult } from './types.js';

/**
 * Analyze file structure and return metrics
 */
export function analyzeFileStructure(
  content: string,
  project: Project
): ExtractionResult {
  try {
    const sourceFile = project.createSourceFile('temp.ts', content);

    const result: ExtractionResult = {
      content: '',
      lines: sourceFile.getFullText().split('\n').length,
      functions: sourceFile.getFunctions().length,
      classes: sourceFile.getClasses().length,
      types: sourceFile.getTypeAliases().length + sourceFile.getInterfaces().length,
      imports: sourceFile.getImportDeclarations().length,
    };

    project.removeSourceFile(sourceFile);

    return result;
  } catch {
    return {
      content: '',
      lines: content.split('\n').length,
      functions: 0,
      classes: 0,
      types: 0,
      imports: 0,
    };
  }
}
