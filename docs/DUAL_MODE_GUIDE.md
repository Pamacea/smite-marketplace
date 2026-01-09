# SMITE Agents - Dual Mode Execution Guide

## 🎯 Overview

Each SMITE agent now supports **two execution modes**:

| Mode | Tool | Execution | Progress UI | Best For |
|------|------|-----------|-------------|----------|
| **Skill** | `Skill` tool | Sequential | Manual logging | Single agents, `/smite-[agent]` commands |
| **Task** | `Task` tool | Parallel | Native "Running x Agents" | Multi-agent workflows, orchestration |

---

## 🚀 Quick Start

### Single Agent (Skill Mode)

```bash
# Run single agent
/smite-gatekeeper --mode=commit-validation
```

### Parallel Agents (Task Mode) ⭐

```text
# Ask for parallel workflow
"Please validate, refactor, and document this feature"

# Result:
🚀 Running 3 Agents in parallel...

[Real-time progress for each agent]

✅ All 3 Agents completed
```

**Benefits of Task Mode:**
- ✅ Real-time tracking - See "Running x Agents" progress
- ✅ Parallel execution - ~2-3x faster for independent tasks
- ✅ Better error isolation - One failure doesn't block others

---

## 📋 All Available Agents (11)

| Agent | Purpose | Skill Command | Task File |
|-------|---------|---------------|-----------|
| **Initializer** | Project initialization | `/smite-init` | `agents/initializer.task.md` |
| **Explorer** | Codebase analysis | `/smite-explorer` | `agents/explorer.task.md` |
| **Strategist** | Business strategy | `/smite-strategist` | `agents/strategist.task.md` |
| **Aura** | Design systems | `/smite-aura` | `agents/aura.task.md` |
| **Constructor** | Implementation | `/smite-constructor` | `agents/constructor.task.md` |
| **Gatekeeper** | Code review & validation | `/smite-gatekeeper` | `agents/gatekeeper.task.md` |
| **Handover** | Knowledge transfer | `/smite-handover` | `agents/handover.task.md` |
| **Surgeon** | Refactoring | `/smite-surgeon` | `agents/surgeon.task.md` |
| **Brainstorm** | Creative problem-solving | `/smite-brainstorm` | `agents/brainstorm.task.md` |
| **Linter Sentinel** | Auto-fix linting | `*start-linter-sentinel` | `agents/linter-sentinel.task.md` |
| **Doc Maintainer** | Documentation sync | `*start-doc-maintainer` | `agents/doc-maintainer.task.md` |

---

## 🔄 When to Use Which Mode

### Use Skill Mode When

✅ Running a **single agent**
✅ User invokes agent via **`/smite-[agent]` command**
✅ **Sequential workflow** is sufficient
✅ **Simple task** without coordination needs

### Use Task Mode When ⭐

✅ Running **2+ agents in parallel**
✅ **Real-time progress tracking** needed
✅ **Multi-agent orchestration**
✅ **Time-critical workflows** (parallelization saves time)
✅ **Complex coordination** with dependencies

---

## 💡 Usage Examples

### Example 1: Parallel Code Review

```text
User: "Please validate and refactor this code"

🚀 Running 2 Agents in parallel...

Agent 1: Validating architecture...
Agent 2: Analyzing refactoring opportunities...

✅ All 2 Agents completed

Gatekeeper: ✅ PASS
Surgeon: ⚠️ 3 improvements found
```

### Example 2: Full Feature Workflow

```text
User: "Build new feature with validation"

Phase 1: 🚀 3 agents in parallel (Explorer, Brainstorm, Strategist)
Phase 2: 🚀 1 agent (Aura - Design)
Phase 3: 🚀 1 agent (Constructor - Implementation)
Phase 4: 🚀 3 agents in parallel (Gatekeeper, Surgeon, Handover)

✅ Feature complete!
```

### Example 3: Quality Assurance

```text
User: "Check code quality and documentation"

🚀 Running 3 Agents in parallel...

Agent 1: Linter Sentinel - Fixing linting issues...
Agent 2: Gatekeeper - Validating architecture...
Agent 3: Doc Maintainer - Syncing documentation...

✅ All 3 Agents completed

Linter: ✅ Fixed 12 issues
Gatekeeper: ✅ PASS - No violations
Doc Maintainer: ✅ Updated 8 files
```

---

## 🛠️ Task Tool Implementation

### Basic Pattern

```text
1. Print: "🚀 Running [N] Agents in parallel..."

2. In ONE message, launch multiple Tasks:
   Task(subagent_type="general-purpose",
     prompt="Read plugins/[agent]/agents/[agent].task.md and execute: [args]")

3. Each agent runs independently

4. Print: "✅ All [N] Agents completed"
```

