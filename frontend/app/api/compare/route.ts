import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product") || "";

  // Temporary mock data for stable deployment
  const results = [
    { site: "Amazon India", title: `Sample ${product} - Amazon`, price: "₹999", rating: "4.5", reviews: "120", link: "#" },
    { site: "Flipkart", title: `Sample ${product} - Flipkart`, price: "₹1,050", rating: "4.3", reviews: "95", link: "#" },
    { site: "Reliance Digital", title: `Sample ${product} - Reliance`, price: "₹1,020", rating: "4.4", reviews: "80", link: "#" },
    { site: "TataCliq", title: `Sample ${product} - TataCliq`, price: "₹1,030", rating: "4.2", reviews: "60", link: "#" },
  ];

  // Best option logic
  const best_option = results.reduce((best, curr) => {
    const currPrice = parseFloat(curr.price.replace(/\D/g, "")) || Infinity;
    const bestPrice = best ? parseFloat(best.price.replace(/\D/g, "")) : Infinity;
    const currRating = parseFloat(curr.rating) || 0;
    const bestRating = best ? parseFloat(best.rating) : 0;

    if (!best || currPrice < bestPrice || (currPrice === bestPrice && currRating > bestRating)) return curr;
    return best;
  }, null as typeof results[0] | null);

  return NextResponse.json({ best_option, all_results: results });
}
