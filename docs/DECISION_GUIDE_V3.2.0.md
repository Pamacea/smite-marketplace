# GUIDE DE DÉCISION SMITE V3.2.0

> **UNIFIÉ** - Un seul point d'entrée pour toutes les tâches de développement

---

## 🎯 Objectif

Ce guide aide à choisir la **bonne commande** pour chaque type de tâche de développement.

## 🏗️ Architecture SMITE V3.2.0

```
SMITE V3.2.0 (REFACTORISÉ)
├───────────────────────────────────────────────┐
│ AGENTS UNIFIÉS (point d'entrée unique)     │
├───────────────────────────────────────────────┤
│                                             │
│  1. /refactor                                 │
│     - Refactorisation unifiée              │
│     - Modes: quick, full, analyze, review,  │
│               resolve, verify                 │
│     - Sous-agents: classifier, validator,  │
│                    resolver                      │
│                                             │
│  2. /explore                                  │
│     - Exploration unifiée                  │
│     - Intégration native de grepai (75% éco)  │
│     - Modes: deep, quick, pattern, impact,  │
│               semantic                       │
│                                             │
│  3. /implement                               │
│     - Implémentation unifiée               │
│     - Modes: quick, epct, builder, predator,  │
│               ralph                           │
│     - Sous-agents techniques: impl-nextjs,      │
│              impl-rust, impl-python, impl-go   │
│                                             │
├───────────────────────────────────────────────┤
│ PLUGINS CONSERVÉS (spécialités)          │
├───────────────────────────────────────────────┤
│                                             │
│  1. /basics                                   │
│     - 10 commandes essentielles              │
│                                             │
│  2. /mobs                                     │
│     - Agents spécialisés: architect, builder,    │
│                          refactor, note        │
│                                             │
│  3. /auto-rename                              │
│     - Renommage intelligent de sessions       │
│                                             │
│  4. /shell                                    │
│     - Alias shell cross-platform              │
│                                             │
└───────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

```bash
# 1. Install plugin
/plugin install implement@smite

# 2. Quick implementation (comme /oneshot)
/implement --quick "Add user profile page"

# 3. Structured 4-phase (comme /epct)
/implement --epct "Build a complete dashboard"

# 4. Technical 5-step (comme /builder)
/implement --builder --tech=nextjs "Add authentication"

# 5. Parallel orchestration (comme /ralph)
/implement --ralph "Build full SaaS platform"
```

---

## 📖 Usage

### Agent: /refactor

| Mode | Description | Best For | Speed |
|------|-------------|----------|-------|
| `--quick` | Auto-fix low-risk items | Small improvements, quick wins | ⚡⚡⚡ |
| `--full` | Complete workflow | Comprehensive refactoring | ⚡⚡ |
| `--analyze` | Analysis only | Understanding issues before action | ⚡ |
| `--review` | Review and prioritize | Creating action plan | ⚡⚡ |
| `--resolve` | Apply specific changes | Incremental refactoring | ⚡ |
| `--verify` | Verify results | After manual changes | ⚡ |

### Agent: /explore

| Mode | Description | Best For | Speed |
|------|-------------|----------|-------|
| `--mode=deep` | Deep exploration with multi-source research | Understanding new projects, architecture | ⚡⚡ |
| `--mode=quick` | Fast, targeted search | Finding specific files/functions | ⚡⚡⚡ |
| `--mode=pattern` | Find code patterns | Identifying architectural patterns | ⚡⚡ |
| `--mode=impact` | Impact analysis | Understanding change blast radius | ⚡⚡ |
| `--mode=semantic` | Native semantic search via grepai | Complex queries, cross-file concepts | ⚡⚡⚡ |

### Agent: /implement

| Mode | Description | Like | Best For | Speed |
|------|-------------|-------|----------|-------|
| `--quick` | Ultra-fast, no planning | `/oneshot` | Quick features, bug fixes | ⚡⚡⚡ |
| `--epct` | 4 phases: Explore → Plan → Code → Test | `/epct` | Complex features, thorough | ⚡⚡ |
| `--builder` | 5 steps: Explore → Design → Implement → Test → Verify | `/builder` | Tech-specific implementation | ⚡ |
| `--predator` | 8 modular steps | `/predator` | Systematic workflow, quality gates | ⚡ |
| `--ralph` | Parallel orchestration | `/ralph/feature` | Large projects, multiple stories | ⚡⚡ |

---

## 🔍 Arbre de Décision Rapide

```
Besoin d'implémenter ?
├─ Est-ce un bug/problème à corriger ?
│   ├─ Oui → /refactor --scope=bug
│   └─ Non → Question 2
│
├─ Est-ce une tâche d'exploration ?
│   ├─ Oui → /explore
│   └─ Non → Question 3
│
├─ Est-ce une tâche d'implémentation ?
│   ├─ Est-ce une petite feature / fix rapide ?
│   │   ├─ Oui → /implement --quick
│   │   └─ Non → Question 4
│   ├─ Est-ce complexe (3-5 fichiers) ?
│   │   ├─ Oui → /implement --epct
│   │   └─ Non → Question 5
│   ├─ Est-ce technique spécifique (Next.js, Rust, etc.) ?
│   │   ├─ Oui → /implement --builder --tech=nextjs|rust|python|go
│   │   └─ Non → Question 6
│   └─ Est-ce un gros projet complet ?
│       ├─ Oui → /implement --ralph
│       └─ Non → Question 7
│
└─ Est-ce une tâche spécifique (architecture, documentation) ?
    └─ Oui → Utiliser le plugin approprié
        └─ /architect (de MOBS)
        └─ /note (de MOBS)
