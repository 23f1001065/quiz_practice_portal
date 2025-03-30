from flask import current_app as app, request, Response, jsonify
from flask_security import verify_password, hash_password, current_user, auth_required, roles_accepted

from .model import db, Subject, Chapter, Quiz, Question, Score
import json
from datetime import datetime, timedelta




@app.route('/api/get-question', methods=["POST"])
@auth_required('token')
@roles_accepted('student')
def getQuestions():
    try:
        input = request.get_json()
        quiz_id = int(input.get("quiz_id"))
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "error getting data"
        }),404
    else:
        try:
            quiz = Quiz.query.filter_by(id=quiz_id).first_or_404()
            chapter_name = Chapter.query.filter_by(id=quiz.chapter_id).first().name
        except Exception as e:
            print(e)
            return jsonify({
                "MESSAGE" : "DB_ERROR"
            }),500
        else:
            full_marks = 0
            for qu in quiz.questions:
                full_marks += qu.point
            quiz_object = {
                "quiz":{
                    "id" : quiz.id,
                    "title" : quiz.title,
                    "duration" : quiz.duration,
                    "chapter_name" : chapter_name,
                    "full_marks" : full_marks
                },
                "questions" : [
                    {
                        "id" : question.id,
                        "statement" : question.question_statement,
                        "point" : question.point,
                        "op1" : question.op1,
                        "op2" : question.op2,
                        "op3" : question.op3,
                        "op4" : question.op4
                    } for question in quiz.questions
                ]
            }
            return jsonify(quiz_object)


    

@app.route('/api/start-quiz', methods=["POST"])
@auth_required('token')
@roles_accepted('student')
def startQuiz():
    user_id = current_user.id
    try:
        quiz_id = int(request.get_json().get('quiz_id'))
        start_time_str = request.get_json().get('start_time')
        quiz = Score.query.filter_by(user_id=user_id,quiz_id=quiz_id).all()
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : 'ERROR_GETING_DATA'
        }),400
    
    last_attempted_quiz = None
    max_attempt = 0
    if len(quiz) != 0:
        max_attempt = max([q.attempt_number for q in quiz])
        last_attempted_quiz = Score.query.filter_by(user_id=user_id,quiz_id=quiz_id,attempt_number=max_attempt).first()

    if last_attempted_quiz:
        if last_attempted_quiz.status == "ongoing":
            return jsonify({
                "MESSAGE" : "ONGOING_QUIZ",
                "CODE" : 403
            }),403
        start_time = datetime.fromisoformat(start_time_str.replace("Z",""))
        last_time = datetime.fromisoformat(last_attempted_quiz.timestamp.replace("Z",""))
        if start_time < last_time + timedelta(hours=1):
            return jsonify({
                "MESSAGE" : "Please wait for your reattempting.",
                "CODE": 423
            }), 423 # locking quiz reattempt for 1 hrs

    try:  
        new_attempt_quiz = Score(
            user_id=current_user.id,
            quiz_id=quiz_id,
            attempt_number = max_attempt + 1,
            score = 0, #temporarily given zero , updated after submission
            timestamp = start_time_str,
            status = 'ongoing',
            time_taken = 0
        )
    except:
        return jsonify({
            "MESSAGE" : "DB_ERROR"
        }),500
    else:
        db.session.add(new_attempt_quiz)
        db.session.commit()
        return jsonify({
            "MESSAGE" : "EXAM START SUCCESSFULLY.",
            "score_id" : new_attempt_quiz.id
        }),200

@app.route('/api/evalution-quiz', methods=["POST"])
@auth_required('token')
@roles_accepted('student')
def getScore():
    try:
        input = request.get_json()
        submit_id = input.get("score_id")
        quiz_id = int(input.get("quiz_id"))
        time_taken = input.get("time_taken")
        submitted_answers = input.get("answers")
    except Exception as e:
        return jsonify({
            "MESSAGE" : "ERROR_GETTING_DATA_THROUGH_API"
        }),400

    else:
        result = []
        score = 0
        full_marks = 0
        try:
            questions = Question.query.filter_by(quiz_id=quiz_id).all()
        except:
            return jsonify({
                "MESSAGE" : "DB_ERROR_WHILE_EVAL_EXAM"
            }),500
        for ans in submitted_answers:
            question_id = ans['question_id']
            selectedOp = ans['selectedOp']
            correctOp = None
            for question in questions:
                if question.id == question_id:
                    correctOp = question.correct_op
                    point = question.point
            is_correct = correctOp == selectedOp
            if is_correct:
                score = score + point
            result.append({
                "question_id" : question_id,
                "selectedOp" : selectedOp,
                "correctOp" : correctOp,
                "is_correct" : is_correct
            })

        try:
            new_attempt = Score.query.filter_by(id=submit_id).first_or_404()
        except:
            return jsonify({
                "MESSAGE" : "DB_ERROR_WHILE_SUBMIT_EXAM"
            }),500
        else:
            new_attempt.status = "completed"
            new_attempt.score = score
            new_attempt.time_taken = time_taken
            db.session.add(new_attempt)
            db.session.commit()
        

        return jsonify({
            "quiz_id" : quiz_id,
            "result" : result,
            "score" : score,
            "time_taken" : time_taken
        })


@app.route('/api/get-all-quiz-attempt', methods=['GET'])
@auth_required('token')
@roles_accepted('student')
def getAllQuizAttempt():
    try:
        all_attempts = Score.query.filter_by(user_id=current_user.id).all()
    except Exception as e:
        print(e)
        return jsonify({
            "MESSAGE" : "DB_ERROR"
        }),500
    else:
        json_object = [
            {
                "id" : attempt.id,
                "user_id" : attempt.user_id,
                "quiz_id" : attempt.quiz_id,
                "attempt_number" : attempt.attempt_number,
                "score" : attempt.score,
                "timestamp" : attempt.timestamp,
                "time_taken" : attempt.time_taken
            }for attempt in all_attempts if attempt.status == "completed"
        ]

        return jsonify(json_object)