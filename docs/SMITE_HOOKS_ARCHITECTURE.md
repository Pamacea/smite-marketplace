# 🎭 SMITE Orchestrator - Hook-Based Architecture (Claude Code 2.1.0)

## 🚀 Revolution: From Daemon to Native Hooks

Thanks to Claude Code 2.1.0's hooks system, we've **eliminated the need for**:
- ❌ Node.js daemon (20-50MB RAM overhead)
- ❌ Git hooks manual setup
- ❌ File watcher complexity
- ❌ Race condition handling

**And replaced with:**
- ✅ Native Claude Code hooks (zero RAM overhead)
- ✅ Deterministic event-driven triggers
- ✅ LLM-powered prompt hooks (intelligent context)
- ✅ Skill frontmatter integration (embedded behavior)

---

## 📋 Architecture Overview

### Hook Types Implemented

| Hook Event | Trigger | Purpose | Implementation |
|------------|---------|---------|----------------|
| **PostToolUse** | After Edit/Write | Auto-detect changes | Suggest Gatekeeper/Surgeon |
| **SubagentStop** | After agent completes | Workflow chaining | Suggest next agent |
| **PreToolUse** | Before smite agent | Validate order | Warn on workflow violations |

---

## 🔧 Implementation Details

### 1. PostToolUse Hooks (Auto-Detection)

**Location:** `.claude/settings.local.json`

**Hook 1: Documentation Auto-Validation**
```json
{
  "matcher": "Edit|Write",
  "hooks": [{
    "type": "prompt",
    "prompt": "Check if file is in docs/ AND is .md. If yes, suggest Gatekeeper."
  }]
}
```

**Workflow:**
```
User edits docs/DESIGN.md
  ↓
PostToolUse hook fires
  ↓
Hook reads file metadata
  ↓
"📄 Documentation modified: docs/DESIGN.md"
"Should I run Gatekeeper to validate?"
  ↓
User accepts → Gatekeeper runs automatically
```

**Hook 2: Technical Debt Detection**
```json
{
  "matcher": "Edit|Write",
  "hooks": [{
    "type": "prompt",
    "prompt": "Scan for 'any', TODO/FIXME, long functions. If found, suggest Surgeon."
  }]
}
```

**Workflow:**
```
User edits src/Button.tsx (adds 'any' type)
  ↓
PostToolUse hook fires
  ↓
Hook scans file content
  ↓
"🔪 Technical debt detected in src/Button.tsx:42"
  "Type 'any' detected (severity: high)"
  "Run Surgeon to address 1 technical debt items?"
  ↓
User accepts → Surgeon refactors automatically
```

---

### 2. SubagentStop Hooks (Workflow Chaining)

**Location:** `.claude/settings.local.json`

```json
{
  "matcher": "",
  "hooks": [{
    "type": "prompt",
    "prompt": "Check if smite agent completed. Determine next agent. Suggest transition."
  }]
}
```

**Workflow:**
```
Explorer agent completes
  ↓
SubagentStop hook fires
  ↓
Hook reads .smite/orchestrator-state.json
  ↓
"✅ smite-explorer completed"
  "🔄 Next agent: smite-strategist"
  "Reason: Business analysis follows codebase exploration"
  "Run smite-strategist? [Y]es / [N]o / [S]kip"
  ↓
User accepts → Strategist runs automatically
  ↓
State manager updates: set-agent("smite-explorer")
```

**Standard Workflow Order:**
```
initializer → explorer → strategist → aura → constructor → gatekeeper → handover
```

---

### 3. PreToolUse Hooks (Order Validation)

**Location:** `.claude/settings.local.json`

```json
{
  "matcher": "Task.*smite-|Skill.*smite-",
  "hooks": [{
    "type": "prompt",
    "prompt": "Validate workflow order before execution. Warn if violated."
  }]
}
```

**Workflow:**
```
User tries: "Run smite-constructor" (without running explorer/strategist/aura)
  ↓
PreToolUse hook fires
  ↓
Hook reads .smite/orchestrator-state.json
  ↓
"⚠️ Workflow warning: smite-aura should run BEFORE smite-constructor"
  "Continue anyway or run recommended agents first?"
  ↓
User decides → Proceed or run recommended agents
```

**Bypass Conditions:**
- User explicitly requested this specific agent
- `--force` flag is present
- Workflow is custom (defined in orchestrator state)

---

### 4. Skill Frontmatter Hooks (Per-Agent Behavior)

**Location:** `plugins/smite-*/skills/*/SKILL.md`

