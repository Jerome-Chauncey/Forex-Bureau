# Standard library imports
import os
from dotenv import load_dotenv
load_dotenv()

# Remote library imports
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
api = Api()

cors = CORS()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure app
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
    app.config['EXCHANGE_RATE_API_KEY'] = os.getenv("EXCHANGE_RATE_API_KEY")
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 
    app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'png', 'jpg', 'jpeg'}
    app.json.compact = False

    # Configure CORS with specific settings
    cors.init_app(app, resources={
        r"/api/*": {
            "origins": [
                "https://forex-bureau-ui.onrender.com",
                "http://localhost:3000"  # For local development
            ],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"]
        }
    })

    metadata = MetaData(naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    })

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)



    with app.app_context():
        import server.models.currency_pair
        import server.models.exchange_order
        import server.models.faq
        import server.models.kyc_document
        import server.models.rate_alert
        import server.models.user

    return app

app = create_app()