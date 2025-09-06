// src/services/memorialPdfService.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Elegant styles inspired by the reference images with your app's gradient colors
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#1F2937', // Dark background like the examples
    padding: 0,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#F3F4F6' // Light text on dark background
  },
  
  // COVER PAGE STYLES
  coverPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    position: 'relative'
  },
  
  memoryText: {
    fontSize: 48,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    position: 'absolute',
    left: 20,
    top: 100,
    width: 100,
    textAlign: 'center',
    letterSpacing: 12,
    lineHeight: 1.4
  },
  
  coverContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 140,
    width: '60%'
  },
  
  smallOf: {
    fontSize: 32,
    fontFamily: 'Times-Italic',
    color: '#D1A27A',
    marginBottom: 20,
    textAlign: 'center'
  },
  
  coverName: {
    fontSize: 36,
    fontFamily: 'Times-Bold',
    color: '#F3F4F6',
    textAlign: 'center',
    letterSpacing: 8,
    lineHeight: 1.2,
    marginBottom: 30
  },
  
  coverDates: {
    fontSize: 24,
    color: '#D1A27A',
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 50
  },
  
  photoContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#374151',
    marginBottom: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden'
  },
  
  coverPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  
  photoPlaceholder: {
    color: '#9CA3AF',
    fontSize: 14
  },
  
  serviceDetails: {
    textAlign: 'center',
    color: '#D1D5DB'
  },
  
  serviceDate: {
    fontSize: 18,
    marginBottom: 5
  },
  
  serviceTime: {
    fontSize: 16,
    marginBottom: 5
  },
  
  serviceLocation: {
    fontSize: 14,
    marginBottom: 20
  },
  
  inLovingScript: {
    fontSize: 28,
    fontFamily: 'Times-Italic',
    color: '#D1A27A',
    position: 'absolute',
    bottom: 100,
    left: 40,
    transform: 'rotate(-90deg)',
    transformOrigin: 'left bottom'
  },
  
  // INTERIOR PAGE STYLES
  interiorPage: {
    backgroundColor: '#1F2937',
    padding: 60,
    color: '#F3F4F6'
  },
  
  pageTitle: {
    fontSize: 32,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 40,
    textTransform: 'uppercase'
  },
  
  section: {
    marginBottom: 40
  },
  
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    marginBottom: 20,
    letterSpacing: 3,
    textTransform: 'uppercase'
  },
  
  bodyText: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#E5E7EB',
    textAlign: 'justify',
    fontFamily: 'Times-Roman'
  },
  
  // ORDER OF SERVICE STYLES
  orderPage: {
    backgroundColor: '#1F2937',
    padding: 60,
    position: 'relative'
  },
  
  orderSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 140,
    backgroundColor: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  orderSidebarText: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    transform: 'rotate(-90deg)',
    transformOrigin: 'center',
    letterSpacing: 3
  },
  
  orderContent: {
    marginLeft: 180,
    paddingTop: 80
  },
  
  orderItem: {
    marginBottom: 35,
    borderBottom: '1px solid #374151',
    paddingBottom: 20
  },
  
  orderRole: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8
  },
  
  orderSpeaker: {
    fontSize: 18,
    color: '#F3F4F6',
    fontFamily: 'Times-Roman'
  },
  
  // ACKNOWLEDGMENT PAGE STYLES
  ackPage: {
    backgroundColor: '#1F2937',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  
  ackTitle: {
    fontSize: 36,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: 40,
    textTransform: 'uppercase'
  },
  
  ackText: {
    fontSize: 16,
    lineHeight: 2,
    color: '#E5E7EB',
    textAlign: 'center',
    fontFamily: 'Times-Roman',
    marginBottom: 50
  },
  
  signature: {
    fontSize: 28,
    fontFamily: 'Times-Italic',
    color: '#D1A27A',
    textAlign: 'center'
  },
  
  // QUOTE PAGE STYLES
  quotePage: {
    backgroundColor: '#1F2937',
    padding: 60,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  
  quoteSidebar: {
    position: 'absolute',
    left: 40,
    top: 0,
    bottom: 0,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  quoteSidebarText: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    transform: 'rotate(-90deg)',
    transformOrigin: 'center',
    letterSpacing: 3
  },
  
  quoteContent: {
    marginLeft: 160,
    textAlign: 'center'
  },
  
  quoteMarks: {
    fontSize: 120,
    color: '#D1A27A',
    fontFamily: 'Times-Bold',
    marginBottom: 20
  },
  
  quoteText: {
    fontSize: 18,
    lineHeight: 1.8,
    color: '#E5E7EB',
    fontFamily: 'Times-Italic',
    marginBottom: 30,
    textAlign: 'left'
  },
  
  // PHOTO GALLERY STYLES
  photoGalleryPage: {
    backgroundColor: '#1F2937',
    padding: 60,
    position: 'relative'
  },
  
  galleryTitle: {
    fontSize: 32,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 50,
    textTransform: 'uppercase'
  },
  
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20
  },
  
  galleryPhoto: {
    width: 200,
    height: 200,
    objectFit: 'cover',
    marginBottom: 20,
    borderRadius: 4
  },
  
  galleryPhotoPlaceholder: {
    width: 220,
    height: 160,
    backgroundColor: '#374151',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  
  // SERVICE INFO STYLES
  serviceInfoSection: {
    backgroundColor: '#111827',
    padding: 30,
    marginVertical: 20,
    borderLeft: '4px solid #D1A27A'
  },
  
  serviceInfoTitle: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    color: '#D1A27A',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  
  // SEPARATOR
  separator: {
    height: 2,
    backgroundColor: '#D1A27A',
    marginVertical: 30,
    width: 100,
    alignSelf: 'center'
  },
  
  // MEMORIAL PHOTO ON OBITUARY PAGE
  obituaryPhoto: {
    width: 150,
    height: 200,
    objectFit: 'cover',
    marginRight: 20,
    borderRadius: 4
  },
  
  obituaryPhotoPlaceholder: {
    width: 150,
    height: 200,
    backgroundColor: '#374151',
    marginRight: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  
  obituaryContent: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  
  serviceInfoText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 1.6,
    marginBottom: 8
  }
});