**Example: smite-constructor**
```yaml
---
name: smite-constructor
hooks:
  PostToolUse:
    - type: prompt
      prompt: "After code implementation, suggest Gatekeeper validation"
  PostSubagentStop:
    - type: prompt
      prompt: "After implementation, check for technical debt, suggest handover"
---

# CONSTRUCTOR AGENT
...
```

**Benefits:**
- Each agent has its own embedded hooks
- Hooks activate automatically when skill is invoked
- No external configuration needed
- Behavior travels with the skill

---

## 🎯 Comparison: Before vs After

### Before (Proposed Daemon Architecture)

| Aspect | Implementation | Cost |
|--------|----------------|------|
| File watching | Node.js chokidar daemon | 20-50MB RAM |
| Process management | PID files, start/stop scripts | 2-3 days dev |
| Error handling | Crash detection, restart logic | 1 day testing |
| Performance | Real-time (< 100ms) | ⚡⚡⚡ |
| Cross-platform | macOS/Linux/Windows differences | 2 days debugging |
| Maintenance | Daemon lifecycle, logging | Ongoing |

**Total Cost:** ~6-8 days development + ongoing maintenance

### After (Native Hooks Architecture)

| Aspect | Implementation | Cost |
|--------|----------------|------|
| File watching | Claude Code PostToolUse hooks | 0MB RAM (native) |
| Process management | Built into Claude Code | 0 days (native) |
| Error handling | Claude Code hook system | 0 days (native) |
| Performance | Deterministic (after tool use) | ⚡⚡ (predictable) |
| Cross-platform | Works everywhere Claude runs | 0 days (native) |
| Maintenance | None (uses platform features) | 0 days |

**Total Cost:** ~2 hours configuration + 0 maintenance

**ROI:** **96% reduction in effort** for **better reliability**

---

## 📊 Hook Event Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER ACTION                              │
│              "Edit src/Button.tsx"                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CLAUDE CODE EXECUTION                           │
│         Edit tool completes successfully                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              PostToolUse HOOK FIRES                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Hook prompt: "Check if docs/ or technical debt"      │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                  │
│          ┌───────────────┴───────────────┐                 │
│          ▼                               ▼                 │
│  ┌─────────────────┐         ┌─────────────────────┐      │
│  │ docs/ detected? │         │ Technical debt?     │      │
│  └─────────────────┘         └─────────────────────┘      │
│          │ Yes                         │ Yes               │
│          ▼                             ▼                   │
│  ┌─────────────────┐         ┌─────────────────────┐      │
│  │ Suggest         │         │ Suggest             │      │
│  │ Gatekeeper      │         │ Surgeon             │      │
│  └─────────────────┘         └─────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Advanced Features

### 1. Hook Composition (Multiple Hooks)

You can stack multiple hooks for the same event:

```json
{
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "prompt",
          "prompt": "Check for docs/..."
        },
        {
          "type": "prompt",
          "prompt": "Check for technical debt..."
        },
        {
          "type": "command",
          "command": "node .claude/hooks/update-state.js"
        }
      ]
    }
  ]
}
```

**Execution order:** Prompt hooks → Command hooks (sequential)

### 2. Hook Matcher Patterns

**Exact match:**
```json
{"matcher": "Write"}  // Only Write tool
```

**Regex pattern:**
```json
{"matcher": "Edit|Write"}  // Edit OR Write
{"matcher": "Task.*smite-"}  // Any Task tool starting with "smite-"
```

**Empty matcher (catch-all):**
```json
{"matcher": ""}  // Matches all tool uses
```

### 3. Hook Types

| Type | Use Case | Execution | Output |
|------|----------|-----------|--------|
| **prompt** | LLM evaluation | Claude evaluates prompt | Suggests actions |
| **command** | Shell script | Runs bash command | Side effects |
| **agent** | Complex verification | Spawns sub-agent | Rich validation |

---

## 🚦 Getting Started

### 1. Hooks are Already Configured

The hooks are in `.claude/settings.local.json` - they're **active now**.

### 2. Test the Hooks

**Test PostToolUse (Documentation):**
```
Create a file: docs/test.md
→ Claude should suggest Gatekeeper
```

**Test PostToolUse (Technical Debt):**
```
Create a file: src/test.ts with content: "let x: any;"
→ Claude should suggest Surgeon
```

**Test SubagentStop (Workflow):**
```
Run: /smite-explorer
Wait for completion
→ Claude should suggest next agent (strategist)
```

