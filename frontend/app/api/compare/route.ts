import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") || "";

  const sources = [
    {
      site: "Amazon India",
      // ScraperAPI proxy for Amazon search
      url: `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=https://www.amazon.in/s?k=${product}`,
    },
    {
      site: "Flipkart",
      // RapidAPI Flipkart Real-Time Data API
      url: `https://flipkart-real-time-data.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "flipkart-cost-per-lifetime.p.rapidapi.com",
      },
    },
    {
      site: "Reliance Digital",
      // Placeholder: update once you subscribe to a Reliance Digital scraper
      url: `https://reliance-digital-api.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "reliance-digital-api.p.rapidapi.com",
      },
    },
    {
      site: "TataCliq",
      // Placeholder: update once you subscribe to a TataCliq scraper
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
      const res = await fetch(source.url, { headers: source.headers });
      const data = await res.json();

      console.log(`${source.site} response:`, JSON.stringify(data, null, 2));

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
