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
       1️⃣ Google Shopping Search
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
      products = json?.data?.products?.slice(0, 15) || [];
    }

    /* ===========================
       2️⃣ Fallback (if API fails)
    ============================ */

    if (!res.ok || products.length === 0) {
      const dummyRes = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          product
        )}`
      );

      if (dummyRes.ok) {
        const dummyJson = await dummyRes.json();
        products = dummyJson?.products?.slice(0, 15) || [];
      }
    }

    /* ===========================
       3️⃣ Normalize Data Properly
    ============================ */

    const normalized = products.map((item: any) => ({
      source: res.ok ? "Google Shopping" : "Structured Store",

      title: item.product_title || item.title || "Unknown",

      price: Number(
        item.offer?.primary?.extracted_price ||
          item.offer?.extracted_price ||
          (item.offer?.price
            ? item.offer.price.replace(/[^0-9.]/g, "")
            : null) ||
          item.price ||
          0
      ),

      rating:
        Number(item.product_rating) ||
        Number(item.rating) ||
        0,

      reviews:
        Number(item.product_num_reviews) ||
        Number(item.reviews) ||
        Number(item.stock) ||
        0,

      image: item.product_photo || item.thumbnail || null,

      url: item.product_url || "#",
    }));

    /* ===========================
       4️⃣ Remove Junk / Accessories
    ============================ */

    const bannedWords = [
      "case",
      "cover",
      "charger",
      "cable",
      "adapter",
      "protector",
      "stand",
      "holder",
    ];

    const filtered = normalized.filter((item) => {
      const title = item.title.toLowerCase();
      return !bannedWords.some((word) =>
        title.includes(word)
      );
    });

    /* ===========================
       5️⃣ Smart Value Score
    ============================ */

    const enhanced = filtered.map((item) => {
      const reviewWeight = Math.log(item.reviews + 1);

      const valueScore =
        item.price > 0
          ? (item.rating * reviewWeight) / item.price
          : 0;

      return {
        ...item,
        valueScore: Number(valueScore.toFixed(3)),
      };
    });

    enhanced.sort(
      (a, b) => b.valueScore - a.valueScore
    );

    /* ===========================
       6️⃣ Final Response
    ============================ */

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
