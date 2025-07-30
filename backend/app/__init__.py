# app/__init__.py
from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from config import config
import os

# Initialize Flask extensions
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()
jwt = JWTManager()
bcrypt = Bcrypt()
mail = Mail()


def create_app(config_name=None):
    """Application factory pattern"""
    
    # Create Flask app instance
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app.config.from_object(config[config_name])
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    
    cors.init_app(app, 
              origins=['http://localhost:5173'],  # Add both localhost variants
              allow_headers=['Content-Type', 'Authorization', 'X-Guest-Session'],
              methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    
    # Create upload directory if it doesn't exist
    upload_dir = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # JWT error handlers
    register_jwt_handlers(app)
    
    return app


def register_blueprints(app):
    """Register all application blueprints"""
    
    from app.api.auth import auth_bp
    from app.api.memorials import memorials_bp
    from app.api.obituaries import obituaries_bp
    from app.api.photos import photos_bp
    from app.api.speeches import speeches_bp
    from app.api.pdf import pdf_bp
    from app.api.acknowledgements import acknowledgements_bp
    from app.api.body_viewing import body_viewing_bp
    from app.api.repass_location import repass_bp
    from app.api.burial_location import burial_bp
    
    # Register API blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(memorials_bp)
    app.register_blueprint(obituaries_bp)
    app.register_blueprint(photos_bp)
    app.register_blueprint(speeches_bp)
    app.register_blueprint(pdf_bp)
    app.register_blueprint(acknowledgements_bp)
    app.register_blueprint(body_viewing_bp)
    app.register_blueprint(repass_bp)
    app.register_blueprint(burial_bp)
    
    # Add a simple health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Memoras API is running'}, 200


def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Resource not found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal server error'}, 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return {'error': 'Bad request'}, 400


def register_jwt_handlers(app):
    """Register JWT error handlers"""
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'error': 'Token has expired'}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'error': 'Invalid token'}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'error': 'Authorization token is required'}, 401
    
