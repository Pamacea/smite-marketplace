"use strict";
/**
 * Bug Detection API
 *
 * APIs for automated bug detection using pattern matching,
 * static analysis, and heuristics.
 *
 * @module api/bugs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugDetectionAPI = exports.BugCategory = exports.BugSeverity = void 0;
exports.createBugDetection = createBugDetection;
/**
 * Bug severity levels
 */
var BugSeverity;
(function (BugSeverity) {
    BugSeverity["CRITICAL"] = "critical";
    BugSeverity["HIGH"] = "high";
    BugSeverity["MEDIUM"] = "medium";
    BugSeverity["LOW"] = "low";
})(BugSeverity || (exports.BugSeverity = BugSeverity = {}));
/**
 * Bug category
 */
var BugCategory;
(function (BugCategory) {
    BugCategory["SYNTAX"] = "syntax";
    BugCategory["LOGIC"] = "logic";
    BugCategory["PERFORMANCE"] = "performance";
    BugCategory["SECURITY"] = "security";
    BugCategory["STYLE"] = "style";
})(BugCategory || (exports.BugCategory = BugCategory = {}));
/**
 * Bug Detection API class
 */
class BugDetectionAPI {
    constructor() {
        this.patterns = [
            // Critical bugs
            {
                type: BugCategory.SECURITY,
                severity: BugSeverity.CRITICAL,
                title: 'Hardcoded credentials',
                description: 'Potential hardcoded password or API key',
                pattern: /(?:password|api[_-]?key|secret)\s*[:=]\s*['"]([^'"]{8,})['"]/gi,
                suggestion: 'Use environment variables or secure credential management',
            },
            {
                type: BugCategory.SECURITY,
                severity: BugSeverity.CRITICAL,
                title: 'SQL injection vulnerability',
                description: 'Potential SQL injection risk',
                pattern: /(?:SELECT|INSERT|UPDATE|DELETE).*?\+.*?(?:FROM|INTO)/gi,
                suggestion: 'Use parameterized queries or prepared statements',
            },
            // High priority bugs
            {
                type: BugCategory.LOGIC,
                severity: BugSeverity.HIGH,
                title: 'Empty catch block',
                description: 'Catch block without error handling',
                pattern: /catch\s*\([^)]+\)\s*\{\s*\}/g,
                suggestion: 'Add proper error handling or logging',
            },
            {
                type: BugCategory.LOGIC,
                severity: BugSeverity.HIGH,
                title: 'Assignment in condition',
                description: 'Assignment instead of comparison in conditional',
                pattern: /if\s*\(\s*\w+\s*=\s*[^=]\s*\)/g,
                suggestion: 'Use == or === for comparison',
            },
            {
                type: BugCategory.PERFORMANCE,
                severity: BugSeverity.HIGH,
                title: 'Inefficient loop',
                description: 'Nested loops without optimization',
                pattern: /for\s*\([^)]+\)\s*\{[^}]*for\s*\([^)]+\)/g,
                suggestion: 'Consider using more efficient algorithms or data structures',
            },
            // Medium priority bugs
            {
                type: BugCategory.STYLE,
                severity: BugSeverity.MEDIUM,
                title: 'Console.log left in code',
                description: 'Debug console statement',
                pattern: /console\.(log|debug|info)\(/g,
                suggestion: 'Remove or replace with proper logging',
            },
            {
                type: BugCategory.PERFORMANCE,
                severity: BugSeverity.MEDIUM,
                title: 'Unused variable',
                description: 'Variable declared but never used',
                pattern: /(?:let|const|var)\s+(\w+)\s*[=;]/g,
                suggestion: 'Remove unused variables',
            },
            {
                type: BugCategory.LOGIC,
                severity: BugSeverity.MEDIUM,
                title: 'Missing return',
                description: 'Function without return statement',
                pattern: /function\s+\w+\s*\([^)]*\)\s*\{[^}]*\}(?!\s*return)/g,
                suggestion: 'Add return statement or void return type',
            },
            // Low priority bugs
            {
                type: BugCategory.STYLE,
                severity: BugSeverity.LOW,
                title: 'Inconsistent spacing',
                description: 'Inconsistent spacing around operators',
                pattern: /\w\s*[=+\-*/<>!]=?\s*\w/g,
                suggestion: 'Use consistent spacing around operators',
            },
        ];
    }
    /**
     * Detect bugs in code
     */
    detectBugs(code, filePath = 'unknown', options) {
        const mergedOptions = {
            minSeverity: options?.minSeverity || BugSeverity.LOW,
            categories: options?.categories || Object.values(BugCategory),
            includeSuggestions: options?.includeSuggestions ?? true,
            maxBugs: options?.maxBugs || 100,
        };
        const bugs = [];
        const lines = code.split('\n');
        // Filter patterns by category and severity
        const relevantPatterns = this.patterns.filter(p => mergedOptions.categories.includes(p.type) &&
            this.severityCompare(p.severity, mergedOptions.minSeverity) >= 0);
        // Check each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lineNumber = i + 1;
            for (const pattern of relevantPatterns) {
                const matches = line.matchAll(pattern.pattern);
                for (const match of matches) {
                    if (bugs.length >= mergedOptions.maxBugs)
                        break;
                    bugs.push({
                        id: `bug-${bugs.length + 1}`,
                        severity: pattern.severity,
                        category: pattern.type,
                        title: pattern.title,
                        description: pattern.description,
                        filePath,
                        lineNumber,
                        snippet: line.trim(),
                        suggestedFix: mergedOptions.includeSuggestions
                            ? pattern.suggestion
                            : undefined,
                        confidence: this.calculateConfidence(pattern, line),
                    });
                }
            }
            if (bugs.length >= mergedOptions.maxBugs)
                break;
        }
        // Sort by severity and confidence
        return bugs.sort((a, b) => {
            const severityDiff = this.severityCompare(b.severity, a.severity);
            if (severityDiff !== 0)
                return severityDiff;
            return b.confidence - a.confidence;
        });
    }
    /**
     * Generate bug report
     */
    generateReport(bugs) {
        if (bugs.length === 0) {
            return '✅ No bugs detected!';
        }
        const lines = [];
        // Summary
        const bySeverity = this.groupBySeverity(bugs);
        lines.push('🐛 Bug Detection Report');
        lines.push('═'.repeat(80));
        lines.push(`Total bugs found: ${bugs.length}\n`);
        // By severity
        lines.push('Bugs by severity:');
        for (const [severity, count] of Object.entries(bySeverity)) {
            lines.push(`  ${severity.toUpperCase()}: ${count}`);
        }
        lines.push('');
        // Detailed bugs
        lines.push('Details:');
        lines.push('─'.repeat(80));
        for (const bug of bugs) {
            lines.push(`[${bug.severity.toUpperCase()}] ${bug.title}`);
            lines.push(`  Location: ${bug.filePath}:${bug.lineNumber}`);
            lines.push(`  Category: ${bug.category}`);
            lines.push(`  Description: ${bug.description}`);
            lines.push(`  Code: ${bug.snippet}`);
            if (bug.suggestedFix) {
                lines.push(`  Suggestion: ${bug.suggestedFix}`);
            }
            lines.push(`  Confidence: ${(bug.confidence * 100).toFixed(0)}%`);
            lines.push('');
        }
        return lines.join('\n');
    }
    /**
     * Compare severity levels
     */
    severityCompare(a, b) {
        const order = [
            BugSeverity.LOW,
            BugSeverity.MEDIUM,
            BugSeverity.HIGH,
            BugSeverity.CRITICAL,
        ];
        return order.indexOf(a) - order.indexOf(b);
    }
    /**
     * Group bugs by severity
     */
    groupBySeverity(bugs) {
        const groups = {};
        for (const bug of bugs) {
            groups[bug.severity] = (groups[bug.severity] || 0) + 1;
        }
        return groups;
    }
    /**
     * Calculate confidence score for a bug
     */
    calculateConfidence(pattern, line) {
        let confidence = 0.5;
        // Higher confidence for more specific patterns
        if (pattern.pattern.source.length > 50) {
            confidence += 0.2;
        }
        // Higher confidence for critical/high severity
        if (pattern.severity === BugSeverity.CRITICAL ||
            pattern.severity === BugSeverity.HIGH) {
            confidence += 0.1;
        }
        // Lower confidence for style issues
        if (pattern.type === BugCategory.STYLE) {
            confidence -= 0.1;
        }
        return Math.min(Math.max(confidence, 0), 1);
    }
    /**
     * Add custom bug pattern
     */
    addPattern(pattern) {
        this.patterns.push(pattern);
    }
    /**
     * Get all patterns
     */
    getPatterns() {
        return [...this.patterns];
    }
    /**
     * Clear custom patterns
     */
    clearPatterns() {
        // Keep default patterns, remove custom ones
        this.patterns = this.patterns.slice(0, 10);
    }
}
exports.BugDetectionAPI = BugDetectionAPI;
/**
 * Factory function
 */
function createBugDetection() {
    return new BugDetectionAPI();
}
//# sourceMappingURL=bugs.js.map