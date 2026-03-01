# db-schema

**File:** `src/lib/db/schema.ts`
**Last updated:** 2026-03-01

---

## Plain English

This file is the blueprint for your database. It defines exactly what tables exist and what columns each table has — like designing the columns in a spreadsheet before you start filling it in. There are 4 tables: one for categories (like "Hot Drinks"), one for products (like "Espresso — AED 12"), one for sale transactions (the receipt header), and one for the individual items within each sale. Drizzle reads this file to know how to talk to your database in a type-safe way.

---

## Purpose

Defines the full Drizzle ORM schema for the QuickPOS Neon PostgreSQL database. This is the single source of truth for all table structures; Drizzle Kit reads this file to generate and apply migrations.

---

## Exported Tables

| Export | Table Name | Description |
|--------|------------|-------------|
| `categories` | `categories` | Product categories (e.g. Hot Drinks, Main Course) |
| `products` | `products` | Individual sellable items with price, SKU, and stock |
| `sales` | `sales` | Sale transaction header — totals, payment method, status |
| `saleItems` | `sale_items` | Line items linking a sale to its products |

---

## Table Definitions

### `categories`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `name` | `varchar(100)` | Unique, not null |
| `description` | `varchar(500)` | Optional |
| `imageUrl` | `varchar(500)` | Optional |
| `isActive` | `boolean` | Default `true` |
| `createdAt` | `timestamp` | Default `now()` |

### `products`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `name` | `varchar(255)` | Not null |
| `price` | `decimal(10,2)` | Not null |
| `sku` | `varchar(50)` | Unique |
| `category` | `varchar(100)` | Not null |
| `stockQuantity` | `integer` | Default `0` |
| `imageUrl` | `varchar(500)` | Optional |
| `isActive` | `boolean` | Default `true` |
| `createdAt` | `timestamp` | Default `now()` |
| `updatedAt` | `timestamp` | Default `now()` |

### `sales`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `saleNumber` | `varchar(20)` | Unique, not null |
| `subtotal` | `decimal(10,2)` | Not null |
| `taxAmount` | `decimal(10,2)` | Default `"0"` |
| `totalAmount` | `decimal(10,2)` | Not null |
| `paymentMethod` | `varchar(50)` | Default `"cash"` |
| `status` | `varchar(20)` | Default `"completed"` |
| `createdAt` | `timestamp` | Default `now()` |

### `sale_items`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | `serial` | Primary key |
| `saleId` | `integer` | FK → `sales.id` (cascade delete) |
| `productId` | `integer` | FK → `products.id` |
| `productName` | `varchar(255)` | Not null (denormalised for receipt history) |
| `quantity` | `integer` | Not null |
| `unitPrice` | `decimal(10,2)` | Not null |
| `subtotal` | `decimal(10,2)` | Not null |
| `createdAt` | `timestamp` | Default `now()` |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `pgTable`, `serial`, `varchar`, `decimal`, `integer`, `boolean`, `timestamp` | `drizzle-orm/pg-core` | Column and table definition helpers |

---

## State & Side Effects

No runtime state. This file is a pure schema declaration consumed by Drizzle ORM and Drizzle Kit at build/migration time.
