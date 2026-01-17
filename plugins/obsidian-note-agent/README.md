# Obsidian Note Agent

AI-powered note writing and formatting agent for Obsidian vaults with multi-vault support.

## Overview

Obsidian Note Agent is a Claude Code plugin that helps you create, format, and manage notes in your Obsidian vaults directly from the terminal. It provides intelligent templates, multi-vault support, and automatic folder organization.

## Features

- **Quick Note Creation**: Create notes with templates for different use cases
- **Multi-Vault Support**: Work with multiple vaults in the same session
- **Template System**: Pre-built templates with variable substitution
- **Smart Formatting**: Format existing text using templates or free-form styling
- **Cross-Vault Search**: Search across all your vaults at once
- **Auto-Organization**: Automatic folder structure creation and management

## Installation

1. Clone or copy this plugin to your Claude Code plugins directory:
```bash
plugins/obsidian-note-agent/
```

2. The plugin will be automatically loaded by Claude Code.

## Configuration

### Folder Structure

The default folder structure (auto-entrepreneur setup):

```
├── Inbox/
│   └── Cleaned/
├── Ressources/
│   ├── Cheat Sheets/
│   └── Code Snippets/
├── Projects/
│   └── Clients/
│       ├── ClientName/
│       │   ├── brief.md
│       │   └── Notes Techniques.md
└── Domaine/
    ├── Administratif/
    ├── Marketing/
    └── Veille Technique/
```

Customize this in `config/folder-structure.json`.

### Vault Configuration

Vaults are auto-detected on session start. You can also manually configure them in `config/vaults.json`:

```json
{
  "vaults": [
    {
      "name": "personal",
      "path": "./vaults/personal",
      "isVault": true
    },
    {
      "name": "work",
      "path": "./vaults/work",
      "isVault": true
    }
  ]
}
```

## Usage

### Creating Notes

#### Quick Capture (Inbox)

```bash
/note inbox Meeting with bank tomorrow at 3pm
```

Creates: `Inbox/2024-01-15-meeting.md`

#### Project Brief

```bash
/note project ClientXYZ "Website redesign project, budget 5k"
```

Creates: `Projects/Clients/ClientXYZ/brief.md`

#### Technical Notes

```bash
/note technical ClientXYZ "Setup JWT authentication with refresh tokens"
```

Appends: `Projects/Clients/ClientXYZ/Notes Techniques.md`

#### Meeting Notes

```bash
/note meeting ClientXYZ "Sprint planning meeting"
```

Creates: `Projects/Clients/ClientXYZ/2024-01-15-meeting-sprint-planning.md`

#### Resource/Cheat Sheet

```bash
/note resource "React Server Components: no SSR by default"
```

Creates: `Ressources/Cheat Sheets/react-server-components.md`

### Multi-Vault Operations

#### Specify Vault

```bash
/note --vault=work project ClientABC "Mobile app development"
```

Creates note in the `work` vault.

#### Search Across Vaults

```bash
/search-notes "authentication" --vault=all
```

Searches for "authentication" across all vaults.

```bash
/search-notes "ClientXYZ" --vault=personal
```

Searches only in the `personal` vault.

### Formatting Text

#### Template-Based Formatting

```bash
/note:format meeting "Discussed project timeline. Decision: use TypeScript. Action: John to setup repo."
```

Formats the text using the meeting template structure.

#### Free-Form Formatting

```bash
/note:format free "API endpoints: GET /users, POST /users. Auth needed. Returns JSON."
```

Applies intelligent markdown formatting to the text.

#### Format and Save

```bash
/note:format free "Project notes..." --output=Projects/notes.md
```

Formats and saves to the specified file.

## Templates

### Available Templates

1. **inbox** - Quick capture with processing checklist
2. **project-brief** - Client project brief with all details
3. **technical-notes** - Technical documentation with code snippets
4. **meeting** - Meeting notes with decisions and action items
5. **resource** - Reference/cheat sheet format

### Template Variables

Templates support variable substitution:

- `{{date}}` - Current date (YYYY-MM-DD)
- `{{datetime}}` - Current date and time
- `{{time}}` - Current time (HH:mm)
- `{{title}}` - Note title
- `{{clientName}}` - Client/project name
- `{{projectName}}` - Project name
- `{{overview}}` - Project overview
- `{{content}}` - Main content
- `{{context}}` - Additional context

