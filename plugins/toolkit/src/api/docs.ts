/**
 * Documentation Generation API
 *
 * APIs for automatic documentation generation including JSDoc comments,
 * README files, and API documentation.
 *
 * @module api/docs
 */

import { Project, type SourceFile } from 'ts-morph';

/**
 * Documentation format
 */
export enum DocFormat {
  JSDOC = 'jsdoc',
  MARKDOWN = 'markdown',
  HTML = 'html',
  JSON = 'json',
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
 * Documentation template
 */
interface DocTemplate {
  header: string;
  functionTemplate: string;
  classTemplate: string;
  footer: string;
}

/**
 * Default templates
 */
const DEFAULT_TEMPLATES: Record<DocFormat, DocTemplate> = {
  [DocFormat.JSDOC]: {
    header: '/**\n * {{description}}\n */',
    functionTemplate: '/**\n * {{description}}\n * {{params}}\n * {{returns}}\n */',
    classTemplate: '/**\n * {{description}}\n * {{properties}}\n * {{methods}}\n */',
    footer: '',
  },
  [DocFormat.MARKDOWN]: {
    header: '# {{title}}\n\n{{description}}',
    functionTemplate: '## {{name}}\n\n{{description}}\n\n**Parameters:**\n{{params}}\n\n**Returns:**\n{{returns}}',
    classTemplate: '## {{name}}\n\n{{description}}\n\n**Properties:**\n{{properties}}\n\n**Methods:**\n{{methods}}',
    footer: '',
  },
  [DocFormat.HTML]: {
    header: '<h1>{{title}}</h1><p>{{description}}</p>',
    functionTemplate: '<h2>{{name}}</h2><p>{{description}}</p><h3>Parameters</h3>{{params}}<h3>Returns</h3>{{returns}}',
    classTemplate: '<h2>{{name}}</h2><p>{{description}}</p><h3>Properties</h3>{{properties}}<h3>Methods</h3>{{methods}}',
    footer: '</body></html>',
  },
  [DocFormat.JSON]: {
    header: '',
    functionTemplate: '',
    classTemplate: '',
    footer: '',
  },
};

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
        const jsdoc = this.generateFunctionJSDoc(func, options);
        if (jsdoc) {
          docs.push(jsdoc);
        }
      }

      // Document classes
      const classes = sourceFile.getClasses();
      for (const cls of classes) {
        const jsdoc = this.generateClassJSDoc(cls, options);
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
    } catch (error) {
      return {
        format: DocFormat.JSDOC,
        content: '',
        files: [],
        success: false,
        error: error instanceof Error ? error.message : String(error),
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

      const docs: string[] = [];

      for (const sourceFile of sourceFiles) {
        const fileDoc = await this.generateFileAPIDoc(sourceFile, format, options);
        docs.push(fileDoc);
      }

      const content = docs.join('\n\n---\n\n');

      // Save to file if requested
      let outputPath: string | undefined;
      if (options?.saveToFile && options?.outputDir) {
        const path = await import('path');
        const fs = await import('fs/promises');

        outputPath = path.join(options.outputDir, `API.${format === DocFormat.MARKDOWN ? 'md' : format}`);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, content, 'utf-8');
      }

      return {
        format,
        content,
        files: sourceFiles.map(f => f.getFilePath()),
        success: true,
        outputPath,
      };
    } catch (error) {
      return {
        format: options?.format || DocFormat.MARKDOWN,
        content: '',
        files: [],
        success: false,
        error: error instanceof Error ? error.message : String(error),
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

  /**
   * Generate JSDoc for a function
   */
  private generateFunctionJSDoc(
    func: any,
    options?: DocumentationOptions
  ): string | null {
    try {
      const name = func.getName();
      const params = func.getParameters();
      const returnType = func.getReturnType().getText();

      const lines: string[] = ['/**'];

      // Description
      lines.push(` * ${name} - TODO: Add description`);

      // Parameters
      if (params.length > 0) {
        lines.push(' *');
        lines.push(' * @param {...} args - Function parameters');
      }

      // Return type
      if (returnType && returnType !== 'void') {
        lines.push(' *');
        lines.push(` * @returns {${returnType}} - Return value`);
      }

      lines.push(' */');

      return lines.join('\n');
    } catch {
      return null;
    }
  }

  /**
   * Generate JSDoc for a class
   */
  private generateClassJSDoc(
    cls: any,
    options?: DocumentationOptions
  ): string | null {
    try {
      const name = cls.getName();
      const properties = cls.getProperties();
      const methods = cls.getMethods();

      const lines: string[] = ['/**'];

      // Description
      lines.push(` * ${name} - TODO: Add description`);

      // Properties
      if (properties.length > 0) {
        lines.push(' *');
        lines.push(' * @property {...} props - Class properties');
      }

      // Methods
      if (methods.length > 0) {
        lines.push(' *');
        lines.push(' * @method {...} methods - Class methods');
      }

      lines.push(' */');

      return lines.join('\n');
    } catch {
      return null;
    }
  }

  /**
   * Generate API documentation for a file
   */
  private async generateFileAPIDoc(
    sourceFile: SourceFile,
    format: DocFormat,
    options?: DocumentationOptions
  ): Promise<string> {
    const filePath = sourceFile.getFilePath();
    const template = DEFAULT_TEMPLATES[format];

    const lines: string[] = [];

    // File header
    lines.push(`# ${filePath}\n`);

    // Exported functions
    const functions = sourceFile.getFunctions();
    if (functions.length > 0) {
      lines.push('## Functions\n');
      for (const func of functions) {
        const funcDoc = this.generateFunctionDoc(func, format, options);
        lines.push(funcDoc);
      }
    }

    // Exported classes
    const classes = sourceFile.getClasses();
    if (classes.length > 0) {
      lines.push('\n## Classes\n');
      for (const cls of classes) {
        const classDoc = this.generateClassDoc(cls, format, options);
        lines.push(classDoc);
      }
    }

    // Exported interfaces
    const interfaces = sourceFile.getInterfaces();
    if (interfaces.length > 0) {
      lines.push('\n## Interfaces\n');
      for (const iface of interfaces) {
        const interfaceDoc = this.generateInterfaceDoc(iface, format, options);
        lines.push(interfaceDoc);
      }
    }

    return lines.join('\n');
  }

  /**
   * Generate documentation for a function
   */
  private generateFunctionDoc(
    func: any,
    format: DocFormat,
    options?: DocumentationOptions
  ): string {
    const name = func.getName() || 'anonymous';
    const params = func.getParameters();
    const returnType = func.getReturnType().getText();

    if (format === DocFormat.MARKDOWN) {
      const lines: string[] = [];
      lines.push(`### ${name}`);

      if (options?.includeTypes) {
        const paramStr = params.map((p: any) => p.getType().getText()).join(', ');
        lines.push(`\n\`${name}(${paramStr}): ${returnType}\`\n`);
      }

      if (options?.includeExamples) {
        lines.push('```typescript');
        lines.push(`// TODO: Add example for ${name}`);
        lines.push('```\n');
      }

      return lines.join('\n');
    }

    return name;
  }

  /**
   * Generate documentation for a class
   */
  private generateClassDoc(
    cls: any,
    format: DocFormat,
    options?: DocumentationOptions
  ): string {
    const name = cls.getName() || 'anonymous';

    if (format === DocFormat.MARKDOWN) {
      const lines: string[] = [];
      lines.push(`### ${name}`);

      const properties = cls.getProperties();
      const methods = cls.getMethods();

      if (properties.length > 0) {
        lines.push('\n**Properties:**');
        for (const prop of properties) {
          const propName = prop.getName();
          const propType = prop.getType().getText();
          lines.push(`- \`${propName}: ${propType}\``);
        }
      }

      if (methods.length > 0) {
        lines.push('\n**Methods:**');
        for (const method of methods) {
          const methodName = method.getName();
          lines.push(`- \`${methodName}()\``);
        }
      }

      return lines.join('\n');
    }

    return name;
  }

  /**
   * Generate documentation for an interface
   */
  private generateInterfaceDoc(
    iface: any,
    format: DocFormat,
    options?: DocumentationOptions
  ): string {
    const name = iface.getName() || 'anonymous';

    if (format === DocFormat.MARKDOWN) {
      const lines: string[] = [];
      lines.push(`### ${name}`);

      const properties = iface.getProperties();
      if (properties.length > 0) {
        lines.push('\n**Properties:**');
        for (const prop of properties) {
          const propName = prop.getName();
          const propType = prop.getType().getText();
          lines.push(`- \`${propName}: ${propType}\``);
        }
      }

      return lines.join('\n');
    }

    return name;
  }
}

/**
 * Factory function
 */
export function createDocumentation(): DocumentationAPI {
  return new DocumentationAPI();
}
