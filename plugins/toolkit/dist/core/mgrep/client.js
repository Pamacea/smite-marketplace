"use strict";
/**
 * mgrep Client - CLI wrapper for mgrep semantic search
 *
 * Provides interface to mgrep CLI for semantic code search with:
 * - Command execution (search, watch, mcp)
 * - JSON output parsing
 * - Error handling and availability checking
 * - Result normalization
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MgrepClient = exports.DEFAULT_MGREP_CLIENT_CONFIG = exports.MgrepCommand = void 0;
const child_process_1 = require("child_process");
/**
 * mgrep command types
 */
var MgrepCommand;
(function (MgrepCommand) {
    MgrepCommand["SEARCH"] = "search";
    MgrepCommand["WATCH"] = "watch";
    MgrepCommand["MCP"] = "mcp";
})(MgrepCommand || (exports.MgrepCommand = MgrepCommand = {}));
/**
 * Default configuration
 */
exports.DEFAULT_MGREP_CLIENT_CONFIG = {
    executable: 'mgrep',
    defaultMaxCount: 20,
    defaultRerank: true,
    timeout: 30000, // 30 seconds
};
/**
 * mgrep Client class
 */
class MgrepClient {
    constructor(config = {}) {
        this.available = null;
        this.config = { ...exports.DEFAULT_MGREP_CLIENT_CONFIG, ...config };
    }
    /**
     * Check if mgrep is available
     */
    async isAvailable() {
        if (this.available !== null) {
            return this.available;
        }
        return new Promise((resolve) => {
            const proc = (0, child_process_1.spawn)(this.config.executable, ['--version']);
            proc.on('error', () => {
                this.available = false;
                resolve(false);
            });
            proc.on('close', (code) => {
                this.available = code === 0;
                resolve(this.available);
            });
            setTimeout(() => {
                proc.kill();
                this.available = false;
                resolve(false);
            }, this.config.timeout);
        });
    }
    /**
     * Execute mgrep command
     */
    async executeCommand(args, timeout) {
        const actualTimeout = timeout ?? this.config.timeout;
        return new Promise((resolve) => {
            let stdout = '';
            let stderr = '';
            const proc = (0, child_process_1.spawn)(this.config.executable, args);
            proc.stdout?.on('data', (data) => {
                stdout += data.toString();
            });
            proc.stderr?.on('data', (data) => {
                stderr += data.toString();
            });
            proc.on('error', (error) => {
                resolve({
                    success: false,
                    error: `mgrep execution failed: ${error.message}`,
                });
            });
            proc.on('close', (code) => {
                if (code === 0) {
                    resolve({
                        success: true,
                        results: this.parseResults(stdout),
                        rawOutput: stdout,
                    });
                }
                else {
                    resolve({
                        success: false,
                        error: stderr || `mgrep exited with code ${code}`,
                        rawOutput: stdout,
                    });
                }
            });
            setTimeout(() => {
                proc.kill();
                resolve({
                    success: false,
                    error: `mgrep timeout after ${actualTimeout}ms`,
                });
            }, actualTimeout);
        });
    }
    /**
     * Parse mgrep output
     * Note: mgrep doesn't currently support JSON output, so we parse text format
     */
    parseResults(output) {
        const results = [];
        const lines = output.split('\n').filter((line) => line.trim());
        // Parse output format:
        // file:line:line:score:snippet
        // or
        // file:score
        for (const line of lines) {
            // Skip non-result lines
            if (!line.includes(':') || line.startsWith('◆') || line.startsWith('│')) {
                continue;
            }
            const parts = line.split(':');
            if (parts.length < 2)
                continue;
            const file = parts[0];
            const score = parseFloat(parts[parts.length - 2] || parts[1]);
            if (isNaN(score))
                continue;
            results.push({
                file,
                score: Math.min(1, Math.max(0, score)), // Normalize to 0-1
                snippet: parts.length > 3 ? parts.slice(2, -1).join(':') : undefined,
                startLine: parts.length > 3 ? parseInt(parts[1]) : undefined,
                endLine: parts.length > 4 ? parseInt(parts[2]) : undefined,
            });
        }
        return results;
    }
    /**
     * Build mgrep search arguments
     */
    buildSearchArgs(query, path, options = {}) {
        const args = ['search'];
        if (options.caseInsensitive)
            args.push('-i');
        if (options.recursive)
            args.push('-r');
        if (options.content)
            args.push('-c');
        if (options.answer)
            args.push('-a');
        if (options.sync)
            args.push('-s');
        if (options.dryRun)
            args.push('-d');
        if (options.noRerank)
            args.push('--no-rerank');
        if (options.web)
            args.push('-w');
        if (options.maxCount !== undefined) {
            args.push('--max-count', options.maxCount.toString());
        }
        if (options.maxFileSize !== undefined) {
            args.push('--max-file-size', options.maxFileSize.toString());
        }
        if (options.maxFileCount !== undefined) {
            args.push('--max-file-count', options.maxFileCount.toString());
        }
        args.push(query);
        if (path) {
            args.push(path);
        }
        return args;
    }
    /**
     * Execute semantic search
     */
    async search(query, path, options = {}) {
        if (!(await this.isAvailable())) {
            return {
                success: false,
                error: 'mgrep is not available or not installed',
            };
        }
        // Apply defaults
        const searchOptions = {
            maxCount: this.config.defaultMaxCount,
            noRerank: !this.config.defaultRerank,
            recursive: true,
            ...options,
        };
        const args = this.buildSearchArgs(query, path, searchOptions);
        return this.executeCommand(args);
    }
    /**
     * Start watch mode
     */
    async watch(query, path, options = {}) {
        if (!(await this.isAvailable())) {
            return {
                success: false,
                error: 'mgrep is not available or not installed',
            };
        }
        const args = ['watch', query];
        if (path)
            args.push(path);
        return this.executeCommand(args);
    }
    /**
     * Start MCP server
     */
    async startMcp() {
        if (!(await this.isAvailable())) {
            return {
                success: false,
                error: 'mgrep is not available or not installed',
            };
        }
        const args = ['mcp'];
        return this.executeCommand(args, 0); // No timeout for server
    }
    /**
     * Get mgrep version
     */
    async getVersion() {
        const result = await this.executeCommand(['--version']);
        if (result.success && result.rawOutput) {
            return result.rawOutput.trim();
        }
        return null;
    }
}
exports.MgrepClient = MgrepClient;
//# sourceMappingURL=client.js.map