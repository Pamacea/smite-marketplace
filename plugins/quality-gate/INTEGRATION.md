# Quality Gate Integration Guide

**Guide for extending and integrating with the Quality Gate system.**

---

## Table of Contents

- [Overview](#overview)
- [Architecture Extension Points](#architecture-extension-points)
- [Adding Custom Analyzers](#adding-custom-analyzers)
- [Adding Custom Security Rules](#adding-custom-security-rules)
- [Adding Custom Semantic Checks](#adding-custom-semantic-checks)
- [Creating Custom MCP Tools](#creating-custom-mcp-tools)
- [Plugin System](#plugin-system)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

---

## Overview

The Quality Gate is designed to be extensible at multiple levels:

1. **Configuration Level**: Adjust thresholds, enable/disable rules
2. **Rule Level**: Add custom validation rules
3. **Analyzer Level**: Add new analyzers for different code properties
4. **Integration Level**: Integrate with external tools and services
5. **Plugin Level**: Create standalone plugins that extend functionality

---

## Architecture Extension Points

### Extension Point Diagram

```
Quality Gate System
├── Configuration Layer (Easy)
│   ├── Adjust thresholds
│   ├── Enable/disable rules
│   └── Per-file overrides
│
├── Rule Layer (Medium)
│   ├── Custom security rules
│   ├── Custom semantic checks
│   └── Custom complexity metrics
│
├── Analyzer Layer (Advanced)
│   ├── New analyzers (AST-based)
│   ├── External analyzers (CLI tools)
│   └── Composite analyzers
│
├── Integration Layer (Advanced)
│   ├── MCP tools
│   ├── Webhooks
│   └── CI/CD systems
│
└── Plugin Layer (Expert)
    ├── Standalone plugins
    ├── Custom hooks
    └── Alternative backends
```

### Choosing the Right Extension Point

| Goal | Extension Point | Difficulty |
|------|----------------|------------|
| Adjust thresholds | Configuration | Easy |
| Add validation rule | Rule Layer | Medium |
| Add code analysis | Analyzer Layer | Advanced |
| Integrate external tool | Integration Layer | Advanced |
| Create plugin system | Plugin Layer | Expert |

---

## Adding Custom Analyzers

### Analyzer Interface

All analyzers must implement this interface:

```typescript
interface Analyzer {
  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void;
}
```

### Step-by-Step: Create a Custom Analyzer

**1. Define the analyzer class:**

```typescript
// src/analyzers/custom/example-analyzer.ts
import * as ts from 'typescript';
import { ASTAnalysisContext } from '../../types';

export interface ExampleAnalyzerConfig {
  threshold: number;
  enabledPatterns: string[];
}

export class ExampleAnalyzer {
  constructor(
    private config: ExampleAnalyzerConfig
  ) {}

  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    function visit(node: ts.Node) {
      // Your analysis logic here

      // When you find an issue:
      if (violationDetected) {
        context.issues.push({
          type: 'custom', // Your custom issue type
          severity: 'error',
          location: {
            file: sourceFile.fileName,
            line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            column: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character
          },
          message: 'Description of the issue',
          rule: 'your-rule-id',
          suggestion: 'How to fix it'
        });
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }
}
```

**2. Register configuration:**

```typescript
// src/types.ts
export interface JudgeConfig {
  // ... existing config

  // Add custom analyzer config
  customAnalyzers?: {
    example?: {
      enabled: boolean;
      threshold: number;
      enabledPatterns: string[];
    };
  };
}
```

**3. Integrate into Judge:**

```typescript
// src/judge.ts
import { ExampleAnalyzer } from './analyzers/custom/example-analyzer';

async validate(input: JudgeHookInput): Promise<JudgeHookOutput> {
  // ... existing code

  // Run custom analyzer
  const config = this.configManager.getConfig();
  if (config.customAnalyzers?.example?.enabled) {
    const exampleAnalyzer = new ExampleAnalyzer({
      threshold: config.customAnalyzers.example.threshold,
      enabledPatterns: config.customAnalyzers.example.enabledPatterns
    });
    exampleAnalyzer.analyze(sourceFile, context);
  }

  // ... rest of validation
}
```

**4. Add configuration:**

```json
{
  "customAnalyzers": {
    "example": {
      "enabled": true,
      "threshold": 100,
      "enabledPatterns": ["**/*.ts"]
    }
  }
}
```

### Example: Line Length Analyzer

```typescript
// src/analyzers/custom/line-length.ts
import * as ts from 'typescript';
import { ASTAnalysisContext, ValidationIssue } from '../../types';

export class LineLengthAnalyzer {
  constructor(private maxLineLength: number) {}

  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    const lines = sourceFile.getFullText().split('\n');

    lines.forEach((line, index) => {
      if (line.length > this.maxLineLength) {
        const issue: ValidationIssue = {
          type: 'style',
          severity: 'warning',
          location: {
            file: sourceFile.fileName,
            line: index + 1,
            column: 0
          },
          message: `Line exceeds maximum length of ${this.maxLineLength} characters (${line.length} characters)`,
          rule: 'line-max-length',
          suggestion: 'Break the line into multiple lines'
        };

        context.issues.push(issue);
      }
    });
  }
}
```

---

## Adding Custom Security Rules

### Security Rule Catalog

Rules are defined in `src/types.ts`:

```typescript
export const SECURITY_RULES: SecurityRule[] = [
  {
    id: 'your-rule-id',
    name: 'Your Rule Name',
    category: 'injection' | 'xss' | 'crypto' | 'auth' | 'dataExposure',
    severity: 'critical' | 'error',
    pattern: /your-regex-pattern/,
    message: 'Description of the security issue',
    fix: 'How to fix it',
    cwe: 'CWE-XXX',
    owasp: 'AXX:2021 – Category'
  }
];
```

### Step-by-Step: Add a Security Rule

**1. Define the rule:**

```typescript
// src/types.ts
export const SECURITY_RULES: SecurityRule[] = [
  // ... existing rules
  {
    id: 'insecure-random',
    name: 'Insecure Random Number Generation',
    category: 'crypto',
    severity: 'error',
    pattern: /Math\.random\s*\(/,
    message: 'Using Math.random() for security-sensitive purposes is insecure',
    fix: 'Use crypto.getRandomValues() or a cryptographic library',
    cwe: 'CWE-338',
    owasp: 'A02:2021 – Cryptographic Failures'
  }
];
```

**2. Enable in configuration:**

```json
{
  "security": {
    "enabled": true,
    "rules": [
      { "id": "insecure-random", "enabled": true }
    ]
  }
}
```

### Example: Dynamic Require Detection

```typescript
{
  id: 'dynamic-require',
  name: 'Dynamic Require Statement',
  category: 'injection',
  severity: 'error',
  pattern: /require\s*\(\s*[^'"]/,
  message: 'Dynamic require() can lead to code injection vulnerabilities',
  fix: 'Use static imports or validate and sanitize module paths',
  cwe: 'CWE-434',
  owasp: 'A03:2021 – Injection'
}
```

---

## Adding Custom Semantic Checks

### Semantic Check Interface

```typescript
interface SemanticCheck {
  type: string;
  enabled: boolean;
  severity: 'error' | 'warning';
}
```

### Step-by-Step: Add a Semantic Check

**1. Create checker class:**

```typescript
// src/analyzers/custom/my-check.ts
import * as ts from 'typescript';
import { ASTAnalysisContext, ValidationIssue } from '../../types';

export class MySemanticChecker {
  check(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    function visit(node: ts.Node) {
      // Your check logic

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }
}
```

**2. Register in SemanticChecker:**

```typescript
// src/analyzers/semantic.ts
import { MySemanticChecker } from './custom/my-check';

export class SemanticChecker {
  // ...

  check(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    // ... existing checks

    // Run custom check
    if (this.checks.find(c => c.type === 'my-check')?.enabled) {
      const checker = new MySemanticChecker();
      checker.check(sourceFile, context);
    }
  }
}
```

**3. Enable in configuration:**

```json
{
  "semantics": {
    "enabled": true,
    "checks": [
      { "type": "my-check", "enabled": true, "severity": "error" }
    ]
  }
}
```

### Example: Unused Import Checker

```typescript
// src/analyzers/custom/unused-imports.ts
import * as ts from 'typescript';
import { ASTAnalysisContext, ValidationIssue } from '../../types';

export class UnusedImportsChecker {
  check(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    const imports = new Map<string, ts.ImportDeclaration>();

    // Collect imports
    function collectImports(node: ts.Node) {
      if (ts.isImportDeclaration(node)) {
        const importText = node.getText();
        imports.set(importText, node);
      }
      ts.forEachChild(node, collectImports);
    }

    collectImports(sourceFile);

    // Check usage
    function checkUsage(node: ts.Node) {
      if (ts.isIdentifier(node)) {
        const text = node.getText();
        // Check if this identifier is imported
        for (const [importText, importDecl] of imports) {
          if (importText.includes(text)) {
            imports.delete(importText);
            break;
          }
        }
      }
      ts.forEachChild(node, checkUsage);
    }

    checkUsage(sourceFile);

    // Report unused imports
    for (const [importText, importDecl] of imports) {
      const issue: ValidationIssue = {
        type: 'semantic',
        severity: 'warning',
        location: {
          file: sourceFile.fileName,
          line: sourceFile.getLineAndCharacterOfPosition(importDecl.getStart()).line + 1,
          column: sourceFile.getLineAndCharacterOfPosition(importDecl.getStart()).character
        },
        message: `Unused import: ${importText}`,
        rule: 'unused-import',
        suggestion: 'Remove the unused import statement'
      };

      context.issues.push(issue);
    }
  }
}
```

---

## Creating Custom MCP Tools

### MCP Tool Interface

```typescript
interface MCPTool {
  name: string;
  description: string;
  inputSchema: z.ZodType<any>;
  handler: (args: any) => Promise<ToolResult>;
}
```

### Step-by-Step: Add an MCP Tool

**1. Define the tool schema:**

```typescript
// plugins/docs-editor-mcp/src/tools/my-tool.ts
import { z } from 'zod';

export const MyToolInputSchema = z.object({
  projectPath: z.string(),
  option: z.string().optional()
});

export type MyToolInput = z.infer<typeof MyToolInputSchema>;

export const MyToolOutputSchema = z.object({
  success: z.boolean(),
  result: z.string()
});

export type MyToolOutput = z.infer<typeof MyToolOutputSchema>;
```

**2. Implement the handler:**

```typescript
// plugins/docs-editor-mcp/src/tools/my-tool.ts
export async function executeMyTool(
  input: MyToolInput
): Promise<{ success: boolean; data: MyToolOutput } | { success: false; error: Error }> {
  try {
    // Validate input
    const validated = MyToolInputSchema.parse(input);

    // Your tool logic here
    const result = await processTool(validated);

    return {
      success: true,
      data: {
        success: true,
        result: result
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
```

**3. Register in MCP server:**

```typescript
// plugins/docs-editor-mcp/src/scribe-server.ts
import { executeMyTool } from './tools/my-tool';

export class ScribeMCPServer {
  private registerTools(): void {
    // ... existing tools

    this.server.tool(
      "my_custom_tool",
      "Description of what this tool does",
      {
        projectPath: z.string().describe("Project path"),
        option: z.string().optional().describe("Optional parameter")
      },
      async (args) => {
        const result = await executeMyTool(args);
        if (result.success) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result.data)
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  success: false,
                  error: result.error.message
                })
              }
            ]
          };
        }
      }
    );
  }
}
```

### Example: Changelog Generator Tool

```typescript
// plugins/docs-editor-mcp/src/tools/generate-changelog.ts
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

export const GenerateChangelogInputSchema = z.object({
  projectPath: z.string(),
  version: z.string().describe('Version number (e.g., "1.2.3")'),
  outputFormat: z.enum(['markdown', 'json']).default('markdown')
});

export async function generateChangelog(
  input: z.infer<typeof GenerateChangelogInputSchema>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { projectPath, version, outputFormat } = GenerateChangelogInputSchema.parse(input);

    // Get recent commits
    // (This would use git commands or git library)
    const commits = await getRecentCommits(projectPath);

    // Group commits by type (feat, fix, docs, etc.)
    const grouped = groupCommits(commits);

    // Generate changelog
    const changelog = generateChangelogContent(version, grouped, outputFormat);

    // Write to file
    const outputPath = path.join(projectPath, 'CHANGELOG.md');
    const existingContent = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
    const newContent = changelog + '\n\n' + existingContent;
    fs.writeFileSync(outputPath, newContent);

    return {
      success: true,
      data: {
        changelog,
        outputPath,
        commitsProcessed: commits.length
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Helper functions
async function getRecentCommits(projectPath: string): Promise<any[]> {
  // Implementation would use simple-git or child_process
  return [];
}

function groupCommits(commits: any[]): Record<string, any[]> {
  // Group by conventional commit type
  return {};
}

function generateChangelogContent(version: string, grouped: Record<string, any[]>, format: string): string {
  if (format === 'json') {
    return JSON.stringify({ version, grouped }, null, 2);
  }

  // Markdown format
  let markdown = `## [${version}] - ${new Date().toISOString().split('T')[0]}\n\n`;

  for (const [type, items] of Object.entries(grouped)) {
    if (items.length > 0) {
      markdown += `### ${type}\n\n`;
      items.forEach(item => {
        markdown += `- ${item.message}\n`;
      });
      markdown += '\n';
    }
  }

  return markdown;
}
```

---

## Plugin System

### Plugin Interface

Plugins can extend the Quality Gate by providing:

```typescript
interface QualityGatePlugin {
  name: string;
  version: string;

  // Lifecycle hooks
  beforeValidation?(context: ValidationContext): Promise<void>;
  afterValidation?(context: ValidationContext, result: ValidationResult): Promise<void>;

  // Analyzers
  analyzers?: Analyzer[];

  // Rules
  securityRules?: SecurityRule[];
  semanticChecks?: SemanticCheckConfig[];

  // Configuration
  configSchema?: any;
  defaultConfig?: any;
}
```

### Example Plugin

```typescript
// plugins/custom-plugin/index.ts
import { QualityGatePlugin } from '@smite/quality-gate';

const customPlugin: QualityGatePlugin = {
  name: 'my-custom-plugin',
  version: '1.0.0',

  // Lifecycle hook
  async beforeValidation(context) {
    console.log('About to validate:', context.filePath);
  },

  async afterValidation(context, result) {
    if (result.decision === 'deny') {
      console.log('Validation failed for:', context.filePath);
      // Send to external service
      await reportToExternalService(result);
    }
  },

  // Custom analyzers
  analyzers: [
    new MyCustomAnalyzer()
  ],

  // Custom security rules
  securityRules: [
    {
      id: 'custom-rule',
      name: 'Custom Security Rule',
      category: 'injection',
      severity: 'critical',
      pattern: /dangerous-pattern/,
      message: 'Custom security issue detected',
      fix: 'Fix instructions'
    }
  ],

  // Configuration
  defaultConfig: {
    customPlugin: {
      enabled: true,
      threshold: 100
    }
  }
};

export default customPlugin;
```

### Loading Plugins

```typescript
// src/plugin-loader.ts
import { QualityGatePlugin } from './types';

export class PluginLoader {
  private plugins: QualityGatePlugin[] = [];

  async loadPlugin(pluginPath: string): Promise<void> {
    const pluginModule = await import(pluginPath);
    const plugin: QualityGatePlugin = pluginModule.default || pluginModule;

    this.plugins.push(plugin);
    console.log(`Loaded plugin: ${plugin.name} v${plugin.version}`);
  }

  async loadPluginsFromConfig(configPath: string): Promise<void> {
    // Load plugins specified in config
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    if (config.plugins) {
      for (const pluginPath of config.plugins) {
        await this.loadPlugin(pluginPath);
      }
    }
  }

  getPlugins(): QualityGatePlugin[] {
    return this.plugins;
  }
}
```

### Configuration

```json
{
  "plugins": [
    "./plugins/custom-plugin/index.js",
    "@smite/custom-plugin"
  ]
}
```

---

## API Reference

### Judge Class

Main orchestrator for validation.

```typescript
class Judge {
  constructor(cwd: string)

  validate(input: JudgeHookInput): Promise<JudgeHookOutput>
}
```

### ConfigManager Class

Manages configuration.

```typescript
class ConfigManager {
  constructor(cwd: string, logger?: JudgeLogger)

  getConfig(): JudgeConfig
  getConfigForFile(filePath: string): JudgeConfig
  shouldValidateFile(filePath: string): boolean
  reloadConfig(): void
}
```

### TypeScriptParser Class

Parses code to AST.

```typescript
class TypeScriptParser {
  constructor(logger: JudgeLogger)

  parseCode(filePath: string, content: string): ts.SourceFile | null
}
```

### Base Analyzer Interface

```typescript
interface Analyzer {
  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void;
}
```

### MCP Client

```typescript
class MCPClient {
  constructor(config: { serverPath: string })

  connect(): Promise<void>
  callTool(toolName: string, params: any): Promise<any>
  close(): Promise<void>
}
```

---

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
try {
  analyzer.analyze(sourceFile, context);
} catch (error) {
  logger.error('analyzer', `Analysis failed: ${error}`);
  // Don't fail the entire validation
}
```

### 2. Performance

Optimize AST traversal:

```typescript
// Bad: Multiple traversals
analyzer1.analyze(sourceFile, context);
analyzer2.analyze(sourceFile, context);
analyzer3.analyze(sourceFile, context);

// Good: Single traversal
class CompositeAnalyzer {
  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext) {
    function visit(node: ts.Node) {
      this.analyzer1.visitNode(node, context);
      this.analyzer2.visitNode(node, context);
      this.analyzer3.visitNode(node, context);
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }
}
```

### 3. Configuration

Make features configurable:

```typescript
// Good
class MyAnalyzer {
  constructor(private config: { threshold: number }) {}
}

// Bad
class MyAnalyzer {
  private readonly THRESHOLD = 10; // Hardcoded
}
```

### 4. Testing

Write comprehensive tests:

```typescript
describe('MyAnalyzer', () => {
  it('should detect violations', () => {
    const code = 'code with violation';
    const result = analyze(code);
    expect(result.issues).toHaveLength(1);
  });

  it('should allow valid code', () => {
    const code = 'valid code';
    const result = analyze(code);
    expect(result.issues).toHaveLength(0);
  });
});
```

### 5. Documentation

Document your extensions:

```typescript
/**
 * MyCustomAnalyzer
 *
 * Analyzes code for custom pattern X.
 *
 * Configuration:
 * - threshold: Maximum allowed value (default: 100)
 * - enabledPatterns: Glob patterns to analyze (default: ["**/*.ts"])
 *
 * Issues:
 * - Rule: my-custom-rule
 * - Severity: error
 * - Fix: Suggestion for fixing
 */
export class MyCustomAnalyzer {
  // ...
}
```

---

## Related Documentation

- [README.md](README.md) - User guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) - Configuration reference
- [examples/custom-rules.md](examples/custom-rules.md) - Custom rules examples
- [examples/integration-examples.md](examples/integration-examples.md) - Integration examples

---

## Getting Help

- **GitHub Issues**: https://github.com/pamacea/smite/issues
- **Discussions**: https://github.com/pamacea/smite/discussions
- **Discord**: [Smite Discord Server]

---

**Last Updated:** 2025-01-19
