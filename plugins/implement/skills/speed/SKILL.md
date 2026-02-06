---
name: speed
description: Fast implementation mode - quick fixes and small features
version: 1.0.0
---

# Speed Skill - Fast Implementation

## Mission

Execute quick, surgical implementation for well-defined tasks with minimal overhead.

---

## 🔴 When to Use

**Perfect for:**
- Bug fixes with clear solutions
- UI tweaks (spacing, colors, alignment)
- Small feature additions (1-2 files)
- Quick configuration changes
- Typo corrections

**NOT for:**
- Multi-file features (use `--scale`)
- Complex architecture (use `--scale`)
- Critical systems (use `--quality`)
- Large projects (use `--team`)

---

## ⚡ Workflow

### EXPLORE (5 minutes max)

```markdown
1. Use targeted search (NOT grep/glob)
   - /explore --mode=quick "specific term"
   - grepai search "pattern"
   - /toolkit search "query"

2. Find files to edit
   - Know exactly what to search for
   - Surgical targeting only

3. NO PLANNING PHASE
   - Skip analysis
   - Skip documentation
   - Skip deliberation
```

### CODE (implement immediately)

```markdown
1. Start coding as soon as basic context available
2. Follow existing patterns EXACTLY
3. STRICTLY in scope - change only what's needed
4. NO comments unless absolutely necessary
5. NO refactoring beyond requirements
6. NO "nice to have" improvements
7. Run autoformatting when done
```

### TEST (basic only)

```markdown
1. Run: lint + typecheck (or equivalent)
2. Fix errors immediately
3. Re-run to verify
4. STAY IN SCOPE - no full test suite unless requested
```

---

## 📋 Example

```bash
# Usage
/implement --speed "fix login button alignment"

# Aliases
/implement --fast "..."
/implement --quick "..."
```

### What Happens

```
You: /implement --speed "fix login button"

Step 1: EXPLORE (parallel, 2 agents max)
  Agent 1: Find login component
  Agent 2: Find related styles

Step 2: CODE (immediate)
  - Edit files directly
  - Follow existing patterns
  - No planning, no comments

Step 3: TEST (basic)
  - lint + typecheck
  - Fix any errors

Done! (5-10 minutes total)
```

---

## ✅ Success Criteria

- ✅ Bug fixed / feature added
- ✅ Lint passes
- ✅ Typecheck passes
- ✅ No regressions in immediate area
- ✅ Time spent: 5-10 minutes max

---

## 🚨 Anti-Patterns

### AVOID:

```markdown
❌ Exploring entire codebase
   → Use --scale instead

❌ Creating detailed plans
   → Use --scale instead

❌ Adding extra improvements
   → Stay in scope

❌ Writing comprehensive tests
   → Use --scale instead

❌ Refactoring surrounding code
   → Stay in scope, or use --scale
```

---

## 💡 Tips

1. **Be specific** in your task description
   ```bash
   # Good
   /implement --speed "fix button margin-left"

   # Less good
   /implement --speed "fix styling issues"
   ```

2. **Know your files** if possible
   ```bash
   # Even better
   /implement --speed "fix margin in src/components/LoginButton.tsx"
   ```

3. **Skip the ceremony** for trivial changes
   ```bash
   # Totally fine
   /implement --speed "change color from blue to slate-600"
   ```

---

## ⏱️ Time Budget

| Phase | Budget | Action |
|-------|--------|--------|
| EXPLORE | 5 min | Find files, get context |
| CODE | 5-10 min | Implement changes |
| TEST | 2 min | Lint + typecheck |
| **Total** | **12 min max** | |

If taking longer, consider switching to `--scale`.

---

## 🔄 Related Flags

| Flag | When to use instead |
|------|---------------------|
| `--scale` | Multi-file changes, need planning |
| `--quality` | Critical systems, need validation |
| `--team` | Large project, parallel needed |
| `--speed --team` | Quick parallel (NEW!) |

---

*Speed Skill v1.0.0 - Fast implementation for quick wins*
