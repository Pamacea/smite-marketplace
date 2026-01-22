# 00_INIT - Debug Initialization

## Instructions

### 1. Parse Flags

Extract flags from command arguments:

```javascript
auto = args.includes('-auto') || args.includes('-a')
examine = args.includes('-examine') || args.includes('-x')
pr = args.includes('-pr') || args.includes('-p')
max_attempts = extractMaxAttempts(args) || 'unlimited'
```

### 2. Create Output Folder

Create timestamped debug folder:

```bash
mkdir -p .predator/debug/runs/$(date +%Y%m%d_%H%M%S)
```

### 3. Initialize State Variables

```yaml
workflow: debug
bug_description: <extracted from args>
flags:
  auto: <true/false>
  examine: <true/false>
  pr: <true/false>
  max_attempts: <N/unlimited>
state:
  current_step: INIT
  error_context: []
  hypotheses: []
  attempts: 0
  fix_applied: false
start_time: <timestamp>
```

### 4. Display Configuration

```
╔════════════════════════════════════════╗
║          DEBUG WORKFLOW                 ║
╠════════════════════════════════════════╣
║ Bug: ${bug_description}                 ║
║                                         ║
║ Flags:                                  ║
║  • Auto Mode: ${auto}                   ║
║  • Examine: ${examine}                  ║
║  • Create PR: ${pr}                     ║
║  • Max Attempts: ${max_attempts}        ║
║                                         ║
║ Output: .predator/debug/runs/${ts}/    ║
╚════════════════════════════════════════╝
```

### 5. Save State

Write to `.predator/debug/runs/${ts}/state.json`

### Output

```
✅ DEBUG INIT COMPLETE
- Bug description captured
- Flags parsed: auto=${auto}, examine=${examine}, pr=${pr}
- Output folder: .predator/debug/runs/${ts}/
- State initialized

Next: 01_ANALYZE (gather error context)
```
