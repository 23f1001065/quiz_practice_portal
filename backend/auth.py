from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password
from .model import db, Student
from random import randint
import json

def create_id(role):
    if role == 'admin':
        id = 'AD'+ ''.join(str(randint(0,9)) for _ in range(10))
    else:
        id = 'SD'+ ''.join(str(randint(0,9)) for _ in range(10))

    return id

datastore = app.security.datastore

@app.route('/api/login', methods=['POST'])
def login():
    try:
        input_data = request.get_json()
        email = input_data.get('email')
        password = input_data.get('password')   
    except:
        return jsonify({
            'MESSAGE' : 'ERROR while getting data'
        }), 400

    if not email or not password:
        return jsonify({
            'MESSAGE' : 'Invalid Inputs',
            'CODE' : 'INV_INPUT'
        }), 404
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({
            'MESSAGE' : 'Invalid Email',
            'CODE' : 'INV_EMAIL'
        }), 404
    
    if verify_password(password, user.password):
        role = user.roles[0].name
        output_auth_data = {
            'isLoggedIn' : True,
            'id' : user.id,
            'email' : user.email,
            'role' : role,
            'auth_token' : user.get_auth_token()
        }
        response = Response(
            response = json.dumps(output_auth_data),
            status = 200,
            mimetype = 'application/json'
        )
        return response
    else:
        return jsonify({
            'MESSAGE' : 'Wrong Password ',
            'CODE' : 'WRONG_PASS'
        }), 400
    
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name')
        mid_name = data.get('mid_name')
        last_name = data.get('last_name')
        registered_date = data.get('registered_at')
    except:
        return jsonify({
            'MESSAGE' : 'Error fetching data',
            'CODE': 400
        })
    if not email or not first_name or not last_name or not password or not registered_date:
        return jsonify({
            'MESSAGE' : 'Invalid inputs',
            'CODE' : 404
        }), 404
    user = datastore.find_user(email=email)
    if user:
        return jsonify({
            'MESSAGE' : 'User Exists with this email',
            'CODE': 404
        }), 404
    try:
        id = create_id('student')
        user = datastore.create_user(
            id = id,
            email = email,
            password = hash_password(password),
            created_at = registered_date
        )
        datastore.add_role_to_user(user,'student')
        new_student = Student(id=id, first_name=first_name, mid_name=mid_name, last_name=last_name)
    except Exception as error:
        print(error)
        return jsonify({
            'MESSAGE' : 'Error while creating user',
        }), 400
    else:
        db.session.add(new_student)
        db.session.commit()
        return jsonify({
            'MESSAGE' : 'Account created successfully'
        }), 200
    
    



    