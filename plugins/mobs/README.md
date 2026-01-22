# Mobs - Multi-Agent Orchestration System

> Spec-First development workflow with parallel agent execution and **creative design workflow**

## 🎯 Purpose

Consolidated multi-agent system providing complete development workflow from architecture to implementation to quality assurance. Mobs follows **Spec-First methodology** where all agents work from approved specifications.

**Target Audience**: Development teams needing structured, agent-driven development workflow

## 🎨 NEW: Creative Design Workflow

The Architect agent now features a powerful creative workflow that leverages MCP tools to research, analyze, and generate **5 distinct UI style variations** for your project.

```bash
# Complete creative workflow
/architect -b -w -v -x "Design a modern SaaS dashboard"
# Then browse interactive previews and choose:
/architect --select=glassmorphism
```

**Learn more**: [Creative Workflow Documentation](docs/architect/ARCHITECT_CREATIVE_WORKFLOW.md)

## 🤖 Included Agents

### Core Development Agents

#### **Architect** (`/architect`)
Design & strategy agent for project initialization, business strategy, design systems, and creative brainstorming.

```bash
# Initialize new project
/architect --mode=init "Build a SaaS dashboard for analytics"

# Create design system
/architect --mode=design "Modern minimalist design for fintech app"

# Business strategy
/architect --mode=strategy "Define pricing strategy for productivity tool"

# Brainstorm solutions
/architect --mode=brainstorm "How to improve user engagement"
```

#### **Builder** (`/builder`)
Implementation agent with technology specialization (Next.js, Rust, Python, Go) and design mode.

```bash
# Implement from spec
/builder --tech=nextjs --feature="authentication"

# Convert design to code
/builder --design --source="figma:file-id"

# Auto-detect tech stack
/builder "Add task CRUD operations"
```

#### **Explorer** (`/explorer`)
Codebase exploration, dependency mapping, and pattern discovery with semantic search.

```bash
# Find function usage
/explorer --task=find-function --target="getUserData"

# Map architecture
/explorer --task=map-architecture

# Analyze change impact
/explorer --task=analyze-impacts --scope=module
```

#### **Finalize** (`/finalize`)
Unified quality assurance, code review, refactoring, linting, and documentation.

```bash
# Full finalize (QA + Docs)
/finalize

# QA only
/finalize --mode=qa --type=review

# Docs only
/finalize --mode=docs --type=readme

# Specific validation
/finalize --mode=qa --type=test       # Generate & run tests
/finalize --mode=qa --type=security  # Security audit
```

#### **Simplifier** (`/simplifier`)
Code simplification and refactoring for clarity and maintainability.

```bash
# Simplify recent changes
/simplifier --focus=recent

# Simplify specific file
/simplifier --scope=file src/components/Button.tsx

# Simplify entire project
/simplifier --scope=all
```

### Utility Agents

#### **Note** (`/note`)
AI-powered note writing and formatting for Obsidian vaults with multi-vault support.

```bash
# Quick capture in Inbox
/note inbox Meeting with bank tomorrow at 3pm

# Create project brief
/note project ClientXYZ "Website redesign project, budget 5k"

# Format existing text
/note:format free "API endpoints: GET /users, POST /users"

# Search across vaults
/search-notes "authentication" --vault=all
```

## 🔄 Spec-First Workflow

Mobs follows a strict **Spec-Lock Policy**:

1. **Architect** creates detailed specifications
2. **Builder** implements from spec (cannot deviate)
3. **Finalize** validates implementation matches spec
4. If any agent finds impossible requirements:
   - STOP immediately
   - Request spec revision
   - Resume only after spec is corrected

## 🛠️ Technology Specialization

Builder agent supports multiple tech stacks:

- **Next.js** - React Server Components, Prisma, PostgreSQL, Server Actions
- **Rust** - Ownership, borrowing, async/await, zero-copy patterns
- **Python** - Type hints, FastAPI, SQLAlchemy 2.0, asyncio
- **Go** - Goroutines, interfaces, standard library

## 🎨 Design Mode

Convert designs directly to code:

```bash
/builder --design --source="figma:file-id"
```

Supports:
- Figma designs
- SVG to component conversion
- Design tokens extraction
- Responsive layouts

## 📁 Configuration

### Note Agent Configuration

Customize in `config/`:

- `folder-structure.json` - Define your vault structure
- `templates.json` - Available note templates
- `vaults.json` - Configure multiple vaults

### Templates

Available in `templates/`:

