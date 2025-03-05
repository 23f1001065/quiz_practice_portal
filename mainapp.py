from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore

""" 
    this "app" is central Flask object we will do everything in this 
    application which will be associated with it. 
"""
app = Flask(__name__,template_folder='frontend',static_folder='frontend')




app.app_context().push()
from backend.userInterface import *

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)