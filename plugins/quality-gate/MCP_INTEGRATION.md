# MCP Scribe Integration

## Overview

The Quality Gate now integrates with the **Docs Editor MCP** server to automatically maintain project documentation. This creates a complete Super-Hook pipeline:

```
Code → Critique (with retry) → Test → Docs → Complete
```

## Features

### Automatic Documentation Updates

When code changes pass quality validation, the system automatically:

1. **Updates OpenAPI Specifications** - Detects route changes and syncs OpenAPI/Swagger specs
2. **Updates README Architecture** - Maintains architecture sections with dependency graphs
3. **Generates JSDoc** - Adds inline documentation to TypeScript/JavaScript files

### Non-Blocking Design

Documentation updates are **non-blocking** - failures don't prevent code completion:
- MCP errors are logged but don't fail the validation
- System continues to work even if MCP server is unavailable
- Graceful degradation if documentation tools fail

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Judge                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Complexity  │  │   Security   │  │      Tests       │  │
│  │   Analyzer   │  │   Scanner    │  │     Runner       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                            │                                 │
│                            ▼                                 │
│                     ┌─────────────┐                         │
│                     │   Decision  │                         │
│                     └─────────────┘                         │
│                            │                                 │
│                     allow? │                                 │
│                     ┌──────┴──────┐                          │
│                     │             │                          │
│                  Yes│             │No                        │
│                     ▼             ▼                          │
│            ┌────────────┐  ┌─────────────┐                  │
│            │ DocTrigger │  │    Retry    │                  │
│            └────────────┘  └─────────────┘                  │
│                   │                                            │
│                   ▼                                            │
│          ┌────────────────┐                                    │
│          │   MCP Client    │                                    │
│          └────────────────┘                                    │
│                   │                                            │
│                   ▼                                            │
│          ┌──────────────────────────────────────┐              │
│          │      Docs Editor MCP Server          │              │
│          │  - sync_openapi_spec                 │              │
│          │  - update_readme_architecture        │              │
│          │  - generate_jsdoc_on_fly             │              │
│          └──────────────────────────────────────┘              │
└───────────────────────────────────────────────────────────────┘
```

### Modules

#### 1. MCP Client (`src/mcp-client.ts`)

Manages connection and communication with the Docs Editor MCP server.

**Key Features:**
- Stdio transport for local MCP server communication
- Tool calling with proper error handling
- Connection state management
- Structured result parsing

**Methods:**
- `connect()` - Connect to MCP server via stdio
- `callTool()` - Generic tool invocation
- `syncOpenAPISpec()` - Call OpenAPI sync tool
- `updateReadmeArchitecture()` - Call README update tool
- `generateJSDoc()` - Call JSDoc generation tool
- `close()` - Graceful shutdown

#### 2. Documentation Trigger (`src/doc-trigger.ts`)

Determines which documentation tools to trigger based on file changes.

**Key Features:**
- Pattern matching for file change detection
- Configurable trigger rules
- Batch action execution
- Non-blocking error handling

**Trigger Logic:**

| Tool | Trigger Pattern | Example Files |
|------|----------------|---------------|
| **OpenAPI Sync** | Route files changed | `routes/*.ts`, `api/*.ts`, `pages/api/*.ts` |
| **README Update** | Core modules changed | `src/*.ts`, `lib/*.ts`, `package.json` |
| **JSDoc Generation** | Source files changed | `*.ts`, `*.tsx`, `*.js`, `*.jsx` |

**Methods:**
- `analyzeTriggers()` - Determine which tools to call based on changes
- `executeActions()` - Execute documentation actions via MCP
- `setMCPClient()` - Set MCP client reference

#### 3. Judge Integration (`src/judge.ts`)

Integrated MCP triggering into the main validation orchestrator.

**Changes:**
- Added `mcpClient` and `docTrigger` instances
- Track changed files across validations
- Initialize MCP integration on first validation (lazy loading)
- Trigger documentation updates after successful validation
- Non-blocking error handling

## Configuration

### Enable MCP Integration

Add to your `.smite/quality.json`:

```json
{
  "mcp": {
    "enabled": true,
    "serverPath": "./node_modules/@smite/docs-editor-mcp/dist/index.js",
    "triggers": {
      "openAPI": {
        "enabled": true,
        "filePatterns": [
          "**/routes/**/*.ts",
          "**/api/**/*.ts",
          "**/controllers/**/*.ts",
          "**/pages/api/**/*.ts"
        ],
        "frameworks": ["express", "nextjs"]
      },
      "readme": {
        "enabled": true,
        "filePatterns": [
          "**/src/**/*.ts",
          "**/lib/**/*.ts",
          "**/core/**/*.ts",
          "package.json"
        ]
      },
      "jsdoc": {
        "enabled": true,
        "filePatterns": [
          "**/*.ts",
          "**/*.tsx",
          "**/*.js",
          "**/*.jsx"
        ]
      }
    }
  }
}
```

### Configuration Options

#### `mcp.enabled`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable/disable MCP integration

#### `mcp.serverPath`
- **Type:** `string`
- **Default:** `"./node_modules/@smite/docs-editor-mcp/dist/index.js"`
- **Description:** Path to the Docs Editor MCP server entry point

#### `mcp.triggers.openAPI.enabled`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable OpenAPI spec synchronization

#### `mcp.triggers.openAPI.filePatterns`
- **Type:** `string[]`
- **Default:** Route file patterns
- **Description:** Glob patterns matching API route files

#### `mcp.triggers.openAPI.frameworks`
- **Type:** `string[]`
- **Default:** `["express", "nextjs"]`
- **Description:** Frameworks to scan for routes

#### `mcp.triggers.readme.enabled`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable README architecture updates

#### `mcp.triggers.readme.filePatterns`
- **Type:** `string[]`
- **Default:** Core module patterns
- **Description:** Glob patterns matching files that trigger README updates

#### `mcp.triggers.jsdoc.enabled`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable JSDoc generation

#### `mcp.triggers.jsdoc.filePatterns`
- **Type:** `string[]`
- **Default:** Source file patterns
- **Description:** Glob patterns matching files that need JSDoc

## Installation

### 1. Install Dependencies

The MCP SDK is already included in `package.json`:

```bash
npm install
```

### 2. Build the Project

```bash
npm run build
```

### 3. Configure MCP

Edit `.smite/quality.json` and set `mcp.enabled: true`

### 4. Start Using

The integration will automatically activate on the next code validation.

## Usage Example

### Workflow

1. **Developer writes code:**
   ```typescript
   // src/api/users.ts
   export async function getUser(id: string) {
     return { id, name: 'John' };
   }
   ```

2. **Quality Gate validates:**
   - Complexity analysis: Pass ✓
   - Security scan: Pass ✓
   - Semantic checks: Pass ✓
   - Tests: Pass ✓

3. **Documentation updates automatically:**
   - OpenAPI spec updated with new endpoint
   - README architecture section updated
   - JSDoc added to function

4. **Code completion:**
   ```
   ✓ Code quality validation passed
   ✓ Documentation updated
   → Ready to commit
   ```

## Logging

All MCP operations are logged with structured information:

```typescript
// Initialization
[judge] Initializing MCP integration
[MCP Client] Connected to server with tools: sync_openapi_spec, update_readme_architecture, generate_jsdoc_on_fly
[judge] MCP integration initialized successfully

