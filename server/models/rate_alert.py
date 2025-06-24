from config import db 
from sqlalchemy_serializer import SerializerMixin

class RateAlert(db.Model, SerializerMixin):
    __tablename__ = 'rate_alerts'
    id               = db.Column(db.Integer, primary_key=True)
    user_id          = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    currency_pair_id = db.Column(db.Integer, db.ForeignKey('currency_pairs.id'), nullable=False)
    target_rate      = db.Column(db.Numeric(18,6), nullable=False)
    is_active        = db.Column(db.Boolean, default=True, nullable=False)