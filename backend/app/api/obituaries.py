# app/api/obituaries.py
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial
from app.models.program import Obituary

# Create blueprint
obituaries_bp = Blueprint('obituaries', __name__, url_prefix='/api/obituaries')


class ObituarySchema(Schema):
    """Schema for obituary data validation"""
    full_name = fields.Str(required=True)
    birth_date = fields.Date(required=False, allow_none=True)
    death_date = fields.Date(required=False, allow_none=True)
    birth_place = fields.Str(required=False, allow_none=True)
    life_story = fields.Str(required=False, allow_none=True)
    survived_by = fields.Str(required=False, allow_none=True)
    preceded_by = fields.Str(required=False, allow_none=True)
    tone = fields.Str(required=False, allow_none=True)


def check_memorial_access(memorial_id):
    """Helper function to check if user can access memorial"""
    memorial = Memorial.query.get(memorial_id)
    if not memorial:
        return None, jsonify({'error': 'Memorial not found'}), 404
    
    # Check access permissions
    user_id = None
    try:
        from flask_jwt_extended import verify_jwt_in_request
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except:
        pass
    
    guest_session = request.headers.get('X-Guest-Session')
    if not (memorial.user_id == user_id or memorial.guest_session == guest_session):
        return None, jsonify({'error': 'Access denied'}), 403
    
    return memorial, None, None


@obituaries_bp.route('/<memorial_id>/obituary', methods=['POST', 'PUT'])
def save_obituary(memorial_id):
    """Save or update obituary data for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Validate request data
        schema = ObituarySchema()
        data = schema.load(request.get_json())
        
        # Check if obituary already exists
        existing_obituary = Obituary.find_by_memorial(memorial_id)
        
        if existing_obituary:
            # Update existing obituary
            for key, value in data.items():
                setattr(existing_obituary, key, value)
            obituary = existing_obituary
        else:
            # Create new obituary
            obituary = Obituary(
                memorial_id=memorial_id,
                **data
            )
            db.session.add(obituary)
        
        # Update memorial progress
        memorial.add_completed_step('obituary')
        
        # Update memorial with deceased name if provided
        if data.get('full_name') and not memorial.deceased_name:
            memorial.deceased_name = data['full_name']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Obituary saved successfully',
            'obituary': obituary.to_dict(),
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to save obituary'}), 500


@obituaries_bp.route('/<memorial_id>/obituary', methods=['GET'])
def get_obituary(memorial_id):
    """Get obituary data for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get obituary
        obituary = Obituary.find_by_memorial(memorial_id)
        
        if not obituary:
            return jsonify({'error': 'Obituary not found'}), 404
        
        return jsonify({
            'obituary': obituary.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get obituary'}), 500


@obituaries_bp.route('/<memorial_id>/obituary', methods=['DELETE'])
def delete_obituary(memorial_id):
    """Delete obituary data for a memorial"""
    try:
        # Check access to memorial
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Get obituary
        obituary = Obituary.find_by_memorial(memorial_id)
        
        if not obituary:
            return jsonify({'error': 'Obituary not found'}), 404
        
        # Remove obituary from completed steps
        if 'obituary' in memorial.completed_steps:
            memorial.completed_steps.remove('obituary')
        
        db.session.delete(obituary)
        db.session.commit()
        
        return jsonify({'message': 'Obituary deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete obituary'}), 500