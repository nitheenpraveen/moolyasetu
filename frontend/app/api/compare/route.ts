import { NextResponse } from "next/server";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getEbayToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing eBay production credentials");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to obtain eBay token");
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // refresh 1 min early

  return cachedToken;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product")?.trim();

  if (!product) {
    return NextResponse.json({
      all_results: [],
      best_option: null,
      message: "No product specified",
    });
  }

  try {
    const token = await getEbayToken();

    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(
        product
      )}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error("eBay search failed");
    }

    const data = await res.json();

    const results = (data.itemSummaries || []).map((item: any) => ({
      site: "eBay",
      title: item.title || "No title",
      price: item.price?.value
        ? `${item.price.value} ${item.price.currency}`
        : "N/A",
      rating: "N/A",
      reviews: "N/A",
      link: item.itemWebUrl || "#",
    }));

    const best_option = results.reduce((best: any, curr: any) => {
      const currPrice =
        parseFloat(curr.price.replace(/[^0-9.]/g, "")) || Infinity;
      const bestPrice =
        best ? parseFloat(best.price.replace(/[^0-9.]/g, "")) || Infinity : Infinity;

      return currPrice < bestPrice ? curr : best;
    }, null);

    return NextResponse.json({ all_results: results, best_option });
  } catch (error) {
    console.error("Production eBay error:", error);

    return NextResponse.json({
      all_results: [],
      best_option: null,
      message: "Failed to fetch from eBay",
    });
  }
}
