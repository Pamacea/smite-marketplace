# Internal Docs Editor MCP Architecture
## Smite Quality Gate & Documentation System

**Version**: 1.0.0
**Author**: Architect Agent
**Date**: 2025-01-19
**Status**: Design Phase

---

## 1. Executive Summary

The **Internal Docs Editor MCP** (codename: "Scribe") is a Model Context Protocol server that automatically maintains project documentation by analyzing code changes and synchronizing documentation artifacts. It operates as part of the Smite Quality Gate system, triggering documentation updates after code validation passes.

### Key Features
- **OpenAPI/Swagger sync** - Scans route definitions and updates API specs
- **README architecture updates** - Monitors project structure and maintains docs
- **JSDoc generation** - Analyzes code logic and generates documentation comments
- **File watching strategy** - Detects structural changes in real-time
- **Diff generation** - Provides reviewable documentation updates
- **Non-blocking operation** - Documentation failures never block code completion

### Design Philosophy
- **Incremental updates** - Only update changed documentation sections
- **Preserve manual edits** - Detect and retain manually written content
- **Framework-agnostic** - Support multiple frameworks (Express, FastAPI, Next.js)
- **Extensible tools** - Easy to add new documentation generators

---

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Claude Code Executor                             │
│                    (Code Production Context)                         │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              │ File Write (Code Change)
                              ▼
                    ┌─────────────────────┐
                    │  PreToolUse Hook    │
                    │  (Quality Gate)     │
                    └─────────┬───────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
         [VALIDATION PASSES]          [VALIDATION FAILS]
                │                           │
                │                           └─> Retry with Feedback
                │
                ▼
        ┌───────────────────────┐
        │  PostToolUse Hook     │
        │  (Trigger Scribe)     │
        └───────────┬───────────┘
                    │
                    │ "Documentation Update Required"
                    ▼
        ┌───────────────────────────────────┐
        │  Scribe MCP Server                │
        │  (Internal Docs Editor)           │
        └───────────┬───────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌────────┐     ┌─────────┐    ┌──────────┐
│Tool 1: │     │Tool 2:  │    │Tool 3:   │
│OpenAPI │     │README   │    │JSDoc     │
│Sync    │     │Updater  │    │Generator │
└───┬────┘     └────┬────┘    └────┬─────┘
    │               │              │
    ▼               ▼              ▼
┌────────┐     ┌─────────┐    ┌──────────┐
│Route   │     │Project  │    │Function  │
│Scanner │     │Scanner  │    │Analyzer  │
└───┬────┘     └────┬────┘    └────┬─────┘
    │               │              │
    ▼               ▼              ▼
┌────────┐     ┌─────────┐    ┌──────────┐
│Schema  │     │Markdown │    │AST       │
│Parser  │     │Parser   │    │Parser    │
└───┬────┘     └────┬────┘    └────┬─────┘
    │               │              │
    ▼               ▼              ▼
┌────────┐     ┌─────────┐    ┌──────────┐
│Diff    │     │Diff     │    │JSDoc     │
│Gen     │     │Gen      │    │Builder   │
└───┬────┘     └────┬────┘    └────┬─────┘
    │               │              │
    └───────────────┴──────────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │  Documentation      │
          │  Update Application │
          └─────────┬───────────┘
                    │
                    ▼
          [COMPLETION CONTINUES]
```

---

## 3. MCP Server Definition

### 3.1 Server Overview

**Package**: `@smite/scribe-mcp`
**Transport**: stdio (for Claude Code integration)
**Runtime**: Node.js 18+
**Protocol**: MCP Specification (2025-06-18)

### 3.2 Server Structure

```typescript
// Server implementation
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

class ScribeMCPServer {
  private server: Server;
  private fileWatcher: FileWatcher;
  private config: ScribeConfig;

  constructor(config: ScribeConfig) {
    this.server = new Server(
      {
        name: "smite-scribe",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => ({
        tools: [
          this.getOpenAPISyncTool(),
          this.getReadmeUpdaterTool(),
          this.getJSDocGeneratorTool(),
        ],
      })
    );

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "sync_openapi_spec":
            return this.handleOpenAPISync(args);
          case "update_readme_architecture":
            return this.handleReadmeUpdate(args);
          case "generate_jsdoc_on_fly":
            return this.handleJSDocGeneration(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      }
    );
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
```

### 3.3 Configuration Schema

```typescript
// .smite/scribe-config.json
interface ScribeConfig {
  // Global enable/disable
  enabled: boolean;

  // Tool-specific configuration
  tools: {
    openapi: {
      enabled: boolean;
      outputPath: string; // "openapi.json" | "swagger.yaml"
      frameworks: ("express" | "fastapi" | "nextjs" | "nestjs")[];
      routePatterns: string[]; // Glob patterns for route files
      scanPaths: string[]; // Directories to scan
    };
    readme: {
      enabled: boolean;
      readmePath: string; // Default: "README.md"
      autoSections: ("installation" | "architecture" | "structure")[];
      protectedSections: string[]; // Sections never to auto-edit
    };
    jsdoc: {
      enabled: boolean;
      includePatterns: string[]; // Glob patterns for source files
      excludePatterns: string[]; // Files to exclude
      overwriteStrategy: "merge" | "replace" | "append";
    };
  };

  // File watching
  watch: {
    enabled: boolean;
    debounceMs: number; // Default: 500
    ignorePatterns: string[]; // node_modules, dist, etc.
  };

  // Diff generation
  diff: {
    format: "unified" | "json";
    maxLines: number; // For preview
  };
}
```

---

## 4. Tool Specifications

### 4.1 Tool 1: sync_openapi_spec

**Purpose**: Automatically synchronize OpenAPI/Swagger specifications with route definitions in the codebase.

#### Input Schema

```typescript
{
  name: "sync_openapi_spec",
  title: "OpenAPI Specification Synchronizer",
  description: "Scans route definitions and updates OpenAPI/Swagger spec files. Detects new endpoints, signature changes, and deprecations.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description: "Root directory of the project to scan"
      },
      configPath: {
        type: "string",
        description: "Path to scribe config file (default: .smite/scribe-config.json)"
      },
      outputFormat: {
        type: "string",
        enum: ["json", "yaml"],
        description: "Output format for OpenAPI spec"
      },
      outputPath: {
        type: "string",
        description: "Output file path (overrides config)"
      },
      generateDiff: {
        type: "boolean",
        description: "Generate diff preview before applying changes"
      },
      force: {
        type: "boolean",
        description: "Force update even if no changes detected"
      }
    },
    required: ["projectPath"]
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      endpointsFound: { type: "number" },
      endpointsAdded: { type: "number" },
      endpointsUpdated: { type: "number" },
      endpointsRemoved: { type: "number" },
      diff: {
        type: "string",
        description: "Unified diff if generateDiff=true"
      },
      outputPath: { type: "string" },
      warnings: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["success", "endpointsFound"]
  }
}
```

#### Implementation Strategy

```typescript
class OpenAPISyncTool {
  private routeScanners: Map<string, RouteScanner>;

