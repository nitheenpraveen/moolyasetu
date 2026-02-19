import { NextResponse } from "next/server";

type ProductResult = {
  site: string;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  link: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product")?.trim();

  if (!product) {
    return NextResponse.json({
      all_results: [],
      best_option: null,
      message: "No product specified",
    });
  }

  const EBAY_TOKEN = process.env.EBAY_OAUTH_TOKEN;

  if (!EBAY_TOKEN) {
    return NextResponse.json({
      all_results: [],
      best_option: null,
      message: "Missing eBay production token",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
        product
      )}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${EBAY_TOKEN}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error("eBay API failed");
    }

    const data = await res.json();

    const results: ProductResult[] = (data.itemSummaries || []).map(
      (item: any) => ({
        site: "eBay",
        title: item.title || "No title",
        price: item.price?.value
          ? `${item.price.value} ${item.price.currency || ""}`
          : "N/A",
        rating: "N/A",
        reviews: "N/A",
        link: item.itemWebUrl || "#",
      })
    );

    const best_option = results.reduce<ProductResult | null>((best, curr) => {
      const currPrice =
        parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
      const bestPrice = best
        ? parseFloat(best.price.replace(/[^0-9.]/g, "")) || Infinity
        : Infinity;

      return currPrice < bestPrice ? curr : best;
    }, null);

    return NextResponse.json({ all_results: results, best_option });
  } catch (err) {
    console.error("eBay API error:", err);

    return NextResponse.json({
      all_results: [],
      best_option: null,
      message: "Failed to fetch from eBay",
    });
  }
}
