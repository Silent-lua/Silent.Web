from datetime import datetime, timezone
from database.database import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__='users'
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String(120),unique=True,nullable=False,index=True)
    password_hash=db.Column(db.String(255),nullable=False)
    role=db.Column(db.String(20),default='user')
    created_at=db.Column(db.DateTime,default=lambda: datetime.now(timezone.utc))
    chats=db.relationship('Chat',backref='user',lazy=True,cascade="all, delete-orphan")
    def set_password(self,password:str): self.password_hash=generate_password_hash(password)
    def check_password(self,password:str)->bool: return check_password_hash(self.password_hash,password)

class Chat(db.Model):
    __tablename__='chats'
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    title=db.Column(db.String(255),nullable=False,default="Nueva Conversación")
    created_at=db.Column(db.DateTime,default=lambda: datetime.now(timezone.utc))
    messages=db.relationship('Message',backref='chat',lazy=True,cascade="all, delete-orphan")

class Message(db.Model):
    __tablename__='messages'
    id=db.Column(db.Integer,primary_key=True)
    chat_id=db.Column(db.Integer,db.ForeignKey('chats.id'),nullable=False)
    sender=db.Column(db.String(10),nullable=False)
    content=db.Column(db.Text,nullable=False)
    model_used=db.Column(db.String(50))
    tokens_used=db.Column(db.Integer,default=0)
    latency_ms=db.Column(db.Float,default=0.0)
    cost_usd=db.Column(db.Float,default=0.0)
    created_at=db.Column(db.DateTime,default=lambda: datetime.now(timezone.utc))
