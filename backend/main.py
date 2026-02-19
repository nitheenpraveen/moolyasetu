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
            "review_score": 4.0,      # Placeholder (eBay doesn't provide easily)
            "review_count": 100,      # Placeholder
            "link": item.get("itemWebUrl"),
        })

    return products


# 🧠 Scoring Logic
def calculate_score(item, min_price):
    price_score = 4 if item["price"] == min_price else 3
    review_score = (item["review_score"] / 5) * 4

    if item["review_count"] > 1000:
        quality_score = 2
    elif item["review_count"] > 100:
        quality_score = 1
    else:
        quality_score = 0

    raw_score = price_score + review_score + quality_score
    item["score"] = round((raw_score / 10) * 100, 2)

    return item


# 🔥 Compare Endpoint
@app.get("/compare")
def compare_products(product: str = Query(...)):

    results = search_ebay(product)

    if not results:
        return {"best_option": None, "all_results": []}

    min_price = min(r["price"] for r in results)

    scored = [calculate_score(r, min_price) for r in results]
    sorted_results = sorted(scored, key=lambda x: x["score"], reverse=True)

    return {
        "best_option": sorted_results[0],
        "all_results": sorted_results,
    }


@app.get("/")
def root():
    return {"message": "AI comparison backend running 🚀"}
