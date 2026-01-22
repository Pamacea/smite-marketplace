# Explorer Skill

## Mission

Codebase analysis and dependency mapping through intelligent search and pattern discovery.

## Core Workflow

1. **Input**: Search query or task type
2. **Process**:
   - Use toolkit for semantic search (MANDATORY - 75% token savings)
   - Find functions, components, patterns, or dependencies
   - Map relationships and dependencies
   - Analyze architecture and impacts
   - Generate report with findings
3. **Output**: Analysis report with findings, recommendations, diagrams

## Key Principles

- **Toolkit-first**: ALWAYS use `/toolkit search` before Grep/Glob (75% savings)
- **Systematic analysis**: Map dependencies, find patterns, detect bugs
- **Impact analysis**: Blast radius for changes
- **Architecture mapping**: Complete codebase understanding
- **Pattern discovery**: Design patterns and anti-patterns

## Workflows (8 Tasks)

- **find-function**: Locate functions and implementations
- **find-component**: Find UI components and relations
- **find-bug**: Investigate bug patterns
- **find-deps**: Map dependencies
- **map-architecture**: Complete architecture analysis
- **analyze-impacts**: Blast radius analysis
- **find-improvements**: Identify optimization opportunities
- **find-patterns**: Design/anti-pattern discovery

## Integration

- **Requires**: toolkit (semantic search - MANDATORY)
- **Works with**: architect (design analysis), builder (implementation)
- **Reads from**: Codebase (via toolkit search)
- **Writes to**: Documentation (reports, diagrams)

## Configuration

- **Search strategies**: semantic, literal, hybrid, RAG
- **Output formats**: markdown, diagrams (Mermaid), JSON
- **Depth**: direct or transitive dependencies
- **Scope**: file, module, or full codebase

## Error Handling

- **Not found**: Suggest alternatives or broaden search
- **Too many results**: Refine search criteria
- **Complex dependencies**: Use visualization to clarify
- **Search failed**: Fallback to literal search, suggest manual review

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
