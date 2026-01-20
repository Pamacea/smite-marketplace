# Browser Automation Plugin - MCP-First Architecture

**Version:** 2.0.0
**Status:** Architecture Design
**Author:** SMITE Architect Agent
**Date:** 2026-01-20

---

## 1. Overview and Goals

### 1.1 Mission Statement
Transform the browser automation plugin from a **heavy, Playwright-dependent** tool into a **lightweight, MCP-first** orchestration layer that leverages existing z.ai infrastructure.

### 1.2 Strategic Goals
1. **Eliminate Heavy Dependencies**: Remove Playwright requirement (browser installation, maintenance)
2. **Leverage Existing MCP Servers**: Use z.ai's robust MCP infrastructure
3. **Maintain API Compatibility**: Keep existing convenience functions where possible
4. **Enhance Capabilities**: Add features impossible with Playwright alone (GitHub analysis, advanced vision)
5. **Agent-First Design**: Optimize for AI agent consumption, not just CLI usage
6. **Modular Architecture**: Enable feature composition and workflow orchestration

### 1.3 Design Principles
- **MCP-First**: Default to MCP servers, fallback to Playwright only when necessary
- **Layered Architecture**: Clear separation between MCP clients, features, and workflows
- **Type Safety**: Full TypeScript with Zod validation at boundaries
- **Composability**: Features can be combined into complex workflows
- **Observability**: Structured logging and error reporting
- **Testability**: Each layer independently testable

---

## 2. MCP Server Capabilities Summary

### 2.1 Available z.ai MCP Servers

#### 2.1.1 `web-reader` (mcp__web-reader__webReader)
**Purpose**: Fetch URLs and convert to LLM-friendly markdown

**Capabilities**:
- HTTP content fetching with timeout control
- Markdown conversion (GitHub Flavored Markdown support)
- Image retention and summarization
- Link extraction and summarization
- Cache control for fresh data

**Best For**:
- Static content extraction
- Blog posts, documentation
- API response parsing
- Structured markdown output

**Limitations**:
- No JavaScript execution
- No interactive forms
- No authentication handling

#### 2.1.2 `web-search-prime` (mcp__web-search-prime__webSearchPrime)
**Purpose**: Web search with structured results

**Capabilities**:
- Multi-domain search filtering
- Time-based filtering (oneDay, oneWeek, oneMonth, oneYear)
- Content size control (medium: 400-600 words, high: 2500 words)
- Location-based results (cn, us)
- Rich metadata (title, URL, summary, favicon, site name)

**Best For**:
- Research and discovery
- Finding recent information
- Competitive analysis
- Trend identification

**Limitations**:
- Search engine dependent
- Rate limited
- Result count varies by engine

#### 2.1.3 `zai-mcp-server` (mcp__zai-mcp-server__*)
**Purpose**: Multi-modal AI vision and analysis

**Capabilities**:
- **Image Analysis** (`analyze_image`): General-purpose image understanding
- **UI to Artifact** (`ui_to_artifact`): Convert UI screenshots to code/prompts/specs
- **Text Extraction** (`extract_text_from_screenshot`): OCR with code recognition
- **Video Analysis** (`analyze_video`): Video content understanding
- **Error Diagnosis** (`diagnose_error_screenshot`): Error message analysis
- **Data Viz Analysis** (`analyze_data_visualization`): Chart/graph insights
- **UI Diff Check** (`ui_diff_check`): Visual regression testing
- **Technical Diagrams** (`understand_technical_diagram`): Architecture/flowchart understanding

**Best For**:
- Screenshot analysis
- UI understanding and replication
- OCR and code extraction
- Visual regression testing
- Documentation from images

**Limitations**:
- Requires image file paths or URLs
- Computationally intensive
- Token-intensive for complex images

#### 2.1.4 `zread` (mcp__zread__*)
**Purpose**: GitHub repository analysis without cloning

**Capabilities**:
- **Repository Structure** (`get_repo_structure`): Directory tree traversal
- **File Reading** (`read_file`): Full file content access
- **Documentation Search** (`search_doc`): Semantic search across issues, docs, commits

**Best For**:
- Code research without cloning
- Quick repository exploration
- Documentation search
- Understanding project structure

**Limitations**:
- Public repositories only
- No git operations (checkout, branch, diff)
- No local file manipulation

---

## 3. Function Mapping (Old → New)

### 3.1 Direct Replacements (MCP-Only)

| Old Function | Old Implementation | New MCP Function | MCP Server | Status |
|:---|:---|:---|:---|:---|
| `search(query, engine)` | Playwright browser automation + form filling | `webSearchPrime(query)` | web-search-prime | ✅ **Enhanced** |
| `goto(url) + extract(selector)` | Playwright DOM traversal | `webReader(url)` | web-reader | ✅ **Enhanced** |
| N/A | N/A | `searchDoc(query)` | zread | 🆕 **New** |
| N/A | N/A | `getRepoStructure(path)` | zread | 🆕 **New** |
| N/A | N/A | `readFile(path)` | zread | 🆕 **New** |

