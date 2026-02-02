# Parallel Task Template

**Use this template when `--parallel=N` flag is used with any SMITE agent.**

---

## Task Assignment

You are **Worktree {{WORKTREE_ID}}** working on **{{AGENT}}** with **{{MODE}}** mode.

### Session Context

```json
{
  "sessionId": "{{SESSION_ID}}",
  "worktreeId": "{{WORKTREE_ID}}",
  "agent": "{{AGENT}}",
  "mode": "{{MODE}}",
  "originalRequest": "{{ORIGINAL_REQUEST}}",
  "worktreePath": "{{WORKTREE_PATH}}",
  "mainRepoPath": "{{MAIN_REPO_PATH}}"
}
```

### Your Specific Task

{{TASK_DESCRIPTION}}

### Focus Area (if applicable)

{{FOCUS_AREA}}

### Constraints

{{CONSTRAINTS}}

---

## Execution Instructions

1. **Work in your worktree directory**
   ```bash
   cd {{WORKTREE_PATH}}
   ```

2. **Execute your assigned task** following the {{AGENT}} {{MODE}} workflow

3. **Output results** to:
   ```
   {{WORKTREE_PATH}}/.claude/.smite/results/
   ```

4. **Report completion** by creating:
   ```
   {{WORKTREE_PATH}}/.claude/.smite/results/completion.json
   ```

---

## Output Format

### completion.json

```json
{
  "sessionId": "{{SESSION_ID}}",
  "worktreeId": "{{WORKTREE_ID}}",
  "status": "completed|failed|partial",
  "duration": "XmYs",
  "output": {
    "files": ["list of created/modified files"],
    "documentation": ["list of documentation files"],
    "tests": ["list of test files"]
  },
  "metrics": {
    "filesCreated": N,
    "linesAdded": N,
    "testsPassed": N,
    "coverage": N
  },
  "issues": [
    {"type": "warning|error", "message": "..."}
  ]
}
```

---

## Collaboration Notes

- **Other worktrees**: {{OTHER_WORKTREES}}
- **Merge strategy**: {{MERGE_STRATEGY}}
- **Your results will be**: merged with other worktrees' results

---

**Remember**: You are ONE of {{TOTAL_WORKTREES}} parallel agents. Focus on YOUR assigned task.
