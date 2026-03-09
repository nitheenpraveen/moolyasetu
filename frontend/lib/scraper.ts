import * as cheerio from "cheerio";

export async function scrapeAmazon(query: string) {

  const affiliateId = process.env.AMAZON_TRACKING_ID;

  if (!affiliateId) {
    console.error("Critical Security Error: Affiliate ID missing from Vault.");
    return [];
  }

  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&tag=${affiliateId}`;

  try {

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await res.text();

    const $ = cheerio.load(html);

    const products: any[] = [];

    $(".s-result-item").each((_, element) => {

      const title = $(element).find("h2 span").text();
      const price = $(element).find(".a-price-whole").first().text();
      const link = $(element).find("h2 a").attr("href");
      const image = $(element).find("img").attr("src");

      if (title && price && link) {
        products.push({
          title,
          price: parseInt(price.replace(/,/g, "")),
          link: `https://www.amazon.in${link}`,
          image,
          source: "Amazon"
        });
      }

    });

    return products.slice(0, 10);

  } catch (error) {
    console.error("Amazon scrape failed", error);
    return [];
  }

}