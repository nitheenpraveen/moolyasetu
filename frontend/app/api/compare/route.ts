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
  const product = searchParams.get("product")?.trim() || "";

  if (!product) {
    return NextResponse.json({
      best_option: null,
      all_results: [],
      message: "No product specified",
    });
  }

  const results: ProductResult[] = [];

  try {
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
        product
      )}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN || ""}`,
        },
      }
    );

    const data = await res.json();
    const firstItem = data?.itemSummaries?.[0] || null;

    results.push({
      site: "eBay",
      title: firstItem?.title || "No product found",
      price: firstItem?.price?.value || "N/A",
      rating: firstItem?.rating || "N/A",
      reviews: firstItem?.reviewCount?.toString() || "N/A",
      link: firstItem?.itemWebUrl || "#",
    });
  } catch (err) {
    results.push({
      site: "eBay",
      title: "No product found",
      price: "N/A",
      rating: "N/A",
      reviews: "N/A",
      link: "#",
      error: "Not available",
    });
  }

  const best_option = results[0] || null;

  return NextResponse.json({ best_option, all_results: results });
}