  constructor() {
    this.routeScanners = new Map([
      ["express", new ExpressRouteScanner()],
      ["fastapi", new FastAPIRouteScanner()],
      ["nextjs", new NextJSRouteScanner()],
      ["nestjs", new NestJSRouteScanner()],
    ]);
  }

  async execute(args: SyncOpenAPIArgs): Promise<ToolResult> {
    // 1. Load existing OpenAPI spec
    const existingSpec = await this.loadExistingSpec(args.outputPath);

    // 2. Scan project for route definitions
    const discoveredEndpoints = await this.scanProject(args.projectPath);

    // 3. Merge with existing spec (preserve manual annotations)
    const mergedSpec = this.mergeSpecs(existingSpec, discoveredEndpoints);

    // 4. Generate diff if requested
    const diff = args.generateDiff
      ? this.generateDiff(existingSpec, mergedSpec)
      : null;

    // 5. Write updated spec
    await this.writeSpec(mergedSpec, args.outputPath, args.outputFormat);

    return {
      success: true,
      endpointsFound: discoveredEndpoints.length,
      endpointsAdded: this.calculateAdded(existingSpec, mergedSpec),
      endpointsUpdated: this.calculateUpdated(existingSpec, mergedSpec),
      endpointsRemoved: this.calculateRemoved(existingSpec, mergedSpec),
      diff,
      outputPath: args.outputPath,
    };
  }

  private async scanProject(projectPath: string): Promise<Endpoint[]> {
    const endpoints: Endpoint[] = [];

    for (const [framework, scanner] of this.routeScanners) {
      if (this.config.tools.openapi.frameworks.includes(framework)) {
        const found = await scanner.scan(projectPath);
        endpoints.push(...found);
      }
    }

    return endpoints;
  }

  private mergeSpecs(
    existing: OpenAPISpec,
    discovered: Endpoint[]
  ): OpenAPISpec {
    // Preserve manual extensions, descriptions, examples
    // Update paths, methods, parameters, schemas
    // Mark deprecated endpoints
  }
}
```

#### Framework-Specific Scanners

**Express Router Scanner**:
```typescript
class ExpressRouteScanner implements RouteScanner {
  async scan(projectPath: string): Promise<Endpoint[]> {
    const files = await glob("**/*.ts", { cwd: projectPath });

    const endpoints: Endpoint[] = [];
    for (const file of files) {
      const ast = this.parseFile(file);
      const routes = this.extractRoutes(ast);
      endpoints.push(...routes);
    }

    return endpoints;
  }

  private extractRoutes(ast: AST): Endpoint[] {
    // Pattern: router.get('/path', handler)
    // Pattern: app.post('/path', middleware, handler)
    // Extract: path, method, parameters, response type
  }
}
```

**FastAPI Scanner** (Python projects):
```typescript
class FastAPIRouteScanner implements RouteScanner {
  async scan(projectPath: string): Promise<Endpoint[]> {
    const files = await glob("**/*.py", { cwd: projectPath });

    const endpoints: Endpoint[] = [];
    for (const file of files) {
      const ast = this.parsePython(file);
      const routes = this.extractFastAPIRoutes(ast);
      endpoints.push(...routes);
    }

    return endpoints;
  }

