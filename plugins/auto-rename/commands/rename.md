---
description: Manually rename the current session with a custom name or auto-generate one
arguments:
  - name: custom name
    description: Optional custom name for the session (max 50 characters)
    required: false
    type: string
---

# Rename Session

Manually rename the current Claude Code session with a custom name or let the AI auto-generate one based on session context.

## Usage

```bash
/rename [custom name]
```

## Examples

### Auto-generate a name
```bash
/rename
```
This will analyze the session and generate a descriptive name like "Fix: bug login" or "Add: API endpoint".

### Custom name
```bash
/rename Working on user authentication
```
This will set the session name to "Working on user authentication".

## How It Works

1. **Auto-generate mode**: Analyzes the session history (first message, recent tools, project context) and generates a concise, descriptive name
2. **Custom mode**: Uses your provided name directly (max 50 characters)

## Name Format

Auto-generated names follow this pattern:
- `Action: Context` (e.g., "Fix: bug login", "Add: API endpoint")

Common action prefixes:
- **Fix**: Bug fixes and error resolution
- **Add**: New features and functionality
- **Update**: Modifications to existing features
- **Delete**: Removal of code or features
- **Refactor**: Code restructuring
- **Debug**: Investigation and debugging
- **Test**: Testing and test creation
- **Docs**: Documentation updates
- **Config**: Configuration changes

## Session Names Storage

Session names are stored as system messages in your session `.jsonl` file, making them visible when you resume sessions.

## Examples

```bash
# Auto-generate based on session context
/rename
# Output: Session renamed to: "Fix: authentication bug"

# Custom short name
/rename API Integration
# Output: Session renamed to: "API Integration"

# Custom descriptive name
/rename Add OAuth2 login flow
# Output: Session renamed to: "Add: OAuth2 login flow"
```

## Notes

- Session names are limited to 50 characters
- Special characters are automatically sanitized
- The rename is immediate and persists across sessions
- You can rename a session multiple times
