// src/services/blackGoldElegancePdfService.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Black & Gold Elegance - Sophisticated formal style
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000000',
    padding: 40,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#FFFFFF',
    position: 'relative'
  },
  
  // Elegant gold border frame
  goldBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: '3px solid #FFD700',
    borderRadius: 8
  },
  
  // Inner decorative border
  innerBorder: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    border: '1px solid #FFD700',
    borderRadius: 4
  },
  
  // Corner ornaments (simulated with gold circles)
  cornerOrnament: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#FFD700',
    borderRadius: 10
  },
  
  // Decorative flourishes
  flourishTop: {
    position: 'absolute',
    top: 60,
    left: 60,
    right: 60,
    height: 2,
    backgroundColor: '#FFD700'
  },
  
  flourishBottom: {
    position: 'absolute',
    bottom: 60,
    left: 60,
    right: 60,
    height: 2,
    backgroundColor: '#FFD700'
  },
  
  // Main content area
  content: {
    marginTop: 100,
    marginBottom: 100,
    marginLeft: 60,
    marginRight: 60,
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  
  // Typography styles
  inLovingMemory: {
    fontSize: 18,
    fontFamily: 'Times-Italic',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  
  memoryScript: {
    fontSize: 42,
    fontFamily: 'Times-Italic',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.2
  },
  
  name: {
    fontSize: 32,
    fontFamily: 'Times-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 2
  },
  
  dates: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 2
  },
  
  // Photo container
  photoContainer: {
    width: 280,
    height: 320,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginBottom: 40,
    borderRadius: 8,
    border: '4px solid #FFD700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 4
  },
  
  photoPlaceholder: {
    color: '#666666',
    fontSize: 14
  },
  
  // Service information
  serviceInfo: {
    textAlign: 'center',
    marginTop: 30
  },
  
  serviceTitle: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#FFD700',
    marginBottom: 15,
    letterSpacing: 3,
    textTransform: 'uppercase'
  },
  
  serviceDetail: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1
  },
  
  // Interior page styles
  interiorPage: {
    backgroundColor: '#000000',
    padding: 60,
    color: '#FFFFFF',
    position: 'relative'
  },
  
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Times-Bold',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: 40,
    textTransform: 'uppercase'
  },
  
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    color: '#FFD700',
    marginBottom: 20,
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  
  bodyText: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#FFFFFF',
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    marginBottom: 25
  },
  
  // Order of service styles
  orderItem: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '1px solid #333333'
  },
  
  orderRole: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8
  },
  
  orderSpeaker: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Times-Roman'
  },
  
  // Decorative elements
  goldAccent: {
    width: 120,
    height: 2,
    backgroundColor: '#FFD700',
    alignSelf: 'center',
    marginVertical: 30
  },
  
  // Acknowledgment styles
  ackTitle: {
    fontSize: 32,
    fontFamily: 'Times-Bold',
    color: '#FFD700',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 40,
    textTransform: 'uppercase'
  },
  
  ackText: {
    fontSize: 16,
    lineHeight: 2,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    marginBottom: 50
  },
  
  signature: {
    fontSize: 24,
    fontFamily: 'Times-Italic',
    color: '#FFD700',
    textAlign: 'center'
  },
  
  // Photo gallery styles
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20
  },
  
  galleryPhoto: {
    width: 180,
    height: 140,
    objectFit: 'cover',
    marginBottom: 20,
    borderRadius: 4,
    border: '2px solid #FFD700'
  },
  
  galleryPhotoPlaceholder: {
    width: 180,
    height: 140,
    backgroundColor: '#333333',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    border: '2px solid #FFD700'
  }
});

// Helper functions (same as floral service)
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

