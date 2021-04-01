from . import db
from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(20), nullable = False, unique = True)
    password = db.Column(db.String(150), nullable = False)
    blocks = db.relationship('Block')

class Block(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    starttime = db.Column(db.DateTime, nullable = False, default=datetime.utcnow)
    endtime = db.Column(db.DateTime, nullable = True)
    goal = db.Column(db.String(90), nullable = False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

'''
One User can have many blocks

'''