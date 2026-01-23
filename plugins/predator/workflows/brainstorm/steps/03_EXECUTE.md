# 03_EXECUTE - Idea Generation and Challenge

## Instructions

### 1. Initialize TodoWrite

```markdown
## Brainstorming Tasks

### Phase 1: Explore (Parallel Idea Generation)
- [ ] Launch ${participants} idea generators
- [ ] Collect all generated ideas
- [ ] Document initial idea pool

### Phase 2: Challenge (Adversarial Review)
- [ ] Challenge each idea systematically
- [ ] Document concerns and improvements
- [ ] Filter weak ideas

### Phase 3: Synthesize (Combine and Rank)
- [ ] Combine related ideas
- [ ] Evaluate against criteria
- [ ] Rank top solutions
```

### 2. Explore - Launch Idea Generators

Launch ${participants} parallel agents with different roles:

```markdown
## Phase 1: EXPLORE - Idea Generation

### Launching ${participants} Idea Generators...

**Generator 1: Divergent Thinker** 🎨
<Launch with instructions>
Generating creative, unconventional ideas...

**Generator 2: Pragmatist** 🔧
<Launch with instructions>
Generating practical, feasible ideas...

**Generator 3: Innovator** 🚀
<Launch with instructions>
Generating novel, forward-thinking ideas...

${if participants > 3}
**Generator 4: User Advocate** 👥
<Launch with instructions>
Generating user-centered ideas...

**Generator 5: Systems Thinker** 🌐
<Launch with instructions>
Generating holistic, systemic ideas...
```

### 3. Collect Ideas

Gather all ideas from generators:

```markdown
## Idea Pool (${total_ideas} ideas)

### From Divergent Thinker (${N} ideas)
1. ${idea1}
2. ${idea2}
3. ${idea3}

### From Pragmatist (${N} ideas)
1. ${idea1}
2. ${idea2}
3. ${idea3}

### From Innovator (${N} ideas)
1. ${idea1}
2. ${idea2}
3. ${idea3}

${if participants > 3}
### From User Advocate (${N} ideas)
1. ${idea1}
2. ${idea2}
3. ${idea3}

### From Systems Thinker (${N} ideas)
1. ${idea1}
2. ${idea2}
3. ${idea3}
```

### 4. Challenge - Adversarial Review

For each idea, launch challenge agents:

```markdown
## Phase 2: CHALLENGE - Adversarial Review

### Challenging Idea: "${idea}"

**Feasibility Challenge** 🔍
<Launch challenger>
Concerns: ${concerns}
Suggestions: ${suggestions}

**Practicality Challenge** 🔧
<Launch challenger>
Concerns: ${concerns}
Suggestions: ${suggestions}

**Value Challenge** 💰
<Launch challenger>
Concerns: ${concerns}
Suggestions: ${suggestions}

### Challenge Summary for this Idea
- Survives challenges: YES/NO
- Major concerns: ${N}
- Improvement suggestions: ${N}
- Verdict: KEEP/DISCARD/IMPROVE
```

### 5. Synthesize - Combine and Rank

```markdown
## Phase 3: SYNTHESIZE - Combine and Rank

### Combining Related Ideas
${group_related_ideas_together}

### Evaluation Results

| Idea | Innovation | Feasibility | Impact | Cost | Risk | Total |
|------|------------|-------------|--------|------|------|-------|
| ${idea1} | 8/10 | 7/10 | 9/10 | 6/10 | 4/10 | 34/50 |
| ${idea2} | 6/10 | 9/10 | 7/10 | 8/10 | 3/10 | 33/50 |
| ${idea3} | 9/10 | 5/10 | 8/10 | 5/10 | 7/10 | 34/50 |

### Top Solutions (Top 3-5)

**🥇 #1: ${title}**
- Description: ${description}
- Score: ${total_score}
- Strengths: ${strengths}
- Weaknesses: ${weaknesses}
- Implementation: ${brief_implementation_note}

**🥈 #2: ${title}**
...

**🥉 #3: ${title}**
...
```

### 6. Update TodoWrite

Mark progress through phases

### 7. Save Execution Log

Save to `.claude/.smite/.predator/brainstorm/runs/${ts}/03_EXECUTE.md`

### Output

```
💡 EXECUTE COMPLETE

Phase 1 - Explore:
- Ideas generated: ${total_ideas}
- From ${participants} participants

Phase 2 - Challenge:
- Ideas challenged: ${challenged_ideas}
- Ideas discarded: ${discarded_ideas}
- Ideas improved: ${improved_ideas}

Phase 3 - Synthesize:
- Top solutions identified: ${N}

Execution saved to: .claude/.smite/.predator/brainstorm/runs/${ts}/03_EXECUTE.md

Next: 04_VALIDATE (verify solutions)
```