  private extractFastAPIRoutes(ast: PythonAST): Endpoint[] {
    // Pattern: @app.get("/path")
    // Pattern: @router.post("/path")
    // Extract: path, method, Pydantic models for request/response
  }
}
```

**Next.js App Router Scanner**:
```typescript
class NextJSRouteScanner implements RouteScanner {
  async scan(projectPath: string): Promise<Endpoint[]> {
    const appDir = path.join(projectPath, "app");
    const routeFiles = await glob("**/route.ts", { cwd: appDir });

    const endpoints: Endpoint[] = [];
    for (const file of routeFiles) {
      const httpMethods = this.extractExportedHandlers(file);
      const routePath = this.convertFilePathToRoute(file);

      for (const method of httpMethods) {
        endpoints.push({
          path: routePath,
          method,
          parameters: this.extractParams(file, method),
          responses: this.extractResponseType(file, method),
        });
      }
    }

    return endpoints;
  }
}
```

---

### 4.2 Tool 2: update_readme_architecture

**Purpose**: Automatically update README.md sections based on project structure changes, dependency updates, and new modules.

#### Input Schema

```typescript
{
  name: "update_readme_architecture",
  title: "README Architecture Updater",
  description: "Monitors project structure and updates README.md sections (Installation, Architecture, Project Structure) while preserving manual edits.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description: "Root directory of the project"
      },
      readmePath: {
        type: "string",
        description: "Path to README.md (default: README.md)"
      },
      sectionsToUpdate: {
        type: "array",
        items: {
          type: "string",
          enum: ["installation", "architecture", "structure", "all"]
        },
        description: "Which sections to update"
      },
      generateDiff: {
        type: "boolean",
        description: "Generate diff preview before applying"
      },
      preserveMarkers: {
        type: "boolean",
        description: "Preserve manual edit markers (default: true)"
      }
    },
    required: ["projectPath"]
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      sectionsUpdated: {
        type: "array",
        items: { type: "string" }
      },
      dependenciesAdded: { type: "number" },
      modulesAdded: { type: "number" },
      diff: {
        type: "string",
        description: "Unified diff of changes"
      },
      readmePath: { type: "string" }
    },
    required: ["success"]
  }
}
```

#### Implementation Strategy

```typescript
class ReadmeUpdaterTool {
  async execute(args: UpdateReadmeArgs): Promise<ToolResult> {
    // 1. Parse existing README.md
    const readme = await this.loadReadme(args.readmePath);
    const sections = this.parseSections(readme);

    // 2. Analyze project structure
    const projectInfo = await this.analyzeProject(args.projectPath);

    // 3. Generate updates for each section
    const updates = await this.generateUpdates(sections, projectInfo, args);

    // 4. Merge updates with existing content
    const updatedReadme = this.mergeUpdates(readme, updates);

    // 5. Generate diff if requested
    const diff = args.generateDiff
      ? this.generateDiff(readme, updatedReadme)
      : null;

    // 6. Write updated README
    await this.writeReadme(args.readmePath, updatedReadme);

    return {
      success: true,
      sectionsUpdated: Object.keys(updates),
      dependenciesAdded: projectInfo.newDependencies.length,
      modulesAdded: projectInfo.newModules.length,
      diff,
      readmePath: args.readmePath,
    };
  }

  private async analyzeProject(projectPath: string): Promise<ProjectInfo> {
    // Read package.json for dependencies
    const pkg = await this.loadPackageJson(projectPath);

    // Scan src/ for directory structure
    const structure = await this.scanDirectoryStructure(projectPath);

    // Detect framework/runtime
    const framework = this.detectFramework(projectPath);

    return {
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      structure,
      framework,
    };
  }

  private async generateUpdates(
    sections: ReadmeSections,
    info: ProjectInfo,
    args: UpdateReadmeArgs
  ): Promise<SectionUpdates> {
    const updates: SectionUpdates = {};

    // Installation section
    if (args.sectionsToUpdate.includes("installation")) {
      updates.installation = this.generateInstallationSection(info);
    }

    // Architecture section
    if (args.sectionsToUpdate.includes("architecture")) {
      updates.architecture = this.generateArchitectureSection(info);
    }

    // Project Structure section
    if (args.sectionsToUpdate.includes("structure")) {
      updates.structure = this.generateStructureSection(info);
    }

    return updates;
  }

  private generateInstallationSection(info: ProjectInfo): string {
    const deps = Object.entries(info.dependencies).sort();

    let markdown = "## Installation\n\n";

    // Add framework-specific setup
    switch (info.framework) {
      case "nextjs":
        markdown += "```bash\nnpx create-next-app@latest my-app\n```\n\n";
        break;
      case "express":
        markdown += "```bash\nnpm install express\n```\n\n";
        break;
      // ... other frameworks
    }

    // Add dependencies list
    markdown += "### Dependencies\n\n";
    markdown += "| Package | Version |\n";
    markdown += "|---------|----------|\n";
    for (const [name, version] of deps) {
      markdown += `| ${name} | ${version} |\n`;
    }

    return markdown;
  }

  private generateStructureSection(info: ProjectInfo): string {
    let markdown = "## Project Structure\n\n";
    markdown += "```\n";
    markdown += this.generateTree(info.structure, 0);
    markdown += "\n```\n\n";

    // Add module descriptions if available
    markdown += "### Modules\n\n";
    for (const module of info.structure.modules) {
      markdown += `- **${module.name}**: ${module.description || "TODO"}\n`;
    }

    return markdown;
  }
}
```

#### Section Preservation Strategy

```typescript
class ReadmeParser {
  parseSections(readme: string): ReadmeSections {
    // Detect manual edit markers:
    // <!-- SMITE:MANUAL:START -->...<!-- SMITE:MANUAL:END -->
    // These sections are never overwritten

    const sections: ReadmeSections = {
      installation: { content: "", isProtected: false },
      architecture: { content: "", isProtected: false },
      structure: { content: "", isProtected: false },
      custom: [], // User-defined sections
    };

    // Parse markdown into sections
    const lines = readme.split("\n");
    let currentSection: string | null = null;
    let isProtected = false;

    for (const line of lines) {
      if (line.match(/^#{2,}\s/)) {
        // New section
        const sectionName = this.extractSectionName(line);
        currentSection = this.mapToKnownSection(sectionName);
        isProtected = false;
      }

      if (line.includes("SMITE:MANUAL")) {
        isProtected = true;
      }

      if (currentSection && sections[currentSection]) {
        sections[currentSection].content += line + "\n";
        sections[currentSection].isProtected = isProtected;
      }
    }

    return sections;
  }
}
```

---

### 4.3 Tool 3: generate_jsdoc_on_fly

**Purpose**: Analyze function logic and generate or update JSDoc comments with inferred types, parameters, return values, and descriptions.

#### Input Schema

```typescript
{
  name: "generate_jsdoc_on_fly",
  title: "JSDoc Generator",
  description: "Analyzes function bodies to generate JSDoc comments with @param, @returns, @throws tags. Infers types from annotations and usage patterns.",
  inputSchema: {
    type: "object",
    properties: {
      projectPath: {
        type: "string",
        description: "Root directory of the project"
      },
      filePaths: {
        type: "array",
        items: { type: "string" },
        description: "Specific files to process (default: all matched files)"
      },
      strategy: {
        type: "string",
        enum: ["merge", "replace", "append"],
        description: "How to handle existing JSDoc comments"
      },
      includeInferred: {
        type: "boolean",
        description: "Include inferred type information (default: true)"
      },
      dryRun: {
        type: "boolean",
        description: "Generate output without writing files"
      }
    },
    required: ["projectPath"]
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      filesProcessed: { type: "number" },
      functionsDocumented: { type: "number" },
      existingJSDocUpdated: { type: "number" },
      newJSDocGenerated: { type: "number" },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            file: { type: "string" },
            function: { type: "string" },
            error: { type: "string" }
          }
        }
      },
      preview: {
        type: "array",
        items: {
          type: "object",
          properties: {
            file: { type: "string" },
            function: { type: "string" },
            jsdoc: { type: "string" }
          }
        }
      }
    },
    required: ["success", "filesProcessed"]
  }
}
```

#### Implementation Strategy

```typescript
class JSDocGeneratorTool {
  private typeInferrer: TypeInferrer;
  private astParser: ASTParser;

