// src/pages/PhotoSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const PhotoSelectionPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState({ profile: [], gallery: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memorialId, setMemorialId] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/photos';
  const progress = getProgress(currentPath);

  useEffect(() => {
    const initializePage = async () => {
      // Check memorial ID
      const id = memoraApi.getMemorialId();
      if (!id) {
        navigate('/start-memorial');
        return;
      }
      setMemorialId(id);

      // Load existing photos
      try {
        const response = await memoraApi.getPhotos(id);
        if (response.photos) {
          setExistingPhotos(response.photos);
        }
      } catch (err) {
        console.log('No existing photos found');
      }
    };

    initializePage();
  }, [navigate]);

  const echoData = {
    title: "Photo Gallery",
    culturalContext: "Three meaningful photographs will tell the story of your loved one's life - one main portrait and two cherished memories.",
    historicalNote: "In African traditions, visual storytelling through art and symbols has always been central to preserving memories. The Akan people of Ghana use 'Adinkra' symbols to represent concepts and stories, believing that visual representations hold the power to keep memories alive across generations.",
    gradientColors: MEMORA_GRADIENTS.PHOTOS,
    backgroundImage: 'images/prayer.avif',
    progressStep: progress.current - 1
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Please upload images only (JPG, PNG, GIF, WebP).`);
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(`File too large. Maximum size is 10MB.`);
      return false;
    }

    return true;
  };

  const handleProfilePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setProfilePhoto(file);
      setError(null);
    }
  };

  const handleGalleryPhotoSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Check if adding these files would exceed the limit
      const totalAfterAdd = existingPhotos.gallery.length + galleryPhotos.length + files.length;
      if (totalAfterAdd > 2) {
        setError(`Too many gallery photos. Maximum 2 allowed. You currently have ${existingPhotos.gallery.length} uploaded.`);
        return;
      }

      // Validate all files
      for (const file of files) {
        if (!validateFile(file)) return;
      }

      setGalleryPhotos(prev => [...prev, ...files]);
      setError(null);
    }
  };

  const removePhoto = (type, index = null) => {
    if (type === 'profile') {
      setProfilePhoto(null);
    } else if (type === 'gallery' && index !== null) {
      setGalleryPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const deleteExistingPhoto = async (photoId, photoType) => {
    try {
      setLoading(true);
      await memoraApi.deletePhoto(photoId);
      
      setExistingPhotos(prev => ({
        ...prev,
        [photoType]: prev[photoType].filter(photo => photo.id !== photoId)
      }));
    } catch (err) {
      setError(`Failed to delete photo: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAndContinue = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Upload profile photo
      if (profilePhoto) {
        await memoraApi.uploadPhotos(profilePhoto, 'profile');
        console.log('✅ Profile photo uploaded');
      }
      
      // Upload gallery photos
      if (galleryPhotos.length > 0) {
        await memoraApi.uploadPhotos(galleryPhotos, 'gallery');
        console.log('✅ Gallery photos uploaded');
      }
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to upload photos: ${err.message}`);
      setLoading(false);
    }
  };

  const hasPhotos = () => {
    return profilePhoto || 
           galleryPhotos.length > 0 || 
           existingPhotos.profile.length > 0 || 
           existingPhotos.gallery.length > 0;
  };

  const handleEchoContinue = () => {
    setCurrentStep('form');
  };

  const handleFormBack = () => {
    setCurrentStep('echo');
  };

  if (!memorialId) return null;

  if (currentStep === 'echo') {
    return (
      <UniversalEchoPage
        title={echoData.title}
        culturalContext={echoData.culturalContext}
        historicalNote={echoData.historicalNote}
        gradientColors={echoData.gradientColors}
        backgroundImage={echoData.backgroundImage}
        progressStep={echoData.progressStep}
        onContinue={handleEchoContinue}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(8px)',
        padding: '1.5rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#1f2937', margin: 0 }}>
          Memora
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Legacy Builder</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', maxWidth: '48rem', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Photo Selection
          </h2>
          <p style={{ fontSize: '1rem', color: '#374151', marginBottom: '2rem' }}>
            Upload 1 profile photo and up to 2 gallery photos to honor their memory.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#dc2626'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Photo Section */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Profile Photo {existingPhotos.profile.length > 0 || profilePhoto ? '✓' : '(Optional)'}
          </h3>

          {/* Existing Profile Photo */}
          {existingPhotos.profile.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <img src={existingPhotos.profile[0].fileUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => deleteExistingPhoto(existingPhotos.profile[0].id, 'profile')}
                  style={{
                    position: 'absolute', top: '0.25rem', right: '0.25rem',
                    background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none',
                    borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Profile Photo Upload */}
          {!profilePhoto && existingPhotos.profile.length === 0 && (
            <div>
              <input type="file" accept="image/*" onChange={handleProfilePhotoSelect} style={{ display: 'none' }} id="profile-input" />
              <label htmlFor="profile-input" style={{
                display: 'block', width: '200px', height: '120px', border: '2px dashed #d1d5db',
                borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <Upload size={24} color="#9ca3af" />
                <span style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>Upload Profile Photo</span>
              </label>
            </div>
          )}

          {/* Selected Profile Photo */}
          {profilePhoto && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem'
            }}>
              <img src={URL.createObjectURL(profilePhoto)} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>{profilePhoto.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{(profilePhoto.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={() => removePhoto('profile')} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Gallery Photos Section */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Gallery Photos ({existingPhotos.gallery.length + galleryPhotos.length}/2) {(existingPhotos.gallery.length + galleryPhotos.length) > 0 ? '✓' : '(Optional)'}
          </h3>

          {/* Existing Gallery Photos */}
          {existingPhotos.gallery.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {existingPhotos.gallery.map(photo => (
                <div key={photo.id} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '0.5rem', overflow: 'hidden' }}>
                  <img src={photo.fileUrl} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => deleteExistingPhoto(photo.id, 'gallery')}
                    style={{
                      position: 'absolute', top: '0.25rem', right: '0.25rem',
                      background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none',
                      borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Photo Upload */}
          {(existingPhotos.gallery.length + galleryPhotos.length) < 2 && (
            <div style={{ marginBottom: '1rem' }}>
              <input type="file" accept="image/*" multiple onChange={handleGalleryPhotoSelect} style={{ display: 'none' }} id="gallery-input" />
              <label htmlFor="gallery-input" style={{
                display: 'block', width: '100%', height: '80px', border: '2px dashed #d1d5db',
                borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
              }}>
                <Upload size={20} color="#9ca3af" />
                <span style={{ marginTop: '0.25rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Upload Gallery Photos ({2 - existingPhotos.gallery.length - galleryPhotos.length} remaining)
                </span>
              </label>
            </div>
          )}

          {/* Selected Gallery Photos */}
          {galleryPhotos.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {galleryPhotos.map((photo, index) => (
                <div key={index} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem'
                }}>
                  <img src={URL.createObjectURL(photo)} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                  <span style={{ fontSize: '0.75rem', color: '#374151' }}>{photo.name.length > 15 ? `${photo.name.substring(0, 15)}...` : photo.name}</span>
                  <button onClick={() => removePhoto('gallery', index)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleFormBack}
            disabled={loading}
            style={{
              color: '#6b7280', background: 'none', border: 'none', fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer', padding: '0.5rem 1rem'
            }}
          >
            ← Back to Echo
          </button>
          
          <button
            onClick={handleUploadAndContinue}
            disabled={loading}
            style={{
              padding: '1rem 2rem', borderRadius: '2rem', fontWeight: '500', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem',
              background: loading ? '#d1d5db' : '#10b981',
              color: loading ? '#6b7280' : 'white',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid rgba(255,255,255,0.8)', borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Uploading...
              </>
            ) : (
              <>Continue Journey →</>
            )}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          {hasPhotos() ? 'Photos will be uploaded when you continue' : 'You can skip photos and add them later'}
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PhotoSelectionPage;