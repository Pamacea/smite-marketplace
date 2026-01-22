---
description: Unified note management for Obsidian vaults with write, format, and search capabilities
argument-hint: [-w|-f|-s] [type] [content|query]
---

# /note - Unified Obsidian Note Management

Complete note management system for Obsidian vaults with template support, multi-vault capabilities, and intelligent formatting.

## 🎯 Note Workflow

Three primary operations for note management:

```bash
# Write notes
/note -w <type> <content>
/note --write inbox "Meeting with bank tomorrow at 3pm"

# Format content
/note -f <template|free> <content>
/note --format meeting "Discussed project timeline, decision: use TypeScript"

# Search notes
/note -s <query> [--vault=<name|all>]
/note --search "authentication" --vault=all
```

---

## Operations

### Write Notes (`-w` or `--write`)

Create or update notes in Obsidian vaults with automatic template application.

**Note Types:**
- `inbox` - Quick capture notes
- `project` - Project briefs and documentation
- `technical` - Technical notes and code documentation
- `meeting` - Meeting notes with decisions and action items
- `resource` - Resources, cheat sheets, and references

**Flags:**
- `--vault=<name>` - Target specific vault
- `--overwrite` - Skip confirmation when overwriting

**Examples:**
```bash
# Quick capture in Inbox
/note -w inbox Meeting with bank tomorrow at 3pm
# Creates: Inbox/2024-01-15-meeting.md

# Create project brief
/note -w project ClientXYZ "Website redesign project, budget 5k"
# Creates: Projects/Clients/ClientXYZ/brief.md

# Add technical notes
/note -w technical ClientXYZ "Setup JWT authentication with refresh tokens"
# Appends: Projects/Clients/ClientXYZ/Notes Techniques.md

# In specific vault
/note -w --vault=work project ClientABC "Mobile app development"
# Creates: vaults/work/Projects/Clients/ClientABC/brief.md
```

---

### Format Content (`-f` or `--format`)

Format text using templates or apply intelligent free-form markdown styling.

**Format Types:**
- `template` - Use specific template structure
- `free` - Intelligent markdown formatting
- `meeting`, `project`, `technical` - Predefined templates

**Flags:**
- `--output=<file>` - Save to file instead of terminal
- `--output=clipboard` - Copy to clipboard
- `--template=<name>` - Use specific template

**What Free-Form Formatting Does:**
- Converts URLs to proper markdown links
- Formats lists consistently
- Adds proper headings hierarchy
- Creates tables from structured data
- Formats code blocks with language tags
- Adds appropriate spacing between sections
- Detects and formats code blocks
- Adds YAML frontmatter if missing

**Examples:**
```bash
# Format using specific template
/note -f meeting "Discussed project timeline. Decision: use TypeScript. Action: John to setup repo."
# Outputs formatted meeting note with structure

# Free-form formatting
/note -f free "API endpoints: GET /users, POST /users. Auth needed. Returns JSON."
# Outputs formatted markdown with proper sections

# Format and save to file
/note -f free "Project notes..." --output=Projects/notes.md

# Use custom template
/note -f --template=custom "Content here..."
```

---

### Search Notes (`-s` or `--search`)

Search for notes across one or multiple Obsidian vaults.

**Searches In:**
- File names
- YAML frontmatter
- File content
- Tags (#tag format)

**Flags:**
- `--vault=<name|all>` - Search specific vault or all vaults
- `--type=<type>` - Filter by note type (inbox, project, etc.)
- `--limit=<n>` - Limit results (default: 20)

**Ranking:**
- Exact filename match = highest
- Frontmatter match = high
- Title match = medium
- Content match = normal

**Examples:**
```bash
# Search all vaults
/note -s "authentication" --vault=all
# Finds all notes mentioning "authentication" across all vaults

# Search specific vault
/note -s "ClientXYZ" --vault=work
# Searches only in work vault

# Search by type
/note -s "meeting" --type=inbox
# Only searches in Inbox folder

# Limited results
/note -s "API" --limit=10
# Returns top 10 results

# Search current vault
/note -s "budget"
# Searches in current/auto-detected vault
```

---

## Multi-Vault Support

### Auto-Detection
The system automatically detects vaults from parent directories (subdirectories with `.obsidian` folder).

### Manual Selection
Use `--vault=<name>` flag to specify target vault.

### Configuration
Vaults are configured in `config/vaults.json`:
```json
{
  "vaults": [
    {
      "name": "personal",
      "path": "/path/to/vault",
      "enabled": true
    }
  ]
}
```

---

## Templates

### Available Templates
- `inbox.md` - Quick capture notes
- `project-brief.md` - Project documentation
- `technical-notes.md` - Technical documentation
- `meeting.md` - Meeting notes structure
- `resource.md` - Resources and references

### Variable Substitution
Templates support variables:
- `{{date}}` - Current date (YYYY-MM-DD)
- `{{datetime}}` - Date and time
- `{{title}}` - Note title
- `{{content}}` - Note content
- `{{clientName}}` - Client/project name
- `{{projectName}}` - Project name
- `{{overview}}` - Project overview
- `{{context}}` - Additional context

---

## File Conflict Handling

### Inbox Notes
If file exists: Move to `Inbox/Cleaned/` before creating new one

### Project Notes
If `brief.md` exists: Ask to overwrite or append to `Notes Techniques.md`

### Resource Notes
If file exists: Append with timestamp separator

---

## Output Files

| Operation | File Location | Purpose |
|-----------|---------------|---------|
| Write | `<vault>/Inbox/YYYY-MM-DD-title.md` | Quick notes |
| Write | `<vault>/Projects/Clients/<Client>/brief.md` | Project briefs |
| Write | `<vault>/Projects/Clients/<Client>/Notes Techniques.md` | Technical notes |
| Format | Terminal or `--output=<path>` | Formatted content |
| Search | Terminal with results | Search results |

---

## Integration

**Works with:**
- Multi-vault setups
- Obsidian (vault detection via `.obsidian` folder)
- Template system with variable substitution

**Best used for:**
- Quick note capture
- Project documentation
- Meeting notes
- Technical documentation
- Resource management

---

## Version

**Version**: 4.0.0 (Unified) | **Last Updated**: 2025-01-22

**Changes:**
- Merged `/note`, `/note:format`, `/search-notes` into single command
- Added flag-based operations (`-w`, `-f`, `-s`)
- Maintained all original functionality
