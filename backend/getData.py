from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted
from .model import db, Admin, Student, Subject
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

@app.route('/api/create-subject', methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def createSubject():
    try:
        input_data = request.get_json()
        subject_name = input_data.get('subject_name')
        description = input_data.get('description')
    except:
        return jsonify({
            'MESSAGE' : 'ERROR accessing data'
        }), 400
    
    try:
        new_subject = Subject(name=subject_name,description=description)
        db.session.add(new_subject)
        
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        db.session.commit()
        return jsonify({
            'MESSAGE' : 'New Subject Added successfully',
            'subject_id' : new_subject.id
        }), 200
    

@app.route('/api/all-subject', methods=['GET','POST'])
@auth_required('token')
@roles_accepted('admin')
def getAllSubject():
    try:
        subjects = Subject.query.all()
        all_subjects = [{"id" : subject.id, "name" : subject.name, "description" : subject.description} for subject in subjects]
        
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify(all_subjects)
    

@app.route('/api/subject/<op>',methods=['PUT'])
@auth_required('token')
@roles_accepted('admin')
def editOrDelete(op):
    if op == 'edit':
        try:
            data = request.get_json()
            subject_id = data.get('id')
            new_description = data.get('new_description')
            subject = Subject.query.filter_by(id=subject_id).first_or_404()
        except:
            return jsonify({
                "MESSAGE" : "No Subject Found"
            }),404
        else:
            subject.description = new_description
            db.session.add(subject)
            db.session.commit()
            return jsonify({
                "MESSAGE" : "Edited Successfully"
            }),200
    else:
        try:
            data = request.get_json()
            subject_id = data.get('id')
            subject = Subject.query.filter_by(id=subject_id).first_or_404()
        except:
            return jsonify({
                "MESSAGE" : "No Subject Found"
            }),404
        else:
            db.session.delete(subject)
            db.session.commit()
            return jsonify({
                "MESSAGE" : "Deleted Successfully"
            }),200