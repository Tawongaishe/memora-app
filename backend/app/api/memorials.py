# app/api/memorials.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from marshmallow import Schema, fields, ValidationError
from app import db
from app.models.memorial import Memorial, MemorialStatus
from app.models.user import User

# Create blueprint
memorials_bp = Blueprint('memorials', __name__, url_prefix='/api/memorials')


class MemorialCreateSchema(Schema):
    """Schema for creating a memorial"""
    title = fields.Str(required=False)
    deceased_name = fields.Str(required=False)
    guest_session = fields.Str(required=False)  # For anonymous users


class MemorialUpdateSchema(Schema):
    """Schema for updating a memorial"""
    title = fields.Str(required=False)
    deceased_name = fields.Str(required=False)
    status = fields.Str(required=False)
    current_step = fields.Str(required=False)


@memorials_bp.route('/', methods=['POST'])
def create_memorial():
    """Create a new memorial"""
    try:
        # Validate request data
        schema = MemorialCreateSchema()
        data = schema.load(request.get_json() or {})
        
        # Determine if this is for a logged-in user or guest
        user_id = None
        guest_session = data.get('guest_session')
        
        # Check if user is authenticated
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass  # No valid JWT token, proceed as guest
        
        # If no user and no guest session, this is an error
        if not user_id and not guest_session:
            return jsonify({'error': 'Either authentication or guest session is required'}), 400
        
        # Create memorial
        memorial = Memorial(
            user_id=user_id,
            guest_session=guest_session,
            title=data.get('title'),
            deceased_name=data.get('deceased_name')
        )
        
        db.session.add(memorial)
        db.session.commit()
        
        return jsonify({
            'message': 'Memorial created successfully',
            'memorial': memorial.to_dict()
        }), 201
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create memorial'}), 500


@memorials_bp.route('/<memorial_id>', methods=['GET'])
def get_memorial(memorial_id):
    """Get memorial by ID"""
    try:
        memorial = Memorial.query.get(memorial_id)
        if not memorial:
            return jsonify({'error': 'Memorial not found'}), 404
        
        # Check access permissions
        user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request
            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except:
            pass
        
        # Check if user can access this memorial
        guest_session = request.headers.get('X-Guest-Session')
        if not (memorial.user_id == user_id or memorial.guest_session == guest_session):
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({
            'memorial': memorial.to_dict(include_relations=True)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get memorial'}), 500


@memorials_bp.route('/<memorial_id>', methods=['PUT'])
def update_memorial(memorial_id):
    """Update memorial information"""
    try:
        memorial = Memorial.query.get(memorial_id)
        if not memorial:
            return jsonify({'error': 'Memorial not found'}), 404
        
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
            return jsonify({'error': 'Access denied'}), 403
        
        # Validate and update data
        schema = MemorialUpdateSchema()
        data = schema.load(request.get_json())
        
        for key, value in data.items():
            if hasattr(memorial, key):
                setattr(memorial, key, value)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Memorial updated successfully',
            'memorial': memorial.to_dict()
        }), 200
        
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update memorial'}), 500


@memorials_bp.route('/', methods=['GET'])
@jwt_required()
def list_memorials():
    """List memorials for authenticated user"""
    try:
        user_id = get_jwt_identity()
        memorials = Memorial.find_by_user(user_id)
        
        return jsonify({
            'memorials': [memorial.to_dict() for memorial in memorials]
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to list memorials'}), 500


@memorials_bp.route('/<memorial_id>', methods=['DELETE'])
def delete_memorial(memorial_id):
    """Delete a memorial"""
    try:
        memorial = Memorial.query.get(memorial_id)
        if not memorial:
            return jsonify({'error': 'Memorial not found'}), 404
        
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
            return jsonify({'error': 'Access denied'}), 403
        
        db.session.delete(memorial)
        db.session.commit()
        
        return jsonify({'message': 'Memorial deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete memorial'}), 500


@memorials_bp.route('/<memorial_id>/steps/<step_name>', methods=['POST'])
def mark_step_completed(memorial_id, step_name):
    """Mark a step as completed"""
    try:
        memorial = Memorial.query.get(memorial_id)
        if not memorial:
            return jsonify({'error': 'Memorial not found'}), 404
        
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
            return jsonify({'error': 'Access denied'}), 403
        
        # Add step to completed steps
        memorial.add_completed_step(step_name)
        
        # Update current step to next step
        next_step = memorial.get_next_step()
        if next_step:
            memorial.current_step = next_step
        else:
            memorial.status = MemorialStatus.COMPLETED
        
        db.session.commit()
        
        return jsonify({
            'message': f'Step {step_name} marked as completed',
            'memorial': memorial.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update step'}), 500