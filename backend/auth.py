from flask import Blueprint, request, jsonify
from flask_jwt import JWT, jwt_required, current_identity
import bcrypt
from flask_expects_json import expects_json
from .models import User, Block
from . import db, jwt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import datetime

auth = Blueprint('auth', __name__)


schema = {
    'type': 'object',
    'properties': {
        'username': {'type': 'string'},
        'password': {'type': 'string'}
    },
    'required':['username', 'password']
}


@auth.route('/login', methods=['POST'])
@expects_json(schema)
def login():
    content = request.json
    username = (content['username']).lower()
    target = User.query.filter_by(username = username).first()
    if not target:
        return jsonify(error = "Invalid Password"), 401
    password = content['password'].encode('utf-8')
    stored = target.password
    if bcrypt.checkpw(password, stored):
        access_token = create_access_token(identity=target.id, expires_delta = datetime.timedelta(minutes=3600))
        print("yessir")        
        return jsonify(access_token = access_token, id = target.id, username = username), 200
    return jsonify(error = "Invalid Password"), 401
    

@auth.route('/logout')
def logout():
    return "<p> Logout route </p>"


@auth.route('/register', methods=['POST'])
@expects_json(schema)
def register():
    content = request.json
    username = (content['username']).lower()
    if User.query.filter_by(username = username).first():
        return 'User already exists!', 401
    password = content['password'].encode('utf-8')
    hashedpw = bcrypt.hashpw(password, bcrypt.gensalt())
    newUser = User(username = username, password = hashedpw)
    db.session.add(newUser)
    db.session.commit()
    return 'Successfully Registered', 200











