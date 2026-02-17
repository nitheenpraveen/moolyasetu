import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") || "";

  const sources = [
    {
      site: "Amazon India",
      url: `https://amazon-scraper.p.rapidapi.com/search?query=${product}&country=in`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "amazon-scraper.p.rapidapi.com",
      },
    },
    {
      site: "Flipkart",
      url: `https://flipkart-api.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "flipkart-api.p.rapidapi.com",
      },
    },
    {
      site: "Croma",
      url: `https://croma-api.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "croma-api.p.rapidapi.com",
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
    {
      site: "Myntra",
      url: `https://myntra-api.p.rapidapi.com/search?query=${product}`,
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": "myntra-api.p.rapidapi.com",
      },
    },
  ];

  const results: any[] = [];

  for (const source of sources) {
    try {
      const res = await fetch(source.url, { headers: source.headers });
      const data = await res.json();

      console.log(`${source.site} response:`, JSON.stringify(data, null, 2));

      const firstProduct = data.products?.[0] || data.results?.[0] || data[0];

      results.push({
        site: source.site,
        title: firstProduct?.title || firstProduct?.name || "No product found",
        price: firstProduct?.price || "N/A",
        rating: firstProduct?.rating || "N/A",
        reviews: firstProduct?.reviews || "N/A",
        link: firstProduct?.link || firstProduct?.url || "#",
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
