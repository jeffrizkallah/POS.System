# Cart

**File:** `src/components/pos/Cart.tsx`
**Last updated:** 2026-03-01

---

## Purpose

The right-side panel of the POS layout. Displays the current order's line items, running totals (subtotal, 5% UAE VAT, grand total), and the "Complete Sale" checkout button. Reads entirely from `useCart()` context — it holds no local state of its own.

---

## Exported Functions / Components

| Export | Signature | Description |
|--------|-----------|-------------|
| `Cart` (default) | `() => JSX.Element` | Renders the order sidebar with items, totals, and checkout |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `motion`, `AnimatePresence` | `framer-motion` | Animated clear button entrance and total value changes |
| `ShoppingCart`, `Trash2` | `lucide-react` | Icons for empty state and clear button |
| `Button` | `@/components/ui/button` | Checkout button |
| `Separator` | `@/components/ui/separator` | Visual dividers |
| `ScrollArea` | `@/components/ui/scroll-area` | Scrollable cart items area |
| `CartItemComponent` | `./CartItem` | Renders each individual cart line item |
| `useCart` | `@/hooks/useCart` | Provides all cart data and actions |
| `formatCurrency` | `@/lib/utils` | Formats numbers as `AED X.XX` |

---

## State & Side Effects

No local state. All values (`items`, `orderNumber`, `subtotal`, `taxAmount`, `totalAmount`, `itemCount`) are consumed from `useCart()` context.

Actions consumed: `clearCart`, `openCheckout`.

---

## How It Works

1. Reads cart state from `useCart()`.
2. If cart is empty (`items.length === 0`), renders an empty-state with a faded shopping cart icon.
3. If items are present, shows a "Clear" button (animated entrance via `motion.button`).
4. The `<ScrollArea>` renders each cart item using `CartItemComponent` with `AnimatePresence mode="popLayout"` for smooth add/remove animations.
5. The footer shows subtotal, VAT (5%), and total — each numeric value is wrapped in `<motion.span key={value}>` so it scales briefly when updated.
6. The "Complete Sale" button calls `openCheckout()` and is disabled while the cart is empty.
