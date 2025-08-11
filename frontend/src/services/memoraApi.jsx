// src/services/memoraApi.js
import { getApiUrl } from '../config/api';

class MemoraApiProvider {
  constructor() {
    this.baseURL = getApiUrl();
    this.memorialId = null;
    this.guestSession = null;
    this.authToken = null;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  setMemorialId(id) {
    this.memorialId = id;
    localStorage.setItem('memora_memorial_id', id);
  }

  getMemorialId() {
    if (!this.memorialId) {
      this.memorialId = localStorage.getItem('memora_memorial_id');
    }
    return this.memorialId;
  }

  setGuestSession(session) {
    this.guestSession = session;
    localStorage.setItem('memora_guest_session', session);
  }

  getGuestSession() {
    if (!this.guestSession) {
      this.guestSession = localStorage.getItem('memora_guest_session');
    }
    return this.guestSession;
  }

  setAuthToken(token) {
    this.authToken = token;
    localStorage.setItem('memora_auth_token', token);
  }

  getAuthToken() {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('memora_auth_token');
    }
    return this.authToken;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.getAuthToken()) {
      headers['Authorization'] = `Bearer ${this.getAuthToken()}`;
    }

    if (this.getGuestSession()) {
      headers['X-Guest-Session'] = this.getGuestSession();
    }