- `inbox.md` - Quick capture notes
- `meeting.md` - Meeting notes with attendees, decisions, action items
- `project-brief.md` - Project initialization brief
- `resource.md` - Resource and cheat sheet notes
- `technical-notes.md` - Technical documentation notes

## 🔍 Integration with Toolkit

All agents leverage the toolkit plugin when available:

- **Semantic Search** - 75% token savings, 2x precision
- **Dependency Graph** - Automated impact analysis
- **Bug Detection** - Pattern-based issue finding
- **Code Context** - 70-85% token savings with surgeon mode

## 📖 Usage Examples

### Complete Feature Workflow

```bash
# 1. Design the architecture
/architect --mode=design "User authentication system"

# 2. Explore existing patterns
/explorer --task=find-deps --target="auth"

# 3. Implement from spec
/builder --tech=nextjs --feature="authentication"

# 4. Simplify and refactor
/simplifier --scope=directory src/features/auth

# 5. Finalize and validate
/finalize --mode=full
```

### Quick Note-Taking Workflow

```bash
# Capture quick thought
/note inbox "Remember to check JWT token expiry"

# Create project note
/note project ClientXYZ "Mobile app requirements: iOS, Android"

# Search all notes
/search-notes "ClientXYZ" --vault=all

# Format existing notes
/note:format meeting "Discussed timeline. Decided: use TypeScript"
```

## 🚦 Best Practices

1. **Always follow Spec-First workflow**
   - Architect creates specs
   - Builder follows specs exactly
   - Finalize validates specs

2. **Use semantic search first**
   - Try `/toolkit search` before manual exploration
   - Leverage dependency analysis for impact assessment
   - Use bug detection patterns

3. **Keep specs up to date**
   - If implementation reveals issues, update spec first
   - Never deviate from approved spec
   - Document all architectural decisions

4. **Run finalize before commits**
   - Ensures code quality
   - Keeps docs in sync
   - Prevents technical debt

## 📚 Documentation

Complete documentation is available in the [docs/](docs/) folder:

- **[Architect Agent](docs/architect/)** - Design, strategy, and creative workflow
  - [Creative Workflow Guide](docs/architect/ARCHITECT_CREATIVE_WORKFLOW.md) - Complete creative workflow documentation
  - [Architect Index](docs/architect/INDEX.md) - All architect documentation

### Agent Skills

- `skills/architect/SKILL.md` - Architect agent documentation
- `skills/builder/SKILL.md` - Builder agent documentation
- `skills/finalize/SKILL.md` - Finalize agent documentation
- `skills/explorer/SKILL.md` - Explorer agent documentation
- `skills/simplifier/SKILL.md` - Simplifier agent documentation
- `skills/note/SKILL.md` - Note agent documentation
- `skills/frontend/SKILL.md` - Frontend subagent (NEW)
- `skills/ux/SKILL.md` - UX subagent (NEW)

### Workflow Steps

- `steps/architect/` - Detailed creative workflow steps
- `steps/architect/01-brief.md` - Design brief creation
- `steps/architect/02-research.md` - Web search research
- `steps/architect/03-visual-analysis.md` - Visual analysis
- `steps/architect/04-styles.md` - Style generation
- `steps/architect/05-preview.md` - Preview workspace
- `steps/architect/06-implement.md` - Final implementation

### Configuration

- `config/design-styles.json` - 5 complete UI style frameworks (NEW)

## 🤝 Integration

Mobs works seamlessly with:

- **Ralph** - Multi-agent orchestration with parallel execution
- **Quality Gate** - Automatic code quality validation
- **Toolkit** - Semantic search and code analysis
- **Docs** - Automatic documentation generation

## 📝 Version

Version: 3.1.0
License: MIT
Author: Pamacea

## 🌟 Features

- **Creative Design Workflow** - MCP-powered research and 5-style generation (NEW)
- **Interactive Previews** - Temporary workspace to see designs before implementing (NEW)
- **Subagent System** - Specialized frontend and UX agents (NEW)
- **Spec-First Development** - All agents work from approved specifications
- **Multi-Tech Support** - Next.js, Rust, Python, Go specialization
- **Design-to-Code** - Convert Figma designs directly to components
- **Quality Gates** - Automated QA, security, and performance validation
- **Multi-Vault Notes** - Work with multiple Obsidian vaults
- **Semantic Search** - 75% token savings with intelligent code search
- **Impact Analysis** - Understand change blast radius before implementing
- **Template System** - Pre-built templates for notes and documentation
