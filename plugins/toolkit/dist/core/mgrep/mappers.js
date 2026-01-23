"use strict";
/**
 * Mgrep Result Mappers
 *
 * Provides mapping functions to convert mgrep search results
 * to unified search result format.
 *
 * @module core/mgrep/mappers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMgrepResultToSearchResult = mapMgrepResultToSearchResult;
exports.mapMgrepResults = mapMgrepResults;
/**
 * Maps mgrep search result to unified search result format
 *
 * @param mgrepResult - Raw mgrep result
 * @returns Unified search result
 */
function mapMgrepResultToSearchResult(mgrepResult) {
    return {
        filePath: mgrepResult.file,
        lineNumber: mgrepResult.startLine || 0,
        content: mgrepResult.snippet || '',
        score: mgrepResult.score,
    };
}
/**
 * Maps multiple mgrep results to unified format
 *
 * @param mgrepResults - Array of raw mgrep results
 * @returns Array of unified search results
 */
function mapMgrepResults(mgrepResults) {
    return mgrepResults.map(mapMgrepResultToSearchResult);
}
//# sourceMappingURL=mappers.js.map