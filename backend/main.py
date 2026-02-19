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


# --- Enhanced Scoring Function ---
def calculate_score(item, min_price):
    # Price weight (cheapest gets highest score)
    price_score = 4 if item["price"] == min_price else 3

    # Review rating weight (convert 5-star into 0-4 scale)
    review_score = (item["reviews"] / 5) * 4

    # Review count trust factor
    if item["review_count"] > 1000:
        quality_score = 2
    elif item["review_count"] > 100:
        quality_score = 1
    else:
        quality_score = 0

    raw_score = price_score + review_score + quality_score

    # Convert to percentage scale (0–100)
    item["score"] = round((raw_score / 10) * 100, 2)

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

    # Sort results by score (highest first)
    sorted_results = sorted(scored_results, key=lambda x: x["score"], reverse=True)

    best = sorted_results[0]

    return {
        "best_option": best,
        "all_results": sorted_results
    }


@app.get("/")
def root():
    return {"message": "Product comparison AI engine is live!"}
