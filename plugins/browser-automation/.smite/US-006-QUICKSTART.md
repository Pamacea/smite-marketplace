# Repository Feature - Quick Start Guide

## What is it?

The Repository Feature module lets AI agents analyze GitHub repositories **without cloning them**. Read files, explore structure, search docs, and extract insights instantly.

## 5-Minute Getting Started

### 1. Import

```typescript
import { createRepositoryFeature } from '@smite/browser-automation/features';

const repo = createRepositoryFeature();
```

### 2. Read a File

```typescript
const result = await repo.readRepoFile('vitejs', 'vite', '/README.md');

if (result.success) {
  console.log(result.data);
}
```

### 3. Explore Structure

```typescript
const structure = await repo.getRepoStructure('facebook', 'react', '/src');

if (structure.success) {
  console.log(structure.data); // Directory tree
}
```

### 4. Search Documentation

```typescript
const search = await repo.searchRepoDocs(
  'vitejs',
  'vite',
  'How to configure plugins',
  'en'
);

if (search.success) {
  console.log(search.data); // Search results
}
```

### 5. Get Insights

```typescript
const insights = await repo.getRepositoryInsights('vercel', 'next.js');

if (insights.success) {
  console.log('Language:', insights.data.language);
  console.log('Dependencies:', insights.data.dependencies);
  console.log('Topics:', insights.data.keyTopics);
}
```

## Common Patterns

### Batch Read Multiple Files

```typescript
const files = ['/README.md', '/package.json', '/LICENSE'];

const result = await repo.batchReadFiles('vitejs', 'vite', files, true, 3);

if (result.success) {
  result.data.forEach(file => {
    if (file.success) {
      console.log(`✓ ${file.path}: ${file.size} bytes`);
    }
  });
}
```

### Comprehensive Analysis

```typescript
const analysis = await repo.analyzeRepo('facebook', 'react', {
  includeReadme: true,
  includePackageJson: true,
  searchQuery: 'hooks',
});

if (analysis.success) {
  const { repoName, structure, readme, packageJson } = analysis.data;
  // Use all the data
}
```

### Validation

```typescript
import { RepositoryValidationError } from '@smite/browser-automation/features';

try {
  const { owner, repo } = repo.parseRepoName('vitejs/vite');
  console.log('Owner:', owner, 'Repo:', repo);
} catch (error) {
  if (error instanceof RepositoryValidationError) {
    console.log('Invalid repo:', error.message);
  }
}
```

## For AI Agents

```typescript
// Agent capability
async function analyzeRepository(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const repoFeature = createRepositoryFeature();

  return {
    insights: await repoFeature.getRepositoryInsights(owner, repo),
    structure: await repoFeature.getRepoStructure(owner, repo),
    readme: await repoFeature.readRepoFile(owner, repo, '/README.md'),
  };
}
```

## Error Handling

All methods return `Result<T>`:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
```

Always check `success`:

```typescript
const result = await repo.readRepoFile('owner', 'repo', '/file.txt');

if (result.success) {
  // Access result.data
} else {
  // Handle result.error
}
```

## What's Possible?

- ✅ Read any file from public repos
- ✅ Explore directory structures
- ✅ Search docs, issues, commits
- ✅ Detect languages automatically
- ✅ Extract dependencies
- ✅ Compare multiple repos
- ✅ Batch operations (parallel reads)

## Limitations

- ⚠️ Public repos only (no auth yet)
- ⚠️ Read-only (no modifications)
- ⚠️ No git operations (no branches/diffs)

## Learn More

- **Full API:** `/docs/REPOSITORY_FEATURE.md`
- **Examples:** `/examples/repository-analysis.ts`
- **Tests:** `/tests/repository.feature.test.ts`

## Status

✅ **US-006 Complete** - Ready for production use!
