import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeFlipkart(query: string) {
  try {
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    // We use a real User-Agent to look like a human browser (Legally safer/less likely to be blocked)
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const products: any[] = [];

    // This selector targets Flipkart's search result cards
    $('.tUxRfH').each((i, el) => {
      const title = $(el).find('._Wp_S').text();
      const price = parseInt($(el).find('._25b18c ._30jeq3').text().replace(/[^\d]/g, ''));
      const rating = parseFloat($(el).find('._3LWZlK').text());
      const link = "https://www.flipkart.com" + $(el).find('a').attr('href');

      if (title && price) {
        products.push({ title, price, rating: rating || 0, link, source: 'Flipkart' });
      }
    });

    return products;
  } catch (error) {
    console.error("Flipkart Scrape Error:", error);
    return [];
  }
}
