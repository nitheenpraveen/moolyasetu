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

  const results: ProductResult[] = [];

  try {
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
        product
      )}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN || ""}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    const items = data.itemSummaries || [];

    items.forEach((item: any) => {
      results.push({
        site: "eBay",
        title: item.title,
        price: item.price?.value || "N/A",
        rating: item.seller?.feedbackScore?.toString() || "N/A",
        reviews: item.reviewCount?.toString() || "N/A",
        link: item.itemWebUrl,
      });
    });
  } catch (err) {
    console.error("eBay API error:", err);
    results.push({
      site: "eBay",
      error: "Failed to fetch data",
      price: "N/A",
      title: "No product found",
      rating: "N/A",
      reviews: "N/A",
      link: "#",
    });
  }

  // Determine best option
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
}
