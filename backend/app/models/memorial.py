# app/models/memorial.py
import uuid
from datetime import datetime
from enum import Enum
from app import db


class MemorialStatus(Enum):
    """Memorial status enumeration"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PUBLISHED = "published"


class Memorial(db.Model):
    """Memorial model representing a funeral/memorial program"""
    
    __tablename__ = 'memorials'
    
    # Primary Key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # User Association (can be null for guest users)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True, index=True)
    guest_session = db.Column(db.String(255), nullable=True, index=True)  # For anonymous users
    
    # Memorial Status
    status = db.Column(db.Enum(MemorialStatus), default=MemorialStatus.DRAFT, nullable=False)
    current_step = db.Column(db.String(50), default='obituary', nullable=False)
    completed_steps = db.Column(db.JSON, default=list, nullable=False)
    
    # Basic Memorial Information
    title = db.Column(db.String(200), nullable=True)
    deceased_name = db.Column(db.String(200), nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Generated Files
    pdf_url = db.Column(db.String(500), nullable=True)
    pdf_generated_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    obituary = db.relationship('Obituary', backref='memorial', uselist=False, 
                              cascade='all, delete-orphan', passive_deletes=True)
    acknowledgements = db.relationship('Acknowledgements', backref='memorial', uselist=False,
                                     cascade='all, delete-orphan', passive_deletes=True)
    photos = db.relationship('Photo', backref='memorial', 
                           cascade='all, delete-orphan', passive_deletes=True)
    speeches = db.relationship('Speech', backref='memorial',
                             cascade='all, delete-orphan', passive_deletes=True)
    body_viewing = db.relationship('BodyViewing', backref='memorial', uselist=False,
                                 cascade='all, delete-orphan', passive_deletes=True)
    repass_location = db.relationship('RepassLocation', backref='memorial', uselist=False,
                                    cascade='all, delete-orphan', passive_deletes=True)
    burial_location = db.relationship('BurialLocation', backref='memorial', uselist=False,
                                    cascade='all, delete-orphan', passive_deletes=True)
    
    def __init__(self, **kwargs):
        """Initialize memorial"""
        super(Memorial, self).__init__(**kwargs)
        if not self.completed_steps:
            self.completed_steps = []
    
    def add_completed_step(self, step_name):
        """Add a step to completed steps list"""
        if step_name not in self.completed_steps:
            self.completed_steps.append(step_name)
            db.session.commit()
    
    def is_step_completed(self, step_name):
        """Check if a step is completed"""
        return step_name in self.completed_steps
    
    def get_progress_percentage(self):
        """Calculate completion percentage"""
        total_steps = 7  # obituary, acknowledgements, photos, speeches, body_viewing, repass_location, burial_location
        return int((len(self.completed_steps) / total_steps) * 100)
    
    def get_next_step(self):
        """Get the next step in the memorial creation process"""
        step_sequence = [
            'obituary',
            'body_viewing',
            'speeches',
            'acknowledgements',
            'repass_location',
            'photos',
            'burial_location'
        ]
        
        for step in step_sequence:
            if step not in self.completed_steps:
                return step
        
        return None  # All steps completed
    
    def can_generate_pdf(self):
        """Check if memorial has minimum required data for PDF generation"""
        # At minimum, we need obituary information
        return self.obituary is not None
    
    def to_dict(self, include_relations=False):
        """Convert memorial to dictionary"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'guest_session': self.guest_session,
            'status': self.status.value,
            'current_step': self.current_step,
            'completed_steps': self.completed_steps,
            'title': self.title,
            'deceased_name': self.deceased_name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'pdf_url': self.pdf_url,
            'pdf_generated_at': self.pdf_generated_at.isoformat() if self.pdf_generated_at else None,
            'progress_percentage': self.get_progress_percentage(),
            'next_step': self.get_next_step(),
            'can_generate_pdf': self.can_generate_pdf()
        }
        
        if include_relations:
            data.update({
                'obituary': self.obituary.to_dict() if self.obituary else None,
                'acknowledgements': self.acknowledgements.to_dict() if self.acknowledgements else None,
                'photos': [photo.to_dict() for photo in self.photos],
                'speeches': [speech.to_dict() for speech in self.speeches],
                'body_viewing': self.body_viewing.to_dict() if self.body_viewing else None,
                'repass_location': self.repass_location.to_dict() if self.repass_location else None,
                'burial_location': self.burial_location.to_dict() if self.burial_location else None
            })
        
        return data
    
    @staticmethod
    def find_by_user(user_id):
        """Find all memorials for a user"""
        return Memorial.query.filter_by(user_id=user_id).order_by(Memorial.updated_at.desc()).all()
    
    @staticmethod
    def find_by_guest_session(guest_session):
        """Find memorial by guest session"""
        return Memorial.query.filter_by(guest_session=guest_session).first()
    
    def __repr__(self):
        return f'<Memorial {self.id}: {self.deceased_name or "Unnamed"}>'