### 3.2 Enhanced Replacements (MCP + Additional Processing)

| Old Function | Old Implementation | New Implementation | Enhancement | Status |
|:---|:---|:---|:---|:---|
| `screenshot(filename)` | Saves PNG to disk | `analyzeImage(path, prompt)` | AI understanding of content | ✅ **Enhanced** |
| N/A | N/A | `extractText(path)` | OCR from screenshots | 🆕 **New** |
| N/A | N/A | `uiToArtifact(path, type)` | UI → code/spec/prompt | 🆕 **New** |
| N/A | N/A | `diagnoseError(path)` | Error screenshot analysis | 🆕 **New** |
| N/A | N/A | `uiDiffCheck(expected, actual)` | Visual regression | 🆕 **New** |

### 3.3 Playwright-Dependent (Conditional/Deprecated)

| Old Function | Old Implementation | New Approach | Rationale | Status |
|:---|:---|:---|:---|---|
| `goto(url)` | Navigate browser | `readUrl(url)` via web-reader | Static content sufficient | ⚠️ **Conditional** |
| `click(selector)` | DOM interaction | **N/A** | Rarely needed by agents | ⚠️ **Conditional** |
| `fill(selector, value)` | Form interaction | **N/A** | Rarely needed by agents | ⚠️ **Conditional** |
| `extract(selector)` | DOM text extraction | **N/A** | Markdown extraction better | ⚠️ **Conditional** |
| `interactive(url)` | Manual browser control | **N/A** | Outside scope of refactor | ❌ **Deprecated** |

### 3.4 Conditional Playwright Usage

**When to Keep Playwright**:
- User explicitly requests interactive browser control
- Complex multi-step workflows requiring JavaScript execution
- Authentication flows needing manual intervention
- Testing browser-specific behavior (not content extraction)

**Implementation Strategy**:
- Make Playwright an **optional peer dependency**
- Feature flags to enable Playwright-dependent features
- Graceful degradation when Playwright not installed

---

## 4. Feature Decisions

### 4.1 Features to Keep (Enhanced)

#### 4.1.1 Web Search
**Old**: `search(query, 'google' | 'youtube' | 'bing')`
**New**: `searchWeb(query, options)`

**Enhancements**:
- Remove search engine limitation (use best available)
- Add time filtering (recent results)
- Add domain filtering (focus on specific sites)
- Add location targeting (cn, us)
- Add content size control
- Return structured metadata (title, URL, summary, favicon)

**Use Cases**:
- Research and discovery
- Finding documentation
- Competitive analysis
- Trend identification

#### 4.1.2 URL Reading
**Old**: `goto(url) + extract(selector)`
**New**: `readUrl(url, options)`

**Enhancements**:
- No browser overhead
- Automatic markdown conversion
- Image retention with summaries
- Link extraction
- Cache control
- Faster execution

**Use Cases**:
- Blog post extraction
- Documentation reading
- Article summarization
- Content aggregation

#### 4.1.3 Screenshot Analysis
**Old**: `screenshot(filename)` (save to disk)
**New**: `analyzeScreenshot(path, prompt)`

**Enhancements**:
- AI-powered content understanding
- Natural language queries about images
- Text extraction (OCR)
- UI element identification
- Error detection

**Use Cases**:
- Debugging visual issues
- Understanding UI layouts
- Extracting data from images
- Documenting interfaces

### 4.2 Features to Enhance (New Capabilities)

#### 4.2.1 GitHub Repository Analysis
**New**: `analyzeGitHubRepo(owner, repo, path?)`

**Capabilities**:
- Get repository structure without cloning
- Read individual files
- Search documentation and issues
- Understand project organization

**Use Cases**:
- Code research
- Understanding dependencies
- Finding examples in open source
- Documentation discovery

#### 4.2.2 UI Understanding and Code Generation
**New**: `uiToArtifact(imagePath, outputType, prompt)`

**Capabilities**:
- Convert UI screenshots to code
- Generate AI prompts for UI recreation
- Extract design specifications
- Generate natural language descriptions

**Use Cases**:
- Rapid prototyping from designs
- Design system documentation
- Converting mockups to code
- UI testing

#### 4.2.3 Text Extraction (OCR)
**New**: `extractText(imagePath, options)`

**Capabilities**:
- OCR with code syntax highlighting
- Multi-language text recognition
- Structure preservation

**Use Cases**:
- Extracting code from screenshots
- Reading error messages
- Digitizing documents
- Parsing terminal output

#### 4.2.4 Visual Regression Testing
**New**: `compareUI(expectedImagePath, actualImagePath, prompt)`

**Capabilities**:
- Visual difference detection
- Layout comparison
- Style deviation detection

**Use Cases**:
- Automated UI testing
- Design consistency checks
- Cross-browser testing validation

