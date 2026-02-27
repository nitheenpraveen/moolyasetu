def extract_model_score(title: str):
    t = title.lower()

    modern = {
        "15": 12, "14": 11, "13": 10, "12": 9,
        "11": 8, "x": 7, "se": 6
    }

    for k, v in modern.items():
        if f"iphone {k}" in t:
            return v

    return 5


def extract_condition_score(title: str):
    t = title.lower()

    if "brand new" in t: return 6
    if "open box" in t: return 5
    if "excellent" in t: return 4
    if "very good" in t: return 3
    if "good" in t: return 2
    if "refurbished" in t: return 2

    return 3


def calculate_score(item, min_price):
    price = item.get("price", 0)

    if price == 0:
        item["score"] = 0
        return item

    ratio = price / min_price
    price_score = max(0, 10 - (ratio - 1) * 5)

    model_score = extract_model_score(item["title"])
    condition_score = extract_condition_score(item["title"])

    final = (
        price_score * 0.5 +
        model_score * 0.35 +
        condition_score * 0.15
    )

    item["score"] = round(final * 10, 2)
    return item
