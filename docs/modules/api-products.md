# api-products

**File:** `src/app/api/products/route.ts`
**Last updated:** 2026-03-01

---

## Purpose

Next.js Route Handler that serves product data from the Neon PostgreSQL database. Replaces the previous mock-data implementation so the POS UI always reflects the live product catalogue.

---

## Exported Functions

| Export | Signature | Description |
|--------|-----------|-------------|
| `GET` | `(request: Request) => Promise<NextResponse>` | Returns all active products, optionally filtered by category name |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `NextResponse` | `next/server` | Constructs JSON HTTP responses |
| `getDb` | `@/lib/db` | Returns the lazy-initialised Drizzle + Neon connection |
| `products` | `@/lib/db/schema` | Drizzle table reference for the `products` table |
| `eq` | `drizzle-orm` | Drizzle equality operator used in `WHERE` clauses |

---

## State & Side Effects

- **No React state** — this is a pure server-side route handler.
- **DB read:** executes a `SELECT` against the Neon `products` table on every request.
- Errors are caught and returned as `{ error: "Failed to fetch products" }` with HTTP 500.

---

## How It Works

1. Parse the incoming `Request` URL for the optional `?category=` query parameter.
2. Call `getDb()` to obtain (or reuse) the Drizzle database instance.
3. Query the `products` table with `WHERE is_active = true`.
4. If a non-`"All"` category filter was provided, filter the result set in-memory by `p.category === category`.
5. Return `{ products: result }` as JSON with HTTP 200.
6. Any thrown error is caught, logged to `console.error`, and returned as HTTP 500.
