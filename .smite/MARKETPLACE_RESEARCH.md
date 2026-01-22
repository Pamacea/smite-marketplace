# 🔍 Marketplace Research - Anthropic & Best Practices

## 📊 Executive Summary

Recherche des marketplaces AI (Anthropic Claude Code, z.ai) et des best practices 2025 pour structurer notre marketplace CloudCode.

---

## 🎯 Key Findings

### 1. **Anthropic Claude Code Marketplace**

**Documentation officielle**: [Create and distribute a plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces)

**Structure du marketplace.json**:
```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "marketplace-name",
  "version": "1.0.0",
  "description": "Brief description",
  "owner": {
    "name": "Team Name",
    "email": "[email protected]"
  },
  "metadata": {
    "description": "Full description",
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "Plugin description",
      "version": "1.0.0",
      "author": { "name": "Author" },
      "category": "development|quality|productivity",
      "tags": ["tag1", "tag2"],
      "commands": "./commands/",
      "skills": "./skills/",
      "agents": "./agents/",
      "hooks": {},
      "strict": false
    }
  ]
}
```

**Points clés**:
- ✅ **Schéma JSON officiel** avec `$schema`
- ✅ **Catégories standardisées**: `development`, `quality`, `productivity`
- ✅ **Tags** pour la découvrabilité
- ✅ **`strict: false`** permet de définir tout dans marketplace.json
- ✅ **Support multi-sources**: GitHub, Git URLs, local paths
- ✅ **Validation officielle**: `/plugin validate` ou `claude plugin validate`

### 2. **Plugin.json Standard**

**Format minimal**:
```json
{
  "name": "plugin-name",
  "description": "One-line description",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "[email protected]"
  },
  "commands": "./commands/",
  "skills": "./skills/",
  "hooks": {},
  "agents": "./agents/"
}
```

**Champs optionnels**:
- `homepage`: URL de documentation
- `repository`: URL du repo source
- `license`: SPDX (MIT, Apache-2.0)
- `keywords`: Tags pour découverte

### 3. **Z.ai Marketplace**

**Découvertes**:
- Utilise le **Model Context Protocol (MCP)** pour certaines intégrations
- Focus sur **GLM models** (4.6, 4.7)
- APIs HTTP RESTful
- Documentation moins structurée qu'Anthropic
- **Pas de marketplace standardisé** comme Claude Code

**Conclusion**: Z.ai n'est pas une référence directe pour notre structure.

---

## 🏗️ Best Practices 2025 (AI Agent Marketplace)

### **Architecture Principles**

D'après [AI Agent Marketplace Best Practices](https://www.aalpha.net/blog/ai-agent-marketplace-development/):

1. **Modularité**: Plugin = 1 responsabilité unique
2. **Centralised Registry**: Manifest comme source de vérité
3. **Contract-Based Interfaces**: Schemas bien définis
4. **Isolation**: Exécution sandboxée
5. **Extensibility Points**: Points d'extension stratégiques

### **Documentation Patterns**

D'après [Top AI Agent Frameworks 2025](https://medium.com/@elisowski/top-ai-agent-frameworks-in-2025-9bcedab2e239):

**README optimal**:
- **100-150 lignes** maximum
- Structure: What → Why → How → Quick Start → Config
- Focus sur l'utilisateur (pas sur l'implémentation)

**SKILL.md optimal**:
- **50-100 lignes** maximum
- Mission → Workflow → Principles → Integration
- Focus sur l'IA (pas l'utilisateur)

### **Plugin Architecture Best Practices**

D'après [Plugin Architecture in Node.js](https://medium.com/@Modexa/plugin-architecture-in-nodejs-without-regrets-e02ba78660c7):

1. **Single Responsibility**: 1 plugin = 1 fonctionnalité
2. **Loose Coupling**: Dépendances minimales
3. **Version Management**: Semantic Versioning
4. **Dynamic Loading**: Chargement à la demande
5. **Clear Extension Points**: Interfaces bien définies

---

## 📋 Current Structure Analysis

### ✅ **What We Do Well**

1. **marketplace.json complet** avec tous les plugins
2. **Plugin.json pour chaque plugin**
3. **Catégories** utilisées (development, quality, productivity)
4. **Descriptions claires**
5. **Hooks structurés**

### ❌ **Critical Issues**

1. **Versions incohérentes**:
   - `ralph`: 3.0.0
   - `toolkit`: 1.0.0
   - `architect`: 3.0.0
   - Devrait être uniformisé

