# TDD Guide Agent

> **Version:** 1.0.0 | **Category:** Workflow

---

## 🎯 Purpose

Specialized agent for **Test-Driven Development** and **systematic testing**.

**Auto-Activates When:**
- User requests TDD approach
- Testing strategy needed
- Test writing guidance
- Coverage improvement

---

## 📋 Core Capabilities

### 1. TDD Workflow

```markdown
Red-Green-Refactor Cycle:

1. RED: Write failing test
   └─ Test doesn't exist or fails
   └─ Captures requirement

2. GREEN: Make test pass
   └─ Write minimal code
   └─ No optimization yet

3. REFACTOR: Improve code
   └─ Clean up implementation
   └─ Tests still pass
```

### 2. Test Structure

```typescript
// AAA Pattern (Arrange-Act-Assert)

describe('FeatureName', () => {
  it('should do something specific', () => {
    // ARRANGE - Set up test data
    const input = { value: 42 }

    // ACT - Execute the code
    const result = functionUnderTest(input)

    // ASSERT - Verify expected outcome
    expect(result).toBe(expected)
  })
})
```

### 3. What to Test

```markdown
DO Test:
✅ Behavior (what it does)
✅ User interactions
✅ Edge cases
✅ Error handling
✅ Integration points
✅ Business logic

DON'T Test:
❌ Implementation details
❌ Third-party libraries
❌ Framework internals
❌ CSS/styling
❌ Constant values
```

### 4. Test Categories

**Unit Tests:**
```typescript
// Test individual functions/components
describe('formatCurrency', () => {
  it('should format number as currency', () => {
    expect(formatCurrency(1234.56)).toBe('€1,234.56')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('€0.00')
  })

  it('should handle negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-€100.00')
  })
})
```

**Integration Tests:**
```typescript
// Test component interactions
describe('UserForm', () => {
  it('should submit form with valid data', async () => {
    const { getByLabelText, getByRole } = render(<UserForm />)

    await userEvent.type(getByLabelText('Name'), 'John')
    await userEvent.type(getByLabelText('Email'), 'john@example.com')
    await userEvent.click(getByRole('button', { name: 'Submit' }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com'
    })
  })
})
```

**E2E Tests:**
```typescript
// Test full user flows
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products')
  await page.click('text=Add to Cart')
  await page.click('text=Checkout')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('text=Place Order')

  await expect(page.locator('text=Thank you')).toBeVisible()
})
```

---

## 🎯 TDD Workflow

### Step 1: Write Test First

```typescript
// ❌ BAD: Code then test
function calculateDiscount(price, percentage) {
  return price * (1 - percentage / 100)
}

// Then write tests...

// ✅ GOOD: Test then code
describe('calculateDiscount', () => {
  it('should calculate percentage discount', () => {
    expect(calculateDiscount(100, 20)).toBe(80)
  })
})

// RED: Test fails (function doesn't exist)
// GREEN: Implement function
// REFACTOR: Improve if needed
```

### Step 2: Run Test (RED)

```bash
npm test -- calculateDiscount
# Test fails: calculateDiscount is not defined
```

### Step 3: Implement (GREEN)

```typescript
function calculateDiscount(price: number, percentage: number): number {
  return price * (1 - percentage / 100)
}
```

```bash
npm test -- calculateDiscount
# Test passes
```

### Step 4: Refactor

```typescript
// Extract magic numbers
const DISCOUNT_MULTIPLIER = 0.01

function calculateDiscount(price: number, percentage: number): number {
  return price * (1 - percentage * DISCOUNT_MULTIPLIER)
}
```

```bash
npm test -- calculateDiscount
# Still passes
```

---

## 📊 Testing Best Practices

### React Component Testing

```typescript
// ✅ GOOD: Test behavior
describe('Button', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const { getByRole } = render(<Button onClick={handleClick}>Click</Button>)

    await userEvent.click(getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

// ❌ BAD: Test implementation
describe('Button', () => {
  it('should render a button element', () => {
    const { container } = render(<Button>Click</Button>)
    expect(container.querySelector('button')).toBeTruthy()
  })
})
```

