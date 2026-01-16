# 🗺️ Project Orchestration

## 🎯 Mission
Engineering Zero-Dette via GLM 4.7/4.6.

## 📚 Specialized Rules (Load on Demand)
- **Logic & Data**: `.claude/rules/engineering.md`
- **UI & UX**: `.claude/rules/frontend.md`
- **Multi-Agent Ops**: `.claude/rules/agents.md`

## ⚓ Sync Hook
Dès qu'une tâche est identifiée comme "Frontend" ou "Engineering", l'agent DOIT lire (`cat`) le fichier de règles correspondant avant de coder.

## 🚦 Execution Decision Matrix

| Task Type | Tool / Workflow |
| :--- | :--- |
| **Small Fix** | `/debug` |
| **Complex Feature** | `/ralph:ralph` (Parallel PRD) |
| **Long Session** | `/ralph:loop` |
| **Architecture** | Architect Agent → Implementation(Builder Agent) |

## 📂 Project Tree Standards

- `src/validation/` : Schémas Zod
- `src/components/ui/` : Atomes (Shadcn)
- `src/core/` : Logique métier pure
- Barrels : Un `index.ts` par dossier obligatoire pour le Tree-shaking
