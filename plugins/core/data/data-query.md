# Data Query via CLI

`★ Insight ─────────────────────────────────────`
**Direct DB access** : Claude peut interroger directement la base de données du projet pour analyse.
**Read-only par défaut** : Protection contre les modifications accidentelles.
**Auto-détection** : Détecte automatiquement le type de base (Prisma, Supabase, PostgreSQL, etc.).`─────────────────────────────────────────────────`

---

## Overview

Permettre à Claude Code d'interroger la base de données du projet directement depuis le terminal.

```bash
# Requête directe
/data query "SELECT COUNT(*) FROM users WHERE created_at > '2024-01-01'"

# Analyses prédéfinies
/data analyze schema              # Structure de la DB
/data analyze performance         # Requêtes lentes
/data analyze duplicates          # Doublons
/data analyze orphaned            # Enregistrements orphelins
```

---

## Auto-Détection du Type de DB

### Ordre de détection

```
1. Prisma
   ├── Fichier: prisma/schema.prisma
   └── Commande: npx prisma db execute

2. Supabase
   ├── Fichier: supabase/config.toml
   └── Variable: SUPABASE_URL

3. PostgreSQL direct
   ├── Fichier: database.sql ou migrations/
   └── Variable: DATABASE_URL

4. MongoDB
   ├── Fichier: mongoose connection ou .env
   └── Variable: MONGODB_URI

5. SQLite
   ├── Fichier: *.db ou *.sqlite
   └── Détection automatique
```

### Message de détection

```markdown
## 🔌 Database Detected

**Type:** Prisma (PostgreSQL)
**Host:** localhost:5432
**Database:** myapp_dev
**Schemas:** public

**Connection:** ✅ Read-only mode active

Ready for queries.
```

---

## Commandes

### /data query

Exécute une requête SQL en read-only:

```bash
/data query "SELECT * FROM users LIMIT 10"
/data query "SELECT COUNT(*), status FROM users GROUP BY status"
```

**Sécurité:**
- Par défaut: READ-ONLY
- Flag `--write` pour autoriser les écritures (confirmation demandée)
- Timeout configurable (défaut: 30s)
- Limite de résultats (défaut: 100)

**Format de sortie:**

```markdown
## Query Results

**Query:** SELECT COUNT(*), status FROM users GROUP BY status

| count | status |
|-------|--------|
| 1234  | active |
| 456   | inactive |
| 78    | pending |

**Total:** 3 rows
**Duration:** 45ms
```

### /data analyze

Analyses prédéfinies:

#### schema

```bash
/data analyze schema
```

Sortie:
```markdown
## Database Schema

**Tables:** 12

### users
| Column | Type | Nullable | Key |
|--------|------|----------|-----|
| id | UUID | NO | PK |
| email | VARCHAR(255) | NO | UK |
| created_at | TIMESTAMPTZ | NO | |
| updated_at | TIMESTAMPTZ | YES | |

**Relations:**
- users → posts (1:N)
- users → sessions (1:N)
```

#### performance

```bash
/data analyze performance
```

Sortie:
```markdown
## Performance Analysis

### Slow Queries (>1s)
1. `SELECT * FROM posts WHERE author_id = ?` - 2.3s
   - **Issue:** Missing index on `posts.author_id`
   - **Fix:** CREATE INDEX idx_posts_author ON posts(author_id)

### Table Sizes
| Table | Rows | Size |
|-------|------|------|
| posts | 1.2M | 4.5GB |
| users | 50K | 12MB |

### Recommendations
- Add index on posts.author_id
- Partition posts table by created_at
```

#### duplicates

```bash
/data analyze duplicates users email
```

Sortie:
```markdown
## Duplicate Analysis: users.email

**Duplicates found:** 23

| email | count | ids |
|-------|-------|-----|
| test@example.com | 3 | 1, 45, 89 |
| ... | ... | ... |

**Action:** /data cleanup duplicates users email --dry-run
```

#### orphaned

```bash
/data analyze orphaned posts user_id
```

Sortie:
```markdown
## Orphaned Records: posts.user_id

**Orphans found:** 156

Posts referencing non-existent users.

**Action:** /data cleanup orphaned posts user_id --dry-run
```

---

## Handlers par Type de DB

### Prisma Handler

```bash
# Détection
cat prisma/schema.prisma

# Exécution
npx prisma db execute --stdin < query.sql

# Schema
npx prisma db pull  # ou lecture du schema
```

### Supabase Handler

```bash
# Détection
cat supabase/config.toml
# ou
echo $SUPABASE_URL

# Exécution via psql
psql "$SUPABASE_URL" -c "$QUERY"
```

### PostgreSQL Handler

```bash
# Détection
echo $DATABASE_URL | postgresql://

# Exécution
psql "$DATABASE_URL" -c "$QUERY"
```

### MongoDB Handler

```bash
# Détection
echo $MONGODB_URI | mongodb://

# Exécution
mongosh "$MONGODB_URI" --eval "$QUERY"
```

---

## Configuration

```json
{
  "data": {
    "enabled": true,
    "readOnly": true,
    "timeout": 30000,
    "maxResults": 100,
    "autoDetect": [
      "prisma",
      "supabase",
      "postgresql",
      "mongodb",
      "sqlite"
    ]
  }
}
```

### Variables d'environnement

```bash
# PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Supabase
SUPABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

# MongoDB
MONGODB_URI=mongodb://localhost:27017/myapp
```

---

## Sécurité

### Protections

1. **Read-only par défaut** - Les requêtes de modification nécessitent `--write`
2. **Timeout** - Les requêtes longues sont tuées automatiquement
3. **Limite de résultats** - Pas de dump accidentel de millions de lignes
4. **Confirmation** - Les requêtes WRITE demandent confirmation

### Prompt de confirmation

```markdown
## ⚠️ WRITE Query Confirmation

**Query:** DELETE FROM users WHERE id = '123'

**Type:** WRITE
**Impact:** 1 row will be deleted

**Confirm?** (type 'yes' to proceed)
```

---

## Exemples d'Utilisation

### Audit de données

```bash
# Compter les utilisateurs par statut
/data query "SELECT status, COUNT(*) FROM users GROUP BY status"

# Trouver les utilisateurs sans email
/data query "SELECT id, name FROM users WHERE email IS NULL"

# Vérifier les doublons
/data analyze duplicates users email
```

### Debug

```bash
# Trouver les enregistrements récents
/data query "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20"

# Vérifier une relation spécifique
/data query "SELECT * FROM orders WHERE user_id = '123'"

# Analyser une table
/data analyze schema orders
```

### Maintenance

```bash
# Nettoyer les doublons (dry-run)
/data cleanup duplicates users email --dry-run

# Nettoyer les orphelins (dry-run)
/data cleanup orphaned posts user_id --dry-run

# Exécuter après vérification
/data cleanup duplicates users email
```

---

## Intégration avec les agents

### /explore

```bash
# Explorer les données
/explore "Analyze user signup trends in the database"

# L'agent utilise /data query automatiquement
```

### /implement

```bash
# Implémenter avec analyse de données existantes
/implement --builder "Build user dashboard"
# L'agent analyse la DB pour comprendre les données
```

---

## Version

**Version**: 1.0.0
**Last Updated**: 2025-02-02