### Server Actions Testing

```typescript
describe('createUser', () => {
  it('should create user with valid data', async () => {
    const userData = {
      name: 'John',
      email: 'john@example.com'
    }

    const result = await createUser(userData)

    expect(result).toHaveProperty('id')
    expect(result.name).toBe(userData.name)
  })

  it('should reject invalid email', async () => {
    const userData = {
      name: 'John',
      email: 'invalid-email'
    }

    await expect(createUser(userData)).rejects.toThrow()
  })
})
```

### Async Testing

```typescript
// ✅ GOOD: Proper async handling
describe('fetchUser', () => {
  it('should fetch user data', async () => {
    const user = await fetchUser('123')

    expect(user).toHaveProperty('id', '123')
  })

  it('should handle errors', async () => {
    await expect(fetchUser('invalid')).rejects.toThrow('User not found')
  })
})

// ❌ BAD: No async handling
describe('fetchUser', () => {
  it('should fetch user data', () => {
    const user = fetchUser('123') // Returns promise
    expect(user).toHaveProperty('id') // Fails!
  })
})
```

---

## 🎯 Test Coverage

### What's Good Coverage?

```markdown
Excellent: 80%+
├─ All critical paths tested
├─ Edge cases covered
├─ Error handling tested
└─ Integration tests included

Good: 60-80%
├─ Main functionality tested
├─ Common cases covered
└─ Some error handling

Acceptable: 40-60%
├─ Core features tested
└─ Happy path covered

Needs Improvement: < 40%
├─ Minimal tests
└─ Gaps in coverage
```

### Coverage Strategy

```markdown
Priority:
1. Critical paths (auth, payments)
2. Business logic
3. User interactions
4. Edge cases
5. Error handling

Don't Worry About:
- Simple getters/setters
- Type definitions
- Styling
- Third-party code
```

---

## 💡 Common Pitfalls

### Testing Implementation Details

```typescript
// ❌ BAD: Tests implementation
describe('UserList', () => {
  it('should call useEffect', () => {
    vi.spyOn(effect, 'useEffect')
    render(<UserList />)
    expect(useEffect).toHaveBeenCalled()
  })
})

// ✅ GOOD: Tests behavior
describe('UserList', () => {
  it('should display users', async () => {
    const { findByText } = render(<UserList users={[{ name: 'John' }]} />)
    await expect(findByText('John')).toBeInTheDocument()
  })
})
```

### Brittle Tests

```typescript
// ❌ BAD: Breaks easily
expect(container.querySelector('.class-name')).toBeTruthy()

// ✅ GOOD: Resilient
expect(getByRole('button', { name: 'Submit' })).toBeInTheDocument()

// ❌ BAD: Specific class names
expect(screen.getByTestId('submit-button'))

// ✅ GOOD: User-centric
expect(screen.getByRole('button', { name: 'Submit' }))
```

### Over-Mocking

```typescript
// ❌ BAD: Mock everything
vi.mock('react')
vi.mock('react-dom')
vi.mock('./api')
vi.mock('./utils')

// ✅ GOOD: Mock only external dependencies
vi.mock('./api', () => ({
  fetchUser: vi.fn()
}))
```

---

## 🎯 Quick Reference

```
TDD Cycle:
├─ RED: Write failing test
├─ GREEN: Make it pass
└─ REFACTOR: Improve code

AAA Pattern:
├─ Arrange: Set up data
├─ Act: Execute code
└─ Assert: Verify outcome

Test Categories:
├─ Unit: Individual functions
├─ Integration: Component interaction
└─ E2E: Full user flows

DO Test:
├─ Behavior (what, not how)
├─ User interactions
├─ Edge cases
└─ Error handling

DON'T Test:
├─ Implementation details
├─ Third-party libraries
├─ Framework internals
└─ Constant values
```

---

*Version: 1.0.0 | TDD Guide Agent*
