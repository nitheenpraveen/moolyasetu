from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from models import ProductComparison, PriceAlert
from database import get_db


app = FastAPI()

@app.get("/compare")
def compare_products(product: str, db: Session = Depends(get_db)):
    return {"product": product, "prices": "API data here"}

@app.get("/alerts")
def list_alerts(db: Session = Depends(get_db)):
    return db.query(PriceAlert).all()

@app.post("/alerts")
def create_alert(product: str, site: str, alert_type: str, db: Session = Depends(get_db)):
    new_alert = PriceAlert(product=product, site=site, alert_type=alert_type, active=1)
    db.add(new_alert)
    db.commit()
    return {"status": "alert created"}

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    alerts = db.query(PriceAlert).all()
    return {"alerts": alerts, "forecasts": "forecast data here"}

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on Heroku!"}