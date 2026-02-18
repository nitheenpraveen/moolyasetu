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
  const product = searchParams.get("product") || "";

  const sources = [
    {
      site: "Amazon India",
      url: `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=https://www.amazon.in/s?k=${product}`,
    },
    {
      site: "Flipkart",
      url: "https://flipkart-cost-per-lifetime.p.rapidapi.com/result",
      method: "POST",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "flipkart-cost-per-lifetime.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `Name=https://www.flipkart.com/search?q=${product}`,
    },
    {
      site: "eBay",
      url: `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${product}`,
      headers: {
        Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN || ""}`,
      },
    },
  ];

  const results: ProductResult[] = [];

  for (const source of sources) {
    try {
      const headers: Record<string, string> = {};
      if (source.headers) {
        for (const [key, value] of Object.entries(source.headers)) {
          if (value) headers[key] = value;
        }
      }

      const res = await fetch(source.url, {
        method: source.method || "GET",
        headers,
        body: source.method === "POST" ? source.body : undefined,
      });

      // Some APIs might return HTML instead of JSON (Amazon), handle gracefully
      let data: any;
      try {
        data = await res.json();
      } catch {
        results.push({ site: source.site, error: "Data not available" });
        continue;
      }

      // eBay
      if (source.site === "eBay") {
        const firstItem = data.itemSummaries?.[0] || null;
        results.push({
          site: source.site,
          title: firstItem?.title || "No product found",
          price: firstItem?.price?.value || "N/A",
          rating: firstItem?.rating || "N/A",
          reviews: firstItem?.reviewCount || "N/A",
          link: firstItem?.itemWebUrl || "#",
        });
        continue;
      }

      // Flipkart
      if (source.site === "Flipkart") {
        results.push({
          site: source.site,
          title: data.title || "No product found",
          price: data.price || "N/A",
          rating: data.rating || "N/A",
          reviews: data.value || "N/A",
          link: source.body ? source.body.replace("Name=", "") : "#",
        });
        continue;
      }

      // Generic placeholder for Amazon
      results.push({
        site: source.site,
        title: "No product found",
        price: "N/A",
        rating: "N/A",
        reviews: "N/A",
        link: "#",
      });
    } catch (err) {
      results.push({ site: source.site, error: "Not available" });
    }
  }

  // Determine best option safely
  const best_option = results.reduce<ProductResult | null>((best, curr) => {
    if (!curr.price || curr.price === "N/A") return best;
    const currPrice = parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
    const bestPrice = best ? parseFloat(best.price?.replace(/[^0-9.]/g, "")) || Infinity : Infinity;

    const currRating = parseFloat(curr.rating || "0") || 0;
    const bestRating = best ? parseFloat(best.rating || "0") || 0 : 0;

    if (currPrice < bestPrice || (currPrice === bestPrice && currRating > bestRating)) {
      return curr;
    }
    return best;
  }, null);

  return NextResponse.json({ best_option, all_results: results });
}
