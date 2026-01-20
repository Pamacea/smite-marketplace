# Vision Feature Module

**Layer 2: Feature Module** - High-level vision and UI analysis capabilities.

## Overview

The Vision Feature Module provides powerful AI-powered image analysis capabilities built on top of the `zai-mcp-server` MCP infrastructure. It enables agents to understand screenshots, extract text, diagnose errors, generate code from UI designs, and perform visual regression testing.

## Features

### 1. General Image Analysis
Understand any visual content with natural language queries.

### 2. Text Extraction (OCR)
Extract text from screenshots with support for code syntax highlighting and multiple programming languages.

### 3. UI Analysis
Analyze user interfaces and generate:
- **Code**: React, Vue, Svelte, HTML from designs
- **Prompts**: AI prompts for UI recreation
- **Specs**: Comprehensive design specifications
- **Descriptions**: Natural language explanations

### 4. Error Diagnosis
Parse error messages, analyze stack traces, and get actionable fixes.

### 5. Visual Regression Testing
Compare expected vs actual UI implementations to detect layout, style, and content differences.

### 6. Advanced Analysis
- **Data Visualization**: Extract insights from charts and graphs
- **Technical Diagrams**: Understand architecture diagrams and flowcharts
- **Video Analysis**: Understand actions and scenes in videos

## Installation

```bash
npm install @smite/browser-automation
```

## Quick Start

### TypeScript/JavaScript

```typescript
import { VisionFeature } from '@smite/browser-automation/features';

const vision = new VisionFeature();

// Analyze an image
const result = await vision.analyzeImage(
  '/path/to/screenshot.png',
  'Describe the UI layout and components'
);

if (result.success) {
  console.log(result.data);
} else {
  console.error('Analysis failed:', result.error);
}
```

### Convenience Functions

```typescript
import {
  analyzeImage,
  extractText,
  analyzeUI,
  diagnoseError,
  compareUI
} from '@smite/browser-automation/features';

// Quick analysis
const analysis = await analyzeImage('/path/to/image.png', 'Describe this UI');

// Extract text
const text = await extractText('/path/to/screenshot.png');

// Generate code from design
const code = await analyzeUI('/path/to/design.png', 'code');
```

## Usage Examples

### 1. General Image Analysis

```typescript
import { VisionFeature } from '@smite/browser-automation/features';

const vision = new VisionFeature();

// Local file
const result1 = await vision.analyzeImage(
  './screenshots/dashboard.png',
  'What are the main components and layout patterns used?'
);

// Remote URL
const result2 = await vision.analyzeImage(
  'https://example.com/screenshot.png',
  'Analyze the color scheme and typography'
);

if (result1.success) {
  console.log('Analysis:', result1.data);
}
```

### 2. Text Extraction (OCR)

```typescript
// Extract general text
const textResult = await vision.extractText('./screenshots/form.png');

if (textResult.success) {
  console.log('Extracted text:', textResult.data.text);
}

// Extract code with language hint
const codeResult = await vision.extractText('./screenshots/code-snippet.png', {
  programmingLanguage: 'typescript',
});

if (codeResult.success) {
  console.log('Code:', codeResult.data.text);
  console.log('Language:', codeResult.data.programmingLanguage);
}

// Custom extraction prompt
const customResult = await vision.extractText('./screenshots/log.png', {
  prompt: 'Extract only error messages and timestamps, ignore other text',
});
```

### 3. UI Analysis and Code Generation

```typescript
// Generate React code from design
const codeResult = await vision.analyzeUI(
  './designs/login-form.png',
  'code',
  'Generate React code with TypeScript and Tailwind CSS'
);

if (codeResult.success) {
  const code = codeResult.data;
  // Write to file
  await fs.writeFile('./LoginForm.tsx', code);
}

// Generate AI prompt for UI recreation
const promptResult = await vision.analyzeUI(
  './designs/dashboard.png',
  'prompt'
);

if (promptResult.success) {
  console.log('Prompt:', promptResult.data);
}

// Extract design specification
const specResult = await vision.analyzeUI(
  './designs/button.png',
  'spec'
);

if (specResult.success) {
  console.log('Design spec:', specResult.data);
}

// Get natural language description
const descResult = await vision.analyzeUI(
  './designs/modal.png',
  'description'
);
```