  async execute(args: GenerateJSDocArgs): Promise<ToolResult> {
    const files = await this.resolveFiles(args);

    const results: ProcessResult[] = [];
    const errors: ErrorResult[] = [];

    for (const file of files) {
      try {
        const result = await this.processFile(file, args);
        results.push(result);
      } catch (error) {
        errors.push({
          file,
          error: error.message,
        });
      }
    }

    // Aggregate statistics
    const stats = this.aggregateStats(results);

    return {
      success: true,
      filesProcessed: results.length,
      functionsDocumented: stats.totalFunctions,
      existingJSDocUpdated: stats.updatedJSDoc,
      newJSDocGenerated: stats.newJSDoc,
      errors,
      preview: args.dryRun ? this.generatePreview(results) : undefined,
    };
  }

  private async processFile(
    file: string,
    args: GenerateJSDocArgs
  ): Promise<ProcessResult> {
    // 1. Parse file to AST
    const ast = await this.astParser.parse(file);

    // 2. Extract function declarations
    const functions = this.extractFunctions(ast);

    // 3. Generate JSDoc for each function
    const updates: FunctionUpdate[] = [];
    for (const func of functions) {
      const jsdoc = await this.generateJSDoc(func, args);

      if (jsdoc) {
        updates.push({
          function: func.name,
          line: func.line,
          existingJSDoc: func.existingJSDoc,
          newJSDoc: jsdoc,
        });
      }
    }

    // 4. Apply updates to file (unless dry run)
    if (!args.dryRun && updates.length > 0) {
      await this.applyUpdates(file, updates, args.strategy);
    }

    return {
      file,
      updates,
    };
  }

  private async generateJSDoc(
    func: FunctionInfo,
    args: GenerateJSDocArgs
  ): Promise<string | null> {
    const lines: string[] = [];

    // Description
    const description = await this.inferDescription(func);
    if (description) {
      lines.push(description);
      lines.push("");
    }

    // @param tags
    for (const param of func.parameters) {
      const inferredType = args.includeInferred
        ? await this.typeInferrer.inferType(param)
        : null;

      const paramDesc = await this.inferParamDescription(param, func);

      if (inferredType) {
        lines.push(`@param {${inferredType}} ${param.name} ${paramDesc}`);
      } else {
        lines.push(`@param {any} ${param.name} ${paramDesc}`);
      }
    }

    // @returns tag
    if (func.returns.type !== "void") {
      const returnType = args.includeInferred
        ? await this.typeInferrer.inferReturnType(func)
        : null;

      const returnDesc = await this.inferReturnDescription(func);

      if (returnType) {
        lines.push(`@returns {${returnType}} ${returnDesc}`);
      } else {
        lines.push(`@returns {any} ${returnDesc}`);
      }
    }

    // @throws tags (inferred from error handling)
    const thrownErrors = await this.inferThrownErrors(func);
    for (const error of thrownErrors) {
      lines.push(`@throws {${error.type}} ${error.description}`);
    }

    // @example tag (if function has example usage)
    const example = await this.generateExample(func);
    if (example) {
      lines.push("");
      lines.push("@example");
      lines.push("```ts");
      lines.push(example);
      lines.push("```");
    }

    if (lines.length === 0) {
      return null;
    }

    return "/**\n * " + lines.join("\n * ") + "\n */";
  }

  private async inferDescription(func: FunctionInfo): Promise<string> {
    // Analyze function body to infer purpose
    // - If it throws, describe validation
    // - If it queries, describe data fetching
    // - If it transforms, describe mapping logic
    // Use LLM for complex cases
  }

  private async inferParamDescription(
    param: Parameter,
    func: FunctionInfo
  ): Promise<string> {
    // Check parameter usage in function body
    // - If validated: "must be a valid..."
    // - If transformed: "will be..."
    // - If passed through: "to be forwarded to..."
  }

