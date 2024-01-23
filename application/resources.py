from datetime import datetime
from flask_restful import Resource,Api,reqparse,marshal_with,fields
from .models import Product, Section,ShoppingCart, User,db,Purchase
from flask_security import auth_required,roles_required,roles_accepted,current_user
from datetime import datetime
from sqlalchemy import and_
from sqlalchemy.orm import joinedload
from .cacheobject import cache


parser = reqparse.RequestParser()

api=Api(prefix='/api')

#-----TEST API------------------------------------------------------------------------------------------------------------------------------# 

parser.add_argument('ProductName', type=str,help='Product name cannot be empty and should be a string', required=True)
parser.add_argument('Description', type=str,help='Description cannot be empty and should be a string', required=True)
parser.add_argument('RatePerUnit', type=float,help='Rate per unit cannot be empty and should be a float', required=True)

product = {
    'ProductID' : fields.Integer,
    'ProductName' :   fields.String,
    'Description' :   fields.String,
    'RatePerUnit':    fields.Float
    }

class TestAPI(Resource):
    @marshal_with(product)
    def get(self):
        All_products=Product.query.all()
        return All_products
        # return {"message": "Test API working properly"}
    def post(self):
        args = parser.parse_args()
        product=Product(**args)
        db.session.add(product)
        db.session.commit()
        print("Product added!")
        return {"message":"Product added!"}
    pass
#----------------------------------------------------------------------------------------------------------------------------------------#



#-----SECTION API------------------------------------------------------------------------------------------------------------------------------# 
section_parser = reqparse.RequestParser()
section_parser.add_argument('SectionName', type=str, help='Section name cannot be empty and should be a string', required=True)


class Creator(fields.Raw):
    def format(self, user):
        return user.email

product_fields = {
    'ProductID': fields.Integer,
    'ProductName': fields.String,
    'Description': fields.String,
    'RatePerUnit': fields.Float
}

section_fields = {
    'SectionID': fields.Integer,
    'SectionName': fields.String,
    'creator': Creator,
    'ApprovalStatus': fields.Boolean,
    'products': fields.List(fields.Nested(product_fields))
}


class SectionAPI(Resource):

    @auth_required("token")
    @marshal_with(section_fields)
    def get(self, section_id):
        section = Section.query.get(section_id)
        if not section:
            return {"message": "Section not found"}, 404

        if section.ApprovalStatus or current_user.has_role('admin'):
            # those sections only which are created by that manager or the admin
            products = Product.query.filter_by(SectionID=section_id).order_by(Product.ProductID.desc()).all()
            section.products = products
            return section
        else:
            return {"message": "Access denied"}, 403

    @auth_required("token")
    @roles_accepted('admin','manager')
    @marshal_with(section_fields)
    def put(self, section_id):
        args = section_parser.parse_args()
        section = Section.query.get(section_id)
        if section:
            if current_user.has_role('manager'):
                #so that any manager doesn't accidentally update another creator's section
                if section.CreatorID != current_user.id:
                    return {"message": "You can't modify this section as it is created by Adminstrator"}, 403
            section.SectionName = args['SectionName']
            db.session.commit()
            return section
        else:
            return {"message": "Section not found"}, 404
    
    @auth_required("token")
    @roles_accepted('admin', 'manager')
    def delete(self, section_id):
        section = Section.query.get(section_id)

        if not section:
            return {"message": "Section not found"}, 404

        if current_user.has_role('manager') and section.CreatorID != current_user.id :
            #so that any manager doesn't accidentally update another creator's section
            return {"message": "You don't have permission to delete this section as it is not created by you"}, 403

        db.session.delete(section)
        db.session.commit()

        return {"message": "Section deleted"}


class SectionListAPI(Resource):

    @auth_required("token")
    @marshal_with(section_fields)
    # @cache.cached(timeout=40)
    def get(self):
        if current_user.has_role('admin'):
            sections = Section.query.filter_by(CreatorID=current_user.id).all()
        elif current_user.has_role('manager'):
            # only created by that manager which got approved or belong to admin
            sections = Section.query.filter(
                (Section.CreatorID == current_user.id) | (Section.CreatorID == 1),
                Section.ApprovalStatus == True
            ).all()
        else:
            # for users who are here for shopping,show approved sections created by anyone
            sections = Section.query.filter_by(ApprovalStatus=True).all()

        for section in sections:
            # section.creator
            products = Product.query.filter_by(SectionID=section.SectionID).order_by(Product.ProductID.desc()).all()
            section.products = products
        return sections
    
    @auth_required("token")
    @roles_accepted('admin','manager')
    @marshal_with(section_fields)
    def post(self):
        args = section_parser.parse_args()
        section = Section(**args,CreatorID=current_user.id)
        if current_user.has_role('admin'):
            section.ApprovalStatus = True
        elif current_user.has_role('manager'):
            #default setting so that it goes for approval 
            section.ApprovalStatus = False
        db.session.add(section)
        db.session.commit()
        return section, 201
#----------------------------------------------------------------------------------------------------------------------------------------#

