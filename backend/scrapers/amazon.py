import requests
import re
import os

AMAZON_TAG = os.getenv("AMAZON_TAG", "moolyasetu-21")

def search_amazon(product: str):
    url = f"https://www.amazon.in/s?k={product}"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        r = requests.get(url, headers=headers, timeout=10)

        if r.status_code != 200:
            return []

        html = r.text

        blocks = re.findall(
            r'data-asin="([A-Z0-9]{10})".+?₹([\d,]+)',
            html
        )

        results = []

        for asin, price in blocks[:8]:
            price = float(price.replace(",", ""))

            link = f"https://www.amazon.in/dp/{asin}?tag={AMAZON_TAG}"

            results.append({
                "site": "Amazon",
                "title": f"Amazon {asin}",
                "price": price,
                "link": link
            })

        return results

    except Exception as e:
        print("Amazon error", e)
        return []
