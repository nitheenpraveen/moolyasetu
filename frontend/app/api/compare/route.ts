import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json({ error: "Product query is required" }, { status: 400 });
  }

  try {
    const results: any[] = [];

    // Amazon (SiteStripe link)
    results.push({
      source: "Amazon",
      link: `https://www.amazon.in/s?k=${encodeURIComponent(product)}&tag=${process.env.AMAZON_ASSOC_TAG}`,
    });

    // Flipkart (basic search link)
    results.push({
      source: "Flipkart",
      link: `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`,
    });

    // eBay (Browse API)
    try {
      const tokenRes = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
      });

      const tokenData = await tokenRes.json();
      const ebayToken = tokenData.access_token;

      const ebayRes = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(product)}`,
        {
          headers: { Authorization: `Bearer ${ebayToken}` },
        }
      );

      const ebayData = await ebayRes.json();
      results.push({ source: "eBay", data: ebayData });
    } catch (err) {
      results.push({ source: "eBay", error: (err as Error).message });
    }

    return NextResponse.json({ product, results });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}
