# api-sales

**File:** `src/app/api/sales/route.ts`
**Last updated:** 2026-03-01

---

## Purpose

Next.js Route Handler for creating and retrieving sales records. Persists completed POS transactions (header + line items) to the Neon PostgreSQL database and allows querying recent sales history.

---

## Exported Functions

| Export | Signature | Description |
|--------|-----------|-------------|
| `POST` | `(request: Request) => Promise<NextResponse>` | Creates a new sale record plus its line items in the DB |
| `GET` | `(request: Request) => Promise<NextResponse>` | Returns recent sales ordered by date, newest first |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `NextResponse` | `next/server` | Constructs JSON HTTP responses |
| `getDb` | `@/lib/db` | Returns the lazy-initialised Drizzle + Neon connection |
| `sales`, `saleItems` | `@/lib/db/schema` | Drizzle table references |
| `desc` | `drizzle-orm` | Descending order helper for the GET query |

---

## State & Side Effects

- **No React state** — pure server-side handlers.
- **POST side effect:** inserts one row into `sales` and N rows into `sale_items` (one per cart line item) within the same request.
- **GET side effect:** executes a `SELECT` with `ORDER BY created_at DESC` and an optional `LIMIT`.
- Decimal values (`subtotal`, `taxAmount`, `totalAmount`, `unitPrice`) are cast to `String` before insert because Drizzle's `decimal` column type requires string input.

---

## How It Works

### POST
1. Parse the JSON body: `{ saleNumber, subtotal, taxAmount, totalAmount, paymentMethod, items[] }`.
2. Insert the sale header into the `sales` table using `.returning()` to get the generated `id`.
3. If `items` array is non-empty, insert all line items into `sale_items`, each referencing the new `sale.id`.
4. Return `{ sale: newSale }` with HTTP 201.

### GET
1. Parse `?limit=` query param (defaults to `20`).
2. Query `sales` ordered by `createdAt DESC` with the given limit.
3. Return `{ sales: recentSales }` with HTTP 200.
