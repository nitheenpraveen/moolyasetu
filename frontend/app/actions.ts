'use server';

import { scrapeFlipkart } from "@/lib/scraper";
import { getSmartRank } from "@/lib/utils";

export async function fetchDeals(query: string) {
  if (!query) return { success: false, data: [] };

  try {
    // Fetch real data from Flipkart
    const flipkartData = await scrapeFlipkart(query);
    
    // In the future, we add: const amazonData = await scrapeAmazon(query);
    const combinedData = [...flipkartData];

    // AI Smart Ranking
    const smartResults = getSmartRank(combinedData as any);
    
    return { success: true, data: smartResults };
  } catch (error) {
    return { success: false, data: [], error: "Failed to fetch live prices." };
  }
}
