---
name: teams
description: Claude Code Agent Teams integration - parallel multi-agent orchestration
version: 1.0.0
---

# Teams Skill - Agent Teams Integration

## Mission

Integrate Claude Code's native **Agent Teams** (Swarm mode) with SMITE's implementation workflows.

---

## 🎯 What are Agent Teams?

**Agent Teams** is Claude Code's native multi-agent orchestration system:
- **Team Lead**: Coordinates, delegates, synthesizes
- **Teammates**: Independent Claude Code instances
- **Shared Task List**: Task board with dependencies
- **Mailbox**: Inter-agent messaging

**Key difference from SMITE's coordinator:** Native sessions with true parallelism vs Task tool subagents.

---

## 🚀 Activation

### Enable Agent Teams

```bash
# Via environment variable
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS="1"

# Or via settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Verify Installation

```bash
# Check Claude Code version (need 2.1.32+)
claude --version

# Check if agent teams are available
claude --help | grep -i team
```

---

## 📋 Usage with SMITE

### Basic Team Usage

```bash
# Auto-detects that this needs a team
/implement "create full SaaS platform with billing"

# Explicit team mode
/implement --team "build multi-feature system"

# Combined flags
/implement --scale --team "large project with thorough planning"
/implement --quality --team "critical system with parallel agents"
```

### Team Structure

When `--team` is used, the system:

1. **Creates a team** with the task description
2. **Spawns teammates** for different aspects:
   - Frontend specialist
   - Backend specialist
   - Testing specialist
   - Documentation specialist (optional)
3. **Assigns tasks** via shared task list
4. **Coordinates work** via Team Lead
5. **Synthesizes results** into cohesive output

---

## 🏗️ Team Patterns

### Pattern 1: Full Stack

```bash
/implement --team "build authentication system"
```

**Teammates:**
- `auth-backend`: OAuth provider, token handling
- `auth-frontend`: Login/logout UI
- `test-agent`: Integration tests
- `docs-agent`: API documentation

### Pattern 2: Multi-Feature

```bash
/implement --scale --team "build dashboard with user management, billing, and reporting"
```

**Teammates:**
- `feature-dashboard`: Main dashboard
- `feature-users`: User management
- `feature-billing`: Billing system
- `feature-reporting`: Analytics

### Pattern 3: Quality-Focused

```bash
/implement --quality --team "implement payment processing"
```

**Teammates:**
- `impl-agent`: Implementation
- `security-review`: Security analysis
- `performance-review`: Performance optimization
- `test-review`: Test coverage

---

## 🔧 Display Modes

### In-Process (Default)

All teammates run in main terminal:
- Use `Shift+Up/Down` to select teammate
- Type to message directly
- Works in any terminal

### Split Panes (Requires tmux or iTerm2)

Each teammate gets own pane:
- See everyone's output at once
- Click into pane to interact

**Configuration:**
```json
{
  "teammateMode": "tmux"
}
```

---

## 📊 Task Management

### Shared Task List

Location: `~/.claude/tasks/{team-name}/`

```json
{
  "id": "1",
  "subject": "Implement OAuth callback handler",
  "status": "in_progress",
  "owner": "auth-backend",
  "blocks": ["2", "3"],
  "description": "Handle OAuth redirect and token exchange..."
}
```

### Task States

| State | Meaning |
|-------|---------|
| `pending` | Not started, waiting to be claimed |
| `in_progress` | Agent working on it |
| `completed` | Done, unblocks dependents |
| `failed` | Failed, needs attention |

### Task Claiming

- **Lead assigns**: Explicit delegation
- **Self-claim**: Agent picks next unblocked task
- **File locking**: Prevents race conditions

---

## 🔄 Integration with SMITE Flags

### Speed + Team

```bash
/implement --speed --team "quick parallel feature"
```

- Minimal planning
- Quick exploration
- Parallel implementation
- Fast turnaround

### Scale + Team

```bash
/implement --scale --team "large parallel project"
```

- Thorough planning phase
- Deep exploration
- Parallel implementation per component
- Full testing

### Quality + Team

```bash
/implement --quality --team "critical parallel system"
```

- Full quality gates
- Adversarial reviewers
- Security specialists
- Performance testers

### Maximum Power

```bash
/implement --scale --quality --team "production SaaS platform"
```

- Everything enabled
- Thorough planning
- Quality gates
- Parallel agents
- Comprehensive testing

---

## 🎯 Best Practices

### 1. Use Teams For

- **Large projects** (10+ files)
- **Multi-domain** (frontend + backend + tests)
- **Independent components** (can work in parallel)
- **Complex systems** (benefit from specialization)

### 2. Avoid Teams For

- **Quick fixes** (overhead too high)
- **Single-file changes** (no parallelism benefit)
- **Sequential tasks** (dependencies block everything)
- **Simple features** (one agent is enough)

### 3. Team Size

| Project Size | Recommended Team |
|--------------|------------------|
| Small (1-5 files) | 2-3 teammates |
| Medium (5-15 files) | 3-5 teammates |
| Large (15+ files) | 5+ teammates |

### 4. Task Breakdown

Good tasks for teammates:
- **Self-contained**: Each owns separate files
- **Clear boundaries**: Minimal overlap
- **Defined interfaces**: Clear integration points
- **Independent**: Can proceed without waiting

---

## 📁 File Structure

### Team Configuration

```
~/.claude/teams/{team-name}/
├── config.json           # Team members, IDs
└── tasks/                # Shared task list
```

### Working Directory

```
project/
├── .claude/
│   └── .smite/
│       └── teams/
│           └── {team-name}/
│               ├── plan.md
│               ├── exploration.md
│               ├── implementation/
│               └── summary.md
```

---

## 🚨 Limitations

### Current Limitations

- **No session resumption** with in-process teammates
- **Task status can lag** - may need manual updates
- **Shutdown can be slow** - teammates finish current work
- **One team per session** - cleanup before starting new
- **No nested teams** - only lead can manage team
- **Lead is fixed** - can't transfer leadership
- **Split panes require** tmux or iTerm2

### Workarounds

| Issue | Workaround |
|-------|------------|
| Task stuck | Check status, update manually, or nudge teammate |
| Slow shutdown | Wait patiently, or kill session |
| Orphaned tmux | `tmux ls` and `tmux kill-session -t <name>` |

---

## 🔍 Troubleshooting

### Teammates Not Appearing

- Check if task is complex enough
- Verify `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- In in-process mode, use `Shift+Down` to cycle
- For split panes, verify tmux is installed

### Too Many Permission Prompts

- Pre-approve common operations
- Set permissions before spawning teammates

### Lead Shuts Down Early

- Tell lead to wait for teammates
- Or tell lead to keep going

---

## 📚 Resources

- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)
- [What Is Claude Code Swarm Feature?](https://www.atcyrus.com/stories/what-is-claude-code-swarm-feature)
- [Introducing Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6)

---

*Teams Skill v1.0.0 - Claude Code Agent Teams integration*
