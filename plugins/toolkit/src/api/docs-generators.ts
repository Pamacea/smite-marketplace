/**
 * Documentation Generators
 *
 * High-level documentation generation functions.
 *
 * @module api/docs-generators
 */

import type { SourceFile } from 'ts-morph';
import type { FunctionDeclaration, ClassDeclaration } from 'ts-morph';
import { DocFormat } from './docs-types';
import type { DocumentationResult, DocumentationOptions } from './docs-types';
import {
  generateFunctionJSDoc,
  generateClassJSDoc,
  generateFileAPIDoc,
} from './docs-formatters';

/**
 * Generate JSDoc comments for a file
 */
export async function generateJSDocForFile(
  sourceFile: SourceFile | null,
  filePath: string,
  options?: DocumentationOptions
): Promise<DocumentationResult> {
  if (!sourceFile) {
    return {
      format: DocFormat.JSDOC,
      content: '',
      files: [],
      success: false,
      error: 'Failed to load source file',
    };
  }

  const docs: string[] = [];

  // Document functions
  const functions = sourceFile.getFunctions();
  for (const func of functions) {
    const jsdoc = generateFunctionJSDoc(func, options);
    if (jsdoc) {
      docs.push(jsdoc);
    }
  }

  // Document classes
  const classes = sourceFile.getClasses();
  for (const cls of classes) {
    const jsdoc = generateClassJSDoc(cls, options);
    if (jsdoc) {
      docs.push(jsdoc);
    }
  }

  const content = docs.join('\n\n');

  return {
    format: DocFormat.JSDOC,
    content,
    files: [filePath],
    success: true,
  };
}

/**
 * Generate README for a project
 */
export async function generateREADMEForProject(
  projectPath: string,
  options?: DocumentationOptions
): Promise<DocumentationResult> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    // Read package.json if exists
    const packageJsonPath = path.join(projectPath, 'package.json');
    let projectName = 'Project';
    let description = '';
    let version = '1.0.0';

    try {
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, 'utf-8')
      );
      projectName = packageJson.name || projectName;
      description = packageJson.description || description;
      version = packageJson.version || version;
    } catch {
      // No package.json found
    }

    // Generate README content
    const lines: string[] = [];

    lines.push(`# ${projectName}\n`);
    if (description) {
      lines.push(`${description}\n`);
    }

    lines.push('## Installation\n');
    lines.push('```bash\n');
    lines.push('npm install\n');
    lines.push('```\n');

    lines.push('## Usage\n');
    lines.push('TODO: Add usage examples\n');

    lines.push('## API\n');
    lines.push('TODO: Add API documentation\n');

    lines.push('## Contributing\n');
    lines.push('TODO: Add contributing guidelines\n');

    lines.push('## License\n');
    lines.push('MIT\n');

    const content = lines.join('\n');

    // Save to file if requested
    let outputPath: string | undefined;
    if (options?.saveToFile) {
      outputPath = path.join(projectPath, 'README.md');
      await fs.writeFile(outputPath, content, 'utf-8');
    }

    return {
      format: DocFormat.MARKDOWN,
      content,
      files: [projectPath],
      success: true,
      outputPath,
    };
  } catch (error) {
    return {
      format: DocFormat.MARKDOWN,
      content: '',
      files: [],
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate API documentation for multiple source files
 */
export async function generateAPIDocsForFiles(
  sourceFiles: SourceFile[],
  format: DocFormat,
  options?: DocumentationOptions
): Promise<DocumentationResult> {
  const docs: string[] = [];

  for (const sourceFile of sourceFiles) {
    const fileDoc = await generateFileAPIDoc(sourceFile, format, options);
    docs.push(fileDoc);
  }

  const content = docs.join('\n\n---\n\n');

  return {
    format,
    content,
    files: sourceFiles.map(f => f.getFilePath()),
    success: true,
  };
}
