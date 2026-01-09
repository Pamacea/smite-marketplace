# 🔀 SMITE ROUTER - Intelligent Agent Selection Guide

## 🎯 Concept

**SMITE Router** est l'agent qui me permet de choisir **automatiquement** le bon agent smite avec les bons paramètres, sans que tu aies à le spécifier manuellement.

---

## 🔄 Comment ça marche (Auto-Orchestration)

### ❌ AVANT (Manuel)

```typescript
// Tu: "Créer une page profile"

Moi (devine):
- "Je vais utiliser smite-constructor..."
- "Mais quel mode ? Next.js ? React ?"
- "Je dois deviner, ou te demander..."

→ TOI DOIS PRÉCISER MANUELLEMENT
```

### ✅ MAINTENANT (Automatique avec smite-router)

```typescript
// Tu: "Créer une page profile"

Moi (intelligent):
1. J'utilise smite-router en PREMIER
2. Il détecte: Next.js + TypeScript
3. Il me suggère: "smite-constructor --tech=nextjs"
4. J'utilise la suggestion automatiquement

→ PAS BESOIN DE PRÉCISER !
```

---

## 🎭 Workflow avec Claude Code 2.1.0 Hooks

### 1. Hook PreToolUse (Déclenche avant chaque agent)

Quand je vais utiliser un agent smite, le hook se déclenche automatiquement :

```
Moi: "Je vais lancer smite-constructor"
  ↓
Hook PreToolUse: "STOP ! Utilise smite-router d'abord !"
  ↓
Moi: "Ah oui, bon plan..."
  ↓
J'utilise smite-router
  ↓
Router: "C'est du Next.js projet → utilise smite-constructor --tech=nextjs"
  ↓
Moi: "Parfait !"
  ↓
Je lance smite-constructor avec les bons paramètres
```

### 2. Workflow Complet

```
USER: "Implémenter une fonctionnalité"
  ↓
HOOK: "Utilise smite-router d'abord"
  ↓
SMITE-ROUTER: Analyse le projet
  ↓
ROUTER: "C'est du Next.js → utilise : smite-constructor --tech=nextjs --feature=..."
  ↓
MOI: "Bien reçu, je lance smite-constructor avec les bons flags"
  ↓
AGENT: Implémente avec le bon mode automatique
```

---

## 📊 Détection Automatique

### Langages Détectés

| Fichier | Langage |
|--------|---------|
| `tsconfig.json` | TypeScript |
| `Cargo.toml` | Rust |
| `pyproject.toml` | Python |
| `go.mod` | Go |
| `Gemfile` | Ruby |

### Frameworks Détectés

| Langage | Framework | Fiches clés |
|---------|-----------|-------------|
| TypeScript | Next.js | `next.config.js`, `package.json` (next) |
| TypeScript | React | `vite.config.ts`, `package.json` (react) |
| TypeScript | Angular | `angular.json` |
| Rust | Axum | `Cargo.toml` (axum, tower) |
| Rust | Actix | `Cargo.toml` (actix-web) |
| Python | FastAPI | `pyproject.toml` (fastapi, uvicorn) |

### Types de Projets

| Structure | Type |
|----------|------|
| `app/` | Next.js App Router |
| `pages/` | Next.js Pages Router |
| `src/components/` | Component Library |
| `migrations/` | Full-stack Application |

---

## 🚀 Exemples d'Utilisation

### Exemple 1: Projet Next.js

```bash
# Contexte du projet
$ ls
next.config.js
tsconfig.json
app/
package.json

# Tu demandes
USER: "Ajoute une page profile"

# Ce que je fais automatiquement
1. Hook: "Utilise smite-router"
2. Router analyse: "Next.js détecté"
3. Router suggère: "smite-constructor --tech=nextjs"
4. Je lance: Task("smite-constructor:constructor.task", prompt="Ajoute une page profile en mode Next.js")

→ RÉSULTAT: Page créée avec le bon mode automatiquement !
```

### Exemple 2: Projet Rust

```bash
# Contexte du projet
$ cat Cargo.toml
[dependencies]
axum = "0.7"
tokio = { version = "1.0", features = ["full"] }

# Tu demandes
USER: "Crée un endpoint API"

# Ce que je fais automatiquement
1. Hook: "Utilise smite-router"
2. Router analyse: "Rust + Axum détecté"
3. Router suggère: "smite-constructor --tech=rust"
4. Je lance: Task("smite-constructor:constructor.task", prompt="Crée un endpoint API en mode Rust")

→ RÉSULTAT: Endpoint créé avec Axum automatiquement !
```

### Exemple 3: Multi-Langage

