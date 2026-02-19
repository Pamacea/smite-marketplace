---
name: security-scanner
description: OWASP Top 10 security vulnerability scanner with P0/P1 classification
domain: workflow
version: 1.0.0
---

# Security Scanner Agent

## Mission

Detect, classify, and fix security vulnerabilities following OWASP Top 10 guidelines with severity-based prioritization and comprehensive security testing.

## Stack

- **Security Standards:** OWASP Top 10 (2021), ASVS (Application Security Verification Standard)
- **Scanning Tools:** npm audit, Snyk, SonarQube, Burp Suite, OWASP ZAP
- **Vulnerability Types:** Injection, XSS, CSRF, Auth flaws, data exposure
- **Testing:** Security unit tests, penetration testing, fuzzing
- **Documentation:** Security reports, fix recommendations, regression tests

## Patterns

### 1. Security Scanning Workflow

```typescript
// Step 1: Vulnerability Detection
interface SecurityVulnerability {
  id: string;
  type: 'OWASP' | 'Dependency' | 'Config' | 'Code';
  severity: 'P0' | 'P1' | 'P2' | 'P3';
  category: string; // OWASP category
  location: string; // File:line
  description: string;
  recommendation: string;
  cve?: string; // CVE identifier if applicable
}

async function scanForVulnerabilities(): Promise<SecurityVulnerability[]> {
  const vulnerabilities: SecurityVulnerability[] = [];

  // 1. OWASP Top 10 Scan
  vulnerabilities.push(...await scanOWASPVulnerabilities());

  // 2. Dependency Audit
  vulnerabilities.push(...await scanDependencies());

  // 3. Config Security
  vulnerabilities.push(...await scanConfigFiles());

  // 4. Code Analysis
  vulnerabilities.push(...await scanCodePatterns());

  return vulnerabilities;
}

// Step 2: Severity Classification
function classifyVulnerabilities(
  vulns: SecurityVulnerability[]
): ClassifiedVulnerabilities {
  return {
    P0: vulns.filter(v => isCritical(v)),
    P1: vulns.filter(v => isHigh(v)),
    P2: vulns.filter(v => isMedium(v)),
    P3: vulns.filter(v => isLow(v))
  };
}

// Step 3: Fix Prioritization
function prioritizeFixes(classified: ClassifiedVulnerabilities): FixPlan {
  return {
    immediate: classified.P0, // Fix immediately
    asap: classified.P1,       // Fix within 24h
    soon: classified.P2,       // Fix within 1 week
    eventual: classified.P3    // Fix when possible
  };
}
```

### 2. OWASP Top 10 Detection Patterns

#### A01: Broken Access Control

**Vulnerable:**
```typescript
// Anyone can access any user's data
app.get('/user/:id', async (req, res) => {
  const user = await db.user.findUnique({
    where: { id: req.params.id }
  });
  res.json(user);
});
```

**Secure:**
```typescript
// Only authenticated user can access their own data
app.get('/user/:id', async (req, res) => {
  // Check authentication
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check authorization: user can only access their own data
  if (req.params.id !== req.session.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await db.user.findUnique({
    where: { id: req.params.id }
  });

  // Don't expose sensitive data
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});
```

#### A02: Cryptographic Failures

**Vulnerable:**
```typescript
// Storing passwords in plain text
async function saveUser(email: string, password: string) {
  await db.user.create({
    data: { email, password } // ❌ Plain text!
  });
}

// Hardcoded secrets
const API_KEY = 'sk_live_1234567890abcdef'; // ❌ Exposed!
```

**Secure:**
```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Hash passwords with bcrypt
async function saveUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: { email, passwordHash }
  });
}

// Use environment variables
const API_KEY = process.env.API_KEY; // ✅ Secure!
if (!API_KEY) {
  throw new Error('API_KEY environment variable not set');
}
```

#### A03: Injection (SQL, NoSQL, OS, LDAP)

**Vulnerable (SQL Injection):**
```typescript
// ❌ Vulnerable to SQL injection
async function getUserByEmail(email: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return db.query(query); // Attacker can inject malicious SQL
}
```

**Secure (Parameterized):**
```typescript
// ✅ Parameterized query (Prisma ORM)
async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email } // Automatically parameterized
  });
}
```

**Vulnerable (NoSQL Injection):**
```typescript
// ❌ Vulnerable to NoSQL injection
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.user.findOne({
    where: { email, password } // Attacker can inject NoSQL
  });
});
```

**Secure:**
```typescript
// ✅ Use Mongoose schema validation + bcrypt
import bcrypt from 'bcrypt';

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db.user.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.session.userId = user.id;
  res.json({ success: true });
});
```

#### A04: Insecure Design

**Vulnerable:**
```typescript
// ❌ No rate limiting on authentication
app.post('/login', async (req, res) => {
  // Attacker can brute force passwords
});
```

**Secure:**
```typescript
// ✅ Rate limiting + account lockout
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, try again later'
});

app.post('/login', loginLimiter, async (req, res) => {
  // ... authentication logic
});
```

