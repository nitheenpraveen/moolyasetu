import { NextResponse } from 'next/server';
import { z } from 'zod';

// This schema protects your app from "bad data" from external sites
const ProductSchema = z.object({
  title: z.string(),
  price: z.number(),
  rating: z.number(),
  link: z.string().url(),
  source: z.enum(['Amazon', 'Flipkart', 'eBay']),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ error: "Search query required" }, { status: 400 });

  // PLACEHOLDER: This is where your extractors (Flipkart/Myntra) will plug in
  const mockResults = [
    { title: `${query} - Premium`, price: 1200, rating: 4.8, link: "https://amazon.com", source: "Amazon" },
    { title: `${query} - Standard`, price: 950, rating: 3.5, link: "https://ebay.com", source: "eBay" },
  ];

  // AI Logic: Sort by "Value Score" (Rating / Price)
  const sortedResults = mockResults.sort((a, b) => (b.rating / b.price) - (a.rating / a.price));

  return NextResponse.json(sortedResults);
}
