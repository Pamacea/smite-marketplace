# Docs Editor MCP - Tools Reference

**Complete reference for all MCP tools provided by the Docs Editor server.**

---

## Table of Contents

- [Overview](#overview)
- [sync_openapi_spec](#sync_openapi_spec)
- [update_readme_architecture](#update_readme_architecture)
- [generate_jsdoc_on_fly](#generate_jsdoc_on_fly)
- [Integration Examples](#integration-examples)
- [Error Handling](#error-handling)

---

## Overview

The Docs Editor MCP server provides three main tools for automatic documentation maintenance:

1. **sync_openapi_spec**: Scan API routes and generate/update OpenAPI specifications
2. **update_readme_architecture**: Update README sections based on project structure
3. **generate_jsdoc_on_fly**: Generate JSDoc comments for TypeScript/JavaScript code

### Server Configuration

**Location:** `plugins/docs-editor-mcp/dist/index.js`

**Start Server:**
```bash
node dist/index.js
```

**Connection:** stdio (Model Context Protocol)

---

## sync_openapi_spec

Scans route definitions and updates OpenAPI/Swagger specification files.

### Description

Automatically detects API endpoints from route definitions and generates or updates OpenAPI specifications. Supports Express.js and Next.js frameworks.

### Parameters

```typescript
{
  projectPath: string;                    // Required
  configPath?: string;                    // Optional, default: ".smite/scribe-config.json"
  outputFormat?: 'json' | 'yaml';         // Optional, default: "json"
  outputPath?: string;                    // Optional, default: "openapi.json"
  generateDiff?: boolean;                 // Optional, default: false
  force?: boolean;                        // Optional, default: false
  frameworks?: Array<string>;             // Optional, default: ["express", "nextjs"]
  title?: string;                         // Optional, default: "API Documentation"
  version?: string;                       // Optional, default: "1.0.0"
}
```

### Parameter Details

#### projectPath (Required)

**Type:** `string`
**Description:** Root directory of the project to scan

**Example:** `/Users/username/projects/my-api`

#### configPath (Optional)

**Type:** `string`
**Default:** `.smite/scribe-config.json`
**Description:** Path to scribe configuration file

#### outputFormat (Optional)

**Type:** `'json' | 'yaml'`
**Default:** `'json'`
**Description:** Output format for OpenAPI specification

#### outputPath (Optional)

**Type:** `string`
**Default:** `'openapi.json'`
**Description:** Output file path (relative to projectPath or absolute)

**Example:** `docs/api-spec.json`

#### generateDiff (Optional)

**Type:** `boolean`
**Default:** `false`
**Description:** Generate diff preview before applying changes

#### force (Optional)

**Type:** `boolean`
**Default:** `false`
**Description:** Force update even if no changes detected

#### frameworks (Optional)

**Type:** `Array<'express' | 'nextjs' | 'fastapi' | 'nestjs'>`
**Default:** `['express', 'nextjs']`
**Description:** Frameworks to scan for routes

**Supported Frameworks:**
- `express`: Express.js routes
- `nextjs`: Next.js API routes (App Router, Pages API)
- `fastapi`: (not yet implemented)
- `nestjs`: (not yet implemented)

#### title (Optional)

**Type:** `string`
**Default:** `'API Documentation'`
**Description:** API title for OpenAPI spec

#### version (Optional)

**Type:** `string`
**Default:** `'1.0.0'`
**Description:** API version for OpenAPI spec

### Return Value

```typescript
{
  success: boolean;
  endpointsFound: number;
  endpointsAdded: number;
  endpointsUpdated: number;
  endpointsRemoved: number;
  diff?: string;                          // If generateDiff: true
  outputPath: string;
  warnings?: string[];                    // If unsupported frameworks requested
  errors?: string[];                      // If operation failed
}
```

### Usage Examples

#### Basic Usage

```typescript
const result = await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/project'
  }
});

console.log(result);
// {
//   success: true,
//   endpointsFound: 15,
//   endpointsAdded: 3,
//   endpointsUpdated: 2,
//   endpointsRemoved: 1,
//   outputPath: 'openapi.json'
// }
```

#### With Custom Output Path

```typescript
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/project',
    outputPath: 'docs/api/openapi.yaml',
    outputFormat: 'yaml'
  }
});
```

#### Generate Diff Preview

```typescript
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/project',
    generateDiff: true
  }
});

// Result includes diff:
// {
//   success: true,
//   endpointsFound: 15,
//   diff: "+ POST /users\n- PUT /users/:id/old"
// }
```

#### Express.js Framework

```typescript
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/express-app',
    frameworks: ['express'],
    title: 'My Express API',
    version: '2.0.0'
  }
});
```

#### Next.js Framework

```typescript
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/nextjs-app',
    frameworks: ['nextjs'],
    outputPath: 'docs/api-spec.json'
  }
});
```

### Route Detection

#### Express.js Routes

**Supported Patterns:**
```typescript
// app.get()
app.get('/users', async (req, res) => {});

// router.post()
router.post('/users', async (req, res) => {});

// Chained routes
router.route('/users/:id')
  .get(async (req, res) => {})
  .put(async (req, res) => {})
  .delete(async (req, res) => {});

// Middleware
app.use('/api/v1', apiRouter);
```

**Generated OpenAPI:**
```json
{
  "openapi": "3.0.0",
  "paths": {
    "/users": {
      "get": {
        "summary": "GET /users",
        "responses": { "200": { "description": "Success" } }
      },
      "post": {
        "summary": "POST /users",
        "responses": { "201": { "description": "Created" } }
      }
    },
    "/users/{id}": {
      "get": { ... },
      "put": { ... },
      "delete": { ... }
    }
  }
}
```

#### Next.js Routes

**App Router (Next.js 13+):**
```
app/
├── api/
│   ├── users/
│   │   ├── route.ts         // GET /api/users, POST /api/users
│   │   └── [id]/
│   │       └── route.ts     // GET /api/users/:id, PATCH /api/users/:id
│   └── posts/
│       └── route.ts         // GET /api/posts, POST /api/posts
```

**Pages API (Next.js 12 and below):**
```
pages/
└── api/
    ├── users/
    │   ├── index.ts         // GET /api/users, POST /api/users
    │   └── [id].ts          // GET /api/users/:id, PUT /api/users/:id, DELETE /api/users/:id
    └── posts/
        └── index.ts         // GET /api/posts
```

### Merge Behavior

The tool intelligently merges generated specs with existing specs:

1. **Preserves manual edits**: Custom descriptions, examples, schemas
2. **Adds new endpoints**: Newly discovered routes
3. **Updates existing endpoints**: Signature changes
4. **Removes deprecated endpoints**: Routes no longer in code
5. **Tracks changes**: Returns add/update/remove counts

### Advanced Usage

#### Custom Configuration File

```typescript
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/project',
    configPath: '.smite/custom-scribe-config.json'
  }
});
```

#### Force Update

```typescript
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: '/path/to/project',
    force: true
  }
});
```

---

## update_readme_architecture

Updates README.md sections based on project structure and dependencies.

### Description

Automatically updates README sections including Installation, Architecture, and Project Structure. Preserves manual edits using special markers.

### Parameters

```typescript
{
  projectPath: string;                              // Required
  readmePath?: string;                              // Optional, default: "README.md"
  sectionsToUpdate?: Array<string>;                 // Optional, default: ["all"]
  generateDiff?: boolean;                           // Optional, default: true
  preserveMarkers?: boolean;                        // Optional, default: true
}
```

### Parameter Details

#### projectPath (Required)

**Type:** `string`
**Description:** Root directory of the project

#### readmePath (Optional)

**Type:** `string`
**Default:** `'README.md'`
**Description:** Path to README file (relative to projectPath)

#### sectionsToUpdate (Optional)

**Type:** `Array<'installation' | 'architecture' | 'structure' | 'all'>`
**Default:** `['all']`
**Description:** Sections to update

**Section Types:**
- `installation`: Installation commands and dependencies
- `architecture`: Architecture overview and framework detection
- `structure`: Project structure (directory tree)
- `all`: All of the above

#### generateDiff (Optional)

**Type:** `boolean`
**Default:** `true`
**Description:** Generate diff preview before applying changes

#### preserveMarkers (Optional)

**Type:** `boolean`
**Default:** `true`
**Description:** Preserve manual edit markers

### Return Value

```typescript
{
  success: boolean;
  sectionsUpdated: string[];                 // Names of updated sections
  dependenciesAdded: number;
  dependenciesUpdated: number;
  dependenciesRemoved: number;
  modulesAdded: number;
  modulesRemoved: number;
  diff?: string;                             // If generateDiff: true
  readmePath: string;
  warnings?: string[];
  errors?: string[];                         // If operation failed
}
```

### Usage Examples

#### Update All Sections

```typescript
await mcpClient.callTool({
  name: 'update_readme_architecture',
  arguments: {
    projectPath: '/path/to/project'
  }
});
```

#### Update Specific Sections

```typescript
await mcpClient.callTool({
  name: 'update_readme_architecture',
  arguments: {
    projectPath: '/path/to/project',
    sectionsToUpdate: ['installation', 'structure']
  }
});
```

#### Custom README Path

```typescript
await mcpClient.callTool({
  name: 'update_readme_architecture',
  arguments: {
    projectPath: '/path/to/project',
    readmePath: 'docs/README.md'
  }
});
```

### Manual Edit Protection

Protect sections from being overwritten:

```markdown
<!-- SMITE:MANUAL:START -->
## Custom Section

This content is manually written and will never be overwritten by auto-generation.
<!-- SMITE:MANUAL:END -->
```

**Auto-generated sections** can still be updated:
```markdown
<!-- SMITE:AUTO -->
## Installation

This section is auto-generated and can be updated.
```

### Section Templates

#### Installation Section

**Generated Content:**
```markdown
## Installation

```bash
npm install
```

### Dependencies

- react: ^18.2.0
- typescript: ^5.3.0
- next: ^14.0.0

### Dev Dependencies

- @types/react: ^18.2.0
- eslint: ^8.55.0
```

#### Architecture Section

**Generated Content:**
```markdown
## Architecture

This project is built with **Next.js 14**.

### Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
```

#### Structure Section

**Generated Content:**
```markdown
## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── users/
│   │       └── route.ts
│   ├── users/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── layout.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── input.tsx
│   └── users/
│       └── UserCard.tsx
├── lib/
│   ├── db.ts
│   └── utils.ts
└── types/
    └── user.ts
```
```

### Framework Detection

The tool automatically detects frameworks from `package.json`:

**Detected Frameworks:**
- **Next.js**: `next.config.`, `pages/`, `app/`
- **Express**: `express`, `routes/`, `server.ts`
- **FastAPI**: `fastapi`, `main.py`, `routers.py`
- **NestJS**: `@nestjs/`, `main.ts`, `.module.ts`
- **React**: `react`, `src/App.`, `src/components/`
- **Vue**: `vue`, `src/App.vue`
- **Angular**: `@angular/`, `angular.json`

---

## generate_jsdoc_on_fly

Generates JSDoc comments for TypeScript/JavaScript code.

### Description

Automatically generates JSDoc comments for functions, classes, and methods based on their signatures and implementation.

### Parameters

```typescript
{
  files: string[];                     // Required
  format?: 'jsdoc' | 'tSDoc';         // Optional, default: 'jsdoc'
  includeExamples?: boolean;           // Optional, default: false
}
```

### Parameter Details

#### files (Required)

**Type:** `string[]`
**Description:** Array of file paths to process (absolute or relative to cwd)

#### format (Optional)

**Type:** `'jsdoc' | 'tSDoc'`
**Default:** `'jsdoc'`
**Description:** Documentation format to generate

#### includeExamples (Optional)

**Type:** `boolean`
**Default:** `false`
**Description:** Include usage examples in generated docs

### Return Value

```typescript
{
  success: boolean;
  filesProcessed: number;
  functionsDocumented: number;
  classesDocumented: number;
  errors?: Array<{
    file: string;
    message: string;
  }>;
  warnings?: string[];
}
```

### Usage Examples

#### Basic Usage

```typescript
await mcpClient.callTool({
  name: 'generate_jsdoc_on_fly',
  arguments: {
    files: ['src/utils/helpers.ts', 'lib/api.ts']
  }
});
```

#### With Examples

```typescript
await mcpClient.callTool({
  name: 'generate_jsdoc_on_fly',
  arguments: {
    files: ['src/**/*.ts'],
    includeExamples: true
  }
});
```

#### TSDoc Format

```typescript
await mcpClient.callTool({
  name: 'generate_jsdoc_on_fly',
  arguments: {
    files: ['src/utils.ts'],
    format: 'tSDoc'
  }
});
```

### Generated Documentation

#### Function Documentation

**Input:**
```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

**Generated (JSDoc):**
```typescript
/**
 * Adds two numbers together.
 *
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 *
 * @example
 * ```ts
 * add(1, 2) // returns 3
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

**Generated (TSDoc):**
```typescript
/**
 * Adds two numbers together.
 *
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 *
 * @example
 * ```ts
 * add(1, 2) // returns 3
 * ```
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

#### Class Documentation

**Input:**
```typescript
export class UserService {
  constructor(private db: Database) {}

  async getUser(id: string): Promise<User | null> {
    return await this.db.users.findUnique({ where: { id } });
  }
}
```

**Generated:**
```typescript
/**
 * Service for managing user operations.
 */
export class UserService {
  /**
   * Creates a new UserService instance.
   *
   * @param db - Database connection
   */
  constructor(private db: Database) {}

  /**
   * Retrieves a user by ID.
   *
   * @param id - The user ID
   * @returns The user object or null if not found
   */
  async getUser(id: string): Promise<User | null> {
    return await this.db.users.findUnique({ where: { id } });
  }
}
```

#### Async Function Documentation

**Input:**
```typescript
export async function fetchUserData(userId: string): Promise<UserData> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

**Generated:**
```typescript
/**
 * Fetches user data from the API.
 *
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to user data
 *
 * @example
 * ```ts
 * const data = await fetchUserData('user-123');
 * console.log(data.name);
 * ```
 */
export async function fetchUserData(userId: string): Promise<UserData> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

### Documentation Strategies

#### 1. Signature-Based Inference

Extracts information from TypeScript signatures:
- Parameter names and types
- Return type
- Async/sync nature
- Optional parameters

#### 2. Naming Conventions

Derives descriptions from naming:
- `getUser()` → "Gets a user by ID"
- `calculateTotal()` → "Calculates the total"
- `isValidEmail()` → "Validates if input is a valid email"

#### 3. Implementation Analysis

Analyzes function body when needed:
- Return statements for examples
- Common patterns for descriptions
- Error handling for throws documentation

---

## Integration Examples

### Quality Gate Integration

The Quality Gate automatically triggers MCP tools after successful validation:

```typescript
// In quality-gate/src/judge.ts
private async triggerDocumentationUpdates(
  projectPath: string,
  currentFile: string,
  results: ValidationResults
): Promise<void> {
  if (!this.docTrigger || !this.mcpClient) return;

  const actions = await this.docTrigger.analyzeTriggers({
    projectPath,
    changedFiles: Array.from(this.changedFiles),
    validatedFiles: [currentFile],
    issues: results.issues
  });

  await this.docTrigger.executeActions(actions);
}
```

### Manual CLI Usage

```bash
# Sync OpenAPI spec
docs-sync openapi --project-path . --output openapi.json

# Update README
docs-sync readme --project-path . --sections all

# Generate JSDoc
docs-sync jsdoc --project-path . --files "src/**/*.ts"
```

### Programmatic Usage

```typescript
import { MCPClient } from '@smite/quality-gate';

const mcpClient = new MCPClient({
  serverPath: './node_modules/@smite/docs-editor-mcp/dist/index.js'
});

await mcpClient.connect();

// Sync OpenAPI
const openapiResult = await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: process.cwd(),
    frameworks: ['express', 'nextjs']
  }
});

console.log(`Found ${openapiResult.endpointsFound} endpoints`);

// Update README
const readmeResult = await mcpClient.callTool({
  name: 'update_readme_architecture',
  arguments: {
    projectPath: process.cwd(),
    sectionsToUpdate: ['all']
  }
});

console.log(`Updated ${readmeResult.sectionsUpdated.join(', ')}`);

await mcpClient.close();
```

### CI/CD Integration

```yaml
# .github/workflows/docs.yml
name: Update Documentation

on:
  push:
    branches: [main]

jobs:
  update-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build MCP server
        run: npm run build --workspace=plugins/docs-editor-mcp

      - name: Sync OpenAPI spec
        run: npm run docs:sync

      - name: Update README
        run: npm run docs:update-readme

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add -A
          git commit -m "docs: auto-update documentation" || exit 0
          git push
```

---

## Error Handling

### Common Errors

#### 1. Server Not Found

**Error:** `Failed to connect to MCP server`

**Solution:**
```bash
# Build MCP server
cd plugins/docs-editor-mcp
npm run build

# Verify path
ls dist/index.js
```

#### 2. Invalid Project Path

**Error:** `Project path does not exist`

**Solution:**
```typescript
// Use absolute path
await mcpClient.callTool({
  name: 'sync_openapi_spec',
  arguments: {
    projectPath: path.resolve(process.cwd())
  }
});
```

#### 3. Parse Errors

**Error:** `Failed to parse route definitions`

**Solution:**
- Check TypeScript syntax
- Exclude generated files
- Use specific file patterns

### Error Response Format

```typescript
{
  success: false,
  errors: string[]
}
```

**Example:**
```json
{
  "success": false,
  "errors": [
    "Failed to parse /path/to/file.ts: Unexpected token",
    "No routes found in project"
  ]
}
```

### Graceful Degradation

The Quality Gate handles MCP errors gracefully:

```typescript
try {
  await this.docTrigger.executeActions(actions);
} catch (error) {
  // Log error but don't fail validation
  this.logger.warn('judge', `Documentation update failed: ${error}`);
}
```

---

## Related Documentation

- [Quality Gate README](../quality-gate/README.md) - Quality Gate documentation
- [Quality Gate Architecture](../quality-gate/ARCHITECTURE.md) - System architecture
- [MCP Protocol](https://modelcontextprotocol.io/) - Model Context Protocol spec
- [OpenAPI Specification](https://swagger.io/specification/) - OpenAPI spec
- [JSDoc Documentation](https://jsdoc.app/) - JSDoc syntax

---

**Last Updated:** 2025-01-19
