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

    console.log("Search Status:", res.status);

    let products: any[] = [];

    if (res.ok) {
      const json = await res.json();
      products = json?.data?.products?.slice(0, 20) || [];
    }

    /* =============================
       Normalize & Clean Pricing
    ============================== */

    const normalized = products.map((item: any) => {
      let extractedPrice =
        item.offer?.primary?.extracted_price ||
        item.offer?.extracted_price ||
        null;

      // fallback string parsing
      if (!extractedPrice && item.offer?.price) {
        const clean = item.offer.price.replace(
          /[^0-9.]/g,
          ""
        );
        extractedPrice = Number(clean);
      }

      // Ignore unrealistic monthly EMI prices
      if (extractedPrice && extractedPrice < 100) {
        extractedPrice = null;
      }

      return {
        source: "Google Shopping",
        title: item.product_title || "Unknown",
        price: extractedPrice || 0,
        rating: Number(item.product_rating) || 0,
        reviews:
          Number(item.product_num_reviews) || 0,
        image: item.product_photo || null,
        url: item.product_url || "#",
      };
    });

    // Remove products without valid price
    const filtered = normalized.filter(
      (item) => item.price > 0
    );

    /* =============================
       Value Score Engine
    ============================== */

    const enhanced = filtered.map((item) => {
      const reviewWeight = Math.log(
        item.reviews + 1
      );

      const valueScore =
        (item.rating * reviewWeight) /
        item.price;

      return {
        ...item,
        valueScore: Number(valueScore.toFixed(3)),
      };
    });

    enhanced.sort(
      (a, b) => b.valueScore - a.valueScore
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
