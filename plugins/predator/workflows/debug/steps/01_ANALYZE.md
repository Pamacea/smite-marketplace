# 01_ANALYZE - Bug Analysis

## Instructions

### 1. Gather Error Context

Collect all available error information:

- **Stack Trace**: Full error stack
- **Error Message**: Exact error text
- **Reproduction Steps**: How to trigger the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, Node version, OS, etc.

### 2. Examine Stack Traces

Parse error stack to identify:

```
Stack Trace Analysis:
- Error type: ${type}
- Error message: ${message}
- File: ${file}
- Line: ${line}
- Column: ${column}
- Function: ${function}

Call Stack:
1. ${function} (${file}:${line})
2. ${function} (${file}:${line})
3. ${function} (${file}:${line})
```

### 3. Understand Expected vs Actual

Document the discrepancy:

```markdown
## Behavior Analysis

### Expected Behavior
${what_should_happen}

### Actual Behavior
${what_actually_happens}

### Impact
${severity and impact}
```

### 4. Identify Error Patterns

Look for common patterns:

- **Type Errors**: Wrong types, undefined, null
- **Async Issues**: Race conditions, timing, promises
- **State Issues**: Wrong state, stale data
- **API Issues**: Wrong endpoints, params, parsing
- **Logic Errors**: Wrong algorithms, conditions

### 5. Search Codebase

Find related code:

```bash
# Search error message
grep -r "${error_message}" src/

# Search error type
grep -r "${error_type}" src/

# Find file from stack
ls -la ${error_file}

# Find related functions
grep -r "${function_name}" src/
```

### 6. Use Available MCP Tools

Leverage these MCP tools for enhanced bug analysis:

#### **zai-mcp-server** - Error Analysis
- `diagnose_error_screenshot` - Analyze error screenshots for debugging
- `extract_text_from_screenshot` - Extract text from error screens with OCR
- `analyze_image` - General analysis of UI/screenshots showing bugs

**When to use**: Error screenshots, UI bugs, visual issues

#### **vision-mcp (4.5v)** - Advanced Image Analysis
- `mcp__4_5v_mcp__analyze_image` - Deep analysis of complex error screenshots

**When to use**: Complex visual bugs requiring detailed understanding

#### **zai-web-search-prime** - Error Research
- `mcp__web-search-prime__webSearchPrime` - Search for similar errors, solutions, documentation

**When to use**:
- Finding error solutions online
- Researching similar bugs
- Finding documentation for error codes
- Checking known issues in libraries

#### **chrome-dev-tools** - Live Debugging
- Analyze running application with the bug
- Inspect console errors and network requests
- Debug performance issues
- Examine state during bug occurrence

**When to use**: Reproducible bugs in running applications

### 7. Document Findings

```markdown
# Bug Analysis Report

## Error Information
- Type: ${type}
- Message: ${message}
- File: ${file}:${line}:${column}
- Function: ${function}

## Stack Trace
\`\`\`
${stack_trace}
\`\`\`

## Reproduction Steps
1. ${step1}
2. ${step2}
3. ${step3}

## Expected vs Actual
### Expected
${expected}

### Actual
${actual}

## Root Cause Hypothesis
${preliminary_hypothesis}

## Relevant Files
- ${file1} - ${purpose}
- ${file2} - ${purpose}
- ${file3} - ${purpose}

## Error Pattern
${identified_pattern}
```

### 8. Save Analysis

Save to `.claude/.smite/.predator/debug/runs/${ts}/01_ANALYZE.md`

### Output

```
🔍 ANALYZE COMPLETE
Error: ${type} - ${message}
Location: ${file}:${line}
Pattern: ${pattern}
Hypothesis: ${preliminary_hypothesis}

Analysis saved to: .claude/.smite/.predator/debug/runs/${ts}/01_ANALYZE.md

Next: 02_PLAN (create investigation strategy)
```
