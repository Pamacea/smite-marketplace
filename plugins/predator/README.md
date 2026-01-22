# Predator - Advanced Workflow System

Modular step-based workflow system for systematic development, debugging, and brainstorming.

## Overview

Predator provides three powerful workflows, each with 8 modular steps (00-07). By loading instructions only when needed, Predator keeps relevant context at the end for maximum adherence while optimizing token usage.

## Installation

```bash
# Install the plugin
/plugin install predator@smite

# The install hook automatically copies commands to ~/.claude/commands/
```

**Cross-platform:** Works on Windows, macOS, and Linux.

## Workflows

### 1. Predator - Feature Implementation

Systematic workflow for implementing features with quality gates.

```bash
/predator "Add user authentication"
/predator -auto "Implement payment system"
/predator -examine "Build admin dashboard"
/predator -auto -examine -pr "Complete feature with everything"
```

**Flags:**
- `-auto` / `-a` - Skip user approvals (yolo mode)
- `-examine` / `-x` - Enable adversarial code review
- `-pr` / `-p` - Create pull request at the end
- `-max_attempts=N` - Maximum attempts for loops

**Workflow Steps:**
```
00_INIT → 01_ANALYZE → 02_PLAN → 03_EXECUTE → 04_VALIDATE → 05_EXAMINE → 06_RESOLVE → 07_FINISH
```

### 2. Debug - Bug Resolution

Systematic debugging workflow for finding and fixing bugs.

```bash
/debug "TypeError: Cannot read property 'x' of undefined"
/debug -auto "Fix null pointer exception"
/debug -examine "Critical production bug"
/debug -max_attempts=3 "Fix with limited attempts"
```

**Flags:**
- `-auto` / `-a` - Skip user approvals
- `-examine` / `-x` - Enable adversarial fix review
- `-pr` / `-p` - Create pull request at the end
- `-max_attempts=N` - Max fix attempts

**Workflow Steps:**
```
00_INIT → 01_ANALYZE → 02_PLAN → 03_EXECUTE → 04_VALIDATE → 05_EXAMINE → 06_RESOLVE → 07_FINISH
```

### 3. Brainstorm - Idea Generation

Collaborative brainstorming for exploring problems and generating solutions.

```bash
/brainstorm "How to improve user onboarding"
/brainstorm -participants=5 "Generate many feature ideas"
/brainstorm -examine "Critical architectural decision"
/brainstorm -depth=deep "Thorough exploration"
```

**Flags:**
- `-auto` / `-a` - Skip user approvals
- `-examine` / `-x` - Enable adversarial solution review
- `-pr` / `-p` - Create documentation PR
- `-participants=N` - Number of idea generators (default: 3)
- `-depth=level` - shallow/medium/deep (default: medium)

**Workflow Steps:**
```
00_INIT → 01_ANALYZE → 02_PLAN → 03_EXECUTE → 04_VALIDATE → 05_EXAMINE → 06_RESOLVE → 07_FINISH
```

## Architecture

### Modular Workflow System

Each workflow consists of a main `workflow.md` file and a `steps/` folder with 8 step files:

```
workflows/
├── predator/
│   ├── workflow.md          # Workflow tree and usage
│   └── steps/
│       ├── 00_INIT.md       # Parse flags, create output folder
│       ├── 01_ANALYZE.md    # Gather context, explore codebase
│       ├── 02_PLAN.md       # Create strategy, define criteria
│       ├── 03_EXECUTE.md    # Implement using TodoWrite
│       ├── 04_VALIDATE.md   # Run quality checks
│       ├── 05_EXAMINE.md    # Adversarial review (conditional)
│       ├── 06_RESOLVE.md    # Fix issues (conditional)
│       └── 07_FINISH.md     # Create PR or complete
├── debug/
│   ├── workflow.md
│   └── steps/ (same structure)
└── brainstorm/
    ├── workflow.md
    └── steps/ (same structure)
```

### Key Principles

1. **Modular Steps**: Each step is a separate markdown file
2. **Load on Demand**: Instructions loaded only when needed
3. **Context Optimization**: Relevant instructions always at end
4. **Token Efficiency**: Only load what's necessary
5. **Consistent Structure**: All workflows follow same pattern

## Workflow Artifacts

Each workflow run creates a timestamped folder with all artifacts:

