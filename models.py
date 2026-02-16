from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"  # Replace with Postgres later

Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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