    return headers;
  }

  // Convert frontend camelCase to backend snake_case
  toSnakeCase(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.toSnakeCase(item));

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = this.toSnakeCase(value);
    }
    return result;
  }

  // Convert backend snake_case to frontend camelCase
  toCamelCase(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.toCamelCase(item));

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = this.toCamelCase(value);
    }
    return result;
  }

  // Format date for backend (YYYY-MM-DD)
  formatDateForBackend(dateString) {
    if (!dateString) return null;
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Convert MM/DD/YYYY to YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      const [month, day, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return null;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return this.toCamelCase(data);
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  async createGuestSession() {
    try {
      const response = await this.makeRequest('/auth/guest-session', {
        method: 'POST'
      });
      
      this.setGuestSession(response.guestSession);
      return response;
    } catch (error) {
      throw new Error(`Failed to create guest session: ${error.message}`);
    }
  }

  async register(userData) {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(this.toSnakeCase(userData))
      });
      
      this.setAuthToken(response.accessToken);
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(credentials) {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(this.toSnakeCase(credentials))
      });
      
      this.setAuthToken(response.accessToken);
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  // ============================================================================
  // MEMORIAL METHODS
  // ============================================================================

  async createMemorial(data = {}) {
    try {
      const memorialData = {
        ...data,
        guest_session: this.getGuestSession()
      };

      const response = await this.makeRequest('/memorials/', {
        method: 'POST',
        body: JSON.stringify(this.toSnakeCase(memorialData))
      });
      
      this.setMemorialId(response.memorial.id);
      return response;
    } catch (error) {
      throw new Error(`Failed to create memorial: ${error.message}`);
    }
  }

  async getMemorial(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/memorials/${id}`);
    } catch (error) {
      throw new Error(`Failed to get memorial: ${error.message}`);
    }
  }

  async updateMemorial(data, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/memorials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(this.toSnakeCase(data))
      });
    } catch (error) {
      throw new Error(`Failed to update memorial: ${error.message}`);
    }
  }

  // ============================================================================
  // OBITUARY METHODS
  // ============================================================================

  transformObituaryData(formData) {
    return {
      full_name: formData.fullName,
      birth_date: this.formatDateForBackend(formData.birthDate),
      death_date: this.formatDateForBackend(formData.deathDate),
      birth_place: formData.birthPlace,
      life_story: formData.lifeStory,
      survived_by: formData.survivedBy,
      preceded_by: formData.precededBy,
      tone: formData.tone
    };
  }

  async saveObituary(formData, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      const transformedData = this.transformObituaryData(formData);
      return await this.makeRequest(`/obituaries/${id}/obituary`, {
        method: 'POST',
        body: JSON.stringify(transformedData)
      });
    } catch (error) {
      throw new Error(`Failed to save obituary: ${error.message}`);
    }
  }

  async getObituary(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/obituaries/${id}/obituary`);
    } catch (error) {
      throw new Error(`Failed to get obituary: ${error.message}`);
    }
  }

  // ============================================================================
  // SPEECHES METHODS
  // ============================================================================

  transformSpeechesData(formData) {
    const speeches = [];

    // Map different speech types from form data
    const speechMappings = [
      {
        speaker: formData.introductionSpeaker,
        relationship: formData.introductionRelation,
        type: 'introduction',
        notes: null
      },
      {
        speaker: formData.prayerSpeaker,
        relationship: formData.prayerRelation,
        type: 'prayer',
        notes: null
      },
      {
        speaker: formData.eulogySpeaker,
        relationship: formData.eulogyRelation,
        type: 'eulogy',
        notes: formData.eulogyNotes
      },
      {
        speaker: formData.closingSpeaker,
        relationship: formData.closingRelation,
        type: 'closing',
        notes: null
      }
    ];

    // Add additional speakers if provided
    for (let i = 1; i <= 3; i++) {
      const speaker = formData[`additionalSpeaker${i}`];
      const relationship = formData[`additionalRelation${i}`];
      
      if (speaker) {
        speechMappings.push({
          speaker,
          relationship,
          type: 'reflection',
          notes: null
        });
      }
    }

    // Convert to backend format
    speechMappings.forEach(mapping => {
      if (mapping.speaker) {
        speeches.push({
          speaker_name: mapping.speaker,
          relationship: mapping.relationship || null,
          speech_type: mapping.type,
          notes: mapping.notes || null
        });
      }
    });

    return speeches;
  }

  async saveSpeeches(formData, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      const transformedData = this.transformSpeechesData(formData);
      return await this.makeRequest(`/speeches/${id}/speeches`, {
        method: 'POST',
        body: JSON.stringify(transformedData)
      });
    } catch (error) {
      throw new Error(`Failed to save speeches: ${error.message}`);
    }
  }

  async getSpeeches(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/speeches/${id}/speeches`);
    } catch (error) {
      throw new Error(`Failed to get speeches: ${error.message}`);
    }
  }

  // ============================================================================
  // ACKNOWLEDGEMENTS METHODS
  // ============================================================================

  async saveAcknowledgements(formData, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      const data = {
        acknowledgment_text: formData.acknowledgmentText
      };
      
      return await this.makeRequest(`/acknowledgements/${id}/acknowledgements`, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (error) {
      throw new Error(`Failed to save acknowledgements: ${error.message}`);
    }
  }

  async getAcknowledgements(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/acknowledgements/${id}/acknowledgements`);
    } catch (error) {
      throw new Error(`Failed to get acknowledgements: ${error.message}`);
    }
  }

  // ============================================================================
  // BODY VIEWING METHODS
  // ============================================================================

  transformBodyViewingData(formData) {
    return {
      has_viewing: formData.hasViewing === 'yes',
      viewing_date: this.formatDateForBackend(formData.viewingDate),
      viewing_start_time: formData.viewingStartTime || null,
      viewing_end_time: formData.viewingEndTime || null,
      viewing_location: formData.viewingLocation || null,
      viewing_notes: formData.viewingNotes || null
    };
  }

  async saveBodyViewing(formData, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      const transformedData = this.transformBodyViewingData(formData);
      return await this.makeRequest(`/body-viewing/${id}/body-viewing`, {
        method: 'POST',
        body: JSON.stringify(transformedData)
      });
    } catch (error) {
      throw new Error(`Failed to save body viewing: ${error.message}`);
    }
  }

  async getBodyViewing(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/body-viewing/${id}/body-viewing`);
    } catch (error) {
      throw new Error(`Failed to get body viewing: ${error.message}`);
    }
  }

  // ============================================================================
  // REPASS LOCATION METHODS
  // ============================================================================

  transformRepassData(formData) {
    return {
      has_repass: formData.hasRepass === 'yes',
      venue_name: formData.repassVenueName || null,
      repass_address: formData.repassAddress || null,
      repass_date: this.formatDateForBackend(formData.repassDate),
      repass_time: formData.repassTime || null,
      repass_notes: formData.repassNotes || null
    };
  }

  async saveRepassLocation(formData, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      const transformedData = this.transformRepassData(formData);
      return await this.makeRequest(`/repass/${id}/repass`, {
        method: 'POST',
        body: JSON.stringify(transformedData)
      });
    } catch (error) {
      throw new Error(`Failed to save repass location: ${error.message}`);
    }
  }

  async getRepassLocation(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/repass/${id}/repass`);
    } catch (error) {
      throw new Error(`Failed to get repass location: ${error.message}`);
    }
  }

  // ============================================================================
  // BURIAL LOCATION METHODS
  // ============================================================================

  transformBurialData(formData) {
    return {
      burial_type: formData.burialType || null,
      cemetery_name: formData.cemeteryName || null,
      burial_address: formData.burialAddress || null,
      burial_date: this.formatDateForBackend(formData.burialDate),
      burial_time: formData.burialTime || null,
      burial_notes: formData.burialNotes || null
    };
  }

  async saveBurialLocation(formData, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      const transformedData = this.transformBurialData(formData);
      return await this.makeRequest(`/burial/${id}/burial`, {
        method: 'POST',
        body: JSON.stringify(transformedData)
      });
    } catch (error) {
      throw new Error(`Failed to save burial location: ${error.message}`);
    }
  }

  async getBurialLocation(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      return await this.makeRequest(`/burial/${id}/burial`);
    } catch (error) {
      throw new Error(`Failed to get burial location: ${error.message}`);
    }
  }

  // ============================================================================
  // PHOTO METHODS
  // ============================================================================

  async uploadPhotos(files, photoType = 'gallery', memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) {
      console.error('❌ No memorial ID available');
      throw new Error('No memorial ID available');
    }

    try {
      console.log('📸 Uploading photos...');
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add files to FormData
      if (Array.isArray(files)) {
        files.forEach(file => {
          formData.append('photos', file);
        });
      } else if (files) {
        formData.append('photos', files);
      }
      
      // Add photo type
      formData.append('photo_type', photoType);
      
      console.log('📋 Upload data:', {
        fileCount: Array.isArray(files) ? files.length : (files ? 1 : 0),
        photoType,
        memorialId: id
      });

      // Make request with FormData (don't set Content-Type, let browser set it)
      const headers = {};
      if (this.getAuthToken()) {
        headers['Authorization'] = `Bearer ${this.getAuthToken()}`;
      }
      if (this.getGuestSession()) {
        headers['X-Guest-Session'] = this.getGuestSession();
      }

      const response = await fetch(`${this.baseURL}/photos/${id}/photos`, {
        method: 'POST',
        headers: headers, // Don't include Content-Type for FormData
        body: formData
      });

      console.log('📥 Upload response status:', response.status, response.statusText);

      const data = await response.json();
      console.log('📥 Upload response data:', data);

      if (!response.ok) {
        console.error('❌ Upload error response:', data);
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const transformedData = this.toCamelCase(data);
      console.log('✅ Photos uploaded successfully');
      return transformedData;
    } catch (error) {
      console.error('❌ Failed to upload photos:', error);
      throw new Error(`Failed to upload photos: ${error.message}`);
    }
  }

  async getPhotos(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) {
      console.error('❌ No memorial ID available');
      throw new Error('No memorial ID available');
    }

    try {
      console.log('🔍 Getting photos for memorial:', id);
      const response = await this.makeRequest(`/photos/${id}/photos`);
      console.log('✅ Photos retrieved successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to get photos:', error);
      throw new Error(`Failed to get photos: ${error.message}`);
    }
  }

  async deletePhoto(photoId, memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) {
      console.error('❌ No memorial ID available');
      throw new Error('No memorial ID available');
    }

    try {
      console.log('🗑️ Deleting photo:', photoId);
      const response = await this.makeRequest(`/photos/${id}/photos/${photoId}`, {
        method: 'DELETE'
      });
      console.log('✅ Photo deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to delete photo:', error);
      throw new Error(`Failed to delete photo: ${error.message}`);
    }
  }

  async initializeMemorialSession() {
    try {
      // Check if we already have a memorial
      const existingMemorialId = this.getMemorialId();
      if (existingMemorialId) {
        try {
          const memorial = await this.getMemorial(existingMemorialId);
          return memorial;
        } catch (error) {
          // Memorial not found, create new one
          console.log('Existing memorial not found, creating new one');
        }
      }

      // Create guest session if needed
      if (!this.getGuestSession() && !this.getAuthToken()) {
        await this.createGuestSession();
      }

      // Create new memorial
      const memorial = await this.createMemorial();
      return memorial;
    } catch (error) {
      throw new Error(`Failed to initialize memorial session: ${error.message}`);
    }
  }

  // Generic save method that routes to appropriate service
  async saveFormData(formType, formData, memorialId = null) {
    switch (formType) {
      case 'obituary':
        return await this.saveObituary(formData, memorialId);
      case 'speeches':
        return await this.saveSpeeches(formData, memorialId);
      case 'acknowledgements':
        return await this.saveAcknowledgements(formData, memorialId);
      case 'body-viewing':
        return await this.saveBodyViewing(formData, memorialId);
      case 'repass-location':
        return await this.saveRepassLocation(formData, memorialId);
      case 'burial-location':
        return await this.saveBurialLocation(formData, memorialId);
      default:
        throw new Error(`Unsupported form type: ${formType}`);
    }
  }

  // Generic get method that routes to appropriate service
  async   getFormData(formType, memorialId = null) {
    switch (formType) {
      case 'obituary':
        return await this.getObituary(memorialId);
      case 'speeches':
        return await this.getSpeeches(memorialId);
      case 'acknowledgements':
        return await this.getAcknowledgements(memorialId);
      case 'body-viewing':
        return await this.getBodyViewing(memorialId);
      case 'repass-location':
        return await this.getRepassLocation(memorialId);
      case 'burial-location':
        return await this.getBurialLocation(memorialId);
      default:
        throw new Error(`Unsupported form type: ${formType}`);
    }
  }
  
  // Add these methods to the end of your existing memoraApi.js file
