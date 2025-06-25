from server.config import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import Enum
from datetime import datetime

class ExchangeOrder(db.Model, SerializerMixin):
    __tablename__ = 'exchange_orders'
    id               = db.Column(db.Integer, primary_key=True)
    user_id          = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency_pair_id = db.Column(db.Integer, db.ForeignKey('currency_pairs.id'), nullable=False)
    amount           = db.Column(db.Numeric(18,2), nullable=False)
    direction        = db.Column(Enum('buy','sell', name='order_direction'), nullable=False)
    delivery_method  = db.Column(Enum('branch_pickup','bank_transfer', name='delivery_method'), nullable=False)
    rate_executed    = db.Column(db.Numeric(18,6), nullable=False)
    status           = db.Column(Enum('pending','complete','cancelled', name='order_status'),
                                 default='pending', nullable=False)
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)