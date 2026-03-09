import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // 1. Grab the 'id' from params (must await in Next.js 16)
  const { id } = await context.params;

  try {
    // 2. Decode Base64 string back to URL
    const targetUrl = Buffer.from(id, "base64").toString("utf-8");

    // 3. Create URL object
    const finalUrl = new URL(targetUrl);

    // 4. Attach affiliate IDs
    if (targetUrl.includes("amazon")) {
      finalUrl.searchParams.set(
        "tag",
        process.env.AMAZON_TRACKING_ID || "moolyasetu-21"
      );
    } else if (targetUrl.includes("flipkart")) {
      finalUrl.searchParams.set(
        "affid",
        process.env.FLIPKART_ID || "moolyasetu"
      );
    } else if (targetUrl.includes("ebay")) {
      finalUrl.searchParams.set(
        "campid",
        process.env.EBAY_CAMPAIGN_ID || ""
      );
    }

    // 5. Redirect user
    return NextResponse.redirect(finalUrl.toString(), 307);

  } catch (error) {
    console.error("Link Redirection Error:", error);

    // fallback redirect
    return NextResponse.redirect(new URL("/", request.url));
  }
}