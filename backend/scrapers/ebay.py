import requests
import os

EBAY_CLIENT_ID = os.getenv("EBAY_CLIENT_ID")
EBAY_CLIENT_SECRET = os.getenv("EBAY_CLIENT_SECRET")


def get_token():
    if not EBAY_CLIENT_ID or not EBAY_CLIENT_SECRET:
        print("eBay credentials missing")
        return None

    auth = requests.auth.HTTPBasicAuth(
        EBAY_CLIENT_ID,
        EBAY_CLIENT_SECRET
    )

    r = requests.post(
        "https://api.ebay.com/identity/v1/oauth2/token",
        auth=auth,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "grant_type": "client_credentials",
            "scope": "https://api.ebay.com/oauth/api_scope"
        }
    )

    if r.status_code != 200:
        print("Token error:", r.text)
        return None

    return r.json().get("access_token")


def search_ebay(product: str):
    token = get_token()
    if not token:
        return []

    r = requests.get(
        "https://api.ebay.com/buy/browse/v1/item_summary/search",
        headers={
            "Authorization": f"Bearer {token}",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY-IN"
        },
        params={"q": product, "limit": 10}
    )

    if r.status_code != 200:
        print("Search error:", r.text)
        return []

    data = r.json()
    out = []

    for i in data.get("itemSummaries", []):
        try:
            out.append({
                "site": "eBay",
                "title": i["title"],
                "price": float(i["price"]["value"]),
                "link": i["itemWebUrl"]
            })
        except:
            continue

    return out
