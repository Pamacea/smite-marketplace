# Architect Agent Documentation

Complete documentation for the Architect agent - design, strategy, and creative thinking.

## Quick Links

### Architect Documentation
- **[Creative Design Workflow](ARCHITECT_CREATIVE_WORKFLOW.md)** - Complete guide to the creative workflow
- **[Skill Definition](../../skills/architect/SKILL.md)** - Agent skill and capabilities
- **[Command Reference](../../commands/architect.md)** - Command flags and usage

### Workflow Steps
- **[Step 1: Design Brief](../../steps/architect/01-brief.md)** - Create design brief (`-b`)
- **[Step 2: Research](../../steps/architect/02-research.md)** - Web search for references (`-w`)
- **[Step 3: Visual Analysis](../../steps/architect/03-visual-analysis.md)** - Vision MCP analysis (`-v`)
- **[Step 4: Style Generation](../../steps/architect/04-styles.md)** - Generate 5 variations
- **[Step 5: Preview](../../steps/architect/05-preview.md)** - Create preview workspace (`-x`)
- **[Step 6: Implementation](../../steps/architect/06-implement.md)** - Final implementation

### Subagents
- **[Frontend Subagent](../../skills/frontend/SKILL.md)** - Frontend implementation specialist
- **[UX Subagent](../../skills/ux/SKILL.md)** - User experience refinement specialist

### Configuration
- **[Design Styles](../../config/design-styles.json)** - 5 complete UI style frameworks

### Other Mobs Agents
See [../../README.md](../../README.md) for complete mobs plugin documentation including:
- Builder, Explorer, Finalize, Simplifier agents
- Note-taking utilities
- Integration with Ralph and Toolkit

## Features

### 🎨 Creative Design Workflow (NEW)

The Architect agent now supports a powerful creative workflow:

```bash
/architect -b -w -v -x "Design a modern SaaS dashboard"
```

This workflow:
1. Creates a design brief from your prompt
2. Researches design trends via WebSearch MCP
3. Analyzes references via Vision MCP
4. Generates 5 complete UI style variations
5. Creates an interactive preview workspace
6. Implements your chosen style

**Learn more**: [Architect Creative Workflow](ARCHITECT_CREATIVE_WORKFLOW.md)

### 🔍 Spec-First Development

All agents follow a strict Spec-Lock Policy:
1. Architect creates detailed specifications
2. Builder implements from spec (cannot deviate)
3. Finalize validates implementation matches spec

### 🤖 Multi-Agent Orchestration

- **Ralph**: Parallel execution of independent user stories
- **Smite**: Sequential workflow with state persistence

### 🎯 Technology Specialization

Builder agent supports:
- **Next.js** - React Server Components, Prisma, PostgreSQL
- **Rust** - Ownership, borrowing, async/await
- **Python** - Type hints, FastAPI, SQLAlchemy 2.0
- **Go** - Goroutines, interfaces

## Configuration

### Note Agent Configuration

Customize in `config/`:
- `folder-structure.json` - Vault structure
- `templates.json` - Available templates
- `vaults.json` - Multiple vaults

### Design System Configuration

- `design-styles.json` - 5 complete UI style frameworks

## Templates

Available in `templates/`:
- `inbox.md` - Quick capture notes
- `meeting.md` - Meeting notes
- `project-brief.md` - Project initialization
- `resource.md` - Resource notes
- `technical-notes.md` - Technical documentation

## Best Practices

1. **Always follow Spec-First workflow**
   - Architect creates specs
   - Builder follows specs exactly
   - Finalize validates specs

2. **Use semantic search first**
   - Try `/toolkit search` before manual exploration
   - Leverage dependency analysis
   - Use bug detection patterns

3. **Keep specs up to date**
   - If implementation reveals issues, update spec first
   - Never deviate from approved spec
   - Document all architectural decisions

## Quick Reference

```bash
# Creative design workflow
/architect -b -w -v -x "Design prompt"
/architect --select=minimalist

# Traditional architect modes
/architect --mode=init "Project description"
/architect --mode=strategy "Business question"
/architect --mode=design "Design requirements"
/architect --mode=brainstorm "Problem or topic"

# Builder
/builder --tech=nextjs --feature="authentication"
/builder --design --source="figma:file-id"

# Exploration
/explorer --task=find-function --target="getUserData"
/explorer --task=map-architecture

# Quality assurance
/finalize --mode=full
/finalize --mode=qa --type=review
/finalize --mode=docs --type=readme

# Simplification
/simplifier --focus=recent
/simplifier --scope=file src/components/Button.tsx

# Note-taking
/note inbox Meeting with bank tomorrow at 3pm
/note project ClientXYZ "Website redesign"
/search-notes "authentication" --vault=all
```

## Integration

Mobs works seamlessly with:
- **Ralph** - Multi-agent orchestration with parallel execution
- **Quality Gate** - Automatic code quality validation
- **Toolkit** - Semantic search and code analysis
- **Docs** - Automatic documentation generation

## Version

**Version**: 3.1.0
**Last Updated**: 2025-01-22

## License

MIT

## Author

Pamacea
