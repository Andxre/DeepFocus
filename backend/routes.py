from flask import Blueprint, jsonify, request
from .models import User, Block
from . import db, jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from datetime import datetime


store = Blueprint('store', __name__)

@store.route('/')
def home():
    return 'Hello World'


@store.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as = current_user), 200

@store.route('/getUsers')
def getUsers():
    users = User.query.all()
    x = []
    for user in users:
        x.append({
            'userID': str(user.id),
            'username': str(user.username),
            'password': str(user.password)
        })
    return jsonify(users = x)


@store.route('/startTimer', methods=['POST'])
@jwt_required()
def startTimer():
    try:
        content = request.json
        goal = content['goal']
        print(goal)
        current_user = get_jwt_identity()
        session = Block(user_id = current_user, goal = goal)
        db.session.add(session)
        db.session.flush()
        sess_id = session.id
        db.session.commit()
        return jsonify(status = "success", session_id = sess_id)
    except Exception as e:
        print(e)
        return jsonify(status = "failed")
    

@store.route('/endTimer', methods=['POST'])
@jwt_required()
def endTimer():
    res = request.json
    id = res['session_id']
    current_user = get_jwt_identity()
    session = Block.query.filter_by(id = id).first()
    session.endtime = datetime.utcnow()
    db.session.commit()
    return jsonify(status = "success")

@store.route('/getAllSessions', methods=['GET'])
@jwt_required()
def getSessions():
    current_user = get_jwt_identity()
    # Check if passed in userID matches jwt identity
    x = User.query.filter_by(id = current_user).first()
    blocks = x.blocks
    res = []
    for block in blocks:
        spent = block.endtime - block.starttime
        spent = divmod(spent.seconds, 60)
        x = {
            'goal': block.goal,
            'start': block.starttime,
            'end': block.endtime,
            'totalTime': f'{spent[0]} minutes, {spent[1]} seconds'
        }
        res.append(x)

    return jsonify(result = res )



    


