from flask import Flask, request
from flask_security import SQLAlchemyUserDatastore, Security
from application.sec import datastore
from application.models import db
from config import DevelopmentConfig
from application.resources import api
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder, monthly_activity_report
from application.cacheobject import cache

def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security=Security(app,datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views
    return app

app = create_app()
celery_app=celery_init_app(app)

# @app.after_request
# def clear_cache(response):
#     if request.method!="GET":
#         cache.clear()

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=16, minute=23), 
        daily_reminder.s('Daily Reminder', 'Visit/Buy Alert'),
    )

@celery_app.on_after_configure.connect
def send_monthly_reports(sender, **kwargs):
    
    sender.add_periodic_task(
        crontab(hour=16, minute=23, day_of_month=26),
        monthly_activity_report.s('Monthly Activity Report', 'Monthly Report'),
    )


if __name__=='__main__':
    app.run(debug=True)