#-----PRODUCT------------------------------------------------------------------------------------------------------------------------------# 
product_parser = reqparse.RequestParser()
product_parser.add_argument('ProductName', type=str, help='Product name cannot be empty and should be a string', required=True)
product_parser.add_argument('Description', type=str, help='Description cannot be empty and should be a string', required=True)
product_parser.add_argument('RatePerUnit', type=float, help='Rate per unit cannot be empty and should be a float', required=True)
product_parser.add_argument('StockQuantity', type=int, help='Stock quantity should be an integer', required=True)
product_parser.add_argument('SectionID', type=int, help='Section ID should be provided', required=True)

product_fields = {
    'ProductID': fields.Integer,
    'ProductName': fields.String,
    'Description': fields.String,
    'RatePerUnit': fields.Float,
    'StockQuantity': fields.Integer,
    'SectionID': fields.Integer
}

class ProductAPI(Resource):

    @marshal_with(product_fields)
    def get(self, product_id):
        product = Product.query.get(product_id)
        if product:
            return product
        else:
            return {"message": "Product not found"}, 404

    @marshal_with(product_fields)
    def get(self):
        #latest product will be shown first
        all_products = Product.query.order_by(Product.ProductID.desc()).all()
        return all_products

    @auth_required("token")
    @roles_required("manager")
    @marshal_with(product_fields)
    def put(self, product_id):
        args = product_parser.parse_args()
        product = Product.query.get(product_id)
        if product:
            product.ProductName = args['ProductName']
            product.Description = args['Description']
            product.RatePerUnit = args['RatePerUnit']
            product.StockQuantity = args['StockQuantity']
            product.SectionID = args['SectionID']
            db.session.commit()
            return product
        else:
            return {"message": "Product not found"}, 404
    
    @auth_required("token")
    @roles_required('manager')
    def delete(self, product_id):
        product = Product.query.get(product_id)
        if product:
            db.session.delete(product)
            db.session.commit()
            return {"message": "Product deleted"}
        else:
            return {"message": "Product not found"}, 404

    @auth_required("token")
    @roles_required('manager')
    @marshal_with(product_fields)
    def post(self):
        args = product_parser.parse_args()
        new_product = Product(**args)
        db.session.add(new_product)
        db.session.commit()

        section = Section.query.get(args['SectionID'])
        if section:
            section.products.append(new_product)
            db.session.commit()

        return new_product, 201
#----------------------------------------------------------------------------------------------------------------------------------------#


#-----SHOPPING CART------------------------------------------------------------------------------------------------------------------------------# 
cart_parser = reqparse.RequestParser()
cart_parser.add_argument('ProductID', type=int, help='Product ID should be provided', required=True)
cart_parser.add_argument('Quantity', type=int, help='Quantity should be an integer', required=True)

cart_fields = {
    'CartID': fields.Integer,
    'UserID': fields.Integer,
    'ProductID': fields.Integer,
    'PName':fields.String,
    'Quantity': fields.Integer,
    'TotalPrice': fields.Float,
    'PurchaseDate': fields.DateTime
}

class ShoppingCartAPI(Resource):
    @auth_required("token")
    @marshal_with(cart_fields)
    def get(self):
        # all products in the user's cart
        user_carts = ShoppingCart.query.filter_by(UserID=current_user.id).all()

        
        if not user_carts:
            new_cart = ShoppingCart(UserID=current_user.id, PurchaseDate=datetime.now())
            db.session.add(new_cart)
            db.session.commit()
            user_carts = [new_cart]  

        return user_carts

    @auth_required("token")
    @roles_required('user')
    @marshal_with(cart_fields)
    def put(self):
        args = cart_parser.parse_args()
        product = Product.query.get(args['ProductID'])


        if product and product.StockQuantity >= args['Quantity']:
            
            user_cart = ShoppingCart.query.filter_by(UserID=current_user.id).first()

            if not user_cart:
                new_cart = ShoppingCart(UserID=current_user.id,PName=product.ProductName,PurchaseDate=datetime.now())
                db.session.add(new_cart)
                db.session.commit()
                user_cart = new_cart

            existing_cart_item = ShoppingCart.query.filter_by(UserID=current_user.id, ProductID=args['ProductID']).first()

            if existing_cart_item:

                existing_cart_item.Quantity += args['Quantity']
                existing_cart_item.TotalPrice = existing_cart_item.Quantity * product.RatePerUnit
                updated_cart_item = existing_cart_item
            else:

                new_cart_item = ShoppingCart(UserID=current_user.id, **args,
                                             TotalPrice=product.RatePerUnit * args['Quantity'],
                                             PName=product.ProductName,
                                             PurchaseDate=datetime.now())
                db.session.add(new_cart_item)
                updated_cart_item = new_cart_item

            product.StockQuantity -= args['Quantity']

            db.session.commit()
            return updated_cart_item, 201
        else:
            return {"message": "Product not found or insufficient stock"}, 404

    @auth_required("token")
    @roles_required('user')
    @marshal_with(cart_fields)
    def patch(self,cart_id):
        cart_parser = reqparse.RequestParser()
        cart_parser.add_argument('Quantity', type=int, help='Quantity should be an integer', required=True)
        args = cart_parser.parse_args()
        user_cart = ShoppingCart.query.filter_by(UserID=current_user.id, CartID=cart_id).first()

        if user_cart:
            product = Product.query.get(user_cart.ProductID)
            if product:

                new_total_price = args['Quantity'] * product.RatePerUnit

                #updation of all columns
                user_cart.Quantity = args['Quantity']
                user_cart.TotalPrice = new_total_price

                #so that stock stays updated
                product.StockQuantity += (user_cart.Quantity - args['Quantity'])

                db.session.commit()
                return user_cart
            else:
                return {"message": "Product not found"}, 404
        else:
            return {"message": "Cart item not found"}, 404

    @auth_required("token")
    @roles_required('user')
    def delete(self):
        # Delete all cart items for the user
        cart_items = ShoppingCart.query.filter_by(UserID=current_user.id).all()
        for cart_item in cart_items:
            if cart_item:
                # before deletion stock restoring
                if cart_item.ProductID is not None:
                    product = Product.query.get(cart_item.ProductID)
                    if product:
                        product.StockQuantity += cart_item.Quantity
                db.session.delete(cart_item)
                db.session.commit()

        return {"message": "All cart items removed for the user"}
