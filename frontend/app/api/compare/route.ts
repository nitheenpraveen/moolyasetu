import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") || "";

  try {
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(product)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN!}`,
        },
      }
    );

    const data = await res.json();

    // Get top 3 eBay products
    const items = data.itemSummaries?.slice(0, 3) || [];

    const results = items.map((item: any) => ({
      site: "eBay",
      title: item.title,
      price: item.price?.value || "N/A",
      rating: item.rating || "N/A",
      reviews: item.reviewCount || "N/A",
      link: item.itemWebUrl,
    }));

    // Determine best option
    const best_option = results.reduce((best, curr) => {
      const currPrice = parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
      const bestPrice = parseFloat(best?.price.replace(/[^0-9.]/g, "")) || Infinity;
      const currRating = parseFloat(curr.rating) || 0;
      const bestRating = parseFloat(best?.rating) || 0;
      return currPrice < bestPrice || (currPrice === bestPrice && currRating > bestRating)
        ? curr
        : best;
    }, results[0] || null);

    return NextResponse.json({ best_option, all_results: results });
  } catch (err) {
    console.error("eBay API error:", err);
    return NextResponse.json({
      best_option: null,
      all_results: [],
      error: "Failed to fetch eBay results",
    });
  }
}
