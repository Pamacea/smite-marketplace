"use strict";
/**
 * Documentation Types
 *
 * Type definitions and templates for the documentation API.
 *
 * @module api/docs-types
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TEMPLATES = exports.DocFormat = void 0;
/**
 * Documentation format
 */
var DocFormat;
(function (DocFormat) {
    DocFormat["JSDOC"] = "jsdoc";
    DocFormat["MARKDOWN"] = "markdown";
    DocFormat["HTML"] = "html";
    DocFormat["JSON"] = "json";
})(DocFormat || (exports.DocFormat = DocFormat = {}));
/**
 * Default templates for each documentation format
 */
exports.DEFAULT_TEMPLATES = {
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
//# sourceMappingURL=docs-types.js.map