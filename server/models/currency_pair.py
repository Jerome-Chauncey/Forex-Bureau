from server.config import db
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime

class CurrencyPair(db.Model, SerializerMixin):
    __tablename__ = 'currency_pairs'
    id             = db.Column(db.Integer, primary_key=True)
    base_currency  = db.Column(db.String(3), nullable=False)
    quote_currency = db.Column(db.String(3), nullable=False)
    buy_rate       = db.Column(db.Numeric(18,6), nullable=False)
    sell_rate      = db.Column(db.Numeric(18,6), nullable=False)
    updated_at     = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    orders = db.relationship('ExchangeOrder', backref='currency_pair', lazy=True)
    alerts = db.relationship('RateAlert', backref='currency_pair', lazy=True)
