# Agents Plugin

Specialized development agents organized by domain expertise.

## Version
**v1.0.0** | Compatible with SMITE v1.6.5+

## Overview

This plugin provides domain-specific development agents that bring specialized knowledge for different technology stacks. Each agent is optimized for its specific domain with deep expertise in best practices, patterns, and workflows.

## Available Agents

### Frontend Agents
- **Next.js** - Next.js 16, React Server Components, Turbopack
- **React** - Modern React with hooks, concurrent features
- **Vue** - Vue 3, Composition API, Nuxt
- **Svelte** - Svelte 5, runes, SvelteKit

### Backend Agents
- **Rust** - DDD architecture, tokio, sqlx, thiserror
- **NestJS** - Modular architecture, dependency injection, decorators
- **Express** - Minimalist patterns, middleware, TypeScript
- **FastAPI** - Python async, Pydantic, OpenAPI

### Database Agents
- **Prisma** - Type-safe ORM, migrations, schema design
- **Drizzle** - SQL-like API, migrations, bundles
- **PostgreSQL** - Database design, indexes, optimization
- **MongoDB** - Document modeling, aggregation, indexing

### DevOps Agents
- **Docker** - Containers, compose, multi-stage builds
- **Kubernetes** - K8s deployment, services, ingress
- **CI/CD** - GitHub Actions, workflows, deployment
- **Terraform** - Infrastructure as code, modules, state

### Testing Agents
- **Vitest** - Unit testing, mocking, coverage
- **Playwright** - E2E testing, page objects, fixtures
- **Jest** - Classic testing, snapshots, mocks
- **MSW** - API mocking, handlers, scenarios
- **TDD Guide** - Test-driven development workflow

### Workflow Agents (Studio v2.0 Integration)
- **Performance Profiler** - Systematic performance optimization with before/after metrics
- **Security Scanner** - OWASP Top 10 vulnerability scanning and P0/P1 classification
- **TypeScript Improver** - Complete type safety, eliminate `any`, Zod validation
- **Planner** - Implementation planning and architecture design
- **Code Reviewer** - Adversarial code review and quality assessment
- **Security Reviewer** - Security-focused code review
- **TDD Guide** - Test-driven development best practices

## Installation

```bash
# Install agents plugin
/plugin install agents@smite
```

## Agent Discovery

### Automatic Selection via --tech Flag

The `--tech` flag automatically selects and loads the appropriate agent:

```bash
/studio build --tech=rust "Create API endpoint"
# → Loads backend/rust.agent.md

/studio build --tech=nextjs "Build server component"
# → Loads frontend/nextjs.agent.md

/studio build --tech=prisma "Design schema"
# → Loads database/prisma.agent.md
```

### Manual Selection via --agent Flag

Specify exact agent or domain:

```bash
# Specific agent
/studio build --agent=backend/rust "Create API"
/studio build --agent=frontend/nextjs "Build UI"

# Domain-level (all agents in domain)
/studio build --agent=frontend "Build component library"

# Short form (unique matches)
/studio build --agent=rust "Create API"
```

### Complete --tech Flag Mapping

| Flag | Domain | Agent File |
|------|--------|------------|
| `--tech=nextjs` | frontend | `frontend/nextjs.agent.md` |
| `--tech=react` | frontend | `frontend/react.agent.md` |
| `--tech=vite` | frontend | `frontend/vitejs.agent.md` |
| `--tech=rust` | backend | `backend/rust.agent.md` |
| `--tech=nestjs` | backend | `backend/nestjs.agent.md` |
| `--tech=prisma` | database | `database/prisma.agent.md` |
| `--tech=postgresql` | database | `database/postgresql.agent.md` |
| `--tech=docker` | devops | `devops/docker.agent.md` |
| `--tech=vitest` | testing | `testing/vitest.agent.md` |

### Studio v2.0 Flag → Agent Mapping

| Studio Flag | Agent Auto-Loaded | Purpose |
|-------------|------------------|---------|
| `--profile` (build/refactor) | `workflow/performance-profiler.agent.md` | Performance profiling with metrics |
| `--security` (build/refactor) | `workflow/security-scanner.agent.md` | OWASP Top 10 security scanning |
| `--types` (build/refactor) | `workflow/typescript-improver.agent.md` | TypeScript strict mode + Zod |
| `--test` (build) | `workflow/tdd-guide.agent.md` | TDD workflow (RED-GREEN-REFACTOR) |
| `--team` (refactor) | **Creates Agent Team** | Parallel multi-agent execution |

**Full documentation:** See [AGENT_DISCOVERY.md](AGENT_DISCOVERY.md) for complete agent discovery system details.

## Usage

### With /studio build

```bash
# Auto-select agent by tech stack
/studio build --tech=rust "Create user API with DDD"

# Combine with flags
/studio build --tech=nextjs --scale "Build full feature"
/studio build --tech=prisma --quality "Design database schema"

# Manual agent selection
/studio build --agent=backend/rust "Create API endpoint"
```

### Direct Agent Invocation

```bash
# Use specific agent directly
/agent backend/rust
/agent frontend/nextjs
/agent database/prisma

# Domain-level invocation
/agent frontend
/agent backend
```

## Agent Structure

Each agent follows a standardized format:

```markdown
# [Tech Name] Development Agent

## Mission
What this agent specializes in

## Stack
Technology versions and key tools

## Patterns
Architectural patterns and best practices

## Workflow
Step-by-step development approach

## Integration
How it works with SMITE core
```

