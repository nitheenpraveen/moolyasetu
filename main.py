from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models import ProductComparison, PriceAlert
from database import get_db, engine
import models
import time
import logging
import httpx
from fastapi.middleware.cors import CORSMiddleware

# Create tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Simple in-memory cache ---
cache = {}
CACHE_TTL = 600  # 10 minutes

# --- CORS setup ---
origins = [
    "https://your-frontend.vercel.app",  # replace this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# eBay search placeholder
# Replace this later with real eBay integration
# -----------------------------
import os
import base64

async def get_ebay_token():
    async with httpx.AsyncClient() as client:
        credentials = f"{os.getenv('EBAY_CLIENT_ID')}:{os.getenv('EBAY_CLIENT_SECRET')}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        response = await client.post(
            "https://api.ebay.com/identity/v1/oauth2/token",
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Basic {encoded_credentials}"
            },
            data="grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope"
        )

        response.raise_for_status()
        return response.json()["access_token"]


async def fetch_ebay_results(product: str):
    token = await get_ebay_token()

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.ebay.com/buy/browse/v1/item_summary/search",
            headers={
                "Authorization": f"Bearer {token}"
            },
            params={
                "q": product,
                "limit": 10
            }
        )

        response.raise_for_status()
        data = response.json()

        results = []

        for item in data.get("itemSummaries", []):
            results.append({
                "title": item.get("title"),
                "price": item.get("price", {}).get("value"),
                "currency": item.get("price", {}).get("currency"),
                "image": item.get("image", {}).get("imageUrl"),
                "item_url": item.get("itemWebUrl"),
                "seller": item.get("seller", {}).get("username"),
                "seller_rating": item.get("seller", {}).get("feedbackPercentage")
            })

        return results



# -----------------------------
# Compare Endpoint (UPGRADED)
# -----------------------------
@app.get("/compare")
async def compare_products(product: str, db: Session = Depends(get_db)):
    try:
        if not product:
            raise HTTPException(status_code=400, detail="Product query missing")

        current_time = time.time()

        # Cache check
        if product in cache:
            cached_data, timestamp = cache[product]
            if current_time - timestamp < CACHE_TTL:
                return cached_data

        start_time = time.time()

        # Fetch results (replace later with real eBay logic)
        results = await fetch_ebay_results(product)

        duration = round((time.time() - start_time) * 1000, 2)

        response_payload = {
            "success": True,
            "product": product,
            "results": results,
            "meta": {
                "response_time_ms": duration
            }
        }

        cache[product] = (response_payload, current_time)

        logger.info(f"Compare search: {product} | {duration}ms")

        return response_payload

    except Exception as e:
        logger.error(f"Compare error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch product comparison."
        )


# -----------------------------
# Alerts
# -----------------------------
@app.get("/alerts")
def list_alerts(db: Session = Depends(get_db)):
    alerts = db.query(PriceAlert).all()
    return [alert.__dict__ for alert in alerts]


@app.post("/alerts")
def create_alert(product: str, site: str, alert_type: str, db: Session = Depends(get_db)):
    new_alert = PriceAlert(product=product, site=site, alert_type=alert_type, active=1)
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return {"status": "alert created", "alert": new_alert.__dict__}


@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    alerts = db.query(PriceAlert).all()
    return {
        "alerts": [alert.__dict__ for alert in alerts],
        "forecasts": "forecast data here"
    }


@app.get("/")
def read_root():
    return {"message": "FastAPI backend running stable 🚀"}
