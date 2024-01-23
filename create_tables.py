from main import app
from application.models import db,Role
from application.sec import datastore

from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="Admin privileges")
    datastore.find_or_create_role(name="manager", description="Manager privileges")
    datastore.find_or_create_role(name="user", description="User privileges")
    db.session.commit()
    if not datastore.find_user(email="admin@gmail.com"):
        datastore.create_user(email="admin@gmail.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="manager@gmail.com"):
        datastore.create_user(email="manager@gmail.com", password=generate_password_hash("manager"), roles=["manager"], active=False)
    if not datastore.find_user(email="user@gmail.com"):
        datastore.create_user(email="user@gmail.com", password=generate_password_hash("user"), roles=["user"])
    
    db.session.commit()

