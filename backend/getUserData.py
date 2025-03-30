from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted
from .model import db, Admin, Student, Subject, Chapter
import json



@app.route('/api/admin-information', methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def getAdminData():
    try:
        input_data = request.get_json()
        id = input_data.get('id')
        admin = Admin.query.filter_by(id=id).one_or_none()
    except:
        return jsonify({
            'MESSAGE' : 'ERROR accessing data'
        }), 400
    
    if(admin):
        return jsonify({
            'first_name' : admin.first_name,
            'mid_name' : admin.mid_name,
            'last_name' : admin.last_name,
            'dob' : admin.dob,
            'department' : admin.department
        }), 200
    else:
        return jsonify({
            'MESSAGE' : 'NO_ADMIN_FOUND'
        }), 400
    
@app.route('/api/student-information', methods=['POST'])
@auth_required('token')
@roles_accepted('student')
def getStudentData():
    try:
        input_data = request.get_json()
        id = input_data.get('id')
        student = Student.query.filter_by(id=id).one_or_none()
    except:
        return jsonify({
            'MESSAGE' : 'ERROR accessing data'
        }), 400
    
    if(student):
        return jsonify({
            'first_name' : student.first_name,
            'mid_name' : student.mid_name,
            'last_name' : student.last_name,
            'dob' : student.dob
        }), 200
    else:
        return jsonify({
            'MESSAGE' : 'NO_STUDENT_FOUND'
        }), 400


        
