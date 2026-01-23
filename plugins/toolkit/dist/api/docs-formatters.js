"use strict";
/**
 * Documentation Formatters
 *
 * Functions for generating documentation in various formats.
 *
 * @module api/docs-formatters
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFunctionJSDoc = generateFunctionJSDoc;
exports.generateClassJSDoc = generateClassJSDoc;
exports.generateFunctionDoc = generateFunctionDoc;
exports.generateClassDoc = generateClassDoc;
exports.generateInterfaceDoc = generateInterfaceDoc;
exports.generateFileAPIDoc = generateFileAPIDoc;
const docs_types_1 = require("./docs-types");
/**
 * Generate JSDoc for a function
 */
function generateFunctionJSDoc(func, options) {
    try {
        const name = func.getName();
        const params = func.getParameters();
        const returnType = func.getReturnType().getText();
        const lines = ['/**'];
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
    }
    catch {
        return null;
    }
}
/**
 * Generate JSDoc for a class
 */
function generateClassJSDoc(cls, options) {
    try {
        const name = cls.getName();
        const properties = cls.getProperties();
        const methods = cls.getMethods();
        const lines = ['/**'];
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
    }
    catch {
        return null;
    }
}
/**
 * Generate documentation for a function
 */
function generateFunctionDoc(func, format, options) {
    const name = func.getName() || 'anonymous';
    const params = func.getParameters();
    const returnType = func.getReturnType().getText();
    if (format === docs_types_1.DocFormat.MARKDOWN) {
        const lines = [];
        lines.push(`### ${name}`);
        if (options?.includeTypes) {
            const paramStr = params.map(p => p.getType().getText()).join(', ');
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
function generateClassDoc(cls, format, options) {
    const name = cls.getName() || 'anonymous';
    if (format === docs_types_1.DocFormat.MARKDOWN) {
        const lines = [];
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
function generateInterfaceDoc(iface, format, options) {
    const name = iface.getName() || 'anonymous';
    if (format === docs_types_1.DocFormat.MARKDOWN) {
        const lines = [];
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
/**
 * Generate API documentation for a file
 */
async function generateFileAPIDoc(sourceFile, format, options) {
    const filePath = sourceFile.getFilePath();
    const lines = [];
    // File header
    lines.push(`# ${filePath}\n`);
    // Exported functions
    const functions = sourceFile.getFunctions();
    if (functions.length > 0) {
        lines.push('## Functions\n');
        for (const func of functions) {
            const funcDoc = generateFunctionDoc(func, format, options);
            lines.push(funcDoc);
        }
    }
    // Exported classes
    const classes = sourceFile.getClasses();
    if (classes.length > 0) {
        lines.push('\n## Classes\n');
        for (const cls of classes) {
            const classDoc = generateClassDoc(cls, format, options);
            lines.push(classDoc);
        }
    }
    // Exported interfaces
    const interfaces = sourceFile.getInterfaces();
    if (interfaces.length > 0) {
        lines.push('\n## Interfaces\n');
        for (const iface of interfaces) {
            const interfaceDoc = generateInterfaceDoc(iface, format, options);
            lines.push(interfaceDoc);
        }
    }
    return lines.join('\n');
}
//# sourceMappingURL=docs-formatters.js.map