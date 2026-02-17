import requests

BASE_URL = "http://127.0.0.1:8000"  # local FastAPI server

def test_root():
    r = requests.get(f"{BASE_URL}/")
    print("Root:", r.json())

def test_compare():
    r = requests.get(f"{BASE_URL}/compare", params={"product": "shoes"})
    print("Compare:", r.json())

def test_list_alerts():
    r = requests.get(f"{BASE_URL}/alerts")
    print("Alerts:", r.json())

def test_create_alert():
    payload = {"product": "shoes", "site": "Amazon", "alert_type": "price_drop"}
    r = requests.post(f"{BASE_URL}/alerts", params=payload)
    print("Create Alert:", r.json())

def test_dashboard():
    r = requests.get(f"{BASE_URL}/dashboard")
    print("Dashboard:", r.json())

if __name__ == "__main__":
    test_root()
    test_compare()
    test_list_alerts()
    test_create_alert()
    test_dashboard()