# db-seed

**File:** `src/lib/db/seed.ts`
**Last updated:** 2026-03-01

---

## Plain English

When you first set up the database, it's completely empty — no products, no categories, nothing. This script is the "first-time setup" tool that fills it up with all 36 menu items and 6 categories so the POS has something to show. You run it once from the terminal with `npm run db:seed`. It's smart enough that if you accidentally run it again, it won't create duplicates — it just skips anything that already exists.

---

## Purpose

One-time CLI script that populates the Neon database with the initial 6 categories and 36 F&B products. Safe to run multiple times — uses `onConflictDoNothing` to avoid duplicate inserts.

Run via: `npm run db:seed`

---

## Exported Functions

None — this is a standalone script (no exports). It runs `seed()` immediately on execution via the final `seed().catch(...)` call.

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `readFileSync`, `resolve` | `fs`, `path` | Manually parse `.env.local` since `tsx` doesn't auto-load it |
| `neon` | `@neondatabase/serverless` | Creates the Neon HTTP transport |
| `drizzle` | `drizzle-orm/neon-http` | Wraps transport in a Drizzle instance |
| `products`, `categories` | `./schema` | Drizzle table references for inserts |

---

## State & Side Effects

- **Env loading:** manually reads and parses `.env.local` line-by-line at script startup, setting any missing `process.env` keys. This is required because `tsx` (used for `npm run db:seed`) does not automatically load `.env.local`.
- **DB writes:**
  - Inserts 6 category rows into `categories` — conflict target: `name`
  - Inserts 36 product rows into `products` — conflict target: `sku`
- Exits with code `1` on failure, `0` on success.

---

## How It Works

1. Read `.env.local` from the project root and parse each `KEY=VALUE` line into `process.env`.
2. Validate `DATABASE_URL` is set; exit with an error message if not.
3. Create a Neon + Drizzle connection (not using `getDb()` singleton — this is a one-shot script).
4. Insert all categories using `onConflictDoNothing({ target: categories.name })`.
5. Insert all products using `onConflictDoNothing({ target: products.sku })`.
6. Log success and exit.

---

## Seed Data Summary

| Category | SKU Prefix | Count |
|----------|------------|-------|
| Hot Drinks | `HD-` | 6 |
| Cold Drinks | `CD-` | 6 |
| Appetizers | `AP-` | 6 |
| Main Course | `MC-` | 6 |
| Desserts | `DS-` | 6 |
| Sides | `SD-` | 6 |
| **Total** | | **36 products** |