#### 4.2.5 Error Diagnosis
**New**: `diagnoseErrorScreenshot(imagePath, context)`

**Capabilities**:
- Error message parsing
- Stack trace analysis
- Suggested solutions

**Use Cases**:
- Debugging assistance
- Error documentation
- Automated triage

### 4.3 Features to Deprecate

#### 4.3.1 Interactive Mode
**Old**: `interactive(url)`
**Reason**: Outside scope of agent-focused refactor
**Migration**: Users should use dedicated browser automation tools

#### 4.3.2 Manual DOM Manipulation
**Old**: `click(selector)`, `fill(selector, value)`
**Reason**: Rarely needed for content extraction and analysis
**Migration**: Use direct API calls or dedicated E2E testing tools

#### 4.3.3 Selector-Based Extraction
**Old**: `extract(selector)`
**Reason**: Markdown extraction is more robust and agent-friendly
**Migration**: Use `readUrl()` for full content, or post-process markdown

---

## 5. TypeScript Interface Definitions

### 5.1 Core Types

```typescript
/**
 * Result wrapper for operations that can fail
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Search result metadata
 */
export interface SearchResult {
  title: string;
  url: string;
  summary: string;
  siteName: string;
  favicon?: string;
  publishedDate?: string;
}

/**
 * Web search options
 */
export interface WebSearchOptions {
  query: string;
  domainFilter?: string[];
  timeRange?: 'oneDay' | 'oneWeek' | 'oneMonth' | 'oneYear' | 'noLimit';
  location?: 'cn' | 'us';
  contentSize?: 'medium' | 'high';
  maxResults?: number;
}

/**
 * URL reading options
 */
export interface ReadUrlOptions {
  url: string;
  timeout?: number;
  retainImages?: boolean;
  withImagesSummary?: boolean;
  withLinksSummary?: boolean;
  useCache?: boolean;
  returnFormat?: 'markdown' | 'text';
}

/**
 * GitHub repository analysis options
 */
export interface GitHubRepoOptions {
  owner: string;
  repo: string;
  path?: string;
  query?: string;
}

/**
 * Image analysis options
 */
export interface AnalyzeImageOptions {
  imagePath: string;
  prompt: string;
  outputFormat?: 'description' | 'structured';
}

/**
 * UI to artifact conversion options
 */
export interface UiToArtifactOptions {
  imagePath: string;
  outputType: 'code' | 'prompt' | 'spec' | 'description';
  prompt?: string;
  targetFramework?: 'react' | 'vue' | 'svelte' | 'html';
}

/**
 * Text extraction (OCR) options
 */
export interface ExtractTextOptions {
  imagePath: string;
  programmingLanguage?: string;
  preserveFormatting?: boolean;
}

/**
 * UI comparison options
 */
export interface CompareUiOptions {
  expectedImagePath: string;
  actualImagePath: string;
  focusAreas?: string[];
  toleranceLevel?: 'strict' | 'moderate' | 'permissive';
}

/**
 * Error diagnosis options
 */
export interface DiagnoseErrorOptions {
  imagePath: string;
  context?: string;
  programmingLanguage?: string;
}
```

### 5.2 Feature Module Interfaces

```typescript
/**
 * Search feature module
 */
export interface SearchFeature {
  search(options: WebSearchOptions): Promise<SearchResult[]>;
  searchWithSummary(query: string): Promise<string>;
}

/**
 * Read feature module
 */
export interface ReadFeature {
  readUrl(options: ReadUrlOptions): Promise<string>;
  readMultiple(urls: string[]): Promise<Map<string, string>>;
}

/**
 * Analyze feature module (vision)
 */
export interface AnalyzeFeature {
  analyzeImage(options: AnalyzeImageOptions): Promise<string>;
  extractText(options: ExtractTextOptions): Promise<string>;
  uiToArtifact(options: UiToArtifactOptions): Promise<string>;
  diagnoseError(options: DiagnoseErrorOptions): Promise<string>;
  compareUi(options: CompareUiOptions): Promise<string>;
  analyzeVideo(videoPath: string, prompt: string): Promise<string>;
  analyzeDataViz(imagePath: string, prompt: string): Promise<string>;
  understandDiagram(imagePath: string, prompt: string): Promise<string>;
}

/**
 * Repository feature module
 */
export interface RepositoryFeature {
  getStructure(owner: string, repo: string, path?: string): Promise<string>;
  readFile(owner: string, repo: string, filePath: string): Promise<string>;
  searchDocs(owner: string, repo: string, query: string): Promise<string>;
}
```

### 5.3 Orchestrator Interfaces

```typescript
/**
 * Workflow step definition
 */
export interface WorkflowStep<T = any> {
  name: string;
  execute: () => Promise<Result<T>>;
  dependencies?: string[];
}

/**
 * Workflow execution context
 */
export interface WorkflowContext {
  variables: Map<string, any>;
  history: Array<{ step: string; result: any }>;
  metadata: Record<string, unknown>;
}

/**
 * Workflow orchestrator
 */
export interface WorkflowOrchestrator {
  execute(steps: WorkflowStep[]): Promise<Result<WorkflowContext>>;
  getVariable<T>(key: string): T | undefined;
  setVariable(key: string, value: any): void;
}
```

