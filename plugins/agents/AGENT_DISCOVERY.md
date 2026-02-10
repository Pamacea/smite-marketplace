# Agent Discovery System

## Version
**v1.0.0** | Part of SMITE Agents Plugin v1.0.0

---

## Overview

The Agent Discovery System enables automatic agent selection and loading based on your technology stack or manual agent specification. It provides a seamless way to inject domain-specific expertise into your development workflow.

---

## How Agents Are Discovered

### 1. Manifest-Based Discovery

All agents are registered in `manifest.json`:

```json
{
  "id": "agents",
  "name": "agents",
  "version": "1.0.0",
  "provides": ["frontend", "backend", "database", "devops", "testing"],
  "tags": ["agents", "specialized", "tech-stacks"]
}
```

**Key Fields:**
- `provides`: Domains available for auto-discovery
- `tags`: Searchable categories for agent lookup

### 2. Directory Structure

```
plugins/agents/
├── manifest.json           # Agent registry
├── agents/
│   ├── frontend/
│   │   ├── nextjs.agent.md
│   │   ├── react.agent.md
│   │   └── vitejs.agent.md
│   ├── backend/
│   │   ├── rust.agent.md
│   │   ├── nestjs.agent.md
│   │   └── express.agent.md
│   ├── database/
│   │   ├── prisma.agent.md
│   │   └── postgresql.agent.md
│   ├── devops/
│   │   └── docker.agent.md
│   └── testing/
│       └── vitest.agent.md
```

**Naming Convention:**
- Agent files: `[techname].agent.md`
- Domain index: `[domain]/index.md`

---

## Auto-Selection Logic

### Via `--tech` Flag

The `--tech` flag automatically selects the appropriate agent based on technology stack:

```
--tech=nextjs     → loads agents/frontend/nextjs.agent.md
--tech=rust       → loads agents/backend/rust.agent.md
--tech=prisma     → loads agents/database/prisma.agent.md
--tech=nestjs     → loads agents/backend/nestjs.agent.md
--tech=docker     → loads agents/devops/docker.agent.md
```

### Resolution Algorithm

1. **Parse tech parameter** (e.g., `--tech=nextjs`)
2. **Search manifest** for matching domain:
   - Check `provides` array for category
   - Check `tags` for tech-specific matches
3. **Locate agent file**:
   - Pattern: `agents/{domain}/{tech}.agent.md`
   - Fallback: `agents/{tech}.agent.md`
4. **Load and inject** agent context into task
5. **Return agent info** to user

---

## Manual Selection

### Via `--agent` Flag

Specify exact agent path:

```bash
# Full path
/studio build --agent=backend/rust "Create API endpoint"

# Short form (if unique)
/studio build --agent=rust "Create API endpoint"

# Domain selector
/studio build --agent=frontend "Build React component"
```

### Agent Path Format

```
[domain/][tech] | [tech]

Examples:
- backend/rust     → Specific agent
- rust             → Auto-discover by tech name
- frontend         → Domain-level context (all frontend agents)
```

---

## Agent Loading Mechanism

### Phase 1: Discovery

```typescript
function discoverAgent(tech: string): Agent | null {
  // 1. Check manifest
  const manifest = loadManifest('plugins/agents/manifest.json')

  // 2. Find domain
  const domain = findDomain(manifest, tech)

  // 3. Locate file
  const agentPath = `agents/${domain}/${tech}.agent.md`

  // 4. Verify exists
  if (!fileExists(agentPath)) {
    return null
  }

  return { path: agentPath, tech, domain }
}
```

### Phase 2: Loading

```typescript
function loadAgent(agent: Agent): AgentContext {
  // 1. Read agent file
  const content = readFile(agent.path)

  // 2. Parse sections
  const context = {
    mission: extractSection(content, 'Mission'),
    stack: extractSection(content, 'Stack'),
    patterns: extractSection(content, 'Patterns'),
    workflow: extractSection(content, 'Workflow'),
  }

  // 3. Inject into task
  return context
}
```

### Phase 3: Execution

```typescript
async function executeWithAgent(agent: AgentContext, task: string) {
  // 1. Prepend agent patterns to context
  const systemPrompt = `
    You are a ${agent.mission}

    Stack: ${agent.stack}

    Follow these patterns:
    ${agent.patterns}

    Workflow: ${agent.workflow}
  `

  // 2. Execute task
  return await executeTask(task, systemPrompt)
}
```

---

## Usage Examples

### Example 1: Auto-Selection with --tech