// Just before the "// Create and export singleton instance" comment

  // ============================================================================
  // PDF GENERATION METHODS
  // ============================================================================

  async getMemorialData(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      console.log('📋 Getting complete memorial data for:', id);
      const response = await this.makeRequest(`/pdf/${id}/data`);
      console.log('✅ Memorial data retrieved successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to get memorial data:', error);
      throw new Error(`Failed to get memorial data: ${error.message}`);
    }
  }

  async generateMemorialPdf(memorialId = null) {
    const id = memorialId || this.getMemorialId();
    if (!id) throw new Error('No memorial ID available');

    try {
      console.log('📄 Generating memorial PDF for:', id);
      const response = await this.makeRequest(`/pdf/${id}/generate`, {
        method: 'POST'
      });
      console.log('✅ Memorial PDF generation initiated');
      return response;
    } catch (error) {
      console.error('❌ Failed to generate memorial PDF:', error);
      throw new Error(`Failed to generate memorial PDF: ${error.message}`);
    }
  }

  // Helper method to transform backend memorial data to frontend format
  transformMemorialDataForDisplay(backendData) {
    if (!backendData || !backendData.memorial_data) {
      return null;
    }

    const data = backendData.memorial_data;
    
    // Transform basic info from obituary
    const basicInfo = data.obituary ? {
      fullName: data.obituary.full_name || '',
      birthDate: this.formatDateForDisplay(data.obituary.birth_date),
      deathDate: this.formatDateForDisplay(data.obituary.death_date),
      birthPlace: data.obituary.birth_place || '',
      age: this.calculateAge(data.obituary.birth_date, data.obituary.death_date)
    } : {};

    // Transform photos
    const photos = {
      heroImage: data.photos.find(p => p.photo_type === 'hero')?.file_url || null,
      galleryImages: data.photos.filter(p => p.photo_type === 'gallery').map(p => p.file_url) || []
    };

    // Transform speeches into organized structure
    const speeches = this.organizeSpeechesData(data.speeches || []);

    // Transform locations
    const serviceDetails = data.body_viewing && data.body_viewing.has_viewing ? {
      serviceName: 'Memorial Service',
      date: this.formatDateForDisplay(data.body_viewing.viewing_date),
      time: data.body_viewing.viewing_start_time || '',
      location: data.body_viewing.viewing_location || '',
      address: '', // Not stored separately in body viewing
      officiant: '' // Would need to be stored separately
    } : {};

    return {
      basicInfo,
      photos,
      serviceDetails,
      obituary: data.obituary ? {
        lifeStory: data.obituary.life_story || '',
        survivedBy: data.obituary.survived_by || '',
        precededBy: data.obituary.preceded_by || '',
        tone: data.obituary.tone || ''
      } : {},
      speeches,
      acknowledgements: data.acknowledgements ? {
        familyMessage: data.acknowledgements.acknowledgment_text || '',
        specialThanks: '' // Would need additional field
      } : {},
      burialLocation: data.burial_location ? {
        cemeteryName: data.burial_location.cemetery_name || '',
        address: data.burial_location.burial_address || '',
        burialDate: this.formatDateForDisplay(data.burial_location.burial_date),
        burialTime: data.burial_location.burial_time || '',
        burialNotes: data.burial_location.burial_notes || ''
      } : {},
      repassLocation: data.repass_location && data.repass_location.has_repass ? {
        venueName: data.repass_location.venue_name || '',
        address: data.repass_location.repass_address || '',
        hostMessage: data.repass_location.repass_notes || ''
      } : {}
    };
  }

  // Helper method to organize speeches by type
  organizeSpeechesData(speechesArray) {
    const organized = {
      welcomeRemarks: { speaker: '', relation: '' },
      reflections: [],
      eulogy: { speaker: '', relation: '' },
      closingRemarks: { speaker: '', relation: '' }
    };

    speechesArray.forEach(speech => {
      const speakerData = {
        speaker: speech.speaker_name || '',
        relation: speech.relationship || ''
      };

      switch (speech.speech_type) {
        case 'introduction':
          organized.welcomeRemarks = speakerData;
          break;
        case 'eulogy':
          organized.eulogy = speakerData;
          break;
        case 'closing':
          organized.closingRemarks = speakerData;
          break;
        case 'reflection':
          organized.reflections.push(speakerData);
          break;
        default:
          // Add to reflections as fallback
          organized.reflections.push(speakerData);
      }
    });

    return organized;
  }

  // Helper method to format dates for display
  formatDateForDisplay(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  }

  // Helper method to calculate age
  calculateAge(birthDate, deathDate) {
    if (!birthDate || !deathDate) return '';
    
    try {
      const birth = new Date(birthDate);
      const death = new Date(deathDate);
      const age = death.getFullYear() - birth.getFullYear();
      const monthDiff = death.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
        return `${age - 1} years old`;
      }
      
      return `${age} years old`;
    } catch (error) {
      return '';
    }
  }
}

// Create and export singleton instance
const memoraApi = new MemoraApiProvider();
export default memoraApi;