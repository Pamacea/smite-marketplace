# Repository Feature Module

Layer 2 feature module for GitHub repository analysis without cloning.

## Overview

The Repository Feature module provides a high-level API for analyzing GitHub repositories without needing to clone them. It leverages the z.ai MCP infrastructure to:

- Read file contents from public repositories
- Explore repository structure (directory trees)
- Search documentation, issues, and commits
- Perform comprehensive repository analysis
- Extract repository insights (language, dependencies, topics)
- Batch read multiple files efficiently

## Installation

The module is part of the `@smite/browser-automation` plugin.

```typescript
import {
  RepositoryFeature,
  createRepositoryFeature,
} from '@smite/browser-automation/features';
```

## Quick Start

### Basic Usage

```typescript
import { createRepositoryFeature } from '@smite/browser-automation/features';

const feature = createRepositoryFeature();

// Read a file
const result = await feature.readRepoFile('vitejs', 'vite', '/README.md');

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Repository Analysis

```typescript
// Comprehensive analysis
const analysis = await feature.analyzeRepo('facebook', 'react', {
  includeReadme: true,
  includePackageJson: true,
  searchQuery: 'hooks',
});

if (analysis.success) {
  console.log('Repository:', analysis.data.repoName);
  console.log('Structure:', analysis.data.structure);
  console.log('README:', analysis.data.readme);
}
```

## API Reference

### RepositoryFeature Class

#### `parseRepoName(repoName: string)`

Validates and parses a repository name in "owner/repo" format.

**Returns:** `{ owner: string; repo: string }`

**Throws:** `RepositoryValidationError` if format is invalid

```typescript
const { owner, repo } = feature.parseRepoName('vitejs/vite');
// { owner: 'vitejs', repo: 'vite' }
```

---

#### `readRepoFile(owner: string, repo: string, filePath: string)`

Read a single file from a repository.

**Parameters:**
- `owner` - Repository owner (e.g., "vitejs")
- `repo` - Repository name (e.g., "vite")
- `filePath` - Path to file (e.g., "/README.md")

**Returns:** `Promise<Result<string>>`

```typescript
const result = await feature.readRepoFile('vitejs', 'vite', '/package.json');
if (result.success) {
  const pkg = JSON.parse(result.data);
  console.log(pkg.dependencies);
}
```

---

#### `getRepoStructure(owner: string, repo: string, dir?: string)`

Get repository structure as a directory tree.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `dir` - Optional directory path (e.g., "/src")

**Returns:** `Promise<Result<string>>`

```typescript
const result = await feature.getRepoStructure('vitejs', 'vite', '/src');
if (result.success) {
  console.log(result.data); // Directory tree
}
```

---

#### `searchRepoDocs(owner: string, repo: string, query: string, language?: 'zh' | 'en')`

Search repository documentation, issues, and commits.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `query` - Search query
- `language` - Optional language hint ('zh' or 'en')

**Returns:** `Promise<Result<string>>`

```typescript
const result = await feature.searchRepoDocs(
  'vitejs',
  'vite',
  'How to configure plugins',
  'en'
);
```

---

#### `analyzeRepo(owner: string, repo: string, options?)`

Perform comprehensive repository analysis.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `options` - Analysis options:
  - `includeReadme?: boolean` - Include README content (default: true)
  - `includePackageJson?: boolean` - Include package.json (default: false)
  - `searchQuery?: string` - Optional search query

**Returns:** `Promise<Result<RepositoryAnalysis>>`

```typescript
const result = await feature.analyzeRepo('facebook', 'react', {
  includeReadme: true,
  includePackageJson: true,
  searchQuery: 'components',
});

if (result.success) {
  const { repoName, structure, readme, packageJson, searchResults } = result.data;
}
```

---

#### `batchReadFiles(owner: string, repo: string, filePaths: string[], continueOnError?: boolean, maxConcurrent?: number)`

Read multiple files in parallel batches.

**Parameters:**
- `owner` - Repository owner
- `repo` - Repository name
- `filePaths` - Array of file paths
- `continueOnError` - Continue on error (default: true)
- `maxConcurrent` - Max concurrent requests (default: 3)

**Returns:** `Promise<Result<FileReadResult[]>>`

```typescript
const result = await feature.batchReadFiles(
  'vitejs',
  'vite',
  ['/README.md', '/LICENSE', '/package.json'],
  true,
  3
);