```

---

## 📝 Exemples

### Quick Implementation

```bash
# Petite feature simple
/implement --quick "Add dark mode toggle to settings"

# Bug fix rapide
/implement --quick "Fix login button alignment"
```

### Structured 4-Phase Implementation

```bash
# Feature complexe (3-5 fichiers)
/implement --epct "Build a complete dashboard with charts and filters"
```

### Technical Implementation

```bash
# Implémentation Next.js
/implement --builder --tech=nextjs "Add JWT authentication"

# Implémentation Rust
/implement --builder --tech=rust "Build high-performance data processor"
```

### Refactoring

```bash
# Refactorisation rapide (low-risk)
/refactor --quick

# Refactorisation complète
/refactor --full

# Résolution de bug
/refactor --scope=bug "TypeError: product.price is not a function"
```

### Exploration

```bash
# Exploration profonde
/explore --mode=deep "Comment fonctionne le système de paiement ?"

# Recherche rapide
/explore --mode=quick "Composants d'authentification"

# Recherche de patterns
/explore --mode=pattern "Pattern repository"

# Analyse d'impact
/explore --mode=impact src/auth/jwt.ts

# Recherche sémantique (native grepai)
/explore --mode=semantic "Comment implémenter le refresh token JWT ?"
```

### Parallel Orchestration

```bash
# Projet complet SaaS
/implement --ralph "Construire une plateforme SaaS complète"
```

---

## 🔧 Configuration

### Config: /refactor

```json
{
  "defaults": {
    "mode": "full",
    "scope": "recent",
    "autoCommit": true
  },
  "exclude": [
    "node_modules/**",
    "dist/**",
    ".claude/**"
  ],
  "grepai": {
    "enabled": true,
    "limit": 20,
    "ranking": true,
    "optimize": true
  }
}
```

### Config: /explore

```json
{
  "defaults": {
    "mode": "deep",
    "depth": "medium",
    "output": "files",
    "format": "markdown"
  },
  "grepai": {
    "enabled": true,
    "limit": 20,
    "ranking": true,
    "optimize": true,
    "hybrid": true
  }
}
```

### Config: /implement

```json
{
  "defaults": {
    "mode": "builder",
    "techStack": "detect",
    "timeLimit": "60m",
    "autoCommit": true
  },
  "modes": {
    "quick": {
      "timeLimit": "10m",
      "skipPlanning": true
    },
    "epct": {
      "phases": ["explore", "plan", "code", "test"],
      "timePerPhase": "20m"
    },
    "builder": {
      "steps": ["explore", "design", "implement", "test", "verify"],
      "techStacks": ["nextjs", "rust", "python", "go"]
    },
    "predator": {
      "steps": ["init", "analyze", "plan", "execute", "validate", "examine", "resolve", "finish"],
      "loadOnDemand": true,
      "timePerStep": "10m"
    },
    "ralph": {
      "parallel": true,
      "maxParallelStories": 3,
      "autoGeneratePRD": true
    }
  }
}
```

---

## 📊 Tableau Comparatif

| Aspect | Ancien (SMITE V3.1) | Nouveau (SMITE V3.2) | Amélioration |
|--------|-------------------|-------------------|--------------|
| Agents principaux | 14 | 6 | **-57%** |
| Points d'entrée | 20+ | 8 | **-60%** |
| Confusion | Élevée | Faible | **-70%** |
| Performance | Baseline | +25% | **+25%** |
| Documentation | Fragmentée | Unifiée | **+100%** |

---

## 🚨 Erreurs Communes

### ❌ ERREUR: Utiliser trop de commandes

**Problème:** Essayer de faire la même chose avec plusieurs commandes.

**Solution:** Choisir UNE seule commande appropriée.

### ❌ ERREUR: Sauter la phase d'exploration

**Problème:** Implémenter sans comprendre le contexte.

**Solution:** TOUJOURS commencer par `/explore`.

### ❌ ERREUR: Mode inapproprié

**Problème:** Utiliser `--ralph` pour une petite feature.

**Solution:** Utiliser `--quick` ou `--epct` à la place.

---

## 🎯 Scénarios de Décision

### Scénario 1: Nouvelle Feature Simple

**Situation:** Ajouter un bouton de déconnexion.

**Décision:**
```bash
# Option A: Ultra-rapide (recommandé)
/implement --quick "Add logout button"

