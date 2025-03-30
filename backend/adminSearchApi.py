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
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "DB_ERROR"
        }),500
    else:
        return jsonify(result)
    
@app.route('/api/all-count',methods=['GET'])
@auth_required('token')
@roles_accepted('admin')
def summaryAll():
    try:
        student_count = Student.query.count()
        quiz_count = Quiz.query.count()
        chapter_count = Quiz.query.count()
        subject_count = Subject.query.count()
        question_count = Question.query.count()

        all_subjects = Subject.query.all()
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "DB_ERROR"
        }),500
    else:
        all_stat = [
            student_count,
            quiz_count,
            chapter_count,
            subject_count,
            question_count
        ]
        sub_names = []
        chap_count = []
        chap_name = []
        quiz_count = []
        for sub in all_subjects:
            sub_names.append(sub.name)
            chap_count.append(len(sub.chapters))
        print()

        return jsonify({
            'all_stat' : all_stat,
            'subject_list' : sub_names,
            'chapter_count': chap_count
        })
    

@app.route('/api/chapter-wise-question-count',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def quizCount():
    try:
        subject_name = request.get_json().get("subject_name")
        print(subject_name)
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "DB_ERROR"
        }),500
    else:
        try:
            print(subject_name)
            sub = Subject.query.filter_by(name=subject_name).first()
        except Exception as e:
            print(e)
            return jsonify({
                "MESSAGE" : "DB_ERROR"
            }),500
        else:
            chap_name = []
            quiz_count = []
            for chap in sub.chapters:
                chap_name.append(chap.name)
                quiz_count.append(len(chap.quizzes))
        return jsonify({
            'chapter_list' : chap_name,
            'quiz_count': quiz_count
        })    