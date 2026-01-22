---
description: Format existing text or notes using templates or free-form styling
argument-hint: <template-name | free> <text-to-format>
---

<objective>
Format text using a template or apply free-form markdown formatting to existing content.
</objective>

<process>
1. **Parse Arguments**:
   - Extract format type: template name or `free`
   - Extract text content from #$ARGUMENTS or stdin
   - Parse optional flags: `--output=<file>`, `--template=<name>`

2. **Template-Based Formatting**:
   - If template name specified: load from templates/
   - Apply template structure to the content
   - Substitute variables where present
   - Format content according to template rules

3. **Free-Form Formatting**:
   - Analyze content structure and type
   - Apply intelligent markdown formatting:
     - Convert URLs to proper markdown links
     - Format lists consistently
     - Add proper headings hierarchy
     - Create tables from structured data
     - Format code blocks with language tags
     - Add appropriate spacing between sections

4. **Output Options**:
   - **No --output flag**: Display formatted text in terminal
   - **--output=<file>**: Write to specified file
   - **--output=clipboard**: Copy to clipboard (if supported)

5. **Smart Enhancements** (free mode):
   - Detect and format code blocks
   - Convert bullet points to consistent style
   - Add YAML frontmatter if missing
   - Format dates consistently (ISO 8601)
   - Clean up excessive whitespace
   - Add proper emphasis on important terms
</process>

<rules>
- Preserve original content meaning
- For template mode: follow template structure exactly
- For free mode: apply markdown best practices
- Ask confirmation before overwriting files
- Maintain code block formatting
- Preserve existing YAML frontmatter
- Use consistent heading hierarchy (start with # or ##)
- Don't over-format - keep it readable
</rules>

<examples>
# Format using specific template
/note:format meeting "Discussed project timeline. Decision: use TypeScript. Action: John to setup repo."
→ Outputs formatted meeting note with attendees, decisions, action items

# Free-form formatting
/note:format free "API endpoints: GET /users, POST /users. Auth needed. Returns JSON."
→ Outputs:
## API Endpoints

### GET /users
- Authentication required
- Returns: JSON

### POST /users
- Authentication required
- Returns: JSON

# Format and save to file
/note:format free "Project notes..." --output=Projects/notes.md

# Use custom template
/note:format --template=custom "Content here..."

# Format clipboard content
/note:format free --output=clipboard
→ Reads from stdin, formats, copies to clipboard
</examples>

<success_criteria>
- Content properly formatted according to mode
- Template structure applied correctly (template mode)
- Markdown best practices followed (free mode)
- Original meaning preserved
- Output delivered to correct destination
- Code blocks and special characters preserved
</success_criteria>
