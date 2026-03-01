import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/products
 * Returns all active products from Neon DB. Optionally filter by category.
 *
 * Query params:
 * - category: string (optional) — filter by category name
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const db = getDb();

    let result;

    if (category && category !== "All") {
      result = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .then((rows) => rows.filter((p) => p.category === category));
    } else {
      result = await db
        .select()
        .from(products)
        .where(eq(products.isActive, true));
    }

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
