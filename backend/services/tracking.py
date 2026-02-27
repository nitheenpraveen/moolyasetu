from datetime import datetime

clicks = []

def track_click(user, product, link):
    clicks.append({
        "user": user,
        "product": product,
        "link": link,
        "time": datetime.utcnow()
    })
