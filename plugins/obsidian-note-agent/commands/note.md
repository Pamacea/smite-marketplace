---
description: Create or update notes in Obsidian vaults with templates
argument-hint: <note-type> <note-content>
---

<objective>
Create or update a note in the Obsidian vault with automatic template application and folder placement.
</objective>

<process>
1. **Parse Arguments**:
   - Extract note type: `inbox`, `project`, `technical`, `meeting`, `resource`
   - Extract content and context from #$ARGUMENTS
   - Parse optional flags: `--vault=<name>`, `--overwrite`

2. **Determine Location**:
   - If `--vault` specified: use that vault
   - Otherwise: auto-detect current vault or ask user
   - Load folder structure from config/folder-structure.json
   - Determine target folder based on note type

3. **Select Template**:
   - Load template from templates/ directory
   - Apply variable substitution ({{date}}, {{clientName}}, etc.)
   - For project notes: check for existing client folder

4. **Handle Conflicts**:
   - **Inbox**: If file exists, move to Inbox/Cleaned/ before creating
   - **Projects**: If brief.md exists, ask to overwrite or append to Notes Techniques.md
   - **Resources**: If exists, append with timestamp separator

5. **Create File**:
   - Create missing folders automatically
   - Write content with proper YAML frontmatter
   - Report file path to user

6. **Update Index** (optional):
   - Add to relevant index files if configured
</process>

<rules>
- Always validate vault path exists before operations
- Create missing folders in the structure automatically
- Ask before creating new top-level folders not in structure
- Preserve existing YAML frontmatter when updating
- Use ISO 8601 date format: YYYY-MM-DD
- For Inbox files, use format: YYYY-MM-DD-title.md
- For Projects, use: ClientName/brief.md or ClientName/Notes Techniques.md
- Always confirm before overwriting unless --overwrite flag
</rules>

<examples>
# Quick capture in Inbox
/note inbox Meeting with bank tomorrow at 3pm
→ Creates: Inbox/2024-01-15-meeting.md

# Create project brief
/note project ClientXYZ "Website redesign project, budget 5k"
→ Creates: Projects/Clients/ClientXYZ/brief.md

# Add technical notes
/note technical ClientXYZ "Setup JWT authentication with refresh tokens"
→ Appends: Projects/Clients/ClientXYZ/Notes Techniques.md

# In specific vault
/note --vault=work project ClientABC "Mobile app development"
→ Creates: vaults/work/Projects/Clients/ClientABC/brief.md

# Resource/cheat sheet
/note resource "React Server Components: no SSR by default"
→ Creates: Ressources/Cheat Sheets/react-server-components.md
</examples>

<success_criteria>
- Note created in correct location based on type
- Template properly applied with variables substituted
- YAML frontmatter valid and complete
- File conflicts handled appropriately
- Missing folders created automatically
- User informed of file path
</success_criteria>
