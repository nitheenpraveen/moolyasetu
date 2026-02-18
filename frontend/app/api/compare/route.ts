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
    return NextResponse.json({ all_results: [], best_option: null, message: "No product specified" });
  }

  // eBay Sandbox API URL
  const EBAY_SANDBOX_TOKEN = process.env.EBAY_OAUTH_TOKEN_SANDBOX;
  if (!EBAY_SANDBOX_TOKEN) {
    return NextResponse.json({ all_results: [], best_option: null, message: "Missing eBay sandbox token" });
  }

  const url = `https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(product)}&limit=5`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${EBAY_SANDBOX_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const results: ProductResult[] = (data.itemSummaries || []).map((item: any) => ({
      site: "eBay Sandbox",
      title: item.title || "No title",
      price: item.price?.value ? `₹${item.price.value}` : "N/A",
      rating: "N/A", // eBay Sandbox doesn’t provide ratings in API
      reviews: "N/A",
      link: item.itemWebUrl || "#",
    }));

    // Determine best option (lowest price)
    const best_option = results.reduce<ProductResult | null>((best, curr) => {
      const currPrice = parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
      const bestPrice = best ? parseFloat(best.price.replace(/[^0-9.]/g, "")) || Infinity : Infinity;

      return currPrice < bestPrice ? curr : best;
    }, null);

    return NextResponse.json({ all_results: results, best_option });
  } catch (err) {
    console.error("eBay API error:", err);
    return NextResponse.json({ all_results: [], best_option: null, message: "Failed to fetch from eBay" });
  }
}
