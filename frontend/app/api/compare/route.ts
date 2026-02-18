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
    return NextResponse.json({ best_option: null, all_results: [], message: "No product specified" });
  }

  // eBay API call
  const EBAY_OAUTH_TOKEN = process.env.EBAY_OAUTH_TOKEN;
  if (!EBAY_OAUTH_TOKEN) {
    return NextResponse.json({ best_option: null, all_results: [], message: "eBay token missing" });
  }

  const results: ProductResult[] = [];

  try {
    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(product)}&limit=5`,
      {
        headers: { Authorization: `Bearer ${EBAY_OAUTH_TOKEN}`, "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    if (!data.itemSummaries || data.itemSummaries.length === 0) {
      results.push({
        site: "eBay",
        title: "No product found",
        price: "N/A",
        rating: "N/A",
        reviews: "N/A",
        link: "#",
      });
    } else {
      data.itemSummaries.forEach((item: any) => {
        results.push({
          site: "eBay",
          title: item.title || "No title",
          price: item.price?.value ? `${item.price.value} ${item.price.currency}` : "N/A",
          rating: item.rating?.value?.toString() || "N/A",
          reviews: item.reviewCount?.toString() || "N/A",
          link: item.itemWebUrl || "#",
        });
      });
    }
  } catch (err) {
    console.error("eBay API error:", err);
    results.push({
      site: "eBay",
      title: "No product found",
      price: "N/A",
      rating: "N/A",
      reviews: "N/A",
      link: "#",
      error: "Failed to fetch",
    });
  }

  // Determine best option
  const best_option = results.reduce<ProductResult | null>((best, curr) => {
    const currPrice = parseFloat(curr.price?.replace(/[^0-9.]/g, "") || "Infinity");
    const bestPrice = parseFloat(best?.price?.replace(/[^0-9.]/g, "") || "Infinity");
    const currRating = parseFloat(curr.rating || "0");
    const bestRating = parseFloat(best?.rating || "0");

    if (currPrice < bestPrice || (currPrice === bestPrice && currRating > bestRating)) {
      return curr;
    }
    return best;
  }, null);

  return NextResponse.json({ best_option, all_results: results });
}
