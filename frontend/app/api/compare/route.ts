import { NextRequest, NextResponse } from "next/server";
import { getFlipkartProduct } from "../../../extractor/flipkart";
import { getMyntraProduct } from "../../../extractor/myntra";

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
    // 🔥 Primary → FastAPI backend
    const res = await fetch(
      `${BACKEND_URL}/compare?product=${encodeURIComponent(product)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    throw new Error("Backend failed");
  } catch (error) {
    console.error("Backend down → fallback", error);

    // 🔥 Fallback scrapers
    const flipkart = await getFlipkartProduct(product);
    const myntra = await getMyntraProduct(product);

    return NextResponse.json({
      fallback: true,
      results: [flipkart, myntra],
    });
  }
}