### Example: Parallel Validation

```text
🚀 Running 3 Agents in parallel...

Task(subagent_type="general-purpose",
  prompt="Read plugins/smite-gatekeeper/agents/gatekeeper.task.md
         --artifact=src/features/new --mode=commit-validation")

Task(subagent_type="general-purpose",
  prompt="Read plugins/smite-surgeon/agents/surgeon.task.md
         --auto-target=src/features/new --reason=complexity")

Task(subagent_type="general-purpose",
  prompt="Read plugins/smite-handover/agents/handover.task.md
         --from=constructor --to=maintainer")

[All run in parallel with progress tracking]

✅ All 3 Agents completed
```

---

## 📁 File Structure

Each SMITE agent now has **two definition files**:

```
plugins/smite-gatekeeper/
├── skills/
│   └── gatekeeper.md          # Skill mode (sequential)
└── agents/
    └── gatekeeper.task.md     # Task mode (parallel) ⭐
```

---

## 🎓 Orchestrator Integration

The orchestrator automatically uses Task mode for parallel workflows:

```text
User: /smite-orchestrator --workflow=custom --agents=explorer,constructor,gatekeeper

Result:
Phase 1: 🚀 Running Explorer...
Phase 2: 🚀 Running Constructor...
Phase 3: 🚀 Running 2 Agents in parallel (Gatekeeper + Surgeon)...

✅ All agents completed
```

---

## ⚡ Performance Comparison

### Sequential (Skill Mode)
```
Agent 1: 30 seconds
Agent 2: 45 seconds
Agent 3: 20 seconds
Total: 95 seconds
```

### Parallel (Task Mode)
```
Agent 1: 30 seconds ┐
Agent 2: 45 seconds ├─ All run together
Agent 3: 20 seconds ┘
Total: ~45 seconds (max of all)
```

**Speedup:** ~2x faster for 3 independent agents! 🚀

---

## 🔄 Migration Notes

### Backwards Compatibility

✅ All existing `/smite-[agent]` commands still work
✅ Skill mode unchanged
✅ Task mode is additive, not breaking

### From Old to New

**Before:**
```text
🚀 Running Agent Gatekeeper...
Skill(smite-gatekeeper:smite:gatekeeper)
✅ Agent Gatekeeper completed
```

**After (Parallel):**
```text
🚀 Running 3 Agents in parallel...

Task(prompt="Execute gatekeeper.task.md")
Task(prompt="Execute surgeon.task.md")
Task(prompt="Execute handover.task.md")

✅ All 3 Agents completed
```

---

## 🧪 Testing

### Quick Test

```bash
# Test Skill mode
/smite-gatekeeper --mode=commit-validation

# Test Task mode (via orchestrator)
"Please validate and refactor this code"
```

### Expected Results

**Skill Mode:**
```text
🛡️ Gatekeeper starting validation...
[Validation happens]
✅ Gatekeeper completed
Status: ✅ PASS
```

**Task Mode:**
```text
🚀 Running 2 Agents in parallel...

Agent 1: Validating architecture...
Agent 2: Analyzing refactoring opportunities...

✅ All 2 Agents completed
```

---

## 📚 Resources

- **[README.md](../README.md)** - Main README with installation
- **[COMPLETION_REPORT.md](./COMPLETION_REPORT.md)** - Implementation details
- Each agent's `.task.md` file contains full execution protocol

---

## 🎯 Best Practices

### For Users

1. **Single agent?** Use `/smite-[agent]` command (Skill mode)
2. **Multiple agents?** Describe your goal, orchestrator uses Task mode
3. **Need speed?** Task mode runs agents in parallel
4. **Need tracking?** Task mode shows real-time progress

### For Developers

1. **Orchestration** - Use Task tool for multi-agent workflows
2. **Sequential** - Use Skill tool for single agents
3. **Always** print "🚀 Running..." before Task calls
4. **Always** launch parallel Tasks in ONE message

---

## 🏆 Summary

You now have **the best of both worlds**:

| Need | Solution |
|------|----------|
| Run one agent | Use **Skill** mode (or `/smite-[agent]` command) |
| Run multiple agents | Use **Task** mode (via orchestrator) |
| Real-time progress | Use **Task** mode |
| Max speed | Use **Task** mode (parallel execution) |

**Flexibility of Skill mode + Power of Task mode!** 🚀

---

**Version:** 2.0
**Status:** ✅ Production Ready
**Last Updated:** 2025-01-09
**Total Agents:** 11 (9 SMITE + 2 QA)
