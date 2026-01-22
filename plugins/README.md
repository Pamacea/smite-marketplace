# Smite Plugin Marketplace

Official plugin marketplace for the Smite Code Quality & Documentation System.

## Overview

The Smite Plugin Marketplace is a centralized registry of plugins that extend Smite's functionality. All plugins are published as npm packages with the `@smite/` scope and can be easily installed and configured.

## Available Plugins

### AI Agents

- **[@smite/mobs](./mobs/README.md)** - Multi-agent orchestration system with Spec-First development workflow
  - **Architect** - Design, strategy, initialization, and creative thinking
  - **Builder** - Tech-specialized implementation (Next.js, Rust, Python, Go)
  - **Explorer** - Codebase exploration and dependency mapping
  - **Finalize** - Unified QA, code review, refactoring, and documentation
  - **Note** - AI-powered Obsidian note creation and formatting
  - Spec-Lock Policy enforcement
  - Multi-tech stack support
  - Design-to-code capabilities

### Quality & Testing

- **[@smite/quality-gate](./quality-gate/README.md)** - Code quality gate system with complexity, semantic, and security validation
  - AST-based static analysis
  - Security vulnerability scanning
  - Complexity metrics (cyclomatic, cognitive, nesting)
  - Automatic feedback loop with retry logic
  - Audit logging for compliance

### Documentation

- **[@smite/docs-editor-mcp](./docs-editor-mcp/README.md)** - MCP server for automatic documentation maintenance
  - README architecture updater
  - Dependency monitoring
  - Structure scanning
  - Manual edit preservation
  - OpenAPI/Swagger sync (planned)
  - JSDoc generation (planned)

## Installation

All plugins follow a standard installation pattern:

```bash
# Navigate to the plugin directory
cd plugins/[plugin-name]

# Install dependencies
npm install

# Build the plugin
npm run build

# Install/configure the plugin
npm run install-hook  # For hooks
```

See individual plugin documentation for detailed installation instructions.

## Marketplace Index

The [index.json](./index.json) file contains metadata for all plugins including:

- Plugin name and version
- Description and author
- Dependencies and compatibility
- Installation commands
- Feature lists
- Changelog

## Plugin Categories

- **AI Agents** - Multi-agent orchestration and workflow automation
- **Quality & Testing** - Code quality, validation, and testing tools
- **Documentation** - Documentation generation and maintenance
- **Automation** - Workflow automation and enhancement
- **Integration** - Third-party service integrations

## Creating Plugins

All Smite plugins follow these standards:

### Package Structure

```
plugins/[plugin-name]/
├── src/              # Source code
├── dist/             # Compiled output
├── README.md         # User documentation
├── INSTALL.md        # Installation guide
├── MARKETPLACE.md    # Marketplace listing
├── CONTRIBUTING.md   # Contribution guidelines
├── LICENSE           # MIT License
├── package.json      # Package metadata
└── [config].example.json  # Example configuration
```

### Package.json Requirements

All plugins must include:

```json
{
  "name": "@smite/[plugin-name]",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": {
    "name": "Author Name",
    "email": "contact@example.com",
    "url": "https://github.com/username"
  },
  "license": "MIT",
  "homepage": "https://github.com/pamacea/smite#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/pamacea/smite.git",
    "directory": "plugins/[plugin-name]"
  },
  "bugs": {
    "url": "https://github.com/pamacea/smite/issues"
  },
  "smite": {
    "type": "hook|mcp-server|tool",
    "minVersion": "1.0.0",
    "configFile": ".claude/.smite/[config].json"
  },
  "keywords": [
    "smite",
    "smite-plugin"
  ]
}
```

### Required Files

Every plugin must include:

1. **README.md** - User-facing documentation
2. **INSTALL.md** - Installation and setup guide
3. **MARKETPLACE.md** - Marketplace listing with features
4. **CONTRIBUTING.md** - Contribution guidelines
5. **LICENSE** - MIT License
6. **package.json** - Package metadata with smite section
7. **[config].example.json** - Example configuration

### Coding Standards

Follow SMITE engineering rules:

- Zod validation at entry points
- Pure functions for business logic
- Result types for error handling
- Barrel exports for tree-shaking
- TypeScript strict mode
- Comprehensive error handling

## Publishing Plugins

### 1. Update Plugin Metadata

Ensure all metadata in `package.json` is complete:

```json
{
  "name": "@smite/[plugin-name]",
  "version": "1.0.0",
  "author": { ... },
  "repository": { ... },
  "bugs": { ... },
  "homepage": "..."
}
```

### 2. Build Plugin

```bash
cd plugins/[plugin-name]
npm run build
```

### 3. Update Marketplace Index

Add plugin entry to `index.json`:

```json
{
  "id": "@smite/[plugin-name]",
  "name": "Plugin Name",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Author Name",
  "license": "MIT",
  "category": "category-name",
  "tags": ["tag1", "tag2"],
  "smite": { ... },
  "dependencies": { ... },
  "features": [ ... ],
  "installation": { ... },
  "compatibility": { ... }
}
```

### 4. Create Documentation

Ensure all required files are present and up to date:

- README.md with usage examples
- INSTALL.md with troubleshooting
- MARKETPLACE.md with feature list
- CONTRIBUTING.md with guidelines
- LICENSE (MIT)

### 5. Test Installation

Verify plugin can be installed:

```bash
cd plugins/[plugin-name]
npm install
npm run build
npm run install-hook  # If applicable
```

### 6. Publish to npm

```bash
npm publish --access public
```

## Plugin Discovery

Search available plugins:

```bash
# List all plugins
cat plugins/index.json | jq '.plugins[] | {name, description, category}'

# Search by category
cat plugins/index.json | jq '.plugins[] | select(.category == "quality")'

# Search by tag
cat plugins/index.json | jq '.plugins[] | select(.tags[] | contains("security"))'
```

## Version Compatibility

All plugins specify minimum Smite version requirements:

```json
{
  "smite": {
    "minVersion": "1.0.0"
  }
}
```

Check compatibility before installing:

```bash
# Get Smite version
smite --version

# Check plugin compatibility
cat plugins/index.json | jq '.plugins[] | select(.id == "@smite/quality-gate") | .smite'
```

## Support

For plugin-specific issues:
- Check individual plugin README
- Review plugin's GitHub Issues
- Start a GitHub Discussion
- Contact plugin author

For marketplace issues:
- [GitHub Issues](https://github.com/pamacea/smite/issues)
- [GitHub Discussions](https://github.com/pamacea/smite/discussions)

## Contributing

To contribute a new plugin:

1. Follow the plugin structure standards
2. Include all required files
3. Add comprehensive documentation
4. Update index.json with plugin metadata
5. Submit a pull request

See individual plugin's CONTRIBUTING.md for specific contribution guidelines.

## License

All plugins are licensed under the MIT License. See individual plugin LICENSE files for details.

## Roadmap

### Upcoming Plugins

- **@smite/test-generator** - Automated test generation
- **@smite-code-review** - AI-powered code review
- **@smite-performance** - Performance profiling and optimization
- **@smite-security** - Advanced security scanning
- **@smite-docs-ai** - AI-powered documentation writer

### Marketplace Features

- Plugin search and discovery
- Version compatibility checking
- Automated dependency resolution
- Plugin ratings and reviews
- Usage analytics

---

**Extend Smite with plugins to enhance your development workflow.**
