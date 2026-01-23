"use strict";
/**
 * SMITE Toolkit - Search Skill
 *
 * Specialized search command that reads from index.json
 * Built for 60-87% token savings via pre-built chunks
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = search;
exports.searchJSON = searchJSON;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Load index from .claude/.smite/toolkit/index.json
 */
function loadIndex() {
    const homeDir = process.env.USERPROFILE || process.env.HOME || '';
    if (!homeDir)
        return null;
    const smiteDir = path_1.default.join(homeDir, '.smite');
    const indexPath = path_1.default.join(smiteDir, 'toolkit', 'index.json');
    if (!fs_1.default.existsSync(indexPath)) {
        console.error('⚠️  Index not found. Run session start to build index.');
        return null;
    }
    try {
        const content = fs_1.default.readFileSync(indexPath, 'utf-8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error('⚠️  Failed to load index:', error);
        return null;
    }
}
/**
 * Search chunks using simple text matching
 */
function searchChunks(index, query, maxResults = 10) {
    const queryLower = query.toLowerCase();
    const results = [];
    for (const chunk of index.chunks) {
        const content = chunk.content.toLowerCase();
        let score = 0;
        // Exact phrase match
        if (content.includes(queryLower)) {
            score += 1.0;
        }
        // Word matches
        const words = queryLower.split(/\s+/);
        for (const word of words) {
            if (content.includes(word)) {
                score += 0.2;
            }
        }
        // File name relevance
        if (chunk.file.toLowerCase().includes(queryLower)) {
            score += 0.5;
        }
        if (score > 0) {
            results.push({ chunk, score });
        }
    }
    // Sort by score and limit results
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, maxResults);
}
/**
 * Format search results as table
 */
function formatResults(results, query) {
    console.log('');
    console.log('🔍 Toolkit Search Results');
    console.log(`Query: "${query}"`);
    console.log(`Found: ${results.length} chunks`);
    console.log('');
    if (results.length === 0) {
        console.log('No results found.');
        return;
    }
    console.log('┌─────────────────────────────┬──────────┬──────────┬────────────────────────────────┐');
    console.log('│ File                        │ Lines    │ Score    │ Preview                         │');
    console.log('├─────────────────────────────┼──────────┼──────────┼────────────────────────────────┤');
    for (const { chunk, score } of results) {
        const file = path_1.default.basename(chunk.file);
        const lines = `${chunk.startLine}-${chunk.endLine}`;
        const scoreStr = score.toFixed(2);
        const preview = chunk.content.split('\n')[0].substring(0, 30).padEnd(30);
        console.log(`│ ${file.padEnd(27)}│ ${lines.padEnd(9)}│ ${scoreStr.padEnd(9)}│ ${preview} │`);
    }
    console.log('└─────────────────────────────┴──────────┴──────────┴────────────────────────────────┘');
    console.log('');
    // Calculate token savings
    const traditionalTokens = results.length * 1000; // Estimate
    const actualTokens = results.reduce((sum, r) => sum + r.chunk.metadata.tokens, 0);
    const savings = ((traditionalTokens - actualTokens) / traditionalTokens * 100).toFixed(1);
    console.log(`💰 Tokens: ${actualTokens.toLocaleString()} (vs ${traditionalTokens.toLocaleString()} traditional - ${savings}% saved)`);
    console.log('');
}
/**
 * Main search function
 */
function search(query, options = {}) {
    const index = loadIndex();
    if (!index) {
        return false;
    }
    const results = searchChunks(index, query, options.maxResults || 10);
    formatResults(results, query);
    return true;
}
/**
 * Search with JSON output
 */
function searchJSON(query, options = {}) {
    const index = loadIndex();
    if (!index) {
        return { error: 'Index not found' };
    }
    const results = searchChunks(index, query, options.maxResults || 10);
    return {
        query,
        results: results.map(({ chunk, score }) => ({
            file: chunk.file,
            lines: `${chunk.startLine}-${chunk.endLine}`,
            score,
            preview: chunk.content.split('\n')[0],
        })),
        count: results.length,
    };
}
//# sourceMappingURL=search.js.map