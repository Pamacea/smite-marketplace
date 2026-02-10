# Worktree Orchestrator - Parallel Execution for SMITE Agents

`★ Insight ─────────────────────────────────────`
**Why worktree parallelism matters:**
1. **Isolation totale** - Chaque agent travaille dans son propre environnement sans polluer les autres
2. **Vrai parallélisme** - Plusieurs agents Claude peuvent travailler sur le même codebase simultanément
3. **Safe experimentation** - On peut essayer plusieurs approches et comparer les résultats
`─────────────────────────────────────────────────`

---

## ⚡ Auto-Parallel (DEFAULT)

**Le mode parallèle s'active AUTOMATIQUEMENT** quand des critères sont réunis.

### Critères d'Auto-Activation

| Critère | Seuil | Trigger |
|---------|-------|---------|
| **Fichiers** | ≥ 4 fichiers à créer/modifier | Parallel=2 |
| **Sous-tâches** | ≥ 3 tâches indépendantes | Parallel=3 |
| **Temps estimé** | ≥ 30 min | Parallel=2 |
| **Complexité** | Mode predator/builder/full | Parallel=2 |
| **Branchement** | ≥ 2 chemins possibles | Parallel=2 |

**Formule de calcul:**
```
parallel_count = min(
    ceil(fichiers / 3),
    ceil(sous_taches / 2),
    ceil(temps_estime / 20min),
    4  # maximum
)
```

### Exemples d'Auto-Déclenchement

```bash
# Cas 1: Plusieurs fichiers (5 fichiers = 2 worktrees)
/implement --epct "Add user auth with login, register, profile, settings, admin"
# → AUTO: --parallel=2

# Cas 2: Tâches complexes (4 sous-tâches = 2 worktrees)
/implement --predator "Build dashboard with charts, filters, pagination, export"
# → AUTO: --parallel=2

# Cas 3: Gros refactor (10+ fichiers = 3 worktrees)
/refactor --full "Refactor entire auth module"
# → AUTO: --parallel=3

# Cas 4: Exploration multi-source
/explore --mode=deep "Research microservices architecture patterns"
# → AUTO: --parallel=3
```

### Désactiver l'Auto-Parallel

```bash
# Forcer le mode séquentiel
/implement --epct --no-parallel "Add simple feature"
/refactor --full --no-parallel "Quick cleanup"
/explore --mode=deep --no-parallel "Simple question"
```

### Messages d'Activation

Quand l'auto-parallel s'active, l'agent affiche:

```
⚡ AUTO-PARALLEL ACTIVÉ
├─ Raison: 6 fichiers détectés (≥4)
├─ Worktrees: 2 créés
├─ Stratégie: wt-1 (Explore+Plan), wt-2 (Code+Test)
└─ Pour désactiver: utilisez --no-parallel
```

---

---

## Overview

Le Worktree Orchestrator permet aux agents SMITE de s'exécuter en parallèle via Git worktrees.

**Usage:**
```bash
/implement --predator --parallel=3
/refactor --full --parallel=2
/explore --mode=deep --parallel=4
```

---

## Architecture

```
Main Repository (smite/)
├── .git/
├── src/                    # Original codebase
├── plugins/
└── .claude/.smite/
    ├── parallel/
    │   ├── worktrees.json      # État des worktrees actifs
    │   ├── tasks.json          # Tâches parallèles assignées
    │   └── results/            # Résultats de chaque worktree
    │       ├── wt-1/
    │       ├── wt-2/
    │       └── wt-3/
    └── merged/                 # Résultats fusionnés
```

---

## Worktree Lifecycle

### 1. Initialization

```bash
# Création des worktrees
git worktree add ../smite-parallel-1 main
git worktree add ../smite-parallel-2 main
git worktree add ../smite-parallel-3 main

# État enregistré
cat > .claude/.smite/parallel/worktrees.json << EOF
{
  "sessionId": "$(uuidgen)",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "agent": "implement",
  "mode": "predator",
  "count": 3,
  "worktrees": [
    {"id": "wt-1", "path": "../smite-parallel-1", "status": "ready"},
    {"id": "wt-2", "path": "../smite-parallel-2", "status": "ready"},
    {"id": "wt-3", "path": "../smite-parallel-3", "status": "ready"}
  ]
}
EOF
```

### 2. Task Distribution

Chaque worktree reçoit une **tâche spécifique** selon l'agent et le mode :

