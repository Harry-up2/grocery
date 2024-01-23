from flask import current_app as app , jsonify , request , render_template, send_file
from werkzeug.security import generate_password_hash,check_password_hash
from flask_security import auth_required,roles_required,logout_user,current_user
from .models import Product, Section, db,User
from .sec import datastore
from .tasks import create_products_csv
import flask_excel as excel
from celery.result import AsyncResult


#---Test Home Page-------------------------------------------------------------------------------------------------------------------------------------#
@app.get('/')
def home():
    # return "Hello world"
    return(render_template("index.html"))
#----------------------------------------------------------------------------------------------------------------------------------------#

#---Test Admin Page-------------------------------------------------------------------------------------------------------------------------------------#
@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Welcome admin"
#----------------------------------------------------------------------------------------------------------------------------------------#

#---REGISTRATION PAGE-------------------------------------------------------------------------------------------------------------------------------------#
@app.post('/user-register')
def user_register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not email or not password or not role:
        return jsonify({"message": "Email, password, and role are required"}), 400

    existing_user = datastore.find_user(email=email)
    if existing_user:
        return jsonify({"message": "Email is already registered"}), 400

    if role=="admin":
        return jsonify({"message":"An admin already exists and there can only be one admin"})

    if role not in ["manager", "user"]:
        return jsonify({"message": "Invalid role"}), 400

  
    # # if role == "admin" and datastore.find_user(roles="admin"):
    # if role=="admin" and user_datastore.find_user(roles=user_datastore.find_role('admin')):
    #     return jsonify({"message": "Admin already exists"}), 400

   
    
    new_user = datastore.create_user(email=email, password=generate_password_hash(password), roles=[role])
    # print("after creating user")

    try:
        # print("before adding user")
        db.session.add(new_user)
        # print("after adding and before commiting")
        db.session.commit()
        # print("after commiting")
        if "manager" in new_user.roles:
            new_user.active = False
            db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return {"message": "Failed to register user", "error": str(e)}, 500
#----------------------------------------------------------------------------------------------------------------------------------------#


#----LOGIN PAGE------------------------------------------------------------------------------------------------------------------------------------#
@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if not user.active:
        return jsonify({"message": "Your account has been successfully registered.Wait for an admin approval for your account activation."}), 401  # Unauthorized

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400
#----------------------------------------------------------------------------------------------------------------------------------------#

#------MANAGER ACCOUNT REQUESTS----------------------------------------------------------------------------------------------------------------------------------#
@app.get('/manager-id-requests')
@auth_required("token")
@roles_required("admin")
def manager_id_requests():
    # those managers who haven't been approved yet
    manager_requests = User.query.filter(User.active == False, User.roles.any(name="manager")).all()
    if not manager_requests:
        return jsonify({"message": "No new section requests"}), 200
   
    manager_info = [{"id": manager.id, "email": manager.email} for manager in manager_requests]

    return jsonify({"manager_ids": manager_info})
#----------------------------------------------------------------------------------------------------------------------------------------#


#------MANAGER ACCOUNT ACTIVATION----------------------------------------------------------------------------------------------------------------------------------#
@app.get('/activate/manager/<int:manager_id>')
@auth_required("token")
@roles_required("admin")
def activate_manager(manager_id):
    manager = User.query.get(manager_id)
    if not manager or "manager" not in manager.roles:
        return jsonify({"message": "Manager not found"}), 404
    
    manager.active = True
    db.session.commit()
    return jsonify({"message": "Manager Activated"})
#----------------------------------------------------------------------------------------------------------------------------------------#

#-----SECTION ACTIVATION REQUESTS-----------------------------------------------------------------------------------------------------------------------------------#
@app.get('/section-requests')
@auth_required("token")
@roles_required("admin")
def section_requests():
    # those sections which are yet to get approval
    section_requests = Section.query.filter(Section.ApprovalStatus == False).all()
    if not section_requests:
        return jsonify({"message": "No new section requests"}), 200
    
    section_info = [{"id": section.SectionID, "name": section.SectionName} for section in section_requests]

    return jsonify({"section_info": section_info})
#----------------------------------------------------------------------------------------------------------------------------------------#

#-----SECTION ACTIVATION-----------------------------------------------------------------------------------------------------------------------------------#
# @app.route('/activate/section/<int:section_id>', methods=['PUT'])
@app.get('/activate/section/<int:section_id>')
@auth_required("token")
@roles_required("admin")
def activate_section(section_id):
    section = Section.query.get(section_id)
    if not section or section.CreatorID is None:
        return jsonify({"message": "Section not found or not created/requested by a manager"}), 404

    section.ApprovalStatus = True
    db.session.commit()
    return jsonify({"message": "Section Activated"})
#----------------------------------------------------------------------------------------------------------------------------------------#

#-----LOGOUT PAGE-----------------------------------------------------------------------------------------------------------------------------------#
@app.post('/user-logout')
def user_logout():
    
    auth_token = request.headers.get('Authorization-Token')

    if not auth_token:
        return jsonify({"message": "Authorization token not provided"}), 400

    logout_user()

    return jsonify({"message": "User logged out successfully"})
#----------------------------------------------------------------------------------------------------------------------------------------#

#-----ACCOUNT DELETION-----------------------------------------------------------------------------------------------------------------------------------#
@app.delete('/delete-user/<int:user_id>')
@auth_required("token")
@roles_required("admin")
def delete_user(user_id):
    user_to_delete = User.query.get(user_id)

    if not user_to_delete:
        return jsonify({"message": "User not found"}), 404


    if "admin" in current_user.roles:
        
        if "admin" in user_to_delete.roles:
            return jsonify({"message": "Admin accounts cannot be deleted by other admins"}), 403

        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200

   #only self delete and manager declineation of approval
    if current_user.id == user_to_delete.id or "manager" in current_user.roles:
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200

    return jsonify({"message": "Permission denied"}), 403
#----------------------------------------------------------------------------------------------------------------------------------------#


#-----EXPORT AS CSV-----------------------------------------------------------------------------------------------------------------------------------#
@app.get('/download-csv')
def download_csv():
    task = create_products_csv.delay()
    return jsonify({"task-id": task.id})


@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        # return send_file(filename, as_attachment=True,download_name=str(filename),mimetype="text/csv")
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404
#----------------------------------------------------------------------------------------------------------------------------------------#