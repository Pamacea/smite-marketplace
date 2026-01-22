# 01_ANALYZE - Context Gathering

## Instructions

### 1. Gather Context

Launch parallel exploration to understand:

- **Codebase Structure**: Main directories, file organization
- **Existing Patterns**: Coding conventions, architectural patterns
- **Dependencies**: External libraries, internal modules
- **Relevant Files**: Files related to the task

### 2. Explore Codebase

Use semantic search to find:

```
- Similar features: "How is [similar feature] implemented?"
- Patterns: "Show examples of [pattern] in codebase"
- APIs: "Where is [API endpoint] defined?"
- Components: "Find components that use [technology]"
```

### 3. Use Available MCP Tools

Leverage these MCP tools for enhanced analysis:

#### **zai-mcp-server** - Image Analysis
- `analyze_image` - General image analysis for UI mockups, diagrams, screenshots
- `ui_diff_check` - Compare expected vs actual UI (for UI tasks)
- `diagnose_error_screenshot` - Analyze error screenshots
- `extract_text_from_screenshot` - Extract text with OCR
- `understand_technical_diagram` - Analyze architecture diagrams
- `analyze_data_visualization` - Extract insights from charts

**When to use**: UI tasks, screenshot analysis, diagram understanding

#### **vision-mcp (4.5v)** - Advanced Image Analysis
- `mcp__4_5v_mcp__analyze_image` - Advanced AI vision model for image understanding

**When to use**: Complex image analysis requiring detailed understanding

#### **zai-web-search-prime** - Web Search
- `mcp__web-search-prime__webSearchPrime` - Search for latest information, docs, tutorials

**When to use**:
- Finding latest documentation (post-2024)
- Researching best practices
- Finding examples and tutorials
- Checking library versions

#### **chrome-dev-tools** - Browser Analysis
- Analyze running application
- Inspect network requests
- Debug performance issues
- Examine DOM and styles

**When to use**: Web application tasks, performance debugging

### 4. Understand Existing Patterns

Identify:

- **File Structure**: Where files are placed
- **Naming Conventions**: Files, variables, functions
- **Import Patterns**: How modules import each other
- **Error Handling**: Error propagation and logging
- **Testing**: Test patterns and conventions
- **State Management**: How state is managed

### 5. Document Findings

Create analysis report:

```markdown
# Analysis Report

## Codebase Structure
<Directory tree overview>

## Relevant Files
- `path/to/file1.ts` - <purpose>
- `path/to/file2.ts` - <purpose>

## Existing Patterns

### File Organization
<How files are organized>

### Code Style
<Conventions observed>

### Import Patterns
<How imports work>

### Error Handling
<Error handling approach>

### State Management
<State management approach>

## Dependencies
<External and internal dependencies>

## Potential Issues
<Risks, edge cases, complications>

## Examples
<Reference implementations found>
```

### 6. Save Analysis

Save to `.predator/runs/${timestamp}/01_ANALYZE.md`

### Output

```
✅ ANALYZE COMPLETE
- Codebase structure mapped
- ${N} relevant files identified
- Existing patterns documented
- Analysis saved to: .predator/runs/${timestamp}/01_ANALYZE.md

Next: 02_PLAN
```
