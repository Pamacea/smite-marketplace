---
description: Display current session statusline with git, path, model, cost, tokens, progress, duration
allowed-tools: Bash
---

<objective>
Display a compact statusline showing current session information including git branch, changes, project path, model, cost, tokens, progress bar, percentage, and duration.
</objective>

<context>
The statusline provides a quick overview of your current Claude Code session:

```
main • +123/-45  • ~/Projects/smite • Opus 4.5 • $1.23 • 45K • ████████░░ • 78% • 1h 23m
```

Components:
- **branch**: Git branch name (or "N/A")
- **insertions**: Git changes (+N/-M format, empty if no changes)
- **path**: Abbreviated project path
- **model**: Model name (Opus 4.5, Sonnet 4.5, Haiku 4.5)
- **cost**: Estimated session cost in USD
- **tokens**: Total tokens used (K suffix for thousands)
- **progress**: Visual progress bar (10 chars)
- **percentage**: Context window percentage used
- **duration**: Session duration (Hh Mm format)
</context>

<process>
1. **Run the statusline script**: Execute the Node.js script
2. **Display output**: Show the formatted statusline
3. **Handle errors**: Gracefully show "N/A" for missing data
</process>

<rules>
- Only show insertions if there are actual changes
- Abbreviate long paths (show ... for middle components)
- Format tokens with K suffix for >= 1000
- Calculate cost based on model pricing
- Show progress bar based on context percentage
- Handle missing session data gracefully
</rules>

<success_criteria>
- Statusline displays in the expected format
- All data points are shown or marked N/A
- Command completes in < 100ms
- Works on all platforms (Windows, macOS, Linux)
</success_criteria>

<examples>
User: /statusline

Output: main • +123/-45  • ~/Projects/smite • Opus 4.5 • $1.23 • 45K • ████████░░ • 78% • 1h 23m

User: /statusline

Output: feature-branch • +42  • ~/.../myapp • Sonnet 4.5 • $0.15 • 12K • ██░░░░░░░░ • 23% • 15m
</examples>
