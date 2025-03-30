from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted
from .model import db, Subject, Chapter, Quiz, Question, Student


@app.route('/api/search-resource',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def searchSubject():
    try:
        input = request.get_json()
        to_search = input.get('to_search')
        search_value = input.get('search_value')
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "ERROR_GETTING_SEARCH_VALUE"
        }),400
    
    try:
        result = []
        if to_search == "subject":
            subjects = Subject.query.filter(Subject.name.ilike(f"%{search_value}%")).all()
            for subject in subjects:
                each_sub = {
                    "id" : subject.id,
                    "name" : subject.name,
                    "description" : subject.description
                }
                result.append(each_sub)
        if to_search == "user":
            students = Student.query.filter(Student.first_name.ilike(f"%{search_value}%")).all()
            for student in students:
                each_sub = {
                    "id" : student.id,
                    "first_name" : student.first_name,
                    "mid_name" : student.mid_name,
                    "last_name" : student.last_name,
                }
                result.append(each_sub)
        if to_search == "quiz":
            chapters = Chapter.query.filter(Chapter.name.ilike(f"%{search_value}%")).all()
            for chapter in chapters:
                for quiz in chapter.quizzes:
                    each_quiz = {
                        "id" : quiz.id,
                        "title" : quiz.title,
                        "date_of_quiz" : quiz.date_of_quiz,
                        "time" : quiz.time,
                        "duration" : quiz.duration,
                        "description" : quiz.description,
                        "chapter_name" : chapter.name,
                    }
                    result.append(each_quiz)
                
            pass
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "DB_ERROR"
        }),500
    else:
        return jsonify(result)
    
