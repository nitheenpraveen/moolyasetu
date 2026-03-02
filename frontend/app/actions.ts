'use server';

import { Product, getSmartRank } from "@/lib/utils";

export async function fetchDeals(query: string) {
  if (!query) return { success: false, data: [] };

  try {
    // In a real startup, you'd call your API keys from process.env here
    // For now, we simulate the 'Smart' fetch from Amazon & eBay
    const rawResults: Product[] = [
      { title: `${query} Pro Max`, price: 999, rating: 4.8, reviews: 1200, link: "#", source: 'Amazon' },
      { title: `${query} Refurbished`, price: 450, rating: 3.9, reviews: 45, link: "#", source: 'eBay' },
      { title: `${query} Budget Edition`, price: 299, rating: 4.2, reviews: 800, link: "#", source: 'Flipkart' },
    ];

    const smartResults = getSmartRank(rawResults);
    
    return { success: true, data: smartResults };
  } catch (error) {
    console.error("Extraction failed:", error);
    return { success: false, data: [], error: "Service temporarily unavailable." };
  }
}
