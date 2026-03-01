# ProductGrid

**File:** `src/components/pos/ProductGrid.tsx`
**Last updated:** 2026-03-01

---

## Plain English

This is the big grid of product cards in the middle of the screen. It shows all the menu items the cashier can tap to add to the order. There's a search bar at the top so you can quickly find something by name, SKU, or category. When you switch categories using the sidebar, the grid smoothly animates to the new set of items. While the products are loading from the database, it shows grey placeholder cards so the screen doesn't look empty or broken.

---

## Purpose

The center panel of the POS layout. Displays a filterable, searchable grid of products. Accepts a `loading` prop to show skeleton placeholder cards while the initial database fetch is in progress.

---

## Exported Functions / Components

| Export | Signature | Description |
|--------|-----------|-------------|
| `ProductGrid` (default) | `(props: ProductGridProps) => JSX.Element` | Renders the search bar, category header, and product grid |

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `products` | `Product[]` | Yes | Full product list to filter and display |
| `activeCategory` | `ProductCategory` | Yes | The currently selected category from the sidebar |
| `loading` | `boolean` | No (default `false`) | Shows skeleton cards when `true` |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `useState`, `useMemo` | `react` | Search query state and filtered product memoisation |
| `motion`, `AnimatePresence` | `framer-motion` | Grid transition and exit animations |
| `Search`, `X` | `lucide-react` | Search icon and clear button icon |
| `Input` | `@/components/ui/input` | Styled search input |
| `ProductCard` | `./ProductCard` | Renders each individual product |
| `Product`, `ProductCategory` | `@/types` | TypeScript types |
| `useCart` | `@/hooks/useCart` | Provides `addItem` callback passed to each `ProductCard` |

---

## State & Side Effects

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `searchQuery` | `string` | `""` | Current text in the search input |

- `filteredProducts` is a `useMemo` derived value — recomputed when `products`, `activeCategory`, or `searchQuery` change. No side effects.

---

## How It Works

1. **Loading state:** if `loading === true`, renders a 12-item grid of animated skeleton cards (`animate-pulse`) instead of actual products.
2. **Search:** the search input filters `products` (already `isActive === true`) by matching `name`, `sku`, or `category` against the lowercased query string.
3. **Category filter:** if `activeCategory !== "All"`, only products matching that category are shown.
4. Both filters are composed in a single `useMemo` — category filter runs first, then search.
5. The product grid is wrapped in `<AnimatePresence mode="wait">` with a `key` of `activeCategory + searchQuery`, so switching categories or typing triggers a smooth fade+slide transition.
6. If no products match, an empty-state illustration with a `Search` icon is shown.
7. Each `ProductCard` receives `onAddToCart={addItem}` from `useCart()`.
