# 01_ANALYZE - Problem Understanding

## Instructions

### 1. Understand Problem Domain

Analyze the topic/problem:

```markdown
## Problem Domain Analysis

### Topic
${topic}

### Context
<What is the context? What triggered this brainstorm?>

### Domain
<What domain does this belong to? (tech, business, design, etc.)>

### Related Areas
<What other areas are related?>
```

### 2. Gather Context and Constraints

```markdown
## Context and Constraints

### Goals
- ${goal1}
- ${goal2}
- ${goal3}

### Constraints
- ${constraint1} (budget, time, technical, etc.)
- ${constraint2}
- ${constraint3}

### Requirements
- ${requirement1} (must-have)
- ${requirement2} (must-have)
- ${requirement3} (nice-to-have)

### Success Criteria
${what defines a successful solution}
```

### 3. Identify Stakeholders

```markdown
## Stakeholders

### Primary Stakeholders
- ${stakeholder1} - ${role_and_interest}
- ${stakeholder2} - ${role_and_interest}

### Secondary Stakeholders
- ${stakeholder1} - ${role_and_interest}
- ${stakeholder2} - ${role_and_interest}

### Decision Makers
${who will make the final decision}
```

### 4. Define Success Criteria

```markdown
## Success Criteria

### Must Have
- [ ] ${criteria1}
- [ ] ${criteria2}
- [ ] ${criteria3}

### Should Have
- [ ] ${criteria1}
- [ ] ${criteria2}

### Could Have
- [ ] ${criteria1}
- [ ] ${criteria2}
```

### 5. Research Context (if depth != shallow)

Gather relevant information:

```markdown
## Research Findings

### Existing Solutions
- ${solution1} - ${pros/cons}
- ${solution2} - ${pros/cons}
- ${solution3} - ${pros/cons}

### Best Practices
${industry_best_practices}

### Lessons Learned
${what_to_avoid_based_on_past_experience}

### Market Standards
${what_competitors_or_standards_exist}
```

### 6. Use Available MCP Tools

Leverage these MCP tools for enhanced problem research:

#### **zai-mcp-server** - Visual Analysis
- `analyze_image` - Analyze diagrams, charts, visual references
- `understand_technical_diagram` - Understand architecture diagrams
- `analyze_data_visualization` - Extract insights from competitive analysis charts
- `ui_diff_check` - Compare different design approaches

**When to use**: Visual research, competitive analysis, diagram understanding

#### **vision-mcp (4.5v)** - Advanced Image Analysis
- `mcp__4_5v_mcp__analyze_image` - Deep analysis of complex visual materials

**When to use**: Detailed analysis of screenshots, designs, or visual references

#### **zai-web-search-prime** - Market Research
- `mcp__web-search-prime__webSearchPrime` - Search for industry trends, solutions, best practices

**When to use**:
- Finding existing solutions in the market
- Researching industry best practices
- Finding case studies and examples
- Checking competitor approaches
- Finding latest trends and innovations

#### **chrome-dev-tools** - Competitive Analysis
- Analyze competitor implementations
- Inspect how others solve similar problems
- Study UX patterns in live applications

**When to use**: Competitive research, UX pattern analysis

### 7. Document Analysis

```markdown
# Analysis Report

## Problem Statement
${clear_problem_statement}

## Context Summary
${context_summary}

## Key Insights
${key_insights_discovered}

## Constraints Summary
${must_work_within_these_constraints}

## Success Definition
${what_success_looks_like}
```

### 8. Save Analysis

Save to `.predator/brainstorm/runs/${ts}/01_ANALYZE.md`

### Output

```
🔍 ANALYZE COMPLETE
Problem: ${problem_statement}
Constraints: ${N} identified
Stakeholders: ${S} identified
Success Criteria: ${C} defined

Analysis saved to: .predator/brainstorm/runs/${ts}/01_ANALYZE.md

Next: 02_PLAN (create exploration strategy)
```
