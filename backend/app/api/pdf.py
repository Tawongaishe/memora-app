# app/api/pdf.py
from flask import Blueprint, request, jsonify, current_app
from app.models.program import Obituary, Speech, Acknowledgements, BodyViewing, RepassLocation, BurialLocation, Photo
from app.models.memorial import Memorial
from app import db
import logging
import os
import base64

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

# Import existing access check function
from app.api.obituaries import check_memorial_access

# Create blueprint
pdf_bp = Blueprint('pdf', __name__, url_prefix='/api/pdf')

logger = logging.getLogger(__name__)

def collect_memorial_data(memorial):
    """Collect all memorial data using direct model queries"""
    memorial_data = {
        'memorial': {
            'id': memorial.id,
            'created_at': memorial.created_at.isoformat() if memorial.created_at else None,
            'updated_at': memorial.updated_at.isoformat() if memorial.updated_at else None,
            'guest_session': memorial.guest_session,
            'user_id': memorial.user_id,
            'deceased_name': memorial.deceased_name,
            'title': memorial.title
        }
    }
    
    # Get obituary data
    obituary = Obituary.find_by_memorial(memorial.id)
    if obituary:
        memorial_data['obituary'] = obituary.to_dict()
    else:
        memorial_data['obituary'] = None
        
    # Get speeches data
    speeches = Speech.find_by_memorial(memorial.id)
    memorial_data['speeches'] = [speech.to_dict() for speech in speeches]
        
    # Get acknowledgements data
    acknowledgement = Acknowledgements.find_by_memorial(memorial.id)
    if acknowledgement:
        memorial_data['acknowledgements'] = acknowledgement.to_dict()
    else:
        memorial_data['acknowledgements'] = None
        
    # Get body viewing data
    body_viewing = BodyViewing.find_by_memorial(memorial.id)
    if body_viewing:
        memorial_data['body_viewing'] = body_viewing.to_dict()
    else:
        memorial_data['body_viewing'] = None
        
    # Get repass location data
    repass = RepassLocation.find_by_memorial(memorial.id)
    if repass:
        memorial_data['repass_location'] = repass.to_dict()
    else:
        memorial_data['repass_location'] = None
        
    # Get burial location data
    burial = BurialLocation.find_by_memorial(memorial.id)
    if burial:
        memorial_data['burial_location'] = burial.to_dict()
    else:
        memorial_data['burial_location'] = None
        
    # Get photos data
    photos = Photo.find_by_memorial(memorial.id)
    photos_data = []
    for photo in photos:
        photo_dict = photo.to_dict()
        
        # Generate base64 version of the image
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f"memorial_{memorial.id}", photo.filename)
        photo_dict['base64_url'] = encode_image_to_base64(file_path)
        
        photos_data.append(photo_dict)

    memorial_data['photos'] = photos_data
    
    return memorial_data

@pdf_bp.route('/<memorial_id>/generate', methods=['POST'])
def generate_memorial_pdf(memorial_id):
    """Generate PDF for a memorial by collecting all related data"""
    try:
        logger.info(f"📄 Generating PDF for memorial: {memorial_id}")
        
        # Check memorial access using existing function
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Collect all memorial data using direct model queries
        memorial_data = collect_memorial_data(memorial)
        
        logger.info(f"✅ Memorial data collected successfully for: {memorial_id}")
        logger.debug(f"📊 Data summary: {len(memorial_data['speeches'])} speeches, {len(memorial_data['photos'])} photos")
        
        # TODO: Implement actual PDF generation here
        # This is where you would:
        # 1. Use the memorial_data to populate a Canva template via API
        # 2. Or use a PDF generation library like ReportLab or WeasyPrint
        # 3. Generate the PDF file
        # 4. Store it temporarily or in cloud storage
        # 5. Return download URL or file data
        
        # For now, return the collected data for frontend use
        response_data = {
            'message': 'Memorial data collected successfully',
            'memorial_data': memorial_data,
            'pdf_status': 'ready_for_generation',
            'next_steps': [
                'Implement PDF template selection',
                'Integrate with Canva API or PDF library',
                'Generate and store PDF file',
                'Return download URL'
            ]
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        logger.error(f"❌ Error generating PDF for memorial {memorial_id}: {str(e)}")
        return jsonify({
            'error': 'Failed to generate PDF',
            'details': str(e)
        }), 500

@pdf_bp.route('/<memorial_id>/data', methods=['GET'])
def get_memorial_data(memorial_id):
    """Get all memorial data for review (without generating PDF)"""
    try:
        logger.info(f"📋 Getting memorial data for review: {memorial_id}")
        
        # Check memorial access using existing function
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # Collect all memorial data using direct model queries
        memorial_data = collect_memorial_data(memorial)
        
        logger.info(f"✅ Memorial data retrieved successfully for review: {memorial_id}")
        
        return jsonify({
            'memorial_data': memorial_data,
            'status': 'success'
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting memorial data {memorial_id}: {str(e)}")
        return jsonify({
            'error': 'Failed to get memorial data',
            'details': str(e)
        }), 500

@pdf_bp.route('/<memorial_id>/download', methods=['GET'])
def download_memorial_pdf(memorial_id):
    """Download generated PDF (placeholder for future implementation)"""
    try:
        # Check memorial access
        memorial, error_response, status_code = check_memorial_access(memorial_id)
        if error_response:
            return error_response, status_code
        
        # TODO: Implement actual PDF download
        # For now, return a placeholder response
        return jsonify({
            'message': 'PDF download endpoint - to be implemented',
            'memorial_id': memorial_id,
            'download_url': f'/api/pdf/{memorial_id}/download'
        }), 200
        
    except Exception as e:
        logger.error(f"❌ Error downloading PDF for memorial {memorial_id}: {str(e)}")
        return jsonify({
            'error': 'Failed to download PDF',
            'details': str(e)
        }), 500