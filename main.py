from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
ffrom models import ProductComparison, PriceAlert, ContactMessage
from database import get_db
from auth import create_access_token, verify_token, verify_password, ADMIN_USERNAME, ADMIN_PASSWORD_HASH

app = FastAPI()

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == ADMIN_USERNAME and verify_password(form_data.password, ADMIN_PASSWORD_HASH):
        access_token = create_access_token(data={"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/admin/messages")
def get_messages(db: Session = Depends(get_db), token: dict = Depends(verify_token)):
    return db.query(ContactMessage).all()

# Your existing endpoints remain unchanged
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