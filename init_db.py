from database import Base, engine
from models import PriceAlert, ProductComparison, ContactMessage

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")