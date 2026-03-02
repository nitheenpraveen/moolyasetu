// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// This helper makes your Tailwind classes "Smooth" and conflict-free
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Product {
  title: string;
  price: number;
  rating: number;
  reviews: number;
  link: string;
  source: 'Amazon' | 'eBay' | 'Flipkart';
  score?: number; // The Smart Score we will calculate
}

/**
 * AI-Inspired Value Algorithm (MoolyaSetu Core)
 * This identifies the "Bridge of Value" for the customer.
 */
export function getSmartRank(products: Product[]) {
  return products.map(p => {
    // 1. Base Score from Rating (0-100 scale)
    const ratingScore = p.rating * 20; 

    // 2. Price Efficiency Score
    // We penalize very high prices but reward competitive pricing.
    // Logic: (1000 / Price) gives higher points to cheaper items.
    const priceScore = (1000 / (p.price + 1)) * 5;

    // 3. Social Proof Bonus (Reviews)
    // Items with more than 100 reviews get a small "Trust" boost.
    const trustBonus = p.reviews > 100 ? 5 : 0;

    const totalScore = Math.round(ratingScore + priceScore + trustBonus);
    
    return { ...p, score: totalScore };
  }).sort((a, b) => (b.score || 0) - (a.score || 0)); // Highest score first
}
