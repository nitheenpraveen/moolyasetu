import { NextRequest, NextResponse } from "next/server";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json(
      { error: "Product query is required" },
      { status: 400 }
    );
  }

  try {
    /* ===========================
       1️⃣ Google Shopping Search (search-v2)
    ============================ */

    const res = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(
        product
      )}&country=us&language=en`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host":
            "real-time-product-search.p.rapidapi.com",
        },
      }
    );

    console.log("Search Response OK:", res.ok);
    console.log("Search Status:", res.status);

    let products: any[] = [];

    if (res.ok) {
      const json = await res.json();
      products = json?.data?.products?.slice(0, 10) || [];
    }

    /* ===========================
       2️⃣ Fallback if API fails
    ============================ */

    if (!res.ok || products.length === 0) {
      const dummyRes = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          product
        )}`
      );

      if (dummyRes.ok) {
        const dummyJson = await dummyRes.json();
        products = dummyJson?.products?.slice(0, 10) || [];
      }
    }

    /* ===========================
       3️⃣ Normalize Data
    ============================ */

    const normalized = products.map((item: any) => ({
      source: res.ok ? "Google Shopping" : "Structured Store",
      title: item.product_title || item.title,
      price: parseFloat(
        item.offer?.price?.replace(/[^0-9.]/g, "") ||
          item.price ||
          "0"
      ),
      rating: item.product_rating || item.rating || 0,
      reviews:
        item.product_num_reviews || item.stock || 0,
      image: item.product_photo || item.thumbnail,
      url: item.product_url || "#",
    }));

    /* ===========================
       4️⃣ Smart Value Score
    ============================ */

    const enhanced = normalized.map((item: any) => {
      const reviewWeight = Math.log(
        (item.reviews || 0) + 1
      );

      const baseValue =
        item.price > 0
          ? (item.rating * reviewWeight) / item.price
          : 0;

      return {
        ...item,
        valueScore: Number(baseValue.toFixed(3)),
      };
    });

    enhanced.sort(
      (a: any, b: any) =>
        (b.valueScore || 0) - (a.valueScore || 0)
    );

    return NextResponse.json({
      query: product,
      totalResults: enhanced.length,
      bestValue: enhanced[0] || null,
      products: enhanced,
    });
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch product comparison." },
      { status: 500 }
    );
  }
}
