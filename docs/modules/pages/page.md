# page (POS Root Page)

**File:** `src/app/page.tsx`
**Last updated:** 2026-03-01

---

## Plain English

This is the main screen of the app — the one that loads when you open the POS in a browser. It's in charge of putting everything together: the top bar, the category sidebar on the left, the product grid in the middle, and the cart on the right. When the page first loads, it goes and fetches all the products from the database and passes them to the product grid. While it's loading, the grid shows placeholder cards. It also keeps track of which category the cashier is currently looking at.

---

## Purpose

The root Next.js page (`/`) and entry point for the entire QuickPOS application. Fetches products from the live database API on mount, manages the active category filter, and composes all major layout sections (header, sidebar, product grid, cart, and modal dialogs).

---

## Exported Functions / Components

| Export | Signature | Description |
|--------|-----------|-------------|
| `POSPage` (default) | `() => JSX.Element` | Root page component rendered at `/` |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `useState`, `useEffect` | `react` | Local state for category filter, products list, and loading flag |
| `CartProvider` | `@/hooks/useCart` | Wraps layout to provide global cart context |
| `Header` | `@/components/pos/Header` | Top bar with branding and live clock |
| `CategorySidebar` | `@/components/pos/CategorySidebar` | Left sidebar with animated category filters |
| `ProductGrid` | `@/components/pos/ProductGrid` | Center panel with searchable product grid |
| `Cart` | `@/components/pos/Cart` | Right panel with order summary and checkout button |
| `CheckoutDialog` | `@/components/pos/CheckoutDialog` | Payment method selection modal |
| `ReceiptDialog` | `@/components/pos/ReceiptDialog` | Post-sale receipt modal |
| `Product`, `ProductCategory` | `@/types` | TypeScript types |

---

## State & Side Effects

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `activeCategory` | `ProductCategory` | `"All"` | The currently selected category filter |
| `products` | `Product[]` | `[]` | Products fetched from `/api/products` |
| `loading` | `boolean` | `true` | Tracks whether the initial product fetch is in progress |

### Side effects
- **`useEffect` on mount:** calls `GET /api/products`, normalises the response (converts `price` and `stockQuantity` from Postgres string types to JS numbers), and sets `products` state. Sets `loading = false` in the `finally` block.

---

## How It Works

1. On first render, `useEffect` fires a `fetch("/api/products")` request.
2. The raw DB response has `price` as a string (Postgres `decimal`) and `stockQuantity` as a string; these are parsed to `number` before being stored in state.
3. While loading, `ProductGrid` receives `loading={true}` and renders animated skeleton cards.
4. Once loaded, `products` is passed to `ProductGrid` for rendering.
5. `activeCategory` is managed here and passed down to both `CategorySidebar` (for the active highlight) and `ProductGrid` (for filtering).
6. The entire tree is wrapped in `<CartProvider>` so all child components can access cart state via `useCart()`.
