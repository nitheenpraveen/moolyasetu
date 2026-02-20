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
    // 🔥 Call YOUR FastAPI backend instead of Google
    const res = await fetch(
      `${BACKEND_URL}/compare?product=${encodeURIComponent(product)}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Backend error");
    }

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Compare API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch comparison results." },
      { status: 500 }
    );
  }
}
