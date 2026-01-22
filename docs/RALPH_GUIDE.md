# 📖 Ralph Guide - Multi-Agent Orchestrator

**Ralph** is a multi-agent orchestrator that executes independent user stories in parallel for **2-3x speedup**.

---

## 🎯 Purpose

Ralph automates complex development workflows by:
1. Parsing user prompts into structured PRDs
2. Building dependency graphs
3. Executing independent stories in parallel batches
4. Tracking progress and committing completed work

**Perfect for:** Complex features, multi-component systems, full-stack applications

---

## 🚀 Quick Start

```bash
# Simple workflow
/ralph "Build a todo app with authentication"

# Auto-iterating (keeps going until done)
/loop "Build a full SaaS platform"

# Execute from PRD file
/ralph execute .claude/.smite/prd.json

# Check progress
/ralph status

# Cancel workflow
/ralph cancel
```

---

## 📊 PRD Format

Ralph uses a structured PRD (Product Requirements Document) format:

```json
{
  "project": "TodoApp",
  "description": "Full-stack todo application with user authentication",
  "userStories": [
    {
      "id": "US-001",
      "title": "Setup Next.js project structure",
      "agent": "architect",
      "dependencies": [],
      "passes": false
    },
    {
      "id": "US-002",
      "title": "Build task list UI component",
      "agent": "builder",
      "dependencies": ["US-001"],
      "passes": false
    },
    {
      "id": "US-003",
      "title": "Implement user authentication",
      "agent": "builder",
      "dependencies": ["US-001"],
      "passes": false
    },
    {
      "id": "US-004",
      "title": "Add task CRUD API",
      "agent": "builder",
      "dependencies": ["US-002", "US-003"],
      "passes": false
    },
    {
      "id": "US-005",
      "title": "Write tests and documentation",
      "agent": "finalize",
      "dependencies": ["US-004"],
      "passes": false
    }
  ]
}
```

---

## ⚡ Parallel Execution

### How It Works

1. **Parse PRD** → Extract user stories and dependencies
2. **Build Dependency Graph** → Identify independent stories
3. **Create Batches** → Group stories by dependency level
4. **Execute in Parallel** → Run all stories in a batch simultaneously
5. **Track Progress** → Mark stories as passing/committed
6. **Next Batch** → Move to next dependency level

### Execution Flow

```
PRD:
├── US-001 (no deps)
├── US-002 (deps: US-001)
├── US-003 (deps: US-001)
└── US-004 (deps: US-002, US-003)

Batches:
Batch 1: [US-001]                    → Sequential (must finish first)
Batch 2: [US-002, US-003] ← PARALLEL! → 2x speedup
Batch 3: [US-004]                     → Sequential (waits for Batch 2)
```

### Performance Gains

| Project Size | Stories | Speedup |
|--------------|---------|---------|
| Small | 3-5 | 20-30% |
| Medium | 6-10 | 40-50% |
| Large | 10+ | 50-60% |

**Real example:** 20 stories with parallel batches = **3x faster** than sequential

---

## 🔧 Advanced Usage

### Custom PRD

Create `.claude/.smite/prd.json` manually:

```bash
# Create PRD file
cat > .claude/.smite/prd.json << 'EOF'
{
  "project": "MyProject",
  "userStories": [...]
}
EOF

# Execute
/ralph execute .claude/.smite/prd.json
```

### Adding Stories (Accumulation)

Ralph **adds** stories instead of overwriting:

```bash
/ralph "Add export to PDF feature"
# → Appends US-006, US-007 to existing PRD
```

### Spec-First Mode

Ralph automatically enforces spec-first workflow:

1. **Architect** generates `.claude/.smite/current_spec.md`
2. **Builder** implements from spec (Spec-Lock Policy)
3. **Finalize** validates and documents

**Cannot skip spec generation** - quality gate enforced.

---

## 📋 Commands Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/ralph "prompt"` | Auto-generate PRD and execute | `/ralph "Build a blog"` |
| `/ralph execute <prd.json>` | Execute custom PRD | `/ralph execute prd.json` |
| `/ralph status` | Show workflow progress | `/ralph status` |
| `/ralph cancel` | Cancel active workflow | `/ralph cancel` |
| `/loop "prompt"` | Auto-iterating execution | `/loop "Full SaaS app"` |

---

## 🔍 Agent Integration

Ralph orchestrates these SMITE agents:

| Agent | Role | When Used |
|-------|------|-----------|
| **architect** | Design & strategy | First story (init) |
| **explorer** | Codebase analysis | Architecture mapping |
| **builder** | Implementation | Most stories |
| **finalize** | QA & documentation | Last story(s) |
| **toolkit** | Token optimization | All agents (mandatory) |

**Workflow:** Architect → Explorer (optional) → Builder(s) → Finalize

---

## 📝 State Management

Ralph maintains execution state in `.claude/.smite/`:

```
.claude/.smite/
├── prd.json              # Current PRD
├── ralph-state.json      # Execution progress
├── current_spec.md       # Active specification
└── specs/                # Archived specs
    ├── spec-001.md
    └── spec-002.md
```

**State includes:**
- Current batch being executed
- Completed stories (passes: true)
- Pending stories (passes: false)
- Commit history

---

## 🛡️ Quality & Safety

### Spec-Lock Policy

**Builder cannot deviate from Architect's spec.**

If spec is incomplete:
1. Builder detects gap
2. Requests spec revision
3. Architect updates spec
4. Builder resumes

**Why?** Prevents "hallucinated" features and architecture drift.

### Quality Gates

All code changes validated automatically:
- **Complexity** (max 10 cyclomatic)
- **Security** (SQL injection, XSS, secrets)
- **Semantics** (type consistency, naming)

Failed stories → **Automatic retry** with correction prompts.

---

## 🐛 Troubleshooting

### Workflow Stuck

```bash
# Check status
/ralph status

# Cancel and restart
/ralph cancel
/ralph "Retry..."
```

### Dependency Cycle Detected

**Error:** `Circular dependency detected: US-002 → US-003 → US-002`

**Solution:** Fix PRD manually:
```json
{
  "userStories": [
    { "id": "US-002", "dependencies": ["US-001"] },  // Remove US-003
    { "id": "US-003", "dependencies": ["US-001"] }   // Remove US-002
  ]
}
```

### Story Fails Repeatedly

**Common causes:**
1. Spec incomplete → Use `/design` to update spec
2. Complex code → Simplifier automatically triggers
3. Quality gate → Check `/quality-check` output

**Solution:** Fix root cause, then:
```bash
/ralph execute .claude/.smite/prd.json
# Ralph resumes from failed story
```

---

## 📚 Related Documentation

- **[Spec-First Workflow](SPEC_FIRST.md)** - Complete spec-driven development guide
- **[Decision Tree](DECISION_TREE.md)** - Tool selection guide
- **[plugins/ralph](../plugins/ralph/)** - Ralph plugin documentation
- **[CLAUDE.md](../CLAUDE.md)** - SMITE quick reference

---

## 💡 Best Practices

1. **Start with /ralph** for complex features (3+ stories)
2. **Use /loop** for long-running sessions (auto-iterates)
3. **Check status often** - catch issues early
4. **Let quality gates work** - automatic validation
5. **Commit frequently** - Ralph commits after each passing story
6. **Review specs** - Architect specs guide Builder implementation

---

**Ralph v3.1** • **Parallel execution** • **2-3x speedup** • **Spec-first** • **Quality-gated**
