import os
import re
import requests
from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.responses import RedirectResponse

# ==============================
# FASTAPI APP
# ==============================
app = FastAPI()

# ==============================
# POSTGRESQL DATABASE CONNECTION
# ==============================
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text
)
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not set")

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# ==============================
# DATABASE MODELS
# ==============================
class Click(Base):
    __tablename__ = "clicks"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    link = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    target_price = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)


# Create tables
Base.metadata.create_all(bind=engine)

# ==============================
# ENV VARIABLES
# ==============================
EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")
AMAZON_TAG = os.getenv("AMAZON_TAG", "moolyasetu-21")

# ==============================
# PROXY SYSTEM (Anti-block)
# ==============================
PROXIES = [
    # Add BrightData / SmartProxy / Oxylabs later
    None
]

def get_proxy():
    return {"http": PROXIES[0], "https": PROXIES[0]} if PROXIES[0] else None


# ==============================
# EBAY TOKEN
# ==============================
def get_ebay_token():
    auth = requests.auth.HTTPBasicAuth(
        EBAY_CLIENT_ID,
        EBAY_CLIENT_SECRET
    )

    headers = {"Content-Type": "application/x-www-form-urlencoded"}

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
# EBAY SEARCH
# ==============================
def search_ebay(product: str):
    token = get_ebay_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY-IN",
    }

    response = requests.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        headers=headers,
        params={"q": product, "limit": 10},
    )

    products = []

    for item in response.json().get("itemSummaries", []):
        price = float(item.get("price", {}).get("value", 0))

        products.append({
            "site": "eBay",
            "title": item.get("title"),
            "price": price,
            "link": item.get("itemWebUrl"),
        })

    return products


# ==============================
# AMAZON SCRAPER
# ==============================
def extract_amazon_price(html: str):
    patterns = [
        r'"priceAmount":"([\d\.]+)"',
        r'₹\s?([\d,]+)'
    ]

    for p in patterns:
        m = re.search(p, html)
        if m:
            return float(m.group(1).replace(",", ""))
    return 0


def search_amazon(product: str):

    url = f"https://www.amazon.in/s?k={product}"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "Chrome/120.0 Safari/537.36"
        ),
        "Accept-Language": "en-IN,en;q=0.9",
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            proxies=get_proxy(),
            timeout=10
        )

        if response.status_code != 200:
            return []

        html = response.text
        asins = list(set(re.findall(r'data-asin="([A-Z0-9]{10})"', html)))

        products = []

        for asin in asins[:5]:
            product_url = f"https://www.amazon.in/dp/{asin}"

            page = requests.get(
                product_url,
                headers=headers,
                proxies=get_proxy(),
                timeout=10
            )

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
# AI SCORING
# ==============================
def calculate_score(item, min_price):

    price = item["price"]

    if min_price > 0:
        ratio = price / min_price
        price_score = max(0, 10 - (ratio - 1) * 5)
    else:
        price_score = 5

    trust = 2 if item["site"] == "Amazon" else 1

    final = (price_score * 0.7) + (trust * 3)

    item["score"] = round(final * 10, 2)
    return item


# ==============================
# COMPARE PRODUCTS
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
# CLICK TRACKING
# ==============================
@app.get("/track-click")
def track_click(link: str, product: str):

    db = SessionLocal()

    click = Click(
        product=product,
        link=link
    )

    db.add(click)
    db.commit()
    db.close()

    return RedirectResponse(url=link)


# ==============================
# DASHBOARD
# ==============================
@app.get("/dashboard")
def dashboard():

    db = SessionLocal()

    total = db.query(Click).count()
    amazon = db.query(Click).filter(Click.link.contains("amazon")).count()
    ebay = db.query(Click).filter(Click.link.contains("ebay")).count()

    db.close()

    return {
        "total_clicks": total,
        "amazon_clicks": amazon,
        "ebay_clicks": ebay,
    }


# ==============================
# PRICE ALERTS
# ==============================
@app.get("/set-alert")
def set_alert(product: str, target_price: float):

    db = SessionLocal()

    alert = PriceAlert(
        product=product,
        target_price=target_price
    )

    db.add(alert)
    db.commit()
    db.close()

    return {"status": "alert_set"}


@app.get("/alerts")
def get_alerts():

    db = SessionLocal()
    alerts = db.query(PriceAlert).all()

    data = [
        {
            "product": a.product,
            "target": a.target_price,
            "created": a.created_at,
        }
        for a in alerts
    ]

    db.close()
    return data


# ==============================
# ROOT
# ==============================
@app.get("/")
def root():
    return {"message": "MoolyaSetu AI backend running 🚀"}
