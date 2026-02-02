---
name: data
description: Direct database query and analysis from CLI
version: 1.0.0
---

# Data Skill - Database Query via CLI

## Mission

Enable Claude Code to query and analyze project databases directly from the terminal.

## Core Principles

- **Read-only first** - Protect against accidental modifications
- **Auto-detection** - Detect DB type automatically (Prisma, Supabase, PostgreSQL, etc.)
- **Timeout protected** - Prevent long-running queries
- **Result limited** - No accidental dumps of millions of rows

## Usage

```bash
# Direct query (read-only)
/data query "SELECT COUNT(*) FROM users"

# Predefined analyses
/data analyze schema          # Show database structure
/data analyze performance     # Find slow queries
/data analyze duplicates      # Find duplicate records
/data analyze orphaned        # Find orphaned records

# Cleanup (with confirmation)
/data cleanup duplicates users email --dry-run
/data cleanup orphaned posts user_id
```

## Auto-Detection Order

1. **Prisma** - `prisma/schema.prisma`
2. **Supabase** - `supabase/config.toml` or `SUPABASE_URL`
3. **PostgreSQL** - `DATABASE_URL` with `postgresql://`
4. **MongoDB** - `MONGODB_URI` with `mongodb://`
5. **SQLite** - `*.db` or `*.sqlite` files

## Commands

### query

Execute SQL in read-only mode:

```bash
/data query "SELECT * FROM users LIMIT 10"
/data query "SELECT status, COUNT(*) FROM users GROUP BY status"
```

**Flags:**
- `--write` - Allow modifications (requires confirmation)
- `--timeout=N` - Timeout in seconds (default: 30)
- `--limit=N` - Max results (default: 100)

### analyze

Predefined analyses:

```bash
/data analyze schema       # Tables, columns, relations
/data analyze performance  # Slow queries, table sizes
/data analyze duplicates TABLE COLUMN  # Find duplicates
/data analyze orphaned TABLE COLUMN    # Find orphaned records
```

### cleanup

Clean up data (with confirmation):

```bash
/data cleanup duplicates TABLE COLUMN [--dry-run]
/data cleanup orphaned TABLE COLUMN [--dry-run]
```

## Output Format

```markdown
## Query Results

**Query:** SELECT COUNT(*), status FROM users GROUP BY status

| count | status  |
|-------|---------|
| 1234  | active  |
| 456   | inactive|

**Total:** 2 rows
**Duration:** 45ms
```

## Security

- **Read-only by default** - Modifications need `--write` + confirmation
- **Timeout** - Queries killed after 30s
- **Result limit** - Max 100 rows by default
- **Confirmation prompt** for all WRITE operations

## Configuration

```json
{
  "data": {
    "enabled": true,
    "readOnly": true,
    "timeout": 30000,
    "maxResults": 100
  }
}
```

## Integration

Works with `/explore` for data analysis and `/implement` for understanding existing data structures.

---

*Data Skill v1.0.0*
