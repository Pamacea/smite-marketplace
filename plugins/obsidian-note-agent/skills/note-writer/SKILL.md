---
description: Intelligent note writing and formatting agent for Obsidian vaults
mission: Create, format, and manage notes in Obsidian vaults with template support and multi-vault capabilities
---

# 🎯 Note Writer Skill

## Mission

Provide intelligent note writing, formatting, and management capabilities for Obsidian vaults through terminal commands. Support multiple vaults, template-based formatting, and automatic folder organization.

## 🚀 Workflows

### Workflow 1: Create Structured Note

**Trigger**: User runs `/note <type> <content>`

**Steps**:
1. Parse note type (inbox, project, technical, meeting, resource)
2. Determine target vault and folder structure
3. Load appropriate template
4. Apply variable substitution
5. Handle file conflicts (Inbox → Cleaned/, Projects → overwrite/append)
6. Create missing folders
7. Write file with proper YAML frontmatter
8. Report success with file path

**Success Criteria**:
- Note created in correct location
- Template properly applied
- YAML frontmatter valid
- Folder structure created
- User informed of result

### Workflow 2: Format Content

**Trigger**: User runs `/note:format <template|free> <content>`

**Steps**:
1. Determine formatting mode (template or free)
2. **Template mode**: Load specified template, apply to content
3. **Free mode**: Apply intelligent markdown formatting
4. Format headings, lists, code blocks, links
5. Clean up whitespace and formatting
6. Output to terminal, file, or clipboard

**Success Criteria**:
- Content properly formatted
- Original meaning preserved
- Markdown best practices followed
- Output delivered correctly

### Workflow 3: Search Vaults

**Trigger**: User runs `/search-notes <query> [--vault=<scope>]`

**Steps**:
1. Parse search query and filters
2. Determine search scope (single vault or all)
3. Search filenames, frontmatter, content, tags
4. Rank results by relevance
5. Apply filters (type, limit)
6. Format output with context snippets
7. Group by vault if multi-vault

**Success Criteria**:
- Relevant matches found
- Results ranked properly
- Context provided
- Filters respected
- Clear output format

### Workflow 4: Multi-Vault Management

**Trigger**: Session start or vault detection needed

**Steps**:
1. Scan current directory for subdirectories with .obsidian folder
2. Load config/vaults.json configuration
3. Register available vaults
4. Support vault selection via --vault flag
5. Handle vault-specific configurations

**Success Criteria**:
- Vaults detected correctly
- Configuration loaded
- Multi-vault operations work
- Vault-specific settings respected

## 🎨 Capabilities

### Note Types
- **inbox**: Quick capture, temporary notes
- **project**: Client projects with briefs and technical notes
- **technical**: Implementation details, code snippets
- **meeting**: Meeting notes with decisions and action items
- **resource**: Cheat sheets, reference materials

### Formatting Modes
- **Template-based**: Apply predefined structure
- **Free-form**: Intelligent markdown formatting

### Multi-Vault Support
- Auto-detect vaults from parent directory
- Explicit vault selection with --vault flag
- Search across all vaults with --vault=all
- Vault-specific folder structures

### File Operations
- Create new files with templates
- Append to existing files
- Move conflicts to Cleaned/ (Inbox)
- Overwrite with confirmation (Projects)
- Preserve YAML frontmatter

## 📋 Templates

### Variable Substitution
- `{{date}}` - Current date (ISO 8601)
- `{{datetime}}` - Current date and time
- `{{title}}` - Note title
- `{{clientName}}` - Client/project name
- `{{projectName}}` - Project name
- `{{overview}}` - Project overview
- `{{content}}` - Main content
- `{{context}}` - Additional context

### Default Templates
- `inbox.md` - Quick capture format
- `project-brief.md` - Client project brief
- `technical-notes.md` - Technical documentation
- `meeting.md` - Meeting notes structure
- `resource.md` - Reference/cheat sheet format

## 🎯 Best Practices

1. **Always validate** vault path before operations
2. **Ask confirmation** before destructive operations
3. **Follow folder structure** defined in config
4. **Preserve existing** YAML frontmatter
5. **Use ISO 8601** date format (YYYY-MM-DD)
6. **Clean up** whitespace and formatting
7. **Provide context** in search results
8. **Handle errors** gracefully with clear messages

## 🚨 Error Handling

- **Vault not found**: Ask user to specify or create
- **Folder missing**: Create automatically (except top-level)
- **File exists**: Follow conflict handling rules
- **Template missing**: Use default format
- **Invalid YAML**: Fix or recreate frontmatter
- **Permission denied**: Report error and suggest fix

## ✅ Quality Checks

Before completing any operation:
- [ ] Vault path exists and is accessible
- [ ] Folder structure is valid
- [ ] Template loaded successfully
- [ ] Variables substituted
- [ ] YAML frontmatter valid
- [ ] File path determined
- [ ] Conflicts handled appropriately
- [ ] User informed of result

## 🎓 Learning & Improvement

This skill improves by:
- Learning user preferences for templates
- Adapting to custom folder structures
- Recognizing recurring patterns
- Suggesting templates based on context
- Optimizing search relevance
