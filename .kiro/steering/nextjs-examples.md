---
inclusion: manual
---

# Next.js 16 Code Examples

## Server vs Client Components

### ❌ Incorrect: Client Component for Static Content

```tsx
'use client'

export default function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### ✅ Correct: Server Component for Static Content

```tsx
export default function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### ✅ Correct: Client Component for Interactivity

```tsx
'use client'

import { useState } from 'react'

export default function InteractiveCounter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

## Data Fetching with Cache Components

### ❌ Incorrect: No Explicit Caching

```tsx
// Without 'use cache', behavior is unpredictable
async function getUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUserData(params.id)
  return <div>{user.name}</div>
}
```

### ✅ Correct: Explicit Caching with 'use cache'

```tsx
'use cache'

async function getUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`)
  return response.json()
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUserData(params.id)
  return <div>{user.name}</div>
}
```

### ✅ Correct: Runtime Data Passed as Props

```tsx
'use cache'

async function CachedUserProfile({ userId, currentTime }: { userId: string, currentTime: string }) {
  const user = await fetch(`/api/users/${userId}`).then(r => r.json())
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Last updated: {currentTime}</p>
    </div>
  )
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const currentTime = new Date().toISOString()
  
  return <CachedUserProfile userId={params.id} currentTime={currentTime} />
}
```

## Fetch API Caching Patterns

### ✅ Static Data (Default Caching)

```tsx
export default async function StaticDataPage() {
  // Cached by default (force-cache)
  const data = await fetch('https://api.example.com/static-data')
  const result = await data.json()
  
  return <div>{result.title}</div>
}
```

### ✅ Dynamic Data (No Caching)

```tsx
export default async function DynamicDataPage() {
  // Fresh data on every request
  const data = await fetch('https://api.example.com/dynamic-data', {
    cache: 'no-store'
  })
  const result = await data.json()
  
  return <div>{result.title}</div>
}
```

### ✅ Revalidated Data (Time-based Caching)

```tsx
export default async function RevalidatedDataPage() {
  // Revalidate every 60 seconds
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }
  })
  const result = await data.json()
  
  return <div>{result.title}</div>
}
```

## Component Composition Patterns

### ❌ Incorrect: Server Component in Client Component

```tsx
'use client'

import ServerComponent from './server-component' // This won't work

export default function ClientWrapper() {
  const [state, setState] = useState(false)
  
  return (
    <div>
      <button onClick={() => setState(!state)}>Toggle</button>
      <ServerComponent /> {/* Error: Can't import Server Component */}
    </div>
  )
}
```

### ✅ Correct: Server Component as Children

```tsx
// Client Component
'use client'

import { ReactNode, useState } from 'react'

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [state, setState] = useState(false)
  
  return (
    <div>
      <button onClick={() => setState(!state)}>Toggle</button>
      {children} {/* Server Component passed as children */}
    </div>
  )
}

// Usage in Server Component
export default function Page() {
  return (
    <ClientWrapper>
      <ServerDataComponent /> {/* This Server Component works */}
    </ClientWrapper>
  )
}
```

## Error Handling Patterns

### ✅ Route-Level Error Boundary

```tsx
// app/dashboard/error.tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  )
}
```

### ✅ Loading States with Suspense

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
    </div>
  )
}

// app/dashboard/page.tsx
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading charts...</div>}>
        <SlowChartComponent />
      </Suspense>
      <Suspense fallback={<div>Loading data...</div>}>
        <SlowDataComponent />
      </Suspense>
    </div>
  )
}
```

## TypeScript Integration

### ✅ Proper Component Props Interface

```tsx
interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  showEmail?: boolean
  onUserClick?: (userId: string) => void
}

export default function UserCard({ 
  user, 
  showEmail = true, 
  onUserClick 
}: UserCardProps) {
  return (
    <div 
      className="p-4 border rounded cursor-pointer"
      onClick={() => onUserClick?.(user.id)}
    >
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
    </div>
  )
}
```

### ✅ Server Action with Type Safety

```tsx
// app/lib/actions/user-actions.ts
import { z } from 'zod'

const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
})

export type FormState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const validatedFields = UserSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Create user logic here
    
    return {
      success: true,
      message: 'User created successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create user',
    }
  }
}
```