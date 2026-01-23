"use strict";
/**
 * Documentation Generators
 *
 * High-level documentation generation functions.
 *
 * @module api/docs-generators
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJSDocForFile = generateJSDocForFile;
exports.generateREADMEForProject = generateREADMEForProject;
exports.generateAPIDocsForFiles = generateAPIDocsForFiles;
const docs_types_1 = require("./docs-types");
const docs_formatters_1 = require("./docs-formatters");
/**
 * Generate JSDoc comments for a file
 */
async function generateJSDocForFile(sourceFile, filePath, options) {
    if (!sourceFile) {
        return {
            format: docs_types_1.DocFormat.JSDOC,
            content: '',
            files: [],
            success: false,
            error: 'Failed to load source file',
        };
    }
    const docs = [];
    // Document functions
    const functions = sourceFile.getFunctions();
    for (const func of functions) {
        const jsdoc = (0, docs_formatters_1.generateFunctionJSDoc)(func, options);
        if (jsdoc) {
            docs.push(jsdoc);
        }
    }
    // Document classes
    const classes = sourceFile.getClasses();
    for (const cls of classes) {
        const jsdoc = (0, docs_formatters_1.generateClassJSDoc)(cls, options);
        if (jsdoc) {
            docs.push(jsdoc);
        }
    }
    const content = docs.join('\n\n');
    return {
        format: docs_types_1.DocFormat.JSDOC,
        content,
        files: [filePath],
        success: true,
    };
}
/**
 * Generate README for a project
 */
async function generateREADMEForProject(projectPath, options) {
    try {
        const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
        const path = await Promise.resolve().then(() => __importStar(require('path')));
        // Read package.json if exists
        const packageJsonPath = path.join(projectPath, 'package.json');
        let projectName = 'Project';
        let description = '';
        let version = '1.0.0';
        try {
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            projectName = packageJson.name || projectName;
            description = packageJson.description || description;
            version = packageJson.version || version;
        }
        catch {
            // No package.json found
        }
        // Generate README content
        const lines = [];
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
        let outputPath;
        if (options?.saveToFile) {
            outputPath = path.join(projectPath, 'README.md');
            await fs.writeFile(outputPath, content, 'utf-8');
        }
        return {
            format: docs_types_1.DocFormat.MARKDOWN,
            content,
            files: [projectPath],
            success: true,
            outputPath,
        };
    }
    catch (error) {
        return {
            format: docs_types_1.DocFormat.MARKDOWN,
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
async function generateAPIDocsForFiles(sourceFiles, format, options) {
    const docs = [];
    for (const sourceFile of sourceFiles) {
        const fileDoc = await (0, docs_formatters_1.generateFileAPIDoc)(sourceFile, format, options);
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
//# sourceMappingURL=docs-generators.js.map