```
.predator/
├── runs/
│   └── 20250122_143000/
│       ├── state.json
│       ├── 01_ANALYZE.md
│       ├── 02_PLAN.md
│       ├── 03_EXECUTE.md
│       ├── 04_VALIDATE.md
│       ├── 05_EXAMINE.md (if -examine)
│       ├── 06_RESOLVE.md (if issues)
│       ├── 07_FINISH.md
│       └── SUMMARY.md
└── archive/
    └── past_runs/
```

## Command Selection Guide

| Situation | Use Command |
|-----------|-------------|
| Implement feature | `/predator` |
| Fix bug | `/debug` |
| Generate ideas | `/brainstorm` |
| Quick implementation | `/predator -auto` |
| Production code | `/predator -examine -pr` |
| Critical bug | `/debug -examine -pr` |
| Team brainstorming | `/brainstorm -participants=5 -examine` |

## Comparison with Other Workflows

```
┌─────────────┬──────────┬───────────┬──────────┬─────────────┐
│   Command   │  Speed   │  Quality  │  Scope   │ Token Usage │
├─────────────┼──────────┼───────────┼──────────┼─────────────┤
│ /predator   │ ⚡⚡      │ ⚡⚡⚡⚡    │ Large    │ Optimized   │
│ /debug      │ ⚡⚡      │ ⚡⚡⚡⚡    │ Bug fix  │ Optimized   │
│ /brainstorm│ ⚡⚡⚡     │ ⚡⚡⚡      │ Ideas    │ Medium      │
└─────────────┴──────────┴───────────┴──────────┴─────────────┘
```

## Examples

### Feature Implementation

```bash
# Basic implementation
/predator "Add user profile page with avatar upload"

# Automated with code review and PR
/predator -auto -examine -pr "Implement shopping cart with persistence"

# With retry limit
/predator -max_attempts=3 "Add search functionality"
```

### Bug Fixing

```bash
# Debug with stack trace
/debug "TypeError: product.price is not a function"

# Automated fix with verification
/debug -auto "Fix memory leak in useEffect"

# Critical bug with full review
/debug -examine -pr "Production database connection error"
```

### Brainstorming

```bash
# Quick idea generation
/brainstorm "Ways to improve app performance"

# Deep dive with many participants
/brainstorm -participants=5 -depth=deep "Architecture for multi-tenant system"

# With full review and documentation
/brainstorm -examine -pr "Feature prioritization for Q2"
```

## Advanced Usage

### Customizing Workflows

Each workflow can be customized by editing the step files:

```bash
# Edit predator workflow
vi plugins/predator/workflows/predator/steps/03_EXECUTE.md

# Edit debug workflow
vi plugins/predator/workflows/debug/steps/02_PLAN.md

# Edit brainstorm workflow
vi plugins/predator/workflows/brainstorm/steps/01_ANALYZE.md
```

### Adding New Steps

To add a new step to any workflow:

1. Create new step file: `steps/08_NEWSTEP.md`
2. Update `workflow.md` to include the new step
3. Update command file to reference the new step

### Creating Custom Workflows

Use the existing workflows as templates:

1. Copy a workflow folder: `cp -r workflows/predator workflows/custom`
2. Edit `workflow.md` with your custom workflow tree
3. Modify step files as needed
4. Create command file referencing your workflow
5. Update `plugin.json` to register the new command

## Integration with SMITE

Predator works seamlessly with SMITE agents:

- Use `/predator` with `/builder` for systematic implementation
- Use `/debug` when `/simplifier` finds issues
- Use `/brainstorm` with `/architect` for design exploration
- Use any workflow before `/finalize` for quality assurance

## Troubleshooting

### Workflow Not Loading

Ensure workflow files exist:
```bash
ls -la plugins/predator/workflows/predator/steps/
```

### Commands Not Available

Check commands are installed:
```bash
ls -la ~/.claude/commands/predator.md
```

Reinstall if needed:
```bash
/plugin install predator@smite
```

### Artifacts Not Saving

Check `.predator/` directory permissions:
```bash
mkdir -p .predator/runs
chmod 755 .predator
```

## Contributing

Found a bug or have a workflow suggestion? Open an issue at:
https://github.com/Pamacea/smite/issues

## License

MIT License - see SMITE repository for details.

## Credits

Created by **Pamacea** for SMITE v3.1.0

Inspired by the modular workflow concept from Melvynx's Apex workflow.

---

**Version**: 3.1.0
**Last Updated**: 2025-01-22
**SMITE Version**: 3.1.0
