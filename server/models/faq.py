from config import db 
from sqlalchemy_serializer import SerializerMixin

class FAQ(db.Model, SerializerMixin):
    __tablename__ = 'faqs'
    id       = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(200), nullable=False)
    answer   = db.Column(db.Text, nullable=False)