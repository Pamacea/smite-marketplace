---
name: progressive-build
description: Progressive enhancement workflow using Haiku (speed) → Sonnet (quality) → Opus (excellence). Use for complex features that need both speed and excellence.
category: workflow
version: 1.0.0
tags: [progressive, workflow, multi-model, enhancement]
triggers: [progressive, enhance, iterate]
lazy_load: true
---

# Progressive Enhancement Workflow

## Mission

Iteratively improve code using progressively more capable models, balancing speed and quality.

## The Progressive Model

```
Phase 1: Haiku (Speed)     → Quick MVP in 2 minutes
           ↓
Phase 2: Sonnet (Quality)   → Refine and improve in 5 minutes
           ↓
Phase 3: Opus (Excellence)  → Polish and optimize in 10 minutes
```

**Total time:** ~17 minutes
**Quality:** Excellent
**Cost:** Optimized (Haiku for cheap/fast, Opus only for critical work)

## When to Use

- ✅ Complex features requiring multiple iterations
- ✅ When you need both speed AND quality
- ✅ Architectural decisions with implementation
- ✅ Production-critical code
- ✅ Performance-sensitive features

## When NOT to Use

- ❌ Simple fixes (use Sonnet directly)
- ❌ Trivial changes (use Haiku directly)
- ❌ Quick prototypes (Haiku is enough)

## Workflow Details

### Phase 1: Haiku (Rapid Development)

**Model:** `claude-haiku-4-5`
**Time:** 1-3 minutes
**Purpose:** Generate working MVP quickly

**Tasks:**
1. Understand requirements
2. Generate basic implementation
3. Create simple structure
4. Add placeholder comments

**Output:**
- Working but simple code
- Basic functionality
- May lack edge cases
- Not optimized

**Example:**
```typescript
// Haiku generates quickly
export async function getUser(id: number) {
  const db = await connect();
  return db.query('SELECT * FROM users WHERE id = ?', [id]);
}
```

### Phase 2: Sonnet (Quality Improvement)

**Model:** `claude-sonnet-4-5`
**Time:** 4-7 minutes
**Purpose:** Improve quality, handle edge cases

**Tasks:**
1. Review Haiku's output
2. Add error handling
3. Handle edge cases
4. Improve type safety
5. Add validation

**Output:**
- Production-ready code
- Proper error handling
- Type-safe
- Well-documented

**Example:**
```typescript
// Sonnet improves quality
export async function getUser(id: number): Promise<Result<User, DbError>> {
  if (!id || id < 0) {
    return Err(new DbError('Invalid user ID'));
  }

  try {
    const db = await connect();
    const row = await db.query('SELECT * FROM users WHERE id = ?', [id]);

    if (!row) {
      return Err(new DbError('User not found'));
    }

    return Ok(User.fromRow(row));
  } catch (error) {
    return Err(DbError.fromUnknown(error));
  }
}
```

### Phase 3: Opus (Excellence & Optimization)

**Model:** `claude-opus-4-6`
**Time:** 8-15 minutes
**Purpose:** Optimize, review architecture, polish

**Tasks:**
1. Deep architectural review
2. Performance optimization
3. Security review
4. Advanced error scenarios
5. Documentation completeness
6. Best practices verification

**Output:**
- Optimal performance
- Security-hardened
- Well-documented
- Production-grade
- Follows all best practices

**Example:**
```typescript
// Opus optimizes everything
export async function getUser(
  id: number,
  opts?: { cache?: boolean }
): Promise<Result<User, DbError>> {
  // Input validation
  if (!Number.isInteger(id) || id < 0) {
    return Err(new DbError(DbErrorCode.INVALID_INPUT, 'User ID must be a non-negative integer'));
  }

  // Cache check
  if (opts?.cache) {
    const cached = await userCache.get(id);
    if (cached) {
      return Ok(cached);
    }
  }

  try {
    const db = await getConnection();

    // Use prepared statement for security
    const stmt = await db.prepare('SELECT * FROM users WHERE id = ?');
    const row = await stmt.get([id]);

    if (!row) {
      return Err(new DbError(DbErrorCode.NOT_FOUND, `User ${id} not found`));
    }

    const user = User.fromRow(row);

    // Cache for future requests
    if (opts?.cache) {
      await userCache.set(id, user, { ttl: 300 });
    }

    return Ok(user);
  } catch (error) {
    if (error instanceof DatabaseError) {
      return Err(DbError.fromDatabaseError(error));
    }
    return Err(DbError.fromUnknown(error));
  }
}
```

