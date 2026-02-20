from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base


# 🔥 Product comparisons (existing)
class ProductComparison(Base):
    __tablename__ = "product_comparisons"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    site = Column(String)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)


# 🔥 Alerts (existing)
class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    site = Column(String)
    alert_type = Column(String)
    active = Column(Integer)


# 🔥 NEW: Verified deals table
class VerifiedDeal(Base):
    __tablename__ = "verified_deals"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    site = Column(String)
    price = Column(Float)
    original_price = Column(Float)
    discount_percent = Column(Float)

    confidence_score = Column(Float)
    deal_score = Column(Float)

    is_fake = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
