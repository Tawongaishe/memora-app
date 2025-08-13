// src/services/floralCelebrationPdfService.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Simple image URLs using direct Flask routes (like photos API)
const FLORAL_IMAGES = {
  header: "https://memora-backend-kgdg.onrender.com/florals/header-border.png",
  footer: "https://memora-backend-kgdg.onrender.com/florals/footer-border.png"
};

// Style 4: Floral Celebration - Soft pastels with decorative floral elements
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FEFEFE',
    padding: 40,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#5A5A5A',
    position: 'relative'
  },
  
  // Floral header styles
  floralHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    width: '100%'
  },
  
  // Floral footer styles  
  floralFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    width: '100%'
  },
  
  // Fallback decorative elements if images don't load
  floralBorderFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#F8F5F3',
    borderBottom: '2px solid #E8D5C4'
  },
  
  floralAccent1: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#F4C2C2',
    borderRadius: 20,
    opacity: 0.6
  },
  
  floralAccent2: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 30,
    height: 30,
    backgroundColor: '#D4C5B9',
    borderRadius: 15,
    opacity: 0.5
  },
  
  floralAccent3: {
    position: 'absolute',
    top: 5,
    left: 100,
    width: 20,
    height: 20,
    backgroundColor: '#E8D5C4',
    borderRadius: 10,
    opacity: 0.7
  },
  
  content: {
    marginTop: 80,
    textAlign: 'center'
  },
  
  memoryHeader: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#8A7968',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  
  ofText: {
    fontSize: 14,
    fontFamily: 'Times-Italic',
    color: '#8A7968',
    textAlign: 'center',
    marginBottom: 20
  },
  
  name: {
    fontSize: 36,
    fontFamily: 'Times-Italic',
    color: '#C85A5A',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 1.2
  },
  
  dates: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#8A7968',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 1
  },
  
  photoContainer: {
    width: 220,
    height: 200,
    backgroundColor: '#F8F5F3',
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius: 12,
    border: '3px solid #E8D5C4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 8
  },
  
  photoPlaceholder: {
    color: '#C4B5A0',
    fontSize: 14
  },
  
  serviceInfo: {
    textAlign: 'center',
    marginTop: 30
  },
  
  serviceTitle: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#8A7968',
    marginBottom: 10,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  
  serviceDetail: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#6B6B6B',
    marginBottom: 5
  },
  
  bottomAccent: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E8D5C4'
  }
});

// Helper function to parse memorial details
const parseMemorialDetails = (viewingNotes) => {
  if (!viewingNotes) return { date: '', time: '', location: '' };
  
  const lines = viewingNotes.split('\n');
  let date = '';
  let time = '';
  let location = '';
  
  lines.forEach(line => {
    if (line.includes('Memorial Service Date:')) {
      date = line.replace('Memorial Service Date:', '').trim();
    } else if (line.includes('Memorial Service Time:')) {
      time = line.replace('Memorial Service Time:', '').trim();
    } else if (line.includes('Memorial Service Location:')) {
      location = line.replace('Memorial Service Location:', '').trim();
    }
  });
  
  return { date, time, location };
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString || dateString === '0001-01-01' || dateString === '0002-02-02') return '';
  
  try {
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  } catch (error) {
    return dateString;
  }
};

// Helper function to get speaker info
const getSpeakerInfo = (speeches) => {
  if (!speeches || !Array.isArray(speeches)) return [];
  
  const roleMap = {
    0: 'Welcome & Introduction',
    1: 'Opening Prayer', 
    2: 'Eulogy',
    3: 'Closing Remarks'
  };
  
  return speeches.map((speech, index) => ({
    role: speech.speechType || roleMap[index] || `Speaker ${index + 1}`,
    name: speech.speakerName || `Speaker ${speech.relationship || index + 1}`
  }));
};

// Safe Image Component that handles @react-pdf/renderer quirks
const SafeImage = ({ src, style, fallbackComponent }) => {
  // @react-pdf/renderer works better with direct Image components
  // Let's try the image first, fallback if it fails
  try {
    return (
      <Image 
        src={src}
        style={style}
        // These props help with @react-pdf/renderer compatibility
        cache={false}
      />
    );
  } catch (error) {
    console.warn('Image failed to load:', src, error);
    return fallbackComponent || null;
  }
};

