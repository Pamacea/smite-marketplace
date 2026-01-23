# 00_INIT - Initialization

## Instructions

### 1. Parse Flags

Extract and parse the following flags from the command arguments:

```javascript
auto = args.includes('-auto') || args.includes('-a')
examine = args.includes('-examine') || args.includes('-x')
pr = args.includes('-pr') || args.includes('-p')
max_attempts = extractMaxAttempts(args) || 'unlimited'
```

### 2. Create Output Folder

Create a timestamped output folder for workflow artifacts:

```bash
mkdir -p .claude/.smite/.predator/runs/$(date +%Y%m%d_%H%M%S)
```

### 3. Initialize State Variables

Set up workflow state:

```yaml
workflow: predator
task: <extracted from args>
flags:
  auto: <true/false>
  examine: <true/false>
  pr: <true/false>
  max_attempts: <N/unlimited>
state:
  current_step: INIT
  issues_found: []
  files_created: []
  files_modified: []
start_time: <timestamp>
```

### 4. Display Configuration

```
╔════════════════════════════════════════╗
║         PREDATOR WORKFLOW              ║
╠════════════════════════════════════════╣
║ Task: ${task}                           ║
║                                         ║
║ Flags:                                  ║
║  • Auto Mode: ${auto}                   ║
║  • Examine: ${examine}                  ║
║  • Create PR: ${pr}                     ║
║  • Max Attempts: ${max_attempts}        ║
║                                         ║
║ Output: .claude/.smite/.predator/runs/${timestamp}/    ║
╚════════════════════════════════════════╝
```

### 5. Save State

Write state to `.claude/.smite/.predator/runs/${timestamp}/state.json`:

```json
{
  "workflow": "predator",
  "task": "...",
  "flags": {...},
  "state": {...},
  "start_time": "..."
}
```

### Output

```
✅ INIT COMPLETE
- Flags parsed: auto=${auto}, examine=${examine}, pr=${pr}
- Output folder created: .claude/.smite/.predator/runs/${timestamp}/
- State initialized

Next: 01_ANALYZE
```
