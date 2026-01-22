---
name: note
description: AI-powered note writing and formatting for Obsidian vaults with multi-vault support
version: 3.1.0
---

# Note Skill

## Mission

Intelligent note writing, formatting, and management for Obsidian vaults with template support and multi-vault capabilities.

## Core Workflow

1. **Input**: Command invocation (/note, /note:format, /search-notes)
2. **Process**:
   - Parse command and determine note type or operation
   - Detect target vault and load configuration
   - Load template or apply free-form formatting
   - Substitute variables (date, title, content, etc.)
   - Handle file conflicts (Inbox → Cleaned/, Projects → overwrite/append)
   - Write file with YAML frontmatter
3. **Output**: Created/updated note with file path, or search results

## Key Principles

- **Multi-vault support**: Auto-detect vaults, explicit selection via --vault flag
- **Template-based**: Predefined structures for consistent formatting
- **Intelligent formatting**: Free-form markdown optimization
- **Conflict handling**: Rules-based (Inbox moves conflicts, Projects overwrites)
- **YAML frontmatter**: Valid metadata on all notes

## Workflows

### Create Note
- **Trigger**: `/note <type> <content>`
- **Types**: inbox, project, technical, meeting, resource
- **Output**: Note created in vault with template applied

### Format Content
- **Trigger**: `/note:format <template|free> <content>`
- **Modes**: Template (structured), Free (intelligent markdown)
- **Output**: Formatted content to terminal, file, or clipboard

### Search Vaults
- **Trigger**: `/search-notes <query> [--vault=<scope>]`
- **Scope**: Single vault or all vaults
- **Search**: Filenames, frontmatter, content, tags
- **Output**: Ranked results with context snippets

## Integration

- **SessionStart hook**: Auto-detect vaults from parent directory
- **Config file**: `config/vaults.json` for vault paths and settings
- **Template system**: Variable substitution with {{date}}, {{title}}, {{content}}, etc.

## Configuration

- **Vault detection**: Subdirectories with .obsidian folder
- **Folder structure**: Inbox/, Projects/, Technical/, Meetings/, Resources/
- **Templates**: inbox.md, project-brief.md, technical-notes.md, meeting.md, resource.md
- **Variables**: date, datetime, title, clientName, projectName, overview, content, context

## Error Handling

- **Vault not found**: Ask user to specify or create
- **Folder missing**: Create automatically (except top-level)
- **File exists**: Follow conflict handling rules per note type
- **Template missing**: Use default format
- **Invalid YAML**: Fix or recreate frontmatter

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*

**Note:** Previously named `obsidian-note-agent`, now `note`
