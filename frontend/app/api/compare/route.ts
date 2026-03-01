import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json({ error: "Missing product query" }, { status: 400 });
  }

  const amazonLink = `https://www.amazon.in/s?k=${encodeURIComponent(product)}&tag=${process.env.AMAZON_TAG}`;
  const flipkartLink = `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`;

  let ebayData: any = null;
  let ebayError: string | null = null;
  try {
    const ebayRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(product)}&limit=5`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.EBAY_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (!ebayRes.ok) {
      ebayError = `eBay fetch failed: ${ebayRes.status}`;
    } else {
      ebayData = await ebayRes.json();
    }
  } catch (err: any) {
    ebayError = `eBay fetch error: ${err.message}`;
  }

  const all_results: any[] = [
    { site: "Amazon", price: null, title: `Search results for ${product}`, link: amazonLink, image: null },
    { site: "Flipkart", price: null, title: `Search results for ${product}`, link: flipkartLink, image: null }
  ];

  if (ebayData?.itemSummaries) {
    ebayData.itemSummaries.forEach((item: any) => {
      all_results.push({
        site: "eBay",
        price: item.price?.value,
        title: item.title,
        link: item.itemWebUrl,
        image: item.image?.imageUrl || null
      });
    });
  } else if (ebayError) {
    all_results.push({ site: "eBay", price: null, title: ebayError, link: null, image: null });
  }

  let best_option = null;
  const pricedResults = all_results.filter(r => r.price && !isNaN(Number(r.price)));
  if (pricedResults.length > 0) {
    best_option = pricedResults.reduce((min, r) =>
      Number(r.price) < Number(min.price) ? r : min
    );
  }

  return NextResponse.json({ product, best_option, all_results });
}
