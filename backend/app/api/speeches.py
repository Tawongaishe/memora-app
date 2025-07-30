# app/api/speeches.py
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import Speech

# Create blueprint
speeches_bp = Blueprint('speeches', __name__, url_prefix='/api/speeches')

class SpeechSchema(Schema):
    """Schema for speech validation"""
    speaker_name = fields.Str(required=True)
    relationship = fields.Str(required=False, allow_none=True)
    speech_type = fields.Str(required=True)  # introduction, prayer, eulogy, closing
    notes = fields.Str(required=False, allow_none=True)
    

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

@speeches_bp.route('/<memorial_id>/speeches', methods=['POST'])
def save_speeches(memorial_id):
    """Save speech assignments for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get request data - expect an array of speeches
        data = request.get_json()
        if not isinstance(data, list):
            # Handle single speech or convert to array
            data = [data] if data else []
        
        # Clear existing speeches for this memorial
        Speech.query.filter_by(memorial_id=memorial_id).delete()
        
        speeches = []
        schema = SpeechSchema()
        
        for i, speech_data in enumerate(data):
            validated_data = schema.load(speech_data)
        
            
            speech = Speech(
                memorial_id=memorial_id,
                **validated_data
            )
            db.session.add(speech)
            speeches.append(speech)
        
        # Update memorial progress
        memorial.add_completed_step('speeches')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Speeches saved successfully',
            'speeches': [speech.to_dict() for speech in speeches],
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save speeches: {str(e)}'}), 500

@speeches_bp.route('/<memorial_id>/speeches', methods=['GET'])
def get_speeches(memorial_id):
    """Get speech assignments for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get speeches ordered by speech_order
        speeches = Speech.find_by_memorial(memorial_id)
        
        return jsonify({
            'speeches': [speech.to_dict() for speech in speeches]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get speeches: {str(e)}'}), 500

@speeches_bp.route('/<memorial_id>/speeches', methods=['DELETE'])
def delete_speeches(memorial_id):
    """Delete all speeches for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Delete all speeches for this memorial
        deleted_count = Speech.query.filter_by(memorial_id=memorial_id).delete()
        
        # Remove speeches from completed steps
        if 'speeches' in memorial.completed_steps:
            memorial.completed_steps.remove('speeches')
        
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully deleted {deleted_count} speeches'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete speeches: {str(e)}'}), 500