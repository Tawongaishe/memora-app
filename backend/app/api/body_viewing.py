# app/api/body_viewing.py
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import BodyViewing

# Create blueprint
body_viewing_bp = Blueprint('body_viewing', __name__, url_prefix='/api/body-viewing')

class BodyViewingSchema(Schema):
    """Schema for body viewing validation"""
    has_viewing = fields.Bool(required=True)
    viewing_date = fields.Date(required=False, allow_none=True)
    viewing_start_time = fields.Str(required=False, allow_none=True)
    viewing_end_time = fields.Str(required=False, allow_none=True)
    viewing_location = fields.Str(required=False, allow_none=True)
    viewing_notes = fields.Str(required=False, allow_none=True)

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

@body_viewing_bp.route('/<memorial_id>/body-viewing', methods=['POST', 'PUT'])
def save_body_viewing(memorial_id):
    """Save body viewing arrangements for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Validate request data
        schema = BodyViewingSchema()
        data = schema.load(request.get_json())
        
        # Check if body viewing already exists
        existing = BodyViewing.find_by_memorial(memorial_id)
        
        if existing:
            # Update existing body viewing
            for key, value in data.items():
                setattr(existing, key, value)
            body_viewing = existing
        else:
            # Create new body viewing
            body_viewing = BodyViewing(
                memorial_id=memorial_id,
                **data
            )
            db.session.add(body_viewing)
        
        # Update memorial progress
        memorial.add_completed_step('body_viewing')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Body viewing saved successfully',
            'body_viewing': body_viewing.to_dict(),
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save body viewing: {str(e)}'}), 500

@body_viewing_bp.route('/<memorial_id>/body-viewing', methods=['GET'])
def get_body_viewing(memorial_id):
    """Get body viewing arrangements for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get body viewing
        body_viewing = BodyViewing.find_by_memorial(memorial_id)
        if not body_viewing:
            return jsonify({'error': 'Body viewing not found'}), 404
        
        return jsonify({
            'body_viewing': body_viewing.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get body viewing: {str(e)}'}), 500

@body_viewing_bp.route('/<memorial_id>/body-viewing', methods=['DELETE'])
def delete_body_viewing(memorial_id):
    """Delete body viewing arrangements for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get body viewing
        body_viewing = BodyViewing.find_by_memorial(memorial_id)
        if not body_viewing:
            return jsonify({'error': 'Body viewing not found'}), 404
        
        # Remove body viewing from completed steps
        if 'body_viewing' in memorial.completed_steps:
            memorial.completed_steps.remove('body_viewing')
        
        db.session.delete(body_viewing)
        db.session.commit()
        
        return jsonify({'message': 'Body viewing deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete body viewing: {str(e)}'}), 500