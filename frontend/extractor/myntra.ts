export async function getMyntraProduct(product: string) {
  try {
    const res = await fetch(
      `https://www.myntra.com/${encodeURIComponent(product)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const html = await res.text();

    const priceMatch = html.match(/₹[\d,]+/);

    return {
      source: "Myntra",
      price: priceMatch ? priceMatch[0] : "Not found",
      url: `https://www.myntra.com/${encodeURIComponent(product)}`,
    };
  } catch (err) {
    console.error("Myntra error", err);
    return null;
  }
}