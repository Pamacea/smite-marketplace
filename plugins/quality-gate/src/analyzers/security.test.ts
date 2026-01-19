/**
 * Security Scanner Tests
 * Tests for security vulnerability detection using pattern matching
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as ts from 'typescript';
import { SecurityScanner } from './security';
import { TypeScriptParser } from '../parser';
import { JudgeLogger } from '../logger';
import { ASTAnalysisContext, SecurityRuleConfig, ValidationIssue } from '../types';

describe('SecurityScanner', () => {
  let parser: TypeScriptParser;
  let logger: JudgeLogger;

  beforeEach(() => {
    logger = new JudgeLogger(process.cwd(), 'error');
    parser = new TypeScriptParser(logger);
  });

  describe('SQL Injection Detection', () => {
    it('should detect SQL injection with template literal', () => {
      const code = `
        const userId = req.params.id;
        const query = query(\`SELECT * FROM users WHERE id = \${userId}\`);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'sql-injection', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'sql-injection')).toBe(true);
      const sqlIssue = context.issues.find((i) => i.rule === 'sql-injection');
      expect(sqlIssue?.severity).toBe('critical');
      expect(context.metrics.security.categories.injection).toBeGreaterThan(0);
    });

    it('should not flag parameterized queries', () => {
      const code = `
        const userId = req.params.id;
        const query = query('SELECT * FROM users WHERE id = ?', [userId]);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'sql-injection', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'sql-injection')).toBe(false);
    });
  });

  describe('XSS Detection', () => {
    it('should detect innerHTML assignment', () => {
      const code = `
        const userInput = req.body.content;
        document.getElementById('output').innerHTML = userInput;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'xss-vulnerability', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'xss-vulnerability')).toBe(true);
      expect(context.metrics.security.categories.xss).toBeGreaterThan(0);
    });

    it('should detect dangerouslySetInnerHTML', () => {
      const code = `
        const userInput = req.body.content;
        const element = <div dangerouslySetInnerHTML={{ __html: userInput }} />;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'xss-vulnerability', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'xss-vulnerability')).toBe(true);
    });

    it('should not flag textContent', () => {
      const code = `
        const userInput = req.body.content;
        document.getElementById('output').textContent = userInput;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'xss-vulnerability', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'xss-vulnerability')).toBe(false);
    });
  });

  describe('Weak Cryptography Detection', () => {
    it('should detect MD5 usage', () => {
      const code = `
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(data).digest('hex');
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'weak-crypto', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'weak-crypto')).toBe(true);
    });

    it('should detect SHA1 usage', () => {
      const code = `
        const crypto = require('crypto');
        const hash = crypto.createHash('sha1').update(data).digest('hex');
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'weak-crypto', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'weak-crypto')).toBe(true);
    });

    it('should detect createCipher usage', () => {
      const code = `
        const crypto = require('crypto');
        const cipher = crypto.createCipher('aes-256-cbc', key);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'weak-crypto', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'weak-crypto')).toBe(true);
    });

    it('should not flag createCipherIV (authenticated encryption)', () => {
      const code = `
        const crypto = require('crypto');
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'weak-crypto', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'weak-crypto')).toBe(false);
    });
  });

  describe('Hardcoded Secrets Detection', () => {
    it('should detect hardcoded password', () => {
      const code = `
        const password = "SuperSecret123!";
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'hardcoded-secret', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'hardcoded-secret')).toBe(true);
    });

    it('should detect hardcoded API key', () => {
      const code = `
        const apiKey = 'sk-1234567890abcdef';
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'hardcoded-secret', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'hardcoded-secret')).toBe(true);
    });

    it('should not flag environment variables', () => {
      const code = `
        const password = process.env.PASSWORD;
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'hardcoded-secret', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'hardcoded-secret')).toBe(false);
    });
  });

  describe('Rule Configuration', () => {
    it('should respect enabled flag', () => {
      const code = `
        const password = "SuperSecret123!";
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'hardcoded-secret', enabled: false }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.issues.some((i) => i.rule === 'hardcoded-secret')).toBe(false);
    });

    it('should allow custom severity override', () => {
      const code = `
        const password = "SuperSecret123!";
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [
        { id: 'hardcoded-secret', enabled: true, severity: 'warning' },
      ];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      const secretIssue = context.issues.find((i) => i.rule === 'hardcoded-secret');
      expect(secretIssue?.severity).toBe('error'); // Security warnings map to errors
    });
  });

  describe('Metrics Tracking', () => {
    it('should track critical issues', () => {
      const code = `
        const password = "secret";
        const query = query(\`SELECT * FROM users WHERE id = \${userId}\`);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [
        { id: 'hardcoded-secret', enabled: true },
        { id: 'sql-injection', enabled: true },
      ];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.metrics.security.criticalIssues).toBe(2);
    });

    it('should track error issues', () => {
      const code = `
        const hash = md5(data);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'weak-crypto', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      expect(context.metrics.security.errorIssues).toBe(1);
    });
  });

  describe('Code Snippets', () => {
    it('should include code snippets in issues', () => {
      const code = `
        const query = query(\`SELECT * FROM users WHERE id = \${userId}\`);
      `;

      const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.Latest);
      const context: ASTAnalysisContext = {
        sourceFile,
        config: null as any,
        issues: [],
        metrics: {
          complexity: {
            cyclomaticComplexity: 0,
            cognitiveComplexity: 0,
            nestingDepth: 0,
            functionLength: 0,
            parameterCount: 0,
            totalFunctions: 0,
            highComplexityFunctions: 0,
          },
          security: {
            criticalIssues: 0,
            errorIssues: 0,
            warningIssues: 0,
            categories: {
              injection: 0,
              xss: 0,
              crypto: 0,
              auth: 0,
              dataExposure: 0,
            },
          },
          semantics: {
            apiContractViolations: 0,
            typeInconsistencies: 0,
            namingViolations: 0,
            duplicateCodeInstances: 0,
          },
        },
      };

      const ruleConfigs: SecurityRuleConfig[] = [{ id: 'sql-injection', enabled: true }];
      const scanner = new SecurityScanner(parser, logger, ruleConfigs);
      scanner.scan(sourceFile, context);

      const sqlIssue = context.issues.find((i) => i.rule === 'sql-injection');
      expect(sqlIssue?.codeSnippet).toBeDefined();
      expect(sqlIssue?.codeSnippet?.length).toBeGreaterThan(0);
    });
  });
});
