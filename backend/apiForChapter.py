from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted
from .model import db, Subject, Chapter
import json

@app.route('/api/create-chapter',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def createChapter():
    try:
        input_data = request.get_json()
        subject_id = input_data.get('subject_id')
        chapter_name = input_data.get('chapter_name')
        description = input_data.get('description')
    except:
        return jsonify({
            'MESSAGE' : 'ERROR accessing data'
        }), 400
    
    try:
        subject = Subject.query.filter_by(id=subject_id).first_or_404()
    except:
        return jsonify({
            'MESSAGE' : 'Subject not found'
        }), 404
    
    try:
        new_chapter = Chapter(name=chapter_name,description=description,subject_id=subject_id)
        db.session.add(new_chapter)
    
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 404
    else:
        db.session.commit()
        return jsonify({
            'MESSAGE' : 'New Subject Added successfully',
            'chapter_id' : new_chapter.id
        }), 200
    
        
        
    
@app.route('/api/all-chapter', methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def getAllChapter():
    try:
        input_data = request.get_json()
        subject_id = input_data.get('subject_id')
        subject = Subject.query.filter_by(id=subject_id).first()
        if subject:
            chapters = subject.chapters
            all_chapters = [{"id" : chapter.id, "name" : chapter.name, "description" : chapter.description} for chapter in chapters]
        else:
            all_chapters = []
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify({
            "subject_name" : subject.name,
            "chapters" : all_chapters
        }), 200
    
@app.route('/api/chapter/delete', methods=['DELETE'])
@auth_required('token')
@roles_accepted('admin')
def deleteChapter():
    try:
        input = request.get_json()
        chapter_id = input.get('chapter_id')
        chapter = Chapter.query.filter_by(id=chapter_id).first_or_404()
    except:
        return jsonify({
            "MESSAGE" : "No Chapter Found"
        }),404
    else:
        db.session.delete(chapter)
        db.session.commit()
        return jsonify({
            "MESSAGE" : "Deleted Successfully"
        }),200


@app.route('/api/chapter/edit', methods=['PUT'])
@auth_required('token')
@roles_accepted('admin')
def editChapter():
    try:
        input = request.get_json()
        id = input.get('id')
        description = input.get('description')
        chapter = Chapter.query.filter_by(id=id).first_or_404()
    except:
        return jsonify({
            "MESSAGE" : "No Chapter Found"
        }),404
    else:
        chapter.description = description
        db.session.add(chapter)
        db.session.commit()
        return jsonify({
            "MESSAGE" : "Updated Successfully"
        }),200