import {/compare/route.ts NextResponse } from "next/server";

 GET(req: Requestexport async functionParams } = new URL product = search) {
  const { search(req.url);
  constParams.get("product");

  if (!product) {
    return NextResponse.json({ errorkart links (always: "Missing product query" }, { status: 400 });
  }

  // Amazon & Flip available)
  const://www.amazon.in/s?k=${encodeURIComponentprocess.env.AMAZON_TAG}`;
  const flipkartLink = `https://www.flipkart.com/search?q amazonLink = `https(product)}&tag=${=${encodeURIComponent(product)}`;

  //
  let ebayData: any = null;
  let eBay Browse API fetch(
      `https://api.ebay.com/b ebayError: string | null = null;
  try {
    const ebayRes = await_summary/search?q=${encodeURIComponent(product)}&limit=5`,
      {
        headers: {
          `Bearer ${process      }
    );

    if (!ebayResuy/browse/v1/item "Authorization":.env.EBAY_TOKEN}`,
          "Content-Type": "application/json",
        },
.ok) {
      ebayError = `eBay fetch.status}`;
    }Data = await ebayRes.json();
    }
 failed: ${ebayRes else {
      ebay  } catch (err: any) {
    ebayError = `eBay fetch error: ${err.message}`;
_results: any[] =  }

  // Build results array
  const all [];

  // Amazon
  all_results.push({
    site: "Amazon",
    price: null, // price not available results for ${product via SiteStripe search
    title: `Search}`,
    link: amazonLink,
    image: null,
  });

  //: "Flipkart",
    for ${product}`,
 Flipkart
  all_results.push({
    site price: null,
    title: `Search results    link: flipkart null,
  });

  // eBay
  if (ebayData?.itemSummaries.itemSummaries.forLink,
    image:) {
    ebayDataEach((item: any) => {
      all_results: "eBay",
       ?.value,
        title: item.title.itemWebUrl,
        image: item.image.push({
        site price: item.price,
        link: item?.imageUrl || null,
      });
    });
_results.push({
  } else if (ebay      site: "eBayError) {
    all: null,
      image",
      price: null,
      title: ebayError,
      link option (lowest price: null,
    });
 among those with numeric price)
  }

  // Pick best  let best_option = null;
  const pricedResults =(pricedResults.length all_results.filter(r => r.price && !isNaN(Number(r.price)));
  if  > 0) {
    best_option = pricedResults.reduce((min, r) =>
      Number(r.price) < Number(min.price) ? r : min
 NextResponse.json    best_option,
  });
}
