// app/api/compare/route.ts
import { NextResponse } from "next/server";

type ProductResult = {
  site: string;
  title?: string;
  price?: string;
  rating?: string;
  reviews?: string;
  link?: string;
  error?: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product")?.trim();

  if (!product) {
    return NextResponse.json({
      best_option: null,
      all_results: [],
      message: "No product specified",
    });
  }

  const EBAY_TOKEN = process.env.EBAY_OAUTH_TOKEN_SANDBOX;
  if (!EBAY_TOKEN) {
    return NextResponse.json({
      best_option: null,
      all_results: [],
      message: "eBay token not set",
    });
  }

  try {
    // Fetch eBay Sandbox API
    const res = await fetch(
      `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
        product
      )}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${EBAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    const results: ProductResult[] =
      data.itemSummaries?.map((item: any) => ({
        site: "eBay Sandbox",
        title: item.title,
        price: item.price?.value + " " + item.price?.currency || "N/A",
        rating: item.rating?.value?.toString() || "N/A",
        reviews: item.reviewCount?.toString() || "N/A",
        link: item.itemWebUrl,
      })) || [];

    // Determine best option: lowest price first, then highest rating
    const best_option = results.reduce<ProductResult | null>((best, curr) => {
      if (!curr.price || curr.price === "N/A") return best;
      const currPrice = parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
      const bestPrice = parseFloat(best?.price?.replace(/[^0-9.]/g, "")) || Infinity;
      const currRating = parseFloat(curr.rating) || 0;
      const bestRating = parseFloat(best?.rating) || 0;

      if (currPrice < bestPrice || (currPrice === bestPrice && currRating > bestRating)) {
        return curr;
      }
      return best;
    }, null);

    return NextResponse.json({ best_option, all_results: results });
  } catch (err) {
    console.error("eBay API error:", err);
    return NextResponse.json({
      best_option: null,
      all_results: [],
      message: "Error fetching data from eBay",
    });
  }
}