  private async inferThrownErrors(func: FunctionInfo): Promise<Error[]> {
    // Scan for throw statements
    // - throw new Error("...") -> Error
    // - throw new ValidationError("...") -> ValidationError
    // - reject(...) -> Promise rejection
  }
}
```

#### Type Inference Engine

```typescript
class TypeInferrer {
  async inferType(param: Parameter): Promise<string> {
    // 1. Check explicit TypeScript annotation
    if (param.typeAnnotation) {
      return this.stringifyType(param.typeAnnotation);
    }

    // 2. Infer from default value
    if (param.defaultValue) {
      return this.inferFromValue(param.defaultValue);
    }

    // 3. Infer from usage in function body
    const usage = this.analyzeUsage(param, param.functionBody);
    return this.inferFromUsage(usage);
  }

  private inferFromUsage(usage: UsagePattern): string {
    // Array methods used -> Array<T>
    // Object property access -> object
    // Function call -> return type of called function
    // Template literals -> string
    // Arithmetic operations -> number
  }

  async inferReturnType(func: FunctionInfo): Promise<string> {
    // 1. Check explicit return type annotation
    if (func.returnType) {
      return this.stringifyType(func.returnType);
    }

    // 2. Analyze return statements
    const returnTypes = new Set<string>();
    for (const stmt of func.returnStatements) {
      const type = await this.inferExpressionType(stmt.value);
      returnTypes.add(type);
    }

    // 3. Union type if multiple return types
    if (returnTypes.size > 1) {
      return Array.from(returnTypes).join(" | ");
    }

    return Array.from(returnTypes)[0] || "void";
  }
}
```

#### Update Strategy Implementation

```typescript
class JSDocUpdater {
  async applyUpdates(
    file: string,
    updates: FunctionUpdate[],
    strategy: "merge" | "replace" | "append"
  ): Promise<void> {
    const content = await fs.readFile(file, "utf-8");
    const lines = content.split("\n");

    for (const update of updates) {
      const lineIndex = update.line - 1;

      switch (strategy) {
        case "replace":
          this.replaceJSDoc(lines, lineIndex, update.newJSDoc);
          break;

        case "merge":
          const merged = this.mergeJSDoc(
            lines[lineIndex],
            update.existingJSDoc,
            update.newJSDoc
          );
          lines[lineIndex] = merged;
          break;

        case "append":
          if (!this.hasJSDoc(lines[lineIndex])) {
            this.insertJSDoc(lines, lineIndex, update.newJSDoc);
          }
          break;
      }
    }

    await fs.writeFile(file, lines.join("\n"), "utf-8");
  }

  private mergeJSDoc(
    existingLine: string,
    existingJSDoc: string | null,
    newJSDoc: string
  ): string {
    if (!existingJSDoc) {
      return newJSDoc;
    }

    // Parse existing JSDoc to extract manual descriptions
    const existing = this.parseJSDoc(existingJSDoc);
    const generated = this.parseJSDoc(newJSDoc);

    // Preserve manual descriptions, update types/params
    const merged = this.mergeJSDocObjects(existing, generated);

    return this.stringifyJSDoc(merged);
  }
}
```

---

## 5. File Watching & Change Detection

### 5.1 File Watcher Architecture

```typescript
import chokidar from "chokidar";

class DocumentationWatcher {
  private watcher: FSWatcher;
  private debounceTimers: Map<string, NodeJS.Timeout>;
  private config: ScribeConfig;

  constructor(config: ScribeConfig) {
    this.config = config;
    this.debounceTimers = new Map();
  }

  start(): void {
    this.watcher = chokidar.watch(this.getWatchPatterns(), {
      ignored: this.config.watch.ignorePatterns,
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
    });

    this.watcher
      .on("change", (path) => this.onFileChange(path))
      .on("add", (path) => this.onFileAdd(path))
      .on("unlink", (path) => this.onFileDelete(path));
  }

  private onFileChange(path: string): void {
    // Debounce rapid changes
    this.debounce(path, async () => {
      const fileType = this.classifyFile(path);

      switch (fileType) {
        case "route":
          await this.triggerOpenAPISync();
          break;
        case "config":
          await this.triggerReadmeUpdate();
          break;
        case "source":
          await this.triggerJSDocGeneration([path]);
          break;
      }
    });
  }

  private classifyFile(path: string): FileType {
    // Route files
    if (path.match(/(routes|controllers|handlers)/)) {
      return "route";
    }

    // Config files
    if (path.match(/(package\.json|tsconfig\.json)/)) {
      return "config";
    }

    // Source files
    if (path.match(/\.(ts|js|py)$/)) {
      return "source";
    }

    return "unknown";
  }

  private debounce(path: string, callback: () => Promise<void>): void {
    const existing = this.debounceTimers.get(path);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = setTimeout(async () => {
      await callback();
      this.debounceTimers.delete(path);
    }, this.config.watch.debounceMs);

    this.debounceTimers.set(path, timer);
  }
}
```

### 5.2 Change Detection Strategy

```typescript
class ChangeDetector {
  private fileHashes: Map<string, string>;

  async detectRouteChanges(
    projectPath: string
  ): Promise<RouteChange[]> {
    const routes = await this.scanRouteFiles(projectPath);
    const changes: RouteChange[] = [];

    for (const route of routes) {
      const hash = this.computeHash(route.content);
      const previousHash = this.fileHashes.get(route.path);

      if (!previousHash) {
        changes.push({
          type: "added",
          route: route.path,
          file: route.file,
        });
      } else if (hash !== previousHash) {
        changes.push({
          type: "modified",
          route: route.path,
          file: route.file,
          previousHash,
          newHash: hash,
        });
      }

      this.fileHashes.set(route.path, hash);
    }

    // Detect deletions
    for (const [path, hash] of this.fileHashes.entries()) {
      const exists = routes.some((r) => r.path === path);
      if (!exists) {
        changes.push({
          type: "deleted",
          route: path,
        });
        this.fileHashes.delete(path);
      }
    }

    return changes;
  }

