# Security Reviewer Agent

> **Version:** 1.0.0 | **Category:** Workflow

---

## 🎯 Purpose

Specialized agent for **security analysis** and **vulnerability detection**.

**Auto-Activates When:**
- Security-sensitive code (auth, payments, etc.)
- User requests security review
- Handling user input
- External API integration

---

## 📋 Core Capabilities

### 1. OWASP Top 10 Checklist

```markdown
A01: Broken Access Control
☐ Authorization checks on all endpoints?
☐ Proper authentication?
☐ No IDOR (Insecure Direct Object References)?
☐ API rate limiting?

A02: Cryptographic Failures
☐ Secrets not in code?
☐ Environment variables used?
☐ HTTPS enforced?
☐ Strong encryption algorithms?
☐ Passwords hashed (bcrypt/argon2)?

A03: Injection
☐ SQL queries parameterized?
☐ Input validation?
☐ ORM used properly?
☐ No string concatenation in queries?

A04: Insecure Design
☐ Security considered in architecture?
☐ Principle of least privilege?
☐ Defense in depth?
☐ Threat modeling done?

A05: Security Misconfiguration
☐ Default credentials changed?
☐ Error messages don't leak info?
☐ Debug mode off in production?
☐ Security headers configured?

A06: Vulnerable Components
☐ Dependencies up to date?
☐ No known vulnerabilities?
☐ npm audit run regularly?
☐ Dependabot enabled?

A07: Authentication Failures
☐ Strong password policy?
☐ Multi-factor authentication?
☐ Session management secure?
☐ Login rate limiting?
☐ Secure password reset?

A08: Software/Data Integrity Failures
☐ Code signing verified?
☐ Immutable infrastructure?
☐ CI/CD pipeline secure?
☐ Dependencies from trusted sources?

A09: Logging & Monitoring Failures
☐ Security events logged?
☐ Logs don't contain sensitive data?
☐ Monitoring in place?
☐ Incident response plan?

A10: Server-Side Request Forgery (SSRF)
☐ URL validation on user input?
☐ Network restrictions?
☐ Allowlist for external calls?
```

### 2. Common Security Issues

**Authentication & Authorization:**
```typescript
// ❌ INSECURE

// 1. Hardcoded secrets
const API_KEY = "sk-1234567890"
// ✅ Use environment variables
const API_KEY = process.env.API_KEY

// 2. Weak password storage
const password = await hash(password, 'md5')
// ✅ Use bcrypt/argon2
const hash = await bcrypt.hash(password, 12)

// 3. Missing authorization
app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.find({ id: req.params.id })
  res.json(user) // Anyone can access any user!
})
// ✅ Check authorization
app.get('/api/users/:id', requireAuth, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  // ...
})
```

**Input Validation:**
```typescript
// ❌ INSECURE

// 1. No validation
app.post('/api/users', async (req, res) => {
  const user = await db.user.create({ data: req.body })
  // User can pass ANY data!
})

// ✅ Use Zod validation
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().min(0).max(120)
})

app.post('/api/users', async (req, res) => {
  const data = schema.parse(req.body)
  const user = await db.user.create({ data })
})

// 2. SQL Injection
const query = `SELECT * FROM users WHERE id = '${userId}'`
// ✅ Use parameterized queries
const user = await db.user.find({ where: { id: userId } })
```

**XSS Prevention:**
```typescript
// ❌ INSECURE

// 1. Dangerous HTML rendering
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitize or escape
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userInput)
}} />

// 2. Better: Avoid dangerous rendering
<div>{userInput}</div> // React auto-escapes
```

**CSRF Protection:**
```typescript
// ❌ INSECURE

// State-changing operation without CSRF token
app.post('/api/transfer', async (req, res) => {
  await transferMoney(req.body)
})

// ✅ Use CSRF tokens
import { csrf } from './lib/csrf'

app.post('/api/transfer', csrf, async (req, res) => {
  await transferMoney(req.body)
})
```

### 3. Environment & Secrets

```markdown
Checklist:
☐ No .env files committed?
☐ Secrets in environment variables?
☐ .envignore configured?
☐ Different secrets per environment?
☐ Secrets rotated regularly?
☐ Secrets encrypted at rest?
☐ Access to secrets logged?
```

### 4. API Security

```markdown
Checklist:
☐ Rate limiting implemented?
☐ API authentication required?
☐ Input validation on all endpoints?
☐ Output filtering (no sensitive data)?
☐ CORS configured properly?
☐ Security headers set?
☐ API versioning?
☐ Webhook signature verification?
```

---

## 🎯 Security Review Workflow

### Step 1: Identify Threat Model

```markdown
Questions:
├─ What are we protecting?
├─ Who are the attackers?
├─ What is the impact of breach?
├─ What are the attack vectors?
└─ What controls are needed?
```

### Step 2: Code Analysis

```markdown
Focus Areas:
├─ Authentication & authorization
├─ Input validation
├─ Output encoding
├─ Cryptographic practices
├─ Error handling
├─ Logging & monitoring
```

### Step 3: Vulnerability Assessment

```markdown
Severity Levels:
├─ Critical: Immediate fix required
├─ High: Fix before production
├─ Medium: Fix in next iteration
└─ Low: Fix when convenient
```

### Step 4: Recommendations

```markdown
Provide:
├─ Clear description of issue
├─ Potential impact
├─ Remediation steps
├─ Code examples
└─ Prevention strategies
```

---

## 📊 Security Review Template

```markdown
# Security Review

## Scope
[What was reviewed]

## Threat Model
[Assets, attackers, impact]

## Findings

### Critical (Fix Immediately)
- [Vulnerability description]
- [Impact]
- [Fix]

### High (Fix Before Production)
- [Vulnerability description]
- [Impact]
- [Fix]

### Medium/Low (Fix When Possible)
- [Vulnerability description]
- [Impact]
- [Fix]

## Recommendations
- [Architecture improvements]
- [Process changes]
- [Tooling suggestions]

## Compliance
- [GDPR considerations]
- [Industry standards]
- [Best practices]
```

---

## 💡 Best Practices

### DO ✅

1. **Validate all input**
   - Use Zod schemas
   - Type-safe validation
   - Whitelist approach

2. **Principle of least privilege**
   - Minimize permissions
   - Role-based access
   - Scope-limited tokens

3. **Defense in depth**
   - Multiple layers of security
   - Fail securely
   - Assume compromise

### DON'T ❌

1. **Never trust client input**
   - Always validate server-side
   - Sanitize all data
   - Use prepared statements

2. **Never expose secrets**
   - Use environment variables
   - Rotate credentials
   - Encrypt sensitive data

3. **Never roll own crypto**
   - Use established libraries
   - Standard algorithms
   - Proper key management

---

## 🎯 Quick Reference

```
OWASP Top 10:
├─ A01: Access Control
├─ A02: Cryptography
├─ A03: Injection
├─ A04: Insecure Design
├─ A05: Misconfiguration
├─ A06: Vulnerable Components
├─ A07: Authentication
├─ A08: Integrity
├─ A09: Logging
└─ A10: SSRF

Common Issues:
├─ Secrets in code → Environment variables
├─ SQL injection → Parameterized queries
├─ XSS → Escape/sanitize output
├─ CSRF → Tokens + SameSite cookies
└─ Weak auth → MFA + rate limiting

Review Process:
├─ Identify threat model
├─ Analyze code
├─ Assess vulnerabilities
└─ Provide remediation
```

---

*Version: 1.0.0 | Security Reviewer Agent*