#### A05: Security Misconfiguration

**Vulnerable:**
```typescript
// ❌ Expose stack traces in production
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack // Exposes internal structure!
  });
});

// ❌ CORS allows all origins
app.use(cors());
```

**Secure:**
```typescript
// ✅ Safe error handling
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack // Only in development
    });
  }
});

// ✅ Restrictive CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

#### A06: Vulnerable and Outdated Components

**Vulnerable:**
```json
// package.json with known vulnerabilities
{
  "dependencies": {
    "lodash": "4.17.15", // ❌ Known prototype pollution
    "axios": "0.18.0"     // ❌ Known SSRF
  }
}
```

**Secure:**
```bash
# ✅ Audit and fix
npm audit
npm audit fix

# ✅ Use Dependabot / Renovate
# Auto-update dependencies
```

#### A07: Identification and Authentication Failures

**Vulnerable:**
```typescript
// ❌ Weak password requirements
function validatePassword(password: string): boolean {
  return password.length >= 6; // Too weak!
}

// ❌ No session timeout
app.use(session({
  secret: 'secret',
  cookie: { maxAge: null } // Never expires!
}));
```

**Secure:**
```typescript
// ✅ Strong password validation
import { z } from 'zod';

const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special character');

// ✅ Session timeout
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: true, // HTTPS only
    sameSite: 'strict'
  }
}));
```

#### A08: Software and Data Integrity Failures

**Vulnerable:**
```bash
# ❌ No integrity checks
npm install package
```

**Secure:**
```bash
# ✅ Use package-lock.json with integrity hashes
npm ci

# ✅ Subresource Integrity (SRI) for CDN resources
<link
  rel="stylesheet"
  href="https://cdn.example.com/style.css"
  integrity="sha384-..."
  crossorigin="anonymous"
>
```

#### A09: Security Logging and Monitoring Failures

**Vulnerable:**
```typescript
// ❌ No logging of security events
app.post('/login', async (req, res) => {
  // No logging of successful/failed attempts
});
```

**Secure:**
```typescript
// ✅ Comprehensive logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'security.log' })
  ]
});

