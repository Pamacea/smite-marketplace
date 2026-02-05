---
name: coordinator
description: Parallel agent coordinator with shared state management
version: 1.0.0
---

# Coordinator Skill - Parallel Agent Orchestration

## Mission

Coordinate multiple agents in parallel with shared state management for efficient execution.

---

## Shared State Protocol

### State File Location
```
.claude/.smite/shared-state.json
```

### State Schema
```json
{
  "session_id": "uuid",
  "timestamp": "ISO8601",
  "status": "initializing|running|completed|failed",
  "mode": "quick|epct|builder|predator|ralph",
  "agents": {
    "active": ["agent-1", "agent-2"],
    "completed": [],
    "failed": []
  },
  "context": {
    "task": "string",
    "files": [],
    "dependencies": {}
  },
  "results": {
    "agent-1": null,
    "agent-2": null
  },
  "shared": {
    "patterns": {},
    "types": {},
    "components": {}
  }
}
```

---

## State Operations

### Read State
```markdown
Before any operation:
1. Read .claude/.smite/shared-state.json
2. Check if session exists
3. Verify status allows operation
```

### Write State
```markdown
After any operation:
1. Update relevant fields
2. Set timestamp
3. Write to .claude/.smite/shared-state.json
4. Notify waiting agents (via file watcher or poll)
```

### Lock Mechanism
```json
{
  "lock": {
    "held_by": "agent-name",
    "acquired_at": "ISO8601",
    "expires_at": "ISO8601"
  }
}
```

---

## Parallel Execution Strategy

### Phase 1: Planning (Sequential)
```markdown
1. Initialize shared state
2. Determine parallelizable tasks
3. Create agent assignments
4. Set dependencies
```

### Phase 2: Execution (Parallel)
```markdown
Launch agents in parallel using Task tool:

Task("explore-patterns", "Search for similar patterns", subagent_type="Explore")
Task("explore-types", "Find type definitions", subagent_type="Explore")
Task("web-research", "Check latest docs", subagent_type="general-purpose")

All three run simultaneously.
```

### Phase 3: Aggregation (Sequential)
```markdown
1. Wait for all agents to complete
2. Collect results from shared-state.results
3. Merge/aggregate findings
4. Resolve conflicts
5. Write final state
```

---

## Coordination Patterns

### Pattern 1: Map-Reduce
```markdown
MAP (Parallel):
- Agent A: Explore directory A
- Agent B: Explore directory B
- Agent C: Explore directory C

REDUCE (Sequential):
- Combine findings
- Identify patterns
- Generate unified report
```

### Pattern 2: Pipeline
```markdown
STAGE 1 (Parallel):
- Agent A: Analyze requirements
- Agent B: Check dependencies

STAGE 2 (Sequential, waits for Stage 1):
- Agent C: Create architecture
- Uses results from A + B
```

### Pattern 3: Fan-Out/Fan-In
```markdown
FAN-OUT:
- Coordinator → launches N subagents
- Each processes independent data

FAN-IN:
- Coordinator aggregates all results
- Produces unified output
```

---

## Agent Communication

### Direct Message Passing
```json
{
  "messages": [
    {
      "from": "explore-patterns",
      "to": "explore-types",
      "type": "query",
      "payload": {"patterns_found": ["A", "B"]},
      "timestamp": "ISO8601"
    }
  ]
}
```

### Shared Data Bus
```json
{
  "bus": {
    "patterns": [],
    "types": [],
    "components": [],
    "last_updated": "ISO8601"
  }
}
```

---

## Error Handling

### Agent Failure
```markdown
When an agent fails:
1. Mark agent as failed in state
2. Store error message
3. Decide retry strategy:
   - Retry same agent (if transient)
   - Launch alternative agent
   - Continue without failed agent
   - Abort entire operation
```

### Conflict Resolution
```markdown
When agents produce conflicting results:
1. Detect conflict in aggregation phase
2. Apply resolution strategy:
   - First writer wins
   - Last writer wins
   - Merge (if compatible)
   - Escalate to user
```

---

## Parallel Launch Template

```markdown
## Parallel Execution Plan

### Objective
${task_description}

### Agents to Launch (Parallel)
1. **Agent A**: ${task_a} - "${prompt_a}"
2. **Agent B**: ${task_b} - "${prompt_b}"
3. **Agent C**: ${task_c} - "${prompt_c}"

### Shared State Initialization
```json
{
  "session_id": "${uuid}",
  "mode": "${current_mode}",
  "agents": {"active": ["A", "B", "C"]},
  "context": {...}
}
```

### Aggregation Strategy
- Wait for all 3 agents
- Merge results by ${merge_method}
- Output: ${output_file}

**Launch in parallel now?**
```

---

## Integration with Modes

### --quick Mode
```markdown
Parallel: 1-2 explore agents max
Skip shared state (too fast to warrant overhead)
```

### --epct Mode
```markdown
EXPLORE: 2-3 parallel agents
PLAN: Sequential (uses exploration results)
CODE: 1 tech subagent
TEST: Parallel (unit + integration can run together)
```

### --builder Mode
```markdown
EXPLORE: 1 agent (quick pattern search)
DESIGN: Sequential
IMPLEMENT: 1 tech subagent
TEST: Parallel (unit + integration)
VERIFY: Sequential
```

### --predator Mode
```markdown
ANALYZE: 2-3 parallel agents
PLAN: Sequential
EXECUTE: Sequential
VALIDATE: Parallel (lint + typecheck + tests)
EXAMINE: 1 adversarial agent (if --examine)
```

### --ralph Mode
```markdown
Already parallel internally - coordinator manages:
- Story batch execution
- Inter-story dependencies
- Progress tracking
```

---

## State Cleanup

```markdown
After completion:
1. Mark status as "completed"
2. Archive state to .claude/.smite/history/
3. Delete shared-state.json
4. Notify all agents (session closed)
```

---

## Example Usage

### Example 1: EPCT Explore Phase
```markdown
## Parallel Exploration

Launching 3 agents in parallel:

Task("find-components", "Find React components matching user auth pattern", subagent_type="Explore")
Task("find-types", "Find User and Auth type definitions", subagent_type="Explore")
Task("find-hooks", "Find authentication related hooks", subagent_type="Explore")

Waiting for all to complete...

Aggregating results:
- Components: 12 files found
- Types: 5 files found
- Hooks: 8 files found

Shared state updated with exploration.md
```

### Example 2: Predator Validation
```markdown
## Parallel Validation

Launching 3 validators in parallel:

Task("lint-check", "Run ESLint and report issues", subagent_type="general")
Task("type-check", "Run TypeScript compiler", subagent_type="general")
Task("unit-tests", "Run unit tests for changed files", subagent_type="general")

Waiting for all to complete...

Aggregation:
- Lint: 3 warnings
- Types: 0 errors
- Tests: 45 passing

Validation result: PASS (fix lint warnings)
```

---

## Best Practices

1. **State first**: Always initialize shared state before launching agents
2. **Idempotent**: Agents should be retry-safe
3. **Timeout**: Set reasonable timeout for each agent
4. **Cleanup**: Always clean up state after completion
5. **Observe**: Monitor agent status through shared state
6. **Communicate**: Use message passing for cross-agent coordination
7. **Aggregate**: Design aggregation strategy before launching

---

*Coordinator Skill v1.0.0 - Parallel agent orchestration with shared state*
