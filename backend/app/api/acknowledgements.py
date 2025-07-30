# app/api/acknowledgements.py
from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import Acknowledgements

# Create blueprint
acknowledgements_bp = Blueprint('acknowledgements', __name__, url_prefix='/api/acknowledgements')

class AcknowledgementsSchema(Schema):
    """Schema for acknowledgements validation"""
    acknowledgment_text = fields.Str(required=True)

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

@acknowledgements_bp.route('/<memorial_id>/acknowledgements', methods=['POST', 'PUT'])
def save_acknowledgements(memorial_id):
    """Save acknowledgements for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Validate request data
        schema = AcknowledgementsSchema()
        data = schema.load(request.get_json())
        
        # Check if acknowledgements already exists
        existing = Acknowledgements.find_by_memorial(memorial_id)
        
        if existing:
            # Update existing acknowledgements
            existing.acknowledgment_text = data['acknowledgment_text']
            acknowledgements = existing
        else:
            # Create new acknowledgements
            acknowledgements = Acknowledgements(
                memorial_id=memorial_id,
                acknowledgment_text=data['acknowledgment_text']
            )
            db.session.add(acknowledgements)
        
        # Update memorial progress
        memorial.add_completed_step('acknowledgements')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Acknowledgements saved successfully',
            'acknowledgements': acknowledgements.to_dict(),
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save acknowledgements: {str(e)}'}), 500

@acknowledgements_bp.route('/<memorial_id>/acknowledgements', methods=['GET'])
def get_acknowledgements(memorial_id):
    """Get acknowledgements for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get acknowledgements
        acknowledgements = Acknowledgements.find_by_memorial(memorial_id)
        if not acknowledgements:
            return jsonify({'error': 'Acknowledgements not found'}), 404
        
        return jsonify({
            'acknowledgements': acknowledgements.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get acknowledgements: {str(e)}'}), 500

@acknowledgements_bp.route('/<memorial_id>/acknowledgements', methods=['DELETE'])
def delete_acknowledgements(memorial_id):
    """Delete acknowledgements for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get acknowledgements
        acknowledgements = Acknowledgements.find_by_memorial(memorial_id)
        if not acknowledgements:
            return jsonify({'error': 'Acknowledgements not found'}), 404
        
        # Remove acknowledgements from completed steps
        if 'acknowledgements' in memorial.completed_steps:
            memorial.completed_steps.remove('acknowledgements')
        
        db.session.delete(acknowledgements)
        db.session.commit()
        
        return jsonify({'message': 'Acknowledgements deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete acknowledgements: {str(e)}'}), 500