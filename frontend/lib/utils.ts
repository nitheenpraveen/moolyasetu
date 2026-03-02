import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
}

// The AI-inspired Value Algorithm
export function getSmartRank(products: Product[]) {
  return products.map(p => {
    // Score calculation: High rating + Low price = High Value
    // We normalize price to prevent cheap/bad items from winning
    const score = (p.rating * 20) + (1000 / (p.price + 1)); 
    return { ...p, score: Math.round(score) };
  }).sort((a, b) => b.score - a.score);
}
