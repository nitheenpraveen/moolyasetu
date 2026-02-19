import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json({ error: "Missing product" }, { status: 400 });
  }

  try {
    // 1️⃣ Get OAuth token
    const tokenRes = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.EBAY_CLIENT_ID +
              ":" +
              process.env.EBAY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    // 2️⃣ Search eBay India
    const searchRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${product}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-EBAY-C-MARKETPLACE-ID": "EBAY-IN",
        },
      }
    );

    const data = await searchRes.json();

    const products =
      data.itemSummaries?.map((item: any) => ({
        site: "eBay",
        title: item.title,
        price: parseFloat(item.price?.value || 0),
        image: item.image?.imageUrl || "",
        link: item.itemWebUrl,
      })) || [];

    if (products.length === 0) {
      return NextResponse.json({
        best_option: null,
        all_results: [],
      });
    }

    // Sort lowest price first
    products.sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json({
      best_option: products[0],
      all_results: products,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
