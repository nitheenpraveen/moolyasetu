import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ✅ Debug environment variable (optional, remove later)
  console.log("EBAY_OAUTH_TOKEN:", process.env.EBAY_OAUTH_TOKEN);

  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") || "";

  // ✅ Only eBay source
  const sources = [
    {
      site: "eBay",
      url: `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${product}`,
      headers: {
        Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN!}`,
      },
    },
  ];

  const results: any[] = [];

  for (const source of sources) {
    try {
      const res = await fetch(source.url, {
        method: "GET",
        headers: source.headers,
      });

      const data = await res.json();
      console.log(`${source.site} response:`, JSON.stringify(data, null, 2));

      // Extract first product from eBay results
      const firstItem = data.itemSummaries?.[0] || null;
      results.push({
        site: source.site,
        title: firstItem?.title || "No product found",
        price: firstItem?.price?.value || "N/A",
        rating: firstItem?.rating || "N/A",
        reviews: firstItem?.reviewCount || "N/A",
        link: firstItem?.itemWebUrl || "#",
      });
    } catch (err) {
      console.error(`${source.site} error:`, err);
      results.push({ site: source.site, error: "Not available" });
    }
  }

  // Determine best option (lowest price + highest rating)
  const best_option = results.reduce((best, curr) => {
    if (!curr.price || curr.price === "N/A") return best;
    const currPrice = parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
    const bestPrice = parseFloat(best?.price?.replace(/[^0-9.]/g, "")) || Infinity;

    const currRating = parseFloat(curr.rating) || 0;
    const bestRating = parseFloat(best?.rating) || 0;

    if (
      currPrice < bestPrice ||
      (currPrice === bestPrice && currRating > bestRating)
    ) {
      return curr;
    }
    return best;
  }, null);

  return NextResponse.json({ best_option, all_results: results });
}