2. **Documentation trop longue**:
   - README: 300+ lignes (objectif: 150)
   - SKILL.md: 200+ lignes (objectif: 100)
   - Duplication README ↔ SKILL

3. **Paths hardcodés Windows**:
   ```json
   "command": "cmd /c \"node %USERPROFILE%\\.claude\\plugins\\...\""
   ```
   Devrait être cross-platform

4. **Pas de `$schema`** dans marketplace.json
   - Ajouter: `"$schema": "https://anthropic.com/claude-code/marketplace.schema.json"`

5. **Pas de validation formelle**
   - Devrait utiliser `/plugin validate`

6. **Catégories inconsistantes**:
   - `explorer`: development (devrait être analysis?)
   - `quality-gate`: productivity (devrait être quality)

7. **Pas de tags** pour la découvrabilité

---

## 🎯 Proposed Structure

### **1. Standardize marketplace.json**

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "smite",
  "version": "3.1.0",
  "description": "Zero-debt engineering agents with multi-agent parallel orchestration",
  "owner": {
    "name": "Pamacea",
    "email": "[email protected]"
  },
  "metadata": {
    "description": "Complete SMITE development workflow with 13 plugins for orchestration, analysis, quality, and productivity",
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "ralph",
      "source": "./plugins/ralph",
      "description": "Multi-agent orchestrator with parallel execution (2-3x speedup)",
      "version": "3.1.0",
      "author": { "name": "Pamacea" },
      "category": "orchestration",
      "tags": ["orchestration", "parallel", "workflow", "prd"],
      "homepage": "https://github.com/Pamacea/smite/tree/main/plugins/ralph"
    },
    // ... other plugins with consistent versioning
  ]
}
```

### **2. Standardize plugin.json**

```json
{
  "$schema": "https://anthropic.com/claude-code/plugin.schema.json",
  "name": "ralph",
  "description": "Multi-agent orchestrator with parallel execution (2-3x speedup)",
  "version": "3.1.0",
  "author": {
    "name": "Pamacea",
    "email": "[email protected]"
  },
  "homepage": "https://github.com/Pamacea/smite/tree/main/plugins/ralph",
  "repository": "https://github.com/Pamacea/smite",
  "license": "MIT",
  "keywords": ["orchestration", "parallel", "workflow", "prd"],
  "category": "orchestration",
  "commands": "./commands/",
  "skills": "./skills/",
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/stop-hook.js"
      }]
    }]
  }
}
```

### **3. Template: README.md (150 lines max)**

```markdown
# [Plugin Name]

> One-line description

## 🎯 Purpose
What it does in 2 sentences. Who it's for.

## 🚀 Quick Start
\`\`\`bash
/command-name
\`\`\`

## 📖 Usage
### Basic
Simple example

### Advanced
Advanced options

## 🔧 Configuration
### Required
- config1: description

### Optional
- config2: description

## 🔗 Integration
- **Requires**: [plugin1, plugin2]
- **Used by**: [plugin3, plugin4]
- **Compatible with**: [tool1, tool2]

## 📚 Documentation
- [Full Guide](../../docs/plugins/PLUGIN.md)
- [API Reference](../../docs/plugins/PLUGIN_API.md)

---
**Version**: x.y.z | **Category**: category | **Author**: Pamacea
```

### **4. Template: SKILL.md (100 lines max)**

```markdown
# [Skill Name]

## Mission
Single sentence purpose

## Core Workflow
1. **Input**: [what to expect]
2. **Process**: [step-by-step]
3. **Output**: [what is produced]

## Key Principles
- **Principle 1**: description
- **Principle 2**: description

## Integration
- **Requires**: [tool/plugin]
- **Reads from**: [file/path]
- **Writes to**: [file/path]

## Configuration
- **Config file**: [path]
- **Environment variables**: [list]

---
*Auto-generated from plugin.json - Last sync: YYYY-MM-DD*
```

### **5. Template: CLAUDE.md (50 lines max)**

```markdown
# 🚀 SMITE - Quick Reference

## 🎯 I'm here to...
- **Build features**: `/build` or `/ralph`
- **Fix bugs**: `/debug`
- **Explore code**: `/explore` or `/toolkit search`
- **Quality check**: `/finalize`

## 🔍 Mandatory Workflow
1. **ALWAYS** use `/toolkit search` before code exploration (75% token savings)
2. **NEVER** use Grep/Glob first (wastes tokens)
3. **Spec-first**: Architect → Builder → Finalize

## 📚 Documentation
- **All docs**: [docs/INDEX.md](../../docs/INDEX.md)
- **Plugins**: [plugins/README.md](../../plugins/README.md)

## 🛠️ Quick Commands
| Command | Purpose |
|---------|---------|
| `/ralph "prompt"` | Multi-agent orchestration |
| `/build --feature=name` | Implement feature |
| `/debug` | Fix bugs systematically |
| `/finalize` | QA + documentation |

---
**Version**: 3.1.0 | **Docs**: [docs/INDEX.md](../../docs/INDEX.md)
```

