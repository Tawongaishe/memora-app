# app/api/repass_location.py
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import RepassLocation

# Create blueprint
repass_bp = Blueprint('repass', __name__, url_prefix='/api/repass')

class RepassLocationSchema(Schema):
    """Schema for repass location validation"""
    has_repass = fields.Bool(required=True)
    venue_name = fields.Str(required=False, allow_none=True)
    repass_address = fields.Str(required=False, allow_none=True)
    repass_date = fields.Date(required=False, allow_none=True)
    repass_time = fields.Str(required=False, allow_none=True)
    repass_notes = fields.Str(required=False, allow_none=True)

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

@repass_bp.route('/<memorial_id>/repass', methods=['POST', 'PUT'])
def save_repass_location(memorial_id):
    """Save repass location for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Validate request data
        schema = RepassLocationSchema()
        data = schema.load(request.get_json())
        
        # Check if repass location already exists
        existing = RepassLocation.find_by_memorial(memorial_id)
        
        if existing:
            # Update existing repass location
            for key, value in data.items():
                setattr(existing, key, value)
            repass_location = existing
        else:
            # Create new repass location
            repass_location = RepassLocation(
                memorial_id=memorial_id,
                **data
            )
            db.session.add(repass_location)
        
        # Update memorial progress
        memorial.add_completed_step('repass_location')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Repass location saved successfully',
            'repass_location': repass_location.to_dict(),
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save repass location: {str(e)}'}), 500

@repass_bp.route('/<memorial_id>/repass', methods=['GET'])
def get_repass_location(memorial_id):
    """Get repass location for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get repass location
        repass_location = RepassLocation.find_by_memorial(memorial_id)
        if not repass_location:
            return jsonify({'error': 'Repass location not found'}), 404
        
        return jsonify({
            'repass_location': repass_location.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get repass location: {str(e)}'}), 500

@repass_bp.route('/<memorial_id>/repass', methods=['DELETE'])
def delete_repass_location(memorial_id):
    """Delete repass location for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get repass location
        repass_location = RepassLocation.find_by_memorial(memorial_id)
        if not repass_location:
            return jsonify({'error': 'Repass location not found'}), 404
        
        # Remove repass location from completed steps
        if 'repass_location' in memorial.completed_steps:
            memorial.completed_steps.remove('repass_location')
        
        db.session.delete(repass_location)
        db.session.commit()
        
        return jsonify({'message': 'Repass location deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete repass location: {str(e)}'}), 500