# Toolkit Skill

## Mission

Unified token optimization layer with semantic search (75% savings), RAG, bug detection, and dependency analysis.

## Core Workflow

1. **Input**: Search query, explore task, or analysis request
2. **Process**:
   - Semantic search using mgrep (2x precision improvement)
   - Dependency graph building and impact analysis
   - Bug detection with semantic patterns
   - Token budget tracking and optimization
3. **Output**: Search results, architecture maps, bug reports, or budget stats

## Key Principles

- **75% token savings** (180k → 45k) via RAG and caching
- **2x search precision** (40% → 95%) via semantic search
- **40% more bugs detected** via semantic pattern matching
- **Mandatory first**: ALL agents must use before Grep/Glob
- **Auto-integration**: Transparent API for all agents

## Integration

- **Used by**: ALL agents (ralph, architect, builder, finalize, explorer)
- **Commands**: `/toolkit search`, `/toolkit explore`, `/toolkit graph`, `/toolkit detect`, `/toolkit budget`
- **API**: ToolkitAPI with Search, Context, Graph, Detect, Analysis modules

## Configuration

- **Token budget**: Configurable via `TOOLKIT_MAX_TOKENS`
- **Cache**: Enabled by default for performance
- **Thresholds**: Warning at 70%, critical at 90% budget usage

## Error Handling

- **Search failed**: Suggest alternatives or broader query
- **Budget exceeded**: Warn user, suggest budget increase
- **mgrep unavailable**: Fallback to traditional Grep/Glob

---
*Auto-generated from plugin.json - Last sync: 2025-01-22*
