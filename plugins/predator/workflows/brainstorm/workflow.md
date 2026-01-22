# Brainstorm Workflow Tree

## Overview
Collaborative brainstorming workflow with exploration, challenging, and synthesis phases for idea generation and problem-solving.

## Workflow Structure

```
BRAINSTORM
│
├── 00_INIT
│   ├── Parse flags (auto, participants, depth)
│   ├── Create output folder
│   └── Initialize state variables
│
├── 01_ANALYZE
│   ├── Understand problem domain
│   ├── Gather context and constraints
│   ├── Identify stakeholders
│   └── Define success criteria
│
├── 02_PLAN
│   ├── Create exploration strategy
│   ├── Define challenge angles
│   ├── Set synthesis approach
│   └── Define deliverable format
│
├── 03_EXECUTE
│   ├── Explore ideas (multi-agent parallel)
│   ├── Challenge assumptions (adversarial)
│   ├── Synthesize findings
│   └── Rank solutions using TodoWrite
│
├── 04_VALIDATE
│   ├── Verify solutions meet criteria
│   ├── Check feasibility
│   ├── Assess risks
│   └── Self-check quality
│
├── 05_EXAMINE (if -examine flag)
│   └── Adversarial review of solutions (multi-agents)
│
├── 06_RESOLVE (if issues found)
│   └── Address concerns and refine solutions
│
└── 07_FINISH
    ├── Create PR with documentation (if -pr)
    └── OR Complete workflow with summary
```

## Flags

- `-auto` : Skip user approvals
- `-examine` : Enable adversarial review
- `-pr` : Create documentation PR
- `-participants=N` : Number of idea generators (default: 3)
- `-depth=level` : Depth of exploration (shallow/medium/deep, default: medium)

## Usage

```bash
/brainstorm "Problem or topic to explore"
/brainstorm -participants=5 "Generate many options"
/brainstorm -examine "Critical decision with review"
```
