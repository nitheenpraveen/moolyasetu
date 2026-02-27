import os
import requests
from fastapi import FastAPI, Query

app = FastAPI()

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")

# 🔥 Amazon Affiliate Tag
AMAZON_TAG = os.getenv("AMAZON_TAG", "moolyasetu-21")


# 🔐 Get eBay OAuth Token
def get_ebay_token():
    auth = requests.auth.HTTPBasicAuth(EBAY_CLIENT_ID, EBAY_CLIENT_SECRET)

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope",
    }

    response = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        headers=headers,
        data=data,
        auth=auth,
    )

    return response.json().get("access_token")


# 🔎 Search eBay
def search_ebay(product: str):
    token = get_ebay_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY-US",
    }

    response = requests.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        headers=headers,
        params={"q": product, "limit": 10},
    )

    data = response.json()

    products = []

    for item in data.get("itemSummaries", []):
        products.append({
            "site": "eBay",
            "title": item.get("title"),
            "price": float(item.get("price", {}).get("value", 0)),
            "link": item.get("itemWebUrl"),
        })

    return products


# 🛒 Search Amazon (Affiliate Enabled)
def search_amazon(product: str):
    search_url = f"https://www.amazon.in/s?k={product}"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(search_url, headers=headers, timeout=10)

        if response.status_code != 200:
            return []

        import re

        # Extract ASINs
        asins = list(set(re.findall(r'data-asin="([A-Z0-9]{10})"', response.text)))

        products = []

        for asin in asins[:5]:
            affiliate_link = f"https://www.amazon.in/dp/{asin}?tag={AMAZON_TAG}"

            products.append({
                "site": "Amazon",
                "title": f"Amazon Product {asin}",
                "price": 0,
                "link": affiliate_link,
            })

        return products

    except Exception as e:
        print("Amazon error:", e)
        return []


# 🧠 SMART SCORING (same as before)
def extract_model_score(title: str):
    title_lower = title.lower()

    if "iphone 6" in title_lower: return 1
    if "iphone 7" in title_lower: return 2
    if "iphone 8" in title_lower: return 3
    if "14 pro" in title_lower: return 10
    if "14" in title_lower: return 9
    if "13" in title_lower: return 8
    if "12" in title_lower: return 7
    if "11" in title_lower: return 6
    if "se" in title_lower: return 4

    return 5


def extract_condition_score(title: str):
    title_lower = title.lower()

    if "brand new" in title_lower: return 5
    if "very good" in title_lower: return 4
    if "good" in title_lower: return 3
    if "refurbished" in title_lower: return 2
    if "used" in title_lower: return 2

    return 3


def calculate_score(item, min_price):
    price = item["price"]
    title = item["title"]

    if min_price > 0:
        ratio = price / min_price
        price_score = max(0, 10 - min(ratio - 1, 2) * 3)
    else:
        price_score = 5

    model_score = extract_model_score(title)
    condition_score = extract_condition_score(title)

    final_score = (
        price_score * 0.3 +
        model_score * 0.5 +
        condition_score * 0.2
    )

    item["score"] = round(final_score * 10, 2)
    return item


# 🔥 Compare Endpoint (still only eBay for now)
@app.get("/compare")
def compare_products(product: str = Query(...)):

    ebay_results = search_ebay(product)
    amazon_results = search_amazon(product)

    results = ebay_results + amazon_results

    if not results:
        return {"best_option": None, "all_results": []}

    # Only price > 0 for scoring
    valid_prices = [r["price"] for r in results if r["price"] > 0]

    min_price = min(valid_prices) if valid_prices else 1

    scored = [calculate_score(r, min_price) for r in results]

    sorted_results = sorted(scored, key=lambda x: x["score"], reverse=True)

    return {
        "best_option": sorted_results[0],
        "all_results": sorted_results,
    }


@app.get("/")
def root():
    return {"message": "AI comparison backend running 🚀"}