  async detectStructureChanges(
    projectPath: string
  ): Promise<StructureChange[]> {
    const currentStructure = await this.scanDirectoryStructure(projectPath);
    const previousStructure = await this.loadCachedStructure();

    return this.diffStructures(previousStructure, currentStructure);
  }

  private diffStructures(
    previous: DirectoryStructure,
    current: DirectoryStructure
  ): StructureChange[] {
    const changes: StructureChange[] = [];

    // Added directories/files
    for (const item of current.items) {
      const existed = previous.items.some((i) => i.path === item.path);
      if (!existed) {
        changes.push({
          type: "added",
          path: item.path,
          itemType: item.isDirectory ? "directory" : "file",
        });
      }
    }

    // Removed directories/files
    for (const item of previous.items) {
      const exists = current.items.some((i) => i.path === item.path);
      if (!exists) {
        changes.push({
          type: "removed",
          path: item.path,
          itemType: item.isDirectory ? "directory" : "file",
        });
      }
    }

    return changes;
  }
}
```

---

## 6. Integration with Quality Gate Hook

### 6.1 Hook Pipeline Integration

```typescript
// In the Judge Hook (code critiquer)
class JudgeHook {
  private scribeMCP: ScribeMCPClient;

  async afterValidation(
    validation: ValidationResult,
    files: string[]
  ): Promise<void> {
    if (!validation.passed) {
      return; // Only trigger docs if validation passed
    }

    // Determine which doc tools to trigger
    const triggers = this.analyzeFileChanges(files);

    // Batch documentation updates
    const updatePromises: Promise<ToolResult>[] = [];

    if (triggers.openapi) {
      updatePromises.push(this.scribeMCP.callTool("sync_openapi_spec", {
        projectPath: process.cwd(),
        generateDiff: true,
      }));
    }

    if (triggers.readme) {
      updatePromises.push(this.scribeMCP.callTool("update_readme_architecture", {
        projectPath: process.cwd(),
        sectionsToUpdate: ["structure", "installation"],
        generateDiff: true,
      }));
    }

    if (triggers.jsdoc.length > 0) {
      updatePromises.push(this.scribeMCP.callTool("generate_jsdoc_on_fly", {
        projectPath: process.cwd(),
        filePaths: triggers.jsdoc,
        strategy: "merge",
      }));
    }

    // Execute all documentation updates in parallel
    const results = await Promise.allSettled(updatePromises);

    // Log results (non-blocking)
    this.logDocumentationUpdates(results);
  }

  private analyzeFileChanges(files: string[]): DocTriggers {
    const triggers: DocTriggers = {
      openapi: false,
      readme: false,
      jsdoc: [],
    };

    for (const file of files) {
      // Route files -> OpenAPI sync
      if (file.match(/(routes|controllers|handlers)/)) {
        triggers.openapi = true;
      }

      // Config files -> README update
      if (file.match(/(package\.json)/)) {
        triggers.readme = true;
      }

      // Source files -> JSDoc generation
      if (file.match(/\.(ts|js)$/)) {
        triggers.jsdoc.push(file);
      }
    }

    return triggers;
  }

  private logDocumentationUpdates(
    results: PromiseSettledResult<ToolResult>[]
  ): void {
    for (const result of results) {
      if (result.status === "fulfilled") {
        console.log(`[Scribe] Documentation updated: ${JSON.stringify(result.value)}`);
      } else {
        console.error(`[Scribe] Documentation update failed: ${result.reason}`);
        // NOTE: We do NOT block completion on documentation failures
      }
    }
  }
}
```

### 6.2 MCP Client Integration

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

class ScribeMCPClient {
  private client: Client;
  private transport: StdioClientTransport;

  async connect(): Promise<void> {
    this.transport = new StdioClientTransport({
      command: "node",
      args: [path.join(__dirname, "scribe-mcp.js")],
    });

    this.client = new Client(
      {
        name: "smite-judge",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await this.client.connect(this.transport);
  }

  async callTool(
    name: string,
    args: Record<string, unknown>
  ): Promise<ToolResult> {
    const response = await this.client.request(
      {
        method: "tools/call",
        params: {
          name,
          arguments: args,
        },
      },
      CallToolResultSchema
    );

    if (response.content[0].type === "text") {
      const result = JSON.parse(response.content[0].text);
      return result;
    }

    throw new Error("Unexpected MCP response format");
  }
}
```

### 6.3 Error Handling Strategy

```typescript
class DocumentationErrorHandler {
  handle(error: Error, context: string): void {
    // Categorize error
    const category = this.categorizeError(error);

    switch (category) {
      case "parse-error":
        // Log and continue (don't block)
        console.warn(`[Scribe] Parse error in ${context}: ${error.message}`);
        break;

      case "write-error":
        // Log but don't block completion
        console.error(`[Scribe] Write error in ${context}: ${error.message}`);
        break;

      case "timeout":
        // Log timeout, continue
        console.warn(`[Scribe] Timeout in ${context}`);
        break;

      case "critical":
        // Critical errors (e.g., MCP server crash)
        // Still don't block, but alert user
        console.error(
          `[Scribe] Critical error in ${context}: ${error.message}\n` +
          `Documentation updates may be incomplete.`
        );
        break;
    }
  }

  private categorizeError(error: Error): ErrorCategory {
    if (error.message.includes("parse")) {
      return "parse-error";
    }
    if (error.message.includes("EACCES") || error.message.includes("ENOENT")) {
      return "write-error";
    }
    if (error.message.includes("timeout")) {
      return "timeout";
    }
    return "critical";
  }
}
```

---

