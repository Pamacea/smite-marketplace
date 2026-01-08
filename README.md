# 🏪 SMITE for Claude Code

**Zero-debt engineering agents and specialized development tools for Claude Code**

---

## 🚀 Quick Start

### Installation (2 commands)

```bash
# Add the SMITE Marketplace to Claude Code
/plugin marketplace add Pamacea/smite-marketplace

# List all available plugins
/plugin list --marketplace=smite-marketplace

# Install individual plugins based on your needs
/plugin install smite-initializer@smite-marketplace
/plugin install linter-sentinel@smite-marketplace
```

### Or Install All Plugins

```bash
# Install all SMITE agents (10 specialized agents)
/plugin install smite-initializer@smite-marketplace
/plugin install smite-explorer@smite-marketplace
/plugin install smite-strategist@smite-marketplace
/plugin install smite-aura@smite-marketplace
/plugin install smite-constructor@smite-marketplace
/plugin install smite-gatekeeper@smite-marketplace
/plugin install smite-handover@smite-marketplace
/plugin install smite-surgeon@smite-marketplace
/plugin install smite-orchestrator@smite-marketplace
/plugin install smite-brainstorm@smite-marketplace

# Install quality assurance plugins
/plugin install linter-sentinel@smite-marketplace
/plugin install doc-maintainer@smite-marketplace
```

### 🗑️ Uninstallation

```bash
# Uninstall all SMITE agents
/plugin uninstall smite-initializer
/plugin uninstall smite-explorer
/plugin uninstall smite-strategist
/plugin uninstall smite-aura
/plugin uninstall smite-constructor
/plugin uninstall smite-gatekeeper
/plugin uninstall smite-handover
/plugin uninstall smite-surgeon
/plugin uninstall smite-orchestrator
/plugin uninstall smite-brainstorm

# Uninstall quality assurance plugins
/plugin uninstall linter-sentinel
/plugin uninstall doc-maintainer

# Remove marketplace (optional)
/plugin marketplace remove smite-marketplace
```

---

## 📦 Available Plugins

### 🤖 SMITE Agents (10 Specialized Agents)

| Plugin | Description | Category | Command |
|--------|-------------|----------|---------|
| **smite-initializer** | Project initialization and technical stack definition | Development | `/smite-init` |
| **smite-explorer** | Codebase exploration, dependency mapping & pattern discovery | Development | `/smite:explorer` |
| **smite-strategist** | Business strategy, market analysis & revenue optimization | Development | `/smite:strategist` |
| **smite-aura** | Design system and UI/UX component creation | Development | `/smite-aura` |
| **smite-constructor** | Implementation with tech specialization & design mode | Development | `/smite-constructor --tech=[nextjs\|rust\|python]` |
| **smite-gatekeeper** | Code review, QA, testing & performance validation | Development | `/smite-gatekeeper --mode=[test\|coverage\|perf\|security]` |
| **smite-handover** | Documentation and knowledge transfer | Development | `/smite-handover` |
| **smite-surgeon** | Surgical code refactoring and optimization | Development | `/smite-surgeon` |
| **smite-orchestrator** | Auto-orchestration, custom workflows & technical debt detection | Development | `/smite-orchestrator --workflow=custom` |
| **smite-brainstorm** | Creative thinking, ideation & problem-solving partner | Development | `/smite:brainstorm --mode=[explore\|plan\|solve]` |

### 🔍 Quality & Documentation Plugins

| Plugin | Description | Category | Command |
|--------|-------------|----------|---------|
| **linter-sentinel** | Auto-fix ESLint, TypeScript, and Prettier violations | Quality | `*start-linter-sentinel --mode=fix` |
| **doc-maintainer** | Synchronize documentation with code changes | Documentation | `*start-doc-maintainer --mode=sync` |

---

## 🤖 Auto-Orchestration System

The **smite-orchestrator** plugin provides intelligent workflow coordination through automatic hooks:

### Features

- **Workflow State Tracking**: Automatically tracks agent execution and artifacts
- **Custom Workflows**: Build your own agent sequences with `--workflow=custom`
- **Technical Debt Detection**: Scans code for anti-patterns (any types, console logs, TODOs, etc.)
- **Smart Suggestions**: Suggests next agent in workflow based on current state
- **Session Persistence**: Maintains workflow state across sessions
- **Non-Intrusive**: Provides suggestions without forcing actions

