# Debug Workflow Tree

## Overview
Systematic debugging workflow with modular step execution for bug resolution.

## Workflow Structure

```
DEBUG
│
├── 00_INIT
│   ├── Parse flags (auto, max_attempts)
│   ├── Create output folder
│   └── Initialize state variables
│
├── 01_ANALYZE
│   ├── Gather error context
│   ├── Examine stack traces
│   ├── Understand expected vs actual behavior
│   └── Identify error patterns
│
├── 02_PLAN
│   ├── Create hypothesis list
│   ├── Define investigation strategy
│   └── Set acceptance criteria (bug fixed)
│
├── 03_EXECUTE
│   ├── Implement fixes using TodoWrite
│   ├── Test each hypothesis
│   └── Follow investigation plan
│
├── 04_VALIDATE
│   ├── Verify bug is resolved
│   ├── Run regression tests
│   ├── Check for side effects
│   └── Self-check fix
│
├── 05_EXAMINE (if -examine flag)
│   └── Adversarial review of fix (multi-agents)
│
├── 06_RESOLVE (if issues found)
│   └── Fix all review findings
│
└── 07_FINISH
    ├── Create PR with gh CLI (if -pr)
    └── OR Complete workflow
```

## Flags

- `-auto` : Skip user approvals
- `-examine` : Enable adversarial review of fix
- `-pr` : Create pull request at the end
- `-max_attempts=N` : Max attempts for fix loops

## Usage

```bash
/debug "Error description or stack trace"
/debug -auto "Quick bug fix"
/debug -examine -pr "Critical bug with review"
```
