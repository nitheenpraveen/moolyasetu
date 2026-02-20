import os
import re
import requests
from fastapi import FastAPI, Query

app = FastAPI()

# ============================================
# 🔐 ENV VARIABLES
# ============================================

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")
AMAZON_TAG = "moolyasetu-21"

# ============================================
# 🔐 EBAY AUTH
# ============================================

def get_ebay_token():
    auth = requests.auth.HTTPBasicAuth(EBAY_CLIENT_ID, EBAY_CLIENT_SECRET)

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    data = {
        "grant_type": "client_credentials",
        "scope": "https://api.ebay.com/oauth/api_scope",
    }

    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        headers=headers,
        data=data,
        auth=auth,
    )

    return r.json().get("access_token")


# ============================================
# 🔎 EBAY SEARCH
# ============================================

def search_ebay(product: str):
    token = get_ebay_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY-US",
    }

    r = requests.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        headers=headers,
        params={"q": product, "limit": 10},
    )

    data = r.json()
    items = []

    for item in data.get("itemSummaries", []):
        items.append({
            "site": "eBay",
            "title": item.get("title"),
            "price": float(item.get("price", {}).get("value", 0)),
            "link": item.get("itemWebUrl"),
        })

    return items


# ============================================
# 🔥 AMAZON UTILITIES
# ============================================

def extract_asin(url: str):
    match = re.search(r"/dp/([A-Z0-9]{10})", url)
    return match.group(1) if match else None


def generate_affiliate_link(asin: str):
    return f"https://www.amazon.in/dp/{asin}/?tag={AMAZON_TAG}"


# ============================================
# 🔥 SCORING ENGINE
# ============================================

def calculate_score(item, min_price):
    if min_price == 0:
        score = 50
    else:
        score = 100 - ((item["price"] - min_price) / min_price) * 100

    item["score"] = round(max(0, min(100, score)), 2)
    return item


def calculate_confidence(item, min_price):
    base_score = item["score"]

    anomaly_penalty = 0
    if item["price"] < min_price * 0.6:
        anomaly_penalty = 20

    trust_bonus = 0
    if "brand new" in item["title"].lower():
        trust_bonus = 10

    confidence = base_score - anomaly_penalty + trust_bonus
    confidence = max(0, min(100, confidence))

    item["confidence"] = round(confidence, 2)
    return item


def forecast_price(price):
    if price > 1000:
        return "Likely to drop during upcoming sale"
    return "Stable pricing expected"


# ============================================
# 🚀 MAIN COMPARE ENDPOINT
# ============================================

@app.get("/compare")
def compare(product: str = Query(...)):
    results = search_ebay(product)

    if not results:
        return {"best_option": None, "all_results": []}

    min_price = min(r["price"] for r in results if r["price"] > 0)

    enriched = []

    for r in results:
        r = calculate_score(r, min_price)
        r = calculate_confidence(r, min_price)
        r["forecast"] = forecast_price(r["price"])
        enriched.append(r)

    best = sorted(enriched, key=lambda x: x["confidence"], reverse=True)[0]

    return {
        "best_option": best,
        "all_results": enriched,
    }


@app.get("/")
def root():
    return {"message": "MoolyaSetu AI Trust Engine running 🚀"}