### Custom Templates

You can override default templates by creating custom templates in:

```
.obsidian/note-agent/templates/
```

## Commands

### /note

Create or update notes with templates.

**Usage**:
```bash
/note <type> <content> [--vault=<name>] [--overwrite]
```

**Types**: `inbox`, `project`, `technical`, `meeting`, `resource`

**Examples**:
```bash
/note inbox Quick note
/note project ClientXYZ "Project description"
/note --vault=work technical ClientXYZ "Implementation details"
```

### /note:format

Format text using templates or free-form styling.

**Usage**:
```bash
/note:format <template|free> <text> [--output=<file>]
```

**Examples**:
```bash
/note:format meeting "Meeting notes..."
/note:format free "Unformatted text..."
/note:format free "Text" --output=notes.md
```

### /search-notes

Search for notes across vaults.

**Usage**:
```bash
/search-notes <query> [--vault=<name|all>] [--type=<type>] [--limit=<n>]
```

**Examples**:
```bash
/search-notes "authentication" --vault=all
/search-notes "meeting" --type=inbox
/search-notes "API" --limit=10
```

## File Conflict Handling

The plugin handles file conflicts differently based on the folder:

- **Inbox**: Existing files are moved to `Inbox/Cleaned/` before creating new ones
- **Projects**: Asks to overwrite `brief.md` or append to `Notes Techniques.md`
- **Resources**: Appends content with timestamp separator
- **Domaine**: Appends to existing files

## Folder Structure Configuration

Edit `config/folder-structure.json` to customize:

```json
{
  "default": {
    "Inbox": {
      "subfolders": ["Cleaned"],
      "description": "Quick capture",
      "conflictAction": "move_to_cleaned"
    },
    "Projects": {
      "subfolders": ["Clients"],
      "template": "project-brief",
      "conflictAction": "ask"
    }
  }
}
```

## Vault Detection

The plugin automatically detects vaults by looking for `.obsidian` folders. Detection runs on session start and can be triggered manually:

```bash
node plugins/obsidian-note-agent/scripts/detect-vaults.js
```

## Development

### Plugin Structure

```
obsidian-note-agent/
├── .claude-plugin/
│   └── plugin.json          # Claude Code plugin config
├── commands/                # Terminal commands
│   ├── note.md
│   ├── note_format.md
│   └── search-notes.md
├── skills/                  # Agent skills
│   └── note-writer/
│       └── SKILL.md
├── templates/               # Note templates
├── config/                  # Configuration files
├── scripts/                 # Utility scripts
└── README.md
```

### Adding New Templates

1. Create template file in `templates/`
2. Add entry to `config/templates.json`
3. Update `config/folder-structure.json` if needed

### Modifying Folder Structure

Edit `config/folder-structure.json` to add or modify folders:

```json
{
  "default": {
    "NewFolder": {
      "subfolders": ["Sub1", "Sub2"],
      "description": "Description",
      "conflictAction": "ask"
    }
  }
}
```

## Troubleshooting

### Vault Not Detected

- Ensure vault has `.obsidian` folder
- Check vault path in `config/vaults.json`
- Run detection script manually

### Template Not Found

- Verify template exists in `templates/` directory
- Check template name in `config/templates.json`
- Ensure proper file permissions

### File Creation Fails

- Check folder permissions
- Verify vault path is correct
- Ensure sufficient disk space
- Check for invalid characters in file names

## Examples

### Daily Workflow

```bash
# Morning: Quick capture
/note inbox "Check project status with ClientXYZ"

# During work: Add technical notes
/note technical ClientXYZ "Implemented OAuth2 flow"

# Meeting: Record meeting notes
/note meeting ClientXYZ "Requirements review"

# End of day: Search across vaults
/search-notes "ClientXYZ" --vault=all
```

### Multi-Vault Setup

```bash
# Work with multiple vaults
/note --vault=work project ClientA "Work project"
/note --vault=personal project PersonalProject "Personal project"

# Search all vaults
/search-notes "important" --vault=all
```

## License

MIT

## Author

Pamacea

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.
