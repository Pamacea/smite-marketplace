# Pattern: Rust Async Refactor

## Context
Refactor blocking Rust code to use async/await with proper error handling. Use when migrating blocking code to async or when working with I/O-heavy operations.

## Before
```rust
pub fn get_user(id: u32) -> User {
    let conn = db::connect().unwrap();
    let user = conn.query_user(id).unwrap();
    user
}

pub fn create_user(name: String, email: String) -> User {
    let conn = db::connect().unwrap();
    conn.insert_user(&name, &email).unwrap();
    // Potential panic if insert fails
    conn.get_user_by_email(&email).unwrap()
}
```

## After
```rust
pub async fn get_user(id: u32) -> Result<User, DbError> {
    let mut conn = db::connect().await?;
    let user = conn.query_user(id).await?;
    Ok(user)
}

pub async fn create_user(name: String, email: String) -> Result<User, DbError> {
    let mut conn = db::connect().await?;
    conn.insert_user(&name, &email).await?;
    conn.get_user_by_email(&email).await
}
```

## Steps

### 1. Update Function Signatures
Change blocking functions to async:
```rust
// Before
fn function_name(args) -> ReturnType

// After
async fn function_name(args) -> Result<ReturnType, Error>
```

### 2. Replace Error Handling
Replace `.unwrap()` calls with proper error propagation:
```rust
// Before
let value = potentially_failing_call().unwrap();

// After
let value = potentially_failing_call().await?;
```

### 3. Add .await to Async Calls
Mark async calls:
```rust
// Before
let result = some_async_function();

// After
let result = some_async_function().await?;
```

### 4. Update Call Sites
Make callers async as well:
```rust
// Before
let user = get_user(1);

// After (in async context)
let user = get_user(1).await?;
```

### 5. Run Clippy
Check for common issues:
```bash
cargo clippy -- -W clippy::unwrap_used
```

## Benefits

- ✅ **Non-blocking**: Other tasks can run during I/O operations
- ✅ **Proper error handling**: No panics, recoverable errors
- ✅ **Better scalability**: Handle thousands of concurrent requests
- ✅ **Resource efficiency**: Use system resources more effectively

## Trade-offs

- ❌ **Complexity**: Async code is harder to reason about
- ❌ **Debugging**: Stack traces are less clear
- ❌ **Runtime overhead**: Requires async runtime (tokio/async-std)
- ❌ **Not always needed**: Blocking is fine for simple scripts or CLI tools

## When NOT to Use

- Simple CLI tools that don't need concurrency
- CPU-bound operations (async won't help)
- When blocking is actually preferred (simpler code)
- Libraries that don't support async

## Common Pitfalls

### 1. Forgetting .await
```rust
// ❌ Wrong
let user = get_user(1);

// ✅ Correct
let user = get_user(1).await?;
```

### 2. Mixing Blocking and Async
```rust
// ❌ Wrong - blocks the async runtime
let user = blocking_get_user();

// ✅ Correct - use async wrapper
let user = spawn_blocking(|| blocking_get_user()).await?;
```

### 3. Dropping Future Without Awaiting
```rust
// ❌ Wrong - future is dropped, nothing happens
get_user(1);

// ✅ Correct - await the future
get_user(1).await?;
```

## Related Patterns

- [Rust Error Handling](./rust-error-handling.md)
- [Tokio Spawning](./tokio-spawning.md)
- [API Endpoint](./rust-api-endpoint.md)

## Testing Async Code

```rust
#[tokio::test]
async fn test_get_user() {
    let user = get_user(1).await.unwrap();
    assert_eq!(user.id, 1);
}

#[tokio::test]
async fn test_create_user() {
    let user = create_user("Test".to_string(), "test@example.com".to_string())
        .await
        .unwrap();
    assert_eq!(user.name, "Test");
}
```

## Performance Tips

1. **Connection pooling**: Reuse connections across requests
2. **Spawn blocking for CPU work**: Use `tokio::task::spawn_blocking`
3. **Limit concurrency**: Use `tokio::sync::Semaphore` for rate limiting
4. **Timeout operations**: Use `tokio::time::timeout`

## Technology Stack

- **Language**: Rust 1.75+
- **Async Runtime**: Tokio 1.x
- **Database**: sqlx or diesel (async)
- **Error Handling**: anyhow or thiserror

## Version Notes

- Rust 1.39+: async/await stable
- Tokio 1.x: Current stable runtime
- Always pin versions in Cargo.toml

---

*Captured: 2026-02-19 | Source: SMITE team experience*
*Version: 1.0.0 | Category: rust-patterns*
