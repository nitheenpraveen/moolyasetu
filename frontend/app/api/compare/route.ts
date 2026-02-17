const sources = [
  {
    site: "Amazon India",
    // ScraperAPI proxy for Amazon search
    url: `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=https://www.amazon.in/s?k=${product}`,
  },
  {
    site: "Flipkart",
    // RapidAPI Flipkart Real-Time Data API
    url: `https://flipkart-real-time-data.p.rapidapi.com/search?query=${product}`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
      "X-RapidAPI-Host": "flipkart-real-time-data.p.rapidapi.com",
    },
  },
  {
    site: "Reliance Digital",
    // Placeholder: update once you subscribe to a Reliance Digital scraper
    url: `https://reliance-digital-api.p.rapidapi.com/search?query=${product}`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
      "X-RapidAPI-Host": "reliance-digital-api.p.rapidapi.com",
    },
  },
  {
    site: "TataCliq",
    // Placeholder: update once you subscribe to a TataCliq scraper
    url: `https://tatacliq-api.p.rapidapi.com/search?query=${product}`,
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
      "X-RapidAPI-Host": "tatacliq-api.p.rapidapi.com",
    },
  },
];