```bash
# Automatically loads rust.agent.md
/studio build --tech=rust "Create user API with DDD"

# System action:
# 1. Discovers → agents/backend/rust.agent.md
# 2. Loads context → Rust patterns, tokio, sqlx
# 3. Executes with specialized knowledge
```

### Example 2: Manual Selection

```bash
# Explicitly select agent
/studio build --agent=backend/rust "Create user API"

# Same result as --tech=rust, but more explicit
```

### Example 3: Domain Selection

```bash
# Load all frontend knowledge
/studio build --agent=frontend "Build component library"

# System action:
# 1. Loads all agents in agents/frontend/
# 2. Merges patterns from React, Next.js, Vite
# 3. Provides cross-framework insights
```

### Example 4: Multiple Agents

```bash
# Combine backend + database agents
/studio build --tech=rust --agent=database/prisma "Create user CRUD"
```

---

## Tech Flag Mapping

### Complete Mapping Table

| `--tech` Value | Domain | Agent File | Specialization |
|---------------|--------|------------|----------------|
| **nextjs** | frontend | `frontend/nextjs.agent.md` | Next.js 16, React 19, RSC |
| **react** | frontend | `frontend/react.agent.md` | React 19, hooks, concurrent |
| **vite** | frontend | `frontend/vitejs.agent.md` | Vite, React, Vue, Svelte |
| **react-native** | frontend | `frontend/react-native.agent.md` | Mobile, iOS, Android |
| **rust** | backend | `backend/rust.agent.md` | DDD, tokio, sqlx |
| **nestjs** | backend | `backend/nestjs.agent.md` | Modular, DI, decorators |
| **express** | backend | `backend/express.agent.md` | Minimalist, middleware |
| **fastapi** | backend | `backend/fastapi.agent.md` | Python async, Pydantic |
| **prisma** | database | `database/prisma.agent.md` | Type-safe ORM |
| **drizzle** | database | `database/drizzle.agent.md` | SQL-like API |
| **postgresql** | database | `database/postgresql.agent.md` | Database design |
| **mongodb** | database | `database/mongodb.agent.md` | Document modeling |
| **docker** | devops | `devops/docker.agent.md` | Containers, compose |
| **kubernetes** | devops | `devops/kubernetes.agent.md` | K8s deployment |
| **terraform** | devops | `devops/terraform.agent.md` | Infrastructure as code |
| **vitest** | testing | `testing/vitest.agent.md` | Unit testing |
| **playwright** | testing | `testing/playwright.agent.md` | E2E testing |
| **jest** | testing | `testing/jest.agent.md` | Classic testing |
| **msw** | testing | `testing/msw.agent.md` | API mocking |

---

## Agent File Format

### Required Sections

Every `.agent.md` file MUST contain:

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

### Optional Sections

```markdown
## Version
[Agent version]

## Examples
[Real-world code examples]

## Troubleshooting
[Common issues and solutions]

## Resources
[Links to official docs]
```

---

## Integration with /studio build

### Auto-Invocation

```bash
# Any --tech flag auto-invokes agent
/studio build --tech=rust "Create API"

# Equivalent to:
/agent backend/rust
/studio build "Create API"
```

### Flag Combination

```bash
# Agent + speed flag
/studio build --tech=nextjs --speed "Add login page"
# → Loads Next.js agent, uses fast workflow

# Agent + scale flag
/studio build --tech=rust --scale "Build complete API"
# → Loads Rust agent, uses thorough workflow

# Agent + quality flag
/studio build --tech=prisma --quality "Design database schema"
# → Loads Prisma agent, validates with quality gates
```

---

## Error Handling

### Agent Not Found

```bash
/studio build --tech=nonexistent "Task"

# Response:
# ❌ Error: Agent 'nonexistent' not found
#
# Available agents:
# • nextjs, react, vite, react-native (frontend)
# • rust, nestjs, express, fastapi (backend)
# • prisma, drizzle, postgresql, mongodb (database)
# • docker, kubernetes, terraform (devops)
# • vitest, playwright, jest, msw (testing)
```

### Ambiguous Tech Name

```bash
/studio build --tech=react "Task"

# If multiple react agents exist:
# ⚠️ Warning: Multiple agents match 'react'
#
# Please specify:
# • --tech=react (React web)
# • --tech=react-native (React mobile)
```

---

## Creating New Agents

### Step 1: Create Agent File

```bash
# In appropriate domain directory
touch plugins/agents/agents/backend/fastify.agent.md
```

### Step 2: Follow Template

```markdown
# Fastify Development Agent

## Mission
Specialized in Fastify web framework with TypeScript, plugins, and high-performance patterns.

## Stack
- **Fastify**: 4.x
- **TypeScript**: 5.x
- **Validation**: JSON Schema
- **Testing**: Vitest

## Patterns
### Plugin Architecture
```typescript
import fp from 'fastify-plugin'

