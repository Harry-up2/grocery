
from main import app


def send_webhook(webhook_url, message, user_email):
 with app.app_context():
        payload = {'text': f"{message}\n  Hey @{user_email},please visit Grocerymart to find new offers"}
        response = app.requests.post(webhook_url, json=payload)

        if response.status_code == 200:
            return f"Message sent successfully to {webhook_url}"
        else:
            return f"Failed to send message. Status code: {response.status_code}"