## 7. Configuration & Extensibility

### 7.1 Default Configuration

```json
{
  "$schema": "./schemas/scribe-config.schema.json",
  "enabled": true,
  "tools": {
    "openapi": {
      "enabled": true,
      "outputPath": "openapi.json",
      "outputFormat": "json",
      "frameworks": ["express", "nextjs"],
      "routePatterns": ["**/routes/**/*.ts", "**/api/**/*.ts"],
      "scanPaths": ["src/"]
    },
    "readme": {
      "enabled": true,
      "readmePath": "README.md",
      "autoSections": ["installation", "structure"],
      "protectedSections": ["usage", "contributing"]
    },
    "jsdoc": {
      "enabled": true,
      "includePatterns": ["src/**/*.ts"],
      "excludePatterns": ["**/*.test.ts", "**/*.spec.ts"],
      "overwriteStrategy": "merge"
    }
  },
  "watch": {
    "enabled": true,
    "debounceMs": 500,
    "ignorePatterns": [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      "**/*.test.ts",
      "**/*.spec.ts"
    ]
  },
  "diff": {
    "format": "unified",
    "maxLines": 100
  }
}
```

### 7.2 Adding Custom Documentation Generators

```typescript
// Extensible tool interface
interface DocumentationTool {
  name: string;
  title: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  execute(args: unknown): Promise<ToolResult>;
}

// Register custom tools
class ScribeMCPServer {
  private customTools: Map<string, DocumentationTool>;

  registerTool(tool: DocumentationTool): void {
    this.customTools.set(tool.name, tool);
  }

  private async executeCustomTool(
    name: string,
    args: unknown
  ): Promise<ToolResult> {
    const tool = this.customTools.get(name);
    if (!tool) {
      throw new Error(`Unknown custom tool: ${name}`);
    }
    return tool.execute(args);
  }
}

// Example: Custom tool for generating React PropTypes
class PropTypesGenerator implements DocumentationTool {
  name = "generate_proptypes";
  title = "PropTypes Generator";
  description = "Generates PropTypes for React components";

  inputSchema = {
    type: "object",
    properties: {
      componentPath: { type: "string" },
    },
    required: ["componentPath"],
  };

  outputSchema = {
    type: "object",
    properties: {
      success: { type: "boolean" },
      propTypes: { type: "string" },
    },
  };

  async execute(args: { componentPath: string }): Promise<ToolResult> {
    // Analyze React component
    // Generate PropTypes
    // Update file
    return { success: true, propTypes: "..." };
  }
}
```

---

## 8. Performance Considerations

### 8.1 Optimization Strategies

```typescript
class PerformanceOptimizer {
  // 1. Incremental scanning
  async scanIncremental(
    projectPath: string,
    changedFiles: string[]
  ): Promise<Endpoint[]> {
    // Only scan changed files, not entire project
    const endpoints: Endpoint[] = [];

    for (const file of changedFiles) {
      const fileEndpoints = await this.scanFile(file);
      endpoints.push(...fileEndpoints);
    }

    return endpoints;
  }

  // 2. Caching
  private cache: Map<string, CacheEntry>;

  async getCached<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && !this.isExpired(cached)) {
      return cached.value as T;
    }

    const value = await fn();
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: 60000, // 1 minute
    });

    return value;
  }

  // 3. Parallel processing
  async processFilesInParallel(
    files: string[],
    processor: (file: string) => Promise<any>
  ): Promise<any[]> {
    const concurrency = 4; // Process 4 files at a time
    const batches = this.chunk(files, concurrency);

    const results: any[] = [];
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((file) => processor(file))
      );
      results.push(...batchResults);
    }

    return results;
  }

  // 4. Lazy loading
  private routeScanners: Lazy<RouteScanner>;

  getRouteScanner(framework: string): RouteScanner {
    return this.routeScanners.get(framework, () => {
      switch (framework) {
        case "express":
          return new ExpressRouteScanner();
        case "fastapi":
          return new FastAPIRouteScanner();
        // Only instantiate scanners when needed
      }
    });
  }
}
```

### 8.2 Scalability Limits

| Metric | Limit | Rationale |
|--------|-------|-----------|
| Project size | 10,000 files | Tested performance threshold |
| Route count | 1,000 endpoints | OpenAPI spec size limits |
| JSDoc generation | 500 functions/min | Balance speed vs accuracy |
| File watch events | 100 events/sec | System I/O limits |
| MCP response time | 30 seconds | Claude Code timeout |

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
describe("OpenAPISyncTool", () => {
  it("should detect new endpoints", async () => {
    const tool = new OpenAPISyncTool();
    const result = await tool.execute({
      projectPath: "/test/project",
    });

    expect(result.endpointsAdded).toBeGreaterThan(0);
  });

  it("should merge with existing specs", async () => {
    const tool = new OpenAPISyncTool();
    const result = await tool.execute({
      projectPath: "/test/project",
    });

    expect(result.endpointsUpdated).toBeDefined();
  });

  it("should generate diffs", async () => {
    const tool = new OpenAPISyncTool();
    const result = await tool.execute({
      projectPath: "/test/project",
      generateDiff: true,
    });

    expect(result.diff).toContain("@@");
  });
});
```

### 9.2 Integration Tests

```typescript
describe("Scribe MCP Integration", () => {
  it("should complete full documentation workflow", async () => {
    // 1. Start MCP server
    const server = new ScribeMCPServer(config);
    await server.start();

    // 2. Call tools
    const openapiResult = await server.callTool("sync_openapi_spec", {
      projectPath: testProjectPath,
    });

    const readmeResult = await server.callTool("update_readme_architecture", {
      projectPath: testProjectPath,
    });

    // 3. Verify results
    expect(openapiResult.success).toBe(true);
    expect(readmeResult.success).toBe(true);

    // 4. Verify files updated
    const openapiSpec = JSON.parse(
      await fs.readFile(path.join(testProjectPath, "openapi.json"), "utf-8")
    );
    expect(openapiSpec.paths).toBeDefined();
  });
});
```

### 9.3 E2E Tests

```typescript
describe("Quality Gate with Scribe", () => {
  it("should update docs after code validation passes", async () => {
    // 1. Simulate code change
    await createTestRoute("/api/test");

    // 2. Trigger judge hook
    const judge = new JudgeHook();
    await judge.validate(["src/routes/test.ts"]);

    // 3. Verify documentation updated
    const openapiSpec = JSON.parse(
      await fs.readFile("openapi.json", "utf-8")
    );
    expect(openapiSpec.paths["/api/test"]).toBeDefined();

    // 4. Verify JSDoc generated
    const routeContent = await fs.readFile("src/routes/test.ts", "utf-8");
    expect(routeContent).toContain("@param");
  });
});
```

---

## 10. Security Considerations

### 10.1 Input Validation

```typescript
class SecurityValidator {
  validatePath(path: string): void {
    // Prevent directory traversal
    const normalized = path.normalize(path);
    if (normalized.includes("..")) {
      throw new Error("Invalid path: directory traversal detected");
    }

    // Ensure within project root
    const resolved = path.resolve(path);
    const root = process.cwd();
    if (!resolved.startsWith(root)) {
      throw new Error("Invalid path: outside project root");
    }
  }