if (result.success) {
  result.data.forEach((file) => {
    if (file.success) {
      console.log(`${file.path}: ${file.size} bytes`);
    }
  });
}
```

---

#### `getRepositoryInsights(owner: string, repo: string)`

Extract repository insights (language, dependencies, topics).

**Returns:** `Promise<Result<RepositoryInsight>>`

```typescript
const result = await feature.getRepositoryInsights('vitejs', 'vite');

if (result.success) {
  const { language, dependencies, keyTopics, mainFiles } = result.data;
  console.log('Language:', language);
  console.log('Dependencies:', dependencies);
  console.log('Topics:', keyTopics);
}
```

## Types

### RepositoryAnalysis

```typescript
interface RepositoryAnalysis {
  repoName: string;
  structure: string;
  readme?: string;
  packageJson?: Record<string, unknown>;
  searchResults?: string;
}
```

### FileReadResult

```typescript
interface FileReadResult {
  path: string;
  content: string;
  size: number;
  success: boolean;
  error?: string;
}
```

### RepositoryInsight

```typescript
interface RepositoryInsight {
  repoName: string;
  language?: string;
  mainFiles: Array<{ path: string; purpose: string }>;
  dependencies?: string[];
  keyTopics: string[];
  description?: string;
}
```

### AnalyzeRepositoryOptions

```typescript
interface AnalyzeRepositoryOptions {
  owner: string;
  repo: string;
  includeReadme?: boolean;
  includePackageJson?: boolean;
  searchQuery?: string;
  maxFiles?: number;
}
```

## Error Handling

All methods return a `Result<T>` type:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
```

### Validation Errors

The module throws `RepositoryValidationError` for invalid inputs:

```typescript
import { RepositoryValidationError } from '@smite/browser-automation/features';

try {
  feature.parseRepoName('invalid-format');
} catch (error) {
  if (error instanceof RepositoryValidationError) {
    console.log('Field:', error.field);
    console.log('Value:', error.value);
    console.log('Message:', error.message);
  }
}
```

## Use Cases

### 1. Code Research

```typescript
// Explore a library's source structure
const structure = await feature.getRepoStructure('facebook', 'react', '/packages');

// Read implementation files
const files = await feature.batchReadFiles(
  'facebook',
  'react',
  ['/packages/react/src/React.js', '/packages/react/index.js']
);

files.data.forEach(file => {
  if (file.success) {
    // Analyze implementation
    console.log(file.content);
  }
});
```

### 2. Documentation Research

```typescript
// Search for specific topics
const searchResult = await feature.searchRepoDocs(
  'vitejs',
  'vite',
  'environment variables',
  'en'
);

// Read comprehensive docs
const docs = await feature.batchReadFiles(
  'vitejs',
  'vite',
  ['/README.md', '/guide/env-and-mode.md', '/config/index.md']
);
```

### 3. Dependency Analysis

```typescript
// Get repository insights
const insights = await feature.getRepositoryInsights('vercel', 'next.js');

if (insights.success) {
  console.log('Main dependencies:');
  insights.data.dependencies?.forEach(dep => {
    console.log(`  - ${dep}`);
  });
}
```

### 4. Repository Comparison

```typescript
const repos = [
  { owner: 'vitejs', repo: 'vite' },
  { owner: 'facebook', repo: 'react' },
];

for (const { owner, repo } of repos) {
  const analysis = await feature.analyzeRepo(owner, repo, {
    includePackageJson: true,
  });

  if (analysis.success) {
    const pkg = analysis.data.packageJson as any;
    console.log(`${owner}/${repo}:`, pkg.dependencies);
  }
}
```

## Agent Integration

### For AI Agents

This module is designed for AI agent consumption:

```typescript
import { createRepositoryFeature } from '@smite/browser-automation';

// Agent context
const repoFeature = createRepositoryFeature();

// Agent capability: "analyze_github_repo"
async function analyzeGitHubRepo(repoUrl: string) {
  const { owner, repo } = extractOwnerRepo(repoUrl);

  return {
    structure: await repoFeature.getRepoStructure(owner, repo),
    insights: await repoFeature.getRepositoryInsights(owner, repo),
    readme: await repoFeature.readRepoFile(owner, repo, '/README.md'),
  };
}
```