// Decorative Border Component
const ElegantBorder = () => (
  <View>
    {/* Main gold border */}
    <View style={styles.goldBorder} />
    
    {/* Inner border */}
    <View style={styles.innerBorder} />
    
    {/* Corner ornaments */}
    <View style={[styles.cornerOrnament, { top: 40, left: 40 }]} />
    <View style={[styles.cornerOrnament, { top: 40, right: 40 }]} />
    <View style={[styles.cornerOrnament, { bottom: 40, left: 40 }]} />
    <View style={[styles.cornerOrnament, { bottom: 40, right: 40 }]} />
    
    {/* Decorative flourishes */}
    <View style={styles.flourishTop} />
    <View style={styles.flourishBottom} />
  </View>
);

// Cover Page Component
const BlackGoldCoverPage = ({ data }) => {
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
      {/* Elegant Border */}
      <ElegantBorder />
      
      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.inLovingMemory}>In Loving</Text>
        <Text style={styles.memoryScript}>Memory</Text>
        
        <Text style={styles.name}>
          {data?.obituary?.fullName || 'Beloved'}
        </Text>
        
        {(data?.obituary?.birthDate && data?.obituary?.deathDate) && (
          <Text style={styles.dates}>
            {formatDate(data.obituary.birthDate)} - {formatDate(data.obituary.deathDate)}
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
          {memorialDetails.date && (
            <Text style={styles.serviceDetail}>
              {memorialDetails.date}
              {memorialDetails.time && ` • ${memorialDetails.time}`}
            </Text>
          )}
          
          {memorialDetails.location && (
            <Text style={styles.serviceDetail}>{memorialDetails.location}</Text>
          )}
        </View>
      </View>
    </Page>
  );
};

// Interior page for obituary
const BlackGoldInteriorPage = ({ data }) => (
  <Page size="A4" style={styles.interiorPage}>
    {/* Simple border for interior pages */}
    <View style={[styles.goldBorder, { border: '2px solid #FFD700' }]} />
    
    <View style={{ marginTop: 60, marginBottom: 60, marginLeft: 40, marginRight: 40 }}>
      <Text style={styles.pageTitle}>Celebration of Life</Text>
      
      {data?.obituary?.fullName && (
        <Text style={[styles.sectionTitle, { fontSize: 18, textAlign: 'center', marginBottom: 25 }]}>
          {data.obituary.fullName}
        </Text>
      )}
      
      <View style={styles.goldAccent} />
      
      <Text style={styles.bodyText}>
        {data?.obituary?.lifeStory || 'A beautiful life filled with love, laughter, and cherished memories that will live on in our hearts forever.'}
      </Text>
      
      {data?.obituary?.survivedBy && (
        <View style={{ marginBottom: 25 }}>
          <Text style={styles.sectionTitle}>
            Lovingly Remembered By
          </Text>
          <Text style={styles.bodyText}>
            {data.obituary.survivedBy}
          </Text>
        </View>
      )}
    </View>
  </Page>
);

// Order of Service Page
const BlackGoldOrderOfServicePage = ({ data }) => {
  const speakers = getSpeakerInfo(data?.speeches);
  const memorialDetails = parseMemorialDetails(data?.bodyViewing?.viewingNotes);
  
  return (
    <Page size="A4" style={styles.interiorPage}>
      <View style={[styles.goldBorder, { border: '2px solid #FFD700' }]} />
      
      <View style={{ marginTop: 60, marginBottom: 60, marginLeft: 40, marginRight: 40 }}>
        <Text style={styles.pageTitle}>Order of Service</Text>
        
        <View style={styles.goldAccent} />
        
        {speakers.length > 0 && speakers.map((speaker, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderRole}>
              {speaker.role}
            </Text>
            <Text style={styles.orderSpeaker}>
              {speaker.name}
            </Text>
          </View>
        ))}
        
        <View style={styles.goldAccent} />
        
        {/* Service Information */}
        {(memorialDetails.date || memorialDetails.time || memorialDetails.location) && (
          <View style={{ padding: 25, border: '2px solid #FFD700', borderRadius: 8, marginTop: 30 }}>
            <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 15 }]}>
              Service Information
            </Text>
            {memorialDetails.date && (
              <Text style={[styles.serviceDetail, { textAlign: 'center' }]}>
                {memorialDetails.date}
              </Text>
            )}
            {memorialDetails.time && (
              <Text style={[styles.serviceDetail, { textAlign: 'center' }]}>
                {memorialDetails.time}
              </Text>
            )}
            {memorialDetails.location && (
              <Text style={[styles.serviceDetail, { textAlign: 'center' }]}>
                {memorialDetails.location}
              </Text>
            )}
          </View>
        )}
      </View>
    </Page>
  );
};

