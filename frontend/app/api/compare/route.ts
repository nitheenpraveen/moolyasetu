import { NextResponse } from "next/server";

type ProductResult = {
  site: string;
  title: string;
  price: string;
  rating?: string;
  reviews?: string;
  link: string;
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

  // eBay API URL
  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
    product
  )}&limit=5`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN || ""}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    const results: ProductResult[] = (data.itemSummaries || []).map((item: any) => ({
      site: "eBay",
      title: item.title || "No product found",
      price: item.price?.value || "N/A",
      rating: item.rating || "N/A",
      reviews: item.reviewCount?.toString() || "N/A",
      link: item.itemWebUrl || "#",
    }));

    // Determine best option (lowest price, then highest rating)
    const best_option = results.reduce<ProductResult | null>((best, curr) => {
      const currPrice = parseFloat(curr.price) || Infinity;
      const bestPrice = parseFloat(best?.price || "") || Infinity;
      const currRating = parseFloat(curr.rating || "0") || 0;
      const bestRating = parseFloat(best?.rating || "0") || 0;

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
      message: "Failed to fetch from eBay",
    });
  }
}
