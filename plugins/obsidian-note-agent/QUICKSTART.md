# Obsidian Note Agent - Quick Start

## 🚀 Getting Started

### Basic Usage

```bash
# Quick capture
/note inbox Meeting tomorrow at 3pm

# Create project brief
/note project ClientXYZ "Website redesign, budget 5k"

# Add technical notes
/note technical ClientXYZ "Setup JWT authentication"

# Meeting notes
/note meeting ClientXYZ "Sprint planning"

# Resource/Cheat sheet
/note resource "React Server Components guide"

# Search all vaults
/search-notes "authentication" --vault=all
```

### Multi-Vault

```bash
# Work with specific vault
/note --vault=work project ClientA "Mobile app"

# Search across vaults
/search-notes "important" --vault=all
```

### Formatting

```bash
# Template-based format
/note:format meeting "Discussed timeline, decided TypeScript"

# Free-form format
/note:format free "API: GET /users, POST /users"

# Format and save
/note:format free "Notes..." --output=Projects/notes.md
```

## 📁 Folder Structure

```
Inbox/
├── Cleaned/          # Old inbox notes
Ressources/
├── Cheat Sheets/
├── Code Snippets/
Projects/
├── Clients/
│   └── ClientName/
│       ├── brief.md
│       └── Notes Techniques.md
Domaine/
├── Administratif/
├── Marketing/
└── Veille Technique/
```

## 📝 Note Types

| Type | Template | Location | Conflict Handling |
|------|----------|----------|-------------------|
| `inbox` | inbox.md | Inbox/YYYY-MM-DD-title.md | Move to Cleaned/ |
| `project` | project-brief.md | Projects/Clients/Name/brief.md | Ask to overwrite |
| `technical` | technical-notes.md | Projects/Clients/Name/Notes Techniques.md | Append |
| `meeting` | meeting.md | Projects/Clients/Name/YYYY-MM-DD-meeting.md | Create timestamped |
| `resource` | resource.md | Ressources/Category/title.md | Append |

## 🔧 Configuration

Edit files in `config/`:
- `folder-structure.json` - Custom folders
- `vaults.json` - Vault definitions
- `templates.json` - Template mappings

## 🎨 Templates Variables

- `{{date}}` - 2024-01-15
- `{{datetime}}` - 2024-01-15 14:30
- `{{time}}` - 14:30
- `{{clientName}}` - Client name
- `{{projectName}}` - Project name
- `{{title}}` - Note title
- `{{content}}` - Main content

## 📚 Full Documentation

See `README.md` for complete documentation.
