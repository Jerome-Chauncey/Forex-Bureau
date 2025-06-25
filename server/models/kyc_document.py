from server.config import db
from sqlalchemy_serializer import SerializerMixin

class KYCDocument(db.Model, SerializerMixin):
    __tablename__ = 'kyc_documents'
    id       = db.Column(db.Integer, primary_key=True)
    user_id  = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doc_type = db.Column(db.String(50), nullable=False)
    file_url = db.Column(db.String(200), nullable=False)