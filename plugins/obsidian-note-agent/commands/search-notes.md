---
description: Search for notes across one or multiple Obsidian vaults
argument-hint: <search-query> [--vault=<vault-name|all>]
---

<objective>
Search for notes across vaults and return matching files with context and relevance.
</objective>

<process>
1. **Parse Arguments**:
   - Extract search query from #$ARGUMENTS
   - Parse flags: `--vault=<name|all>`, `--type=<type>`, `--limit=<n>`
   - Determine search scope (single vault or all vaults)

2. **Determine Search Scope**:
   - If `--vault=all`: search across all detected vaults
   - If `--vault=<name>`: search in specified vault only
   - If no flag: search current vault or ask which vault

3. **Execute Search**:
   - Use file system search to find .md files
   - Search in:
     - File names
     - YAML frontmatter
     - File content
     - Tags (#tag format)
   - Rank results by relevance:
     - Exact filename match = highest
     - Frontmatter match = high
     - Title match = medium
     - Content match = normal

4. **Filter Results**:
   - Apply `--type` filter if specified (inbox, project, resource, etc.)
   - Apply `--limit` to cap results (default: 20)
   - Remove duplicates

5. **Format Output**:
   - Display results with:
     - File path (relative to vault)
     - Matching snippet with context
     - Relevance score
     - Vault name (if multi-vault)
   - Group results by vault
   - Show total match count
</process>

<rules>
- Always search case-insensitive
- Support partial word matching
- Show file paths relative to vault root
- Limit results to prevent overwhelming output
- Prioritize recent files when relevance is equal
- Exclude hidden files and folders
- Don't search in .obsidian folder
</rules>

<examples>
# Search all vaults
/search-notes "authentication" --vault=all
→ Finds all notes mentioning "authentication" across all vaults

# Search specific vault
/search-notes "ClientXYZ" --vault=work
→ Searches only in work vault

# Search by type
/search-notes "meeting" --type=inbox
→ Only searches in Inbox folder

# Limited results
/search-notes "API" --limit=10
→ Returns top 10 results

# Search current vault
/search-notes "budget"
→ Searches in current/auto-detected vault
</examples>

<success_criteria>
- Returns relevant matches from specified scope
- Shows file paths and context snippets
- Respects vault and type filters
- Results ranked by relevance
- Output is clear and actionable
- Performance acceptable for large vaults
</success_criteria>