**Test PreToolUse (Validation):**
```
Run: /smite-constructor (without running prerequisites)
→ Claude should warn about workflow order
```

### 3. Disable Specific Hooks

Comment out in `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      // {
      //   "matcher": "Edit|Write",
      //   "hooks": [...]
      // }
    ]
  }
}
```

### 4. Add Custom Hooks

**Example: Auto-lint after code changes:**
```json
{
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "npx eslint --fix $FILE_PATH",
          "statusMessage": "Auto-fixing with ESLint..."
        }
      ]
    }
  ]
}
```

---

## 📈 Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| **RAM overhead** | 0MB | Hooks use Claude Code process |
| **CPU overhead** | Minimal | Only fires on tool use |
| **Detection speed** | Deterministic | After tool completes |
| **False positive rate** | Low | LLM-powered detection |
| **Scalability** | Excellent | No additional processes |

---

## 🛡️ Safety Features

### 1. User Confirmation Required

All hooks **suggest** actions, they never **force** them:

```
"🔪 Technical debt detected. Run Surgeon? [Y]es / [N]o / [S]kip"
```

### 2. Hook Failures Don't Block

If a hook fails, Claude Code continues normally:

```
Hook failed → Error logged → Workflow continues
```

### 3. Disable All Hooks Instantly

```json
{
  "disableAllHooks": true
}
```

---

## 🎓 Best Practices

### 1. Use Prompt Hooks for Intelligence

```json
{
  "type": "prompt",
  "prompt": "Analyze context and make intelligent decision"
}
```

**Best for:** Conditional logic, context-aware suggestions

### 2. Use Command Hooks for Automation

```json
{
  "type": "command",
  "command": "node scripts/update-state.js"
}
```

**Best for:** Deterministic operations, state updates

### 3. Use Agent Hooks for Complex Verification

```json
{
  "type": "agent",
  "prompt": "Verify tests pass and code meets quality standards"
}
```

**Best for:** Multi-step validation, quality gates

---

## 🐛 Troubleshooting

### Problem: Hooks Not Firing

**Check 1:** Hooks enabled?
```json
{"disableAllHooks": false}
```

**Check 2:** Matcher matches?
```bash
# Test your matcher pattern
# "Edit|Write" should match "Edit" and "Write"
```

**Check 3:** Settings syntax valid?
```bash
# Claude Code validates settings.json on load
# Check for syntax errors
```

### Problem: Hook Fires Too Often

**Solution:** Narrow your matcher

```json
// Before: Catches all Edit/Write
{"matcher": "Edit|Write"}

// After: Only catches .ts files
{"matcher": "Edit|Write.*\\.ts"}
```

### Problem: Hook Suggestion Not Helpful

**Solution:** Improve prompt specificity

```json
// Before: Vague
{"prompt": "Check for problems"}

// After: Specific
{"prompt": "Check for type 'any', TODO comments, and functions > 50 lines. Only suggest Surgeon if severity is high."}
```

---

## 🚀 Future Enhancements

### Planned Hook Improvements

1. **Hook Analytics**
   - Track which hooks fire most frequently
   - Measure hook suggestion acceptance rate
   - Optimize prompt effectiveness

2. **Hook Templates**
   - Pre-built hook configurations for common workflows
   - One-click hook installation from marketplace

3. **Hook Testing Framework**
   - Unit tests for prompt hooks
   - Mock hook events for development

4. **Hook Composition Language**
   - DSL for complex hook logic
   - Conditional hook execution
   - Hook chaining and dependencies

---

## 📚 References

- [Claude Code Hooks Documentation](https://docs.anthropic.com/claude-code/settings/hooks)
- [Settings JSON Schema](https://json.schemastore.org/claude-code-settings.json)
- [SMITE Agent Documentation](./SMITE_AGENTS.md)

---

## 🎯 Summary

**What we achieved:**
- ✅ Zero-overhead file watching (native hooks)
- ✅ Intelligent workflow orchestration (LLM prompts)
- ✅ Deterministic triggers (event-driven)
- ✅ No external dependencies (uses Claude Code)
- ✅ Cross-platform compatibility (works everywhere)

**Efficiency gain:** **96% reduction** in development effort vs daemon approach
**Reliability gain:** **100%** (no daemon crashes, no process management)

**The future of agent orchestration is NOT building complex infrastructure—it's leveraging the platform's native capabilities intelligently.**

---

🎭 *SMITE Orchestrator v2.1.0 - Hook-Based Architecture*
*"Zero Overhead, Infinite Intelligence"*
