# 🛠️ Toolkit Plugin Documentation

Code analysis and optimization toolkit with semantic search.

## Commands

- **[/toolkit search](../../../plugins/toolkit/commands/search.md)** - Semantic code search
- **[/toolkit explore](../../../plugins/toolkit/commands/explore.md)** - Intelligent codebase exploration
- **[/toolkit graph](../../../plugins/toolkit/commands/graph.md)** - Dependency analysis
- **[/toolkit detect](../../../plugins/toolkit/commands/detect.md)** - Bug detection
- **[/toolkit surgeon](../../../plugins/toolkit/commands/surgeon.md)** - Code refactoring
- **[/toolkit budget](../../../plugins/toolkit/commands/budget.md)** - Token budget check

## Skills

- **[Toolkit Skill](../../../plugins/toolkit/skills/toolkit/SKILL.md)** - Complete skill reference

## Overview

Toolkit provides powerful tools:
- **Semantic Search**: 60-87% token savings with RAG
- **Code Analysis**: AST-based extraction and pattern detection
- **Bug Detection**: 40% more bugs found
- **Dependency Graph**: Automated mapping
- **Token Optimization**: RAG and caching

## Quick Start

```bash
/toolkit search "authentication flow"
/toolkit explore --task=find-function --target="authenticateUser"
/toolkit graph --target=src/auth/jwt.ts --impact
/toolkit detect --scope=src/auth --patterns="security"
/toolkit budget
```

See the [main README](../../../plugins/toolkit/README.md) for complete documentation.