### 5.4 Configuration Interfaces

```typescript
/**
 * Plugin configuration
 */
export interface BrowserAutomationConfig {
  /**
   * MCP server endpoints (auto-discovered if null)
   */
  mcpServers?: {
    webReader?: string;
    webSearch?: string;
    zaiMcp?: string;
    zread?: string;
  };

  /**
   * Enable Playwright fallback (requires peer dependency)
   */
  enablePlaywright?: boolean;

  /**
   * Default timeout for web requests (seconds)
   */
  defaultTimeout?: number;

  /**
   * Cache configuration
   */
  cache?: {
    enabled?: boolean;
    ttl?: number;
    maxSize?: number;
  };

  /**
   * Logging configuration
   */
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
    structured?: boolean;
  };

  /**
   * Feature flags
   */
  features?: {
    githubAnalysis?: boolean;
    videoAnalysis?: boolean;
    advancedVision?: boolean;
  };
}
```

---

## 6. Architecture Layers and Data Flow

### 6.1 Layer Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 4: CLI & AGENT API                  │
│                   (Convenience Functions)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: Workflow Orchestrator             │
│                    (High-Level Workflows)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: Feature Modules                   │
│              (search, read, analyze, repo)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: MCP Client Wrapper                │
│                   (Low-Level MCP Calls)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    z.ai MCP Servers                           │
│  (web-reader, web-search-prime, zai-mcp-server, zread)       │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Layer 1: MCP Client Wrapper

**Purpose**: Type-safe, validated MCP server calls

**Responsibilities**:
- MCP tool invocation
- Error handling and retry logic
- Response validation with Zod schemas
- Timeout management
- Logging

**File Structure**:
```
src/mcp/
├── index.ts                      # Barrel export
├── web-reader.client.ts          # web-reader MCP client
├── web-search.client.ts          # web-search-prime MCP client
├── zai-mcp.client.ts             # zai-mcp-server client
├── zread.client.ts               # zread MCP client
└── types.ts                      # MCP-specific types
```

**Key Interfaces**:
```typescript
export interface IMcpClient {
  invoke<T>(tool: string, args: unknown): Promise<Result<T>>;
  isAvailable(): boolean;
}

export class WebReaderClient implements IMcpClient {
  async readUrl(options: ReadUrlOptions): Promise<Result<string>>;
}

export class WebSearchClient implements IMcpClient {
  async search(options: WebSearchOptions): Promise<Result<SearchResult[]>>;
}

export class ZaiMcpClient implements IMcpClient {
  // All vision-related tools
}

export class ZreadClient implements IMcpClient {
  // All GitHub-related tools
}
```

**Error Handling**:
```typescript
export class McpError extends Error {
  constructor(
    public tool: string,
    public cause: unknown,
    message: string
  ) {
    super(message);
    this.name = 'McpError';
  }
}

export class McpTimeoutError extends McpError {
  constructor(tool: string, timeout: number) {
    super(tool, null, `Tool ${tool} timed out after ${timeout}ms`);
    this.name = 'McpTimeoutError';
  }
}
```

### 6.3 Layer 2: Feature Modules

**Purpose**: Domain-specific functionality built on MCP clients

**Responsibilities**:
- Combine multiple MCP calls into cohesive features
- Data transformation and enrichment
- Business logic
- Feature-level error handling

**File Structure**:
```
src/features/
├── index.ts                      # Barrel export
├── search.feature.ts             # Web search
├── read.feature.ts               # URL reading
├── analyze.feature.ts            # Vision/analysis
├── repository.feature.ts         # GitHub analysis
└── types.ts                      # Feature-specific types
```

**Module: Search Feature**
```typescript
export class SearchFeature {
  constructor(private mcp: WebSearchClient) {}

  async search(options: WebSearchOptions): Promise<SearchResult[]> {
    const result = await this.mcp.search(options);

    if (!result.success) {
      throw new SearchError('Search failed', result.error);
    }

    // Enrich with metadata
    return result.data.map(r => ({
      ...r,
      domain: new URL(r.url).hostname,
      timestamp: new Date().toISOString()
    }));
  }

  async searchWithSummary(query: string): Promise<string> {
    const results = await this.search({ query });
    return this.summarizeResults(results);
  }
}
```

**Module: Analyze Feature**
```typescript
export class AnalyzeFeature {
  constructor(
    private zaiMcp: ZaiMcpClient,
    private config: BrowserAutomationConfig
  ) {}

  async analyzeImage(options: AnalyzeImageOptions): Promise<string> {
    const result = await this.zaiMcp.invoke('analyze_image', {
      image_source: options.imagePath,
      prompt: options.prompt
    });

    if (!result.success) {
      throw new AnalysisError('Image analysis failed', result.error);
    }

    return result.data;
  }

  async uiToArtifact(options: UiToArtifactOptions): Promise<string> {
    // specialized prompt based on output type
    const prompt = this.buildPrompt(options);
    return this.analyzeImage({
      imagePath: options.imagePath,
      prompt
    });
  }
}
```

