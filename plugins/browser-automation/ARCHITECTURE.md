# Browser Automation Plugin - Architecture Documentation

**Version:** 2.0.0
**Status:** Production
**Last Updated:** 2026-01-20

---

## Table of Contents

- [Overview](#overview)
- [Design Philosophy](#design-philosophy)
- [Architecture Layers](#architecture-layers)
- [MCP Server Integration](#mcp-server-integration)
- [Data Flow](#data-flow)
- [Component Details](#component-details)
- [Error Handling Strategy](#error-handling-strategy)
- [Performance Considerations](#performance-considerations)
- [Extensibility](#extensibility)
- [Technical Decisions](#technical-decisions)

---

## Overview

### What is this plugin?

The Browser Automation plugin is a **lightweight, MCP-first** orchestration layer that provides AI-powered browser automation capabilities without the overhead of traditional browser automation tools like Playwright or Puppeteer.

### Key Characteristics

- **MCP-First**: Leverages Model Context Protocol servers for core capabilities
- **Lightweight**: Zero browser dependencies, instant startup
- **Agent-Optimized**: Designed for AI agent consumption
- **Type-Safe**: Full TypeScript with Zod validation
- **Composable**: Features combine into complex workflows
- **Layered**: Clear separation of concerns across 4 architectural layers

### Why MCP-First?

| Traditional (Playwright) | MCP-First |
|:---|:---|
| Browser installation (100-300MB) | Zero dependencies |
| Slow startup (2-5 seconds) | Instant startup (<0.1s) |
| DOM manipulation only | AI-powered understanding |
| Limited to web content | GitHub + Vision + OCR |
| Scraping-focused | Agent-optimized |
| Complex maintenance | Server-managed updates |

---

## Design Philosophy

### 1. MCP-First Principle

**Default to MCP servers.** Only implement locally if:
- Not possible with existing MCP servers
- Performance requirements exceed MCP capabilities
- Offline operation is critical

### 2. Layered Architecture

Clear separation of concerns with unidirectional data flow:

```
Agent API (Layer 4)
    ↓
Workflows (Layer 3)
    ↓
Features (Layer 2)
    ↓
MCP Wrappers (Layer 1)
    ↓
MCP Servers
```

### 3. Type Safety at Boundaries

- **Zod schemas** at all entry points
- **Result types** for error handling
- **Type inference** from schemas
- **No `any` types** in production code

### 4. Composability Over Inheritance

- Pure functions preferred
- Features compose into workflows
- Workflows compose into complex operations
- No shared mutable state

### 5. Fail Gracefully

- Every MCP call wrapped in error handling
- Meaningful error messages
- Fallback behavior documented
- Timeouts and rate limits handled

---

## Architecture Layers

### Layer 4: Agent API & CLI

**Purpose**: Convenience functions and command-line interface

**Responsibilities**:
- Export public API for agents and developers
- Provide ergonomic function signatures
- CLI command routing
- Input/output transformation

**Location**: `src/index.ts`, `src/cli.ts`

**Example**:

```typescript
// Agent API
export async function searchWeb(query: string, options?: SearchOptions) {
  // Validate input
  const validated = searchOptionsSchema.parse({ query, ...options });

  // Delegate to feature module
  return searchFeature(validated);
}

// CLI command
cli
  .command('search <query>')
  .option('--max-results <n>', 'Maximum results')
  .action(async (query, options) => {
    const result = await searchWeb(query, options);
    console.log(formatOutput(result));
  });
```

**Design Rules**:
- Functions must be ergonomic for agents
- CLI commands map 1:1 with API functions
- Input validation at entry point
- Output formatting separate from logic

---

### Layer 3: Workflow Orchestrator

**Purpose**: Multi-step, intelligent workflows

**Responsibilities**:
- Orchestrate multiple features
- Implement decision trees
- Handle retry logic
- Aggregate results

**Location**: `src/workflows/`

**Example**:

```typescript
export async function researchTopic(
  topic: string,
  options: ResearchOptions
): Promise<Result<ResearchFindings, Error>> {
  const findings = {
    sourcesAnalyzed: 0,
    keyInsights: [],
    codeExamples: [],
    summary: ''
  };

  // Step 1: Initial search
  const searchResults = await searchWeb(topic, {
    maxResults: options.breadth
  });
  if (!searchResults.success) return searchResults;

  // Step 2: Read top results
  const topUrls = searchResults.data.slice(0, options.depth);
  const readResults = await batchRead(topUrls.map(r => r.url));
  if (!readResults.success) return readResults;

  // Step 3: Extract insights
  findings.sourcesAnalyzed = readResults.results.length;
  findings.keyInsights = extractInsights(readResults.results);

  // Step 4: Search GitHub for examples
  if (options.sources.includes('github')) {
    const githubResults = await searchGithub(topic);
    findings.codeExamples = githubResults.data;
  }

  return { success: true, data: findings };
}
```

**Design Rules**:
- Workflows are composable (can use other workflows)
- Each step handles its own errors
- Progress tracking for long operations
- Results aggregated at end

---

### Layer 2: Feature Modules

**Purpose**: Domain-specific capabilities

**Responsibilities**:
- Implement business logic for specific domains
- Coordinate multiple MCP calls
- Domain-specific data transformation
- Feature-level error handling

**Location**: `src/features/`

**Modules**:

#### Search Module (`src/features/search/`)

```typescript
export async function searchWeb(
  query: string,
  options?: SearchOptions
): Promise<Result<SearchResults[], Error>> {
  // Validate input
  const validated = searchOptionsSchema.parse({ query, ...options });

  // Call MCP wrapper
  const mcpResult = await callWebSearchPrime({
    search_query: validated.query,
    search_recency_filter: validated.timeRange,
    search_domain_filter: validated.domainFilter,
    content_size: validated.contentSize,
    location: validated.location
  });

  if (!mcpResult.success) {
    return mcpResult; // MCP errors are already Result types
  }

  // Transform results (feature logic)
  const results = transformSearchResults(mcpResult.data);

  return { success: true, data: results };
}
```

#### Read Module (`src/features/read/`)

```typescript
export async function readWebPage(
  url: string,
  options?: ReadOptions
): Promise<Result<PageContent, Error>> {
  // Validate URL
  const validated = readOptionsSchema.parse({ url, ...options });

  // Call MCP wrapper
  const mcpResult = await callWebReader({
    url: validated.url,
    timeout: validated.timeout,
    retain_images: validated.retainImages,
    with_images_summary: validated.withImagesSummary,
    with_links_summary: validated.withLinksSummary,
    return_format: validated.returnFormat,
    no_cache: !validated.useCache
  });

  if (!mcpResult.success) {
    return mcpResult;
  }

  // Parse content
  const content = parseMarkdownContent(mcpResult.data);

  return { success: true, data: content };
}
```

#### Vision Module (`src/features/vision/`)

```typescript
export async function analyzeImage(
  source: ImageSource,
  prompt: string
): Promise<Result<string, Error>> {
  // Validate inputs
  const validated = imageAnalysisSchema.parse({ source, prompt });

  // Call appropriate MCP tool based on prompt type
  const tool = determineVisionTool(validated.prompt);

  const mcpResult = await callZaiMcpTool(tool, {
    image_source: validated.source,
    prompt: validated.prompt
  });

  if (!mcpResult.success) {
    return mcpResult;
  }

  return { success: true, data: mcpResult.data };
}
```

#### Repository Module (`src/features/repo/`)

```typescript
export async function getRepoStructure(
  repo: string,
  path?: string
): Promise<Result<RepoStructure, Error>> {
  // Validate repo format
  const validated = repoSchema.parse({ repo, path });

  // Call GitHub API via MCP (if available) or direct API
  const structure = await fetchRepoStructure(
    validated.repo,
    validated.path
  );

  if (!structure.success) {
    return structure;
  }

  // Transform to domain model
  return { success: true, data: formatRepoStructure(structure.data) };
}
```

**Design Rules**:
- One feature per file/module
- Pure business logic (no CLI concerns)
- Return Result types always
- Handle domain-specific errors

---

### Layer 1: MCP Client Wrappers

**Purpose**: Type-safe MCP server communication

**Responsibilities**:
- Wrap MCP server calls
- Input/output transformation
- MCP-specific error handling
- Type safety with Zod schemas

**Location**: `src/mcp/`

**Example**:

```typescript
// src/mcp/web-search.ts
import { z } from 'zod';
import { callMcpTool } from './client';

// Zod schema for MCP parameters
export const webSearchParamsSchema = z.object({
  search_query: z.string().min(1),
  search_recency_filter: z.enum(['oneDay', 'oneWeek', 'oneMonth', 'oneYear', 'noLimit']).optional(),
  search_domain_filter: z.string().optional(),
  content_size: z.enum(['medium', 'high']).optional(),
  location: z.enum(['cn', 'us']).optional()
});

// Type-safe wrapper
export async function callWebSearchPrime(
  args: z.infer<typeof webSearchParamsSchema>
): Promise<Result<WebSearchResults, McpError>> {
  // Validate input
  const validated = webSearchParamsSchema.parse(args);

  // Call MCP server
  try {
    const result = await callMcpTool(
      'web-search-prime',          // MCP server name
      'webSearchPrime',            // Tool name
      validated                    // Parameters
    );

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: new McpError('Web search failed', error)
    };
  }
}
```

**Design Rules**:
- One file per MCP server
- Zod schema for all parameters
- Always return Result type
- MCP errors converted to domain errors

---

## MCP Server Integration

### Available MCP Servers

#### 1. web-reader (`mcp__web-reader__webReader`)

**Purpose**: Fetch URLs and convert to markdown

**Wrapper**: `src/mcp/web-reader.ts`

**Schema**:

```typescript
export const webReaderParamsSchema = z.object({
  url: z.string().url(),
  timeout: z.number().min(1).default(20),
  retain_images: z.boolean().default(true),
  with_images_summary: z.boolean().default(false),
  with_links_summary: z.boolean().default(false),
  return_format: z.enum(['markdown', 'text']).default('markdown'),
  no_cache: z.boolean().default(false)
});
```

**Use Cases**:
- Static content extraction
- Blog posts and documentation
- API response parsing
- Content aggregation

**Limitations**:
- No JavaScript execution
- No authentication handling
- Requires public URLs

---

#### 2. web-search-prime (`mcp__web-search-prime__webSearchPrime`)

**Purpose**: Web search with structured results

**Wrapper**: `src/mcp/web-search.ts`

**Schema**:

```typescript
export const webSearchPrimeParamsSchema = z.object({
  search_query: z.string().min(1).max(70),
  search_recency_filter: z.enum(['oneDay', 'oneWeek', 'oneMonth', 'oneYear', 'noLimit']),
  search_domain_filter: z.string().optional(),
  content_size: z.enum(['medium', 'high']),
  location: z.enum(['cn', 'us']).default('us')
});
```

**Use Cases**:
- Research and discovery
- Finding recent information
- Competitive analysis
- Trend identification

**Limitations**:
- Rate limited (~1 req/sec)
- Search engine dependent
- Result count varies

---

#### 3. zai-mcp-server (`mcp__zai-mcp-server__*`)

**Purpose**: Multi-modal AI vision and analysis

**Wrapper**: `src/mcp/zai-mcp.ts`

**Tools**:

| Tool | Purpose |
|:---|:---|
| `analyze_image` | General image understanding |
| `ui_to_artifact` | Convert UI to code/spec/prompt |
| `extract_text_from_screenshot` | OCR with code recognition |
| `diagnose_error_screenshot` | Error message analysis |
| `analyze_video` | Video content understanding |
| `analyze_data_visualization` | Chart/graph insights |
| `ui_diff_check` | Visual regression testing |
| `understand_technical_diagram` | Architecture/flowchart understanding |

**Schema Example**:

```typescript
export const analyzeImageParamsSchema = z.object({
  image_source: z.string(), // URL or file path
  prompt: z.string().min(1)
});
```

**Use Cases**:
- Screenshot analysis
- UI understanding and replication
- OCR and code extraction
- Visual regression testing
- Documentation from images

**Limitations**:
- Requires image file paths or URLs
- Processing time varies (3-10 seconds)
- Rate limited

---

### MCP Client Architecture

**Core Client** (`src/mcp/client.ts`):

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Singleton MCP clients
const mcpClients = new Map<string, Client>();

export async function getMcpClient(serverName: string): Promise<Client> {
  if (mcpClients.has(serverName)) {
    return mcpClients.get(serverName)!;
  }

  // Initialize new client
  const client = new Client({
    name: `browser-automation-${serverName}`,
    version: '2.0.0'
  });

  const transport = new StdioClientTransport({
    command: getServerCommand(serverName),
    args: getServerArgs(serverName)
  });

  await client.connect(transport);
  mcpClients.set(serverName, client);

  return client;
}

export async function callMcpTool<T>(
  serverName: string,
  toolName: string,
  args: Record<string, unknown>
): Promise<T> {
  const client = await getMcpClient(serverName);

  const result = await client.callTool({
    name: toolName,
    arguments: args
  });

  if (result.isError) {
    throw new McpError(result.content[0].text);
  }

  return result.content as T;
}
```

---

## Data Flow

### Example: Web Search Request

```
User/Agent
    │
    │ searchWeb("TypeScript 5", { timeRange: "oneWeek" })
    ↓
Layer 4: Agent API (src/index.ts)
    │  • Input validation with Zod
    │  • Type transformation
    ↓
Layer 2: Feature Module (src/features/search/web-search.ts)
    │  • Business logic
    │  • Domain-specific transformation
    ↓
Layer 1: MCP Wrapper (src/mcp/web-search.ts)
    │  • MCP parameter schema validation
    │  • Server call orchestration
    ↓
MCP Server: web-search-prime
    │  • Execute search
    │  • Return structured results
    ↓
Layer 1: MCP Wrapper
    │  • Error handling
    │  • Result type conversion
    ↓
Layer 2: Feature Module
    │  • Result transformation
    │  • Domain logic application
    ↓
Layer 4: Agent API
    │  • Output formatting
    ↓
User/Agent receives Result<SearchResults[], Error>
```

### Example: Research Workflow

```
User/Agent
    │
    │ researchTopic("React 19", { depth: 3, breadth: 5 })
    ↓
Layer 4: Agent API
    ↓
Layer 3: Workflow Orchestrator (src/workflows/research.ts)
    │
    ├─→ searchWeb("React 19", { maxResults: 5 })
    │   ↓ (Layer 2 → Layer 1 → MCP)
    │   Returns: 5 search results
    │
    ├─→ batchRead([url1, url2, url3, url4, url5])
    │   ↓ (Layer 2 → Layer 1 → MCP)
    │   Returns: 5 page contents
    │
    ├─→ Extract insights from pages
    │   ↓ (Layer 3: Workflow logic)
    │   Returns: 10 key insights
    │
    ├─→ searchGithub("React 19", examples)
    │   ↓ (Layer 2 → GitHub API)
    │   Returns: 3 code examples
    │
    └─→ Aggregate findings
        Returns: ResearchFindings {
          sourcesAnalyzed: 8,
          keyInsights: [...],
          codeExamples: [...],
          summary: "..."
        }
    ↓
Layer 4: Agent API
    ↓
User/Agent receives Result<ResearchFindings, Error>
```

---

## Component Details

### Type System

#### Result Type

All functions return `Result<T, E>`:

```typescript
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (isSuccess(result)) {
    return result.data;
  }
  throw result.error;
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isSuccess(result) ? result.data : defaultValue;
}
```

#### Zod Schemas

Schemas defined for all external input:

```typescript
// src/types/search.ts
export const searchOptionsSchema = z.object({
  query: z.string().min(1).max(1000),
  maxResults: z.number().min(1).max(50).optional(),
  timeRange: z.enum(['oneDay', 'oneWeek', 'oneMonth', 'oneYear', 'noLimit']).optional(),
  domainFilter: z.string().optional(),
  location: z.enum(['cn', 'us']).optional(),
  contentSize: z.enum(['medium', 'high']).optional()
});

export type SearchOptions = z.infer<typeof searchOptionsSchema>;
```

#### Feature Types

Domain-specific types:

```typescript
// src/types/results.ts
export interface SearchResult {
  title: string;
  url: string;
  summary: string;
  favicon?: string;
  siteName?: string;
  publishedDate?: string;
}

export interface PageContent {
  url: string;
  content: string;
  images?: string[];
  links?: LinkSummary[];
  metadata?: {
    title: string;
    author?: string;
    date?: string;
  };
}
```

---

### Error Handling Strategy

#### Error Hierarchy

```typescript
// Base error
export class BrowserAutomationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BrowserAutomationError';
  }
}

// MCP-specific errors
export class McpError extends BrowserAutomationError {
  constructor(message: string, public readonly cause?: unknown) {
    super(message, 'MCP_ERROR');
    this.name = 'McpError';
  }
}

export class McpTimeoutError extends McpError {
  constructor(message: string) {
    super(message, 'MCP_TIMEOUT');
    this.name = 'McpTimeoutError';
  }
}

export class McpRateLimitError extends McpError {
  constructor(message: string, public retryAfter?: number) {
    super(message, 'MCP_RATE_LIMIT');
    this.name = 'McpRateLimitError';
  }
}

export class McpConnectionError extends McpError {
  constructor(message: string) {
    super(message, 'MCP_CONNECTION');
    this.name = 'McpConnectionError';
  }
}

// Validation errors
export class ValidationError extends BrowserAutomationError {
  constructor(message: string, public readonly schema: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// Feature-specific errors
export class SearchError extends BrowserAutomationError {
  constructor(message: string) {
    super(message, 'SEARCH_ERROR');
  }
}

export class ReadError extends BrowserAutomationError {
  constructor(message: string, public readonly url?: string) {
    super(message, 'READ_ERROR');
  }
}
```

#### Error Handling Pattern

```typescript
export async function robustMcpCall<T>(
  serverName: string,
  toolName: string,
  args: Record<string, unknown>,
  options: { timeout?: number; retries?: number } = {}
): Promise<Result<T, Error>> {
  const { timeout = 30000, retries = 2 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await Promise.race([
        callMcpTool<T>(serverName, toolName, args),
        timeoutAfter(timeout)
      ]);

      return { success: true, data: result };

    } catch (error) {
      if (error instanceof McpTimeoutError) {
        // Retry with longer timeout
        if (attempt < retries) {
          await delay(1000 * (attempt + 1));
          continue;
        }
        return {
          success: false,
          error: new McpTimeoutError(`Timeout after ${timeout}ms`)
        };
      }

      if (error instanceof McpRateLimitError) {
        // Wait and retry
        if (attempt < retries) {
          const delay = error.retryAfter || 5000;
          await sleep(delay);
          continue;
        }
        return {
          success: false,
          error: error
        };
      }

      if (error instanceof McpConnectionError) {
        // MCP server unavailable
        return {
          success: false,
          error: new McpConnectionError('MCP server not available. Check your connection.')
        };
      }

      // Unknown error
      return {
        success: false,
        error: new McpError('MCP call failed', error)
      };
    }
  }

  return {
    success: false,
    error: new McpError('Max retries exceeded')
  };
}
```

---

## Performance Considerations

### 1. Concurrency

Batch operations use controlled concurrency:

```typescript
export async function batchRead(
  urls: string[],
  options: { concurrency?: number } = {}
): Promise<Result<BatchResult<PageContent>, Error>> {
  const { concurrency = 5 } = options;

  const results: Array<Result<PageContent, Error>> = [];

  // Process in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(url => readWebPage(url))
    );
    results.push(...batchResults);
  }

  return { success: true, data: { results } };
}
```

### 2. Caching

MCP web-reader has built-in caching:

```typescript
export async function readWebPage(
  url: string,
  options: ReadOptions = {}
) {
  // Default: use cache
  const useCache = options.useCache ?? true;

  return callWebReader({
    url,
    no_cache: !useCache  // Disable for fresh data
  });
}
```

### 3. Timeout Management

Progressive timeouts for long operations:

```typescript
export async function researchTopic(
  topic: string,
  options: ResearchOptions
) {
  // Quick operations: 10s timeout
  const searchResults = await withTimeout(
    searchWeb(topic, { maxResults: options.breadth }),
    10000
  );

  // Medium operations: 30s timeout
  const readResults = await withTimeout(
    batchRead(urls),
    30000
  );

  // Long operations: 60s timeout
  const githubResults = await withTimeout(
    searchGithub(topic),
    60000
  );
}
```

### 4. Memory Management

Stream processing for large results:

```typescript
export async function* searchStream(
  query: string
): AsyncGenerator<SearchResult> {
  const result = await searchWeb(query, { maxResults: 100 });

  if (!result.success) {
    throw result.error;
  }

  // Yield results one at a time
  for (const item of result.data) {
    yield item;
  }
}
```

---

## Extensibility

### Adding a New MCP Server

1. **Create wrapper** in `src/mcp/[server-name].ts`:

```typescript
export const newServerSchema = z.object({
  param1: z.string(),
  param2: z.number().optional()
});

export async function callNewServer(
  args: z.infer<typeof newServerSchema>
): Promise<Result<NewServerResponse, McpError>> {
  const validated = newServerSchema.parse(args);

  try {
    const result = await callMcpTool(
      'new-server',
      'tool_name',
      validated
    );

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: new McpError('New server call failed', error)
    };
  }
}
```

2. **Export** from `src/mcp/index.ts`:

```typescript
export { callNewServer } from './new-server';
export type { NewServerResponse } from './new-server';
```

3. **Create feature** in `src/features/new-feature/`:

```typescript
export async function newFeature(
  input: string
): Promise<Result<FeatureOutput, Error>> {
  const result = await callNewServer({ param1: input });

  if (!result.success) {
    return result;
  }

  // Feature logic
  const output = transformResult(result.data);

  return { success: true, data: output };
}
```

4. **Export** from `src/index.ts`:

```typescript
export { newFeature } from './features/new-feature';
```

---

## Technical Decisions

### Why Result Types Instead of Exceptions?

**Decision**: Use `Result<T, E>` instead of throwing errors

**Rationale**:
- **Explicit error handling**: Callers must handle errors
- **Type-safe**: TypeScript discriminates `success: true/false`
- **Composable**: Can chain results without try/catch
- **Better for agents**: Agents can inspect result and decide

**Example**:

```typescript
// With Result type
const result = await searchWeb(query);
if (result.success) {
  return result.data;
} else {
  // Handle error explicitly
  return { error: result.error.message };
}

// With exceptions (NOT used)
try {
  const data = await searchWeb(query);
  return data;
} catch (error) {
  // Easy to forget to handle
  return { error: error.message };
}
```

---

### Why Zod for Validation?

**Decision**: Parse, don't validate with Zod

**Rationale**:
- **Type inference**: Generate types from schemas
- **Runtime validation**: Validate at entry points
- **Error messages**: Zod provides detailed errors
- **Documentation**: Schemas serve as documentation

**Example**:

```typescript
// Single source of truth
const searchSchema = z.object({
  query: z.string().min(1).max(1000),
  maxResults: z.number().min(1).max(50).optional()
});

// Type inferred from schema
type SearchOptions = z.infer<typeof searchSchema>;

// Runtime validation
function searchWeb(options: unknown) {
  const validated = searchSchema.parse(options); // Throws if invalid
  // TypeScript knows validated is SearchOptions
}
```

---

### Why Layered Architecture?

**Decision**: 4 distinct layers with unidirectional flow

**Rationale**:
- **Separation of concerns**: Each layer has clear responsibility
- **Testability**: Test each layer independently
- **Composability**: Features combine into workflows
- **Maintainability**: Changes isolated to specific layers

**Anti-pattern avoided**: Monolithic functions that do everything

```typescript
// Bad: All concerns in one function
async function searchAndReadAndAnalyze(query: string) {
  // MCP calls
  // Business logic
  // Workflow orchestration
  // CLI formatting
  // All mixed together!
}

// Good: Separated across layers
async function searchWeb(query: string)           // Layer 2
async function batchRead(urls: string[])          // Layer 2
async function researchTopic(query: string)       // Layer 3
async function cliCommand(query: string)          // Layer 4
```

---

### Why MCP-First?

**Decision**: Default to MCP servers, implement locally only if necessary

**Rationale**:
- **Leverage existing infrastructure**: z.ai maintains MCP servers
- **Reduced maintenance**: Server updates are automatic
- **More capabilities**: Vision, OCR, GitHub not possible with Playwright
- **Better performance**: No browser startup overhead

**Trade-off**: Dependency on external MCP servers

**Mitigation**:
- Graceful fallback when servers unavailable
- Clear error messages
- Documentation of server requirements

---

## Future Enhancements

### Planned Architecture Improvements

1. **MCP Server Pooling**: Reuse connections for better performance
2. **Result Caching**: Cache frequently accessed content
3. **Streaming Support**: Stream large results progressively
4. **Offline Mode**: Cache critical data for limited offline operation
5. **Custom MCP Servers**: Allow users to register custom MCP servers

### Extensibility Roadmap

1. **Plugin System**: Allow third-party feature modules
2. **Custom Workflows**: Users can define custom workflows
3. **Middleware**: Add hooks for request/response processing
4. **Metrics**: Performance monitoring and analytics
5. **Retry Strategies**: Configurable retry policies per operation

---

## Documentation

### Related Documentation

- [README.md](./README.md) - User-facing documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- [.smite/browser-automation-architecture.md](./.smite/browser-automation-architecture.md) - Detailed technical decisions
- [Agent API Guide](./AGENT_API_GUIDE.md) - Agent integration patterns

### Code Documentation

- **JSDoc comments**: All public APIs documented
- **Type definitions**: All types exported and documented
- **Examples**: README contains usage examples
- **Architecture comments**: Complex logic explained inline

---

## Conclusion

This architecture prioritizes:
- **Simplicity**: Clear layers, minimal complexity
- **Type Safety**: TypeScript + Zod everywhere
- **Error Handling**: Explicit Result types
- **Performance**: Lightweight, fast startup
- **Extensibility**: Easy to add features/workflows
- **Agent-Friendly**: Designed for AI consumption

The MCP-first approach provides more capabilities with less complexity than traditional browser automation tools.

---

**Last Updated**: 2026-01-20
**Maintainer**: @pamacea
**License**: MIT
