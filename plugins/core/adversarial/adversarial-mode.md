# Adversarial Mode - Quality by Challenge

`★ Insight ─────────────────────────────────────`
**Adversarial testing** : Une session qui challenge le travail de l'autre garantit une meilleure qualité.
**"Prove it works"** : Au lieu de demander "est-ce que ça marche ?", on demande "prouve que ça marche".
**Multi-angle analysis** : Performance, sécurité, edge cases, UX, erreurs.`─────────────────────────────────────────────────`

---

## Overview

Le mode Adversarial assigne un deuxième agent pour **challenger** le travail du premier agent.

### Philosophie

> "Prove to me this works" > "Est-ce que ça marche ?"

L'agent adversarial cherche activement:
- Des cas limites non couverts
- Des problèmes de performance
- Des failles de sécurité
- Des problèmes d'UX
- Des scénarios d'erreur manqués

---

## Activation

### Flag explicite

```bash
/implement --predator --adversarial "Build feature"
/refactor --full --adversarial "Refactor module"
```

### Auto-activation (certaines conditions)

- Code critique (auth, payment, security-sensitive)
- Production deployment imminent
- Mode predator avec --parallel=2

---

## Workflow Adversarial

```
┌─────────────────────────────────────────────────────────┐
│                    PHASE 1: IMPLEMENTATION              │
│  Agent A (Implementer)                                  │
│  - Implémente la feature selon les specs               │
│  - Suit les patterns du projet                          │
│  - Génère tests unitaires                              │
│  - Sortie: code + tests                                 │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    PHASE 2: CHALLENGE                   │
│  Agent B (Adversarial)                                  │
│  - Challenge le travail de Agent A                      │
│  - Cherche les edge cases                               │
│  - Teste les limites                                    │
│  - Sortie: rapport de challenge                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    PHASE 3: RESOLUTION                  │
│  Agent A (Implementer)                                  │
│  - Répond aux challenges                                │
│  - Corrige les problèmes identifiés                     │
│  - Ajoute tests manquants                               │
│  - Sortie: code amélioré                                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    PHASE 4: VALIDATION                   │
│  Agent B (Adversarial)                                  │
│  - Vérifie que les challenges sont résolus              │
│  - Valide que rien n'est cassé                         │
│  - Donne accord final ou nouveau challenge              │
└─────────────────────────────────────────────────────────┘
```

---

## Checklist de Challenge

L'agent adversarial utilise systématiquement cette checklist:

### 1. Functional Completeness
```
□ Tous les cas heureux sont-ils couverts ?
□ Les validations d'input sont-elles complètes ?
□ Les messages d'erreur sont-ils utiles ?
□ Les edge cases métier sont-ils gérés ?
```

### 2. Error Handling
```
□ Que se passe-t-il si l'API échouit ?
□ Que se passe-t-il si la DB est down ?
□ Que se passe-t-il si les données sont invalides ?
□ Les timeouts sont-ils gérés ?
□ Les retries sont-ils appropriés ?
```

### 3. Performance
```
□ Y a-t-il des requêtes N+1 ?
□ Les gros datasets sont-ils paginés ?
□ Les calculs coûteux sont-ils cachés ?
□ Y a-t-il des fuites de mémoire potentielles ?
```

### 4. Security
```
□ Les inputs sont-ils validés/sanitisés ?
□ Les données sensibles sont-elles protégées ?
□ Les permissions sont-elles vérifiées ?
□ Y a-t-il des vulnérabilités XSS/SQLi ?
```

### 5. UX Edge Cases
```
□ Écran vide (pas de données)
□ Écran de chargement (slow network)
□ État d'erreur (network error)
□ État de succès (feedback utilisateur)
□ Cas limite (données extrêmes)
```

### 6. Code Quality
```
□ Le code est-il lisible ?
□ Les variables sont-elles bien nommées ?
□ La complexité est-elle acceptable ?
□ Les dupliications sont-elles évitées ?
```

---

## Rapport Adversarial