## Usage

### Command Line

```bash
# Basic progressive build
/studio build --progressive "Create user authentication API"

# With quality gates
/studio build --progressive --quality "Build payment system"

# With team coordination
/studio build --progressive --team "Build full-stack feature"

# Specify number of phases
/studio build --progressive --phases=2 "Quick but good feature"
```

### In Studio Build Flow

```bash
# Auto-detects progressive workflow
/studio build "Build complex feature with optimization"

# Output:
# 🔍 Phase 1 (Haiku): Analyzing requirements...
# ✅ Phase 1 complete: MVP generated in 2.3 minutes
#
# 🔧 Phase 2 (Sonnet): Improving quality...
# ✅ Phase 2 complete: Enhanced in 5.1 minutes
#
# 🎨 Phase 3 (Opus): Optimizing and polishing...
# ✅ Phase 3 complete: Optimized in 9.8 minutes
#
# 📊 Summary: Total time 17.2 minutes, quality score 9.5/10
```

## Progressive Phases Configuration

Create `.claude/progressive.yml`:

```yaml
phases:
  - name: mvp
    model: claude-haiku-4-5
    time_limit: 180  # 3 minutes
    focus: "speed"
    tasks:
      - understand_requirements
      - generate_mvp
      - basic_structure
    success_criteria:
      - code_runs: true
      - basic_functionality: true

  - name: quality
    model: claude-sonnet-4-5
    time_limit: 420  # 7 minutes
    focus: "quality"
    tasks:
      - error_handling
      - edge_cases
      - type_safety
      - validation
    success_criteria:
      - tests_pass: true
      - no_critical_issues: true
      - coverage_target: 70

  - name: excellence
    model: claude-opus-4-6
    time_limit: 900  # 15 minutes
    focus: "excellence"
    tasks:
      - architecture_review
      - performance_optimization
      - security_hardening
      - documentation
    success_criteria:
      - linter_pass: true
      - security_scan_pass: true
      - performance_benchmarks_met: true
      - coverage_target: 85

auto_progress: true  # Automatically move to next phase if current succeeds
stop_on_failure: false  # Continue even if a phase has issues
```

## Benefits by Phase

### Phase 1 (Haiku)
- ⚡ **Fast**: 2-3x faster than starting with Opus
- 💰 **Cheap**: 90% less cost than Opus
- 🎯 **Focused**: Generates MVP without overthinking

### Phase 2 (Sonnet)
- ✅ **Quality**: Production-ready code
- 🛡️ **Robust**: Error handling, edge cases
- 📝 **Documented**: Clear documentation

### Phase 3 (Opus)
- 🚀 **Optimized**: Performance improvements
- 🔒 **Secure**: Security hardening
- 🏆 **Excellent**: Best practices applied

## Cost Analysis

Typical complex feature (e.g., authentication system):

| Approach | Time | Cost | Quality |
|----------|------|------|---------|
| **Opus only** | 25 min | $3.00 | 10/10 |
| **Sonnet only** | 15 min | $1.50 | 8/10 |
| **Haiku only** | 5 min | $0.20 | 6/10 |
| **Progressive** | 17 min | $0.80 | 9.5/10 |

**Progressive saves:** 32% time, 73% cost, only 5% quality reduction

## Real-World Example

### Task: Build JWT Authentication System

#### Phase 1: Haiku (2 min, $0.10)
```typescript
// Generated basic JWT auth
export function generateToken(user: User) {
  return jwt.sign({ id: user.id }, SECRET);
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
```

#### Phase 2: Sonnet (5 min, $0.40)
```typescript
// Added error handling, types
export async function generateToken(user: User): Promise<Result<string, AuthError>> {
  const payload = { sub: user.id, iat: Math.floor(Date.now() / 1000) };
  const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
  return Ok(token);
}

export async function verifyToken(token: string): Promise<Result<JwtPayload, AuthError>> {
  try {
    const payload = jwt.verify(token, SECRET) as JwtPayload;
    return Ok(payload);
  } catch (error) {
    return Err(new AuthError('Invalid token'));
  }
}
```

