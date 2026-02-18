import { NextResponse } from "next/server";

type ProductResult = {
  site: string;
  title?: string;
  price?: string;
  rating?: string;
  reviews?: string;
  link?: string;
  error?: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product")?.trim();

  if (!product) {
    return NextResponse.json({ best_option: null, all_results: [], message: "No product specified" });
  }

  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(product)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.EBAY_OAUTH_TOKEN || ""}`,
    },
  });

  const data = await res.json();
  const firstItem = data?.itemSummaries?.[0] || null;

  const result: ProductResult = {
    site: "eBay",
    title: firstItem?.title || "No product found",
    price: firstItem?.price?.value || "N/A",
    rating: firstItem?.rating || "N/A",
    reviews: firstItem?.reviewCount?.toString() || "N/A",
    link: firstItem?.itemWebUrl || "#",
  };

  return NextResponse.json({ best_option: result, all_results: [result] });
}
