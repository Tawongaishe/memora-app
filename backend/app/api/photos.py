# app/api/photos.py
from flask import Blueprint

# Create blueprint
photos_bp = Blueprint('photos', __name__, url_prefix='/api/photos')

@photos_bp.route('/<memorial_id>/photos', methods=['POST'])
def upload_photos(memorial_id):
    """Upload photos for a memorial"""
    return {'message': 'Photo upload endpoint - to be implemented'}, 200

@photos_bp.route('/<memorial_id>/photos', methods=['GET'])
def get_photos(memorial_id):
    """Get photos for a memorial"""
    return {'message': 'Get photos endpoint - to be implemented'}, 200

##TBI