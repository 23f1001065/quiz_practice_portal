from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted
from .model import db, Subject, Chapter, Quiz, Question
import json


@app.route('/api/create-quiz',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def createQuiz():
    try:
        input = request.get_json()
        chapter_id = input.get('chapter_id')
        quiz_title = input.get('title')
        duration = input.get('duration')
        date = input.get('date')
        time = input.get('time')
    except:
        return jsonify({
            "MESSAGE" : "Error getting data"
        }),400
    
    try:
        quiz = Quiz(title=quiz_title,duration=duration,date_of_quiz=date,time=time,chapter_id=chapter_id)
        db.session.add(quiz)
    except:
        return jsonify({
            "MESSAGE" : "Database server error"
        }),500
    else:
        db.session.commit()
        return jsonify({
            "MESSAGE" : "New Quiz created successfully",
            "id" : quiz.id
        }), 200
        
    

@app.route('/api/all-quiz',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def getAllQuiz():
    try:
        input_data = request.get_json()
        chapter_id = input_data.get('chapter_id')
        chapter = Chapter.query.filter_by(id=chapter_id).first()
        if chapter:
            quizzes = chapter.quizzes
            all_quizzes = [{"id" : quiz.id, "title" : quiz.title, "chapter" : chapter.name, "duration" : quiz.duration, "date" : quiz.date_of_quiz, "time" : quiz.time} for quiz in quizzes]
        else:
            all_quizzes = []
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify({
            "chapter_name" : chapter.name,
            "quizzes" : all_quizzes
        }), 200

@app.route('/api/edit-quiz',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def editQuiz():
    try:
        input = request.get_json()
        quiz_id = input.get('quiz_id')
        quiz_title = input.get('title')
        duration = input.get('duration')
        date = input.get('date')
        time = input.get('time')
    except:
        return jsonify({
            "MESSAGE" : "Error getting data"
        }),400
    
    try:
        quiz = Quiz.query.filter_by(id=quiz_id).first_or_404()
        quiz.title = quiz_title
        quiz.duration = duration
        quiz.date_of_quiz = date
        quiz.time = time
        db.session.add(quiz)
    except:
        return jsonify({
            "MESSAGE" : "Database server error"
        }),500
    else:
        db.session.commit()
        return jsonify({
            "MESSAGE" : "Quiz updated successfully"
        }), 200


@app.route('/api/delete-quiz',methods=['DELETE'])
@auth_required('token')
@roles_accepted('admin')
def deleteQuiz():
    try:
        input = request.get_json()
        id = input.get("id")
        quiz = Quiz.query.filter_by(id=id).first_or_404()
    except:
        return jsonify({
            "MESSAGE" : "Error getting object"
        })
    else:
        db.session.delete(quiz)
        db.session.commit()
        return jsonify({
            "MESSAGE" : "Quiz deleted successfully"
        })


@app.route('/api/create-question',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def createQuestion():
    try:
        input = request.get_json()
        quiz_id = input.get("quiz_id")
        statement = input.get("statement")
        print(statement)
        op1 = input.get("op1")
        op2 = input.get("op2")
        op3 = input.get("op3")
        op4 = input.get("op4")
        cor_opt = input.get("cor_opt")
        point = input.get("point")
    except:
        return jsonify({
            "MESSAGE" : "Error getting data"
        }),400    

    try:
        question = Question(question_statement=statement,op1=op1,op2=op2,op3=op3,op4=op4,correct_op=cor_opt,point=point,quiz_id=quiz_id)
        db.session.add(question)
    except:
        return jsonify({
            "MESSAGE" : "Database server error"
        }),500
    else:
        db.session.commit()
        return jsonify({
            "MESSAGE" : "New Question created successfully",
            "id" : question.id
        }), 200


@app.route('/api/all-question',methods=['POST'])
@auth_required('token')
@roles_accepted('admin')
def getAllQuestion():
    try:
        input_data = request.get_json()
        print(input_data)
        quiz_id = input_data.get('quiz_id')
        print(quiz_id)
        quiz = Quiz.query.filter_by(id=quiz_id).first()
        print(quiz_id,quiz)
        if quiz:
            questions = quiz.questions
            all_questions = [
                                {
                                    "id" : question.id, 
                                    "statement" : question.question_statement,
                                    "quiz_title" : quiz.title, 
                                    "op1": question.op1,
                                    "op2":question.op2,
                                    "op3":question.op3,
                                    "op4":question.op4,
                                    "cor_opt":question.correct_op,
                                    "point":question.point
                                } 
                                for question in questions
                            ]
                              
        else:
            all_questions = []
    except:
        return jsonify({
            'MESSAGE' : 'Database Server Error'
        }), 500
    else:
        return jsonify({
            "quiz_title" : quiz.title,
            "questions" : all_questions
        }), 200
    
@app.route('/api/edit-question',methods=['PUT'])
@auth_required('token')
@roles_accepted('admin')
def editQuestion():
    try:
        input = request.get_json()
        id = input.get("id")
        statement = input.get("statement")
        print(statement)
        op1 = input.get("op1")
        op2 = input.get("op2")
        op3 = input.get("op3")
        op4 = input.get("op4")
        cor_opt = input.get("cor_opt")
        point = input.get("point")
    except:
        return jsonify({
            "MESSAGE" : "Error getting data"
        }),400    

    try:
        question = Question.query.filter_by(id = id).first_or_404()
        question.question_statement = statement
        question.op1 = op1
        question.op2 = op2
        question.op3 = op3
        question.op4 = op4
        question.correct_op = cor_opt
        question.point = point
        db.session.add(question)
    except:
        return jsonify({
            "MESSAGE" : "Database server error"
        }),500
    else:
        db.session.commit()
        return jsonify({
            "MESSAGE" : "Question updated successfully"
        }), 200




@app.route('/api/delete-question',methods=['DELETE'])
@auth_required('token')
@roles_accepted('admin')
def deleteQu():
    try:
        input = request.get_json()
        id = input.get("id")
        question = Question.query.filter_by(id=id).first_or_404()
    except:
        return jsonify({
            "MESSAGE" : "Error getting object"
        })
    else:
        db.session.delete(question)
        db.session.commit()
        return jsonify({
            "MESSAGE" : "Question deleted successfully"
        })
    

@app.route('/api/get-all-quizzes-with-chapter-name',methods=['GET'])
@auth_required('token')
@roles_accepted('student')
def getAllQ():
    try:
        chapters = Chapter.query.all()
        
        final_list = []
        for chapter in chapters:
            for quiz in chapter.quizzes:
                no_of_question = 0
                full_marks = 0
                for question in quiz.questions:
                    no_of_question += 1
                    full_marks = full_marks + question.point
                final_list.append(
                    {
                        "chapter_name" : chapter.name,
                        "id" : quiz.id,
                        "title" : quiz.title,
                        "duration" : quiz.duration,
                        "description" : quiz.description,
                        "chapter_id" : quiz.chapter_id,
                        "total_question" : no_of_question,
                        "full_marks" : full_marks
                    }
                )
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "ERROR fetching chapters"
        }), 400
    
    else:
        return jsonify(final_list)
    