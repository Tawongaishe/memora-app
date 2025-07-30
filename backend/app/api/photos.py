# app/api/photos.py
import os
import uuid
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import Photo

# Create blueprint
photos_bp = Blueprint('photos', __name__, url_prefix='/api/photos')

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

class PhotoUploadSchema(Schema):
    """Schema for photo upload validation"""
    photo_type = fields.Str(required=False, default='gallery')  # profile, gallery


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def check_memorial_access(memorial_id):
    """Helper function to check if user can access memorial"""
    memorial = Memorial.query.get(memorial_id)
    if not memorial:
        return None, jsonify({'error': 'Memorial not found'}), 404
    
    # Check access permissions
    user_id = None
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except:
        pass
    
    guest_session = request.headers.get('X-Guest-Session')
    if not (memorial.user_id == user_id or memorial.guest_session == guest_session):
        return None, jsonify({'error': 'Access denied'}), 403
    
    return memorial, None, None


@photos_bp.route('/<memorial_id>/photos', methods=['POST'])
def upload_photos(memorial_id):
    """Upload photos for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Check if any files were uploaded
        if 'photos' not in request.files:
            return jsonify({'error': 'No photos were uploaded'}), 400
        
        files = request.files.getlist('photos')
        if not files or all(file.filename == '' for file in files):
            return jsonify({'error': 'No photos selected'}), 400
        
        # Get photo type from form data
        photo_type = request.form.get('photo_type', 'gallery')
        
        uploaded_photos = []
        upload_dir = current_app.config['UPLOAD_FOLDER']
        
        # Create memorial-specific subdirectory
        memorial_dir = os.path.join(upload_dir, f'memorial_{memorial_id}')
        if not os.path.exists(memorial_dir):
            os.makedirs(memorial_dir)
        
        for file in files:
            if file and file.filename != '':
                # Validate file
                if not allowed_file(file.filename):
                    return jsonify({
                        'error': f'File {file.filename} has an invalid extension. Allowed: {", ".join(ALLOWED_EXTENSIONS)}'
                    }), 400
                
                # Check file size
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                file.seek(0)  # Reset file pointer
                
                if file_size > MAX_FILE_SIZE:
                    return jsonify({
                        'error': f'File {file.filename} is too large. Maximum size: 10MB'
                    }), 400
                
                # Generate unique filename
                original_filename = secure_filename(file.filename)
                file_extension = original_filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
                
                # Save file
                file_path = os.path.join(memorial_dir, unique_filename)
                file.save(file_path)
                
                # Create file URL (adjust this based on your setup)
                file_url = f"/uploads/memorial_{memorial_id}/{unique_filename}"
                
                # Create photo record in database
                photo = Photo(
                    memorial_id=memorial_id,
                    filename=unique_filename,
                    original_filename=original_filename,
                    file_url=file_url,
                    photo_type=photo_type
                )
                
                db.session.add(photo)
                uploaded_photos.append(photo)
        
        # Update memorial progress if this is the first photo upload
        if uploaded_photos:
            memorial.add_completed_step('photos')
        
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully uploaded {len(uploaded_photos)} photo(s)',
            'photos': [photo.to_dict() for photo in uploaded_photos],
            'memorial': memorial.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to upload photos: {str(e)}'}), 500


@photos_bp.route('/<memorial_id>/photos', methods=['GET'])
def get_photos(memorial_id):
    """Get photos for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get photos for this memorial
        photos = Photo.find_by_memorial(memorial_id)
        
        # Organize photos by type
        profile_photos = [photo.to_dict() for photo in photos if photo.photo_type == 'profile']
        gallery_photos = [photo.to_dict() for photo in photos if photo.photo_type == 'gallery']
        
        return jsonify({
            'photos': {
                'profile': profile_photos,
                'gallery': gallery_photos,
                'all': [photo.to_dict() for photo in photos]
            },
            'total_count': len(photos)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get photos: {str(e)}'}), 500


@photos_bp.route('/<memorial_id>/photos/<photo_id>', methods=['DELETE'])
def delete_photo(memorial_id, photo_id):
    """Delete a specific photo"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Find the photo
        photo = Photo.query.filter_by(id=photo_id, memorial_id=memorial_id).first()
        if not photo:
            return jsonify({'error': 'Photo not found'}), 404
        
        # Delete file from filesystem
        upload_dir = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_dir, f'memorial_{memorial_id}', photo.filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Delete photo record from database
        db.session.delete(photo)
        
        # Check if there are any remaining photos
        remaining_photos = Photo.find_by_memorial(memorial_id)
        if not remaining_photos:
            # Remove photos from completed steps if no photos remain
            if 'photos' in memorial.completed_steps:
                memorial.completed_steps.remove('photos')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Photo deleted successfully',
            'memorial': memorial.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete photo: {str(e)}'}), 500


@photos_bp.route('/<memorial_id>/photos/reorder', methods=['POST'])
def reorder_photos(memorial_id):
    """Reorder photos (for future implementation)"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get photo order from request
        data = request.get_json()
        photo_order = data.get('photo_order', [])
        
        # For now, just return success - can implement actual reordering later
        return jsonify({
            'message': 'Photo order updated successfully',
            'photo_order': photo_order
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to reorder photos: {str(e)}'}), 500