from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import os

Base = declarative_base()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ProductComparison(Base):
    __tablename__ = "product_comparisons"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    site = Column(String)
    price = Column(Float)
    timestamp = Column(DateTime)

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    site = Column(String)
    alert_type = Column(String)
    active = Column(Integer)
