# 02_PLAN - Strategy Creation

## Instructions

### 1. Create Exploration Strategy

Define how ideas will be generated:

```markdown
## Exploration Strategy

### Idea Generation Approach
${approach_description}

### Participant Roles (${participants} agents)

**Participant 1: Divergent Thinker**
<instructions>
Generate wild, creative ideas without constraints. Think outside the box. Consider unconventional approaches.
</instructions>

**Participant 2: Pragmatist**
<instructions>
Generate practical, realistic ideas. Focus on feasibility and implementation. Consider existing resources.
</instructions>

**Participant 3: Innovator**
<instructions>
Generate novel ideas using emerging trends and technologies. Consider what's possible but not yet common.
</instructions>

${if participants > 3}
**Participant 4: User Advocate**
<instructions>
Generate ideas from user perspective. Focus on UX, accessibility, and user needs.
</instructions>

**Participant 5: Systems Thinker**
<instructions>
Generate holistic ideas considering the entire system. Think long-term and scalability.
</instructions>
```

### 2. Define Challenge Angles

Prepare adversarial challenges:

```markdown
## Challenge Angles

### Feasibility Challenges
- Question technical feasibility
- Question resource availability
- Question timeline realism

### Practicality Challenges
- Question usability
- Question maintainability
- Question operational impact

### Value Challenges
- Question ROI
- Question necessity
- Question prioritization

### Risk Challenges
- Question security implications
- Question performance impact
- Question failure scenarios
```

### 3. Set Synthesis Approach

Define how ideas will be combined:

```markdown
## Synthesis Strategy

### Idea Evaluation Criteria
- Innovation: ${how_to_measure}
- Feasibility: ${how_to_measure}
- Impact: ${how_to_measure}
- Cost: ${how_to_measure}
- Risk: ${how_to_measure}

### Synthesis Method
${how_to_combine_and_rank_ideas}

### Selection Process
${how_to_narrow_down_to_best_solutions}

### Deliverable Format
${what_final_output_will_look_like}
```

### 4. Define Deliverable Format

```markdown
## Deliverable Format

### Format
${markdown_document/presentation/proposal/etc}

### Structure
1. Executive Summary
2. Problem Statement
3. Generated Ideas (${N})
4. Evaluation Results
5. Top Recommendations (top 3-5)
6. Implementation Notes
7. Risk Assessment
8. Next Steps
```

### 5. User Approval (unless -auto)

```
📋 BRAINSTORM STRATEGY READY

Participants: ${participants}
Depth: ${depth}
Deliverable: ${format}

Approach:
${strategy_summary}

Ready to brainstorm? (y/n)
```

### 6. Save Plan

Save to `.predator/brainstorm/runs/${ts}/02_PLAN.md`

### Output

```
📋 PLAN COMPLETE
Participants: ${participants}
Challenge Angles: ${N} defined
Synthesis Strategy: ${approach}
Deliverable: ${format}

Plan saved to: .predator/brainstorm/runs/${ts}/02_PLAN.md

Next: 03_EXECUTE (generate and challenge ideas)
```
