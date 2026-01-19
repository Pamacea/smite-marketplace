# Quality Gate Architecture

**System architecture and design documentation for the Smite Quality Gate system.**

---

## Table of Contents

- [System Overview](#system-overview)
- [Component Architecture](#component-architecture)
- [Hook Pipeline Flow](#hook-pipeline-flow)
- [MCP Integration](#mcp-integration)
- [Data Flow](#data-flow)
- [Extension Points](#extension-points)
- [Design Decisions](#design-decisions)
- [Performance Considerations](#performance-considerations)

---

## System Overview

The Quality Gate is a **PreToolUse hook** that intercepts code editing operations in Claude Code and validates them before execution. It implements a multi-dimensional analysis pipeline combining complexity analysis, security scanning, semantic checks, and test execution.

### Core Principles

1. **Fail Fast**: Detect issues before code is written
2. **Context-Aware**: Provide specific, actionable feedback
3. **Non-Blocking**: Errors should never prevent development (can be disabled)
4. **Extensible**: Easy to add new analyzers and rules
5. **Transparent**: Clear audit trail of all decisions

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Claude Code                              │
│                    (Tool Use Request)                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PreToolUse Hook                               │
│                   (judge-hook.js)                                │
│                                                                   │
│  Intercepts: Write, Edit, MultiEdit tool uses                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Judge Core                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    ConfigManager                           │  │
│  │  - Load configuration from .smite/quality.json            │  │
│  │  - Apply per-file overrides                               │  │
│  │  - Environment variable overrides                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   TypeScriptParser                         │  │
│  │  - Parse source code to AST                               │  │
│  │  - Error handling for syntax errors                       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Analyzers                               │  │
│  │  ┌─────────────┬──────────────┬──────────────────────┐    │  │
│  │  │ Complexity  │   Security   │      Semantic        │    │  │
│  │  │  Analyzer   │   Scanner    │      Checker         │    │  │
│  │  └─────────────┴──────────────┴──────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     TestRunner                             │  │
│  │  - Execute tests (Jest/Vitest/Mocha/Pytest)               │  │
│  │  - Parse test results                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  DecisionEngine                            │  │
│  │  - Aggregate validation results                           │  │
│  │  - Make allow/deny decision                               │  │
│  │  - Calculate confidence score                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                FeedbackGenerator                           │  │
│  │  - Generate correction prompts                            │  │
│  │  - Track retry state                                      │  │
│  │  - Inject feedback into context                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    DocTrigger                              │  │
│  │  - Trigger documentation updates (MCP)                    │  │
│  │  - Analyze changed files                                  │  │
│  │  - Execute documentation actions                          │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
               [ALLOW]                [DENY]
                    │                       │
                    │            ┌──────────┴──────────┐
                    │            │                     │
                    ▼            ▼                     ▼
            Code Written    Feedback Prompt      Retry State
                               Injection          Tracking
```

---

## Component Architecture

### 1. Judge (Main Orchestrator)

**File:** `src/judge.ts`

**Responsibilities:**
- Initialize all components
- Coordinate validation pipeline
- Handle MCP integration lifecycle
- Generate hook output (allow/deny)

**Key Methods:**
```typescript
class Judge {
  validate(input: JudgeHookInput): Promise<JudgeHookOutput>
  private initializeMCPIntegrationIfNeeded(): Promise<void>
  private triggerDocumentationUpdates(projectPath, currentFile, results): Promise<void>
  private makeDecision(context): Decision
  private calculateConfidence(context): number
}
```

**Lifecycle:**
1. Constructor: Initialize ConfigManager, Logger, Parser, TestRunner
2. First validation: Initialize MCP client (lazy loading)
3. Each validation: Run analyzers, make decision, trigger docs
4. Destruction: Close MCP connection

---

### 2. ConfigManager

**File:** `src/config.ts`

**Responsibilities:**
- Load configuration from `.smite/quality.json`
- Validate against JSON Schema
- Apply per-file overrides
- Merge environment variables
- Provide file-specific configuration

**Configuration Priority (highest to lowest):**
1. Environment variables (`SMITE_QUALITY_*`)
2. Per-file overrides (in `overrides` array)
3. User config file (`.smite/quality.json`)
4. Default configuration (in `DEFAULT_CONFIG`)

**Key Methods:**
```typescript
class ConfigManager {
  getConfig(): JudgeConfig
  getConfigForFile(filePath: string): JudgeConfig
  shouldValidateFile(filePath: string): boolean
  reloadConfig(): void
}
```

**Override Matching Algorithm:**
```typescript
// For file: src/core/validation.ts
// Overrides are evaluated last-to-first (most specific wins)

overrides: [
  { files: "**/*.ts", complexity: { maxCyclomaticComplexity: 15 } },  // Match 1
  { files: "**/core/**/*.ts", complexity: { maxCyclomaticComplexity: 5 } }  // Match 2 (wins)
]
```

---

### 3. TypeScriptParser

**File:** `src/parser.ts`

**Responsibilities:**
- Parse TypeScript/JavaScript code to AST
- Handle parse errors gracefully
- Provide AST traversal utilities

**How it Works:**
```typescript
class TypeScriptParser {
  parseCode(filePath: string, content: string): ts.SourceFile | null {
    // Uses TypeScript Compiler API
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true  // setParentNodes for easier traversal
    );
    return sourceFile;
  }
}
```

**AST Structure:**
```
SourceFile
├── Statements[]
│   ├── FunctionDeclaration
│   │   ├── name
│   │   ├── parameters
│   │   └── body (Block)
│   │       └── statements[]
│   ├── ClassDeclaration
│   └── VariableStatement
```

---

### 4. ComplexityAnalyzer

**File:** `src/analyzers/complexity.ts`

**Responsibilities:**
- Calculate cyclomatic complexity
- Calculate cognitive complexity
- Measure nesting depth
- Count function length and parameters

**Metrics Calculated:**

#### Cyclomatic Complexity
**Definition:** Number of linearly independent paths through source code.

**Calculation:**
- Start with 1 (base path)
- Add 1 for each:
  - `if` statement
  - `for`, `while`, `do-while` loop
  - `case` statement in `switch`
  - `catch` clause
  - Conditional operator (`?:`)
  - Logical AND/OR (`&&`, `||`)

**Example:**
```typescript
// Cyclomatic complexity: 4
function example(x: number) {
  if (x > 0) {        // +1
    for (let i = 0; i < x; i++) {  // +1
      if (i % 2 === 0) {  // +1
        return i;
      }
    }
  }
  return 0;  // Base path = 1
}
```

#### Cognitive Complexity
**Definition:** How difficult code is to understand by a human.

**Calculation:**
- Nesting increments (nesting level > previous max)
- Structural breaks (break, continue, return)
- Logical operators (&&, ||, ?:)
- Recursion, Lambdas, Loops

**Example:**
```typescript
// Cognitive complexity: 8
function complex(x: number) {
  if (x > 0) {           // +1 (nesting level 1)
    if (x > 10) {        // +2 (nesting level 2, increment)
      while (x > 0) {    // +3 (nesting level 3, increment)
        x--;             // +1 (structural break)
        if (x === 5) {   // +1 (nesting level 4)
          break;         // +1 (structural break)
        }
      }
    }
  }
}
```

---

### 5. SecurityScanner

**File:** `src/analyzers/security.ts`

**Responsibilities:**
- Pattern matching for security vulnerabilities
- Map to CWE and OWASP categories
- Provide fix suggestions

**Detection Methods:**

1. **AST-Based Detection** (preferred)
   - Parse code to AST
   - Check specific node types
   - More accurate, fewer false positives

2. **Regex-Based Detection** (fallback)
   - Pattern matching on source code
   - Faster, more prone to false positives
   - Used for complex patterns

**Example: SQL Injection Detection**
```typescript
// AST-based
function detectSQLInjection(ast: ts.SourceFile): Issue[] {
  const issues: Issue[] = [];

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const methodName = node.expression.getText();
      if (methodName === 'query' || methodName === 'execute') {
        const firstArg = node.arguments[0];
        if (ts.isTemplateExpression(firstArg) ||
            ts.isNoSubstitutionTemplateLiteral(firstArg)) {
          // Check for ${} interpolation
          if (firstArg.getText().includes('${')) {
            issues.push({
              type: 'security',
              severity: 'critical',
              message: 'Potential SQL injection',
              rule: 'sql-injection'
            });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(ast);
  return issues;
}
```

**Supported Rules:**
| Rule ID | Category | Detection Method | CWE | OWASP |
|---------|----------|------------------|-----|-------|
| `sql-injection` | Injection | AST + Regex | CWE-89 | A01:2021 |
| `xss-vulnerability` | XSS | Regex | CWE-79 | A03:2021 |
| `weak-crypto` | Crypto | Regex | CWE-327 | A02:2021 |
| `hardcoded-secret` | Data Exposure | Regex | CWE-798 | A07:2021 |

---

### 6. SemanticChecker

**File:** `src/analyzers/semantic.ts`

**Responsibilities:**
- Validate naming conventions
- Check type consistency
- Detect duplicate code
- Verify API contracts

**Checks Implemented:**

#### Type Consistency
```typescript
// Check: Function return type annotations
function hasReturnTypeAnnotation(func: ts.FunctionDeclaration): boolean {
  return func.type !== undefined;
}
```

#### Naming Conventions
```typescript
// Check: camelCase for functions/variables
function isCamelCase(name: string): boolean {
  return /^[a-z][a-zA-Z0-9]*$/.test(name);
}
```

#### API Contract
```typescript
// Check: Async functions return Promise
function validateAsyncContract(func: ts.FunctionDeclaration): Issue | null {
  const isAsync = func.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword);
  const returnType = func.type?.getText();

  if (isAsync && returnType && !returnType.startsWith('Promise')) {
    return {
      type: 'semantic',
      severity: 'error',
      message: 'Async function should return Promise',
      rule: 'api-contract'
    };
  }

  return null;
}
```

---

### 7. TestRunner

**File:** `src/test-runner.ts`

**Responsibilities:**
- Detect test framework (Jest, Vitest, Mocha, Pytest)
- Execute tests
- Parse test results
- Extract failure information

**Supported Frameworks:**

| Framework | Detection Method | Command | Output Format |
|-----------|------------------|---------|---------------|
| Jest | `package.json`: "jest" | `jest --json` | JSON |
| Vitest | `package.json`: "vitest" | `vitest run --json` | JSON |
| Mocha | `package.json`: "mocha" | `mocha --json` | JSON |
| Pytest | `requirements.txt`: "pytest" | `pytest --json-report` | JSON |

**Execution Flow:**
```typescript
class TestRunner {
  async runTests(config: TestConfig): Promise<TestResults> {
    // 1. Detect framework (if not specified)
    const framework = config.framework || this.detectFramework();

    // 2. Build command
    const command = config.command || this.getDefaultCommand(framework);

    // 3. Execute with timeout
    const result = await this.executeWithTimeout(command, config.timeoutMs);

    // 4. Parse output
    const results = this.parseOutput(result.stdout, framework);

    return results;
  }
}
```

**Failure Parsing:**
```typescript
// Extract failure details from JSON output
interface TestFailure {
  testFile: string;
  testName: string;
  message: string;
  stackTrace?: string;
  line: number;
  column: number;
}
```

---

### 8. FeedbackGenerator

**File:** `src/feedback.ts`

**Responsibilities:**
- Track retry state across validation attempts
- Generate context-aware correction prompts
- Manage feedback file lifecycle

**Retry State Tracking:**
```typescript
interface RetryState {
  sessionId: string;
  retryCount: number;
  maxRetries: number;
  lastFailureTimestamp: number;
  issuesDetected: ValidationIssue[];
  previousAttempts: CodeChangeAttempt[];
}
```

**State File Location:**
```
.smit/
└── judge-feedback-state.json
```

**Prompt Generation:**
```typescript
class FeedbackGenerator {
  generateCorrectionPrompt(attempt: AttemptInfo, results: ValidationResults): string {
    const { retryCount, maxRetries } = attempt;

    let prompt = `❌ Validation failed (attempt ${retryCount}/${maxRetries})\n\n`;

    // Group issues by severity
    const critical = results.issues.filter(i => i.severity === 'critical');
    const errors = results.issues.filter(i => i.severity === 'error');
    const warnings = results.issues.filter(i => i.severity === 'warning');

    if (critical.length > 0) {
      prompt += '## Critical Issues\n';
      critical.forEach(issue => {
        prompt += `- ${issue.message}\n`;
        if (issue.suggestion) {
          prompt += `  💡 ${issue.suggestion}\n`;
        }
      });
    }

    // ... similar for errors and warnings

    return prompt;
  }
}
```

---

### 9. DocTrigger

**File:** `src/doc-trigger.ts`

**Responsibilities:**
- Analyze changed files for documentation triggers
- Execute MCP documentation tools
- Handle documentation errors gracefully

**Trigger Analysis:**
```typescript
class DocTrigger {
  async analyzeTriggers(context: TriggerContext): Promise<DocAction[]> {
    const actions: DocAction[] = [];
    const { changedFiles, validatedFiles, issues } = context;

    // Check OpenAPI trigger
    if (this.shouldTriggerOpenAPI(changedFiles)) {
      actions.push({
        type: 'openapi-sync',
        tool: 'sync_openapi_spec',
        params: {
          projectPath: this.projectPath,
          frameworks: ['express', 'nextjs']
        }
      });
    }

    // Check README trigger
    if (this.shouldTriggerReadme(changedFiles)) {
      actions.push({
        type: 'readme-update',
        tool: 'update_readme_architecture',
        params: {
          projectPath: this.projectPath,
          sectionsToUpdate: ['all']
        }
      });
    }

    // Check JSDoc trigger
    if (this.shouldTriggerJSDoc(validatedFiles)) {
      actions.push({
        type: 'jsdoc-generate',
        tool: 'generate_jsdoc_on_fly',
        params: {
          files: validatedFiles
        }
      });
    }

    return actions;
  }
}
```

**Trigger Conditions:**
- **OpenAPI**: Changed files match `mcp.triggers.openAPI.filePatterns`
- **README**: Changed files match `mcp.triggers.readme.filePatterns`
- **JSDoc**: Validated files match `mcp.triggers.jsdoc.filePatterns` AND no critical issues

---

### 10. MCPClient

**File:** `src/mcp-client.ts`

**Responsibilities:**
- Connect to MCP documentation server
- Execute MCP tools
- Handle MCP errors and retries

**MCP Integration:**
```typescript
class MCPClient {
  async connect(): Promise<void> {
    // Start MCP server process
    this.serverProcess = spawn('node', [this.config.serverPath], {
      stdio: ['pipe', 'pipe', 'inherit']  // stderr inherits for logging
    });

    // Initialize MCP client
    this.client = new Client({
      name: 'quality-gate',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await this.client.connect(this.transport);
  }

  async callTool(toolName: string, params: any): Promise<any> {
    try {
      const result = await this.client.callTool({
        name: toolName,
        arguments: params
      });
      return result;
    } catch (error) {
      // Log error but don't fail validation
      this.logger.warn('mcp', `Tool call failed: ${error}`);
      return null;
    }
  }
}
```

---

## Hook Pipeline Flow

### Complete Request Lifecycle

```
1. Claude Code calls Write/Edit/MultiEdit tool
   ↓
2. PreToolUse hook is invoked (judge-hook.js)
   ↓
3. Judge.validate() is called with hook input
   ↓
4. ConfigManager loads configuration
   - Check if quality gate is enabled
   - Get file-specific config (with overrides)
   - Check if file should be validated
   ↓
5. File Filtering
   - Match against include patterns
   - Match against exclude patterns
   - Return: allow (if excluded) or continue
   ↓
6. TypeScriptParser.parseCode()
   - Create AST from source code
   - Handle parse errors
   - Return: SourceFile | null
   ↓
7. Initialize MCP Client (first time only)
   - Connect to MCP server
   - Create DocTrigger
   - Non-blocking: continue on failure
   ↓
8. Initialize Analysis Context
   - Source file
   - Configuration
   - Empty issues array
   - Empty metrics object
   ↓
9. Run ComplexityAnalyzer.analyze()
   - Traverse AST
   - Calculate metrics for each function
   - Add issues for threshold violations
   - Update context.metrics.complexity
   ↓
10. Run SecurityScanner.scan() (if enabled)
    - Apply security rules
    - Pattern matching (AST + Regex)
    - Add issues for vulnerabilities found
    - Update context.metrics.security
    ↓
11. Run SemanticChecker.check() (if enabled)
    - Apply semantic checks
    - Validate naming, types, contracts
    - Add issues for violations
    - Update context.metrics.semantics
    ↓
12. Run TestRunner.runTests() (if enabled)
    - Detect test framework
    - Execute tests
    - Parse results
    - Add test failures as issues
    - Update context.metrics.tests
    ↓
13. Calculate Analysis Time
    - analysisTimeMs = Date.now() - startTime
    ↓
14. Make Decision
    - DecisionEngine.makeDecision()
    - Check critical issues → deny
    - Check error issues → deny
    - Check test failures → deny (if configured)
    - Otherwise → allow
    ↓
15. Calculate Confidence
    - DecisionEngine.calculateConfidence()
    - Start with 1.0 (100%)
    - Reduce for each issue:
      - Critical: -0.3
      - Error: -0.2
      - Warning: -0.05
    - Clamp to [0, 1]
    ↓
16. Log Validation Results
    - JudgeLogger.logValidation()
    - Write to .smite/judge-audit.log
    - Include: decision, issues, metrics, time
    ↓
17. Handle Decision
    ┌─────────────────┬─────────────────┐
    │                 │                 │
    ALLOW             DENY
    │                 │
    │                 ├── Check max retries
    │                 │   ├── If reached → ALLOW (with warning)
    │                 │   └── If not → continue
    │                 │
    │                 ├── Update retry state
    │                 │   ├── Increment retry count
    │                 │   ├── Save attempt history
    │                 │   └── Write to .smite/judge-feedback-state.json
    │                 │
    │                 ├── Generate correction prompt
    │                 │   ├── Group issues by severity
    │                 │   ├── Add suggestions
    │                 │   └── Include retry count
    │                 │
    │                 └── Return DENY with prompt
    │
    ├── Clear retry state
    │   └── Delete .smite/judge-feedback-state.json
    │
    ├── Trigger documentation updates
    │   ├── DocTrigger.analyzeTriggers()
    │   │   ├── Check OpenAPI trigger
    │   │   ├── Check README trigger
    │   │   └── Check JSDoc trigger
    │   │
    │   └── DocTrigger.executeActions()
    │       ├── Call MCP tools
    │       ├── Handle errors gracefully
    │       └── Clear changed files set
    │
    └── Return ALLOW with reason
```

### Error Handling Strategy

**Principle:** Fail gracefully, never block development

| Error Type | Handling | User Impact |
|------------|----------|-------------|
| Config file not found | Use defaults | None |
| Config validation error | Log error, use defaults | None |
| AST parse error | Return `ask` decision | User prompted |
| Analyzer error | Log error, continue | None |
| MCP connection error | Log warning, disable MCP | No doc updates |
| Test execution timeout | Log error, mark as failed | Test failures treated as issues |
| Test framework not found | Skip tests, log warning | None |

---

## MCP Integration

### Model Context Protocol Architecture

The Quality Gate integrates with the Docs Editor MCP server for automatic documentation generation.

```
┌─────────────────────────────────────────────────────────────┐
│                    Quality Gate                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  DocTrigger                           │  │
│  │  - Analyze changed files                            │  │
│  │  - Match trigger patterns                           │  │
│  │  - Build tool parameters                            │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │                                       │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  MCPClient                           │  │
│  │  - Connect to MCP server (stdio)                    │  │
│  │  - Call tools                                       │  │
│  │  - Handle responses                                 │  │
│  └──────────────────┬───────────────────────────────────┘  │
└─────────────────────┼───────────────────────────────────────┘
                      │
                      │ stdio
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Docs Editor MCP Server                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              sync_openapi_spec                       │  │
│  │  - Scan API routes                                  │  │
│  │  - Generate OpenAPI spec                            │  │
│  │  - Merge with existing spec                         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          update_readme_architecture                  │  │
│  │  - Scan project structure                           │  │
│  │  - Update README sections                           │  │
│  │  - Preserve manual edits                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           generate_jsdoc_on_fly                      │  │
│  │  - Analyze function signatures                      │  │
│  │  - Generate JSDoc comments                          │  │
│  │  - Insert into source files                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### MCP Tools

#### 1. sync_openapi_spec

**Purpose:** Automatically update OpenAPI/Swagger specifications

**When Triggered:**
- Files matching `mcp.triggers.openAPI.filePatterns` are modified
- Typically: `**/routes/**/*.ts`, `**/api/**/*.ts`

**Parameters:**
```typescript
{
  projectPath: string;           // Project root directory
  configPath?: string;           // Path to scribe config
  outputFormat?: 'json' | 'yaml'; // Output format
  outputPath?: string;           // Output file path
  generateDiff?: boolean;        // Generate diff preview
  force?: boolean;               // Force update
  frameworks?: string[];         // Frameworks to scan
  title?: string;                // API title
  version?: string;              // API version
}
```

**Supported Frameworks:**
- **Express.js**: `app.get()`, `app.post()`, `router.put()`, etc.
- **Next.js**: App Router (`app/api/*.ts`), Pages API (`pages/api/*.ts`)
- **Fastify**: (planned)
- **Koa**: (planned)

**Route Detection:**

**Express Example:**
```typescript
// routes/users.ts
import express from 'express';
const router = express.Router();

router.get('/users', async (req, res) => {
  // GET /users
});

router.post('/users', async (req, res) => {
  // POST /users
});

export default router;
```

**Generated OpenAPI:**
```json
{
  "openapi": "3.0.0",
  "paths": {
    "/users": {
      "get": {
        "summary": "Get users",
        "responses": { "200": { "description": "Success" } }
      },
      "post": {
        "summary": "Create user",
        "responses": { "201": { "description": "Created" } }
      }
    }
  }
}
```

#### 2. update_readme_architecture

**Purpose:** Keep README sections synchronized with code

**When Triggered:**
- Files matching `mcp.triggers.readme.filePatterns` are modified
- Typically: `**/src/**/*.ts`, `package.json`

**Parameters:**
```typescript
{
  projectPath: string;                    // Project root
  readmePath?: string;                    // README path (default: README.md)
  sectionsToUpdate?: string[];            // Sections to update
  generateDiff?: boolean;                 // Generate diff preview
  preserveMarkers?: boolean;              // Preserve manual edit markers
}
```

**Sections Updated:**
1. **Installation**: Dependency installation commands
2. **Architecture**: Framework detection and stack description
3. **Project Structure**: Directory tree visualization

**Manual Edit Protection:**
```markdown
<!-- SMITE:MANUAL:START -->
## Custom Section
This content is never overwritten by auto-generation.
<!-- SMITE:MANUAL:END -->
```

#### 3. generate_jsdoc_on_fly

**Purpose:** Automatically generate JSDoc comments for TypeScript/JavaScript code

**When Triggered:**
- Files matching `mcp.triggers.jsdoc.filePatterns` are successfully validated
- No critical security issues detected

**Parameters:**
```typescript
{
  files: string[];           // Files to process
  format?: 'jsdoc' | 'tSDoc'; // Documentation format
  includeExamples?: boolean;  // Generate usage examples
}
```

**Generated JSDoc:**
```typescript
/**
 * Calculate the sum of two numbers
 *
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 *
 * @example
 * ```ts
 * add(1, 2) // returns 3
 * ```
 */
function add(a: number, b: number): number {
  return a + b;
}
```

---

## Data Flow

### Input Data (Hook Input)

```typescript
interface JudgeHookInput {
  session_id: string;              // Unique session identifier
  transcript_path: string;         // Path to conversation transcript
  cwd: string;                     // Current working directory
  hook_event_name: 'PreToolUse';
  tool_name: 'Write' | 'Edit' | 'MultiEdit';
  tool_input: WriteInput | EditInput;
}

interface WriteInput {
  file_path: string;              // Absolute path to file
  content: string;                // New file content
}

interface EditInput {
  file_path: string;              // Absolute path to file
  old_string: string;             // String to replace
  new_string: string;             // Replacement string
}
```

### Internal Data Structures

```typescript
// Analysis Context
interface ASTAnalysisContext {
  sourceFile: ts.SourceFile;       // Parsed AST
  config: JudgeConfig;             // File-specific configuration
  issues: ValidationIssue[];       // Accumulated issues
  metrics: ValidationMetrics;      // Calculated metrics
}

// Validation Issue
interface ValidationIssue {
  type: 'complexity' | 'semantic' | 'security' | 'test';
  severity: 'critical' | 'error' | 'warning';
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

// Validation Metrics
interface ValidationMetrics {
  complexity: {
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    nestingDepth: number;
    functionLength: number;
    parameterCount: number;
    totalFunctions: number;
    highComplexityFunctions: number;
  };
  security: {
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
  };
  semantics: {
    apiContractViolations: number;
    typeInconsistencies: number;
    namingViolations: number;
    duplicateCodeInstances: number;
  };
  tests?: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    failures: TestFailure[];
  };
}
```

### Output Data (Hook Output)

```typescript
interface JudgeHookOutput {
  hookSpecificOutput: {
    hookEventName: 'PreToolUse';
    permissionDecision: 'allow' | 'deny' | 'ask';
    permissionDecisionReason: string;
  };
}
```

### Persistent Data

**Feedback State:**
```typescript
// Location: .smite/judge-feedback-state.json
interface RetryState {
  sessionId: string;
  retryCount: number;
  maxRetries: number;
  lastFailureTimestamp: number;
  issuesDetected: ValidationIssue[];
  previousAttempts: CodeChangeAttempt[];
}
```

**Audit Log:**
```typescript
// Location: .smite/judge-audit.log
interface AuditLogEntry {
  timestamp: string;
  sessionId: string;
  file: string;
  decision: 'allow' | 'deny' | 'ask';
  issuesCount: number;
  issues: ValidationIssue[];
  metrics: ValidationMetrics;
  analysisTimeMs: number;
}
```

---

## Extension Points

### Adding a New Analyzer

**Step 1: Create Analyzer Class**

```typescript
// src/analyzers/performance.ts
export class PerformanceAnalyzer {
  constructor(
    private parser: TypeScriptParser,
    private logger: JudgeLogger,
    private config: PerformanceConfig
  ) {}

  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    // Traverse AST
    // Detect performance anti-patterns
    // Add issues to context.issues
    // Update context.metrics.performance
  }
}
```

**Step 2: Add Configuration**

```typescript
// src/types.ts
export interface JudgeConfig {
  // ... existing config
  performance?: {
    enabled: boolean;
    rules: PerformanceRuleConfig[];
  };
}
```

**Step 3: Register in Judge**

```typescript
// src/judge.ts
async validate(input: JudgeHookInput): Promise<JudgeHookOutput> {
  // ... existing code

  // Run performance analysis
  if (config.performance?.enabled) {
    const performanceAnalyzer = new PerformanceAnalyzer(
      this.parser,
      this.logger,
      config.performance
    );
    performanceAnalyzer.analyze(sourceFile, context);
  }

  // ... rest of validation
}
```

**Step 4: Update Decision Logic**

```typescript
private makeDecision(context: ASTAnalysisContext): Decision {
  // ... existing checks

  // Check performance issues
  if (context.metrics.performance.criticalIssues > 0) {
    return 'deny';
  }

  return 'allow';
}
```

### Adding a New Security Rule

```typescript
// src/types.ts
export const SECURITY_RULES: SecurityRule[] = [
  // ... existing rules
  {
    id: 'path-traversal',
    name: 'Path Traversal Vulnerability',
    category: 'injection',
    severity: 'critical',
    pattern: /fs\.readFile\s*\(\s*.*\+\s*/,
    message: 'Potential path traversal vulnerability',
    fix: 'Validate and sanitize file paths',
    cwe: 'CWE-22',
    owasp: 'A01:2021 – Broken Access Control'
  }
];
```

### Adding a New MCP Tool

```typescript
// In docs-editor-mcp/src/scribe-server.ts
this.server.tool(
  "sync_postman_collection",
  "Generate Postman collection from API routes",
  {
    projectPath: z.string(),
    outputPath: z.string().optional()
  },
  async (args) => {
    // Implement tool logic
    return { content: [{ type: "text", text: "..." }] };
  }
);
```

---

## Design Decisions

### 1. Hook-Based Architecture

**Decision:** Use PreToolUse hook instead of post-validation

**Rationale:**
- Prevent bad code from being written
- Avoid need for rollback mechanisms
- Provide immediate feedback
- Reduce technical debt

**Trade-offs:**
- Slower feedback loop (validation before write)
- False positives block development
- Requires robust error handling

### 2. TypeScript Compiler API

**Decision:** Use TypeScript Compiler API for parsing

**Rationale:**
- Single dependency (TypeScript is already required)
- Rich AST information
- Type information available
- Well-documented API

**Alternatives Considered:**
- **Babel**: More complex setup, larger bundle
- **Esprima**: JavaScript only, no type info
- **Regex only**: Too fragile, high false positives

### 3. Multi-Stage Validation Pipeline

**Decision:** Separate analyzers for complexity, security, semantics

**Rationale:**
- Single Responsibility Principle
- Easy to extend with new analyzers
- Clear separation of concerns
- Testable in isolation

**Trade-offs:**
- Multiple AST traversals (performance)
- More complex architecture

### 4. Non-Blocking MCP Integration

**Decision:** MCP errors don't fail validation

**Rationale:**
- Documentation is important but not critical
- MCP server might be unavailable
- Don't block development for doc sync issues
- Graceful degradation

### 5. Retry with Progressive Feedback

**Decision**: Track retry state and provide context-aware prompts

**Rationale:**
- Help Claude learn from mistakes
- Prevent infinite retry loops
- Provide specific guidance
- Improve code quality over attempts

**Implementation:**
- Max retries limit (default: 3)
- Progressive feedback (more detail on retries)
- State persistence across attempts

### 6. Per-File Configuration Overrides

**Decision:** Support overrides in configuration file

**Rationale:**
- Different standards for different code
- Legacy code vs. new code
- Test files vs. production code
- Core libraries vs. utilities

**Example:**
```json
{
  "overrides": [
    {
      "files": "**/core/**/*.ts",
      "complexity": { "maxCyclomaticComplexity": 5 }
    },
    {
      "files": "**/*.test.ts",
      "complexity": { "maxCyclomaticComplexity": 15 },
      "semantics": { "enabled": false }
    }
  ]
}
```

---

## Performance Considerations

### AST Traversal Optimization

**Problem:** Multiple analyzers traverse the same AST

**Solution 1: Single-Pass Analysis (Future)**
```typescript
class MultiPassAnalyzer {
  analyze(sourceFile: ts.SourceFile, context: ASTAnalysisContext): void {
    // Single traversal, delegate to sub-analyzers
    function visit(node: ts.Node) {
      this.complexityAnalyzer.visitNode(node, context);
      this.securityAnalyzer.visitNode(node, context);
      this.semanticAnalyzer.visitNode(node, context);
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }
}
```

**Solution 2: Caching**
```typescript
class CachedParser {
  private cache = new Map<string, ts.SourceFile>();

  parseCode(filePath: string, content: string): ts.SourceFile {
    const hash = this.hashContent(content);
    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }

    const ast = ts.createSourceFile(filePath, content, ...);
    this.cache.set(hash, ast);
    return ast;
  }
}
```

### Test Execution Performance

**Problem:** Running tests on every validation is slow

**Solutions:**
1. **Smart test selection**: Only run tests related to changed files
2. **Parallel test execution**: Run multiple test suites simultaneously
3. **Test caching**: Reuse previous results if code unchanged
4. **Threshold-based**: Only run tests after certain validation passes

### MCP Connection Reuse

**Problem:** Starting MCP server on every validation is expensive

**Solution:** Lazy initialization with connection pooling
```typescript
class Judge {
  private mcpClient: MCPClient | null = null;

  private async initializeMCPIntegrationIfNeeded(): Promise<void> {
    // Only initialize once
    if (this.mcpClient !== null) {
      return;
    }

    this.mcpClient = new MCPClient(config);
    await this.mcpClient.connect();
  }
}
```

### Configuration Caching

**Problem:** Reading and parsing config on every validation

**Solution:** Cache config with file watcher
```typescript
class ConfigManager {
  private configCache: JudgeConfig | null = null;
  private configModTime: number = 0;

  getConfig(): JudgeConfig {
    const currentModTime = fs.statSync(this.configPath).mtimeMs;

    if (currentModTime > this.configModTime) {
      this.reloadConfig();
      this.configModTime = currentModTime;
    }

    return this.configCache!;
  }
}
```

---

## Security Considerations

### 1. Code Injection via Regex

**Risk:** Malicious code could exploit regex patterns in security rules

**Mitigation:**
- Use AST-based parsing where possible
- Validate and sanitize all regex patterns
- Escape user-provided patterns
- Use regex timeouts (re2 engine)

### 2. Arbitrary Code Execution in Tests

**Risk:** Test execution could run malicious code

**Mitigation:**
- Run tests in sandboxed environment
- Limit test execution timeout
- Validate test command before execution
- Run as non-privileged user

### 3. MCP Server Trust

**Risk:** Malicious MCP server could execute arbitrary commands

**Mitigation:**
- Validate MCP server path (only local paths allowed)
- Use stdio transport (no network exposure)
- Limit MCP server capabilities
- Audit MCP server code

---

## Future Enhancements

### Planned Features

1. **AI-Powered Analysis**
   - Use LLM to detect code smells
   - Generate more sophisticated suggestions
   - Learn from project-specific patterns

2. **Incremental Analysis**
   - Only analyze changed functions
   - Reuse previous analysis results
   - Differential complexity calculation

3. **Multi-Language Support**
   - Python (pytest, complexity)
   - Go (golint, cyclop)
   - Rust (clippy, cargo-tarpaulin)

4. **IDE Integration**
   - VS Code extension for real-time feedback
   - JetBrains plugin support
   - Vim/Neovim plugin

5. **Dashboard**
   - Web-based quality metrics dashboard
   - Historical trend analysis
   - Team-wide quality reports

### API Design Considerations

**Future-Proofing:**
- Use interfaces for all major components
- Support plugin system for analyzers
- Version MCP protocol
- Extensible configuration schema

---

## References

### External Resources
- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- [Cognitive Complexity](https://www.sonarsource.com/resources/cognitive-complexity.html)
- [OWASP Top 10](https://owasp.org/Top10/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [OpenAPI Specification](https://swagger.io/specification/)

### Internal Documentation
- [README.md](README.md) - User guide and quick start
- [CONFIG_REFERENCE.md](CONFIG_REFERENCE.md) - Configuration reference
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Troubleshooting guide
- [INTEGRATION.md](INTEGRATION.md) - Integration guide
- [examples/](examples/) - Usage examples

---

**Last Updated:** 2025-01-19
