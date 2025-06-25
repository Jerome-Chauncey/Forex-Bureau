from server.config import db
from sqlalchemy_serializer import SerializerMixin

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    name          = db.Column(db.String(100), nullable=False)
    phone         = db.Column(db.String(20), nullable=False)
    address       = db.Column(db.String(200), nullable=False)

    kyc_docs = db.relationship('KYCDocument', backref='user', lazy=True)
    orders   = db.relationship('ExchangeOrder', backref='user', lazy=True)
    alerts   = db.relationship('RateAlert', backref='user', lazy=True)