// Trigger analysis
[DocTrigger] Analyzing 5 changed files for documentation triggers
[DocTrigger] OpenAPI sync triggered by 2 route file(s)
[DocTrigger] Found 3 documentation actions to trigger

// Execution
[DocTrigger] Executing 3 documentation action(s)
[MCP Client] Calling tool: sync_openapi_spec { projectPath: '/path/to/project', frameworks: ['express', 'nextjs'] }
[MCP Client] Tool sync_openapi_spec succeeded: { success: true, endpointsFound: 12, endpointsAdded: 2 }
[DocTrigger] ✓ sync_openapi_spec succeeded

// Completion
[DocTrigger] All documentation actions completed
```

## Error Handling

### Non-Blocking Errors

All documentation failures are non-blocking:

```typescript
try {
  await this.docTrigger.executeActions(actions);
} catch (error) {
  // Log error but don't fail validation
  this.logger.warn('judge', `Documentation update failed: ${error}`);
}
```

### Common Issues

**Issue:** MCP server not found
- **Log:** `Failed to connect to MCP server`
- **Impact:** System continues without documentation updates
- **Fix:** Check `serverPath` in configuration

**Issue:** Tool execution timeout
- **Log:** `Tool sync_openapi_spec failed: timeout`
- **Impact:** That specific tool fails, others continue
- **Fix:** Check MCP server logs, increase timeout if needed

**Issue:** Invalid file patterns
- **Log:** `No documentation triggers matched`
- **Impact:** No updates triggered (not an error)
- **Fix:** Adjust `filePatterns` in configuration

## Troubleshooting

### MCP Integration Not Working

1. **Check configuration:**
   ```bash
   cat .smite/quality.json | grep mcp -A 20
   ```

2. **Verify MCP server installed:**
   ```bash
   ls node_modules/@smite/docs-editor-mcp/dist/index.js
   ```

3. **Check logs:**
   ```bash
   # Look for MCP initialization logs
   tail -f ~/.smite/logs/quality-gate.log | grep -i mcp
   ```

### Documentation Not Updating

1. **Verify triggers match:**
   - Check file patterns in configuration
   - Ensure changed files match patterns

2. **Check MCP server health:**
   ```bash
   # Test MCP server directly
   node node_modules/@smite/docs-editor-mcp/dist/index.js
   ```

3. **Review tool results:**
   - Check logs for tool execution results
   - Verify tool returned success

## Development

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
npm run typecheck
```

### Debugging

Enable debug logging in `.smite/quality.json`:

```json
{
  "logLevel": "debug"
}
```

## References

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Docs Editor MCP Server](../docs-editor-mcp/README.md)

## License

MIT