### 4. Error Diagnosis

```typescript
// Diagnose error with context
const diagnosis = await vision.diagnoseError(
  './screenshots/error.png',
  'During npm install in CI/CD pipeline'
);

if (diagnosis.success) {
  console.log('Error Type:', diagnosis.data.errorType);
  console.log('Message:', diagnosis.data.errorMessage);
  console.log('Possible Causes:');
  diagnosis.data.possibleCauses.forEach((cause, i) => {
    console.log(`${i + 1}. ${cause}`);
  });
  console.log('Suggested Fixes:');
  diagnosis.data.suggestedFixes.forEach((fix, i) => {
    console.log(`${i + 1}. ${fix}`);
  });
}

// Diagnose without context
const quickDiagnosis = await vision.diagnoseError('./error.png');
```

### 5. Visual Regression Testing

```typescript
// Compare two UIs
const comparison = await vision.compareUI(
  './designs/expected-design.png',
  './screenshots/actual-implementation.png'
);

if (comparison.success) {
  if (comparison.data.hasDifferences) {
    console.log('Differences found:');
    comparison.data.differences.forEach((diff) => {
      console.log(`- [${diff.severity.toUpperCase()}] ${diff.type}`);
      console.log(`  Location: ${diff.location}`);
      console.log(`  Description: ${diff.description}`);
    });

    console.log(`Similarity Score: ${comparison.data.similarityScore}%`);
  } else {
    console.log('No differences detected! UIs match.');
  }
}

// Compare with specific focus
const focusedComparison = await vision.compareUI(
  './expected.png',
  './actual.png',
  'Focus on the header component and navigation menu'
);
```

### 6. Advanced Analysis

```typescript
// Analyze data visualization
const chartAnalysis = await vision.analyzeDataViz(
  './screenshots/revenue-chart.png',
  'What are the key trends, outliers, and insights?',
  'trends'
);

// Understand technical diagram
const diagramExplanation = await vision.understandDiagram(
  './docs/architecture.png',
  'Explain the data flow and how components interact',
  'architecture'
);

// Analyze video
const videoAnalysis = await vision.analyzeVideo(
  './demos/user-flow.mp4',
  'Describe the user interactions, state changes, and UI transitions'
);
```

## API Reference

### VisionFeature

Main class for vision and UI analysis operations.

#### Constructor

```typescript
constructor(client?: VisionClient)
```

Creates a new VisionFeature instance. Optionally accepts a custom VisionClient.

#### Methods

##### `analyzeImage(source, prompt)`

Analyze an image with AI.

**Parameters:**
- `source: ImageSource` - File path or URL
- `prompt: string` - Analysis prompt

**Returns:** `Promise<Result<string>>`

**Example:**
```typescript
const result = await vision.analyzeImage(
  '/path/to/image.png',
  'Describe the layout and components'
);
```

##### `extractText(source, options?)`

Extract text from an image (OCR).

**Parameters:**
- `source: ImageSource` - File path or URL
- `options?: Partial<ExtractTextOptions>`
  - `prompt?: string` - Custom extraction prompt
  - `programmingLanguage?: string` - Language hint for code

**Returns:** `Promise<Result<TextExtractionResult>>`

**Example:**
```typescript
const result = await vision.extractText('/path/to/image.png', {
  programmingLanguage: 'typescript'
});
```

##### `analyzeUI(source, outputType, prompt?)`

Analyze UI and generate artifacts.

**Parameters:**
- `source: ImageSource` - File path or URL
- `outputType: 'code' | 'prompt' | 'spec' | 'description'`
- `prompt?: string` - Custom prompt

