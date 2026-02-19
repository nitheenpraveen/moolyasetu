import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
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

    // 2️⃣ Search eBay (India marketplace)
    const searchRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${query}&limit=10`,
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
        title: item.title,
        price: parseFloat(item.price?.value || 0),
        currency: item.price?.currency,
        image: item.image?.imageUrl || "",
        url: item.itemWebUrl,
      })) || [];

    // 3️⃣ Clean + filter
    const cleanProducts = products
      .filter((p: any) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
      .filter(
        (p: any) =>
          !p.title.toLowerCase().includes("refurbished") &&
          !p.title.toLowerCase().includes("broken")
      );

    // 4️⃣ Sort by price
    cleanProducts.sort((a: any, b: any) => a.price - b.price);

    return NextResponse.json(cleanProducts);
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
