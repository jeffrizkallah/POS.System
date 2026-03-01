"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "./ProductCard";
import { Product, ProductCategory } from "@/types";
import { useCart } from "@/hooks/useCart";

interface ProductGridProps {
  products: Product[];
  activeCategory: ProductCategory;
  loading?: boolean;
}

export default function ProductGrid({
  products,
  activeCategory,
  loading = false,
}: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.isActive);

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 bg-white border-border rounded-xl text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category title + count */}
      <div className="px-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          {activeCategory === "All" ? "All Items" : activeCategory}
        </h2>
        <span className="text-xs text-muted-foreground">
          {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-border overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3"
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addItem}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-muted-foreground"
              >
                <Search className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">No products found</p>
                <p className="text-xs mt-1">
                  Try a different search or category
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
