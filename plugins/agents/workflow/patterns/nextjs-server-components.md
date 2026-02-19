# Pattern: Next.js Server Components

## Context
Migrate React Client Components to Next.js 16+ Server Components (RSC) for better performance and simpler data fetching.

## Before
```typescript
// app/users/page.tsx (Client Component)
'use client';

import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## After
```typescript
// app/users/page.tsx (Server Component)
import db from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Steps

### 1. Remove 'use client' Directive
Server components are default, just remove the directive:
```typescript
// Before
'use client';

// After
// (remove directive - server component by default)
```

### 2. Move Data Fetching to Server
Replace `useEffect` + `fetch` with direct async calls:
```typescript
// Before
useEffect(() => {
  fetch('/api/users').then(res => res.json())...
}, []);

// After
const users = await db.user.findMany();
```

### 3. Remove useState for Server Data
Server data doesn't need state management:
```typescript
// Before
const [users, setUsers] = useState([]);

// After
const users = await db.user.findMany();
```

### 4. Extract Interactive Parts
Keep client components only for interactivity:
```typescript
// app/users/page.tsx (Server Component)
import { UserForm } from './user-form'; // 'use client'

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      <UserForm /> {/* Client component for form */}
    </div>
  );
}
```

### 5. Use Server Actions for Mutations
Replace API routes with server actions:
```typescript
// app/actions/users.ts
'use server';

export async function createUser(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  await db.user.create({ data: { name } });
  revalidatePath('/users');
}

// app/users/user-form.tsx (Client Component)
'use client';

import { createUser } from '../actions/users';

export function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Benefits

- ✅ **Performance**: No client-side JavaScript for rendering
- ✅ **SEO**: HTML is rendered on server
- ✅ **Simpler data fetching**: Direct database access, no API layer
- ✅ **Smaller bundle size**: Less JavaScript sent to client
- ✅ **Automatic code splitting**: Components load independently

## Trade-offs

- ❌ **No hooks**: Can't use useState, useEffect, etc.
- ❌ **No browser APIs**: Can't access window, localStorage, etc.
- ❌ **Props must be serializable**: Can't pass functions
- ❌ **Learning curve**: Different mental model

## When to Use Server Components

- ✅ Data fetching (always prefer server)
- ✅ Static content generation
- ✅ SEO-critical pages
- ✅ Complex layouts

## When to Use Client Components

- ✅ Event handlers (onClick, onChange)
- ✅ Browser APIs (localStorage, window)
- ✅ React hooks (useState, useEffect)
- ✅ Third-party libraries requiring browser context

## Common Patterns

### 1. Composition Pattern
```typescript
// Server Component
export default async function Page() {
  const data = await fetchData();

  return (
    <div>
      <ServerView data={data} />
      <ClientInteractions id={data.id} />
    </div>
  );
}
```

### 2. Server + Server Action
```typescript
// Server Component
import { deleteUser } from './actions';

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <DeleteButton id={user.id} deleteAction={deleteUser} />
        </div>
      ))}
    </div>
  );
}

// Client Component (for event handler)
'use client';

export function DeleteButton({ id, deleteAction }) {
  return (
    <button
      onClick={async () => {
        await deleteAction(id);
      }}
    >
      Delete
    </button>
  );
}
```

### 3. Streaming with Suspense
```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <UserList />
      </Suspense>
    </div>
  );
}

async function UserList() {
  const users = await db.user.findMany(); // Can be slow
  return users.map(user => <div key={user.id}>{user.name}</div>);
}
```

## Migration Checklist

- [ ] Identify client components that fetch data
- [ ] Remove 'use client' directive
- [ ] Move useEffect + fetch to top-level await
- [ ] Remove useState for server data
- [ ] Extract interactive parts to separate client components
- [ ] Replace API routes with server actions
- [ ] Add error handling with error.tsx
- [ ] Test in development
- [ ] Verify bundle size reduction

## Performance Impact

Typical improvements:
- **Initial page load**: 40-60% faster
- **Time to Interactive**: 30-50% faster
- **Bundle size**: 50-70% reduction
- **SEO**: 100% server-rendered HTML

## Related Patterns

- [Next.js Data Fetching](./nextjs-data-fetching.md)
- [Server Actions](./server-actions.md)
- [Form Validation](./form-validation.md)

## Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **React**: 19+
- **Language**: TypeScript 5+
- **Database**: Prisma (recommended)

## Version Notes

- Next.js 13+: Server Components stable
- Next.js 15+: Server Actions stable
- Always check latest Next.js docs for updates

---

*Captured: 2026-02-19 | Source: SMITE team experience*
*Version: 1.0.0 | Category: nextjs-patterns*
