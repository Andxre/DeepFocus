from flask import Flask 
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
jwt = JWTManager()
DB_NAME = "database.db"


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'andre'
    app.config["JWT_SECRET_KEY"] = "super-secret"
    app.config['JSON_SORT_KEYS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(DB_NAME)
    db.init_app(app)
    jwt.init_app(app)
    from .routes import store
    app.register_blueprint(store, url_prefix='/')

    from .auth import auth
    app.register_blueprint(auth, url_prefix='/auth')

    from .models import User, Block
    create_database(app)

    return app

def create_database(app):
    if not path.exists('backend/' + DB_NAME):
        db.create_all(app=app)
        print('Created Database')