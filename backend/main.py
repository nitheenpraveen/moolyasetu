from fastapi import FastAPI, Query

app = FastAPI()

# --- Placeholder search functions ---
def search_amazon(product: str):
    return {"site": "Amazon", "price": 499, "reviews": 4.5, "review_count": 1200}

def search_flipkart(product: str):
    return {"site": "Flipkart", "price": 479, "reviews": 4.2, "review_count": 800}

def search_myntra(product: str):
    return {"site": "Myntra", "price": 510, "reviews": 4.7, "review_count": 300}

def search_nykaa(product: str):
    return {"site": "Nykaa", "price": 450, "reviews": 4.3, "review_count": 600}

def search_meesho(product: str):
    return {"site": "Meesho", "price": 430, "reviews": 4.0, "review_count": 200}

def search_snapdeal(product: str):
    return {"site": "Snapdeal", "price": 470, "reviews": 3.9, "review_count": 150}

def search_tatacliq(product: str):
    return {"site": "TataCliq", "price": 520, "reviews": 4.6, "review_count": 400}

def search_ajio(product: str):
    return {"site": "Ajio", "price": 480, "reviews": 4.1, "review_count": 250}

# --- Scoring function ---
def calculate_score(item, min_price):
    price_score = 4 if item["price"] == min_price else 3
    review_score = round((item["reviews"] / 5) * 4, 1)
    quality_score = 2 if item["review_count"] > 1000 else (1 if item["review_count"] > 100 else 0)
    item["score"] = price_score + review_score + quality_score
    return item

# --- Compare endpoint ---
@app.get("/compare")
def compare_products(product: str = Query(..., description="Product name to search")):
    results = [
        search_amazon(product),
        search_flipkart(product),
        search_myntra(product),
        search_nykaa(product),
        search_meesho(product),
        search_snapdeal(product),
        search_tatacliq(product),
        search_ajio(product),
    ]

    min_price = min(r["price"] for r in results)
    scored_results = [calculate_score(r, min_price) for r in results]
    best = max(scored_results, key=lambda x: x["score"])
    return {"best_option": best, "all_results": scored_results}

@app.get("/")
def root():
    return {"message": "Product comparison API is live!"}