# Read Feature Module - Public API Reference

## Installation

```typescript
import {
  ReadFeature,
  readWebPage,
  batchRead,
  extractStructuredData,
  type ReadFeatureOptions,
  type ExtractionSchema,
  type BatchReadResults,
} from '@smite/browser-automation/features';
```

## Class: ReadFeature

### Constructor

```typescript
constructor(client?: WebReaderClient)
```

Creates a new read feature instance. Optionally accepts a custom MCP client.

### Methods

#### readWebPage(url, options?)

Read a web page and convert to markdown/text.

```typescript
async readWebPage(
  url: string,
  options?: ReadFeatureOptions
): Promise<Result<string>>
```

**Parameters:**
- `url` - The URL to read
- `options` - Optional reading options

**Returns:** `Result<string>` - Success with content or error

**Example:**
```typescript
const feature = new ReadFeature();
const result = await feature.readWebPage('https://example.com', {
  returnFormat: 'markdown',
  retainImages: true
});

if (result.success) {
  console.log(result.data);
}
```

#### readWebPageWithMetadata(url, options?)

Read a web page with automatic metadata extraction.

```typescript
async readWebPageWithMetadata(
  url: string,
  options?: ReadFeatureOptions
): Promise<Result<WebReaderResponse>>
```

**Returns:** `Result<WebReaderResponse>`
- `content` - Page content
- `images` - Array of image URLs
- `links` - Array of link URLs

**Example:**
```typescript
const result = await feature.readWebPageWithMetadata('https://example.com');
if (result.success) {
  console.log(`Found ${result.data.images?.length} images`);
}
```

#### extractStructuredData(url, schema, options?)

Extract structured data using patterns.

```typescript
async extractStructuredData(
  url: string,
  schema: ExtractionSchema,
  options?: ReadFeatureOptions
): Promise<Result<ExtractedData>>
```

**Parameters:**
- `url` - The URL to read
- `schema` - Extraction schema defining fields to extract
- `options` - Optional reading options

**Returns:** `Result<ExtractedData>` - Structured key-value pairs

**Example:**
```typescript
const schema: ExtractionSchema = {
  fields: {
    title: { pattern: /^#\s+(.*)$/m },
    links: { pattern: /\[.*?\]\((.*?)\)/g, multiple: true }
  }
};

const result = await feature.extractStructuredData('https://example.com', schema);
if (result.success) {
  console.log(result.data.title);
  console.log(result.data.links);
}
```

#### batchRead(urls, options?)

Read multiple URLs in parallel batches.

```typescript
async batchRead(
  urls: string[],
  options?: ReadFeatureOptions
): Promise<BatchReadResults>
```

**Parameters:**
- `urls` - Array of URLs to read
- `options` - Optional reading options (applied to all URLs)

**Returns:** `BatchReadResults`
- `contents` - Map of successful URL -> content
- `errors` - Map of failed URL -> error
- `successRate` - Success rate (0-1)
- `totalTime` - Total time in milliseconds

**Example:**
```typescript
const results = await feature.batchRead([
  'https://example.com/page1',
  'https://example.com/page2'
]);

console.log(`Success rate: ${results.successRate * 100}%`);
for (const [url, content] of results.contents) {
  console.log(`${url}: ${content.length} chars`);
}
```

#### batchReadWithMetadata(urls, options?)

Read multiple URLs with metadata for each.

```typescript
async batchReadWithMetadata(
  urls: string[],
  options?: ReadFeatureOptions
): Promise<Map<string, WebReaderResponse>>
```

**Returns:** Map of URL -> response with metadata

#### summarizeContent(content)

Analyze and summarize page content.

```typescript
summarizeContent(content: string): {
  title?: string;
  headings: string[];
  wordCount: number;
  imageCount: number;
  linkCount: number;
}
```

**Example:**
```typescript
const result = await feature.readWebPage('https://example.com');
if (result.success) {
  const summary = feature.summarizeContent(result.data);
  console.log(`Words: ${summary.wordCount}`);
}
```

#### extractImages(content)

Extract all image URLs from markdown content.

```typescript
extractImages(content: string): string[]
```

#### extractLinks(content)

Extract all link URLs from markdown content.

```typescript
extractLinks(content: string): string[]
```

## Convenience Functions

### readWebPage(url, options?)

Read a single URL without class instantiation.

```typescript
async function readWebPage(
  url: string,
  options?: ReadFeatureOptions
): Promise<Result<string>>
```

**Example:**
```typescript
const result = await readWebPage('https://example.com');
```

### batchRead(urls, options?)

Batch read URLs without class instantiation.

```typescript
async function batchRead(
  urls: string[],
  options?: ReadFeatureOptions
): Promise<BatchReadResults>
```

**Example:**
```typescript
const results = await batchRead(['url1', 'url2', 'url3']);
```

### extractStructuredData(url, schema, options?)

