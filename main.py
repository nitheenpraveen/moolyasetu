from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import ProductComparison, PriceAlert
from database import get_db, engine
import models

# Create tables automatically on startup (optional, but useful if you don't use migrations yet)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS setup ---
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://your-frontend.vercel.app",  # replace with your actual Vercel frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints ---

@app.get("/compare")
def compare_products(product: str, db: Session = Depends(get_db)):
    # Placeholder: replace with real API integration
    return {"product": product, "prices": "API data here"}

@app.get("/alerts")
def list_alerts(db: Session = Depends(get_db)):
    alerts = db.query(PriceAlert).all()
    # Convert SQLAlchemy objects to dicts for JSON response
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
    return {"message": "Hello from FastAPI on Heroku!"}