// Photo Gallery Page
const BlackGoldPhotoGalleryPage = ({ data }) => {
  const allPhotos = data?.photos || [];
  
  return (
    <Page size="A4" style={styles.interiorPage}>
      <View style={[styles.goldBorder, { border: '2px solid #FFD700' }]} />
      
      <View style={{ marginTop: 60, marginBottom: 60, marginLeft: 40, marginRight: 40 }}>
        <Text style={styles.pageTitle}>Precious Memories</Text>
        
        <View style={styles.goldAccent} />
        
        <View style={styles.photoGrid}>
          {allPhotos.length > 0 ? (
            allPhotos.slice(0, 6).map((photo, index) => (
              photo?.fileUrl ? (
                <Image 
                  key={photo.id || index}
                  src={photo.fileUrl}
                  style={styles.galleryPhoto}
                />
              ) : (
                <View key={photo.id || index} style={styles.galleryPhotoPlaceholder}>
                  <Text style={{ color: '#FFD700', fontSize: 12 }}>Photo {index + 1}</Text>
                </View>
              )
            ))
          ) : (
            <Text style={[styles.bodyText, { textAlign: 'center', width: '100%', marginTop: 50, fontStyle: 'italic', color: '#FFD700' }]}>
              "The memory of the righteous is a blessing."
            </Text>
          )}
        </View>
      </View>
    </Page>
  );
};

// Acknowledgment Page
const BlackGoldAcknowledmentPage = ({ data }) => (
  <Page size="A4" style={[styles.interiorPage, { display: 'flex', flexDirection: 'column', justifyContent: 'center' }]}>
    <View style={[styles.goldBorder, { border: '2px solid #FFD700' }]} />
    
    <View style={{ marginLeft: 60, marginRight: 60 }}>
      <Text style={styles.ackTitle}>With Gratitude</Text>
      
      <View style={styles.goldAccent} />
      
      {data?.acknowledgments?.acknowledgmentText ? (
        <>
          <Text style={styles.ackText}>
            {data.acknowledgments.acknowledgmentText}
          </Text>
          <Text style={styles.signature}>
            The Family of {data?.obituary?.fullName || 'Our Beloved'}
          </Text>
        </>
      ) : (
        <View>
          <Text style={styles.ackText}>
            We are deeply grateful for your love, support, and prayers during this difficult time. Your kindness has been a source of comfort and strength to our family.
          </Text>
          <Text style={styles.signature}>
            With heartfelt appreciation and love
          </Text>
        </View>
      )}
      
      <View style={styles.goldAccent} />
    </View>
  </Page>
);

// Main PDF Document
const BlackGoldEleganceDocument = ({ data }) => (
  <Document>
    <BlackGoldCoverPage data={data} />
    <BlackGoldInteriorPage data={data} />
    <BlackGoldOrderOfServicePage data={data} />
    <BlackGoldPhotoGalleryPage data={data} />
    <BlackGoldAcknowledmentPage data={data} />
  </Document>
);

// Export function
export const generateBlackGoldElegancePDF = async (memorialData) => {
  try {
    console.log('🔄 Generating Black & Gold Elegance PDF...');
    
    const doc = <BlackGoldEleganceDocument data={memorialData} />;
    const pdfBlob = await pdf(doc).toBlob();
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const name = memorialData?.obituary?.fullName || 'Memorial';
    link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, '_')}_Black_Gold_Elegance.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Black & Gold Elegance PDF generated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Black & Gold Elegance PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};