**Implement --predator --parallel=3:**
```
wt-1: Predator workflow (standard)
wt-2: Predator workflow + focus sur performance
wt-3: Predator workflow + focus sur sécurité
```

**Refactor --full --parallel=2:**
```
wt-1: Analyse et review (classifier + validator)
wt-2: Résolution (resolver)
```

**Explore --mode=deep --parallel=4:**
```
wt-1: Recherche sémantique (grepai)
wt-2: Recherche web (docs externes)
wt-3: Analyse de code (patterns)
wt-4: Analyse de dépendances (impact)
```

### 3. Execution

Chaque worktree exécute sa tâche de manière **autonome** :

```bash
# Dans chaque worktree
cd ../smite-parallel-1
# L'agent Claude reçoit sa tâche spécifique
# Les résultats sont écrits dans .claude/.smite/results/
```

### 4. Result Collection

```bash
# Collecte des résultats
collect_results() {
  local session_id=$1
  local results_dir=".claude/.smite/parallel/$session_id/results"

  mkdir -p "$results_dir"

  for wt in wt-1 wt-2 wt-3; do
    cp "../smite-parallel-${wt#wt-}/.claude/.smite/"* "$results_dir/$wt/" 2>/dev/null || true
  done
}
```

### 5. Merge & Cleanup

```bash
# Fusion des résultats dans le repo principal
merge_results() {
  local session_id=$1
  local results_dir=".claude/.smite/parallel/$session_id/results"

  # Stratégie de merge selon l'agent
  case "$AGENT" in
    implement)
      merge_implement_results "$results_dir"
      ;;
    refactor)
      merge_refactor_results "$results_dir"
      ;;
    explore)
      merge_explore_results "$results_dir"
      ;;
  esac

  # Cleanup des worktrees
  cleanup_worktrees "$session_id"
}

cleanup_worktrees() {
  local session_id=$1

  # Suppression des worktrees
  git worktree remove ../smite-parallel-1
  git worktree remove ../smite-parallel-2
  git worktree remove ../smite-parallel-3

  # Archive des résultats
  mv ".claude/.smite/parallel/$session_id" ".claude/.smite/parallel/archive/$session_id"
}
```

---

## Agent-Specific Strategies

### /implement --parallel

**Strategies de distribution:**

| Mode | Parallel=2 | Parallel=3 | Parallel=4 |
|------|------------|------------|------------|
| `--quick` | N/A (too fast) | N/A | N/A |
| `--epct` | wt-1: Explore+Plan, wt-2: Code+Test | wt-1: Explore, wt-2: Plan+Code, wt-3: Test | wt-1: Explore, wt-2: Plan, wt-3: Code, wt-4: Test |
| `--builder` | wt-1: Design, wt-2: Implement | wt-1: Design, wt-2: Implement+Test, wt-3: Verify | wt-1: Design, wt-2: Implement, wt-3: Test, wt-4: Verify |
| `--predator` | wt-1: Standard, wt-2: Adversarial | wt-1: Standard, wt-2: Performance-focus, wt-3: Security-focus | wt-1: Standard, wt-2: Performance, wt-3: Security, wt-4: Edge-cases |
| `--ralph` | Déjà parallèle en interne | Déjà parallèle en interne | Déjà parallèle en interne |

**Merge Strategy:**
```bash
merge_implement_results() {
  local results_dir=$1

  # 1. Comparer les implémentations
  compare_implementations "$results_dir"

  # 2. Choisir la meilleure (ou fusionner)
  best=$(select_best_implementation "$results_dir")

  # 3. Appliquer au repo principal
  rsync -a "$results_dir/$best/src/" "$PROJECT_ROOT/src/"

  # 4. Générer un rapport de comparaison
  generate_comparison_report "$results_dir" > ".claude/.smite/parallel/comparison.md"
}
```

### /refactor --parallel

**Strategies de distribution:**

| Mode | Parallel=2 | Parallel=3 |
|------|------------|------------|
| `--quick` | N/A | N/A |
| `--full` | wt-1: Analyze+Review, wt-2: Resolve | wt-1: Analyze, wt-2: Review, wt-3: Resolve |
| `--analyze` | wt-1: Code smells, wt-2: Complexity | wt-1: Code smells, wt-2: Complexity, wt-3: Security |
| `--resolve` | wt-1: Low-risk, wt-2: High-risk | wt-1: Low-risk, wt-2: Medium-risk, wt-3: High-risk |

