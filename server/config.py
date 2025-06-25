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



# Instantiate extensions WITHOUT app (to avoid circular imports)
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

    # Configure metadata
    metadata = MetaData(naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    })

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)
    cors.init_app(app)

    # Import models AFTER db initialization
    with app.app_context():
        # Import model files without bringing names to global scope
        import models.currency_pair
        import models.exchange_order
        import models.faq
        import models.kyc_document
        import models.rate_alert
        import models.user

    return app

# Create app instance
app = create_app()