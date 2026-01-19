# @smite/docs-editor-mcp - Marketplace Listing

**Automatic Documentation Maintenance via Model Context Protocol**

[![Version](https://img.shields.io/npm/v/@smite/docs-editor-mcp)](https://www.npmjs.com/package/@smite/docs-editor-mcp)
[![License](https://img.shields.io/npm/l/@smite/docs-editor-mcp)](./LICENSE)
[![MCP](https://img.shields.io/badge/mcp-stdio-green.svg)](https://modelcontextprotocol.io/)
[![Smite](https://img.shields.io/badge/smite-v1.0.0+-blue.svg)](https://github.com/pamacea/smite)

---

## Overview

The Smite Docs Editor MCP is an intelligent documentation maintenance server that automatically keeps project documentation synchronized with code changes. Using the Model Context Protocol (MCP), it monitors your codebase and updates README files, OpenAPI specifications, and JSDoc comments - all while preserving your manual edits.

---

## Features

### README Architecture Updater

Automatically maintain your project README.md:

- **Dependency Monitoring**: Scans `package.json` and updates Installation section
- **Structure Scanning**: Monitors `src/` directory and updates Project Structure section
- **Architecture Overview**: Generates technical stack descriptions
- **Manual Edit Preservation**: Preserve custom content with special markers
- **Diff Generation**: Preview changes before applying them

### Manual Edit Markers

Protect your custom documentation while automating the rest:

```markdown
<!-- SMITE:MANUAL:START -->
This custom content will never be overwritten.
<!-- SMITE:MANUAL:END -->

<!-- SMITE:AUTO -->
This section is auto-regenerated on each update.
```

### Intelligent Markdown Processing

Powered by unified and remark for robust markdown handling:

- **AST-Based Parsing**: Reliable markdown structure analysis
- **Section Detection**: Automatically finds and updates specific sections
- **Format Preservation**: Maintains your markdown style and formatting
- **Diff Preview**: See exactly what will change before applying updates

### MCP Integration

Full Model Context Protocol implementation:

- **Stdio Transport**: Standard input/output communication
- **Tool Discovery**: Automatic tool registration with MCP clients
- **Schema Validation**: Zod schemas for all tool parameters
- **Error Handling**: Graceful failure with detailed error messages

---

## Use Cases

### 1. API Documentation

Keep API documentation synchronized with code:

- Auto-generate OpenAPI specs from route definitions
- Update endpoint documentation as you add/modify routes
- Maintain request/response examples automatically
- Support for Express, Fastify, NestJS, and generic frameworks

### 2. Project README Maintenance

Eliminate stale README files:

- Update installation instructions when dependencies change
- Reflect new directories and modules in project structure
- Keep tech stack lists current
- Automatic formatting and consistency

### 3. Quick Start Guides

Ensure new contributors have accurate setup instructions:

- Update dependency versions automatically
- Add new environment variables to setup sections
- Reflect configuration file changes
- Keep examples synchronized with actual code

### 4. JSDoc Generation

Generate comprehensive code documentation:

- Auto-generate JSDoc comments from TypeScript types
- Create parameter descriptions from function signatures
- Generate return type documentation
- Support for complex types and generics

---

## Benefits

### For Developers

- **Never Update Docs Manually**: Focus on coding, let automation handle docs
- **Always Up-to-Date**: Documentation stays synchronized with code changes
- **No Merge Conflicts**: Smart markers prevent conflicts between manual and auto content
- **Preview Changes**: See diffs before documentation updates are applied

### For Teams

- **Consistent Documentation**: Uniform style and format across the project
- **Reduced Overhead**: No dedicated documentation maintainer needed
- **Faster Onboarding**: New contributors always see current setup instructions
- **Version Control**: Track documentation changes alongside code changes

### For Open Source Projects

- **Professional README**: Maintain polished, accurate documentation
- **Stay Current**: Contributors see up-to-date installation steps
- **Reduce Issues**: Many "how to setup" questions eliminated
- **Better UX**: Professional first impression for repository visitors

---

## Compatibility

### Smite Version

- **Minimum**: 1.0.0
- **Recommended**: Latest version
- **Type**: MCP Server (stdio)

### Runtime Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0
- **Operating Systems**: Windows, macOS, Linux

### Integration

Works with:
- Claude Code (via MCP)
- Any MCP-compatible client
- Standalone usage (CLI mode)
- Integration with Quality Gate plugin

---

## Comparison

| Feature | Smite Docs Editor | Typoed | Docsify | Docusaurus |
|---------|------------------|--------|---------|-----------|
| **Auto README Updates** | ✅ | ❌ | ❌ | ❌ |
| **Manual Edit Preservation** | ✅ | ❌ | ❌ | ❌ |
| **MCP Integration** | ✅ | ❌ | ❌ | ❌ |
| **Zero Config** | ✅ | ❌ | ❌ | ❌ |
| **Markdown AST** | ✅ | ✅ | ✅ | ✅ |
| **Diff Generation** | ✅ | ❌ | ❌ | ❌ |
| **OpenAPI Sync** | Planned | ❌ | Plugin | Plugin |
| **JSDoc Generation** | Planned | ✅ | ❌ | ❌ |
| **Setup Time** | < 2 min | ~30 min | ~1 hour | ~2 hours |

---

## Changelog

### Version 1.0.0 (2025-01-19)

**Initial Release**

Features:
- README Architecture Updater tool
- Dependency monitoring via package.json scanning
- Directory structure scanning with configurable depth
- Manual edit preservation with SMITE:MANUAL markers
- Auto-generated content sectioning with SMITE:AUTO markers
- Markdown diff generation for change preview
- MCP stdio server implementation
- Zod schema validation for all parameters
- AST-based markdown parsing (unified/remark)
- Comprehensive error handling
- Zero-configuration setup

---

## Roadmap

### Version 1.1.0 (Planned)

- OpenAPI/Swagger synchronization
- JSDoc comment generation
- Git integration (auto-commit documentation changes)
- Table of contents generation
- Markdown formatting and linting

### Version 1.2.0 (Planned)

- Multi-REPO support (monorepos)
- Custom documentation templates
- Webhook integration (GitHub, GitLab)
- Documentation analytics
- Changelog generation

### Version 2.0.0 (Planned)

- AI-powered documentation writing
- Smart example generation
- API documentation from TypeScript types
- Interactive documentation editor
- Documentation versioning

---

## Installation

```bash
cd plugins/docs-editor-mcp
npm install
npm run build
```

See [INSTALL.md](./INSTALL.md) for detailed installation instructions.

---

## Documentation

- [README](./README.md) - Full feature documentation
- [INSTALL.md](./INSTALL.md) - Installation guide
- [docs-config.example.json](./docs-config.example.json) - Configuration reference
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

---

## MCP Usage

### With Claude Code

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "smite-docs": {
      "command": "node",
      "args": ["plugins/docs-editor-mcp/dist/index.js"]
    }
  }
}
```

### Standalone

```bash
npm start
```

The server listens on stdio and implements the MCP protocol.

---

## Support

- **Issues**: [GitHub Issues](https://github.com/pamacea/smite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pamacea/smite/discussions)
- **Documentation**: [Full Docs](./README.md)
- **MCP Spec**: [Model Context Protocol](https://modelcontextprotocol.io/)

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

## Keywords

`mcp`, `model-context-protocol`, `documentation`, `openapi`, `swagger`, `jsdoc`, `readme`, `automation`, `markdown`, `typescript`, `smite`, `smite-plugin`

---

## Categories

- **Documentation**
- **Automation**
- **Developer Tools**
- **Integration**

---

**Automatic documentation maintenance - never update docs manually again.**