**Returns:** `Promise<Result<string>>`

**Example:**
```typescript
const result = await vision.analyzeUI('/path/to/ui.png', 'code');
```

##### `diagnoseError(source, context?)`

Diagnose error from screenshot.

**Parameters:**
- `source: ImageSource` - File path or URL
- `context?: string` - Context about when error occurred

**Returns:** `Promise<Result<ErrorDiagnosisResult>>`

**Example:**
```typescript
const result = await vision.diagnoseError('/path/to/error.png', 'During npm install');
```

##### `compareUI(expected, actual, focusAreas?)`

Compare two UI screenshots.

**Parameters:**
- `expected: ImageSource` - Expected design
- `actual: ImageSource` - Actual implementation
- `focusAreas?: string` - Specific areas to focus on

**Returns:** `Promise<Result<UIComparisonResult>>`

**Example:**
```typescript
const result = await vision.compareUI('/path/to/expected.png', '/path/to/actual.png');
```

##### `analyzeDataViz(source, prompt, analysisFocus?)`

Analyze data visualization.

**Parameters:**
- `source: ImageSource` - File path or URL
- `prompt: string` - What insights to extract
- `analysisFocus?: string` - Focus area (trends, anomalies, etc.)

**Returns:** `Promise<Result<string>>`

##### `understandDiagram(source, prompt, diagramType?)`

Understand technical diagrams.

**Parameters:**
- `source: ImageSource` - File path or URL
- `prompt: string` - What to understand
- `diagramType?: string` - Diagram type hint

**Returns:** `Promise<Result<string>>`

##### `analyzeVideo(source, prompt)`

Analyze video content.

**Parameters:**
- `source: ImageSource` - File path or URL
- `prompt: string` - What to analyze

**Returns:** `Promise<Result<string>>`

## Type Definitions