### 6.4 Layer 3: Workflow Orchestrator

**Purpose**: Execute complex, multi-step workflows

**Responsibilities**:
- Dependency resolution
- Parallel execution where possible
- State management (variables, history)
- Error recovery and rollback
- Progress tracking

**File Structure**:
```
src/orchestrator/
├── index.ts                      # Barrel export
├── workflow.ts                   # Workflow orchestrator
├── steps/                        # Predefined workflow steps
│   ├── research.ts               # Research workflow
│   ├── competitor-analysis.ts    # Competitor analysis workflow
│   └── documentation-generation.ts
└── types.ts
```

**Key Classes**:
```typescript
export class WorkflowOrchestrator {
  private context: WorkflowContext;

  constructor(
    private features: {
      search: SearchFeature;
      read: ReadFeature;
      analyze: AnalyzeFeature;
      repo: RepositoryFeature;
    }
  ) {
    this.context = {
      variables: new Map(),
      history: [],
      metadata: {}
    };
  }

  async execute(steps: WorkflowStep[]): Promise<Result<WorkflowContext>> {
    try {
      for (const step of steps) {
        // Check dependencies
        if (step.dependencies) {
          for (const dep of step.dependencies) {
            if (!this.context.variables.has(dep)) {
              throw new WorkflowError(`Dependency ${dep} not satisfied`);
            }
          }
        }

        // Execute step
        const result = await step.execute();

        if (!result.success) {
          throw new WorkflowError(`Step ${step.name} failed`, result.error);
        }

        // Store result
        this.context.variables.set(step.name, result.data);
        this.context.history.push({ step: step.name, result: result.data });
      }

      return { success: true, data: this.context };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}
```

**Predefined Workflows**:
```typescript
/**
 * Research workflow: Search → Read → Summarize
 */
export async function researchWorkflow(
  orchestrator: WorkflowOrchestrator,
  query: string
): Promise<string> {
  const steps: WorkflowStep[] = [
    {
      name: 'search',
      execute: async () => {
        const results = await orchestrator.features.search.search({
          query,
          maxResults: 5
        });
        return { success: true, data: results };
      }
    },
    {
      name: 'read',
      dependencies: ['search'],
      execute: async () => {
        const searchResults = orchestrator.getVariable<SearchResult[]>('search');
        const urls = searchResults.map(r => r.url);
        const contents = await orchestrator.features.read.readMultiple(urls);
        return { success: true, data: contents };
      }
    },
    {
      name: 'summarize',
      dependencies: ['read'],
      execute: async () => {
        const contents = orchestrator.getVariable<Map<string, string>>('read');
        const summary = Array.from(contents.values()).join('\n\n---\n\n');
        return { success: true, data: summary };
      }
    }
  ];

  const result = await orchestrator.execute(steps);
  if (!result.success) {
    throw result.error;
  }

  return result.data.variables.get('summarize');
}
```

### 6.5 Layer 4: CLI & Agent API

**Purpose**: User-friendly interfaces for different consumption modes

**Responsibilities**:
- Argument parsing
- Output formatting
- Progress reporting
- Error messaging

**File Structure**:
```
src/
├── index.ts                       # Agent API (convenience functions)
├── cli.ts                         # CLI entry point
├── commands/                      # CLI command handlers
│   ├── search.ts
│   ├── read.ts
│   ├── analyze.ts
│   ├── repo.ts
│   └── workflow.ts
└── utils/
    ├── output.ts                  # Output formatting
    └── progress.ts                # Progress indicators
```

**Agent API**:
```typescript
/**
 * Convenience API for AI agents
 */
export async function search(query: string, options?: Partial<WebSearchOptions>) {
  const browser = new BrowserAutomation();
  return browser.search({ query, ...options });
}

export async function readUrl(url: string, options?: Partial<ReadUrlOptions>) {
  const browser = new BrowserAutomation();
  return browser.read({ url, ...options });
}

export async function analyzeImage(imagePath: string, prompt: string) {
  const browser = new BrowserAutomation();
  return browser.analyze({ imagePath, prompt });
}

export async function analyzeGitHub(owner: string, repo: string, query?: string) {
  const browser = new BrowserAutomation();
  return browser.repo.searchDocs(owner, repo, query || '');
}
```

**CLI Commands**:
```typescript
// src/commands/search.ts
export async function searchCommand(args: string[]) {
  const query = args[0];
  const options = parseOptions(args.slice(1));

  const browser = new BrowserAutomation();
  const results = await browser.search({ query, ...options });

  console.log(formatSearchResults(results));
}
```