```markdown
## Adversarial Report - [Feature]

### Summary
[Overall assessment: PASS/CONDITIONAL/FAIL]

### Critical Issues
1. **[Title]** (Severity: HIGH/MEDIUM/LOW)
   - **Problem:** [description]
   - **Location:** `file:line`
   - **Impact:** [what could happen]
   - **Fix:** [suggested solution]

### Edge Cases Found
1. **[Case]**
   - **Scenario:** [description]
   - **Current behavior:** [what happens]
   - **Expected behavior:** [what should happen]
   - **Fix:** [how to fix]

### Performance Concerns
1. **[Issue]**
   - **Problem:** [description]
   - **Impact:** [metrics if possible]
   - **Fix:** [suggestion]

### Security Notes
1. **[Note]**
   - **Concern:** [description]
   - **Severity:** [HIGH/MEDIUM/LOW]
   - **Fix:** [recommendation]

### Missing Tests
- [ ] Test for [scenario]
- [ ] Test for [edge case]
- [ ] Test for [error path]

### Recommendations
1. [Suggestion 1]
2. [Suggestion 2]

### Final Verdict
**[PASS]** - Ready to merge
**[CONDITIONAL]** - Fix critical issues first
**[FAIL]** - Major rework needed
```

---

## Intégration avec --parallel

```bash
# Adversarial avec parallel automatique
/implement --predator --adversarial "Build payment system"

# Équivalent à:
/implement --predator --parallel=2
# wt-1: Implementation standard
# wt-2: Review adversarial complet
```

### Stratégie Parallel Adversarial

| Mode | wt-1 (Implement) | wt-2 (Adversarial) |
|------|------------------|--------------------|
| `--epct` | Explore+Plan+Code+Test | Challenge chaque phase |
| `--builder` | Design+Implement+Test | Review design + challenge code |
| `--predator` | Workflow complet | Adversarial review à chaque étape |

---

## Messages Types

### Début du challenge

```markdown
## 🔍 Adversarial Review

Je vais challenger le travail de l'agent précédent.

**Checklist:**
- ✅ Functional completeness
- ✅ Error handling
- ✅ Performance
- ✅ Security
- ✅ UX edge cases
- ✅ Code quality

Commençons...
```

### Question challenge

```markdown
### ❓ Challenge: [Sujet]

L'implémentation actuelle ne gère pas le cas suivant:

**Scénario:** [description]
**Comportement actuel:** [ce qui se passe]
**Attendu:** [ce qui devrait se passer]

**Proposition de fix:**
[comment corriger]

**Thoughts?**
```

### Réponse au challenge

```markdown
### ✅ Response to Challenge

**Accepté:** [ce qui est accepté]
**Rejeté:** [ce qui n'est pas accepté] - [raison]
**Alternative:** [autre approche si applicable]

**Modifications:**
- `file:line` - [changement]
```

---

## Configuration

```json
{
  "adversarial": {
    "enabled": true,
    "autoActivate": {
      "criticalCode": true,
      "productionNear": true,
      "predatorParallel2": true
    },
    "checklist": {
      "functional": true,
      "errors": true,
      "performance": true,
      "security": true,
      "ux": true,
      "codeQuality": true
    },
    "strictness": "medium"  // low | medium | high
  }
}
```

---

## Exemples

### Exemple 1: Auth system

```bash
/implement --builder --tech=nextjs --adversarial "Add JWT authentication"

# Agent A implémente:
# - Login form
# - JWT generation
# - Protected routes

# Agent B challenge:
# ❓ Que se passe-t-il si le token expire pendant une requête ?
# ❓ Que se passe-t-il si l'utilisateur est supprimé mais le token est valide ?
# ❓ Y a-t-il une protection contre les bruteforce ?
# ❓ Les tokens sont-ils révoqués ?
```

### Exemple 2: Payment processing

```bash
/implement --epct --adversarial "Add Stripe checkout"

# Agent B challenge:
# ❓ Idempotency des paiements ?
# ❓ Gestion des webhooks Stripe (retry, ordre) ?
# ❓ Que se passe-titre si Stripe est down ?
# ❓ Gestion des refunds ?
# ❓ Validation des montants (entiers vs décimaux) ?
```

---

## Version

**Version**: 1.0.0
**Last Updated**: 2025-02-02
