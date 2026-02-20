import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL")

# Fix Heroku postgres
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"})

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔥 Product price history (needed for fake discount detection)
class ProductPriceHistory(Base):
    __tablename__ = "product_price_history"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    site = Column(String)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)


# 🔥 Alerts
class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String)
    site = Column(String)
    alert_type = Column(String)
    active = Column(Integer)
