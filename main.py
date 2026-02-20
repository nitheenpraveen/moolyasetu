import os
import requests
from fastapi import FastAPI, Query, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from .database import get_db, ProductPriceHistory

app = FastAPI()

# 🔐 eBay creds
EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")

# 🔥 Amazon SiteStripe (your affiliate)
AMAZON_TAG = os.getenv("AMAZON_TAG")


# 🔐 eBay OAuth
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


# 🔎 Search eBay
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


# 🔥 Amazon link generator
def amazon_affiliate_link(raw_url: str):
    if "tag=" in raw_url:
        return raw_url
    if "?" in raw_url:
        return f"{raw_url}&tag={AMAZON_TAG}"
    return f"{raw_url}?tag={AMAZON_TAG}"


# =========================
# 🔥 FAKE DISCOUNT DETECTION
# =========================

def fake_discount_score(db: Session, product, site, price):
    history = db.query(ProductPriceHistory).filter(
        ProductPriceHistory.product == product,
        ProductPriceHistory.site == site
    ).all()

    if len(history) < 5:
        return 50  # neutral

    avg = sum(h.price for h in history) / len(history)

    if price < avg * 0.7:
        return 95  # real deal
    if price < avg:
        return 75
    if price > avg * 1.2:
        return 30  # fake discount

    return 60


# =========================
# 🔥 CONFIDENCE SCORE
# =========================

def confidence_score(item, fake_score):
    title = item["title"].lower()
    trust = 50

    if "brand new" in title:
        trust += 15
    if "refurbished" in title:
        trust -= 10

    if fake_score > 90:
        trust += 20

    return max(0, min(100, trust))


# =========================
# 🔥 FORECAST MODEL
# =========================

def price_forecast(fake_score):
    if fake_score > 90:
        return "Likely to increase soon"
    if fake_score < 40:
        return "Price may drop"
    return "Stable"


# =========================
# 🔥 MAIN API
# =========================

@app.get("/compare")
def compare(product: str = Query(...), db: Session = Depends(get_db)):

    results = search_ebay(product)

    enriched = []

    for r in results:
        fake_score = fake_discount_score(db, product, r["site"], r["price"])
        conf = confidence_score(r, fake_score)
        forecast = price_forecast(fake_score)

        # save history
        db.add(ProductPriceHistory(
            product=product,
            site=r["site"],
            price=r["price"],
            timestamp=datetime.utcnow()
        ))

        enriched.append({
            **r,
            "fake_discount_score": fake_score,
            "confidence": conf,
            "forecast": forecast,
        })

    db.commit()

    best = sorted(enriched, key=lambda x: x["confidence"], reverse=True)[0]

    return {
        "best_option": best,
        "all_results": enriched,
    }


@app.get("/")
def root():
    return {"message": "AI Trust Engine running 🚀"}