### Tool Definition

```json
{
  "name": "repository_analyzer",
  "description": "Analyze GitHub repositories without cloning",
  "parameters": {
    "type": "object",
    "properties": {
      "owner": {
        "type": "string",
        "description": "Repository owner (e.g., 'vitejs')"
      },
      "repo": {
        "type": "string",
        "description": "Repository name (e.g., 'vite')"
      },
      "operation": {
        "type": "string",
        "enum": ["read", "structure", "search", "analyze", "insights"],
        "description": "Operation to perform"
      },
      "path": {
        "type": "string",
        "description": "File path or directory path (for read/structure)"
      },
      "query": {
        "type": "string",
        "description": "Search query (for search operation)"
      }
    },
    "required": ["owner", "repo", "operation"]
  }
}
```

## Architecture

The Repository Feature is **Layer 2** in the MCP-First architecture:

```
Layer 4: CLI & Agent API
         ↓
Layer 3: Workflow Orchestrator
         ↓
Layer 2: Feature Modules (RepositoryFeature)
         ↓
Layer 1: MCP Client Wrapper (RepoClient)
         ↓
z.ai MCP Servers (mcp__zread__*)
```

### Relationship to MCP Client

The RepositoryFeature wraps the `RepoClient` (Layer 1) and adds:

- **Input validation** - Zod-like validation for repo names, file paths
- **Business logic** - Batch operations, insights extraction
- **Error handling** - Structured error responses
- **Convenience methods** - High-level workflows

```typescript
// Layer 1 (MCP Client)
import { RepoClient } from '@smite/browser-automation/mcp';
const mcp = new RepoClient();
const result = await mcp.readFile({ repoName: 'vitejs/vite', filePath: '/README.md' });

// Layer 2 (Feature Module)
import { RepositoryFeature } from '@smite/browser-automation/features';
const feature = new RepositoryFeature();
const result = await feature.readRepoFile('vitejs', 'vite', '/README.md');
// → More intuitive API, validation, and error handling
```

## Performance

### Batch Operations

Batch reading is optimized for parallel execution:

```typescript
// Fast: Parallel batch (3 concurrent)
const result = await feature.batchReadFiles(
  'owner',
  'repo',
  Array.from({ length: 20 }, (_, i) => `/file${i}.js`),
  true,
  3
);
// → ~7 seconds (3 batches of ~3 files each)

// Slow: Sequential reads
for (const path of paths) {
  await feature.readRepoFile('owner', 'repo', path);
}
// → ~20 seconds (20 sequential requests)
```

### Caching

The MCP layer handles caching automatically. Repeated reads of the same file are cached.

## Limitations

- **Public repositories only** - Private repos require authentication
- **No git operations** - Cannot checkout branches, view diffs, or access git history
- **Rate limited** - Subject to GitHub API rate limits
- **Read-only** - Cannot modify repository files

## Best Practices

1. **Use batch operations** - Read multiple files in parallel with `batchReadFiles()`
2. **Check results** - Always check `result.success` before accessing `result.data`
3. **Handle errors gracefully** - Use `continueOnError` in batch operations
4. **Respect rate limits** - Avoid excessive requests in short time periods
5. **Validate inputs** - Let the module validate repo names and paths

## Examples

See `/examples/repository-analysis.ts` for comprehensive examples including:

- Basic file reading
- Structure exploration
- Documentation search
- Comprehensive analysis
- Batch operations
- Insights extraction
- Repository comparison

## Testing

```bash
# Run tests
npm test -- tests/repository.feature.test.ts

# Run with coverage
npm test -- --coverage tests/repository.feature.test.ts
```

## Related Modules

- **MCP Client Wrapper** (`/mcp/repo-client.ts`) - Low-level MCP calls
- **Workflow Orchestrator** - Multi-step repository analysis workflows
- **Search Feature** - Web search for repository discovery

## License

MIT

## Contributing

Contributions welcome! Please read the architecture documentation first:

- `/docs/browser-automation-architecture.md` - Overall architecture
- `/docs/LAYER-2-FEATURES.md` - Feature module design patterns
