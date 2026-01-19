/**
 * Quality Gate Type Definitions
 * Core interfaces for the code quality validation system
 */

import * as ts from 'typescript';

// ============================================================================
// Hook Input/Output Types (Claude Code Hook System)
// ============================================================================

export interface JudgeHookInput {
  session_id: string;
  transcript_path: string;
  cwd: string;
  hook_event_name: 'PreToolUse';
  tool_name: 'Write' | 'Edit' | 'MultiEdit';
  tool_input: WriteInput | EditInput;
}

export interface WriteInput {
  file_path: string;
  content: string;
}

export interface EditInput {
  file_path: string;
  old_string: string;
  new_string: string;
}

export interface JudgeHookOutput {
  hookSpecificOutput: {
    hookEventName: 'PreToolUse';
    permissionDecision: 'allow' | 'deny' | 'ask';
    permissionDecisionReason: string;
  };
}

// ============================================================================
// Validation Results Types
// ============================================================================

export type Decision = 'allow' | 'deny';

export type Severity = 'critical' | 'error' | 'warning';

export type IssueCategory = 'complexity' | 'semantic' | 'security' | 'test';

export interface TestFailure {
  testFile: string;
  testName: string;
  message: string;
  stackTrace?: string;
  line: number;
  column: number;
}

export interface TestResults {
  passed: boolean;
  skipped: boolean;
  framework: 'jest' | 'vitest' | 'mocha' | 'pytest' | 'none';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  failures: TestFailure[];
  executionTimeMs: number;
}

export type FrameworkDetection = 'jest' | 'vitest' | 'mocha' | 'pytest' | 'none';

export interface TestConfig {
  enabled: boolean;
  command?: string;
  framework?: FrameworkDetection;
  timeoutMs: number;
  failOnTestFailure: boolean;
}

export interface ValidationIssue {
  type: IssueCategory;
  severity: Severity;
  location?: {
    file: string;
    line: number;
    column: number;
  };
  message: string;
  rule: string;
  suggestion?: string;
  codeSnippet?: string;
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  nestingDepth: number;
  functionLength: number;
  parameterCount: number;
  totalFunctions: number;
  highComplexityFunctions: number;
}

export interface SecurityMetrics {
  criticalIssues: number;
  errorIssues: number;
  warningIssues: number;
  categories: {
    injection: number;
    xss: number;
    crypto: number;
    auth: number;
    dataExposure: number;
  };
}

export interface SemanticMetrics {
  apiContractViolations: number;
  typeInconsistencies: number;
  namingViolations: number;
  duplicateCodeInstances: number;
}

export interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  failures: TestFailure[];
}

export interface ValidationMetrics {
  complexity: ComplexityMetrics;
  security: SecurityMetrics;
  semantics: SemanticMetrics;
  tests?: TestMetrics;
}

export interface ValidationResults {
  decision: Decision;
  confidence: number;
  issues: ValidationIssue[];
  metrics: ValidationMetrics;
  analysisTimeMs: number;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface ComplexityThresholds {
  maxCyclomaticComplexity: number;
  maxCognitiveComplexity: number;
  maxNestingDepth: number;
  maxFunctionLength: number;
  maxParameterCount: number;
}

export interface SecurityRule {
  id: string;
  name: string;
  category: 'injection' | 'xss' | 'crypto' | 'auth' | 'dataExposure';
  severity: 'critical' | 'error';
  pattern: RegExp;
  message: string;
  fix: string;
  cwe?: string;
  owasp?: string;
}

export interface SemanticCheckConfig {
  type: string;
  enabled: boolean;
  severity: 'error' | 'warning';
}

export interface JudgeConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxRetries: number;

  // File filtering
  include: string[];
  exclude: string[];

  // Complexity thresholds
  complexity: ComplexityThresholds;

  // Semantic checks
  semantics: {
    enabled: boolean;
    checks: SemanticCheckConfig[];
  };

  // Security rules
  security: {
    enabled: boolean;
    rules: SecurityRuleConfig[];
  };

  // Test execution
  tests: TestConfig;

  // Output formatting
  output: {
    format: 'json' | 'text';
    includeCodeSnippets: boolean;
    maxSuggestions: number;
  };
}

