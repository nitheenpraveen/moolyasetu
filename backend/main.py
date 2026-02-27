import os
import requests
import re
from fastapi import FastAPI, Query, HTTPException
from datetime import datetime

app = FastAPI()

# 🔐 ENV
EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")
AMAZON_TAG = os.getenv("AMAZON_TAG", "moolyasetu-21")

# ==============================
# 🔐 EBAY TOKEN
# ==============================
def get_ebay_token():
    auth = requests.auth.HTTPBasicAuth(EBAY_CLIENT_ID, EBAY_CLIENT_SECRET)

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope",
    }

    res = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        headers=headers,
        data=data,
        auth=auth,
        timeout=10,
    )

    return res.json().get("access_token")


# ==============================
# 🛒 EBAY SEARCH
# ==============================
def search_ebay(product: str):
    token = get_ebay_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY-US",
    }

    res = requests.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        headers=headers,
        params={"q": product, "limit": 10},
        timeout=10,
    )

    data = res.json()
    products = []

    for item in data.get("itemSummaries", []):
        price = float(item.get("price", {}).get("value", 0))

        products.append({
            "site": "eBay",
            "title": item.get("title"),
            "price": price,
            "link": item.get("itemWebUrl"),
        })

    return products


# ==============================
# 🛍️ AMAZON SEARCH (REAL PRICE)
# ==============================
def extract_price(text):
    match = re.search(r'₹\s?([\d,]+)', text)
    if match:
        return float(match.group(1).replace(",", ""))
    return 0


def search_amazon(product: str):
    url = f"https://www.amazon.in/s?k={product.replace(' ', '+')}"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        res = requests.get(url, headers=headers, timeout=10)

        if res.status_code != 200:
            return []

        html = res.text

        asins = list(set(re.findall(r'data-asin="([A-Z0-9]{10})"', html)))

        products = []

        for asin in asins[:6]:

            # 🔥 Extract price block
            price_block = re.search(
                rf'{asin}".*?₹\s?[\d,]+',
                html,
                re.DOTALL
            )

            price = extract_price(price_block.group()) if price_block else 0

            affiliate_link = f"https://www.amazon.in/dp/{asin}?tag={AMAZON_TAG}"

            products.append({
                "site": "Amazon",
                "title": f"Amazon Product {asin}",
                "price": price,
                "link": affiliate_link,
            })

        return products

    except Exception as e:
        print("Amazon error:", e)
        return []


# ==============================
# 🧠 AI SCORING
# ==============================
def extract_model_score(title: str):
    title = title.lower()

    scores = {
        "iphone 6": 1,
        "iphone 7": 2,
        "iphone 8": 3,
        "se": 4,
        "11": 6,
        "12": 7,
        "13": 8,
        "14": 9,
        "14 pro": 10,
    }

    for key, value in scores.items():
        if key in title:
            return value

    return 5


def extract_condition_score(title: str):
    title = title.lower()

    if "brand new" in title:
        return 5
    if "very good" in title:
        return 4
    if "good" in title:
        return 3
    if "refurbished" in title:
        return 2
    if "used" in title:
        return 2

    return 3


def calculate_score(item, min_price):
    price = item["price"]
    title = item["title"]

    # 🔥 Price importance increased
    if min_price > 0 and price > 0:
        ratio = price / min_price
        price_score = max(0, 10 - (ratio - 1) * 4)
    else:
        price_score = 5

    model_score = extract_model_score(title)
    condition_score = extract_condition_score(title)

    final = (
        price_score * 0.5 +
        model_score * 0.3 +
        condition_score * 0.2
    )

    item["score"] = round(final * 10, 2)
    return item


# ==============================
# 🔥 CLICK TRACKING (REVENUE)
# ==============================
@app.get("/track-click")
def track_click(link: str, product: str):

    # 👉 Save to DB later
    print({
        "product": product,
        "link": link,
        "time": datetime.utcnow()
    })

    return {"redirect": link}


# ==============================
# 🔥 PRICE ALERTS READY
# ==============================
@app.get("/price-alert")
def price_alert(product: str, target: float):

    # Future DB logic
    return {
        "message": f"Alert set for {product} at ₹{target}"
    }


# ==============================
# 🚀 MAIN COMPARE
# ==============================
@app.get("/compare")
def compare_products(product: str = Query(...)):

    ebay = search_ebay(product)
    amazon = search_amazon(product)

    results = ebay + amazon

    if not results:
        raise HTTPException(404, "No products found")

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
    return {"message": "MoolyaSetu AI engine running 🚀"}
