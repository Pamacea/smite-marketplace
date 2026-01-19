# Custom Validation Rules

Examples of adding custom validation rules to the Quality Gate.

---

## Table of Contents

- [Custom Complexity Rule](#custom-complexity-rule)
- [Custom Security Rule](#custom-security-rule)
- [Custom Semantic Check](#custom-semantic-check)
- [Custom Analyzer](#custom-analyzer)

---

## Custom Complexity Rule

### Scenario: Limit Switch Statement Complexity

You want to enforce a limit on the number of `case` statements in switch blocks.

### Implementation

**1. Define the rule:**

```typescript
// src/analyzers/custom/switch-complexity.ts
import * as ts from 'typescript';
import { ValidationIssue, ASTAnalysisContext } from '../../types';

export class SwitchComplexityAnalyzer {
  constructor(
    private maxCases: number
  ) {}

  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    function visit(node: ts.Node) {
      if (ts.isSwitchStatement(node)) {
        const caseCount = node.caseBlock.clauses.filter(
          clause => ts.isCaseClause(clause)
        ).length;

        if (caseCount > this.maxCases) {
          const issue: ValidationIssue = {
            type: 'complexity',
            severity: 'error',
            location: {
              file: sourceFile.fileName,
              line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
              column: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character
            },
            message: `Switch statement has ${caseCount} cases, which exceeds the maximum of ${this.maxCases}`,
            rule: 'switch-max-cases',
            suggestion: 'Consider using a lookup table or strategy pattern instead'
          };

          context.issues.push(issue);
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }
}
```

**2. Integrate into Judge:**

```typescript
// src/judge.ts
import { SwitchComplexityAnalyzer } from './analyzers/custom/switch-complexity';

async validate(input: JudgeHookInput): Promise<JudgeHookOutput> {
  // ... existing code

  // Run custom switch complexity analyzer
  const config = this.configManager.getConfig();
  const maxCases = (config as any).customRules?.switchMaxCases || 10;
  const switchAnalyzer = new SwitchComplexityAnalyzer(maxCases);
  switchAnalyzer.analyze(sourceFile, context);

  // ... rest of validation
}
```

**3. Add configuration:**

```json
{
  "customRules": {
    "switchMaxCases": 10
  }
}
```

---

## Custom Security Rule

### Scenario: Detect Console Logging in Production

You want to prevent console.log statements in production code.

### Implementation

**1. Add rule to catalog:**

```typescript
// src/types.ts
export const SECURITY_RULES: SecurityRule[] = [
  // ... existing rules
  {
    id: 'console-log-in-production',
    name: 'Console Logging in Production',
    category: 'dataExposure',
    severity: 'warning',
    pattern: /console\.(log|warn|info|debug)\s*\(/,
    message: 'Console logging detected in production code',
    fix: 'Remove console.log or use a proper logging library',
    cwe: 'CWE-532',
    owasp: 'A09:2021 – Security Logging and Monitoring Failures'
  }
];
```

**2. Enable in config:**

```json
{
  "security": {
    "enabled": true,
    "rules": [
      { "id": "console-log-in-production", "enabled": true, "severity": "warning" }
    ]
  }
}
```

**3. Use per-file overrides:**

```json
{
  "overrides": [
    {
      "files": "**/test/**/*.ts",
      "security": {
        "rules": [
          { "id": "console-log-in-production", "enabled": false }
        ]
      }
    }
  ]
}
```

---

## Custom Semantic Check

### Scenario: Enforce Async Function Naming

You want async functions to have names starting with a verb.

### Implementation

**1. Create semantic check:**

```typescript
// src/analyzers/custom/async-naming.ts
import * as ts from 'typescript';
import { ValidationIssue, ASTAnalysisContext } from '../../types';

export class AsyncNamingChecker {
  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    const VERBS = ['get', 'fetch', 'load', 'create', 'update', 'delete', 'save', 'find', 'check', 'validate'];

    function isVerb(name: string): boolean {
      return VERBS.some(verb => name.toLowerCase().startsWith(verb));
    }

    function visit(node: ts.Node) {
      if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) {
        const isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword);

        if (isAsync && node.name && ts.isIdentifier(node.name)) {
          const functionName = node.name.text;

          if (!isVerb(functionName)) {
            const issue: ValidationIssue = {
              type: 'semantic',
              severity: 'warning',
              location: {
                file: sourceFile.fileName,
                line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
                column: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character
              },
              message: `Async function "${functionName}" should start with a verb`,
              rule: 'async-naming-convention',
              suggestion: `Consider renaming to start with: ${VERBS.slice(0, 3).join(', ')}...`
            };

            context.issues.push(issue);
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }
}
```

**2. Register in SemanticChecker:**

```typescript
// src/analyzers/semantic.ts
import { AsyncNamingChecker } from './custom/async-naming';

export class SemanticChecker {
  // ... existing code

  check(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    // ... existing checks

    // Run custom async naming checker
    if (this.checks.find(c => c.type === 'async-naming')?.enabled) {
      const asyncNamingChecker = new AsyncNamingChecker();
      asyncNamingChecker.analyze(sourceFile, context);
    }
  }
}
```

**3. Enable in config:**

```json
{
  "semantics": {
    "enabled": true,
    "checks": [
      { "type": "async-naming", "enabled": true, "severity": "warning" }
    ]
  }
}
```

---

## Custom Analyzer

### Scenario: Enforce Comment Coverage

You want to ensure functions have JSDoc comments.

### Implementation

**1. Create analyzer:**

```typescript
// src/analyzers_custom/comment-coverage.ts
import * as ts from 'typescript';
import { ValidationIssue, ASTAnalysisContext } from '../../types';

export class CommentCoverageAnalyzer {
  constructor(
    private minCoveragePercent: number
  ) {}

  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    let totalFunctions = 0;
    let documentedFunctions = 0;

    function hasJSDoc(node: ts.Node): boolean {
      const jsDocs = (node as any).jsDoc;
      return jsDocs && jsDocs.length > 0;
    }

    function visit(node: ts.Node) {
      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
        totalFunctions++;

        if (hasJSDoc(node)) {
          documentedFunctions++;
        } else if (node.name) {
          const issue: ValidationIssue = {
            type: 'semantic',
            severity: 'warning',
            location: {
              file: sourceFile.fileName,
              line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
              column: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character
            },
            message: `Function "${node.name.text}" is missing JSDoc documentation`,
            rule: 'missing-jsdoc',
            suggestion: 'Add JSDoc comments to document the function'
          };

          context.issues.push(issue);
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    // Calculate coverage
    const coverage = totalFunctions > 0 ? (documentedFunctions / totalFunctions) * 100 : 100;
    const metrics = context.metrics as any;
    metrics.commentCoverage = {
      totalFunctions,
      documentedFunctions,
      coveragePercent: coverage
    };

    // Check minimum coverage
    if (coverage < this.minCoveragePercent) {
      const issue: ValidationIssue = {
        type: 'semantic',
        severity: 'warning',
        message: `File has ${coverage.toFixed(1)}% comment coverage, which is below the required ${this.minCoveragePercent}%`,
        rule: 'comment-coverage-threshold',
        suggestion: `Add JSDoc comments to ${totalFunctions - documentedFunctions} more functions`
      };

      context.issues.push(issue);
    }
  }
}
```

**2. Integrate into Judge:**

```typescript
// src/judge.ts
import { CommentCoverageAnalyzer } from './analyzers/custom/comment-coverage';

async validate(input: JudgeHookInput): Promise<JudgeHookOutput> {
  // ... existing code

  // Run comment coverage analyzer
  const config = this.configManager.getConfig();
  const minCoverage = (config as any).customRules?.minCommentCoverage || 80;
  const commentAnalyzer = new CommentCoverageAnalyzer(minCoverage);
  commentAnalyzer.analyze(sourceFile, context);

  // ... rest of validation
}
```

**3. Add configuration:**

```json
{
  "customRules": {
    "minCommentCoverage": 80
  }
}
```

---

## Testing Custom Rules

### Unit Test Example

```typescript
// src/analyzers/custom/switch-complexity.test.ts
import { describe, it, expect } from 'vitest';
import { SwitchComplexityAnalyzer } from './switch-complexity';
import { TypeScriptParser } from '../../parser';
import { JudgeLogger } from '../../logger';

describe('SwitchComplexityAnalyzer', () => {
  it('should detect switch statements with too many cases', () => {
    const code = `
      switch (value) {
        case 1: break;
        case 2: break;
        case 3: break;
        case 4: break;
        case 5: break;
        case 6: break;
        case 7: break;
        case 8: break;
        case 9: break;
        case 10: break;
        case 11: break;
      }
    `;

    const logger = new JudgeLogger('.', 'error');
    const parser = new TypeScriptParser(logger);
    const sourceFile = parser.parseCode('test.ts', code);

    const context = {
      sourceFile,
      config: {} as any,
      issues: [],
      metrics: {}
    };

    const analyzer = new SwitchComplexityAnalyzer(10);
    analyzer.analyze(sourceFile, context);

    expect(context.issues).toHaveLength(1);
    expect(context.issues[0].rule).toBe('switch-max-cases');
  });
});
```

---

## Best Practices

### 1. Use Appropriate Severity Levels

- **critical**: Security vulnerabilities, data exposure
- **error**: Code quality issues that should be fixed
- **warning**: Style issues, suggestions

### 2. Provide Actionable Suggestions

```typescript
const issue: ValidationIssue = {
  type: 'complexity',
  severity: 'error',
  message: 'Function is too complex',
  rule: 'complexity-limit',
  suggestion: 'Extract nested logic into separate functions' // ✅ Good
  // suggestion: 'Refactor this' // ❌ Too vague
};
```

### 3. Make Rules Configurable

```typescript
class CustomAnalyzer {
  constructor(private threshold: number) {} // ✅ Configurable
  // vs
  private readonly THRESHOLD = 10; // ❌ Hardcoded
}
```

### 4. Handle Edge Cases

```typescript
function visit(node: ts.Node) {
  // Always check for null/undefined
  if (!node) return;

  // Handle different node types
  if (ts.isFunctionDeclaration(node)) {
    // Process function declaration
  } else if (ts.isFunctionExpression(node)) {
    // Process function expression
  }

  // Always traverse children
  ts.forEachChild(node, visit);
}
```

### 5. Document Your Rules

```typescript
/**
 * SwitchComplexityAnalyzer
 *
 * Enforces a limit on the number of case statements in switch blocks.
 * High case counts indicate code that should be refactored into:
 * - Lookup tables (for simple key-value mappings)
 * - Strategy pattern (for complex behavior)
 * - Polymorphism (for type-based dispatch)
 *
 * @param maxCases - Maximum allowed cases (default: 10)
 */
export class SwitchComplexityAnalyzer {
  // ...
}
```

---

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [CONFIG_REFERENCE.md](../CONFIG_REFERENCE.md) - Configuration reference
- [INTEGRATION.md](../INTEGRATION.md) - Integration guide

---

**Last Updated:** 2025-01-19
