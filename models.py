from sqlalchemy import Column, Integer, String, Text
from database import Base

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    site = Column(String)
    alert_type = Column(String)
    active = Column(Integer)

class ProductComparison(Base):
    __tablename__ = "product_comparisons"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    site = Column(String)
    price = Column(String)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(200))
    message = Column(Text)