### Custom Workflow Mode

Create personalized agent sequences:

```bash
# Quick feature development
/smite-orchestrator --workflow=custom --agents=explorer,constructor,gatekeeper

# Business focus
/smite-orchestrator --workflow=custom --agents=strategist,brainstorm,handover

# Full refactoring
/smite-orchestrator --workflow=custom --agents=explorer,surgeon,constructor,gatekeeper
```

### Standard Workflow Order

```
initializer → explorer → strategist → aura → constructor → gatekeeper → handover
```

### How It Works

```
User executes agent → Hook detects completion → State updated → Next agent suggested
                        ↓
                   Technical debt scanned → Issues detected → Surgeon suggested
```

### Generated Artifacts

The orchestrator creates these files automatically:

- `.smite/orchestrator-state.json` - Current workflow state
- `.smite/workflow/session-info.md` - Workflow progress and artifacts
- `.smite/suggestions/next-action.md` - Next agent recommendation
- `.smite/suggestions/fix-surgeon.md` - Technical debt alerts
- `docs/MISSION_BRIEF_{AGENT}.md` - Handoff documents between agents

### Performance

- **Overhead**: <0.1% per operation
- **Detection Speed**: <50ms for technical debt scanning
- **State Management**: <10ms for JSON operations

---

## 📖 Usage

### Starting a New Project with Auto-Orchestration

```bash
# 1. Start with initializer (auto-orchestration begins)
/smite-init

# After completion, orchestrator suggests next agent:
# "Next: /smite:explorer"

# 2. Explore the codebase (if applicable)
/smite:explorer --task=map-architecture

# 3. Continue with business strategy
/smite:strategist --workflow=market-analysis
/smite:strategist --workflow=business-model

# Orchestrator tracks artifacts and suggests:
# "Next: /smite-aura"

# 4. Follow the workflow
/smite-aura
/smite-constructor --tech=nextjs
/smite-gatekeeper --mode=test
/smite-handover

# Technical debt detected? Orchestrator suggests:
# "⚠️ Technical debt detected - run /smite-surgeon"
```

### Tech-Specialized Development

```bash
# Next.js full-stack development
/smite-constructor --tech=nextjs
  → React 18, TypeScript, Server Components, Prisma, PostgreSQL

# Rust systems programming
/smite-constructor --tech=rust
  → Cargo, Tokio, Sqlx, async/await, zero-copy patterns

# Python backend
/smite-constructor --tech=python
  → FastAPI, SQLAlchemy 2.0, Pydantic, asyncio

# Design implementation
/smite-constructor --design --source="figma:file-id"
  → Figma to code, SVG components, design tokens
```

### Quality Assurance & Testing

```bash
# Generate test suite
/smite-gatekeeper --mode=test --tech=nextjs
  → Unit tests, integration tests, E2E (Playwright)

# Analyze coverage gaps
/smite-gatekeeper --mode=coverage
  → Identify untested code, prioritize tests

# Performance testing
/smite-gatekeeper --mode=performance
  → Lighthouse CI, Web Vitals, database queries

# Security audit
/smite-gatekeeper --mode=security
  → OWASP Top 10, security headers, vulnerability scan
```

### Creative Problem-Solving

```bash
# Explore ideas deeply
/smite:brainstorm --mode=explore --topic="microservices architecture"

# Create implementation plan
/smite:brainstorm --mode=plan --topic="implement authentication system"

# Solve specific problem
/smite:brainstorm --mode=solve --topic="performance bottleneck"

# Configure tools
/smite:brainstorm --mode=configure --topic="setup ESLint"
```

### Individual Plugin Installation

Install only what you need:

```bash
# For new projects
/plugin install smite-initializer@smite-marketplace

# For codebase exploration
/plugin install smite-explorer@smite-marketplace

# For tech-specialized implementation
/plugin install smite-constructor@smite-marketplace

# For quality assurance & testing
/plugin install smite-gatekeeper@smite-marketplace

# For creative thinking & planning
/plugin install smite-brainstorm@smite-marketplace

# For code quality
/plugin install linter-sentinel@smite-marketplace

# For documentation
/plugin install doc-maintainer@smite-marketplace
```

