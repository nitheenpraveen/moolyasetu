import { searchFlipkart } from "@/extractor/flipkart";
import { searchMyntra } from "@/extractor/myntra";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json(
      { error: "Product query is required" },
      { status: 400 }
    );
  }

  try {
    // 🔥 Call your FastAPI backend first
    const res = await fetch(
      `${BACKEND_URL}/compare?product=${encodeURIComponent(product)}`,
      { cache: "no-store" }
    );

    let backendData = [];

    if (res.ok) {
      const data = await res.json();
      backendData = data?.results || [];
    }

    // ✅ If backend returns empty → use mock Flipkart + Myntra
    if (!backendData.length) {
const flipkart = await searchFlipkart(product);
const myntra = await searchMyntra(product);

return NextResponse.json({
        results: [flipkart, myntra],
        source: "mock",
      });
    }

    // ✅ Backend has data
    return NextResponse.json({
      results: backendData,
      source: "backend",
    });

  } catch (error) {
    console.error("Compare API Error:", error);

    // ✅ Fallback if backend completely fails
    const flipkart = await getFlipkartProduct(product);
    const myntra = await getMyntraProduct(product);

    return NextResponse.json({
      results: [flipkart, myntra],
      source: "fallback",
    });
  }
}