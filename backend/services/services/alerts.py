alerts = []

def create_alert(user, product, target_price):
    alerts.append({
        "user": user,
        "product": product,
        "price": target_price
    })