```bash
# Tu travailles sur du TSX le matin
USER: "Ajoute un bouton"

→ Router détecte: "Next.js + TypeScript"
→ Je lance: smite-constructor --tech=nextjs

# L'après-midi, tu passes à du Rust
USER: "Ajoute une fonction"

→ Router détecte: "Rust + Axum"
→ Je lance: smite-constructor --tech=rust

→ Le router s'adapte AUTOMATIQUEMENT à chaque langage !
```

---

## 🎯 Avantages

### ✅ Pour TOI (Utilisateur)
- **Zéro configuration** - Pas besoin de préciser le langage/framework
- **Zéro flags manuels** - `--tech=nextjs` appliqué automatiquement
- **Context-aware** - S'adapte à ton projet en temps réel
- **Multi-langage**** Passe du TypeScript au Rust sans rien changer

### ✅ Pour MOI (Claude)
- **Choix intelligents** - Je choisis le bon agent avec les bons paramètres
- **Moins d'erreurs** - Pas de mauvais mode (ex: utiliser mode Next.js sur un projet Rust)
- **Plus rapide** - Pas besoin de te demander des précisions
- **Meilleure UX** - Expérience fluide sans questions répétitives

---

## 🔧 Configuration

### Activer smite-router

```bash
# Installer le plugin
/plugin install smite-router@smite-marketplace

# C'est tout ! Les hooks font le reste
```

### Hooks Configurés

Le système utilise déjà les hooks Claude Code 2.1.0 dans `.claude/settings.local.json` :

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Task.*smite-|Skill.*smite-",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "CRITICAL: Before invoking any smite agent, use smite-router FIRST..."
          }
        ]
      }
    ]
  }
}
```

**Résultat :** Chaque fois que je vais lancer un agent smite, je suis automatiquement guidé pour utiliser smite-router en premier !

---

## 📊 Comparaison

| Scénario | Sans Router | Avec Router |
|----------|-------------|-------------|
| Projet Next.js | Tu dois dire "en Next.js" | Détection auto ✅ |
| Projet Rust | Tu dois dire "en Rust" | Détection auto ✅ |
| Multi-projet | Tu dois préciser à chaque fois | Adaptation auto ✅ |
| Oublier le mode | Erreur (mauvais mode) | Router corrige ✅ |

---

## 🎓 Comment l'utiliser

### Option 1: Laisser les hooks faire le travail (RECOMMANDÉ)

**Fait rien !** Les hooks Claude Code 2.1.0 font tout automatiquement :

```bash
# Tu demandes simplement
"Implémenter une fonctionnalité"

# Le hook va me guider automatiquement vers smite-router
# Le router va détecter ton projet automatiquement
# Je vais lancer le bon agent avec les bons paramètres
```

### Option 2: Utiliser smite-router manuellement

```bash
# Si tu veux forcer l'analyse
*start-s_router

# Le routeur analyse et recommande :
"🔀 Projet Next.js détecté"
"Agent suggéré: smite-constructor --tech=nextjs"
"Lancer ? [Y]es"
```

---

## 🛠️ Scripts

### detect-framework.ts

```typescript
// Usage
node plugins/smite-router/dist/detect-framework.js [project_dir]

// Output
{
  "language": "typescript",
  "framework": "nextjs",
  "projectType": "Next.js App Router",
  "confidence": 100
}
```

### Compiler les scripts

```bash
cd plugins/smite-router
npm run build
```

---

## 📈 Roadmap

### v1.0 (Actuelle)
- ✅ Détection automatique du langage
- ✅ Détection automatique du framework
- ✅ Suggestions d'agents avec flags
- ✅ Hook PreToolUse pour guidage automatique

### v2.0 (Future)
- ⏳ Détection de la structure de projet
- ⏳ Historique des agents utilisés
- ⏳ Auto-exécution (sans confirmation)
- ⏳ Apprentissage des préférences utilisateur

---

## 🎯 Résumé

**OUI, maintenant j'utilise smite-router automatiquement !**

Quand tu me demandes d'implémenter quelque chose :
1. Le hook me rappelle d'utiliser smite-router
2. Le router analyse ton projet automatiquement
3. Je choisis le bon agent avec les bons flags
4. Tout se fait automatiquement pour toi !

**Plus besoin de :**
- ❌ "En Next.js s'il te plaît"
- ❌ "Utilise le mode Rust"
- ❌ "Quel langage c'est ?"

**Juste :**
- ✅ "Fais le" → Le système s'adapte tout seul !

---

**🔀 SMITE ROUTER** - *L'intelligence artificielle au service du zéro configuration*
