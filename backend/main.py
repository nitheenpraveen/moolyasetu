import os
import re
import requests
from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.responses import RedirectResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

app = FastAPI()

# =====================================================
# 🔥 DATABASE CONNECTION (HEROKU + SQLALCHEMY SAFE)
# =====================================================

DATABASE_URL = os.getenv("DATABASE_URL")

print("RAW DATABASE URL:", DATABASE_URL)

engine = None
SessionLocal = None

if DATABASE_URL:
    # Fix legacy Heroku postgres:// issue
    DATABASE_URL = DATABASE_URL.replace(
        "postgres://",
        "postgresql+psycopg2://"
    )

    print("FINAL DATABASE URL:", DATABASE_URL.split("@")[0])

    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
        )

        SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=engine,
        )

        print("✅ PostgreSQL connected successfully")

    except Exception as e:
        print("❌ Database connection failed:", str(e))

else:
    print("⚠️ No DATABASE_URL found — running without DB")


# =====================================================
# ENV VARIABLES
# =====================================================

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")
AMAZON_TAG = os.getenv("AMAZON_TAG", "moolyasetu-21")


# =====================================================
# PROXY SYSTEM (Future Ready)
# =====================================================

PROXIES = [None]

def get_proxy():
    if PROXIES[0]:
        return {"http": PROXIES[0], "https": PROXIES[0]}
    return None


# =====================================================
# EBAY TOKEN
# =====================================================

def get_ebay_token():
    if not EBAY_CLIENT_ID or not EBAY_CLIENT_SECRET:
        print("⚠️ eBay keys missing")
        return None

    try:
        auth = requests.auth.HTTPBasicAuth(
            EBAY_CLIENT_ID,
            EBAY_CLIENT_SECRET
        )

        response = requests.post(
            "https://api.ebay.com/identity/v1/oauth2/token",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={
                "grant_type": "client_credentials",
                "scope": "https://api.ebay.com/oauth/api_scope",
            },
            auth=auth,
            timeout=10,
        )

        return response.json().get("access_token")

    except Exception as e:
        print("EBAY TOKEN ERROR:", str(e))
        return None


# =====================================================
# EBAY SEARCH
# =====================================================

def search_ebay(product: str):
    try:
        token = get_ebay_token()

        if not token:
            return []

        response = requests.get(
            "https://api.ebay.com/buy/browse/v1/item_summary/search",
            headers={
                "Authorization": f"Bearer {token}",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY-IN",
            },
            params={"q": product, "limit": 8},
            timeout=10,
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

        print("eBay results:", len(products))
        return products

    except Exception as e:
        print("EBAY ERROR:", str(e))
        return []


# =====================================================
# AMAZON SCRAPER
# =====================================================

def extract_amazon_price(html: str):
    patterns = [
        r'"priceAmount":"([\d\.]+)"',
        r'"price":"([\d\.]+)"',
        r'₹\s?([\d,]+)',
    ]

    for p in patterns:
        match = re.search(p, html)
        if match:
            return float(match.group(1).replace(",", ""))

    return 0


def search_amazon(product: str):
    try:
        print("Amazon scraping:", product)

        url = f"https://www.amazon.in/s?k={product}"

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0 Safari/537.36"
            ),
            "Accept-Language": "en-IN,en;q=0.9",
        }

        response = requests.get(
            url,
            headers=headers,
            proxies=get_proxy(),
            timeout=15,
        )

        html = response.text

        if "captcha" in html.lower():
            print("🚨 Amazon CAPTCHA triggered")
            return []

        asins = list(set(re.findall(r'data-asin="([A-Z0-9]{10})"', html)))

        products = []

        for asin in asins[:5]:
            product_url = f"https://www.amazon.in/dp/{asin}"

            page = requests.get(
                product_url,
                headers=headers,
                proxies=get_proxy(),
                timeout=15,
            )

            price = extract_amazon_price(page.text)
            affiliate_link = f"{product_url}?tag={AMAZON_TAG}"

            products.append({
                "site": "Amazon",
                "title": f"Amazon Product {asin}",
                "price": price,
                "link": affiliate_link,
            })

        print("Amazon results:", len(products))
        return products

    except Exception as e:
        print("Amazon error:", str(e))
        return []


# =====================================================
# AI SCORING
# =====================================================

def calculate_score(item, min_price):
    price = item["price"]

    if min_price > 0:
        ratio = price / min_price
        price_score = max(0, 10 - (ratio - 1) * 6)
    else:
        price_score = 5

    trust = 2 if item["site"] == "Amazon" else 1
    final_score = (price_score * 0.75) + (trust * 2.5)

    item["score"] = round(final_score * 10, 2)
    return item


# =====================================================
# COMPARE API
# =====================================================

@app.get("/compare")
def compare_products(product: str = Query(...)):
    print("🔥 Comparing:", product)

    ebay_results = search_ebay(product)
    amazon_results = search_amazon(product)

    results = ebay_results + amazon_results

    if not results:
        return {"detail": "No products found"}

    valid_prices = [r["price"] for r in results if r["price"] > 0]
    min_price = min(valid_prices) if valid_prices else 1

    scored = [calculate_score(r, min_price) for r in results]
    sorted_results = sorted(scored, key=lambda x: x["score"], reverse=True)

    return {
        "best_option": sorted_results[0],
        "all_results": sorted_results,
    }


# =====================================================
# CLICK TRACKING
# =====================================================

@app.get("/track-click")
def track_click(link: str, product: str):
    print("CLICK:", product, link, datetime.utcnow())
    return RedirectResponse(url=link)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():
    return {"message": "MoolyaSetu backend running 🚀"}