**Merge Strategy:**
```bash
merge_refactor_results() {
  local results_dir=$1

  # 1. Fusionner les rapports d'analyse
  merge_analysis_reports "$results_dir" > ".claude/.smite/refactor-analysis.md"

  # 2. Fusionner les reviews
  merge_reviews "$results_dir" > ".claude/.smite/refactor-review.md"

  # 3. Appliquer les refactorings (en ordre de priorité)
  apply_refactorings "$results_dir"
}
```

### /explore --parallel

**Strategies de distribution:**

| Mode | Parallel=2 | Parallel=3 | Parallel=4 |
|------|------------|------------|------------|
| `--deep` | wt-1: Codebase, wt-2: Web | wt-1: Codebase, wt-2: Web, wt-3: Docs | wt-1: Codebase, wt-2: Web, wt-3: Docs, wt-4: Patterns |
| `--quick` | wt-1: Semantic, wt-2: Literal | wt-1: Semantic, wt-2: Literal, wt-3: File-search | N/A |
| `--pattern` | wt-1: Design patterns, wt-2: Code patterns | wt-1: Design, wt-2: Code, wt-3: Architecture | N/A |
| `--impact` | wt-1: Upstream deps, wt-2: Downstream consumers | wt-1: Upstream, wt-2: Downstream, wt-3: Config | N/A |

**Merge Strategy:**
```bash
merge_explore_results() {
  local results_dir=$1

  # 1. Fusionner tous les résultats d'exploration
  merge_exploration_reports "$results_dir" > ".claude/.smite/explore-deep.md"

  # 2. Dédupliquer les fichiers trouvés
  deduplicate_files "$results_dir"

  # 3. Fusionner les diagrammes ASCII
  merge_diagrams "$results_dir"
}
```

---

## Task Assignment Format

```json
{
  "sessionId": "uuid",
  "worktreeId": "wt-1",
  "agent": "implement",
  "mode": "predator",
  "task": {
    "type": "standard",
    "focus": null,
    "constraints": [],
    "output": ".claude/.smite/results/"
  },
  "context": {
    "originalRequest": "Build authentication system",
    "projectRoot": "/path/to/main/repo",
    "branch": "main"
  }
}
```

---

## Result Format

```json
{
  "sessionId": "uuid",
  "worktreeId": "wt-1",
  "status": "completed",
  "duration": "45m23s",
  "output": {
    "files": ["src/auth/login.ts", "src/auth/register.ts"],
    "documentation": ".claude/.smite/predator-summary.md",
    "tests": ["src/auth/__tests__/login.test.ts"]
  },
  "metrics": {
    "filesCreated": 5,
    "linesAdded": 342,
    "testsPassed": 12,
    "coverage": 87
  }
}
```

---

## Cross-Platform Compatibility

```bash
# Windows (Git Bash)
WINDOWS_WORKTREE_BASE="$USERPROFILE/smite-worktrees"

# macOS/Linux
UNIX_WORKTREE_BASE="$HOME/.smite-worktrees"

# Détection automatique
detect_worktree_base() {
  if uname | grep -qE "(MINGW|MSYS|CYGWIN)"; then
    echo "$USERPROFILE/smite-worktrees"
  else
    echo "$HOME/.smite-worktrees"
  fi
}
```

---

## Error Handling

```bash
# Timeout handling
timeout_after() {
  local timeout=$1
  local worktree=$2

  timeout "$timeout" bash -c "
    cd '$worktree'
    # Exécuter la tâche
  " || {
    log_error "Worktree $worktree timed out after ${timeout}s"
    return 1
  }
}

# Failed worktree handling
handle_failed_worktree() {
  local worktree=$1
  local error=$2

  log_error "Worktree $worktree failed: $error"

  # Marquer comme échoué
  jq ".worktrees[].status = \"failed\"" \
    ".claude/.smite/parallel/worktrees.json"

  # Décider : continuer ou aborter ?
  if [[ "$FAIL_FAST" == "true" ]]; then
    cleanup_worktrees
    exit 1
  fi
}
```

---

## Configuration

```json
{
  "parallel": {
    "enabled": true,
    "maxWorktrees": 4,
    "defaultCount": 2,
    "timeout": "60m",
    "failFast": false,
    "worktreeBase": "~/.smite-worktrees",
    "autoCleanup": true,
    "keepResults": true,
    "mergeStrategy": "best"
  }
}
```

---

## Version

**Version**: 1.0.0
**Last Updated**: 2025-02-02
**Author**: SMITE Team