// Helper function to format dates elegantly
const formatDate = (dateString) => {
  if (!dateString || dateString === '0001-01-01' || dateString === '0002-02-02') return '';
  
  try {
    // Parse the date and add timezone offset to avoid day-off issues
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return dateString;
    }
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

// Helper function to parse memorial details from viewingNotes
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

// Helper function to create a proper obituary paragraph
const createObituaryParagraph = (data) => {
  if (!data?.obituary) return '';
  
  const { fullName, birthDate, birthPlace, deathDate, lifeStory, survivedBy, precededBy } = data.obituary;
  
  let paragraph = '';
  
  // Opening with name and dates
  if (fullName) {
    paragraph += `${fullName}`;
    
    // Add birth info if available and not placeholder
    if (birthDate && birthDate !== '0001-01-01') {
      const formattedBirth = formatDate(birthDate);
      if (formattedBirth) {
        paragraph += `, born on ${formattedBirth}`;
        if (birthPlace && birthPlace !== 'Disney Land') {
          paragraph += ` in ${birthPlace}`;
        }
      }
    }
    
    // Add death info if available and not placeholder
    if (deathDate && deathDate !== '0002-02-02') {
      const formattedDeath = formatDate(deathDate);
      if (formattedDeath) {
        paragraph += `, peacefully passed away on ${formattedDeath}`;
      }
    } else {
      // If no real date, just say passed away
      paragraph += ` passed away peacefully`;
    }
    
    paragraph += '. ';
  }
  
  // Add life story - use it even if it's basic, or create a generic one
  if (lifeStory && lifeStory.trim() !== '') {
    if (lifeStory === 'Lived, laughed and loved') {
      // Expand the basic placeholder into something more meaningful
      paragraph += `${fullName} was a beloved individual who truly lived life to the fullest. They brought joy and laughter to all who knew them, and their love touched many hearts. `;
    } else {
      paragraph += `${lifeStory} `;
    }
  } else if (fullName) {
    // If no life story at all, create a generic but meaningful one
    paragraph += `${fullName} was a cherished member of the community who will be remembered for their kindness, warmth, and the positive impact they had on everyone they met. `;
  }
  
  // Add family information naturally into the paragraph
  if (survivedBy && survivedBy !== 'Minne Mouse') {
    paragraph += `They are lovingly remembered by ${survivedBy}. `;
  }
  
  if (precededBy && precededBy !== 'Donald Duck') {
    paragraph += `${fullName} was preceded in death by ${precededBy}. `;
  }
  
  // Add a closing sentiment
  paragraph += `Their memory will forever live on in the hearts of all who knew and loved them.`;
  
  return paragraph.trim();
};

// Helper function to get proper speaker roles and names
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
    name: speech.speakerName || `Speaker ${speech.relationship || index + 1}`,
    relationship: speech.relationship && speech.relationship !== 'A' && speech.relationship !== 'B' && speech.relationship !== 'C' && speech.relationship !== 'D' ? speech.relationship : ''
  }));
};