### 6.6 Data Flow Example

**Scenario**: Research a topic and summarize findings

```
User/Agent
    │
    │ "Research 'Browser MCP servers'"
    │
    ▼
┌─────────────────────────────────────────┐
│ CLI: browse research "Browser MCP servers" │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│ Orchestrator: researchWorkflow()          │
│  1. Search web                            │
│  2. Read top results                      │
│  3. Summarize                             │
└─────────────────────────────────────────┘
    │
    ├─────────────────────────────────────────────┐
    │                                             │
    ▼                                             ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│ Feature: Search.search() │         │ Feature: Read.readUrl()  │
└──────────────────────────┘         └──────────────────────────┘
    │                                             │
    ▼                                             ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│ MCP: WebSearchClient     │         │ MCP: WebReaderClient     │
└──────────────────────────┘         └──────────────────────────┘
    │                                             │
    ▼                                             ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│ Server: web-search-prime │         │ Server: web-reader       │
└──────────────────────────┘         └──────────────────────────┘
    │                                             │
    └────────────────────┬────────────────────────┘
                         │
                         ▼
              ┌───────────────────────┐
              │ Workflow Aggregates   │
              │ Results → Summary     │
              └───────────────────────┘
                         │
                         ▼
              ┌───────────────────────┐
              │ Output to User/Agent  │
              └───────────────────────┘
```

---

## 7. Integration Points for Agents

### 7.1 SMITE Agent Integration

**Agent Context Registration**:
```typescript
// In agent initialization
import { BrowserAutomation } from '@smite/browser-automation';

const browser = new BrowserAutomation();

agent.registerContext({
  name: 'browser',
  capabilities: [
    'search',
    'readUrl',
    'analyzeImage',
    'analyzeGitHub',
    'extractText',
    'uiToArtifact'
  ],
  handler: browser
});
```

**Agent Tool Definitions**:
```json
{
  "name": "browser_search",
  "description": "Search the web for information",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query"
      },
      "timeRange": {
        "type": "string",
        "enum": ["oneDay", "oneWeek", "oneMonth", "oneYear", "noLimit"],
        "description": "Filter results by time"
      }
    },
    "required": ["query"]
  }
}
```

### 7.2 Claude Tool Integration

**Tool Schema**:
```typescript
const browserTool = {
  name: 'browser_automation',
  description: 'Automate web browsing, search, and content extraction using MCP servers',
  input_schema: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['search', 'read', 'analyze', 'repo', 'workflow'],
        description: 'Action to perform'
      },
      params: {
        type: 'object',
        description: 'Action-specific parameters'
      }
    },
    required: ['action', 'params']
  }
};
```

### 7.3 Workflow Composition for Agents

**Common Agent Workflows**:

1. **Research Workflow**:
   - Search topic
   - Read top 5 results
   - Extract key insights
   - Generate summary

2. **Competitor Analysis**:
   - Search competitors
   - Read competitor pages
   - Compare features
   - Identify gaps

3. **Documentation Research**:
   - Search GitHub repos
   - Read README/docs
   - Extract code examples
   - Generate summary

4. **Bug Investigation**:
   - Search error messages
   - Analyze screenshots
   - Read Stack Overflow
   - Suggest solutions

### 7.4 Error Handling for Agents

**Structured Error Responses**:
```typescript
export class AgentError extends Error {
  constructor(
    public code: string,
    public retryable: boolean,
    public suggestion: string | null,
    message: string
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

// Usage
throw new AgentError(
  'MCP_TIMEOUT',
  true,
  'Try reducing the request scope or increasing timeout',
  'Web search timed out after 30s'
);
```

**Recovery Strategies**:
```typescript
export interface RecoveryStrategy {
  canRecover(error: Error): boolean;
  recover(error: Error, context: WorkflowContext): Promise<void>;
}

export class RetryStrategy implements RecoveryStrategy {
  canRecover(error: Error): boolean {
    return error instanceof AgentError && error.retryable;
  }

  async recover(error: Error, context: WorkflowContext): Promise<void> {
    // Exponential backoff retry
  }
}
```

---

## 8. Migration Path

### 8.1 Phase 1: Foundation (Week 1)
- [ ] Set up project structure (layers, modules)
- [ ] Implement MCP client wrappers (Layer 1)
- [ ] Define TypeScript interfaces
- [ ] Set up Zod validation schemas

### 8.2 Phase 2: Feature Modules (Week 2)
- [ ] Implement Search feature
- [ ] Implement Read feature
- [ ] Implement Analyze feature (vision)
- [ ] Implement Repository feature (GitHub)

### 8.3 Phase 3: Workflow Engine (Week 3)
- [ ] Implement WorkflowOrchestrator
- [ ] Define predefined workflows
- [ ] Add state management
- [ ] Implement error recovery

### 8.4 Phase 4: CLI & Agent API (Week 4)
- [ ] Implement convenience API
- [ ] Implement CLI commands
- [ ] Add output formatting
- [ ] Write documentation