## Usage Examples

### Example 1: Rust Backend Development

```bash
# Auto-discover and load Rust agent
/studio build --tech=rust "Create user API with DDD architecture"

# System action:
# → Discovers: backend/rust.agent.md
# → Loads: Rust patterns (Ownership, tokio, sqlx, thiserror)
# → Executes: Creates API following DDD patterns
```

### Example 2: Next.js Frontend Feature

```bash
# Load Next.js agent with scale flag
/studio build --tech=nextjs --scale "Build dashboard with authentication"

# System action:
# → Discovers: frontend/nextjs.agent.md
# → Loads: Next.js 16 patterns (RSC, Server Actions, Turbopack)
# → Executes: Comprehensive implementation with EPCT workflow
```

### Example 3: Database Schema Design

```bash
# Load Prisma agent with quality gates
/studio build --tech=prisma --quality "Design database schema for SaaS app"

# System action:
# → Discovers: database/prisma.agent.md
# → Loads: Prisma patterns (schema design, migrations, relations)
# → Executes: Creates schema with validation and best practices
```

### Example 4: Multiple Agents

```bash
# Combine frontend + backend agents
/studio build --tech=nextjs --tech=rust "Build full-stack feature"

# System action:
# → Loads: frontend/nextjs.agent.md + backend/rust.agent.md
# → Merges: Context from both agents
# → Executes: Full-stack implementation
```

### Example 5: Manual Agent Selection

```bash
# Explicitly select agent
/studio build --agent=backend/rust "Create API endpoint"

# System action:
# → Bypasses auto-discovery
# → Loads specified agent directly
# → Executes: With Rust patterns
```

## Creating New Agents

### Quick Start

To add a new agent:

1. **Create file** in appropriate domain directory:
   - `agents/frontend/[tech].agent.md`
   - `agents/backend/[tech].agent.md`
   - etc.

2. **Follow agent template** (required sections):
   ```markdown
   # [Tech Name] Development Agent

   ## Mission
   [What this agent specializes in]

   ## Stack
   [Tech versions and key tools]

   ## Patterns
   [Architectural patterns and code examples]

   ## Workflow
   [Step-by-step development approach]

   ## Integration
   [How it works with SMITE commands]
   ```

3. **Register in domain index.md**

4. **Test discovery**:
   ```bash
   /studio build --tech=[your-tech] "Test task"
   ```

**Complete guide:** See [AGENT_DISCOVERY.md - Creating New Agents](AGENT_DISCOVERY.md#creating-new-agents) for detailed steps, examples, and best practices.

## Dependencies

Requires **core@^1.6.5** plugin for:
- Validation utilities
- Schema definitions
- Error handling
- SMITE command integration

## Agent Discovery System

### How It Works

1. **Manifest Registration**: All agents registered in `manifest.json`
2. **Directory Scanning`: Agents organized by domain (`frontend/`, `backend/`, etc.)
3. **Auto-Selection**: `--tech` flag automatically loads matching agent
4. **Manual Override**: `--agent` flag for explicit selection

### Discovery Algorithm

```
User runs: /studio build --tech=rust "Task"

1. Parse --tech value (rust)
2. Search manifest.json for matching domain
3. Locate agent file: agents/backend/rust.agent.md
4. Load agent context (Mission, Stack, Patterns, Workflow)
5. Inject into task execution
6. Execute with specialized knowledge
```

**Full documentation:** [AGENT_DISCOVERY.md](AGENT_DISCOVERY.md) covers:
- Complete discovery algorithm
- Agent loading mechanism
- Error handling and troubleshooting
- Creating new agents
- Advanced usage patterns

## Integration Points

### With Studio Plugin

Agents integrate seamlessly with `/studio build`:

```bash
# Auto-invokes appropriate agent
/studio build --tech=rust "Create API endpoint"
# → Loads backend/rust.agent.md automatically

# Combine with 4-flag system
/studio build --tech=nextjs --scale --quality "Build feature"
# → Loads Next.js agent + uses thorough + validated workflow

# Manual agent selection
/studio build --agent=backend/rust "Create API"
# → Same as --tech=rust but more explicit
```

### With Core Plugin

All agents use core utilities:
- Validation schemas via `validateTask()`
- Error handling via `SmiteError`
- File operations via core file utils

## Tagging System

Agents are tagged by:
- **Domain**: frontend, backend, database, devops, testing
- **Tech**: Specific technology (rust, nextjs, prisma, etc.)
- **Level**: beginner, intermediate, advanced
- **Use-case**: api, ui, database, deployment, etc.

## Contributing

When adding new agents:
1. Follow the template structure
2. Include version-specific knowledge
3. Document patterns clearly
4. Test with real tasks
5. Update domain index.md

## Version History

- **v1.1.0** (2026-02-19) - Studio v2.0 integration
  - 🆕 Performance profiler agent (workflow/performance-profiler.agent.md)
  - 🆕 Security scanner agent (workflow/security-scanner.agent.md)
  - 🆕 TypeScript improver agent (workflow/typescript-improver.agent.md)
  - 🤖 Auto-activation system for build/refactor flags
  - 📋 Agent team creation for complex refactors

- **v1.0.0** (2026-02-10) - Initial release with 5 core agents
  - Rust backend agent
  - Next.js frontend agent
  - NestJS backend agent
  - Prisma database agent
  - Docker DevOps agent

---

**Maintained by**: SMITE Core Team
**License**: MIT
**Repository**: https://github.com/Pamacea/smite
