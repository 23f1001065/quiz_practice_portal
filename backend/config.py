import os
import secrets

class Config():
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class LocalDevelopmentConfig(Config):
    DEBUG = True
    SECURITY_DEBUG = True
    SQLITE_DB_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR,'DevDatabase.db')
    SECRET_KEY = 'super_secret_key_for_now'
    SECURITY_PASSWORD_SALT = 'some_salt_for_now'
    SECURITY_PASSWORD_HASH = 'bcrypt'


class ProductionDevelopmentConfig(Config):
    DEBUG = False
    SECURITY_DEBUG = False
    SQLITE_DB_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR,'ProdDatabase.db')
    SECRET_KEY = secrets.token_urlsafe()
    SECURITY_PASSWORD_SALT = secrets.SystemRandom().getrandbits(128)
    SECURITY_PASSWORD_HASH = 'bcrypt'
    pass