// Cover Page Component - now uses memorial details from bodyViewing.viewingNotes
const CoverPage = ({ data }) => {
  // Get the first photo for the cover
  const coverPhoto = data?.photos && data.photos.length > 0 ? data.photos[0] : null;
  
  // Parse memorial details from bodyViewing.viewingNotes
  const memorialDetails = parseMemorialDetails(data?.bodyViewing?.viewingNotes);
  
  return (
    <Page size="A4" style={styles.coverPage}>
      {/* Large "MEMORY" text on the side - stacked vertically */}
      <Text style={styles.memoryText}>
        M{'\n'}E{'\n'}M{'\n'}O{'\n'}R{'\n'}Y
      </Text>
      
      {/* Main content */}
      <View style={styles.coverContent}>
        <Text style={styles.smallOf}>of</Text>
        
        <Text style={styles.coverName}>
          {(data?.obituary?.fullName || data?.memorial?.deceasedName || 'BELOVED').toUpperCase()}
        </Text>
        
        {(data?.obituary?.birthDate && data?.obituary?.deathDate) && (
          <Text style={styles.coverDates}>
            {data.obituary.birthDate !== '0001-01-01' ? new Date(data.obituary.birthDate + 'T00:00:00').getUTCFullYear() : ''} - {data.obituary.deathDate !== '0002-02-02' ? new Date(data.obituary.deathDate + 'T00:00:00').getUTCFullYear() : ''}
          </Text>
        )}
        
        {/* Photo - try to load actual image */}
        <View style={styles.photoContainer}>
          {/* {coverPhoto?.base64_url ? (
            <Image 
              src={coverPhoto.base64_url}
              style={styles.coverPhoto}
            />
          ) :  */}
          {
          coverPhoto?.fileUrl ? (
            <Image 
              src={coverPhoto.fileUrl}
              style={styles.coverPhoto}
            />
          ) : (
            <Text style={styles.photoPlaceholder}>Memorial Photo</Text>
          )}
        </View>
        
        {/* Memorial Service details - now uses memorial details from viewingNotes */}
        <View style={styles.serviceDetails}>
          <Text style={styles.serviceDate}>Memorial Service</Text>
          {memorialDetails.date && (
            <Text style={styles.serviceTime}>{memorialDetails.date}</Text>
          )}
          {memorialDetails.time && (
            <Text style={styles.serviceTime}>at {memorialDetails.time}</Text>
          )}
          {memorialDetails.location && (
            <Text style={styles.serviceLocation}>{memorialDetails.location}</Text>
          )}
        </View>
      </View>
      
      {/* "In loving memory" script text */}
      <Text style={styles.inLovingScript}>In loving memory</Text>
    </Page>
  );
};

