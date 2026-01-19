# @smite/docs-editor-mcp

**SMITE Docs Editor MCP** - Automatic documentation maintenance via Model Context Protocol (MCP).

## Overview

Scribe is an MCP server that automatically maintains project documentation by analyzing code changes and synchronizing documentation artifacts. It operates as part of the Smite Quality Gate system, triggering documentation updates after code validation passes.

## Features

### ✅ Implemented

- **README Architecture Updater** (`update_readme_architecture`)
  - Monitors `package.json` for dependency changes
  - Scans `src/` for new modules/directories
  - Updates Installation, Architecture, and Project Structure sections
  - Preserves manual edits with `<!-- SMITE:MANUAL -->` markers
  - Generates markdown diff for review

### 🚧 Planned

- **OpenAPI/Swagger Sync** (`sync_openapi_spec`)
- **JSDoc Generator** (`generate_jsdoc_on_fly`)

## Installation

```bash
cd plugins/docs-editor-mcp
npm install
npm run build
```

## Usage

### As an MCP Server

Start the server:

```bash
npm start
```

The server runs on stdio and implements the [Model Context Protocol](https://modelcontextprotocol.io/specification/2025-06-18/).

### Tool: update_readme_architecture

Update README sections based on project structure:

```json
{
  "name": "update_readme_architecture",
  "arguments": {
    "projectPath": "/path/to/project",
    "readmePath": "README.md",
    "sectionsToUpdate": ["installation", "structure"],
    "generateDiff": true,
    "preserveMarkers": true
  }
}
```

#### Parameters

- `projectPath` (required): Root directory of the project
- `readmePath` (optional): Path to README.md (default: "README.md")
- `sectionsToUpdate` (optional): Which sections to update (default: ["all"])
  - Options: "installation", "architecture", "structure", "all"
- `generateDiff` (optional): Generate diff preview (default: true)
- `preserveMarkers` (optional): Preserve manual edit markers (default: true)

#### Output

```json
{
  "success": true,
  "sectionsUpdated": ["installation", "structure"],
  "dependenciesAdded": 5,
  "dependenciesUpdated": 2,
  "dependenciesRemoved": 0,
  "modulesAdded": 3,
  "modulesRemoved": 0,
  "diff": "...",
  "readmePath": "/path/to/project/README.md"
}
```

## Manual Edit Markers

To preserve manual edits in your README:

```markdown
## Installation

<!-- SMITE:MANUAL:START -->
This section contains manual edits that will be preserved.
<!-- SMITE:MANUAL:END -->

npm install my-package
```

Auto-generated sections can be marked with:

```markdown
<!-- SMITE:AUTO -->
This content will be automatically regenerated on updates.
```

## Architecture

```
plugins/docs-editor-mcp/
├── src/
│   ├── dependency-monitor.ts    # Monitors package.json
│   ├── structure-scanner.ts     # Scans directory structure
│   ├── readme-parser.ts         # Parses README with unified/remark
│   ├── readme-updater.ts        # Generates section updates
│   ├── readme-types.ts          # TypeScript types and Zod schemas
│   ├── tools/
│   │   └── update-readme.ts     # update_readme_architecture tool
│   ├── server.ts                # MCP server
│   └── index.ts                 # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `unified`: Text processing framework
- `remark-parse`: Markdown parser (verified with [official docs](https://github.com/remarkjs/remark/blob/main/packages/remark-parse/readme.md))
- `remark-stringify`: Markdown serializer
- `zod`: Schema validation
- `glob`: File pattern matching

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Integration with SMITE

This plugin integrates with the SMITE Quality Gate system via the Judge Hook. Documentation updates are triggered automatically after code validation passes.

## Contributing

This plugin follows SMITE engineering rules:
- Zod validation at entry points (parse, don't validate)
- Pure functions for business logic
- Result types for error handling
- Barrel exports for tree-shaking

## License

MIT

## References

- [MCP Specification](https://modelcontextprotocol.io/specification/2025-06-18/)
- [remark-parse Documentation](https://github.com/remarkjs/remark/blob/main/packages/remark-parse/readme.md)
- [unified Ecosystem](https://unifiedjs.com/)
