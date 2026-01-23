"use strict";
/**
 * SMITE Toolkit - Explore Skill
 *
 * Specialized explore command using index.json and deps.json
 * Built for fast codebase exploration with minimal token usage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFunction = findFunction;
exports.findComponent = findComponent;
exports.analyzeImpacts = analyzeImpacts;
exports.mapArchitecture = mapArchitecture;
exports.findBugs = findBugs;
exports.explore = explore;
const search_js_1 = require("./search.js");
const graph_js_1 = require("./graph.js");
/**
 * Find function in codebase
 */
function findFunction(targetFunction) {
    console.log('');
    console.log('🔍 Finding function:', targetFunction);
    console.log('');
    // Search for function definition
    const query = `function ${targetFunction}`;
    const found = (0, search_js_1.search)(query, { maxResults: 20 });
    if (!found) {
        return false;
    }
    return true;
}
/**
 * Find component in codebase
 */
function findComponent(targetComponent) {
    console.log('');
    console.log('🔍 Finding component:', targetComponent);
    console.log('');
    // Search for component definition
    const query = `component ${targetComponent} ${targetComponent} =`;
    const found = (0, search_js_1.search)(query, { maxResults: 20 });
    if (!found) {
        return false;
    }
    return true;
}
/**
 * Analyze impacts of changes
 */
function analyzeImpacts(targetPath) {
    console.log('');
    console.log('💥 Analyzing impacts:', targetPath);
    console.log('');
    const result = (0, graph_js_1.graph)(targetPath, { impact: true });
    if (!result) {
        return false;
    }
    return true;
}
/**
 * Map architecture
 */
function mapArchitecture() {
    console.log('');
    console.log('🗺️  Architecture Map');
    console.log('');
    const result = (0, graph_js_1.graph)(undefined, { impact: false });
    if (!result) {
        return false;
    }
    return true;
}
/**
 * Find bugs
 */
function findBugs(target) {
    console.log('');
    console.log('🐛 Finding bugs:', target);
    console.log('');
    // Use search to find potential bug patterns
    const patterns = [
        'TODO',
        'FIXME',
        'BUG',
        'HACK',
        'XXX',
    ];
    for (const pattern of patterns) {
        console.log(`Searching for ${pattern}...`);
        (0, search_js_1.search)(`${pattern} ${target}`, { maxResults: 5 });
    }
    return true;
}
/**
 * Main explore function
 */
function explore(task, target) {
    switch (task) {
        case 'find-function':
            if (!target) {
                console.error('⚠️  Target required for find-function');
                return false;
            }
            return findFunction(target);
        case 'find-component':
            if (!target) {
                console.error('⚠️  Target required for find-component');
                return false;
            }
            return findComponent(target);
        case 'analyze-impacts':
            if (!target) {
                console.error('⚠️  Target required for analyze-impacts');
                return false;
            }
            return analyzeImpacts(target);
        case 'map-architecture':
            return mapArchitecture();
        case 'find-bug':
            if (!target) {
                console.error('⚠️  Target required for find-bug');
                return false;
            }
            return findBugs(target);
        default:
            console.error('⚠️  Unknown task:', task);
            console.error('Available tasks:');
            console.error('  - find-function');
            console.error('  - find-component');
            console.error('  - analyze-impacts');
            console.error('  - map-architecture');
            console.error('  - find-bug');
            return false;
    }
}
//# sourceMappingURL=explore.js.map