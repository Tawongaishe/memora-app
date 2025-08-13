// src/services/traditionalElegantPdfService.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Style 3: Traditional Elegant - Clean white background with structured hierarchy
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 60,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#000000'
  },
  
  header: {
    textAlign: 'center',
    marginBottom: 40
  },
  
  memoryScript: {
    fontSize: 32,
    fontFamily: 'Times-Italic',
    color: '#000000',
    marginBottom: 30,
    letterSpacing: 2
  },
  
  photoContainer: {
    width: 200,
    height: 250,
    backgroundColor: '#F5F5F5',
    alignSelf: 'center',
    marginBottom: 30,
    border: '2px solid #E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  
  photoPlaceholder: {
    color: '#999999',
    fontSize: 14
  },
  
  name: {
    fontSize: 28,
    fontFamily: 'Times-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1
  },
  
  dates: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40
  },
  
  serviceInfo: {
    textAlign: 'center',
    marginTop: 40
  },
  
  serviceTitle: {
    fontSize: 18,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 15
  },
  
  serviceDetail: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#333333',
    marginBottom: 5
  },
  
  separator: {
    width: 60,
    height: 1,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginVertical: 20
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

// Cover Page Component
const TraditionalElegantCoverPage = ({ data }) => {
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.memoryScript}>In Loving Memory</Text>
        
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
        
        {/* Name */}
        <Text style={styles.name}>
          {data?.obituary?.fullName || 'BELOVED'}
        </Text>
        
        {/* Dates */}
        {(data?.obituary?.birthDate && data?.obituary?.deathDate) && (
          <Text style={styles.dates}>
            {formatDate(data.obituary.birthDate)} - {formatDate(data.obituary.deathDate)}
          </Text>
        )}
        
        <View style={styles.separator} />
        
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
    </Page>
  );
};

// Interior page styles
const interiorStyles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 60,
    color: '#000000',
    fontFamily: 'Times-Roman'
  },
  
  title: {
    fontSize: 24,
    fontFamily: 'Times-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2
  },
  
  nameSubtitle: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20
  },
  
  content: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#333333',
    textAlign: 'justify'
  },
  
  section: {
    marginBottom: 25
  },
  
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#000000',
    marginBottom: 10
  }
});

// Interior page for obituary
const TraditionalInteriorPage = ({ data }) => (
  <Page size="A4" style={interiorStyles.page}>
    <Text style={interiorStyles.title}>Obituary</Text>
    
    {data?.obituary?.fullName && (
      <Text style={interiorStyles.nameSubtitle}>
        {data.obituary.fullName}
      </Text>
    )}
    
    <View style={interiorStyles.section}>
      <Text style={interiorStyles.content}>
        {data?.obituary?.lifeStory || 'A beloved life remembered with love and cherished memories.'}
      </Text>
    </View>
    
    {data?.obituary?.survivedBy && (
      <View style={interiorStyles.section}>
        <Text style={interiorStyles.sectionTitle}>Survived By</Text>
        <Text style={interiorStyles.content}>
          {data.obituary.survivedBy}
        </Text>
      </View>
    )}
    
    {data?.obituary?.precededBy && (
      <View style={interiorStyles.section}>
        <Text style={interiorStyles.sectionTitle}>Preceded in Death By</Text>
        <Text style={interiorStyles.content}>
          {data.obituary.precededBy}
        </Text>
      </View>
    )}
  </Page>
);

// Main PDF Document
const TraditionalElegantDocument = ({ data }) => (
  <Document>
    <TraditionalElegantCoverPage data={data} />
    <TraditionalInteriorPage data={data} />
  </Document>
);

// Export function
export const generateTraditionalElegantPDF = async (memorialData) => {
  try {
    console.log('🔄 Generating Traditional Elegant PDF...');
    
    const doc = <TraditionalElegantDocument data={memorialData} />;
    const pdfBlob = await pdf(doc).toBlob();
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const name = memorialData?.obituary?.fullName || 'Memorial';
    link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, '_')}_Traditional_Elegant.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Traditional Elegant PDF generated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Traditional Elegant PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};