// Obituary Page Component - simplified, no photo
const ObituaryPage = ({ data }) => {
  const obituaryText = createObituaryParagraph(data);
  const { fullName, birthDate, deathDate } = data?.obituary || {};
  
  // Format the date range for the subtitle
  const getDateRange = () => {
    if (!birthDate || !deathDate || birthDate === '0001-01-01' || deathDate === '0002-02-02') {
      return '';
    }
    
    try {
      const birth = new Date(birthDate + 'T00:00:00');
      const death = new Date(deathDate + 'T00:00:00');
      const birthStr = birth.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC'
      });
      const deathStr = death.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC'
      });
      return `${birthStr} - ${deathStr}`;
    } catch (e) {
      return '';
    }
  };
  
  return (
    <Page size="A4" style={styles.interiorPage}>
      <Text style={styles.pageTitle}>Obituaries</Text>
      
      {/* Name as section header */}
      {fullName && (
        <Text style={[styles.sectionTitle, { marginBottom: 10, fontSize: 20 }]}>
          {fullName}
        </Text>
      )}
      
      {/* Date range subtitle */}
      {getDateRange() && (
        <Text style={[styles.bodyText, { marginBottom: 20, fontFamily: 'Times-Bold', fontSize: 14 }]}>
          {getDateRange()}
        </Text>
      )}
      
      {/* Main obituary text - no photo */}
      <View style={styles.section}>
        <Text style={styles.bodyText}>
          {obituaryText || 'A beloved life remembered with love and cherished memories.'}
        </Text>
      </View>
    </Page>
  );
};

// Order of Service Page Component - updated to show memorial details properly
const OrderOfServicePage = ({ data }) => {
  const speakers = getSpeakerInfo(data?.speeches);
  const memorialDetails = parseMemorialDetails(data?.bodyViewing?.viewingNotes);
  
  return (
    <Page size="A4" style={styles.orderPage}>
      {/* Sidebar with "ORDER OF SERVICE" - fixed */}
      <View style={styles.orderSidebar}>
        <Text style={styles.orderSidebarText}>ORDER OF SERVICE</Text>
      </View>
      
      {/* Main content */}
      <View style={styles.orderContent}>
        {speakers.length > 0 && speakers.map((speaker, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.orderRole}>
              {speaker.role.toUpperCase()}
            </Text>
            <Text style={styles.orderSpeaker}>
              {speaker.name}
              {speaker.relationship && ` - ${speaker.relationship}`}
            </Text>
          </View>
        ))}
        
        {/* Service Information */}
        {(memorialDetails.date || memorialDetails.time || memorialDetails.location || data?.bodyViewing || data?.burial || data?.repass) && (
          <>
            <View style={styles.separator} />
            
            {/* Memorial Service Info from memorial details */}
    
            
            {data?.bodyViewing && data.bodyViewing.hasViewing !== false && data.bodyViewing.viewingLocation && (
              <View style={styles.serviceInfoSection}>
                <Text style={styles.serviceInfoTitle}>Viewing</Text>
                <Text style={styles.serviceInfoText}>Location: {data.bodyViewing.viewingLocation}</Text>
                {data.bodyViewing.viewingDate && (
                  <Text style={styles.serviceInfoText}>Date: {formatDate(data.bodyViewing.viewingDate)}</Text>
                )}
              </View>
            )}
            
            {data?.burial && (
              <View style={styles.serviceInfoSection}>
                <Text style={styles.serviceInfoTitle}>
                  {data.burial.burialType === 'cremation' ? 'Cremation' : 'Burial'}
                </Text>
                {data.burial.cemeteryName && (
                  <Text style={styles.serviceInfoText}>Location: {data.burial.cemeteryName}</Text>
                )}
                {data.burial.burialAddress && (
                  <Text style={styles.serviceInfoText}>{data.burial.burialAddress}</Text>
                )}
              </View>
            )}
            
            {data?.repass && data.repass.hasRepass !== false && data.repass.venueName && (
              <View style={styles.serviceInfoSection}>
                <Text style={styles.serviceInfoTitle}>Reception</Text>
                <Text style={styles.serviceInfoText}>Location: {data.repass.venueName}</Text>
                {data.repass.repassAddress && (
                  <Text style={styles.serviceInfoText}>{data.repass.repassAddress}</Text>
                )}
              </View>
            )}
          </>
        )}
      </View>
    </Page>
  );
};

