# Module Documentation

This folder contains documentation for every module in the QuickPOS system.
Each file follows a standard schema: Plain English summary, Purpose, Exported Functions, Dependencies, State & Side Effects, and How It Works.

---

## Folder Structure

```
docs/modules/
├── api/                  # Next.js API route handlers
│   ├── api-products.md   # GET /api/products
│   └── api-sales.md      # GET & POST /api/sales
│
├── database/             # Database layer (Drizzle ORM + Neon)
│   ├── db-connection.md  # Singleton DB connection
│   ├── db-schema.md      # Table definitions (categories, products, sales, sale_items)
│   └── db-seed.md        # CLI seed script (npm run db:seed)
│
├── components/           # React UI components
│   ├── Cart.md           # Right-side order panel
│   └── ProductGrid.md    # Center product grid with search and filters
│
├── hooks/                # React hooks and context providers
│   └── useCart.md        # Global cart state (Context + useReducer)
│
└── pages/                # Next.js page components
    └── page.md           # Root POS page (/)
```

---

## Documentation Rules

Every module doc must include:

| Section | What to write |
|---------|--------------|
| **Plain English** | A jargon-free, 2–4 sentence explanation anyone can understand |
| **Purpose** | Technical summary of what the module does |
| **Exported Functions / Components** | Each export with signature and one-line description |
| **Dependencies** | All internal and external imports |
| **State & Side Effects** | React state, reducers, fetch calls, DB writes |
| **How It Works** | Step-by-step internal logic flow |

> The agent rule enforcing this is at `.cursor/rules/module-documentation.mdc`