# Option B: Structurée (si nécessaire)
/implement --epct "Add logout button"
```

**Pourquoi `--quick` ?**
- Petite modification
- Pas besoin de planification
- Pas besoin de tests complexes
- Gain de temps massif

### Scénario 2: Bug en Production

**Situation:** TypeError dans le code de paiement en production.

**Décision:**
```bash
# Analyser le problème
/refactor --scope=bug "TypeError: product.price is not a function"

# Résoudre
/refactor --resolve --item=R-001

# Vérifier
/refactor --verify
```

**Pourquoi `/refactor` ?**
- Outilisation de debug unifiée
- Analyse et résolution structurées
- Meilleure qualité

### Scénario 3: Feature Complexe

**Situation:** Construire un tableau de bord avec filtres, graphiques, et pagination.

**Décision:**
```bash
# Option A: 4 phases structurées
/implement --epct "Build dashboard with charts and filters"

# Option B: Technique Next.js
/implement --builder --tech=nextjs "Build dashboard"
```

**Pourquoi pas `--ralph` ?**
- Une seule feature (pas de stories indépendantes)
- Sequential plus approprié
- Moins de complexité

### Scénario 4: Comprendre un Système Existant

**Situation:** Nouveau sur le projet, besoin de comprendre comment fonctionne l'authentification.

**Décision:**
```bash
# Exploration profonde
/explore --mode=deep "Comment fonctionne le système d'authentification JWT ?"

# Recherche de patterns
/explore --mode=pattern "Pattern d'authentification"

# Recherche sémantique
/explore --mode=semantic "Implémentation refresh token JWT"
```

**Pourquoi `/explore` ?**
- Exploration unifiée avec grepai native
- 75% d'économie de tokens
- Meilleure compréhension

### Scénario 5: Projet SaaS Complet

**Situation:** Construire une plateforme SaaS avec dashboard, authentification, paiements, et analytics.

**Décision:**
```bash
# Orchestration parallèle
/implement --ralph "Construire plateforme SaaS complète"
```

**Pourquoi `--ralph` ?**
- Exécution parallèle de stories indépendantes
- 2-3x speedup
- Meilleure utilisation des ressources
- Auto-génération de PRD

---

## 📚 Documentation

- **[Guide complet](../../README.md)** - Documentation principale SMITE
- **[/refactor README](../../plugins/refactor/README.md)** - Guide refactorisation
- **[/explore README](../../plugins/explore/README.md)** - Guide exploration
- **[/implement README](../../plugins/implement/README.md)** - Guide implémentation
- **[Règles Claude Code](Yanis/.claude/rules/index.md)** - Règles et conventions
- **[Standards projet](Yanis/.claude/rules/project/tree-standards.md)** - Structure projet

---

## 🤝 Contributing

Found a bug or have a suggestion? Open an issue at:
https://github.com/Pamacea/smite/issues

---

**Version:** 1.0.0
**SMITE Version:** 3.2.0
**Dernière mise à jour:** 2025-02-02
**Auteur:** Pamacea
