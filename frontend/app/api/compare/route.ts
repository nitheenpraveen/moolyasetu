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
  ];

  const results: any[] = [];

  for (const source of sources) {
    try {
      const res = await fetch(source.url, { headers: source.headers });
      const data = await res.json();

      // Debug: log the full response so you can inspect structure
      console.log(`${source.site} response:`, JSON.stringify(data, null, 2));

      // Try to extract first product details
      const firstProduct = data.products?.[0] || data[0]; // fallback if API returns array
      results.push({
        site: source.site,
        title: firstProduct?.title || "No product found",
        price: firstProduct?.price || "N/A",
        link: firstProduct?.link || "#",
      });
    } catch (err) {
      console.error(`${source.site} error:`, err);
      results.push({ site: source.site, error: "Not available" });
    }
  }

  // Pick best option by lowest numeric price
  const best_option = results.reduce((best, curr) => {
    if (!curr.price || curr.price === "N/A") return best;
    const currPrice = parseInt(curr.price.replace(/\D/g, ""));
    const bestPrice = parseInt(best?.price?.replace(/\D/g, "")) || Infinity;
    return currPrice < bestPrice ? curr : best;
  }, null);

  return NextResponse.json({ best_option, all_results: results });
}
