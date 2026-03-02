import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Grab the 'id' (which is the scrambled Base64 link) from the URL
  const { id } = params;

  try {
    // 2. Decode the Base64 string back into a real URL
    // This happens safely on the Server only.
    const targetUrl = Buffer.from(id, 'base64').toString('utf-8');

    // 3. Create a URL object to manipulate it
    const finalUrl = new URL(targetUrl);

    // 4. Attach your SECRET IDs from Vercel/Environment Variables
    // This is the "Hack-Free" part: the user never sees these tags.
    if (targetUrl.includes('amazon')) {
      finalUrl.searchParams.set('tag', process.env.AMAZON_TRACKING_ID || 'moolyasetu-21');
    } else if (targetUrl.includes('flipkart')) {
      finalUrl.searchParams.set('affid', process.env.FLIPKART_ID || 'moolyasetu');
    } else if (targetUrl.includes('ebay')) {
      finalUrl.searchParams.set('campid', process.env.EBAY_CAMPAIGN_ID || '');
    }

    // 5. Redirect the user to the store with your affiliate tag attached
    // We use 307 (Temporary Redirect) for better SEO handling
    return NextResponse.redirect(finalUrl.toString(), 307);
    
  } catch (error) {
    console.error("Link Redirection Error:", error);
    // If the ID is broken or malicious, send them safely back to the home page
    return NextResponse.redirect(new URL('/', request.url));
  }
}
