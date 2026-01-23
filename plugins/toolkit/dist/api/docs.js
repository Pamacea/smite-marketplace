"use strict";
/**
 * Documentation Generation API
 *
 * APIs for automatic documentation generation including JSDoc comments,
 * README files, and API documentation.
 *
 * @module api/docs
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentationAPI = void 0;
exports.createDocumentation = createDocumentation;
const ts_morph_1 = require("ts-morph");
const docs_types_1 = require("./docs-types");
const docs_generators_1 = require("./docs-generators");
const error_handler_1 = require("../core/utils/error-handler");
/**
 * Documentation Generation API class
 */
class DocumentationAPI {
    constructor() {
        this.project = new ts_morph_1.Project({
            skipFileDependencyResolution: true,
            compilerOptions: {
                allowJs: true,
            },
        });
    }
    /**
     * Generate JSDoc comments for a file
     */
    async generateJSDoc(filePath, options) {
        try {
            const sourceFile = this.addSourceFile(filePath);
            return (0, docs_generators_1.generateJSDocForFile)(sourceFile, filePath, options);
        }
        catch (error) {
            return {
                format: docs_types_1.DocFormat.JSDOC,
                content: '',
                files: [],
                success: false,
                error: (0, error_handler_1.errorMessage)(error),
            };
        }
    }
    /**
     * Generate README for a project
     */
    async generateREADME(projectPath, options) {
        return (0, docs_generators_1.generateREADMEForProject)(projectPath, options);
    }
    /**
     * Generate API documentation
     */
    async generateAPIDocs(sourcePath, options) {
        try {
            const format = options?.format || docs_types_1.DocFormat.MARKDOWN;
            // Add source files to project
            const sourceFiles = this.project.addSourceFilesAtPaths(sourcePath);
            const result = await (0, docs_generators_1.generateAPIDocsForFiles)(sourceFiles, format, options);
            // Save to file if requested
            let outputPath;
            if (options?.saveToFile && options?.outputDir) {
                const path = await Promise.resolve().then(() => __importStar(require('path')));
                const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
                outputPath = path.join(options.outputDir, `API.${format === docs_types_1.DocFormat.MARKDOWN ? 'md' : format}`);
                await fs.mkdir(path.dirname(outputPath), { recursive: true });
                await fs.writeFile(outputPath, result.content, 'utf-8');
            }
            return { ...result, outputPath };
        }
        catch (error) {
            return {
                format: options?.format || docs_types_1.DocFormat.MARKDOWN,
                content: '',
                files: [],
                success: false,
                error: (0, error_handler_1.errorMessage)(error),
            };
        }
    }
    /**
     * Generate documentation for all types
     */
    async generateDocs(sourcePath, options) {
        // Default to generating API docs
        return this.generateAPIDocs(sourcePath, options);
    }
    /**
     * Add source file to project
     */
    addSourceFile(filePath) {
        try {
            return this.project.addSourceFileAtPath(filePath);
        }
        catch {
            return null;
        }
    }
}
exports.DocumentationAPI = DocumentationAPI;
/**
 * Factory function
 */
function createDocumentation() {
    return new DocumentationAPI();
}
// Re-export types for convenience
__exportStar(require("./docs-types"), exports);
//# sourceMappingURL=docs.js.map