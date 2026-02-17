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
      results.push({ site: source.site, price: data?.price || "N/A" });
    } catch (err) {
      results.push({ site: source.site, error: "Not available" });
    }
  }

  const best_option = results.reduce((best, curr) => {
    if (!curr.price || curr.price === "N/A") return best;
    if (!best.price || parseInt(curr.price.replace(/\D/g, "")) < parseInt(best.price.replace(/\D/g, ""))) {
      return curr;
    }
    return best;
  }, {});

  return NextResponse.json({ best_option, all_results: results });
}
