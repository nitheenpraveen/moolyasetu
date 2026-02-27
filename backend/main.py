import os
import re
import requests
from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.responses import RedirectResponse

app = FastAPI()

# ==============================
# ENV VARIABLES
# ==============================

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")

# 🔥 Amazon Affiliate
AMAZON_TAG = os.getenv("AMAZON_TAG", "moolyasetu-21")


# ==============================
# eBay OAuth Token
# ==============================

def get_ebay_token():
    auth = requests.auth.HTTPBasicAuth(
        EBAY_CLIENT_ID,
        EBAY_CLIENT_SECRET
    )

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


# ==============================
# Search eBay
# ==============================

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
        price = float(item.get("price", {}).get("value", 0))

        products.append({
            "site": "eBay",
            "title": item.get("title"),
            "price": price,
            "link": item.get("itemWebUrl"),
        })

    return products


# ==============================
# Search Amazon (Affiliate)
# ==============================

def extract_amazon_price(html: str):
    price_patterns = [
        r'"priceAmount":"([\d\.]+)"',
        r'₹\s?([\d,]+)'
    ]

    for pattern in price_patterns:
        match = re.search(pattern, html)
        if match:
            return float(match.group(1).replace(",", ""))

    return 0


def search_amazon(product: str):
    url = f"https://www.amazon.in/s?k={product}"

    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(url, headers=headers, timeout=10)

        if response.status_code != 200:
            return []

        html = response.text

        asins = list(set(re.findall(r'data-asin="([A-Z0-9]{10})"', html)))

        products = []

        for asin in asins[:5]:
            product_url = f"https://www.amazon.in/dp/{asin}"

            # 🔥 Fetch product page to extract price
            page = requests.get(product_url, headers=headers, timeout=10)
            price = extract_amazon_price(page.text)

            affiliate = f"{product_url}?tag={AMAZON_TAG}"

            products.append({
                "site": "Amazon",
                "title": f"Amazon Product {asin}",
                "price": price,
                "link": affiliate,
            })

        return products

    except Exception as e:
        print("Amazon error:", e)
        return []


# ==============================
# AI SCORING SYSTEM
# ==============================

def extract_model_score(title: str):
    t = title.lower()

    if "iphone 14 pro" in t: return 10
    if "iphone 14" in t: return 9
    if "iphone 13" in t: return 8
    if "iphone 12" in t: return 7
    if "iphone 11" in t: return 6
    if "iphone se" in t: return 5
    if "iphone 8" in t: return 3
    if "iphone 7" in t: return 2
    if "iphone 6" in t: return 1

    return 5


def extract_condition_score(title: str):
    t = title.lower()

    if "brand new" in t: return 5
    if "excellent" in t: return 4
    if "very good" in t: return 4
    if "good" in t: return 3
    if "refurbished" in t: return 2
    if "used" in t: return 2

    return 3


def calculate_score(item, min_price):
    price = item["price"]
    title = item["title"]

    # Price weight
    if min_price > 0:
        ratio = price / min_price
        price_score = max(0, 10 - min(ratio - 1, 2) * 3)
    else:
        price_score = 5

    model_score = extract_model_score(title)
    condition_score = extract_condition_score(title)

    final = (
        price_score * 0.35 +
        model_score * 0.45 +
        condition_score * 0.2
    )

    item["score"] = round(final * 10, 2)
    return item


# ==============================
# Compare API
# ==============================

@app.get("/compare")
def compare_products(product: str = Query(...)):

    ebay = search_ebay(product)
    amazon = search_amazon(product)

    results = ebay + amazon

    if not results:
        return {"best_option": None, "all_results": []}

    valid = [r["price"] for r in results if r["price"] > 0]
    min_price = min(valid) if valid else 1

    scored = [calculate_score(r, min_price) for r in results]
    sorted_results = sorted(scored, key=lambda x: x["score"], reverse=True)

    return {
        "best_option": sorted_results[0],
        "all_results": sorted_results,
    }


# ==============================
# CLICK TRACKING (Affiliate Revenue)
# ==============================

@app.get("/track-click")
def track_click(link: str, product: str):

    # 🔥 Replace later with database
    print({
        "product": product,
        "link": link,
        "time": datetime.utcnow()
    })

    return RedirectResponse(url=link)


# ==============================
# ROOT
# ==============================

@app.get("/")
def root():
    return {"message": "MoolyaSetu AI backend running 🚀"}
