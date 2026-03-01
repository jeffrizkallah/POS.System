# useCart

**File:** `src/hooks/useCart.tsx`
**Last updated:** 2026-03-01

---

## Plain English

Think of this as the "brain" of the shopping cart. It keeps track of everything in the current order — which items were added, how many of each, and what the totals are. Any component in the app (the product grid, the cart panel, the checkout window) can ask this hook for the cart data or tell it to do something like "add this item" or "clear everything". When the cashier hits Complete Sale, this hook also sends the sale data to the database so it gets saved permanently.

---

## Purpose

Global cart state manager for the POS system. Implements a React Context + `useReducer` pattern to manage the full order lifecycle: adding/removing products, checkout, payment, sale persistence to the database, and receipt display.

---

## Exported Functions / Components

| Export | Signature | Description |
|--------|-----------|-------------|
| `CartProvider` | `({ children: ReactNode }) => JSX.Element` | Wraps the app; provides cart context to all descendants |
| `useCart` | `() => CartContextValue` | Hook to consume cart state and actions from any child component |

### `CartContextValue` shape

| Key | Type | Description |
|-----|------|-------------|
| `items` | `CartItem[]` | Current line items in the cart |
| `orderNumber` | `string` | Auto-generated sale number (format: `SAL-XXXX`) |
| `isCheckoutOpen` | `boolean` | Whether the checkout dialog is open |
| `isReceiptOpen` | `boolean` | Whether the receipt dialog is open |
| `lastCompletedSale` | `Sale \| null` | The most recently completed sale (for the receipt) |
| `subtotal` | `number` | Pre-tax total in AED |
| `taxAmount` | `number` | 5% UAE VAT amount in AED |
| `totalAmount` | `number` | Grand total (subtotal + VAT) in AED |
| `itemCount` | `number` | Total quantity of all items across the cart |
| `addItem(product)` | `(Product) => void` | Add product or increment existing quantity |
| `removeItem(productId)` | `(number) => void` | Remove a line item entirely |
| `updateQuantity(productId, qty)` | `(number, number) => void` | Set quantity; removes item if qty ≤ 0 |
| `clearCart()` | `() => void` | Empties all items |
| `openCheckout()` | `() => void` | Opens the checkout dialog |
| `closeCheckout()` | `() => void` | Closes the checkout dialog |
| `completeSale(paymentMethod)` | `(PaymentMethod) => Promise<void>` | Persists sale to DB then transitions to receipt |
| `closeReceipt()` | `() => void` | Closes the receipt dialog |
| `newOrder()` | `() => void` | Resets cart and generates a fresh order number |

---

## Dependencies

| Dependency | Source | Role |
|------------|--------|------|
| `createContext`, `useContext`, `useReducer`, `useCallback`, `useMemo` | `react` | Core React hooks and context API |
| `CartItem`, `Product`, `PaymentMethod`, `Sale`, `SaleItem` | `@/types` | TypeScript type definitions |
| `calculateCartTotals`, `generateSaleNumber` | `@/lib/utils` | Utility functions for totals and sale number generation |

---

## State & Side Effects

### Reducer state (`CartState`)
```ts
{
  items: CartItem[];
  orderNumber: string;
  isCheckoutOpen: boolean;
  isReceiptOpen: boolean;
  lastCompletedSale: Sale | null;
}
```

### Action types
`ADD_ITEM` | `REMOVE_ITEM` | `UPDATE_QUANTITY` | `CLEAR_CART` | `OPEN_CHECKOUT` | `CLOSE_CHECKOUT` | `COMPLETE_SALE` | `CLOSE_RECEIPT` | `NEW_ORDER`

### Side effects
- **`completeSale`** makes a `POST /api/sales` fetch call before dispatching `COMPLETE_SALE` to the reducer. The DB persist is fire-and-forget (errors are logged but do not block the UI transition).
- `subtotal`, `taxAmount`, `totalAmount`, and `itemCount` are derived values computed via `useMemo` — they are not stored in the reducer.

---

## How It Works

1. `CartProvider` initialises the reducer with empty items and a generated order number.
2. All action creators (`addItem`, `removeItem`, etc.) are wrapped in `useCallback` to maintain stable references.
3. `completeSale` is an async callback that:
   - Recalculates totals from current cart items
   - POSTs the sale data to `/api/sales`
   - Dispatches `COMPLETE_SALE` which moves `lastCompletedSale` into state and opens the receipt
4. `useCart()` throws if called outside `<CartProvider>` to prevent silent bugs.
5. The full context `value` is memoised with `useMemo` to prevent unnecessary re-renders of consumers.
