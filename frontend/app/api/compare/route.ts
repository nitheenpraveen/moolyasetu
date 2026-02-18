import { NextResponse } from "next/server";

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
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "flipkart-cost-per-lifetime.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `Name=https://www.flipkart.com/search?q=${product}`,
    },
    {
      site: "eBay",
      url: `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${product}`,
      headers: {
        Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN!}`,
      },
    },
    {
      site: "Reliance Digital",
      url: `https://reliance-digital-api.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "reliance-digital-api.p.rapidapi.com",
      },
    },
    {
      site: "TataCliq",
      url: `https://tatacliq-api.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "tatacliq-api.p.rapidapi.com",
      },
    },
  ];

  const results: any[] = [];

  for (const source of sources) {
    try {
      const headers: Record<string, string> = {};
      if (source.headers) {
        for (const [key, value] of Object.entries(source.headers)) {
          if (value !== undefined) headers[key] = value;
        }
      }

      const res = await fetch(source.url, {
        method: source.method || "GET",
        headers,
        body: source.method === "POST" ? source.body : undefined,
      });

      const data = await res.json();
      console.log(`${source.site} response:`, JSON.stringify(data, null, 2));

      if (source.site === "Flipkart") {
        results.push({
          site: source.site,
          title: data.title || "No product found",
          price: data.price || "N/A",
          rating: data.rating || "N/A",
          reviews: data.value || "N/A",
          link: source.body.replace("Name=", "") || "#",
          warranty: data.warranty || "N/A",
          cpl: data.CPL || "N/A",
        });
        continue;
      }

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

      const firstProduct =
        data.products?.[0] ||
        data.results?.[0] ||
        data[0] ||
        null;

      results.push({
        site: source.site,
        title:
          firstProduct?.title ||
          firstProduct?.product_title ||
          firstProduct?.name ||
          "No product found",
        price:
          firstProduct?.price ||
          firstProduct?.product_price ||
          "N/A",
        rating:
          firstProduct?.rating ||
          firstProduct?.product_rating ||
          "N/A",
        reviews:
          firstProduct?.reviews ||
          firstProduct?.product_reviews ||
          "N/A",
        link:
          firstProduct?.link ||
          firstProduct?.product_link ||
          firstProduct?.url ||
          "#",
      });
    } catch (err) {
      console.error(`${source.site} error:`, err);
      results.push({ site: source.site, error: "Not available" });
    }
  }

  const best_option = results.reduce((best, curr) => {
    if (!curr.price || curr.price === "N/A") return best;
    const currPrice = parseInt(curr.price.replace(/\D/g, "")) || Infinity;
    const bestPrice = parseInt(best?.price?.replace(/\D/g, "")) || Infinity;

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
