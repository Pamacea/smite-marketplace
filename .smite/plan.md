# Spec-First Pattern Implementation Plan

## Objective
Implement autonomous spec-first workflow in SMITE agents to decouple thinking from action, improving decision quality by validating logic 100% before syntax work.

## Current State Analysis
- **Agent Commands**: Each agent has a `.md` command file in `plugins/*/commands/`
- **Agent Types**: architect, builder, explorer, finalize, simplifier, ralph
- **Ralph Orchestrator**: Uses `TaskOrchestrator` class with `invokeAgent()` method that calls subagents
- **Current Flow**: Direct execution without intermediate specification step

## Target Behavior
1. **Spec Creation Phase**: Agent first creates `.smite/current_spec.md` with technical specification
2. **Review Phase**: System validates spec coherence
3. **Execution Phase**: Agent implements based on approved spec
4. **Lock Mechanism**: Agent must stop if logic gap detected, update spec, then resume

## Implementation Plan

### Phase 1: Create Spec Generator Module
**File**: `plugins/ralph/src/spec-generator.ts`

**Functions**:
```typescript
interface TechnicalSpec {
  objective: string;
  approach: string;
  steps: Array<{
    description: string;
    files: string[];
    signatures: string[];
    dependencies: string[];
  }>;
  validationCriteria: string[];
  risks: string[];
}

async generateSpec(story: UserStory): Promise<TechnicalSpec>
async writeSpec(spec: TechnicalSpec, path: string): Promise<void>
async validateSpec(spec: TechnicalSpec): Promise<{valid: boolean; gaps: string[]}>
```

**Purpose**: Extract logical thinking from agent into structured specification document.

### Phase 2: Modify Task Orchestrator
**File**: `plugins/ralph/src/task-orchestrator.ts`

**Changes**:
1. Add spec generation step before agent invocation
2. Inject spec validation into execution flow
3. Pass spec file path to agents

**Modified Flow**:
```typescript
// Current: invokeAgent(story) -> execute
// New: generateSpec(story) -> validateSpec() -> invokeAgent(story, spec) -> execute
```

**Key Methods**:
```typescript
private async invokeAgentWithSpec(story: UserStory): Promise<TaskResult> {
  // Step 1: Generate spec
  const spec = await this.specGenerator.generateSpec(story);
  await this.specGenerator.writeSpec(spec, '.smite/current_spec.md');

  // Step 2: Validate spec
  const validation = await this.specGenerator.validateSpec(spec);
  if (!validation.valid) {
    return { success: false, error: `Spec gaps: ${validation.gaps.join(', ')}` };
  }

  // Step 3: Execute with spec
  return this.invokeAgent(story, spec);
}
```

### Phase 3: Update Agent Prompts
**Files**: `plugins/*/commands/*.md`

**Add to each agent**:
1. Spec-first mode flag in prompt
2. Instructions to read spec before coding
3. Lock mechanism instructions

**Example for Builder**:
```markdown
## Spec-First Mode
When executing with a spec file:
1. Read `.smite/current_spec.md`
2. Follow steps EXACTLY as defined
3. Do NOT deviate without updating spec first
4. If logic gap detected: STOP, report gap, wait for spec update
```

### Phase 4: Create Spec-Lock Mechanism
**File**: `plugins/ralph/src/spec-lock.ts`

**Functions**:
```typescript
async checkLockCondition(): Promise<boolean>
async reportGap(gap: string): Promise<void>
async waitForSpecUpdate(): Promise<void>
```

**Purpose**: Enable agents to pause execution when logical gaps found, requiring spec update before continuing.

### Phase 5: Integrate with Ralph PRD
**File**: `plugins/ralph/src/prd-parser.ts`

**Add to UserStory interface**:
```typescript
interface UserStory {
  // ... existing fields
  specFirstMode?: boolean;
  specFilePath?: string;
}
```

### Phase 6: Create Standalone Spec Command
**File**: `plugins/smite/commands/spec.md`

**Purpose**: Allow users to trigger spec-first mode manually

```bash
/spec "Implement user authentication with JWT"
# -> Creates .smite/current_spec.md
# -> Waits for approval
# -> Executes implementation
```

## Technical Specifications

### File Structure
```
.smite/
  current_spec.md       # Active specification
  specs/                # Historical specs
    us-001-spec.md
    us-002-spec.md
  spec-lock.json        # Lock state (if agent waiting)
```

### Spec Template
```markdown
# Technical Specification: [Story ID]

## Objective
[Clear statement of what needs to be achieved]

## Approach
[Technical approach and architectural decisions]

## Implementation Steps

### Step 1: [Description]
- **Files**: [list]
- **Function Signatures**: [types/specs]
- **Dependencies**: [what this depends on]

### Step 2: [Description]
...

## Validation Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Known Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]
```

## Success Metrics
1. All agents support spec-first mode (autonomous)
2. Specs generated automatically before coding
3. Agent execution pauses on logic gaps
4. Specs validated for coherence before execution
5. Implementation matches spec 100%

## Implementation Order
1. Create `spec-generator.ts` module
2. Update `task-orchestrator.ts` to use spec generation
3. Add spec-first mode to agent command prompts
4. Implement spec-lock mechanism
5. Create standalone `/spec` command
6. Test with simple builder story
7. Test with complex multi-agent workflow
8. Validate typecheck and linting pass
