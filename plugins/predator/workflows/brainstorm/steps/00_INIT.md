# 00_INIT - Brainstorm Initialization

## Instructions

### 1. Parse Flags

Extract flags from command arguments:

```javascript
auto = args.includes('-auto') || args.includes('-a')
examine = args.includes('-examine') || args.includes('-x')
pr = args.includes('-pr') || args.includes('-p')
participants = extractParticipants(args) || 3
depth = extractDepth(args) || 'medium'
```

### 2. Create Output Folder

```bash
mkdir -p .claude/.smite/.predator/brainstorm/runs/$(date +%Y%m%d_%H%M%S)
```

### 3. Initialize State Variables

```yaml
workflow: brainstorm
topic: <extracted from args>
flags:
  auto: <true/false>
  examine: <true/false>
  pr: <true/false>
  participants: <N>
  depth: <shallow/medium/deep>
state:
  current_step: INIT
  ideas_generated: 0
  challenges_raised: 0
  solutions_synthesized: 0
start_time: <timestamp>
```

### 4. Display Configuration

```
╔════════════════════════════════════════╗
║        BRAINSTORM WORKFLOW              ║
╠════════════════════════════════════════╣
║ Topic: ${topic}                         ║
║                                         ║
║ Flags:                                  ║
║  • Auto Mode: ${auto}                   ║
║  • Examine: ${examine}                  ║
║  • Create PR: ${pr}                     ║
║  • Participants: ${participants}        ║
║  • Depth: ${depth}                      ║
║                                         ║
║ Output: .claude/.smite/.predator/brainstorm/runs/${ts}/║
╚════════════════════════════════════════╝
```

### 5. Save State

Write to `.claude/.smite/.predator/brainstorm/runs/${ts}/state.json`

### Output

```
✅ BRAINSTORM INIT COMPLETE
- Topic: ${topic}
- Participants: ${participants} idea generators
- Depth: ${depth}
- Output folder: .claude/.smite/.predator/brainstorm/runs/${ts}/

Next: 01_ANALYZE (understand problem space)
```
