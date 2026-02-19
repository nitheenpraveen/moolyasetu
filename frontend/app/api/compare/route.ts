import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const product = searchParams.get("product");

  if (!product) {
    return NextResponse.json({ error: "Missing product" }, { status: 400 });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/compare?product=${encodeURIComponent(product)}`
  );

  const data = await response.json();
  return NextResponse.json(data);
}
