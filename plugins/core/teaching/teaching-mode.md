# Teaching Mode - Educational Content Generation

`★ Insight ─────────────────────────────────────`
**Teaching Mode** : Génère des explications pédagogiques multi-niveaux pour faciliter l'apprentissage.
**Diagrammes ASCII** : Crée des représentations visuelles du code et de l'architecture.
**Adaptation** : Junior (débutant), Mid-level (pratique), Senior (technique).`─────────────────────────────────────────────────`

---

## Overview

Le mode Teaching génère du contenu éducatif à partir du codebase et des concepts techniques.

```bash
/teach "Explain JWT authentication"
/teach --level=junior "How does React Server Components work?"
/teach --diagram "Show the payment flow architecture"
/teach --format=html "Create a presentation about state management"
```

---

## Niveaux d'Explication

### Junior (Débutant)

**Public:** Débutants, nouveaux sur le projet
**Style:** Simple, analogies, pas de jargon

```markdown
## JWT Authentication Explained

### What is it?
Think of JWT like a **ticket** you get at a movie theater.

When you buy a ticket (login), the theater stamp it with their special seal.
Then, when you want to watch the movie (access a page), you just show your ticket.
The theater doesn't need to check their database - they just verify the stamp is real.

### How it works here:
1. **Login** → You enter email/password
2. **Token created** → Server creates a "ticket" with your user ID
3. **Token stored** → Browser saves it (like keeping your ticket safe)
4. **Next request** → Browser sends the token
5. **Token verified** → Server checks the stamp is genuine
```

### Mid-Level (Pratique)

**Public:** Développeurs avec 1-3 ans d'expérience
**Style:** Code examples, patterns, best practices

```markdown
## JWT Authentication in This Codebase

### Implementation Overview
```typescript
// src/lib/auth.ts
export async function login(email: string, password: string) {
  const user = await db.user.findUnique({ where: { email }})
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new AuthError("Invalid credentials")
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return { token, user }
}
```

### Key Patterns:
- **Password verification**: Never store plain passwords
- **Token expiration**: 7 days balances security + UX
- **Environment variable**: Secret never in code

### Common Gotchas:
❌ Don't store sensitive data in JWT payload (visible to anyone)
✅ Store only non-sensitive identifiers (userId, role)
```

### Senior (Technique)

**Public:** Développeurs expérimentés, architects
**Style:** Deep dive, trade-offs, performance, security

```markdown
## JWT Authentication - Architecture Analysis

### Token Structure
```
Header: {"alg":"HS256","typ":"JWT"}
Payload: {"userId":"123","role":"admin","iat":1704067200,"exp":1704672000}
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Security Considerations
1. **Algorithm confusion攻击** - Always specify `algorithm: "HS256"` in verify()
2. **Key rotation** - Implement key versioning for zero-downtime rotation
3. **Token revocation** - Short-lived tokens (15min) + refresh tokens (7 days)
4. **Timing attacks** - Use constant-time comparison for signature verification

### Performance Optimization
- Use asymmetric keys (RS256) if you have microservices (verify without DB call)
- Cache public keys if using RS256
- Store sessions in Redis for immediate revocation

### Trade-offs vs Session-based
| Aspect | JWT | Sessions |
|--------|-----|----------|
| Scalability | ✅ Stateless | ❌ DB lookup |
| Revocation | ❌ Difficult | ✅ Immediate |
| Size | ~500 bytes | ~50 bytes (ID) |
```

---

## Diagrammes ASCII

### Architecture Diagram

```bash
/teach --diagram "Show authentication flow"
```

Génère:

```text
┌─────────────┐                 ┌─────────────┐
│   Client    │                 │   Server    │
└──────┬──────┘                 └──────┬──────┘
       │                               │
       │  1. POST /auth/login          │
       │  {email, password}            │
       ├───────────────────────────────>│
       │                               │
       │                    2. Verify DB │
       │                    3. Gen JWT   │
       │                               │
       │  4. {token, user}             │
       │<───────────────────────────────┤
       │                               │
       │  5. Store token               │
       │  (localStorage/cookie)         │
       │                               │
       │  6. GET /api/me               │
       │     Header: Authorization    │
       ├───────────────────────────────>│
       │                               │
       │                    7. Verify JWT │
       │                    8. Return /me│
       │                               │
       │  9. {user}                    │
       │<───────────────────────────────┤
       │                               │
