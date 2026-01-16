/**
 * Bug Detection API
 *
 * APIs for automated bug detection using pattern matching,
 * static analysis, and heuristics.
 *
 * @module api/bugs
 */

/**
 * Bug severity levels
 */
export enum BugSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Bug category
 */
export enum BugCategory {
  SYNTAX = 'syntax',
  LOGIC = 'logic',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  STYLE = 'style',
}

/**
 * Bug detection result
 */
export interface BugResult {
  /** Bug ID */
  id: string;

  /** Severity level */
  severity: BugSeverity;

  /** Category */
  category: BugCategory;

  /** Title */
  title: string;

  /** Description */
  description: string;

  /** File where bug was found */
  filePath: string;

  /** Line number */
  lineNumber: number;

  /** Code snippet */
  snippet: string;

  /** Suggested fix */
  suggestedFix?: string;

  /** Confidence (0-1) */
  confidence: number;
}

/**
 * Bug detection options
 */
export interface BugDetectionOptions {
  /** Severity threshold */
  minSeverity?: BugSeverity;

  /** Categories to detect */
  categories?: BugCategory[];

  /** Whether to include suggestions */
  includeSuggestions?: boolean;

  /** Maximum number of bugs to report */
  maxBugs?: number;
}

/**
 * Bug pattern definition
 */
interface BugPattern {
  /** Pattern type */
  type: BugCategory;

  /** Severity */
  severity: BugSeverity;

  /** Title */
  title: string;

  /** Description */
  description: string;

  /** Pattern regex */
  pattern: RegExp;

  /** Suggestion template */
  suggestion?: string;
}

/**
 * Bug Detection API class
 */
export class BugDetectionAPI {
  private patterns: BugPattern[] = [
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

  /**
   * Detect bugs in code
   */
  detectBugs(
    code: string,
    filePath: string = 'unknown',
    options?: BugDetectionOptions
  ): BugResult[] {
    const mergedOptions: Required<BugDetectionOptions> = {
      minSeverity: options?.minSeverity || BugSeverity.LOW,
      categories: options?.categories || Object.values(BugCategory),
      includeSuggestions: options?.includeSuggestions ?? true,
      maxBugs: options?.maxBugs || 100,
    };

    const bugs: BugResult[] = [];
    const lines = code.split('\n');

    // Filter patterns by category and severity
    const relevantPatterns = this.patterns.filter(
      p =>
        mergedOptions.categories.includes(p.type) &&
        this.severityCompare(p.severity, mergedOptions.minSeverity) >= 0
    );

    // Check each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      for (const pattern of relevantPatterns) {
        const matches = line.matchAll(pattern.pattern);

        for (const match of matches) {
          if (bugs.length >= mergedOptions.maxBugs) break;

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

      if (bugs.length >= mergedOptions.maxBugs) break;
    }

    // Sort by severity and confidence
    return bugs.sort((a, b) => {
      const severityDiff = this.severityCompare(b.severity, a.severity);
      if (severityDiff !== 0) return severityDiff;

      return b.confidence - a.confidence;
    });
  }

  /**
   * Generate bug report
   */
  generateReport(bugs: BugResult[]): string {
    if (bugs.length === 0) {
      return '✅ No bugs detected!';
    }

    const lines: string[] = [];

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
  private severityCompare(
    a: BugSeverity,
    b: BugSeverity
  ): number {
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
  private groupBySeverity(bugs: BugResult[]): Record<string, number> {
    const groups: Record<string, number> = {};

    for (const bug of bugs) {
      groups[bug.severity] = (groups[bug.severity] || 0) + 1;
    }

    return groups;
  }

  /**
   * Calculate confidence score for a bug
   */
  private calculateConfidence(pattern: BugPattern, line: string): number {
    let confidence = 0.5;

    // Higher confidence for more specific patterns
    if (pattern.pattern.source.length > 50) {
      confidence += 0.2;
    }

    // Higher confidence for critical/high severity
    if (
      pattern.severity === BugSeverity.CRITICAL ||
      pattern.severity === BugSeverity.HIGH
    ) {
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
  addPattern(pattern: BugPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Get all patterns
   */
  getPatterns(): BugPattern[] {
    return [...this.patterns];
  }

  /**
   * Clear custom patterns
   */
  clearPatterns(): void {
    // Keep default patterns, remove custom ones
    this.patterns = this.patterns.slice(0, 10);
  }
}

/**
 * Factory function
 */
export function createBugDetection(): BugDetectionAPI {
  return new BugDetectionAPI();
}