  validateToolInput(args: unknown, schema: JSONSchema): void {
    // Use Zod for runtime validation
    const validator = z.object(schema);
    const result = validator.safeParse(args);

    if (!result.success) {
      throw new Error(`Invalid input: ${result.error.message}`);
    }
  }
}
```

### 10.2 Sanitization

```typescript
class OutputSanitizer {
  sanitizeJSDoc(jsdoc: string): string {
    // Remove sensitive information
    // - API keys
    // - Passwords
    // - Internal URLs

    let sanitized = jsdoc;

    // Redact secrets
    sanitized = sanitized.replace(
      /(api[_-]?key|password|token)\s*[:=]\s*["']?[\w-]+["']?/gi,
      "$1: ***REDACTED***"
    );

    return sanitized;
  }

  sanitizeOpenAPISpec(spec: OpenAPISpec): OpenAPISpec {
    // Remove server URLs with credentials
    // Remove example values with secrets
    // Sanitize descriptions

    return spec;
  }
}
```

---

## 11. Future Enhancements

### 11.1 Planned Features

1. **Multi-language support**
   - Python (docstrings)
   - Rust (rustdoc)
   - Go (godoc)

2. **Advanced JSDoc inference**
   - Use LLM for complex descriptions
   - Generate @example tags from test files
   - Infer @see tags from imports

3. **Documentation health metrics**
   - Coverage percentage
   - Outdated documentation detection
   - Missing JSDoc warnings

4. **Interactive mode**
   - Prompt for confirmation before updates
   - Allow manual edits during diff review
   - Selective section updates

### 11.2 Extension Points

- **Custom framework scanners** (e.g., Koa, Hapi)
- **Alternative output formats** (e.g., GraphQL SDL, gRPC proto)
- **Custom documentation generators** (e.g., storybook stories)
- **Integration with external tools** (e.g., Swagger UI, TypeDoc)

---

## 12. Implementation Checklist

- [ ] Create `@smite/scribe-mcp` package structure
- [ ] Implement MCP server with stdio transport
- [ ] Implement `sync_openapi_spec` tool
  - [ ] Express route scanner
  - [ ] FastAPI route scanner
  - [ ] Next.js route scanner
  - [ ] OpenAPI spec merger
  - [ ] Diff generator
- [ ] Implement `update_readme_architecture` tool
  - [ ] Markdown parser
  - [ ] Project structure analyzer
  - [ ] Dependency change detector
  - [ ] Section preservation logic
- [ ] Implement `generate_jsdoc_on_fly` tool
  - [ ] TypeScript AST parser
  - [ ] Type inference engine
  - [ ] JSDoc generator
  - [ ] Update strategy (merge/replace/append)
- [ ] Implement file watching with chokidar
- [ ] Integrate with Judge Hook
- [ ] Add configuration system
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Document usage and API
- [ ] Create examples and tutorials

---

## 13. References

### MCP Specification
- [MCP Tools Specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) - Official tool definition and schema format
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official SDK for building MCP servers in TypeScript

### File Watching
- [Chokidar Repository](https://github.com/paulmillr/chokidar) - Minimal and efficient cross-platform file watcher
- [chokidar-ts](https://github.com/poppinss/chokidar-ts) - TypeScript-specific file watcher wrapper

### Best Practices
- [Building a TypeScript MCP Server](https://medium.com/@jageenshukla/building-a-typescript-mcp-server-a-guide-for-integrating-existing-services-5bde3fc13b23) - Implementation guide
- [MCP Implementation Tips](https://nearform.com/digital-community/implementing-model-context-protocol-mcp-tips-tricks-and-pitfalls/) - Best practices and pitfalls

### OpenAPI/Swagger
- [OpenAPI Specification](https://swagger.io/specification/) - Standard for API documentation
- [swagger-parser](https://www.npmjs.com/package/swagger-parser) - OpenAPI spec validation

### TypeScript AST
- [TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) - AST manipulation
- [ast-explorer](https://astexplorer.net/) - Interactive AST viewer

---

**Document Status**: Complete - Ready for Implementation Phase
**Next Step**: US-005 (Implement OpenAPI Sync Tool)