// Floral Header Component using base64 images
const FloralHeader = () => {
  try {
    return (
      <Image 
        src={FLORAL_DECORATIONS_BASE64.header}
        style={styles.floralHeader}
      />
    );
  } catch (error) {
    // Fallback to CSS if even base64 fails
    return (
      <View>
        <View style={styles.floralBorderFallback} />
        <View style={styles.floralAccent1} />
        <View style={styles.floralAccent2} />
        <View style={styles.floralAccent3} />
      </View>
    );
  }
};

// Floral Footer Component using base64 images
const FloralFooter = () => {
  try {
    return (
      <Image 
        src={FLORAL_DECORATIONS_BASE64.footer}
        style={styles.floralFooter}
      />
    );
  } catch (error) {
    // Fallback to CSS if even base64 fails
    return <View style={styles.bottomAccent} />;
  }
};

// Cover Page Component
const FloralCelebrationCoverPage = ({ data }) => {
  // Get cover photo
  let coverPhoto = null;
  if (data?.photos?.profilePhoto) {
    coverPhoto = data.photos.profilePhoto;
  } else if (data?.photos && Array.isArray(data.photos) && data.photos.length > 0) {
    coverPhoto = data.photos[0];
  }
  
  // Parse memorial details
  const memorialDetails = parseMemorialDetails(data?.bodyViewing?.viewingNotes);
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Floral Header */}
      <FloralHeader />
      
      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.memoryHeader}>In Loving, Lasting Memory</Text>
        <Text style={styles.ofText}>of</Text>
        
        <Text style={styles.name}>
          {data?.obituary?.fullName || 'Beloved'}
        </Text>
        
        {(data?.obituary?.birthDate && data?.obituary?.deathDate) && (
          <Text style={styles.dates}>
            ({formatDate(data.obituary.birthDate)} - {formatDate(data.obituary.deathDate)})
          </Text>
        )}
        
        {/* Photo */}
        <View style={styles.photoContainer}>
          {coverPhoto?.fileUrl ? (
            <Image 
              src={coverPhoto.fileUrl}
              style={styles.photo}
            />
          ) : (
            <Text style={styles.photoPlaceholder}>Memorial Photo</Text>
          )}
        </View>
        
        {/* Service Information */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceTitle}>Memorial Service</Text>
          
          {memorialDetails.date && (
            <Text style={styles.serviceDetail}>
              {memorialDetails.date}
              {memorialDetails.time && ` at ${memorialDetails.time}`}
            </Text>
          )}
          
          {memorialDetails.location && (
            <Text style={styles.serviceDetail}>{memorialDetails.location}</Text>
          )}
        </View>
      </View>
      
      {/* Floral Footer */}
      <FloralFooter />
    </Page>
  );
};

// Interior page for obituary
const FloralInteriorPage = ({ data }) => (
  <Page size="A4" style={{ backgroundColor: '#FEFEFE', padding: 60, color: '#5A5A5A', fontFamily: 'Times-Roman', position: 'relative' }}>
    {/* Floral Header */}
    <FloralHeader />
    
    {/* Content with top margin for header */}
    <View style={{ marginTop: 70 }}>
      <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', color: '#C85A5A', textAlign: 'center', marginBottom: 30, letterSpacing: 2 }}>
        Celebration of Life
      </Text>
      
      {data?.obituary?.fullName && (
        <Text style={{ fontSize: 18, fontFamily: 'Times-Italic', color: '#8A7968', textAlign: 'center', marginBottom: 25 }}>
          {data.obituary.fullName}
        </Text>
      )}
      
      <View style={{ width: 80, height: 1, backgroundColor: '#E8D5C4', alignSelf: 'center', marginBottom: 25 }} />
      
      <Text style={{ fontSize: 14, lineHeight: 1.8, color: '#5A5A5A', textAlign: 'justify', marginBottom: 25 }}>
        {data?.obituary?.lifeStory || 'A beautiful life filled with love, laughter, and cherished memories that will live on in our hearts forever.'}
      </Text>
      
      {data?.obituary?.survivedBy && (
        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Times-Bold', color: '#8A7968', marginBottom: 10 }}>
            Lovingly Remembered By
          </Text>
          <Text style={{ fontSize: 14, lineHeight: 1.6, color: '#5A5A5A' }}>
            {data.obituary.survivedBy}
          </Text>
        </View>
      )}
    </View>
    
    {/* Floral Footer */}
    <FloralFooter />
  </Page>
);

