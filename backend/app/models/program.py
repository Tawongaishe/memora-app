# app/models/obituary.py
import uuid
from datetime import datetime
from app import db


class Obituary(db.Model):
    """Obituary model representing obituary information for a memorial"""
    
    __tablename__ = 'obituaries'
    
    # Primary Key
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Foreign Key to Memorial
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), 
                           unique=True, nullable=False)
    
    # Personal Information
    full_name = db.Column(db.String(200), nullable=False)
    birth_date = db.Column(db.Date, nullable=True)
    death_date = db.Column(db.Date, nullable=True) 
    birth_place = db.Column(db.String(200), nullable=True)
    
    # Life Story and Details
    life_story = db.Column(db.Text, nullable=True)
    survived_by = db.Column(db.Text, nullable=True)
    preceded_by = db.Column(db.Text, nullable=True)
    
    # Obituary Style
    tone = db.Column(db.String(50), nullable=True)  # traditional, celebratory, personal, spiritual
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __init__(self, **kwargs):
        """Initialize obituary"""
        super(Obituary, self).__init__(**kwargs)
    
    def to_dict(self):
        """Convert obituary to dictionary"""
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'full_name': self.full_name,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'death_date': self.death_date.isoformat() if self.death_date else None,
            'birth_place': self.birth_place,
            'life_story': self.life_story,
            'survived_by': self.survived_by,
            'preceded_by': self.preceded_by,
            'tone': self.tone,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def find_by_memorial(memorial_id):
        """Find obituary by memorial ID"""
        return Obituary.query.filter_by(memorial_id=memorial_id).first()
    
    def __repr__(self):
        return f'<Obituary {self.full_name}>'


# Create placeholder models for other components
class Acknowledgements(db.Model):
    """Acknowledgements model"""
    __tablename__ = 'acknowledgements'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), 
                           unique=True, nullable=False)
    acknowledgment_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'acknowledgment_text': self.acknowledgment_text,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @staticmethod
    def find_by_memorial(memorial_id):
        """Find acknowledgements by memorial ID"""
        return Acknowledgements.query.filter_by(memorial_id=memorial_id).first()


class Photo(db.Model):
    """Photo model"""
    __tablename__ = 'photos'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255))
    file_url = db.Column(db.String(500), nullable=False)
    photo_type = db.Column(db.String(50), default='gallery')  # profile, gallery
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_url': self.file_url,
            'photo_type': self.photo_type,
            'created_at': self.created_at.isoformat()
        }
    
    @staticmethod
    def find_by_memorial(memorial_id):
        """Find all photos for a memorial"""
        return Photo.query.filter_by(memorial_id=memorial_id).all()


class Speech(db.Model):
    """Speech model"""
    __tablename__ = 'speeches'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), nullable=False)
    speaker_name = db.Column(db.String(200), nullable=False)
    relationship = db.Column(db.String(100))
    speech_type = db.Column(db.String(50))  # introduction, prayer, eulogy, closing
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'speaker_name': self.speaker_name,
            'relationship': self.relationship,
            'speech_type': self.speech_type,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }
    @staticmethod
    def find_by_memorial(memorial_id):
        """Find all speeches for a memorial"""
        return Speech.query.filter_by(memorial_id=memorial_id).all()


class BodyViewing(db.Model):
    """Body viewing model"""
    __tablename__ = 'body_viewings'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), 
                           unique=True, nullable=False)
    has_viewing = db.Column(db.Boolean, default=False)
    viewing_date = db.Column(db.Date)
    viewing_start_time = db.Column(db.String(20))
    viewing_end_time = db.Column(db.String(20))
    viewing_location = db.Column(db.String(500))
    viewing_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'has_viewing': self.has_viewing,
            'viewing_date': self.viewing_date.isoformat() if self.viewing_date else None,
            'viewing_start_time': self.viewing_start_time,
            'viewing_end_time': self.viewing_end_time,
            'viewing_location': self.viewing_location,
            'viewing_notes': self.viewing_notes,
            'created_at': self.created_at.isoformat()
        }
    @staticmethod
    def find_by_memorial(memorial_id):
        """Find body viewing by memorial ID"""
        return BodyViewing.query.filter_by(memorial_id=memorial_id).first()


class RepassLocation(db.Model):
    """Repass location model"""
    __tablename__ = 'repass_locations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), 
                           unique=True, nullable=False)
    has_repass = db.Column(db.Boolean, default=False)
    venue_name = db.Column(db.String(200))
    repass_address = db.Column(db.String(500))
    repass_date = db.Column(db.Date)
    repass_time = db.Column(db.String(20))
    repass_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'has_repass': self.has_repass,
            'venue_name': self.venue_name,
            'repass_address': self.repass_address,
            'repass_date': self.repass_date.isoformat() if self.repass_date else None,
            'repass_time': self.repass_time,
            'repass_notes': self.repass_notes,
            'created_at': self.created_at.isoformat()
        }
    @staticmethod
    def find_by_memorial(memorial_id):  
        """Find repass location by memorial ID"""
        return RepassLocation.query.filter_by(memorial_id=memorial_id).first()


class BurialLocation(db.Model):
    """Burial location model"""
    __tablename__ = 'burial_locations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    memorial_id = db.Column(db.String(36), db.ForeignKey('memorials.id', ondelete='CASCADE'), 
                           unique=True, nullable=False)
    burial_type = db.Column(db.String(50))  # burial, cremation, mausoleum
    cemetery_name = db.Column(db.String(200))
    burial_address = db.Column(db.String(500))
    burial_date = db.Column(db.Date)
    burial_time = db.Column(db.String(20))
    burial_notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'memorial_id': self.memorial_id,
            'burial_type': self.burial_type,
            'cemetery_name': self.cemetery_name,
            'burial_address': self.burial_address,
            'burial_date': self.burial_date.isoformat() if self.burial_date else None,
            'burial_time': self.burial_time,
            'burial_notes': self.burial_notes,
            'created_at': self.created_at.isoformat()
        }
    @staticmethod
    def find_by_memorial(memorial_id):
        """Find burial location by memorial ID"""
        return BurialLocation.query.filter_by(memorial_id=memorial_id).first()