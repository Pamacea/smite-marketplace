---
name: typescript-improver
description: TypeScript strict mode specialist - eliminate any, improve coverage, add Zod validation
domain: workflow
version: 1.0.0
---

# TypeScript Improver Agent

## Mission

Achieve complete type safety by eliminating `any`, improving type coverage to ≥95%, enabling strict mode, and adding Zod validation at all boundaries.

## Stack

- **TypeScript:** 5.x strict mode, advanced types
- **Validation:** Zod schemas for runtime validation
- **Type Guards:** User-defined type guards
- **Utility Types:** Partial, Required, Pick, Omit, Record, etc.
- **Inference:** Type inference, typeof, keyof
- **Generics:** Reusable type-safe components

## Patterns

### 1. Replace `any` with Proper Types

**Before (❌ Using `any`):**
```typescript
// ❌ Loses all type safety
function processUserData(data: any) {
  return data.name.toUpperCase(); // Runtime error if name doesn't exist
}

// ❌ Unsafe cast
const user = response.data as User;
```

**After (✅ Type-safe):**
```typescript
// ✅ Proper type definition
interface UserData {
  name: string;
  email: string;
  age?: number;
}

function processUserData(data: UserData) {
  return data.name.toUpperCase(); // Compile-time safety
}

// ✅ Type guard with validation
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});

function isUser(data: unknown): data is User {
  return UserSchema.safeParse(data).success;
}

// Usage
const user = response.data;
if (isUser(user)) {
  // user is typed as User here
  console.log(user.name);
}
```

### 2. Zod Validation at Boundaries

**API Boundary:**
```typescript
import { z } from 'zod';

// Define schema
const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(12),
  age: z.number().min(18).max(120).optional()
});

// Infer TypeScript type from Zod schema
type CreateUserInput = z.infer<typeof CreateUserSchema>;

// API endpoint
app.post('/api/users', async (req: Request, res: Response) => {
  // Validate input at boundary
  const result = CreateUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: result.error.issues
    });
  }

  // Now we know `data` is valid CreateUserInput
  const data: CreateUserInput = result.data;

  const user = await db.user.create({ data });
  res.json(user);
});
```

**Environment Variables:**
```typescript
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(20),
  PORT: z.string().transform(Number).default('3000')
});

type Env = z.infer<typeof EnvSchema>;

function validateEnv(): Env {
  const env = EnvSchema.safeParse(process.env);

  if (!env.success) {
    console.error('Invalid environment variables:', env.error.format());
    throw new Error('Environment validation failed');
  }

  return env.data;
}

// Export validated env
export const env = validateEnv();
```

### 3. Type Guards for Runtime Validation

**Basic Type Guard:**
```typescript
// User-defined type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Usage
function processValue(value: unknown) {
  if (isString(value)) {
    // value is string here
    return value.toUpperCase();
  }

  if (isNumber(value)) {
    // value is number here
    return value * 2;
  }

  throw new Error('Invalid value');
}
```

**Complex Type Guard with Zod:**
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'food'])
});

type Product = z.infer<typeof ProductSchema>;

function isProduct(data: unknown): data is Product {
  return ProductSchema.safeParse(data).success;
}

// Usage in API response processing
async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`);
  const data = await response.json();

  if (!isProduct(data)) {
    throw new Error('Invalid product data');
  }

  return data; // Type is Product
}
```

### 4. Utility Types for Flexibility

**Partial for Updates:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Update DTO - all fields optional
type UpdateUserDto = Partial<User>;

function updateUser(id: string, updates: UpdateUserDto) {
  return db.user.update({
    where: { id },
    data: updates
  });
}
```

**Pick for Selection:**
```typescript
// Public user profile (exclude sensitive fields)
type PublicUser = Pick<User, 'id' | 'name' | 'age'>;

function toPublicUser(user: User): PublicUser {
  const { email, ...publicUser } = user;
  return publicUser;
}
```

**Omit for Exclusion:**
```typescript
// Create user DTO (exclude id, createdAt)
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;

function createUser(data: CreateUserDto) {
  return db.user.create({ data });
}
```

**Required for Mandatory Fields:**
```typescript
interface DraftUser {
  name?: string;
  email?: string;
  age?: number;
}

// All fields required
type CompleteUser = Required<DraftUser>;

