from celery import shared_task
import flask_excel as excel
from weasyprint import HTML
from .models import Product
from .models import db,Product,Purchase
from sqlalchemy import func
from datetime import datetime
from .mail_service import send_message, send_report_email,send_webhook

from jinja2 import Template
from .models import User, Role
from jinja2 import Environment, FileSystemLoader

import csv,base64
from io import StringIO,BytesIO

@shared_task(ignore_result=False)
def create_products_csv():
    #for creating the csv file for all products
    products_with_quantity_sold = (
        db.session.query(
            Product.ProductID,
            Product.ProductName,
            Product.Description,
            Product.RatePerUnit,
            Product.StockQuantity,
            # Product.SectionID,
            func.sum(Purchase.Quantity).label('QuantitySold')
        )
        .outerjoin(Purchase, Product.ProductID == Purchase.ProductID)
        .group_by(Product.ProductID)
        .all()
    )

    # type conversion to list of dictionaries
    all_products = [product._asdict() for product in products_with_quantity_sold]

    
    csv_data = StringIO()
    csv_writer = csv.DictWriter(csv_data, fieldnames=["ProductID", "ProductName", "Description", "RatePerUnit", "StockQuantity", "QuantitySold"])
    csv_writer.writeheader()
    csv_writer.writerows(all_products)

    
    filename = "test.csv"
    with open(filename, 'w', newline='') as f:
        f.write(csv_data.getvalue())

    return filename




# @shared_task(ignore_result=True)
# def daily_reminder(to, subject):
#     users = User.query.filter(User.roles.any(Role.name == 'admin')).all()
#     for user in users:
#         with open('application/mail_templates/dailyreminder.html', 'r') as f:
#             template = Template(f.read())
#             send_message(to, subject,
#                          template.render(email=user.email))
#     return "OK"

@shared_task(ignore_result=True)
def daily_reminder(subject, message):
    # users who haven't visited or bought anything
    users = (
        User.query
        .filter(User.roles.any(Role.name == 'user'))
        .filter(
            ~User.id.in_(
                db.session.query(User.id).join(Purchase).filter(Purchase.UserID == User.id)
            )
        )
        .all()
    )

    
    for user in users:
        with open('application/mail_templates/dailyreminder.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject, template.render(email=user.email, message=message))
            send_webhook('https://chat.googleapis.com/v1/spaces/AAAAVbLn-UY/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=5xv6RQVaJyT0ou6Cw7SEDTOkIleWgt7X8st5xt7yswY', message, user.email)

    return "OK"

jinja_env = Environment(loader=FileSystemLoader('application/mail_templates'))

def generate_monthly_report(user, purchases):

    template = jinja_env.get_template('monthly_report.html')
    report_html = template.render(user=user, purchases=purchases)
    return report_html


@shared_task(ignore_result=True)
def monthly_activity_report(subject, message):

    today = datetime.utcnow()
    first_day_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # users who have done even a single purchase this month
    users = (
        User.query
        .filter(User.roles.any(Role.name == 'user'))
        .filter(
            User.id.in_(
                db.session.query(User.id).join(Purchase).filter(
                    Purchase.UserID == User.id,
                    Purchase.PurchaseDate >= first_day_of_month
                )
            )
        )
        .all()
    )

  
    for user in users:
        purchases = Purchase.query.filter_by(UserID=user.id).filter(Purchase.PurchaseDate >= first_day_of_month).all()
        report_html = generate_monthly_report(user, purchases)
        pdf_file = generate_pdf(report_html)
        send_report_email(user.email, subject, message, report_html,pdf_file)

def generate_pdf(html_content):

    pdf_bytes = HTML(string=html_content).write_pdf()
    return BytesIO(pdf_bytes)