---

## 🔧 Orchestrator Scripts

The auto-orchestration system is built with **TypeScript** and includes:

### Core Scripts (scripts/)

- **state-manager.ts** - Workflow state management
- **session-init.ts** - Session initialization
- **track-artifacts.ts** - Artifact tracking and logging
- **agent-complete.ts** - Agent completion handler
- **detect-debt.ts** - Technical debt pattern detection
- **suggest-next.ts** - Next agent suggestion engine
- **generate-handoff.ts** - Handoff document generation
- **suggest-display.ts** - Suggestion display system

### Build System

```bash
# Compile TypeScript to JavaScript
npm run build

# Watch mode for development
npm run watch
```

Compiled scripts are in `dist/` and used by hooks.

---

## 🏗️ Repository Structure

```
smite-marketplace/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace configuration
│
├── plugins/
│   ├── smite-initializer/            # Project initialization agent
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/initializer.md
│   │
│   ├── smite-explorer/               # Codebase exploration agent
│   ├── smite-strategist/             # Business strategy agent
│   ├── smite-aura/                   # Design system agent
│   ├── smite-constructor/            # Implementation agent (with --tech, --design modes)
│   ├── smite-gatekeeper/             # Code review & QA agent (with --mode test/coverage/perf/security)
│   ├── smite-handover/               # Documentation agent
│   ├── smite-surgeon/                # Refactoring agent
│   ├── smite-orchestrator/           # Auto-orchestration system (with custom workflows)
│   │   ├── scripts/                   # TypeScript source
│   │   ├── dist/                      # Compiled JavaScript
│   │   ├── tsconfig.json              # TypeScript config
│   │   └── package.json               # Build scripts
│   │
│   ├── smite-brainstorm/             # Creative thinking & problem-solving agent
│   │
│   ├── linter-sentinel/              # Auto-fix linting agent
│   │   ├── .claude-plugin/plugin.json
│   │   └── skills/linter-sentinel.md
│   │
│   └── doc-maintainer/               # Documentation sync agent
│       ├── .claude-plugin/plugin.json
│       └── skills/doc-maintainer.md
│
├── README.md                          # This file
└── LICENSE
```

---

## 🔄 Updating Plugins

```bash
# Update the marketplace
/plugin marketplace update smite-marketplace

# Update all installed plugins
/plugin update --all
```

---

## 🎯 Categories

### Development (SMITE Agents)
- **10 specialized agents** covering all development phases
- **Tech specialization modes**: Next.js, Rust, Python, Go
- **Design implementation mode**: Figma to code, SVG components
- **Custom workflows**: Build your own agent sequences
- **Auto-orchestrated workflow** with intelligent suggestions
- **Automatic technical debt detection** and tracking

### Quality
- **Comprehensive testing**: Unit, integration, E2E generation
- **Performance analysis**: Lighthouse, Web Vitals, database queries
- **Security audits**: OWASP Top 10, vulnerability scanning
- Automated linting and type-safety enforcement
- Zero-debt code quality maintenance

### Documentation
- Automatic documentation synchronization
- JSDoc, README, and API documentation
- Zero documentation debt

---

## 🛠️ Configuration

Each plugin can be configured after installation:

```bash
# Configure linter rules
Edit: agent/configs/linter-sentinel.json

# Configure documentation sync
Edit: agent/configs/doc-maintainer.json
```

---

## 📚 Resources

- **Claude Code**: [https://claude.com/claude-code](https://claude.com/claude-code)

---

## 🤝 Contributing

To add a new plugin to the marketplace:

1. Create plugin directory: `plugins/your-plugin/`
2. Add `.claude-plugin/plugin.json`
3. Add skill definition in `skills/your-agent.md`
4. Update `.claude-plugin/marketplace.json`
5. Submit pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

Built by **Pamacea** for zero-debt engineering with Claude Code

---

**SMITE Marketplace v2.0.0**
*13 plugins available*
*10 specialized development agents*
*Tech specialization modes (Next.js, Rust, Python)*
*Custom workflows & design implementation*
*Comprehensive QA (test, coverage, performance, security)*
*Modular installation*
*Zero-debt development*
*Auto-orchestration with TypeScript*
