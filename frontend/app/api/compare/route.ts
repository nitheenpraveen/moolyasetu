import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json({ error: "Product query is required" }, { status: 400 });
  }

  try {
    const sources = [
      {
        name: "Amazon",
        url: `https://api.example.com/amazon?query=${encodeURIComponent(product)}`,
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
          "X-RapidAPI-Host": "amazon-api.p.rapidapi.com",
        } as Record<string, string>,
      },
      {
        name: "Flipkart",
        url: `https://api.example.com/flipkart?query=${encodeURIComponent(product)}`,
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY ?? "",
          "X-RapidAPI-Host": "flipkart-api.p.rapidapi.com",
        } as Record<string, string>,
      },
      {
        name: "eBay",
        url: `https://api.example.com/ebay?query=${encodeURIComponent(product)}`,
        headers: {
          Authorization: process.env.EBAY_OAUTH_TOKEN ?? "",
        } as Record<string, string>,
      },
    ];

    const results = await Promise.all(
      sources.map(async (source) => {
        try {
          const res = await fetch(source.url, { headers: source.headers });
          if (!res.ok) throw new Error(`${source.name} API error`);
          const data = await res.json();
          return { source: source.name, data };
        } catch (err) {
          return { source: source.name, error: (err as Error).message };
        }
      })
    );

    return NextResponse.json({ product, results });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
