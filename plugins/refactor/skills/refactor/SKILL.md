---
name: refactor
description: Unified code refactoring with systematic validation
version: 1.0.0
---

# Refactor Skill - Unified Agent

## 🔴 TOOL GATEKEEPER - NON-NEGOTIABLE

═════════════════════════════════════════════════════
🚫 PROHIBITED WITHOUT EXCEPTION:
   grep | egrep | find | ack | ag | ls | dir | glob

✅ MANDATORY REPLACEMENT:
   grepai search "pattern" | /toolkit search "query"

🎯 DECISION TREE:
   Need to search? → grepai or /toolkit search
   Need to explore? → grepai search "" (empty pattern)
   Need to read?    → Read tool (NOT cat/head)
═════════════════════════════════════════════════════

---

## Mission

Provide unified, systematic code refactoring through comprehensive validation, ensuring safe improvements while preserving functionality.

## 📋 Plan Mode First (OBLIGATOIRE)

**TOUJOURS** créer un plan avant toute refactorisation significative.

### Quand Plan Mode est requis

- Modifier plus de 2 fichiers
- Restructurer un module
- Lancer des subagents (classifier, validator, resolver)
- Mode analyze/full/resolve

### Template de Plan

```markdown
## Plan: Refactor [Module/Fichier]

### Objectifs
- [ ] [Objectif principal: réduire complexité, éliminer duplication, etc.]

### Fichiers
À analyser: `path/to/file`
À modifier: `path/to/file` - [raison]

### Approche
1. Analyser l'état actuel
2. Identifier les améliorations
3. Appliquer les changements incrémentalement
4. Valider après chaque changement

### Risques
- [Regression] → Tests après chaque changement
- [Casser l'API] → Vérifier les appels

### Validation
- [ ] Tous les tests passent
- [ ] Aucune régression
- [ ] Complexité réduite

**Confirmer pour procéder ?**
```

## ⚡ Auto-Parallel (DEFAULT)

**Le parallélisme s'active AUTOMATIQUEMENT** pour les refactors complexes.

### Critères d'Auto-Activation

| Critère | Seuil | Parallel |
|---------|-------|----------|
| Fichiers à analyser | ≥ 5 | 2 |
| Modes | analyze/full | 2 |
| Complexité détectée | haute | 2-3 |

### Désactiver

```bash
/refactor --full --no-parallel
/refactor --analyze --no-parallel
```

---

- **Safety First** - Validate all changes before implementation
- **Incremental** - Small, verifiable steps
- **Evidence-Based** - Use metrics to guide decisions
- **Test Continuously** - Run tests after each change
- **Document Thoroughly** - Explain what and why

## Mode Selection

### --quick (Quick Mode)

**Purpose:** Auto-fix low-risk items

**Criteria:**
- Risk score < 30
- Complexity < 8
- Test coverage > 80%

**Workflow:**
1. Identify low-risk items
2. Apply refactoring patterns
3. Test after each change
4. Commit safe changes

**Output:** Applied changes (no analyze/review)

### --full (Full Mode - Default)

**Purpose:** Complete refactoring workflow

**Workflow:**
1. ANALYZE - Detect issues
2. REVIEW - Classify and prioritize
3. RESOLVE - Apply changes
4. VERIFY - Validate results

**Output:** Complete documentation

### --analyze (Analysis Only)

**Purpose:** Detect and catalog issues

**Steps:**
1. Complexity analysis (cyclomatic, cognitive, nesting)
2. Duplication detection
3. Code smell identification
4. Maintainability assessment
5. Technical debt scoring

**Output:** `.claude/.smite/refactor-analysis.md`

### --review (Review and Prioritize)

**Purpose:** Create action plan

**Steps:**
1. Classify by severity (P1-P4)
2. Assess business impact
3. Estimate effort and risk
4. Identify quick wins
5. Create timeline

**Output:** `.claude/.smite/refactor-review.md`

### --resolve (Resolve Specific Items)

**Purpose:** Apply validated refactoring

**Steps:**
1. Load item from review
2. Apply proven patterns
3. Make incremental changes
4. Test continuously
5. Document changes
6. Commit logically

**Output:** `.claude/.smite/refactor-resolution-[ID].md`

### --verify (Verify Results)

**Purpose:** Comprehensive verification

**Steps:**
1. All tests passing
2. No type errors
3. Metrics improved
4. No regressions
5. Deployment ready

**Output:** `.claude/.smite/refactor-verification.md`

## Scope Options

### --scope=recent (Default)

Analyze and refactor recent changes only.

### --scope=file:PATH

Refactor specific file.

```bash
/refactor --full --scope=file:src/auth/jwt.ts
```

### --scope=directory:PATH

Refactor entire directory.

```bash
/refactor --full --scope=directory:src/features/auth
```

### --scope=all

Refactor entire codebase.

```bash
/refactor --full --scope=all
```

### --scope=bug (Bug Fixing Mode)

Debug and fix specific bugs.

```bash
/refactor --scope=bug "TypeError: product.price is not a function"

# With adversarial review
/refactor --scope=bug --examine "Critical production bug"
```

### --parallel=N / AUTO (Worktree Parallel Mode)

**Purpose:** Execute multiple refactoring strategies simultaneously

**⚡ AUTO-ACTIVÉ** pour modes analyze/full (≥5 fichiers ou complexité haute)