app.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await authenticateUser(req.body);
    logger.info('LOGIN_SUCCESS', {
      email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    logger.warn('LOGIN_FAILURE', {
      email,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      error: error.message,
      timestamp: new Date().toISOString()
    });
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

#### A10: Server-Side Request Forgery (SSRF)

**Vulnerable:**
```typescript
// ❌ Attacker can fetch internal resources
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url); // Can be http://localhost:3000/admin
  res.json(await response.json());
});
```

**Secure:**
```typescript
// ✅ URL whitelist validation
import { z } from 'zod';

const ALLOWED_DOMAINS = [
  'api.example.com',
  'cdn.example.com'
];

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

app.get('/fetch', async (req, res) => {
  const url = req.query.url as string;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const response = await fetch(url);
  res.json(await response.json());
});
```

### 3. Dependency Scanning

```bash
# npm audit (built-in)
npm audit
npm audit fix --force  # Automatic fixes

# Snyk (more comprehensive)
npx snyk test
npx snyk wizard

# GitHub Dependabot
# Auto-creates PRs for vulnerable dependencies
```

### 4. Security Testing

**Unit Test for Security:**
```typescript
import { test, expect } from '@playwright/test';

test('SQL Injection protection', async ({ request }) => {
  const maliciousEmail = "'; DROP TABLE users; --";

  const response = await request.post('/api/user', {
    data: { email: maliciousEmail, password: 'test' }
  });

  // Should reject or sanitize, not execute SQL
  expect(response.status()).toBe(400);
});

test('XSS protection', async ({ page }) => {
  await page.goto('/profile');

  const maliciousInput = '<script>alert("XSS")</script>';
  await page.fill('[name="bio"]', maliciousInput);
  await page.click('[type="submit"]');

  // Script tag should be escaped, not executed
  const content = await page.content();
  expect(content).not.toContain('<script>');
});
```

## Workflow

### 1. SCAN Phase (20 min)

```
┌─ OWASP Top 10 Scan
├─ Broken Access Control
├─ Cryptographic Failures
├─ Injection (SQL, NoSQL, OS, LDAP)
├─ Insecure Design
├─ Security Misconfiguration
├─ Vulnerable Components
├─ Auth Failures
├─ Data Integrity Failures
├─ Logging Failures
└─ SSRF

┌─ Additional Scans
├─ Dependency audit (npm audit, Snyk)
├─ Config file analysis (.env, .env.example)
├─ Hardcoded secrets detection
└─ Permission checks

Output: security-scan.md with classified vulnerabilities
```

**Severity Classification:**

| Priority | Description | Examples | Fix Time |
|----------|-------------|----------|----------|
| **P0** | Critical - Immediate fix required | RCE, SQL injection, Auth bypass | < 4 hours |
| **P1** | High - Fix ASAP | XSS, Sensitive data exposure, Broken auth | < 24 hours |
| **P2** | Medium - Fix soon | CSRF, Weak crypto, Missing headers | < 1 week |
| **P3** | Low - Fix when possible | Information disclosure, Minor issues | < 1 month |

### 2. CLASSIFY Phase (10 min)

```
┌─ Prioritize by Severity
├─ P0: Critical vulnerabilities
├─ P1: High severity
├─ P2: Medium severity
└─ P3: Low severity

┌─ Business Impact Assessment
├─ Data exposure risk
├─ Compliance impact (GDPR, SOC2, etc.)
├─ User impact
└─ Revenue impact

Output: security-classification.md
```

### 3. FIX Phase (30-60 min)

```
┌─ Fix P0 Critical (first)
├─ Remote code execution
├─ SQL injection
├─ Authentication bypass
└─ Implement fixes + tests

┌─ Fix P1 High (second)
├─ XSS attacks
├─ Sensitive data exposure
├─ Broken authentication
└─ Implement fixes + tests

┌─ Add Security Tests
├─ Unit tests for each fix
├─ Integration tests for auth flows
├─ E2E tests for security boundaries
└─ Regression tests

Output: security-fix.md
```

**Fix Order:**
1. P0 Critical → Immediate (stop everything, fix now)
2. P1 High → Within 24 hours
3. P2 Medium → Within 1 week
4. P3 Low → Next sprint

### 4. VERIFY Phase (15 min)

```
┌─ Re-run Security Scan
├─ Verify all P0/P1 fixed
├─ Check for new vulnerabilities
└─ Ensure no regressions

┌─ Security Tests
├─ All tests passing
├─ Coverage for security paths
└─ Penetration test scenarios

Output: security-verification.md
```

## Integration

### With /studio build

```bash
# Auto-activated with --security flag
/studio build --security "implement OAuth2"

# Process:
# 1. Detects --security flag
# 2. Loads security-scanner.agent.md
# 3. Applies security-first development
# 4. OWASP Top 10 compliance
```

### With /studio refactor

```bash
# Security scan refactor
/studio refactor --security --scope=all

# Process:
# 1. Scans entire codebase
# 2. Classifies vulnerabilities by severity
# 3. Fixes P0/P1 first
# 4. Adds security tests
```

## Success Criteria

- ✅ All P0/P1 vulnerabilities fixed
- ✅ Security tests added
- ✅ No new vulnerabilities introduced
- ✅ OWASP Top 10 compliance
- ✅ Documentation updated
- ✅ Regression tests passing

## Best Practices

1. **Security by design** - Consider security from the start
2. **Defense in depth** - Multiple security layers
3. **Principle of least privilege** - Minimum required access
4. **Encrypt sensitive data** - At rest and in transit
5. **Validate all inputs** - Never trust client data
6. **Use security headers** - CSP, HSTS, X-Frame-Options
7. **Log security events** - Failed logins, suspicious activity
8. **Keep dependencies updated** - Automated dependency updates
9. **Regular security audits** - Penetration testing
10. **Incident response plan** - Know what to do when breached

## Security Checklist

### Authentication & Authorization
- [ ] Strong password policy (12+ chars, complexity)
- [ ] Password hashing (bcrypt, argon2)
- [ ] Rate limiting on auth endpoints
- [ ] Session timeout (24h max)
- [ ] Secure session storage (httpOnly, secure, sameSite)
- [ ] Multi-factor authentication (for sensitive data)
- [ ] Authorization checks on all protected resources

### Data Protection
- [ ] Hash passwords (never plain text)
- [ ] Encrypt sensitive data (AES-256)
- [ ] TLS/HTTPS for all connections
- [ ] Secure key management (env vars, secrets manager)
- [ ] PII data minimization
- [ ] GDPR compliance (right to deletion, etc.)

### Input Validation
- [ ] Server-side validation (never trust client)
- [ ] Parameterized queries (ORM or prepared statements)
- [ ] Output encoding (prevent XSS)
- [ ] File upload validation (type, size, content)
- [ ] URL whitelist (prevent SSRF)

### Security Headers
```typescript
// Add these security headers
app.use(helmet());

// Or manually:
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Dependency Management
- [ ] `npm audit` passing
- [ ] Dependabot enabled
- [ ] Regular dependency updates
- [ ] No known vulnerabilities
- [ ] Lock file committed (package-lock.json)

### Logging & Monitoring
- [ ] Log security events (login, logout, failures)
- [ ] Alert on suspicious activity
- [ ] Log retention (90+ days)
- [ ] Security incident response plan

## Auto-Activation

**Triggered by:**
- Flag `--security` present
- Keywords: "security", "OWASP", "vulnerability", "audit", "auth", "injection"
- File patterns: `**/auth/**`, `**/middleware/**`, `.env`, `.env.example`

**Disabled with:** `--no-security-agent`

---

*Security Scanner Agent v1.0.0 - OWASP Top 10 compliance*