#----------------------------------------------------------------------------------------------------------------------------------------#


#-----PURCHASE------------------------------------------------------------------------------------------------------------------------------# 

# purchase_parser.add_argument('UserID', type=int, help='User ID should be provided', required=True)

purchase_fields = {
    'PurchaseID': fields.Integer,
    'UserID': fields.Integer,
    'ProductID': fields.Integer,
    'PName':fields.String,
    'Quantity': fields.Integer,
    'TotalPrice': fields.Float,
    'PurchaseDate': fields.DateTime
}

class PurchaseAPI(Resource):
    purchase_parser = reqparse.RequestParser()
    @auth_required("token")
    @marshal_with(purchase_fields)
    @cache.cached(timeout=40)
    def get(self):
        purchases = Purchase.query.filter_by(UserID=current_user.id).all()
        
        if not purchases:
            return {"message": "No purchases yet"}
        
        return purchases

    @auth_required("token")
    def post(self):
        args = self.purchase_parser.parse_args()

        # all non empty cart items
        cart_items = ShoppingCart.query.filter_by(UserID=current_user.id).filter(ShoppingCart.TotalPrice.isnot(None)).all()

        if not cart_items:
            return {"message": "No eligible cart items found for purchase"}, 404

        # purchase every cart item
        for cart_item in cart_items:
            purchase = Purchase(UserID=current_user.id,
                                ProductID=cart_item.ProductID,
                                PName=cart_item.PName,
                                Quantity=cart_item.Quantity,
                                TotalPrice=cart_item.TotalPrice,
                                PurchaseDate=datetime.now())
            db.session.add(purchase)

            
            product = Product.query.get(cart_item.ProductID)
            if product:
                product.StockQuantity += cart_item.Quantity

            db.session.delete(cart_item)

        db.session.commit()

        return {"message": "Purchase completed successfully"}

#----------------------------------------------------------------------------------------------------------------------------------------#



#-----SEARCH FEATURE------------------------------------------------------------------------------------------------------------------------------# 

product_fields = {
    'ProductID': fields.Integer,
    'ProductName': fields.String,
    'Description': fields.String,
    'RatePerUnit': fields.Float,
    'SectionID': fields.Integer,
    # 'ImageURL': fields.String,
    'StockQuantity': fields.Integer,
}

class SearchAPI(Resource):
#optional search feature at backend
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument('out_of_stock', type=bool, help='Include Out of Stock or not')
        self.parser.add_argument('price_range', type=str, help='Price range should be in the format min-max')
        self.parser.add_argument('product_name', type=str, help='Product name for search')

    @marshal_with(product_fields)
    def get(self):
        args = self.parser.parse_args()
        out_of_stock=args.get('out_of_stock')
        price_range = args.get('price_range')
        product_name = args.get('product_name')

      
        query = Product.query

        if price_range:
            min_price, max_price = map(float, price_range.split('-'))
            query = query.filter(Product.RatePerUnit.between(min_price, max_price))

        if product_name:
            query = query.filter(Product.ProductName.ilike(f"%{product_name}%"))

        if out_of_stock is not None:
            if out_of_stock:
                query = query.filter(Product.StockQuantity <= 0)
            else:
                query = query.filter(Product.StockQuantity > 0)

        
        search_results = query.all()
        return search_results
    pass

#----------------------------------------------------------------------------------------------------------------------------------------#


api.add_resource(TestAPI, '/test')
api.add_resource(SectionAPI, '/sections/<int:section_id>')
api.add_resource(SectionListAPI, '/sections')
api.add_resource(ProductAPI, '/products/<int:product_id>','/products','/all-products')
api.add_resource(ShoppingCartAPI,'/cart','/cart/<int:cart_id>')
api.add_resource(PurchaseAPI, '/purchase/')
api.add_resource(SearchAPI, '/search')
