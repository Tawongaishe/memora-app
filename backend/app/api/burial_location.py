# app/api/burial_location.py
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import BurialLocation

# Create blueprint
burial_bp = Blueprint('burial', __name__, url_prefix='/api/burial')

class BurialLocationSchema(Schema):
    """Schema for burial location validation"""
    burial_type = fields.Str(required=False, allow_none=True)
    cemetery_name = fields.Str(required=False, allow_none=True)
    burial_address = fields.Str(required=False, allow_none=True)
    burial_date = fields.Date(required=False, allow_none=True)
    burial_time = fields.Str(required=False, allow_none=True)
    burial_notes = fields.Str(required=False, allow_none=True)

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

@burial_bp.route('/<memorial_id>/burial', methods=['POST', 'PUT'])
def save_burial_location(memorial_id):
    """Save burial location for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Validate request data
        schema = BurialLocationSchema()
        data = schema.load(request.get_json())
        
        # Check if burial location already exists
        existing = BurialLocation.find_by_memorial(memorial_id)
        
        if existing:
            # Update existing burial location
            for key, value in data.items():
                setattr(existing, key, value)
            burial_location = existing
        else:
            # Create new burial location
            burial_location = BurialLocation(
                memorial_id=memorial_id,
                **data
            )
            db.session.add(burial_location)
        
        # Update memorial progress
        memorial.add_completed_step('burial_location')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Burial location saved successfully',
            'burial_location': burial_location.to_dict(),
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save burial location: {str(e)}'}), 500

@burial_bp.route('/<memorial_id>/burial', methods=['GET'])
def get_burial_location(memorial_id):
    """Get burial location for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get burial location
        burial_location = BurialLocation.find_by_memorial(memorial_id)
        if not burial_location:
            return jsonify({'error': 'Burial location not found'}), 404
        
        return jsonify({
            'burial_location': burial_location.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get burial location: {str(e)}'}), 500

@burial_bp.route('/<memorial_id>/burial', methods=['DELETE'])
def delete_burial_location(memorial_id):
    """Delete burial location for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get burial location
        burial_location = BurialLocation.find_by_memorial(memorial_id)
        if not burial_location:
            return jsonify({'error': 'Burial location not found'}), 404
        
        # Remove burial location from completed steps
        if 'burial_location' in memorial.completed_steps:
            memorial.completed_steps.remove('burial_location')
        
        db.session.delete(burial_location)
        db.session.commit()
        
        return jsonify({'message': 'Burial location deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete burial location: {str(e)}'}), 500