---

## 📝 Refactor Checklist

### Phase 1: Standards & Templates
- [ ] Create README template (150 lines)
- [ ] Create SKILL template (100 lines)
- [ ] Create CLAUDE.md template (50 lines)
- [ ] Create plugin.json template
- [ ] Create marketplace.json template

### Phase 2: Root Documentation
- [ ] Refactor CLAUDE.md (apply template)
- [ ] Refactor README.md (apply template)
- [ ] Update marketplace.json (add schema, normalize versions)
- [ ] Create RALPH_GUIDE.md
- [ ] Create SPEC_FIRST.md

### Phase 3: Plugin Documentation (Core)
- [ ] Refactor ralph/README.md
- [ ] Refactor ralph/skills/ralph/SKILL.md
- [ ] Refactor architect/README.md (CREATE)
- [ ] Refactor architect/skills/architect/SKILL.md
- [ ] Refactor builder/README.md (CREATE)
- [ ] Refactor builder/skills/builder/SKILL.md
- [ ] Refactor finalize/README.md (CREATE)
- [ ] Refactor finalize/skills/finalize/SKILL.md

### Phase 4: Plugin Documentation (Analysis)
- [ ] Refactor explorer/README.md (CREATE)
- [ ] Refactor explorer/skills/explorer/SKILL.md
- [ ] Refactor toolkit/README.md
- [ ] Refactor toolkit/skills/toolkit/*SKILL.md

### Phase 5: Plugin Documentation (Quality)
- [ ] Refactor quality-gate/README.md
- [ ] Refactor quality-gate/skills/quality-gate/SKILL.md
- [ ] Refactor simplifier/README.md
- [ ] Refactor simplifier/skills/simplifier/SKILL.md

### Phase 6: Plugin Documentation (Utilities)
- [ ] Refactor smite/README.md
- [ ] Refactor statusline/README.md
- [ ] Refactor obsidian-note-agent/README.md
- [ ] Refactor docs-editor-mcp/README.md
- [ ] Refactor shell-aliases/README.md
- [ ] Refactor auto-rename-session/README.md

### Phase 7: Plugin Manifests
- [ ] Standardize all plugin.json (add schema, normalize)
- [ ] Fix hardcoded Windows paths (use ${CLAUDE_PLUGIN_ROOT})
- [ ] Add homepage/repository/license fields
- [ ] Add keywords tags
- [ ] Normalize categories

### Phase 8: Validation
- [ ] Run `/plugin validate` on all plugins
- [ ] Fix validation errors
- [ ] Test marketplace installation
- [ ] Test all commands

---

## 🎯 Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| **Avg README lines** | 300+ | ~150 | **-50%** |
| **Avg SKILL lines** | 200+ | ~100 | **-50%** |
| **plugin.json schemas** | 0 | 13 | **100%** |
| **Version consistency** | Mixed | Uniform | **100%** |
| **Cross-platform paths** | 0 | 13 | **100%** |
| **Validation errors** | ? | 0 | **0** |
| **Documentation files** | 87 | ~60 | **-31%** |

---

## 📚 Resources

### Official Documentation
- [Claude Code Plugin Marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [Claude Code Plugin Reference](https://claudecn.com/en/docs/claude-code/plugins/plugins-reference/)
- [Plugin Schema Validation](https://github.com/ananddtyagi/claude-code-marketplace/blob/main/PLUGIN_SCHEMA.md)

### Best Practices
- [Top AI Agent Frameworks 2025](https://medium.com/@elisowski/top-ai-agent-frameworks-in-2025-9bcedab2e239)
- [AI Agent Development Best Practices](https://www.assistents.ai/blog/best-practices-in-ai-agent-development-and-implementation)
- [Plugin Architecture in Node.js](https://medium.com/@Modexa/plugin-architecture-in-nodejs-without-regrets-e02ba78660c7)

### Marketplaces
- [Claude Code Marketplace](https://claudemarketplaces.com/)
- [cc-marketplace GitHub](https://github.com/ananddtyagi/claude-code-marketplace)

---

**Date**: 2025-01-22
**Version**: 1.0.0
**Status**: Ready for Implementation
