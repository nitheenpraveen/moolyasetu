export async function getFlipkartProduct(product: string) {
  try {
    const res = await fetch(
      `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const html = await res.text();

    // 🔥 Basic price extraction (safe fallback)
    const priceMatch = html.match(/₹[\d,]+/);

    return {
      source: "Flipkart",
      price: priceMatch ? priceMatch[0] : "Not found",
      url: `https://www.flipkart.com/search?q=${encodeURIComponent(product)}`,
    };
  } catch (err) {
    console.error("Flipkart error", err);
    return null;
  }
}