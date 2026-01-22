# 07_FINISH - Brainstorm Completion

## Instructions

### 1. Generate Final Summary

Compile all brainstorm data:

```markdown
# Brainstorm Session Summary

## Topic
${topic}

## Execution Time
Start: ${start_time}
End: ${end_time}
Duration: ${duration}

## Workflow Steps
✅ 00_INIT - Session initialized
✅ 01_ANALYZE - Problem understood
✅ 02_PLAN - Strategy created
✅ 03_EXECUTE - Ideas generated and challenged
✅ 04_VALIDATE - Solutions verified
${if examine}✅ 05_EXAMINE - Review completed
${if resolve}✅ 06_RESOLVE - Refinements applied
✅ 07_FINISH - Session complete

## Results Summary

### Idea Generation
- Participants: ${participants}
- Ideas generated: ${total_ideas}
- Ideas after challenge: ${surviving_ideas}
- Ideas synthesized: ${final_solutions}

### Top Solutions

**🥇 #1: ${title}**
- Score: ${score}/${max_score}
- Feasibility: ${feasibility}
- Risk: ${risk_level}
- Description: ${description}
- Implementation notes: ${notes}

**🥈 #2: ${title}**
...

**🥉 #3: ${title}**
...

## Recommendations

### Recommended Solution(s)
${primary_recommendation}

### Alternative(s) to Consider
${alternative_recommendations}

### Not Recommended
${what_to_avoid_and_why}

## Next Steps
${actionable_next_steps}

## Artifacts
- Analysis: .predator/brainstorm/runs/${ts}/01_ANALYZE.md
- Plan: .predator/brainstorm/runs/${ts}/02_PLAN.md
- Execution: .predator/brainstorm/runs/${ts}/03_EXECUTE.md
- Validation: .predator/brainstorm/runs/${ts}/04_VALIDATE.md
${if examine}- Review: .predator/brainstorm/runs/${ts}/05_EXAMINE.md
${if resolve}- Refinement: .predator/brainstorm/runs/${ts}/06_RESOLVE.md

## Final Status
✅ BRAINSTORM COMPLETE
```

### 2. Check -pr Flag

#### If -pr flag is set:

Create documentation PR:

```bash
# Create documentation directory if needed
mkdir -p docs/brainstorm

# Save final summary
cp .predator/brainstorm/runs/${ts}/SUMMARY.md docs/brainstorm/${topic_slug}.md

# Commit and create PR
git add docs/brainstorm/
git commit -m "docs: brainstorm results for '${topic}'

- Generated ${total_ideas} ideas
- Identified ${N} top solutions
- Recommended: ${top_solution}
- Session duration: ${duration}

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

gh pr create \
  --title "docs: Brainstorm results - ${topic}" \
  --body "## Brainstorm Session Results

Topic: ${topic}

### Outcomes
- Ideas generated: ${total_ideas}
- Top solutions: ${N}
- Recommended: ${top_solution}

### Documentation
See docs/brainstorm/${topic_slug}.md for complete results.

🤖 Generated with [Claude Code](https://claude.com/claude-code) using Brainstorm workflow"
```

#### If -pr flag is NOT set:

Save summary locally:

```bash
# Copy summary to accessible location
mkdir -p docs/brainstorm
cp .predator/brainstorm/runs/${ts}/SUMMARY.md docs/brainstorm/${topic_slug}_$(date +%Y%m%d).md

# Commit if there are changes
git add docs/brainstorm/
git commit -m "docs: save brainstorm results for '${topic}'
"
```

### 3. Save Final Report

Save to `.predator/brainstorm/runs/${ts}/07_FINISH.md` and `.predator/brainstorm/runs/${ts}/SUMMARY.md`

### 4. Archive (Optional)

```bash
# Move to archive
mv .predator/brainstorm/runs/${ts} .predator/brainstorm/archive/
```

### Output

```
╔════════════════════════════════════════╗
║        BRAINSTORM COMPLETE              ║
╠════════════════════════════════════════╣
║                                         ║
║ 💡 Topic: ${topic}                      ║
║ ⏱️  Duration: ${duration}               ║
║ 💭 Ideas: ${total_ideas} generated       ║
║ 🏆 Solutions: ${N} identified            ║
║                                         ║
║ Top Solution:                           ║
║ ${top_solution_title}                   ║
║ Score: ${score}/${max_score}            ║
║                                         ║
${if pr}║ 📝 Docs created: ${docs_path}       ║
${else}║ 📁 Summary saved locally             ║
║                                         ║
║ 📁 Artifacts:                           ║
║    .predator/brainstorm/runs/${ts}/    ║
║                                         ║
╚════════════════════════════════════════╝

Brainstorm complete! 🎉
```
