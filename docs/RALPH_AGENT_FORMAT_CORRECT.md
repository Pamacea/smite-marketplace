# 🎯 Ralph Agent Format - CORRECT

## ✅ Bon Format (OFFICIEL)

### Dans le PRD (.smite/prd.json)

```json
{
  "agent": "nom-du-plugin"
}
```

**Exemples corrects:**
```json
{ "agent": "architect" }
{ "agent": "builder" }
{ "agent": "explorer" }
{ "agent": "finalize" }
{ "agent": "ralph" }
```

### Dans le Task Tool

```
subagent_type = "plugin:task"
```

**Exemples corrects:**
```
architect:architect
builder:constructor.task
explorer:explorer.task
finalize:finalize
ralph:ralph
```

---

## 📋 Tableau de Correspondance

| Plugin | Task subagent_type | PRD agent field |
|--------|-------------------|----------------|
| architect | `architect:architect` | `"agent": "architect"` |
| builder | `builder:constructor.task` | `"agent": "builder"` |
| explorer | `explorer:explorer.task` | `"agent": "explorer"` |
| finalize | `finalize:finalize` | `"agent": "finalize"` |
| ralph | `ralph:ralph` | `"agent": "ralph"` |

---

## 📝 Exemple PRD Complet

```json
{
  "project": "TestApp",
  "branchName": "ralph/test",
  "description": "Test Ralph agents",
  "userStories": [
    {
      "id": "US-001",
      "title": "Initialize project",
      "agent": "architect",
      "dependencies": [],
      "acceptanceCriteria": ["Project setup"],
      "priority": 10,
      "passes": false,
      "notes": ""
    },
    {
      "id": "US-002",
      "title": "Build feature",
      "agent": "builder",
      "dependencies": ["US-001"],
      "acceptanceCriteria": ["Feature built"],
      "priority": 9,
      "passes": false,
      "notes": ""
    },
    {
      "id": "US-003",
      "title": "QA and docs",
      "agent": "finalize",
      "dependencies": ["US-001", "US-002"],
      "acceptanceCriteria": ["Tests pass", "Docs complete"],
      "priority": 1,
      "passes": false,
      "notes": ""
    }
  ]
}
```

---

## 🚀 Execution

```bash
/ralph execute .smite/prd.json
```

Ralph va:
1. Lire le PRD avec les agents: `"agent": "architect"`, `"agent": "builder"`, etc.
2. Lancer les agents via Task tool: `architect:architect`, `builder:constructor.task`, etc.
3. Exécuter en parallèle quand c'est possible
4. Compléter toutes les stories

---

**✅ CORRIGÉ et validé!**

Test maintenant avec:
```bash
/ralph execute .smite/test-prd.json
```
