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
       1️⃣ Amazon (via RapidAPI)
    ============================ */
    const amazonRes = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(
        product
      )}&country=us&language=en`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "real-time-product-search.p.rapidapi.com",
        },
      }
    );

    console.log("Amazon Response OK:", amazonRes.ok);
    console.log("Amazon Status:", amazonRes.status);

    let amazonData: any = [];

    if (amazonRes.ok) {
      const json = await amazonRes.json();
      amazonData = json?.data?.slice(0, 8) || [];
    }

    /* ===========================
       2️⃣ Fallback (DummyJSON)
    ============================ */
    let fallbackData: any = [];

    if (amazonData.length === 0) {
      const dummyRes = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(
          product
        )}`
      );

      if (dummyRes.ok) {
        const dummyJson = await dummyRes.json();
        fallbackData = dummyJson?.products?.slice(0, 8) || [];
      }
    }

    /* ===========================
       3️⃣ Normalize Format
    ============================ */

    const normalizedAmazon = amazonData.map((item: any) => ({
      source: "Amazon",
      title: item.product_title,
      price: parseFloat(
        item.offer?.price?.replace(/[^0-9.]/g, "") || "0"
      ),
      rating: item.product_rating || 0,
      reviews: item.product_num_reviews || 0,
      image: item.product_photo,
      url: item.product_url,
    }));

    const normalizedFallback = fallbackData.map((item: any) => ({
      source: "Structured Store",
      title: item.title,
      price: item.price,
      rating: item.rating || 0,
      reviews: item.stock || 0,
      image: item.thumbnail,
      url: "#",
    }));

    let allProducts =
      normalizedAmazon.length > 0
        ? normalizedAmazon
        : normalizedFallback;

    /* ===========================
       4️⃣ FILTER OUT ACCESSORIES
       🔥 Makes your platform intelligent
    ============================ */

    const bannedWords = [
      "case",
      "cover",
      "charger",
      "cable",
      "adapter",
      "lamp",
      "battery",
      "protector",
      "stand",
      "holder",
    ];

    allProducts = allProducts.filter((item: any) => {
      const title = item.title.toLowerCase();
      return !bannedWords.some((word) => title.includes(word));
    });

    /* ===========================
       5️⃣ MODEL INTELLIGENCE
       Penalize very old phones
    ============================ */

    function getModelScore(title: string) {
      const t = title.toLowerCase();

      if (t.includes("iphone 15")) return 10;
      if (t.includes("iphone 14")) return 9;
      if (t.includes("iphone 13")) return 8;
      if (t.includes("iphone 12")) return 7;
      if (t.includes("iphone 11")) return 6;
      if (t.includes("iphone x")) return 4;
      if (t.includes("iphone 8")) return 2;
      if (t.includes("iphone 7")) return 1;
      if (t.includes("iphone 6")) return 0;

      return 5;
    }

    /* ===========================
       6️⃣ UNIQUE VALUE ENGINE 🔥
    ============================ */

    const enhancedProducts = allProducts.map((item: any) => {
      const modelScore = getModelScore(item.title);

      const reviewWeight = Math.log(item.reviews + 1);

      const baseValue =
        item.price > 0
          ? (item.rating * reviewWeight) / item.price
          : 0;

      // Final weighted score
      const valueScore =
        baseValue * 0.5 +
        (modelScore / 10) * 0.3 +
        (item.rating / 5) * 0.2;

      return {
        ...item,
        valueScore: Number(valueScore.toFixed(3)),
      };
    });

    /* ===========================
       7️⃣ Sort by Smart Value
    ============================ */

    enhancedProducts.sort(
      (a: any, b: any) => b.valueScore - a.valueScore
    );

    return NextResponse.json({
      query: product,
      totalResults: enhancedProducts.length,
      bestValue: enhancedProducts[0] || null,
      products: enhancedProducts,
    });
  } catch (error) {
    console.error("Comparison API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product comparison." },
      { status: 500 }
    );
  }
}