**Désactiver avec:** `--no-parallel`

**How it works:**
```
1. Create N Git worktrees alongside main repo
2. Each worktree analyzes different aspect
3. Results merged for comprehensive refactoring plan
4. Worktrees cleaned up after completion
```

**Parallel Strategies by Mode:**

| Mode | --parallel=2 | --parallel=3 |
|------|--------------|--------------|
| `--quick` | N/A (too fast) | N/A |
| `--full` | wt-1: Analyze+Review, wt-2: Resolve | wt-1: Analyze, wt-2: Review, wt-3: Resolve |
| `--analyze` | wt-1: Code smells, wt-2: Complexity | wt-1: Code smells, wt-2: Complexity, wt-3: Security |
| `--resolve` | wt-1: Low-risk, wt-2: High-risk | wt-1: Low-risk, wt-2: Medium-risk, wt-3: High-risk |

**Examples:**
```bash
# Full refactoring with 2-way split
/refactor --full --parallel=2

# Deep analysis with 3 perspectives
/refactor --analyze --parallel=3

# Risk-tiered resolution
/refactor --resolve --parallel=3
```

**Merge Strategy:**
- Merge analysis reports from all worktrees
- Consolidate review items by priority
- Apply refactorings in dependency order

**Best for:** Comprehensive refactoring, risk assessment, multi-angle analysis

## Common Patterns

### Extract Method

Reduce complexity by extracting methods.

**Before:**
```typescript
function processUserData(user: User) {
  if (!user) return null;
  const cleaned = user.name.trim().toLowerCase();
  const email = user.email.trim().toLowerCase();
  const normalized = email.replace(/@.*/, "");
  return { name: cleaned, email, normalized };
}
```

**After:**
```typescript
function processUserData(user: User) {
  if (!user) return null;
  return {
    name: cleanName(user.name),
    email: cleanEmail(user.email),
    normalized: normalizeEmail(user.email)
  };
}

function cleanName(name: string): string {
  return name.trim().toLowerCase();
}

function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeEmail(email: string): string {
  return email.replace(/@.*/, "");
}
```

### Introduce Parameter Object

Simplify signatures by grouping parameters.

**Before:**
```typescript
function createUser(
  name: string,
  email: string,
  password: string,
  age: number,
  address: string,
  phone: string
) { ... }
```

**After:**
```typescript
interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  age: number;
  address: string;
  phone: string;
}

function createUser(params: CreateUserParams) { ... }
```

### Replace Magic Numbers

Improve clarity.

**Before:**
```typescript
if (user.level > 5) {
  user.discount = 0.15;
}
```

**After:**
```typescript
const MIN_LEVEL_FOR_DISCOUNT = 5;
const DEFAULT_DISCOUNT = 0.15;

if (user.level > MIN_LEVEL_FOR_DISCOUNT) {
  user.discount = DEFAULT_DISCOUNT;
}
```

## Subagent Collaboration

### Classifier Subagent

**Purpose:** Issue classification and prioritization

**Launched by:** Review step (`--review`)

**Capabilities:**
- Issue classification (P1-P4)
- Business impact assessment
- Effort estimation
- Risk evaluation
- Action plan creation

**Output:** Prioritized review report

### Validator Subagent

**Purpose:** Safety and validation

**Launched by:** Review step (`--review`)

**Capabilities:**
- Functionality preservation verification
- Test coverage analysis
- Impact analysis
- Risk assessment
- Approval decision

**Output:** Validation report (APPROVED/CONDITIONAL/REJECTED)

### Resolver Subagent

**Purpose:** Refactoring implementation

**Launched by:** Resolve step (`--resolve`)

**Capabilities:**
- Apply refactoring patterns
- Incremental changes
- Continuous testing
- Documentation
- Safe commits

**Output:** Resolved code with documentation

## Integration

- **Works with:** toolkit (semantic search, bug detection, dependency graph)
- **Used by:** ralph (refactor workflow), builder (after implementation)
- **Compatible with:** all SMITE agents

## Error Handling

- **Tests failing:** Fix or revert changes
- **Validation rejected:** Address blocking issues
- **Type errors:** Resolve before proceeding
- **Regressions detected:** Rollback and investigate

## Success Criteria

- ✅ All tests passing
- ✅ No type errors
- ✅ Complexity reduced
- ✅ Coverage increased
- ✅ No regressions
- ✅ Documentation complete

## Best Practices

1. **Always analyze first** - Understand issues before acting
2. **Validate changes** - Never skip validation step
3. **Start with quick wins** - Build momentum
4. **Test continuously** - After each small change
5. **Commit logically** - Small, reviewable commits
6. **Document thoroughly** - Explain reasoning

## Configuration

Default config in `.claude/.smite/refactor.json`:

```json
{
  "defaults": {
    "scope": "recent",
    "riskThreshold": 30,
    "complexityThreshold": 8,
    "coverageTarget": 80,
    "autoCommit": true
  },
  "exclude": [
    "node_modules/**",
    "dist/**",
    ".claude/**"
  ],
  "patterns": {
    "enabled": [
      "extract-method",
      "extract-class",
      "introduce-param-object",
      "replace-magic-numbers",
      "decompose-conditional"
    ]
  }
}
```

---

*Refactor Skill v1.0.0 - Unified refactoring agent*