### 8.5 Phase 5: Testing & Refinement (Week 5)
- [ ] Unit tests for each layer
- [ ] Integration tests for workflows
- [ ] End-to-end tests for CLI
- [ ] Performance optimization

### 8.6 Optional: Playwright Compatibility (Week 6)
- [ ] Make Playwright a peer dependency
- [ ] Implement feature flags
- [ ] Add graceful degradation
- [ ] Document Playwright-specific features

---

## 9. Non-Functional Requirements

### 9.1 Performance
- **Web Search**: < 3s for standard queries
- **URL Reading**: < 5s for typical pages
- **Image Analysis**: < 10s for standard screenshots
- **GitHub Operations**: < 5s for structure, < 2s per file

### 9.2 Reliability
- **Retry Logic**: 3 attempts with exponential backoff for transient failures
- **Timeout Handling**: Configurable timeouts with clear error messages
- **Graceful Degradation**: Fall back to alternative methods when possible
- **Error Recovery**: Structured error responses with recovery suggestions

### 9.3 Observability
- **Structured Logging**: JSON-formatted logs with context
- **Metrics**: Track MCP call latency, success rates, error types
- **Tracing**: Correlation IDs for workflow execution across steps
- **Debug Mode**: Verbose logging for troubleshooting

### 9.4 Security
- **Input Validation**: Zod schemas at all boundaries
- **URL Sanitization**: Validate and sanitize URLs
- **File Path Validation**: Prevent directory traversal
- **No Secrets**: Never log sensitive data

### 9.5 Extensibility
- **Plugin Architecture**: Easy to add new MCP servers
- **Feature Composition**: Combine features into new workflows
- **Custom Workflows**: Users can define their own workflow steps
- **Configuration**: All behavior configurable via config file

---

## 10. Open Questions & Decisions Needed

### 10.1 Technical Decisions

1. **MCP Server Discovery**
   - Q: How to discover MCP server endpoints?
   - A1: Auto-discovery via SMITE config (preferred)
   - A2: Manual configuration in plugin config
   - **Decision**: A1 with A2 fallback

2. **Playwright Dependency**
   - Q: Should Playwright be removed entirely or made optional?
   - A1: Remove entirely (simpler, lighter)
   - A2: Make optional peer dependency (flexible)
   - **Decision**: A2 for backward compatibility

3. **Caching Strategy**
   - Q: Where to cache responses?
   - A1: In-memory (fast, lost on restart)
   - A2: File system (persistent, slower)
   - A3: Hybrid (LRU with file backing)
   - **Decision**: A3 with configurable TTL

4. **Workflow State Persistence**
   - Q: Should workflow state be persisted?
   - A1: No (memory only)
   - A2: Yes (file-based checkpoints)
   - **Decision**: A1 initially, A2 as enhancement

### 10.2 UX Decisions

1. **CLI Output Format**
   - Q: Default output format?
   - A1: Markdown (readable)
   - A2: JSON (parseable)
   - A3: Auto-detect by terminal
   - **Decision**: A1 with `--json` flag

2. **Error Verbosity**
   - Q: How much detail in error messages?
   - A1: Minimal (user-friendly)
   - A2: Verbose (debuggable)
   - A3: Configurable
   - **Decision**: A3 with `--verbose` flag

### 10.3 Prioritization

**Must Have (MVP)**:
- Core MCP client wrappers
- Search, Read, Analyze features
- Basic CLI commands
- Agent convenience API

**Should Have (v2.0)**:
- Workflow orchestrator
- Predefined workflows
- Caching
- Structured logging

**Could Have (v2.1)**:
- GitHub repository analysis
- Advanced vision features
- Custom workflow definitions
- State persistence

**Won't Have (Out of Scope)**:
- Interactive browser mode
- Manual DOM manipulation
- Form filling/clicking (use dedicated E2E tools)

---

## 11. Success Criteria

### 11.1 Functional Requirements
- ✅ All old Playwright functions have MCP equivalents
- ✅ New features enabled (GitHub, advanced vision)
- ✅ CLI commands work for all features
- ✅ Agent API is intuitive and well-documented

### 11.2 Non-Functional Requirements
- ✅ Plugin installs without Playwright (optional peer dependency)
- ✅ 95% of operations complete within performance targets
- ✅ 100% of MCP calls have timeout handling
- ✅ All inputs validated with Zod schemas

### 11.3 Developer Experience
- ✅ Clear migration guide from v1.x to v2.0
- ✅ Comprehensive API documentation
- ✅ Example workflows for common use cases
- ✅ TypeScript types for all public APIs

---

## 12. Appendices

### 12.1 File Structure (Final)

