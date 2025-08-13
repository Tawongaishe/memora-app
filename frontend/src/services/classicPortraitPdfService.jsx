// src/services/classicPortraitPdfService.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Style 1: Classic Portrait - Full photo background with text overlay
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000000',
    padding: 0,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#FFFFFF',
    position: 'relative'
  },
  
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 2
  },
  
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  
  memoryScript: {
    fontSize: 36,
    fontFamily: 'Times-Italic',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'left'
  },
  
  name: {
    fontSize: 52,
    fontFamily: 'Times-Bold',
    color: '#FFFFFF',
    textAlign: 'left',
    marginBottom: 10,
    lineHeight: 1.1
  },
  
  dates: {
    fontSize: 18,
    fontFamily: 'Times-Roman',
    color: '#FFFFFF',
    textAlign: 'left',
    letterSpacing: 2,
    marginBottom: 40
  },
  
  serviceInfo: {
    alignSelf: 'flex-end',
    textAlign: 'right'
  },
  
  serviceDate: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5
  },
  
  serviceLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 3
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
const ClassicPortraitCoverPage = ({ data }) => {
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
      {/* Background Image */}
      {coverPhoto?.fileUrl && (
        <Image 
          src={coverPhoto.fileUrl}
          style={styles.backgroundImage}
        />
      )}
      
      {/* Dark Overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      <View style={styles.content}>
        <View>
          <Text style={styles.memoryScript}>In Loving Memory...</Text>
          
          <Text style={styles.name}>
            {(data?.obituary?.fullName || 'BELOVED').toUpperCase()}
          </Text>
          
          {(data?.obituary?.birthDate && data?.obituary?.deathDate) && (
            <Text style={styles.dates}>
              {formatDate(data.obituary.birthDate).toUpperCase()} - {formatDate(data.obituary.deathDate).toUpperCase()}
            </Text>
          )}
        </View>
        
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceDate}>Memorial Service</Text>
          {memorialDetails.date && (
            <Text style={styles.serviceLocation}>{memorialDetails.date}</Text>
          )}
          {memorialDetails.time && (
            <Text style={styles.serviceLocation}>at {memorialDetails.time}</Text>
          )}
          {memorialDetails.location && (
            <Text style={styles.serviceLocation}>{memorialDetails.location}</Text>
          )}
        </View>
      </View>
    </Page>
  );
};

// Simple interior pages (you can expand these)
const InteriorPage = ({ title, content }) => (
  <Page size="A4" style={{ backgroundColor: '#1F2937', padding: 60, color: '#F3F4F6' }}>
    <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', color: '#FFFFFF', marginBottom: 30, textAlign: 'center' }}>
      {title}
    </Text>
    <Text style={{ fontSize: 14, lineHeight: 1.6, textAlign: 'justify' }}>
      {content}
    </Text>
  </Page>
);

// Main PDF Document
const ClassicPortraitDocument = ({ data }) => (
  <Document>
    <ClassicPortraitCoverPage data={data} />
    <InteriorPage 
      title="Obituary" 
      content={data?.obituary?.lifeStory || 'A beloved life remembered with love and cherished memories.'} 
    />
  </Document>
);

// Export function
export const generateClassicPortraitPDF = async (memorialData) => {
  try {
    console.log('🔄 Generating Classic Portrait PDF...');
    
    const doc = <ClassicPortraitDocument data={memorialData} />;
    const pdfBlob = await pdf(doc).toBlob();
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const name = memorialData?.obituary?.fullName || 'Memorial';
    link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, '_')}_Classic_Portrait.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Classic Portrait PDF generated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Classic Portrait PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};