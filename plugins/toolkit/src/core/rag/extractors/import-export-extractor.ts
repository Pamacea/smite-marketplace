/**
 * Import/Export Extractor - Extracts import and export statements
 *
 * @module core/rag/extractors/import-export-extractor
 */

import type { SourceFile } from 'ts-morph';

/**
 * Extract all import declaration lines
 */
export function extractImportLines(sourceFile: SourceFile): string[] {
  const lines: string[] = [];

  sourceFile.getImportDeclarations().forEach((imp) => {
    lines.push(imp.getText());
  });

  return lines;
}

/**
 * Extract all export declaration lines
 */
export function extractExportLines(sourceFile: SourceFile): string[] {
  const lines: string[] = [];

  sourceFile.getExportDeclarations().forEach((exp) => {
    lines.push(exp.getText());
  });

  return lines;
}