export interface SecurityRuleConfig {
  id: string;
  enabled: boolean;
  severity?: 'critical' | 'error' | 'warning';
  customPattern?: string;
}

// ============================================================================
// Retry State Types
// ============================================================================

export interface RetryState {
  sessionId: string;
  retryCount: number;
  maxRetries: number;
  lastFailureTimestamp: number;
  issuesDetected: ValidationIssue[];
  previousAttempts: CodeChangeAttempt[];
}

export interface CodeChangeAttempt {
  timestamp: number;
  filePath: string;
  contentHash: string;
  validationResults: ValidationResults;
}

// ============================================================================
// AST Analysis Types
// ============================================================================

export interface FunctionInfo {
  name: string;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  complexity: number;
  cognitiveComplexity: number;
  nestingDepth: number;
  parameterCount: number;
  length: number;
}

export interface ASTAnalysisContext {
  sourceFile: ts.SourceFile;
  config: JudgeConfig;
  issues: ValidationIssue[];
  metrics: ValidationMetrics;
}

// ============================================================================
// Default Configuration
// ============================================================================

export const DEFAULT_CONFIG: JudgeConfig = {
  enabled: true,
  logLevel: 'info',
  maxRetries: 3,
  include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  exclude: [
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
  ],
  complexity: {
    maxCyclomaticComplexity: 10,
    maxCognitiveComplexity: 15,
    maxNestingDepth: 4,
    maxFunctionLength: 50,
    maxParameterCount: 5,
  },
  semantics: {
    enabled: true,
    checks: [
      { type: 'api-contract', enabled: true, severity: 'error' },
      { type: 'type-consistency', enabled: true, severity: 'error' },
      { type: 'naming', enabled: false, severity: 'warning' },
      { type: 'duplicate-code', enabled: false, severity: 'warning' },
    ],
  },
  security: {
    enabled: true,
    rules: [
      { id: 'sql-injection', enabled: true },
      { id: 'xss-vulnerability', enabled: true },
      { id: 'weak-crypto', enabled: true },
      { id: 'hardcoded-secret', enabled: true },
    ],
  },
  tests: {
    enabled: false,
    timeoutMs: 60000,
    failOnTestFailure: true,
  },
  output: {
    format: 'text',
    includeCodeSnippets: true,
    maxSuggestions: 5,
  },
};

// ============================================================================
// Security Rules Catalog
// ============================================================================

export const SECURITY_RULES: SecurityRule[] = [
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    category: 'injection',
    severity: 'critical',
    pattern: /(?:query|execute)\s*\(\s*[`'"]\s*\$\s*{/,
    message: 'Potential SQL injection - user input directly concatenated',
    fix: 'Use parameterized queries or prepared statements',
    cwe: 'CWE-89',
    owasp: 'A01:2021 – Broken Access Control',
  },
  {
    id: 'xss-vulnerability',
    name: 'Cross-Site Scripting (XSS)',
    category: 'xss',
    severity: 'critical',
    pattern: /innerHTML\s*=\s*|dangerouslySetInnerHTML/,
    message: 'XSS vulnerability - unsanitized input rendered to DOM',
    fix: 'Use textContent or sanitize with DOMPurify',
    cwe: 'CWE-79',
    owasp: 'A03:2021 – Injection',
  },
  {
    id: 'weak-crypto',
    name: 'Weak Cryptographic Algorithm',
    category: 'crypto',
    severity: 'error',
    pattern: /createCipher\s*\(|md5\s*\(|sha1\s*\(/,
    message: 'Weak cryptographic algorithm detected',
    fix: 'Use authenticated encryption (AES-256-GCM) and SHA-256+',
    cwe: 'CWE-327',
    owasp: 'A02:2021 – Cryptographic Failures',
  },
  {
    id: 'hardcoded-secret',
    name: 'Hardcoded Secret',
    category: 'dataExposure',
    severity: 'critical',
    pattern: /(?:password|secret|key|token)\s*[=:]\s*['"`](?!<).*['"`]/,
    message: 'Potential hardcoded secret in source code',
    fix: 'Use environment variables or secret management',
    cwe: 'CWE-798',
    owasp: 'A07:2021 – Identification and Authentication Failures',
  },
];
