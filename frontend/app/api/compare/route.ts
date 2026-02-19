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

    let amazonData: any = [];
    if (amazonRes.ok) {
      const json = await amazonRes.json();
      amazonData = json?.data?.slice(0, 5) || [];
    }

    /* ===========================
       2️⃣ Structured Fallback (DummyJSON)
       Used if Amazon fails or empty
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
        fallbackData = dummyJson?.products?.slice(0, 5) || [];
      }
    }

    /* ===========================
       3️⃣ Normalized Unified Format
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

    const allProducts =
      normalizedAmazon.length > 0
        ? normalizedAmazon
        : normalizedFallback;

    /* ===========================
       4️⃣ UNIQUE VALUE ENGINE 🔥
       (This is what makes your site different)
    ============================ */

    const enhancedProducts = allProducts.map((item: any) => {
      const valueScore =
        item.price > 0
          ? (
              (item.rating * Math.log(item.reviews + 1)) /
              item.price
            ).toFixed(3)
          : "0";

      return {
        ...item,
        valueScore: Number(valueScore),
      };
    });

    /* ===========================
       5️⃣ Sort by BEST VALUE
       Not just lowest price!
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
