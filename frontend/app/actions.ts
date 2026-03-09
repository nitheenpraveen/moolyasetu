'use server';

import { scrapeAmazon } from "@/lib/scraper";
import { getSmartRank } from "@/lib/utils";

export async function fetchDeals(query: string) {
  if (!query) return { success: false, data: [] };

  try {
    // Fetch real data from Amazon
    const amazonData = await scrapeAmazon(query);
    
    const combinedData = [...amazonData];

    // AI Smart Ranking
    const smartResults = getSmartRank(combinedData as any);
    
    return { success: true, data: smartResults };
  } catch (error) {
    return { success: false, data: [], error: "Failed to fetch live prices." };
  }
}