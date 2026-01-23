"use strict";
/**
 * Code Search API
 *
 * Main user-facing API for searching codebases using the unified search router.
 * Provides multiple search modes, filters, and output formats.
 *
 * @module api/search
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSearchAPI = exports.OutputFormat = void 0;
exports.createCodeSearch = createCodeSearch;
const index_js_1 = require("../core/unified/index.js");
/**
 * Output format types
 */
var OutputFormat;
(function (OutputFormat) {
    /** JSON format for programmatic access */
    OutputFormat["JSON"] = "json";
    /** Table format for terminal display */
    OutputFormat["TABLE"] = "table";
    /** Diff format showing code changes */
    OutputFormat["DIFF"] = "diff";
    /** Summary format with key insights */
    OutputFormat["SUMMARY"] = "summary";
})(OutputFormat || (exports.OutputFormat = OutputFormat = {}));
/**
 * Code Search API class
 */
class CodeSearchAPI {
    constructor(config) {
        this.router = new index_js_1.SearchRouter({
            cacheEnabled: true,
            maxCacheSize: config?.maxCacheSize || 100,
            cacheTTL: config?.cacheTTL || 300000,
        });
        this.defaultOptions = {
            strategy: index_js_1.SearchStrategy.AUTO,
            maxResults: 50,
            outputFormat: OutputFormat.JSON,
            includeContext: true,
            contextLines: 3,
            minScore: 0.3,
            useCache: true,
            timeout: 30000,
            verbose: false,
        };
    }
    /**
     * Search code with unified interface
     */
    async search(query, options) {
        const startTime = Date.now();
        // Merge options with defaults
        const mergedOptions = {
            ...this.defaultOptions,
            ...options,
        };
        // Execute search through router
        const searchResult = await this.router.search(query, {
            strategy: mergedOptions.strategy,
            maxResults: mergedOptions.maxResults,
            filePatterns: mergedOptions.filters?.filePatterns,
            languages: mergedOptions.filters?.languages,
            includeContext: mergedOptions.includeContext,
            contextLines: mergedOptions.contextLines,
            minScore: mergedOptions.minScore,
            useCache: mergedOptions.useCache,
            timeout: mergedOptions.timeout,
        });
        // Transform results to CodeSearchResult format
        const results = searchResult.results.map(r => ({
            filePath: r.filePath,
            lineNumber: r.lineNumber,
            content: r.content,
            score: r.score || 0,
            context: r.context,
            metadata: {
            // TODO: Add file metadata extraction
            },
        }));
        // Apply additional filters
        const filteredResults = this.applyFilters(results, mergedOptions.filters);
        // Format output if requested
        let formatted;
        if (mergedOptions.outputFormat !== OutputFormat.JSON) {
            formatted = this.formatOutput(filteredResults, mergedOptions.outputFormat);
        }
        return {
            results: filteredResults,
            resultCount: filteredResults.length,
            strategy: searchResult.strategy,
            queryAnalysis: {
                type: searchResult.queryAnalysis.type,
                confidence: searchResult.queryAnalysis.confidence,
                recommendedStrategy: searchResult.queryAnalysis.recommendedStrategy,
            },
            executionTime: Date.now() - startTime,
            fromCache: searchResult.fromCache,
            formatted,
        };
    }
    /**
     * Apply filters to results
     */
    applyFilters(results, filters) {
        if (!filters)
            return results;
        let filtered = results;
        // File pattern filters
        if (filters.filePatterns && filters.filePatterns.length > 0) {
            // TODO: Implement glob pattern matching
            // For now, just return all results
        }
        // Language filters
        if (filters.languages && filters.languages.length > 0) {
            // TODO: Implement language detection and filtering
            // For now, just return all results
        }
        // Date range filters
        if (filters.dateRange) {
            // TODO: Implement date range filtering
            // For now, just return all results
        }
        // File size filters
        if (filters.minFileSize || filters.maxFileSize) {
            // TODO: Implement file size filtering
            // For now, just return all results
        }
        return filtered;
    }
    /**
     * Format output according to specified format
     */
    formatOutput(results, format) {
        switch (format) {
            case OutputFormat.TABLE:
                return this.formatAsTable(results);
            case OutputFormat.DIFF:
                return this.formatAsDiff(results);
            case OutputFormat.SUMMARY:
                return this.formatAsSummary(results);
            default:
                return JSON.stringify(results, null, 2);
        }
    }
    /**
     * Format results as table
     */
    formatAsTable(results) {
        if (results.length === 0) {
            return 'No results found.';
        }
        const lines = [];
        // Header
        lines.push('─'.repeat(120));
        lines.push(`${'File'.padEnd(40)} ${'Line'.padEnd(6)} ${'Score'.padEnd(6)} Content`);
        lines.push('─'.repeat(120));
        // Results
        for (const result of results) {
            const filePath = result.filePath.slice(-40).padEnd(40);
            const line = String(result.lineNumber).padEnd(6);
            const score = (result.score * 100).toFixed(0).padEnd(6) + '%';
            const content = result.content.slice(0, 60);
            lines.push(`${filePath} ${line} ${score} ${content}`);
        }
        lines.push('─'.repeat(120));
        lines.push(`Total: ${results.length} result(s)`);
        return lines.join('\n');
    }
    /**
     * Format results as diff
     */
    formatAsDiff(results) {
        if (results.length === 0) {
            return 'No results found.';
        }
        const lines = [];
        for (const result of results) {
            lines.push(`--- a/${result.filePath}`);
            lines.push(`+++ b/${result.filePath}`);
            lines.push(`@@ -${result.lineNumber},0 +${result.lineNumber},1 @@`);
            lines.push(`+${result.content}`);
            lines.push('');
        }
        return lines.join('\n');
    }
    /**
     * Format results as summary
     */
    formatAsSummary(results) {
        if (results.length === 0) {
            return 'No results found.';
        }
        const lines = [];
        lines.push(`Found ${results.length} result(s):\n`);
        // Group by file
        const byFile = new Map();
        for (const result of results) {
            const fileResults = byFile.get(result.filePath) || [];
            fileResults.push(result);
            byFile.set(result.filePath, fileResults);
        }
        // Summarize by file
        for (const [filePath, fileResults] of byFile.entries()) {
            lines.push(`📄 ${filePath}`);
            lines.push(`   Matches: ${fileResults.length}`);
            lines.push(`   Lines: ${fileResults.map(r => r.lineNumber).join(', ')}`);
            lines.push('');
        }
        return lines.join('\n');
    }
    /**
     * Clear the search cache
     */
    clearCache() {
        this.router.clearCache();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return this.router.getCacheStats();
    }
}
exports.CodeSearchAPI = CodeSearchAPI;
/**
 * Quick access factory for creating code search API
 */
function createCodeSearch(config) {
    return new CodeSearchAPI(config);
}
//# sourceMappingURL=search.js.map