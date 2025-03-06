#   Here all the database schema are defined
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from sqlalchemy import String, Integer, Float, Boolean, Date, DateTime, Text
from uuid import uuid4


db = SQLAlchemy()
class User(db.Model, UserMixin):
    __tablename_ = "user"
    id = db.Column(String,primary_key=True)
    email = db.Column(String,unique=True, nullable=False)
    password = db.Column(String,nullable=False)
    fs_uniquifier = db.Column(String,unique=True,nullable=False,default=str(uuid4()))
    active = db.Column(Boolean, default=True)
    created_at = db.Column(String)
    roles = db.Relationship('Role', backref='bearers', secondary='user_roles')

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    name = db.Column(String, unique=True, nullable=False)
    description = db.Column(String, nullable=False)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(String, db.ForeignKey('user.id'))
    role_id = db.Column(Integer, db.ForeignKey('role.id'))


