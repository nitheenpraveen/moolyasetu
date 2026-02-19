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
async def fetch_ebay_results(product: str):
    # Temporary mock data
    return [
        {
            "title": f"{product} Example Item",
            "price": 1999,
            "currency": "INR",
            "seller": "demo_seller",
            "rating": 95
        }
    ]


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
