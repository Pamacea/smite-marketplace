# Implementation Plan - Statusline Plugin

## Files to Create

### `plugins/statusline/.claude-plugin/plugin.json`
- **Purpose**: Plugin metadata
- **Dependencies**: None
- **Size**: Small (~20 lines)

### `plugins/statusline/commands/statusline.md`
- **Purpose**: Main slash command to display status
- **Dependencies**: Bash tool
- **Size**: Small (~50 lines)

### `plugins/statusline/hooks/statusline.js`
- **Purpose**: Core logic for gathering and formatting status data
- **Dependencies**: Node.js built-in (fs, path, child_process)
- **Size**: Medium (~200 lines)

### `plugins/statusline/README.md`
- **Purpose**: Plugin documentation
- **Dependencies**: None
- **Size**: Small (~100 lines)

## Acceptance Criteria

### Functional Requirements
- [ ] Display git branch name
- [ ] Display git insertions (or +N/-N format)
- [ ] Display abbreviated project path
- [ ] Display model name (from session)
- [ ] Display session cost (calculated from tokens)
- [ ] Display token count (with K suffix for large numbers)
- [ ] Display visual progress bar (10 chars width)
- [ ] Display context percentage
- [ ] Display session duration (Hh Mm format)
- [ ] Work as `/statusline` command
- [ ] Optional auto-display after tool use

### Non-Functional Requirements
- [ ] Lightweight - no external dependencies
- [ ] Fast - < 100ms execution time
- [ ] Cross-platform (Windows, macOS, Linux)
- [ ] Handles missing data gracefully

### Quality Standards
- [ ] Follows Smite plugin patterns
- [ ] Clear code structure
- [ ] Proper error handling

## Implementation Order

### Phase 1: Plugin Structure
- [ ] Create directory structure
- [ ] Create plugin.json
- [ ] Create README.md

### Phase 2: Core Logic
- [ ] Create statusline.js hook script
- [ ] Implement git data gathering
- [ ] Implement session data parsing
- [ ] Implement status formatting

### Phase 3: Integration
- [ ] Create statusline.md command
- [ ] Test /statusline command
- [ ] Add optional hooks to plugin.json

## Output Format

```
{branch} • {insertions}  • {path} • {model} • ${cost} • {tokens} • {progress} • {percentage} • {duration}
```

Example:
```
main • +123/-45  • ~/Projects/smite • Opus 4.5 • $1.23 • 45K • ████████░░ • 78% • 1h 23m
```

## Risk Assessment

### Medium Risk Items
- **Session data format may vary** - Mitigation: Handle multiple formats, provide defaults
- **Git operations may fail** - Mitigation: Wrap in try/catch, show "N/A" for missing data
- **Windows path handling** - Mitigation: Use path module, test on Windows

### Low Risk Items
- **Performance** - Minimal overhead, only runs on demand
- **Cross-platform** - Using Node.js built-ins ensures compatibility