// Acknowledgment Page Component
const AcknowledgmentPage = ({ data }) => (
  <Page size="A4" style={styles.ackPage}>
    <Text style={styles.ackTitle}>Acknowledgment</Text>
    
    {data?.acknowledgments?.acknowledgmentText && (
      <>
        <Text style={styles.ackText}>{data.acknowledgments.acknowledgmentText}</Text>
        <Text style={styles.signature}>
          The Family of {data?.obituary?.fullName || data?.memorial?.deceasedName}
        </Text>
      </>
    )}
  </Page>
);

// Photo Gallery Page Component - simplified for end of document
const PhotoGalleryPage = ({ data }) => {
  // Get all available photos for the back page
  const allPhotos = data?.photos || [];
  
  return (
    <Page size="A4" style={styles.photoGalleryPage}>
      <Text style={styles.galleryTitle}>Memories</Text>
      
      <View style={styles.photoGrid}>
        {allPhotos.length > 0 ? (
          allPhotos.map((photo, index) => (
            photo?.fileUrl ? (
              <Image 
                key={photo.id || index}
                src={photo.fileUrl}
                style={styles.galleryPhoto}
              />
            ) : (
              <View key={photo.id || index} style={styles.galleryPhotoPlaceholder}>
                <Text style={styles.photoPlaceholder}>Photo {index + 1}</Text>
              </View>
            )
          ))
        ) : (
          <Text style={[styles.bodyText, { textAlign: 'center', marginTop: 50 }]}>
            Cherished memories live on in our hearts
          </Text>
        )}
      </View>
    </Page>
  );
};

// Quote/Memorial Page Component
const QuotePage = ({ data }) => (
  <Page size="A4" style={styles.quotePage}>
    <View style={styles.quoteSidebar}>
      <Text style={styles.quoteSidebarText}>POEM</Text>
    </View>
    
    <View style={styles.quoteContent}>
      <Text style={styles.quoteMarks}>"</Text>
      <Text style={styles.quoteText}>
        You will be missed but never forgotten.{'\n'}
        You have captured a place in our hearts.{'\n\n'}
        Though we cannot see you, we know you are here.{'\n'}
        What a blessing to have had you in our lives.
      </Text>
    </View>
  </Page>
);

// Main PDF Document Component
const MemorialPDFDocument = ({ data }) => (
  <Document>
    <CoverPage data={data} />
    <ObituaryPage data={data} />
    <OrderOfServicePage data={data} />
    <PhotoGalleryPage data={data} />
    <QuotePage data={data} />
    <AcknowledgmentPage data={data} />
  </Document>
);

// Main service function to generate and download PDF
export const generateMemorialPDF = async (memorialData) => {
  try {
    console.log('🔄 Starting elegant PDF generation...', memorialData);
    
    // Create the PDF document
    const doc = <MemorialPDFDocument data={memorialData} />;
    
    // Generate PDF blob
    const pdfBlob = await pdf(doc).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename
    const name = memorialData?.obituary?.fullName || 
                 memorialData?.memorial?.deceasedName || 
                 'Memorial';
    link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, '_')}_Memorial_Program.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Elegant PDF generated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to generate PDF' 
    };
  }
};

export default generateMemorialPDF;