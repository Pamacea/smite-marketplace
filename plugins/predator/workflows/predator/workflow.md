# Predator Workflow Tree

## Overview
Systematic implementation workflow with modular step execution for feature development.

## Workflow Structure

```
PREDATOR
│
├── 00_INIT
│   ├── Parse flags (auto, examine, pr, etc.)
│   ├── Create output folder
│   └── Initialize state variables
│
├── 01_ANALYZE
│   ├── Gather context
│   ├── Explore codebase
│   └── Understand existing patterns
│
├── 02_PLAN
│   ├── Create file-by-file strategy
│   └── Define acceptance criteria
│
├── 03_EXECUTE
│   ├── Implement changes using TodoWrite
│   └── Follow plan step by step
│
├── 04_VALIDATE
│   ├── Run lint
│   ├── Run typecheck
│   ├── Run build
│   └── Self-check implementation
│
├── 05_EXAMINE (if -examine flag)
│   └── Adversarial code review (multi-agents)
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
- `-examine` : Enable adversarial code review
- `-pr` : Create pull request at the end
- `-max_attempts=N` : Max attempts for test/fix loops

## Usage

```bash
/predator "Implement feature description"
/predator -auto "Quick implementation"
/predator -examine -pr "Production feature with review"
```
