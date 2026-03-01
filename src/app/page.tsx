"use client";

import { useState, useEffect } from "react";
import { CartProvider } from "@/hooks/useCart";
import Header from "@/components/pos/Header";
import CategorySidebar from "@/components/pos/CategorySidebar";
import ProductGrid from "@/components/pos/ProductGrid";
import Cart from "@/components/pos/Cart";
import CheckoutDialog from "@/components/pos/CheckoutDialog";
import ReceiptDialog from "@/components/pos/ReceiptDialog";
import { Product, ProductCategory } from "@/types";

export default function POSPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const normalized: Product[] = data.products.map(
          (p: Product & { price: string | number; stockQuantity: string | number }) => ({
            ...p,
            price: typeof p.price === "string" ? parseFloat(p.price) : p.price,
            stockQuantity:
              typeof p.stockQuantity === "string"
                ? parseInt(p.stockQuantity)
                : p.stockQuantity,
          })
        );
        setProducts(normalized);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <CartProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-background pos-no-select">
        {/* Top Header Bar */}
        <Header />

        {/* Main Content: Sidebar + Products + Cart */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Category Sidebar */}
          <CategorySidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Center: Product Grid with Search */}
          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            loading={loading}
          />

          {/* Right: Cart Panel */}
          <Cart />
        </div>

        {/* Modals */}
        <CheckoutDialog />
        <ReceiptDialog />
      </div>
    </CartProvider>
  );
}
