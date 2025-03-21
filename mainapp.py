from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore, hash_password
from backend.config import LocalDevelopmentConfig
from backend.model import db, User, Role, Admin
from datetime import datetime

""" 
    this "app" is central Flask object we will do everything in this 
    application which will be associated with it. 
"""


def BuildApp():
    app = Flask(__name__,template_folder='frontend',static_folder='frontend')
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)  

    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app=app, datastore=user_datastore, register_blueprint=False)
    
    app.app_context().push()
    return app

app = BuildApp()

from backend.userInterface import *
from backend.auth import *
from backend.getData import *
from backend.resource import *

if __name__ == "__main__":
    userdatastore = app.security.datastore
    db.create_all()
    
    userdatastore.find_or_create_role(name='admin', description= 'quizmaster')
    userdatastore.find_or_create_role(name='student', description= 'users')

    if(not userdatastore.find_user(email='akash2001kumbhakar@gmail.com')):
        user = userdatastore.create_user(
            id = 'AD0000180625',
            email = 'akash2001kumbhakar@gmail.com',
            password = hash_password('masterpass'),
            created_at = datetime.now().strftime("%d/%m/%Y, %I:%M:%S")
        )
        userdatastore.add_role_to_user(user,'admin')
        admin = Admin(id=user.id,first_name='Akash',last_name='Kumbhakar',dob='18-06-2001',department='HR')
        db.session.add(admin)
    db.session.commit()
    app.run(host='0.0.0.0', port=5000,debug=False)