// Order of Service Page
const FloralOrderOfServicePage = ({ data }) => {
  const speakers = getSpeakerInfo(data?.speeches);
  const memorialDetails = parseMemorialDetails(data?.bodyViewing?.viewingNotes);
  
  return (
    <Page size="A4" style={{ backgroundColor: '#FEFEFE', padding: 60, color: '#5A5A5A', position: 'relative' }}>
      {/* Floral Header */}
      <FloralHeader />
      
      {/* Content with top margin for header */}
      <View style={{ marginTop: 70 }}>
        <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', color: '#C85A5A', textAlign: 'center', marginBottom: 30, letterSpacing: 2 }}>
          Order of Service
        </Text>
        
        <View style={{ width: 80, height: 1, backgroundColor: '#E8D5C4', alignSelf: 'center', marginBottom: 30 }} />
        
        {speakers.length > 0 && speakers.map((speaker, index) => (
          <View key={index} style={{ marginBottom: 20, paddingBottom: 15, borderBottom: '1px solid #F0F0F0' }}>
            <Text style={{ fontSize: 16, fontFamily: 'Times-Bold', color: '#8A7968', marginBottom: 5 }}>
              {speaker.role}
            </Text>
            <Text style={{ fontSize: 14, color: '#6B6B6B' }}>
              {speaker.name}
            </Text>
          </View>
        ))}
        
        <View style={{ width: 80, height: 1, backgroundColor: '#E8D5C4', alignSelf: 'center', marginVertical: 30 }} />
        
        {/* Service Information */}
        <View style={{ padding: 20, backgroundColor: '#F8F5F3', border: '2px solid #E8D5C4', borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Times-Bold', color: '#8A7968', marginBottom: 15, textAlign: 'center' }}>
            Service Information
          </Text>
          {memorialDetails.date && (
            <Text style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 5, textAlign: 'center' }}>
              {memorialDetails.date}
            </Text>
          )}
          {memorialDetails.time && (
            <Text style={{ fontSize: 14, color: '#6B6B6B', marginBottom: 5, textAlign: 'center' }}>
              {memorialDetails.time}
            </Text>
          )}
          {memorialDetails.location && (
            <Text style={{ fontSize: 14, color: '#6B6B6B', textAlign: 'center' }}>
              {memorialDetails.location}
            </Text>
          )}
        </View>
      </View>
      
      {/* Floral Footer */}
      <FloralFooter />
    </Page>
  );
};

// Photo Gallery Page
const FloralPhotoGalleryPage = ({ data }) => {
  const allPhotos = data?.photos || [];
  
  return (
    <Page size="A4" style={{ backgroundColor: '#FEFEFE', padding: 60, color: '#5A5A5A', position: 'relative' }}>
      {/* Small floral accents */}
      <View style={{ position: 'absolute', top: 20, left: 30, width: 25, height: 25, backgroundColor: '#F4C2C2', borderRadius: 12, opacity: 0.4 }} />
      <View style={{ position: 'absolute', top: 30, right: 40, width: 20, height: 20, backgroundColor: '#D4C5B9', borderRadius: 10, opacity: 0.3 }} />
      
      <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', color: '#C85A5A', textAlign: 'center', marginBottom: 30, letterSpacing: 2 }}>
        Precious Memories
      </Text>
      
      <View style={{ width: 80, height: 1, backgroundColor: '#E8D5C4', alignSelf: 'center', marginBottom: 40 }} />
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 }}>
        {allPhotos.length > 0 ? (
          allPhotos.slice(0, 6).map((photo, index) => (
            photo?.fileUrl ? (
              <View key={photo.id || index} style={{ width: 160, height: 120, border: '3px solid #E8D5C4', borderRadius: 8, marginBottom: 15 }}>
                <Image 
                  src={photo.fileUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 5 }}
                />
              </View>
            ) : (
              <View key={photo.id || index} style={{ 
                width: 160, 
                height: 120, 
                backgroundColor: '#F8F5F3', 
                border: '3px solid #E8D5C4',
                borderRadius: 8,
                marginBottom: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text style={{ color: '#C4B5A0', fontSize: 12 }}>Photo {index + 1}</Text>
              </View>
            )
          ))
        ) : (
          <Text style={{ fontSize: 14, color: '#8A7968', textAlign: 'center', width: '100%', marginTop: 50, fontStyle: 'italic' }}>
            "Life is a collection of moments, and memories are the treasures we keep."
          </Text>
        )}
      </View>
      
      <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, height: 2, backgroundColor: '#E8D5C4' }} />
    </Page>
  );
};