export default fp(async (fastify, options) => {
  fastify.decorate('utility', () => {})
})
```

### Schema Validation
```typescript
fastify.post('/users', {
  schema: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
      }
    }
  }
})
```

## Workflow
1. Define schema first
2. Implement route handler
3. Add validation
4. Write tests
5. Document API

## Integration
Usage: `/studio build --tech=fastify "Create API endpoint"`
```

### Step 3: Update Domain Index

```markdown
<!-- plugins/agents/agents/backend/index.md -->

## Available Agents

- **Rust** - DDD architecture, tokio, sqlx
- **NestJS** - Modular architecture, DI
- **Express** - Minimalist patterns
- **Fastify** - High-performance, plugins
```

### Step 4: Test Discovery

```bash
# Verify discovery works
/studio build --tech=fastify "Create test route"

# Should load fastify.agent.md and execute with Fastify patterns
```

---

## Best Practices

### 1. Agent Granularity

**DO:**
- Create agents for distinct technologies (`nextjs`, `rust`, `prisma`)
- Keep agents focused on one domain

**DON'T:**
- Create overly broad agents (`webdev`, `backend`)
- Mix multiple domains in one agent

### 2. Version Specificity

**DO:**
- Specify exact versions in `## Stack` section
- Include version-specific patterns

```markdown
## Stack
- **Next.js**: 16.0+ (not just "Next.js")
- **React**: 19.2 (not just "React")
```

### 3. Pattern Examples

**DO:**
- Provide real code examples
- Show common patterns with actual syntax

**DON'T:**
- Write vague descriptions
- Skip code examples

### 4. Workflow Clarity

**DO:**
- Number steps clearly
- Include validation/verification steps

```markdown
## Workflow
1. Define schema with Zod
2. Create migration with Prisma
3. Implement Server Action
4. Add TanStack Query hook
5. Build UI component
6. Test with Vitest
```

---

## Troubleshooting

### Agent Not Loading

**Symptom:** `--tech` flag doesn't seem to work

**Check:**
1. Agent file exists at correct path
2. Agent file follows `.agent.md` naming
3. `manifest.json` includes the domain
4. Agent file has required sections

**Fix:**
```bash
# Verify file exists
ls plugins/agents/agents/backend/rust.agent.md

# Check manifest
cat plugins/agents/manifest.json

# Validate format
head -20 plugins/agents/agents/backend/rust.agent.md
```

### Wrong Patterns Used

**Symptom:** Agent loads but uses generic patterns

**Check:**
1. Agent context is actually loaded
2. Agent sections are properly formatted
3. No conflicting agents loaded

**Fix:**
- Use `--agent` flag for explicit selection
- Check agent file for correct section headers

### Performance Issues

**Symptom:** Slow task execution with agents

**Cause:** Loading too many agents

**Fix:**
```bash
# Use specific agent instead of domain
/studio build --agent=rust "Task"  # Fast
# NOT
/studio build --agent=backend "Task"  # Slow (loads all backend agents)
```

---

## Advanced Usage

### Composite Agents

```bash
# Load multiple agents
/studio build --tech=nextjs --tech=prisma "Create CRUD API"
# → Loads both Next.js and Prisma agents
```

### Agent Chaining

```bash
# Sequential agent usage
/agent backend/rust "Design API structure"
/studio build --tech=rust "Implement API"
/agent testing/vitest "Add tests"
```

### Custom Agent Paths

```bash
# Load agent from custom location
/studio build --agent=./custom-agents/my-tech.agent.md "Task"
```

---

## API Reference

### Discovery Functions

```typescript
// Discover agent by tech name
discoverAgent(tech: string): Agent | null

// Find all agents in domain
discoverAgentsByDomain(domain: string): Agent[]

// Get agent info
getAgentInfo(agent: Agent): AgentInfo
```

### Loading Functions

```typescript
// Load agent context
loadAgent(agentPath: string): AgentContext

// Merge multiple agents
mergeAgents(agents: Agent[]): MergedAgentContext

// Validate agent file
validateAgent(agentPath: string): ValidationResult
```

---

## Version History

- **v1.0.0** (2026-02-10) - Initial agent discovery system
  - Manifest-based discovery
  - `--tech` flag auto-selection
  - `--agent` flag manual selection
  - Support for 5 domains (frontend, backend, database, devops, testing)

---

**Maintained by**: SMITE Core Team
**License**: MIT
**Repository**: https://github.com/Pamacea/smite
