import os
import requests
from fastapi import FastAPI, Query, Depends
from sqlalchemy.orm import Session
from database import get_db, ProductPriceHistory
from backend.models import VerifiedDeal

app = FastAPI()

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")


# 🔐 eBay OAuth
def get_ebay_token():
    auth = requests.auth.HTTPBasicAuth(EBAY_CLIENT_ID, EBAY_CLIENT_SECRET)

    response = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "grant_type": "client_credentials",
            "scope": "https://api.ebay.com/oauth/api_scope",
        },
        auth=auth,
    )

    return response.json().get("access_token")


# 🔎 eBay Search
def search_ebay(product: str):
    token = get_ebay_token()

    response = requests.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        headers={
            "Authorization": f"Bearer {token}",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY-US",
        },
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


# 🔥 Fake discount detection
def detect_fake_discount(db: Session, product, site, price):
    history = (
        db.query(ProductPriceHistory)
        .filter(
            ProductPriceHistory.product == product,
            ProductPriceHistory.site == site,
        )
        .order_by(ProductPriceHistory.timestamp.desc())
        .limit(30)
        .all()
    )

    if len(history) < 5:
        return 0  # not enough data

    avg_price = sum(h.price for h in history) / len(history)

    # Fake if discount < 5% from avg
    if price > avg_price * 0.95:
        return 1

    return 0


# 🔥 Confidence scoring
def calculate_confidence(price, original_price, fake_flag):
    if original_price == 0:
        return 50

    discount = (original_price - price) / original_price

    score = discount * 100

    if fake_flag:
        score *= 0.3

    return min(100, round(score, 2))


# 🔥 AI value scoring
def calculate_deal_score(price, confidence):
    return round((confidence / price) * 100, 2)


# 🔥 Compare + verify
@app.get("/compare")
def compare_products(product: str = Query(...), db: Session = Depends(get_db)):

    results = search_ebay(product)

    verified = []

    for r in results:
        fake_flag = detect_fake_discount(
            db, product, r["site"], r["price"]
        )

        original_price = r["price"] * 1.2  # placeholder until Amazon data

        confidence = calculate_confidence(
            r["price"], original_price, fake_flag
        )

        deal_score = calculate_deal_score(
            r["price"], confidence
        )

        verified.append({
            **r,
            "confidence": confidence,
            "deal_score": deal_score,
            "fake": fake_flag,
        })

        # Save price history
        db.add(
            ProductPriceHistory(
                product=product,
                site=r["site"],
                price=r["price"],
            )
        )

    db.commit()

    verified.sort(key=lambda x: x["deal_score"], reverse=True)

    return {
        "best_option": verified[0] if verified else None,
        "all_results": verified,
    }


@app.get("/")
def root():
    return {"message": "MoolyaSetu AI deal engine running 🚀"}