```
plugins/browser-automation/
├── .claude/
│   └── .smite/
│       └── browser.json               # Plugin config
├── .smite/
│   ├── browser-automation-architecture.md  # This document
│   └── screenshots/                   # Screenshot storage
├── src/
│   ├── index.ts                       # Agent API (barrel)
│   ├── cli.ts                         # CLI entry point
│   ├── config.ts                      # Configuration loader
│   ├── mcp/                           # Layer 1: MCP Clients
│   │   ├── index.ts
│   │   ├── web-reader.client.ts
│   │   ├── web-search.client.ts
│   │   ├── zai-mcp.client.ts
│   │   ├── zread.client.ts
│   │   └── types.ts
│   ├── features/                      # Layer 2: Feature Modules
│   │   ├── index.ts
│   │   ├── search.feature.ts
│   │   ├── read.feature.ts
│   │   ├── analyze.feature.ts
│   │   ├── repository.feature.ts
│   │   └── types.ts
│   ├── orchestrator/                  # Layer 3: Workflow Engine
│   │   ├── index.ts
│   │   ├── workflow.ts
│   │   ├── steps/
│   │   │   ├── research.ts
│   │   │   ├── competitor-analysis.ts
│   │   │   └── documentation-generation.ts
│   │   └── types.ts
│   ├── commands/                      # Layer 4: CLI Commands
│   │   ├── index.ts
│   │   ├── search.ts
│   │   ├── read.ts
│   │   ├── analyze.ts
│   │   ├── repo.ts
│   │   └── workflow.ts
│   ├── utils/                         # Utilities
│   │   ├── output.ts
│   │   ├── progress.ts
│   │   ├── errors.ts
│   │   └── validation.ts
│   └── schemas/                       # Zod Validation Schemas
│       ├── index.ts
│       ├── search.schema.ts
│       ├── read.schema.ts
│       ├── analyze.schema.ts
│       └── repo.schema.ts
├── commands/                          # CLI command executables
│   ├── browse.js
│   └── workflows/
│       ├── research.js
│       └── analyze.js
├── tests/                             # Test suite
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                              # Documentation
│   ├── API.md
│   ├── workflows.md
│   └── migration.md
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### 12.2 Example: Complete Workflow

**Use Case**: Research a competitor's feature

```typescript
import { BrowserAutomation, WorkflowOrchestrator } from '@smite/browser-automation';

const browser = new BrowserAutomation();

// Define workflow
const workflow = [
  {
    name: 'search_competitor',
    execute: async () => ({
      success: true,
      data: await browser.search({
        query: 'competitor.com feature X',
        domainFilter: ['competitor.com'],
        maxResults: 10
      })
    })
  },
  {
    name: 'read_pages',
    dependencies: ['search_competitor'],
    execute: async () => {
      const searchResults = browser.context.get('search_competitor');
      const urls = searchResults.data.map((r: SearchResult) => r.url);
      return {
        success: true,
        data: await browser.read.readMultiple(urls)
      };
    }
  },
  {
    name: 'analyze_screenshots',
    dependencies: ['read_pages'],
    execute: async () => {
      // Extract images from pages and analyze
      // ... implementation
    }
  },
  {
    name: 'generate_report',
    dependencies: ['read_pages', 'analyze_screenshots'],
    execute: async () => {
      const pages = browser.context.get('read_pages');
      const analysis = browser.context.get('analyze_screenshots');
      return {
        success: true,
        data: generateCompetitorReport(pages, analysis)
      };
    }
  }
];

// Execute
const orchestrator = new WorkflowOrchestrator(browser.features);
const result = await orchestrator.execute(workflow);

if (result.success) {
  console.log('Competitor analysis complete:', result.data);
} else {
  console.error('Workflow failed:', result.error);
}
```

### 12.3 Migration Guide (Draft)

**From v1.x (Playwright) to v2.0 (MCP-First)**

| Old API | New API | Notes |
|:---|:---|:---|
| `import { goto, extract } from '@smite/browser-automation'` | `import { readUrl } from '@smite/browser-automation'` | `readUrl()` returns markdown, not DOM |
| `search(query, 'google')` | `search({ query })` | Structured options, no engine limitation |
| `screenshot(path)` | `analyzeImage(path, prompt)` | AI understanding, not just save |
| N/A | `analyzeGitHub(owner, repo)` | New capability |
| N/A | `uiToArtifact(path, 'code')` | New capability |

**Breaking Changes**:
- Playwright no longer required (optional peer dependency)
- `click()` and `fill()` removed (use E2E testing tools)
- `interactive()` mode removed (use browser dev tools)
- Return types changed to `Result<T, E>` pattern

**Migration Steps**:
1. Update imports to use new convenience functions
2. Replace selector-based extraction with markdown parsing
3. Use `analyzeImage()` instead of just saving screenshots
4. Remove dependencies on `click()` and `fill()`
5. Update error handling to use `Result<T, E>` pattern

---

**Document Status**: ✅ Complete
**Next Steps**: Implementation Phase 1 (Foundation)
**Owner**: SMITE Builder Agent
**Reviewers**: SMITE Architect Agent, SMITE Finalize Agent
