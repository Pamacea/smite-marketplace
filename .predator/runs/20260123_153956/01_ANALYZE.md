# Analysis Report - Statusline Plugin

## Codebase Structure

Smite is a plugin-based system for Claude Code with the following structure:

```
smite/
├── .claude/                    # Claude Code configuration
│   ├── hooks.json             # Global hooks
│   └── settings.local.json    # Local settings
├── plugins/                    # Plugin marketplace
│   ├── basics/                # Essential commands
│   ├── auto-rename/           # Session renaming
│   ├── predator/              # Workflow orchestration
│   ├── ralph/                 # Multi-agent orchestrator
│   ├── mobs/                  # Spec-first development
│   ├── toolkit/               # Semantic search
│   └── shell/                 # Shell aliases
└── docs/                      # Documentation
```

## Plugin Structure Pattern

Based on `plugins/basics/` and `plugins/auto-rename/`:

```
plugins/[plugin-name]/
├── .claude-plugin/
│   ├── plugin.json           # Plugin metadata (required)
│   └── hooks.json            # Hook definitions (optional)
├── commands/                  # Slash commands (optional)
│   └── *.md                  # Command definitions
├── hooks/                     # Hook scripts (optional)
│   └── *.js                  # Node.js scripts
├── skills/                    # Skills (optional)
│   └── */
│       └── SKILL.md          # Skill definition
└── README.md                  # Plugin documentation (required)
```

## Relevant Files

### Plugin System
- `.claude/settings.local.json` - Claude Code settings with hooks configuration
- `.claude/hooks.json` - Global hooks (PostToolUse, SubagentStop, PreToolUse)
- `plugins/README.md` - Plugin marketplace documentation

### Example Plugins
- `plugins/basics/.claude-plugin/plugin.json` - Simple command plugin
- `plugins/auto-rename/.claude-plugin/plugin.json` - Hook-based plugin
- `plugins/auto-rename/hooks/rename-script.js` - Example hook script using Node.js

### Command Format
- `plugins/basics/commands/smite.md` - Example slash command with frontmatter

## Existing Patterns

### File Organization
- Plugins use `.claude-plugin/` folder for metadata
- Commands go in `commands/` with `.md` extension
- Hook scripts go in `hooks/` with `.js` extension
- Skills go in `skills/[name]/SKILL.md`

### Plugin Metadata (plugin.json)
```json
{
  "name": "plugin-name",
  "description": "Plugin description",
  "version": "3.1.0",
  "author": { "name": "Pamacea", "email": "..." },
  "homepage": "https://github.com/Pamacea/smite/tree/main/plugins/...",
  "repository": "https://github.com/Pamacea/smite",
  "license": "MIT",
  "keywords": ["..."],
  "commands": "./commands/",      // For command plugins
  "skills": "./skills/"           // For skill plugins
}
```

### Hook Definitions (plugin.json hooks)
```json
"hooks": {
  "SessionStart": [...],
  "PostToolUse": [...],
  "UserPromptSubmit": [...]
}
```

### Hook Scripts
- Use Node.js
- Read from stdin for JSON input
- Write to stderr for logging (console.error)
- Use `process.exit(0)` for success
- Access `${CLAUDE_PLUGIN_ROOT}` environment variable

### Command Frontmatter
```yaml
---
description: Command description
allowed-tools: Bash, Skill, ...
---

<objective>
...
</objective>
```

## Dependencies

### External
- Node.js (for hook scripts)
- File system APIs (fs, path)

### Internal
- Session data from `~/.claude/sessions/`
- Git repository info
- Claude Code API context (model, tokens, cost, etc.)

## Statusline Requirements

Target format:
```
main • -10414  • Users/.../Projects/smite • Opus 4.5 • $14.7 • 23K • █          • 12% • 1h 43m
```

Components:
1. **branch** - Git branch name (e.g., "main")
2. **insertions** - Git insertions (e.g., "-10414")
3. **path** - Project path (abbreviated)
4. **model** - Model name (e.g., "Opus 4.5")
5. **cost** - Session cost (e.g., "$14.7")
6. **tokens** - Token count (e.g., "23K")
7. **progressbar** - Visual progress bar
8. **percentage** - Context percentage (e.g., "12%")
9. **duration** - Session duration (e.g., "1h 43m")

## Data Sources

### Git Data
- Branch: `git branch --show-current`
- Insertions: `git diff --shortstat` or `git status`

### Session Data
- Location: `~/.claude/sessions/`
- Format: JSON entries with metadata
- Model, tokens, cost, percentage from session metadata

### Context
- Current directory path
- Session start time for duration

## Technical Considerations

### Lightweight Implementation
- Pure bash/Node.js - no heavy dependencies
- Cache git data to avoid frequent commands
- Minimal API calls

### Display Strategy
Since Claude Code doesn't support custom statuslines natively, this will likely be:
1. A command (`/statusline`) that displays current status
2. A hook that updates on certain events
3. A skill that can format and display the status

## Potential Issues

1. **No native statusline API** - Claude Code doesn't have a statusline hook
2. **Session data format** - Need to verify exact session JSON structure
3. **Cross-platform** - Path handling differs between Windows/Linux/macOS
4. **Performance** - Frequent git commands could slow down session

## Implementation Approach

Given the constraint that Claude Code doesn't have native statusline support, the most practical approach is:

1. **Slash Command** (`/statusline`) - Display status on demand
2. **Hook-based updates** - Optional hook to show status after certain actions
3. **Skill** - Formatted status display with optional auto-refresh

This keeps it lightweight and doesn't fight platform limitations.
