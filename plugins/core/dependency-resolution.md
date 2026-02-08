# SMITE Dependency Resolution

Standard patterns for handling plugin and MCP tool dependencies with graceful degradation.

---

## Plugin Dependency Pattern

### Checking for Required Dependencies

```markdown
## Dependency Check

Before executing, verify required plugins are available:

1. **smite-core** - Required for shared templates
2. **toolkit** - Optional, fallback to manual if unavailable

### If smite-core is missing:
```

Error: This command requires smite-core plugin.
Install with: /plugin install smite-core
```

### If toolkit is missing:
```

⚠️  Toolkit plugin unavailable. Using manual search fallback.
For optimal performance (75% token savings), install toolkit:
/plugin install toolkit
```
```

---

## MCP Tool Availability Pattern

### Before Using MCP Tools

```markdown
## MCP Tool Check

This command uses the following MCP tools:
- `mcp__web-search-prime__webSearchPrime` - For design research
- `mcp__4_5v_mcp__analyze_image` - For visual analysis

### If MCP tools are unavailable:

1. Inform the user clearly which tool is missing
2. Provide alternative manual workflow
3. Do NOT crash or fail silently

Example fallback:
```
⚠️  WebSearch MCP unavailable. Using manual research mode.
Please provide design references manually.
```
```

---

## Feature Detection API

### Detecting Toolkit Availability

```bash
# Check if toolkit is available
if /toolkit --help >/dev/null 2>&1; then
  HAS_TOOLKIT=true
else
  HAS_TOOLKIT=false
fi

# Use toolkit if available
if [ "$HAS_TOOLKIT" = true ]; then
  /toolkit search "$query"
else
  # Fallback to grep/rg
  rg "$query" || grep -r "$query"
fi
```

### Detecting MCP Tools

```markdown
<!-- Check for Vision MCP -->
Try using `mcp__4_5v_mcp__analyze_image` first.
If tool unavailable, request user to:
1. Describe the image manually
2. Use an alternative image analysis tool
3. Skip visual analysis step
```

---

## Graceful Degradation Levels

| Level | Behavior | When to Use |
|-------|----------|-------------|
| **Fatal** | Stop execution with clear error | Required dependency missing |
| **Warning** | Continue with degraded functionality | Optional dependency missing |
| **Silent** | Use fallback without notification | Minor optimization unavailable |

---

## Error Message Templates

### Required Dependency Missing
```markdown
❌ **Required Plugin Missing**

This command requires `{{PLUGIN_NAME}}` plugin.

**Install with:**
```
/plugin install {{PLUGIN_NAME}}
```

**Alternative:** Use {{FALLBACK_COMMAND}} for limited functionality.
```

### Optional Dependency Missing
```markdown
⚠️  **Optional Plugin Unavailable**

`{{PLUGIN_NAME}}` plugin is not installed. Some features may be limited.

**For best experience, install:**
```
/plugin install {{PLUGIN_NAME}}
```

**Current session:** Using {{FALLBACK_MODE}} mode (may use more tokens).
```

### MCP Tool Missing
```markdown
⚠️  **MCP Tool Unavailable**

`{{MCP_TOOL_NAME}}` is not accessible.

**Affected features:**
- {{FEATURE_1}}
- {{FEATURE_2}}

**Manual alternative:** {{MANUAL_WORKFLOW}}
```

---

## Implementation Checklist

When adding dependencies to a command:

- [ ] Add to `dependencies.required` or `dependencies.optional` in plugin.json
- [ ] Add to `mcp.required` or `mcp.optional` in plugin.json
- [ ] Add dependency check section to command documentation
- [ ] Implement fallback behavior for optional dependencies
- [ ] Add clear error messages for required dependencies
- [ ] Test with and without dependencies present

---

**Version**: 1.0.0 | **Last Updated**: 2025-01-23
