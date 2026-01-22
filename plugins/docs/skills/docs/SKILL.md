---
name: docs
description: Automatic documentation maintenance via MCP (README, OpenAPI, JSDoc)
version: 3.1.0
---

# Docs Skill

## Mission

Automatic documentation maintenance via Model Context Protocol (MCP), analyzing code changes and synchronizing documentation artifacts.

## Core Workflow

1. **Input**: MCP tool invocation or post-validation trigger
2. **Process**:
   - Monitor `package.json` for dependency changes
   - Scan `src/` for new modules/directories
   - Parse README.md with unified/remark
   - Generate section updates (Installation, Architecture, Project Structure)
   - Preserve manual edits with `<!-- SMITE:MANUAL -->` markers
   - Apply updates with atomic writes (temp file + rename)
3. **Output**: Updated README with diff preview

## Key Principles

- **Automatic synchronization**: Triggered by Quality Gate after code validation
- **Manual edit preservation**: Markers protect user-written content
- **Safe updates**: JSON validation, atomic writes, backup creation
- **Diff preview**: Show changes before applying
- **MCP protocol**: Standard Model Context Protocol implementation

## Tools

### `update_readme_architecture`
Update README sections based on project structure:
- **Parameters**: projectPath, readmePath, sectionsToUpdate, generateDiff, preserveMarkers
- **Sections**: installation, architecture, structure, all
- **Output**: Success status, updated sections, dependency/module changes, diff

## Integration

- **Quality Gate**: Post-validation trigger after code changes
- **MCP server**: Runs on stdio, implements MCP specification
- **Architecture**: dependency-monitor → structure-scanner → readme-parser → readme-updater

## Configuration

- **Manual edit markers**: `<!-- SMITE:MANUAL:START -->` ... `<!-- SMITE:MANUAL:END -->`
- **Auto-generated markers**: `<!-- SMITE:AUTO -->` for regeneratable content
- **Preservation**: Manual edits protected, auto sections regenerated

## Error Handling

- **Invalid JSON**: Parse error reported, update blocked
- **Missing README**: Create with basic structure
- **Parse failure**: Report line/column, suggest fix
- **Atomic writes**: Temp file + rename prevents corruption
- **Backup rollback**: Restore original on critical errors

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*

**Note:** Previously named `docs-editor-mcp`, now `docs`
