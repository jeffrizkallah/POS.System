# db-connection

**File:** `src/lib/db/index.ts`
**Last updated:** 2026-03-01

---

## Plain English

This file is the "door" to your Neon database. Any time the app needs to talk to the database, it uses this file to get a connection. The smart part is it only opens the door once — after the first time it connects, it reuses the same connection for all future requests instead of opening a new one every time (which would be slow). If your `DATABASE_URL` is missing from `.env.local`, this file will throw a clear error message telling you exactly what's wrong.

---

## Purpose

Provides a lazily-initialised, singleton Drizzle ORM connection to the Neon serverless PostgreSQL database. Prevents multiple connection instances from being created during the Next.js dev server's hot-reload cycles.

---

## Exported Functions

| Export | Signature | Description |
|--------|-----------|-------------|
| `getDb` | `() => DrizzleInstance` | Returns the singleton DB instance, creating it on first call |
| `schema` | `typeof schema` | Re-exports all Drizzle table definitions for convenience |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `neon` | `@neondatabase/serverless` | Creates the Neon HTTP transport |
| `drizzle` | `drizzle-orm/neon-http` | Wraps the Neon transport in a Drizzle query builder |
| `schema` | `./schema` | All table definitions passed into Drizzle for typed queries |

---

## State & Side Effects

- **Module-level singleton:** `_db` is a module-scoped variable — `null` until first call to `getDb()`.
- **Environment dependency:** reads `process.env.DATABASE_URL` at call time; throws a descriptive `Error` if the variable is missing rather than silently failing.
- No React state or side effects.

---

## How It Works

1. `getDatabaseUrl()` reads `process.env.DATABASE_URL` and throws if it is not set, providing a clear error message pointing the developer to `.env.local`.
2. `getDb()` checks the module-level `_db` variable.
   - If `null`, it creates a new Neon HTTP connection via `neon(url)` and wraps it with `drizzle(sql, { schema })`, then stores the result in `_db`.
   - Returns the cached `_db` on all subsequent calls.
