#   Here all the database schema are defined
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy import String, Integer, Float, Boolean, Date, DateTime, Text
from uuid import uuid4


db = SQLAlchemy()
class User(db.Model, UserMixin):
    __tablename__ = "user"
    id = db.Column(String,primary_key=True)
    email = db.Column(String,unique=True, nullable=False)
    password = db.Column(String,nullable=False)
    fs_uniquifier = db.Column(String,unique=True,nullable=False,default=str(uuid4()))
    active = db.Column(Boolean, default=True)
    created_at = db.Column(String)
    roles = db.relationship('Role', cascade="all, delete", backref='bearers', secondary='user_roles')
    

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, unique=True, nullable=False)
    description = db.Column(String, nullable=False)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    role_id = db.Column(Integer, db.ForeignKey('role.id', ondelete='CASCADE'), nullable=False)
    # ondelete=CASCADE delete associated entry of user_roles table when a user or a role got deleted.

class Admin(db.Model):
    __tablename__='admin'
    id = db.Column(String, primary_key=True)
    first_name = db.Column(String)
    mid_name = db.Column(String)
    last_name = db.Column(String)
    dob = db.Column(String)
    department = db.Column(String)
    
class Student(db.Model):
    __tablename__='student'
    id = db.Column(String,  primary_key=True)
    first_name = db.Column(String)
    mid_name = db.Column(String)
    last_name = db.Column(String)
    dob = db.Column(String)
    scores = db.relationship('Score', backref='students', cascade='all, delete')

class Subject(db.Model):
    __tablename__ = 'subject'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    description = db.Column(String)
    chapters = db.relationship('Chapter', cascade="all, delete", backref='subject')

class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, nullable=False)
    description = db.Column(String)
    subject_id = db.Column(Integer, db.ForeignKey('subject.id', ondelete='CASCADE'), nullable=False)
    quizzes = db.relationship('Quiz', cascade="all, delete", backref='chapter')

class Quiz(db.Model):  
    __tablename__= 'quiz'  
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    title = db.Column(String, nullable=False)
    date_of_quiz = db.Column(String, nullable=False)
    duration = db.Column(Integer, nullable=False)
    description = db.Column(String)
    chapter_id = db.Column(Integer, db.ForeignKey('chapter.id', ondelete='CASCADE'), nullable=False)
    questions = db.relationship('Question', cascade="all, delete", backref='quiz')
    scores = db.relationship('Score', backref='quiz')

class Question(db.Model):
    __tablename__= 'question' 
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    question_statement = db.Column(String, nullable=False)
    op1 = db.Column(String, nullable=False)
    op2 = db.Column(String, nullable=False)
    op3 = db.Column(String, nullable=False)
    op4 = db.Column(String, nullable=False)
    correct_op = db.Column(Integer, nullable=False)
    quiz_id = db.Column(Integer, db.ForeignKey('quiz.id', ondelete='CASCADE'), nullable=False)

class Score(db.Model):
    __tablename__= 'score' 
    __table_args__ = (
        db.UniqueConstraint('user_id','quiz_id','attempt_number'),
    )
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(String, db.ForeignKey('student.id', ondelete='CASCADE'), nullable=False)
    quiz_id = db.Column(Integer, db.ForeignKey('quiz.id'))
    attempt_number = db.Column(Integer, nullable=False)
    score = db.Column(Float, nullable=False)
    timestamp = db.Column(String, nullable=False)

