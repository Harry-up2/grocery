from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import requests

SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'grocerymart@gmail.com'
SENDER_PASSWORD = ''

#mail for daily reminder for those who haven't bought anything
def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

#monthly report reminder mail for the users
def send_report_email(to,subject, message, report_html,pdf_file):

    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(report_html, 'html'))

    pdf_attachment = MIMEText(pdf_file.getvalue(), 'pdf', 'pdf')
    pdf_attachment.add_header('Content-Disposition', 'attachment; filename=monthly_report.pdf')
    msg.attach(pdf_attachment)

    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()

#same daily reminder via webhoook
def send_webhook(webhook_url, message, user_email):
    payload = {'text': f"{message}\n  Hey @{user_email},please visit Grocerymart to find new offers"}
    response = requests.post(webhook_url, json=payload)

    if response.status_code == 200:
        return f"Message sent successfully to {webhook_url}"
    else:
        return f"Failed to send message. Status code: {response.status_code}"