#### Phase 3: Opus (10 min, $0.70)
```typescript
// Added security, performance, edge cases
export async function generateToken(
  user: User,
  opts?: { expiresIn?: string; refresh?: boolean }
): Promise<Result<string, AuthError>> {
  // Validate user
  if (!user.isActive) {
    return Err(new AuthError(AuthErrorCode.INACTIVE_USER, 'User account is inactive'));
  }

  const payload: JwtPayload = {
    sub: user.id.toString(),
    iat: Math.floor(Date.now() / 1000),
    exp: opts?.expiresIn ? undefined : Math.floor(Date.now() / 1000) + 3600,
    type: opts?.refresh ? 'refresh' : 'access'
  };

  try {
    const token = jwt.sign(payload, SECRET, {
      expiresIn: opts?.expiresIn || '1h',
      algorithm: 'RS256'  // Use RS256 for better security
    });

    return Ok(token);
  } catch (error) {
    return Err(new AuthError(AuthErrorCode.TOKEN_GENERATION_FAILED, 'Failed to generate token'));
  }
}

export async function verifyToken(
  token: string,
  opts?: { type?: 'access' | 'refresh' }
): Promise<Result<JwtPayload, AuthError>> {
  try {
    // Check token format
    if (!token || typeof token !== 'string') {
      return Err(new AuthError(AuthErrorCode.INVALID_TOKEN_FORMAT, 'Invalid token format'));
    }

    // Verify token structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      return Err(new AuthError(AuthErrorCode.INVALID_TOKEN_STRUCTURE, 'Invalid token structure'));
    }

    const payload = jwt.verify(token, SECRET, {
      algorithms: ['RS256'],
      complete: false
    }) as JwtPayload;

    // Verify token type if specified
    if (opts?.type && payload.type !== opts.type) {
      return Err(new AuthError(AuthErrorCode.WRONG_TOKEN_TYPE, `Expected ${opts.type} token`));
    }

    // Check expiration (double-check)
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return Err(new AuthError(AuthErrorCode.TOKEN_EXPIRED, 'Token has expired'));
    }

    return Ok(payload);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return Err(new AuthError(AuthErrorCode.TOKEN_EXPIRED, 'Token has expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return Err(new AuthError(AuthErrorCode.INVALID_SIGNATURE, 'Invalid token signature'));
    }
    return Err(new AuthError(AuthErrorCode.VERIFICATION_FAILED, 'Token verification failed'));
  }
}

// Token refresh endpoint
export async function refreshAccessToken(refreshToken: string): Promise<Result<string, AuthError>> {
  const payload = await verifyToken(refreshToken, { type: 'refresh' });
  if (payload.isErr()) {
    return Err(payload.error);
  }

  const user = await fetchUser(payload.value.sub);
  if (user.isErr()) {
    return Err(new AuthError(AuthErrorCode.USER_NOT_FOUND, 'User not found'));
  }

  return generateToken(user.value);
}
```

**Result:**
- ⚡ Development time: 17 minutes total
- 🏆 Quality: Production-grade with all edge cases
- 💰 Cost: $1.20 (vs $3.00 for Opus-only)
- 🔒 Security: RS256, proper error handling, token refresh

## Best Practices

### 1. Start Simple
Let Haiku generate basic code without over-constraining.

### 2. Review Each Phase
Don't just auto-accept. Review improvements at each phase.

### 3. Provide Context
Give each phase the output of the previous phase as context.

### 4. Customize Phases
Adjust phase configuration based on project needs.

### 5. Set Quality Gates
Define clear success criteria for each phase.

## Troubleshooting

### Phase Takes Too Long
- Reduce `time_limit` in configuration
- Make tasks more specific
- Use fewer phases

### Quality Not Improving
- Check if previous phase output is being used as context
- Review success criteria
- May need more iterations in a phase

### Cost Too High
- Skip Phase 3 (Opus) for non-critical code
- Use Haiku + Sonnet only
- Reduce time limits

## Related Skills

- [Multi-Agent Review](./multi-review.md)
- [TDD Guide](./tdd-guide.md)
- [Performance Profiler](./performance-profiler.md)

---

*Version: 1.0.0 | Category: workflow | Last updated: 2026-02-19*