### Result<T>

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
```

### ImageSource

```typescript
type ImageSource = string; // File path or URL
```

### TextExtractionResult

```typescript
interface TextExtractionResult {
  text: string;
  confidence?: number;
  language?: string;
  programmingLanguage?: string;
}
```

### ErrorDiagnosisResult

```typescript
interface ErrorDiagnosisResult {
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  possibleCauses: string[];
  suggestedFixes: string[];
  relatedDocs?: string[];
}
```

### UIComparisonResult

```typescript
interface UIComparisonResult {
  hasDifferences: boolean;
  differences: Array<{
    location: string;
    type: 'layout' | 'style' | 'content' | 'missing' | 'added';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  similarityScore: number;
  summary: string;
}
```

## Error Handling

All vision operations return a `Result<T>` type:

```typescript
const result = await vision.analyzeImage('/path/to/image.png', 'Describe this');

if (result.success) {
  // Operation succeeded
  console.log(result.data);
} else {
  // Operation failed
  console.error('Error:', result.error.message);
}
```

## Best Practices

### 1. Use Specific Prompts

Better prompts lead to better analysis:

```typescript
// ❌ Vague
const bad = await vision.analyzeImage(image, 'Analyze this');

// ✅ Specific
const good = await vision.analyzeImage(
  image,
  'Describe the layout structure, color palette, main components, and interactive elements'
);
```

### 2. Leverage Programming Language Hints

Help the OCR understand code:

```typescript
const code = await vision.extractText(screenshot, {
  programmingLanguage: 'typescript' // or 'python', 'javascript', 'rust', etc.
});
```

### 3. Use Context for Error Diagnosis

Provide context when diagnosing errors:

```typescript
const diagnosis = await vision.diagnoseError(
  errorScreenshot,
  'Error occurred while running TypeScript compiler in watch mode'
);
```

### 4. Focus Comparisons

Guide visual regression to specific areas:

```typescript
const comparison = await vision.compareUI(
  expected,
  actual,
  'Focus on spacing, alignment, and typography of the header section'
);
```

### 5. Handle Results Gracefully

Always check success before accessing data:

```typescript
const result = await vision.analyzeUI(image, 'code');

if (result.success) {
  // Safe to access result.data
  await fs.writeFile('./Component.tsx', result.data);
} else {
  console.error('Failed to generate code:', result.error);
}
```

## Real-World Workflows

### Debugging Visual Regressions

```typescript
import { VisionFeature } from '@smite/browser-automation/features';

async function debugVisualRegression(designPath: string, implPath: string) {
  const vision = new VisionFeature();

  const comparison = await vision.compareUI(designPath, implPath);

  if (!comparison.success) {
    throw new Error(`Comparison failed: ${comparison.error.message}`);
  }

  if (comparison.data.hasDifferences) {
    console.log('🔍 Visual Differences Detected:');
    console.log(`Similarity: ${comparison.data.similarityScore}%`);

    const criticalDiffs = comparison.data.differences.filter(
      (d) => d.severity === 'high'
    );

    if (criticalDiffs.length > 0) {
      console.log('\n⚠️ Critical Issues:');
      criticalDiffs.forEach((diff) => {
        console.log(`- ${diff.type}: ${diff.description}`);
      });
    }

    return comparison.data.differences;
  } else {
    console.log('✅ No visual differences found');
    return [];
  }
}
```

### Code Generation from Designs

```typescript
import { VisionFeature } from '@smite/browser-automation/features';
import { promises as fs } from 'fs';

async function generateComponentFromDesign(
  designPath: string,
  componentName: string
) {
  const vision = new VisionFeature();

  const codeResult = await vision.analyzeUI(
    designPath,
    'code',
    `Generate React code with TypeScript and Tailwind CSS for this ${componentName} component. Use modern patterns and include proper props interface.`
  );

  if (!codeResult.success) {
    throw new Error(`Code generation failed: ${codeResult.error.message}`);
  }

  const outputPath = `./src/components/${componentName}.tsx`;
  await fs.writeFile(outputPath, codeResult.data);

  console.log(`✅ Generated ${componentName} at ${outputPath}`);
  return outputPath;
}
```

### Automated Error Analysis

```typescript
import { VisionFeature } from '@smite/browser-automation/features';

async function analyzeBuildError(errorScreenshot: string, context: string) {
  const vision = new VisionFeature();

  const diagnosis = await vision.diagnoseError(errorScreenshot, context);

  if (!diagnosis.success) {
    throw new Error(`Diagnosis failed: ${diagnosis.error.message}`);
  }

  console.log(`❌ Error: ${diagnosis.data.errorMessage}`);
  console.log(`\nType: ${diagnosis.data.errorType}`);

  console.log('\n🔍 Possible Causes:');
  diagnosis.data.possibleCauses.forEach((cause, i) => {
    console.log(`${i + 1}. ${cause}`);
  });

  console.log('\n💡 Suggested Fixes:');
  diagnosis.data.suggestedFixes.forEach((fix, i) => {
    console.log(`${i + 1}. ${fix}`);
  });

  return diagnosis.data;
}
```

## Testing

See `tests/vision.feature.test.ts` for comprehensive test examples.

```bash
npm test -- vision.feature.test.ts
```

## Architecture

The Vision Feature Module is part of **Layer 2** of the browser-automation architecture:

```
Layer 4: CLI & Agent API
    ↓
Layer 3: Workflow Orchestrator
    ↓
Layer 2: Feature Modules ← VisionFeature is here
    ↓
Layer 1: MCP Client Wrapper
    ↓
z.ai MCP Servers
```

## Dependencies

- **MCP Server**: `zai-mcp-server` (multi-modal AI vision)
- **Layer 1**: `VisionClient` from `@smite/browser-automation/mcp`

## See Also

- [Browser Automation Architecture](../.smite/browser-automation-architecture.md)
- [MCP Client Documentation](../mcp/README.md)
- [Search Feature](./search-feature.md)
- [Read Feature](./read-feature.md)
- [Repository Feature](./repository-feature.md)

## License

MIT

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md).