Extract structured data without class instantiation.

```typescript
async function extractStructuredData(
  url: string,
  schema: ExtractionSchema,
  options?: ReadFeatureOptions
): Promise<Result<ExtractedData>>
```

## Types

### ReadFeatureOptions

Options for reading web content.

```typescript
interface ReadFeatureOptions {
  // Format control
  returnFormat?: 'markdown' | 'text';
  noGfm?: boolean;

  // Image control
  retainImages?: boolean;
  withImagesSummary?: boolean;
  keepImgDataUrl?: boolean;

  // Link control
  withLinksSummary?: boolean;

  // Cache control
  useCache?: boolean;

  // Timeout
  timeout?: number;

  // Feature-level
  includeMetadata?: boolean;
  schema?: ExtractionSchema;
  batchTimeout?: number;
}
```

### ExtractionSchema

Schema for structured data extraction.

```typescript
interface ExtractionSchema {
  fields: Record<string, {
    pattern?: RegExp;        // Regex pattern
    selector?: string;       // CSS selector (future)
    attribute?: string;      // Attribute to extract
    multiple?: boolean;      // Extract multiple values
  }>;
}
```

### ExtractedData

Result of structured data extraction.

```typescript
type ExtractedData = Record<string, string | string[]>;
```

### BatchReadResults

Results of batch reading operation.

```typescript
interface BatchReadResults {
  contents: Map<string, string>;      // Successful reads
  errors: Map<string, Error>;         // Failed reads
  successRate: number;                // 0-1
  totalTime: number;                  // Milliseconds
}
```

### WebReaderResponse

Response with metadata.

```typescript
interface WebReaderResponse {
  content: string;
  images?: string[];
  links?: string[];
}
```

### Result<T>

Result wrapper for operations that can fail.

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
```

## Type Guards

### isSuccess(result)

Check if result is successful.

```typescript
function isSuccess<T>(result: Result<T>): result is { success: true; data: T }
```

### isFailure(result)

Check if result failed.

```typescript
function isFailure<T>(result: Result<T>): result is { success: false; error: Error }
```

## Usage Examples

### Basic Reading

```typescript
import { readWebPage } from '@smite/browser-automation/features';

const result = await readWebPage('https://example.com');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Batch Processing

```typescript
import { batchRead } from '@smite/browser-automation/features';

const urls = ['url1', 'url2', 'url3'];
const results = await batchRead(urls, {
  returnFormat: 'markdown',
  retainImages: false
});

console.log(`Success: ${results.successRate * 100}%`);
```

### Structured Extraction

```typescript
import { extractStructuredData } from '@smite/browser-automation/features';

const schema = {
  fields: {
    title: { pattern: /^#\s+(.*)$/m },
    allLinks: { pattern: /\[.*?\]\((.*?)\)/g, multiple: true }
  }
};

const result = await extractStructuredData('https://example.com', schema);
if (result.success) {
  console.log('Title:', result.data.title);
  console.log('Links:', result.data.allLinks);
}
```

### Advanced Usage with Class

```typescript
import { ReadFeature } from '@smite/browser-automation/features';

const feature = new ReadFeature();

// Read with metadata
const result1 = await feature.readWebPageWithMetadata('https://example.com');

// Analyze content
if (result1.success) {
  const summary = feature.summarizeContent(result1.data.content);
  const images = feature.extractImages(result1.data.content);
  const links = feature.extractLinks(result1.data.content);

  console.log('Summary:', summary);
  console.log('Images:', images);
  console.log('Links:', links);
}

// Batch process
const urls = ['url1', 'url2', 'url3'];
const results = await feature.batchRead(urls);

for (const [url, content] of results.contents) {
  console.log(`${url}: ${content.length} chars`);
}
```

## Error Handling

All operations return `Result<T>` type. Use type guards to handle outcomes:

```typescript
import { isSuccess, isFailure } from '@smite/browser-automation/features';

const result = await readWebPage('https://example.com');

if (isSuccess(result)) {
  // Access result.data safely
  console.log(result.data);
} else if (isFailure(result)) {
  // Handle error
  console.error('Failed:', result.error.message);
}
```

## Best Practices

1. **Always check result type** before accessing data
2. **Use batch processing** for multiple URLs (better performance)
3. **Enable metadata** when you need images/links
4. **Use cache** for repeated reads of same URL
5. **Set appropriate timeouts** for slow pages
6. **Handle partial failures** in batch operations

## Performance Tips

- Batch size is automatically limited to 5 concurrent requests
- Use `useCache: true` for repeated reads
- Set `retainImages: false` for faster reads when images aren't needed
- Use `returnFormat: 'text'` for plain text (no markdown processing)

## See Also

- [Web Reader MCP Client](../mcp/web-reader-client.ts)
- [Architecture Documentation](./browser-automation-architecture.md)
- [Implementation Summary](./US-004-IMPLEMENTATION.md)