// Acknowledgment Page
const FloralAcknowledmentPage = ({ data }) => (
  <Page size="A4" style={{ backgroundColor: '#FEFEFE', padding: 60, color: '#5A5A5A', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
    {/* Floral decorations */}
    <View style={{ position: 'absolute', top: 40, left: 40, width: 30, height: 30, backgroundColor: '#F4C2C2', borderRadius: 15, opacity: 0.5 }} />
    <View style={{ position: 'absolute', top: 60, right: 50, width: 25, height: 25, backgroundColor: '#D4C5B9', borderRadius: 12, opacity: 0.4 }} />
    <View style={{ position: 'absolute', bottom: 60, left: 60, width: 20, height: 20, backgroundColor: '#E8D5C4', borderRadius: 10, opacity: 0.6 }} />
    
    <Text style={{ fontSize: 28, fontFamily: 'Times-Bold', color: '#C85A5A', textAlign: 'center', marginBottom: 30, letterSpacing: 2 }}>
      With Gratitude
    </Text>
    
    <View style={{ width: 100, height: 1, backgroundColor: '#E8D5C4', alignSelf: 'center', marginBottom: 40 }} />
    
    {data?.acknowledgments?.acknowledgmentText ? (
      <>
        <Text style={{ fontSize: 16, lineHeight: 1.8, color: '#6B6B6B', textAlign: 'center', marginBottom: 40 }}>
          {data.acknowledgments.acknowledgmentText}
        </Text>
        <Text style={{ fontSize: 18, fontFamily: 'Times-Italic', color: '#8A7968', textAlign: 'center' }}>
          The Family of {data?.obituary?.fullName || 'Our Beloved'}
        </Text>
      </>
    ) : (
      <View>
        <Text style={{ fontSize: 16, color: '#6B6B6B', textAlign: 'center', marginBottom: 20 }}>
          We are deeply grateful for your love, support, and prayers during this difficult time.
        </Text>
        <Text style={{ fontSize: 16, color: '#6B6B6B', textAlign: 'center', marginBottom: 30 }}>
          Your kindness has been a source of comfort and strength to our family.
        </Text>
        <Text style={{ fontSize: 18, fontFamily: 'Times-Italic', color: '#8A7968', textAlign: 'center' }}>
          With heartfelt appreciation and love
        </Text>
      </View>
    )}
    
    <View style={{ width: 100, height: 1, backgroundColor: '#E8D5C4', alignSelf: 'center', marginTop: 40 }} />
  </Page>
);

// Main PDF Document
const FloralCelebrationDocument = ({ data }) => (
  <Document>
    <FloralCelebrationCoverPage data={data} />
    <FloralInteriorPage data={data} />
    <FloralOrderOfServicePage data={data} />
    <FloralPhotoGalleryPage data={data} />
    <FloralAcknowledmentPage data={data} />
  </Document>
);

// Export function
export const generateFloralCelebrationPDF = async (memorialData) => {
  try {
    console.log('🔄 Generating Floral Celebration PDF...');
    
    const doc = <FloralCelebrationDocument data={memorialData} />;
    const pdfBlob = await pdf(doc).toBlob();
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const name = memorialData?.obituary?.fullName || 'Memorial';
    link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, '_')}_Floral_Celebration.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Floral Celebration PDF generated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Floral Celebration PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};