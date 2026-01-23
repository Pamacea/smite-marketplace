"use strict";
/**
 * API Module
 *
 * Main user-facing APIs for the SMITE Toolkit.
 *
 * @module api
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocFormat = exports.createDocumentation = exports.DocumentationAPI = exports.RefactorType = exports.createRefactoring = exports.RefactoringAPI = exports.BugCategory = exports.BugSeverity = exports.createBugDetection = exports.BugDetectionAPI = exports.createSemanticAnalysis = exports.SemanticAnalysisAPI = exports.OutputFormat = exports.createCodeSearch = exports.CodeSearchAPI = void 0;
// Search API exports
var search_js_1 = require("./search.js");
Object.defineProperty(exports, "CodeSearchAPI", { enumerable: true, get: function () { return search_js_1.CodeSearchAPI; } });
Object.defineProperty(exports, "createCodeSearch", { enumerable: true, get: function () { return search_js_1.createCodeSearch; } });
Object.defineProperty(exports, "OutputFormat", { enumerable: true, get: function () { return search_js_1.OutputFormat; } });
// Semantic Analysis API exports
var semantic_js_1 = require("./semantic.js");
Object.defineProperty(exports, "SemanticAnalysisAPI", { enumerable: true, get: function () { return semantic_js_1.SemanticAnalysisAPI; } });
Object.defineProperty(exports, "createSemanticAnalysis", { enumerable: true, get: function () { return semantic_js_1.createSemanticAnalysis; } });
// Bug Detection API exports
var bugs_js_1 = require("./bugs.js");
Object.defineProperty(exports, "BugDetectionAPI", { enumerable: true, get: function () { return bugs_js_1.BugDetectionAPI; } });
Object.defineProperty(exports, "createBugDetection", { enumerable: true, get: function () { return bugs_js_1.createBugDetection; } });
Object.defineProperty(exports, "BugSeverity", { enumerable: true, get: function () { return bugs_js_1.BugSeverity; } });
Object.defineProperty(exports, "BugCategory", { enumerable: true, get: function () { return bugs_js_1.BugCategory; } });
// Refactoring API exports
var refactor_js_1 = require("./refactor.js");
Object.defineProperty(exports, "RefactoringAPI", { enumerable: true, get: function () { return refactor_js_1.RefactoringAPI; } });
Object.defineProperty(exports, "createRefactoring", { enumerable: true, get: function () { return refactor_js_1.createRefactoring; } });
Object.defineProperty(exports, "RefactorType", { enumerable: true, get: function () { return refactor_js_1.RefactorType; } });
// Documentation Generation API exports
var docs_js_1 = require("./docs.js");
Object.defineProperty(exports, "DocumentationAPI", { enumerable: true, get: function () { return docs_js_1.DocumentationAPI; } });
Object.defineProperty(exports, "createDocumentation", { enumerable: true, get: function () { return docs_js_1.createDocumentation; } });
Object.defineProperty(exports, "DocFormat", { enumerable: true, get: function () { return docs_js_1.DocFormat; } });
//# sourceMappingURL=index.js.map