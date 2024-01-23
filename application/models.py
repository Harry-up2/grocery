from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class Role(db.Model,RoleMixin):
    __tablename__ = 'role'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)
    description = db.Column(db.String(255))

class User(db.Model,UserMixin):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    #role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role',secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
    section = db.relationship('Section', backref='creator')
    purchases = db.relationship('Purchase', backref='user')
    shopping_cart = db.relationship('ShoppingCart', backref='user')

class Section(db.Model):
    __tablename__ = 'section'
    
    SectionID = db.Column(db.Integer, primary_key=True)
    SectionName = db.Column(db.String(100))
    CreatorID = db.Column(db.Integer, db.ForeignKey('user.id'))
    ApprovalStatus = db.Column(db.Boolean(),default=False)
    products = db.relationship('Product', backref='section', lazy='dynamic')

    

class Product(db.Model):
    __tablename__ = 'product'
    
    ProductID = db.Column(db.Integer, primary_key=True)
    ProductName = db.Column(db.String(100))
    Description = db.Column(db.String)
    RatePerUnit = db.Column(db.Float)
    SectionID = db.Column(db.Integer, db.ForeignKey('section.SectionID'))
    # ImageURL = db.Column(db.String(255))
    StockQuantity = db.Column(db.Integer)
    
cart_product = db.Table(
    'cart_product',
    db.Column('cart_id', db.Integer, db.ForeignKey('shopping_cart.CartID')),
    db.Column('product_id', db.Integer, db.ForeignKey('product.ProductID'))
)

class ShoppingCart(db.Model):
    __tablename__ = 'shopping_cart'
    
    CartID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('user.id'))
    ProductID = db.Column(db.Integer, db.ForeignKey('product.ProductID'))
    PName = db.Column(db.String(100))
    Quantity = db.Column(db.Integer)
    TotalPrice = db.Column(db.Float)
    PurchaseDate = db.Column(db.DateTime)

    products = db.relationship('Product', secondary=cart_product, backref=db.backref('carts', lazy='dynamic'))

class Purchase(db.Model):
    __tablename__ = 'purchase'

    PurchaseID = db.Column(db.Integer, primary_key=True)
    UserID = db.Column(db.Integer, db.ForeignKey('user.id'))
    ProductID = db.Column(db.Integer, db.ForeignKey('product.ProductID'))
    PName = db.Column(db.String(100))
    Quantity = db.Column(db.Integer)
    TotalPrice = db.Column(db.Float)
    PurchaseDate = db.Column(db.DateTime)

    product = db.relationship('Product', backref='purchases')

