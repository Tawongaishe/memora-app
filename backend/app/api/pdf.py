# app/api/pdf.py
from flask import Blueprint

# Create blueprint
pdf_bp = Blueprint('pdf', __name__, url_prefix='/api/pdf')

@pdf_bp.route('/<memorial_id>/generate', methods=['POST'])
def generate_memorial_pdf(memorial_id):
    """Generate PDF for a memorial"""
    return {'message': 'PDF generation endpoint - to be implemented'}, 200

#TBI