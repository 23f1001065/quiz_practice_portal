from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted
from .model import db, Subject, Chapter, Quiz, Question
import json


@app.route('/api/get-subject-id-name', methods=['GET','POST'])
@auth_required('token')
@roles_accepted('admin')
def getSubjectIdNames():
    try:
        subjects = Subject.query.all()
        all_subjects = [{"id" : subject.id, "name" : subject.name} for subject in subjects]
        
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify(all_subjects)
    

@app.route('/api/get-chapter-id-name', methods=['PUT'])
@auth_required('token')
@roles_accepted('admin')
def getChapterIdNames():
    try:
        data = request.get_json()
        subject_id = data.get('subject_id')
        if subject_id:
            chapters = Chapter.query.filter_by(subject_id=subject_id).all()
            all_chapters = [{"id" : chapter.id, "name" : chapter.name} for chapter in chapters]
        else:
            all_chapters = []    
        
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify(all_chapters)


@app.route('/api/get-quiz-id-title', methods=['PUT'])
@auth_required('token')
@roles_accepted('admin')
def getQuizIdTitle():
    try:
        data = request.get_json()
        chapter_id = data.get('chapter_id')
        if chapter_id:
            chapter = Chapter.query.filter_by(id=chapter_id).first()
            all_quizzes = [{"id" : quiz.id, "name" : quiz.title} for quiz in chapter.quizzes]
        else:
            all_quizzes = []
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify(all_quizzes)

@app.route('/api/get-quiz',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def getQuiz():
    try:
        input_data = request.get_json()
        quiz_id = input_data.get('quiz_id')
        quiz = Quiz.query.filter_by(id=quiz_id).first()
        if quiz:
            all_questions = [
                {
                    "id" : question.id,
                    "question_statement" : question.question_statement,
                    "op1" : question.op1,
                    "op2" : question.op2,
                    "op3" : question.op3,
                    "op4" : question.op4,
                    "correct_op" : question.correct_op,
                    "point" : question.point
                } for question in quiz.questions
            ]
            json_of_quiz = {
                "id" : quiz.id,
                "title" : quiz.title,
                "date_of_quiz" : quiz.date_of_quiz,
                "duration" : quiz.duration,
                "time" : quiz.time,
                "description" : quiz.description,
                "questions" : all_questions
            }
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify(json_of_quiz), 200