# app/__init__.py
from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask import send_from_directory
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from config import config
import os
import base64

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
              origins=['http://localhost:5173', 'https://memora-app-wawu.vercel.app'],  # Add both localhost variants
              allow_headers=['Content-Type', 'Authorization', 'X-Guest-Session'],
              methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    
    # Create upload directory if it doesn't exist
    upload_dir = app.config.get('UPLOAD_FOLDER', 'uploads')
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
    
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        """Serve uploaded files"""
        upload_folder = app.config['UPLOAD_FOLDER']
        print(f"UPLOAD_FOLDER: {upload_folder}")
        print(f"Requested filename: {filename}")
        print(f"Full path would be: {os.path.join(upload_folder, filename)}")
        
        # Check if file exists
        full_path = os.path.join(upload_folder, filename)
        print(f"File exists: {os.path.exists(full_path)}")
        
        return send_from_directory(upload_folder, filename)
    
    
    

def encode_image_to_base64(file_path):
    """Convert image file to base64 string"""
    try:
        with open(file_path, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            # Detect file extension for proper mime type
            ext = os.path.splitext(file_path)[1].lower()
            if ext in ['.jpg', '.jpeg']:
                return f"data:image/jpeg;base64,{encoded_string}"
            elif ext == '.png':
                return f"data:image/png;base64,{encoded_string}"
            elif ext == '.gif':
                return f"data:image/gif;base64,{encoded_string}"
            else:
                return f"data:image/png;base64,{encoded_string}"  # default to png
    except Exception as e:
        print(f"Error encoding image: {e}")
        return None

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
    