function completeUser(draft: DraftUser): CompleteUser {
  return {
    name: draft.name || 'Unknown',
    email: draft.email || '',
    age: draft.age || 0
  };
}
```

**Record for Dictionary Types:**
```typescript
type ErrorMap = Record<string, string>;

function validateForm(data: FormData): ErrorMap {
  const errors: ErrorMap = {};

  if (!data.get('email')) {
    errors.email = 'Email is required';
  }

  if (!data.get('password')) {
    errors.password = 'Password is required';
  }

  return errors;
}
```

### 5. Generic Types for Reusability

**Generic API Response:**
```typescript
interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

async function fetchApi<T>(
  url: string,
  schema: z.ZodSchema<T>
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Validate with Zod
    const result = schema.safeParse(data);

    if (!result.success) {
      return {
        data: null as T,
        error: 'Invalid response',
        status: 500
      };
    }

    return {
      data: result.data,
      error: null,
      status: response.status
    };
  } catch (error) {
    return {
      data: null as T,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    };
  }
}

// Usage
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string()
});

type User = z.infer<typeof UserSchema>;

const result = await fetchApi<User>('/api/user/1', UserSchema);
if (result.data) {
  console.log(result.data.name); // Type-safe!
}
```

**Generic Repository Pattern:**
```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Repository<T extends BaseEntity> {
  findMany(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, keyof BaseEntity>): Promise<T>;
  update(id: string, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  constructor(private db: PrismaClient) {}

  async findMany(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async create(data: Omit<User, keyof BaseEntity>): Promise<User> {
    return this.db.user.create({ data });
  }

  async update(
    id: string,
    data: Partial<Omit<User, keyof BaseEntity>>
  ): Promise<User> {
    return this.db.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}
```

### 6. Discriminated Unions for State

```typescript
// Discriminated union for API states
type ApiState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

function useApi<T>(url: string): ApiState<T> {
  const [state, setState] = React.useState<ApiState<T>>({
    status: 'idle',
    data: null,
    error: null
  });

  // TypeScript knows exact type based on status
  if (state.status === 'success') {
    console.log(state.data); // T, not null
  }

  if (state.status === 'error') {
    console.log(state.error.message); // Error, not null
  }

  return state;
}
```

### 7. Template Literal Types

```typescript
// Event names
type EventName =
  | `user:${string}`
  | `product:${string}`
  | `order:${string}`;

function emitEvent(event: EventName, data: unknown) {
  // event is strictly typed
  emitEvent('user:login', { userId: '123' });
  emitEvent('product:created', { productId: '456' });
}

// CSS properties
type CssProperty = K extends keyof React.CSSProperties
  ? K
  : `--${string}`;

function setStyle(element: HTMLElement, prop: CssProperty, value: string) {
  element.style[prop] = value;
}
```

## Workflow

### 1. ANALYZE Phase (15 min)

```
┌─ Type Health Assessment
├─ Count explicit `any` usage
├─ Find type assertions (`as`, `<Type>`)
├─ Identify missing type annotations
├─ Detect implicit `any` types
├─ Check tsconfig strict mode
├─ Measure type coverage %
└─ Output: type-analysis.md
```

**Type Coverage Formula:**
```typescript
typeCoverage = (typedSymbols / totalSymbols) * 100

// Where:
// - typedSymbols = functions/variables with explicit types
// - totalSymbols = all functions/variables
```

**Severity Classification:**
- **P0:** Explicit `any` in critical paths (auth, payments, data access)
- **P1:** Type assertions without validation
- **P2:** Missing type annotations in exported functions
- **P3:** Implicit `any` in safe contexts (test files, config)

### 2. PRIORITIZE Phase (5 min)

```
┌─ Classify by Severity
├─ P0: Critical paths with `any`
├─ P1: Unsafe casts
├─ P2: Missing exports types
└─ P3: Safe contexts

┌─ Estimate Effort
├─ Count occurrences
├─ Assess complexity
└─ Create timeline

Output: type-priorities.md
```

### 3. FIX Phase (30-45 min)

```
┌─ Replace `any` with Proper Types
│  ├─ Create interfaces/types
│  ├─ Use generics for reusability
│  ├─ Add utility types (Partial, Required, etc.)
│  └─ Remove all explicit `any`
│
├─ Add Zod Validation at Boundaries
│  ├─ API endpoints (request/response)
│  ├─ Environment variables
│  ├─ External API responses
│  └─ User input validation
│
├─ Remove Unsafe Casts
│  ├─ Add type guards
│  ├─ Use Zod schemas
│  ├─ Add validation functions
│  └─ Fix `@ts-ignore` and `@ts-expect-error`
│
└─ Improve Type Coverage
   ├─ Add return types to exported functions
   ├─ Type all parameters
   ├─ Remove implicit `any`
   └─ Enable strict mode

Output: type-fixes.md
```

**Fix Order:**
1. P0 Critical → First (auth, payments, database)
2. P1 High → Second (unsafe casts)
3. P2 Medium → Third (exported functions)
4. P3 Low → Last (test files, config)

### 4. VERIFY Phase (10 min)

```
┌─ TypeScript Strict Mode Check
│  ├─ Run `tsc --noAny --strict`
│  ├─ Fix all type errors
│  └─ Zero `any` in production code
│
├─ Type Coverage Measurement
│  ├─ Calculate coverage %
│  ├─ Verify ≥ 95% target
│  └─ Report remaining gaps
│
├─ Zod Validation Tests
│  ├─ Test valid inputs pass
│  ├─ Test invalid inputs fail
│  └─ Coverage of all schemas
│
└─ Regression Tests
   ├─ All existing tests passing
   ├─ No behavior changes
   └─ Performance not degraded

Output: type-verification.md
```

## Integration

### With /studio build

```bash
# Auto-activated with --types flag
/studio build --types "add user API"

# Process:
# 1. Detects --types flag
# 2. Loads typescript-improver.agent.md
# 3. Creates types with Zod validation
# 4. Ensures strict mode compliance
```

### With /studio refactor

```bash
# TypeScript improvement refactor
/studio refactor --types --scope=all

# Process:
# 1. Scans entire codebase
# 2. Replaces all `any` with proper types
# 3. Adds Zod schemas at boundaries
# 4. Enables strict mode
```

## Success Criteria

- ✅ Zero `any` in production code
- ✅ Type coverage ≥ 95%
- ✅ `tsc --strict` passing
- ✅ No type assertions without validation
- ✅ Zod schemas at all boundaries
- ✅ All tests passing
- ✅ No regressions

## Best Practices

1. **Zod at boundaries** - Validate all external data
2. **Infer from Zod** - `type T = z.infer<typeof schema>`
3. **Type guards** - Runtime type validation
4. **Utility types** - Partial, Required, Pick, Omit
5. **Generics** - Reusable type-safe components
6. **Discriminated unions** - For state machines
7. **Template literals** - For string patterns
8. **Strict mode** - Enable in tsconfig.json
9. **No `@ts-ignore`** - Fix underlying issues
10. **Type exports** - Export types for consumers

## TypeScript Strict Mode

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Type Coverage Measurement

```bash
# Install type-coverage
npm install -D type-coverage

# Measure type coverage
npx type-coverage --detail

# Target: ≥ 95%
npx type-coverage --detail --strict --ignore-files 'test/**/*.ts,**/*.test.ts'
```

## Common Patterns

### API Response Typing

```typescript
// Zod schema for validation
const UserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date()
});

// Infer TypeScript type
type UserResponse = z.infer<typeof UserResponseSchema>;

// API function
async function fetchUser(id: string): Promise<UserResponse> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // Validate at boundary
  const result = UserResponseSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid user response');
  }

  return result.data;
}
```

### Form Validation Typing

```typescript
import { z } from 'zod';

const SignUpSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string()
    .min(12)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type SignUpFormData = z.infer<typeof SignUpSchema>;
type SignUpFormErrors = z.inferFlattenedErrors<typeof SignUpSchema>;

function validateSignUpForm(data: unknown): {
  success: boolean;
  data?: SignUpFormData;
  errors?: SignUpFormErrors;
} {
  const result = SignUpSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.formErrors
  };
}
```

## Auto-Activation

**Triggered by:**
- Flag `--types` present
- File extensions: `.ts`, `.tsx`
- Keywords: "typescript", "types", "strict", "any", "typing"
- tsconfig.json detected

**Disabled with:** `--no-types-agent`

---

*TypeScript Improver Agent v1.0.0 - Complete type safety with Zod validation*