```

### Data Flow Diagram

```bash
/teach --diagram "Show Redux data flow"
```

```text
┌────────────────────────────────────────────────────────────┐
│                         React UI                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Component │─>│  useSelector│─>│   Render   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────┬──────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │    Redux Store        │
              │  ┌─────────────────┐  │
              │  │     State       │  │
              │  └────────┬────────┘  │
              │           │           │
              │  ┌────────▼────────┐  │
              │  │    Reducers     │  │
              │  └────────┬────────┘  │
              │           │           │
              │  ┌────────▼────────┐  │
              │  │    Actions      │  │
              │  └─────────────────┘  │
              └────────────────────────┘
```

### Component Tree

```bash
/teach --diagram "Show auth component structure"
```

```text
src/features/auth/
├── components/
│   ├── LoginForm.tsx
│   │   ├── EmailInput
│   │   ├── PasswordInput
│   │   └── SubmitButton
│   ├── RegisterForm.tsx
│   │   └── ...
│   └── AuthProvider.tsx
│       └── AuthContext
├── hooks/
│   ├── useAuth.ts
│   │   ├── login()
│   │   ├── logout()
│   │   └── register()
│   └── useProtectedRoute.ts
├── services/
│   └── authService.ts
│       ├── login()
│       ├── register()
│       └── refreshToken()
└── types.ts
```

---

## Formats de Sortie

### Markdown (défaut)

```bash
/teach "Explain React hooks"
```

### HTML (présentation)

```bash
/teach --format=html "Create slides about TypeScript"
```

Génère un HTML présentable:

```html
<!DOCTYPE html>
<html>
<head>
  <title>TypeScript Overview</title>
  <style>
    .slide { page-break-after: always; }
    /* ... styles ... */
  </style>
</head>
<body>
  <div class="slide">
    <h1>TypeScript Overview</h1>
    <!-- ... -->
  </div>
</body>
</html>
```

### PDF (via HTML)

```bash
/teach --format=pdf "Generate doc about testing"
```

---

## Templates de Contenu

### Concept Explanation

```markdown
## [Concept Name]

### What is it?
[Simple explanation]

### Why use it?
[Benefits and use cases]

### How does it work?
[Mechanism explanation]

### In this codebase:
[Where it's used, with examples]

### Common pitfalls:
[What to watch out for]
```

### Code Pattern Explanation

```markdown
## [Pattern Name]

### Problem it solves
[Context]

### Implementation
```typescript
[code example]
```

### When to use
[Use cases]

### When NOT to use
[Anti-patterns]
```

### Architecture Overview

```markdown
## [System/Module] Architecture

### High-level view
[Diagram]

### Key components
1. **[Component 1]** - [Purpose]
2. **[Component 2]** - [Purpose]

### Data flow
[Explanation + diagram]

### Decisions made
- [Choice 1] → [Reason]
- [Choice 2] → [Reason]
```

---

## Intégration avec /explore

```bash
# Exploration + Teaching
/explore --mode=deep "How does payment work?"
# Génère exploration.md

/teach --from=.claude/.smite/explore-deep.md
# Transforme l'exploration en contenu pédagogique
```

---

## Configuration

```json
{
  "teaching": {
    "defaultLevel": "mid",
    "includeDiagrams": true,
    "includeExamples": true,
    "includePitfalls": true,
    "outputFormat": "markdown"
  }
}
```

---

## Exemples Complets

### Exemple 1: Expliquer un concept

```bash
/teach --level=junior "What are React Server Components?"
```

Génère une explication niveau junior avec analogies.

### Exemple 2: Documenter l'architecture

```bash
/teach --diagram --level=senior "Document the microservices architecture"
```

Génère:
- Diagramme ASCII de l'architecture
- Explication technique des choix
- Trade-offs et considérations

### Exemple 3: Créer une présentation

```bash
/teach --format=html --level=mid "Create presentation about the auth system"
```

Génère un HTML présentable comme slides.

---

## Version

**Version**: 1.0.0
**Last Updated**: 2025-02-02
