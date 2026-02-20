import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://moolyasetu-b1120af93c94.herokuapp.com";

// 🔥 Retry logic for Heroku cold starts
async function fetchBackend(url: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return res;
    } catch (err) {
      console.log("Retrying backend...", i + 1);
    }

    // wait 2 seconds before retry
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Backend unavailable");
}

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
    // 🔥 Call Heroku backend
    const res = await fetchBackend(
      `${BACKEND_URL}/compare?product=${encodeURIComponent(product)}`
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Backend down → fallback", error);

    // 🔥 Safe fallback (no scraping from Vercel)
    return NextResponse.json({
      fallback: true,
      results: [
        {
          source: "Flipkart",
          price: "Check price",
          url: `https://www.flipkart.com/search?q=${encodeURIComponent(
            product
          )}`,
        },
        {
          source: "Myntra",
          price: "Check price",
          url: `https://www.myntra.com/search?q=${encodeURIComponent(
            product
          )}`,
        },
      ],
    });
  }
}