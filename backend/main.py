import os
import requests
from fastapi import FastAPI, Query

app = FastAPI()

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")


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


# 🧠 --- SMART SCORING SYSTEM --- #

def extract_model_score(title: str):
    title_lower = title.lower()

    if "14 pro" in title_lower:
        return 10
    if "14" in title_lower:
        return 9
    if "13" in title_lower:
        return 8
    if "12" in title_lower:
        return 7
    if "11" in title_lower:
        return 6
    if "se" in title_lower:
        return 3

    return 5


def extract_condition_score(title: str):
    title_lower = title.lower()

    if "brand new" in title_lower or "new" in title_lower:
        return 5
    if "very good" in title_lower:
        return 3
    if "good" in title_lower:
        return 2
    if "refurbished" in title_lower:
        return 1
    if "used" in title_lower:
        return 1

    return 2


def calculate_score(item, min_price):
    price = item["price"]
    title = item["title"]

    # 1️⃣ Price Score (0–10 scale)
    price_difference_ratio = (price - min_price) / min_price if min_price > 0 else 0
    price_score = max(0, 10 - (price_difference_ratio * 5))

    # 2️⃣ Model Score (0–10)
    model_score = extract_model_score(title)

    # 3️⃣ Condition Score (0–5)
    condition_score = extract_condition_score(title)

    # Weighted Final Score
    final_score = (
        price_score * 0.4 +
        model_score * 0.4 +
        condition_score * 0.2
    )

    item["score"] = round(final_score * 10, 2)  # Scale to 100
    return item


# 🔥 Compare Endpoint
@app.get("/compare")
def compare_products(product: str = Query(...)):

    results = search_ebay(product)

    if not results:
        return {"best_option": None, "all_results": []}

    min_price = min(r["price"] for r in results if r["price"] > 0)

    scored = [calculate_score(r, min_price) for r in results]
    sorted_results = sorted(scored, key=lambda x: x["score"], reverse=True)

    return {
        "best_option": sorted_results[0],
        "all_results": sorted_results,
    }


@app.get("/")
def root():
    return {"message": "AI comparison backend running 🚀"}
