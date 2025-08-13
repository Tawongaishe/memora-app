// src/services/modernProgramPdfService.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Style 2: Modern Program - Clean text-based design
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#2D3748',
    padding: 0,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    color: '#FFFFFF'
  },
  
  header: {
    padding: 60,
    paddingBottom: 40
  },
  
  serviceTitle: {
    fontSize: 42,
    fontFamily: 'Times-Italic',
    color: '#FFFFFF',
    marginBottom: 10
  },
  
  programText: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#CBD5E0',
    letterSpacing: 4,
    textTransform: 'uppercase'
  },
  
  content: {
    padding: 60,
    paddingTop: 20,
    flex: 1
  },
  
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  
  orderRole: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#FFFFFF'
  },
  
  orderSpeaker: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: '#CBD5E0'
  },
  
  footer: {
    backgroundColor: '#F7FAFC',
    color: '#2D3748',
    padding: 30,
    marginTop: 'auto'
  },
  
  footerText: {
    fontSize: 14,
    fontFamily: 'Times-Roman',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 1.4
  },
  
  footerBold: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8
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

// Helper function to get speaker info
const getSpeakerInfo = (speeches) => {
  if (!speeches || !Array.isArray(speeches)) return [];
  
  const roleMap = {
    0: 'Scripture Reading',
    1: 'Opening Prayer', 
    2: 'Eulogy',
    3: 'Closing Remarks'
  };
  
  return speeches.map((speech, index) => ({
    role: speech.speechType || roleMap[index] || `Speaker ${index + 1}`,
    name: speech.speakerName || `Speaker ${speech.relationship || index + 1}`
  }));
};

// Cover Page Component
const ModernProgramCoverPage = ({ data }) => {
  const speakers = getSpeakerInfo(data?.speeches);
  const memorialDetails = parseMemorialDetails(data?.bodyViewing?.viewingNotes);
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.serviceTitle}>Worship Service</Text>
        <Text style={styles.programText}>PROGRAM</Text>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {speakers.length > 0 && speakers.map((speaker, index) => (
          <View key={index} style={styles.orderRow}>
            <Text style={styles.orderRole}>{speaker.role}</Text>
            <Text style={styles.orderSpeaker}>{speaker.name}</Text>
          </View>
        ))}
        
        {/* Add default service elements if no speakers */}
        {speakers.length === 0 && (
          <>
            <View style={styles.orderRow}>
              <Text style={styles.orderRole}>Scripture Reading</Text>
              <Text style={styles.orderSpeaker}>Minister</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderRole}>Opening Prayer</Text>
              <Text style={styles.orderSpeaker}>Elder</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderRole}>Eulogy</Text>
              <Text style={styles.orderSpeaker}>Family Member</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderRole}>Closing Remarks</Text>
              <Text style={styles.orderSpeaker}>Minister</Text>
            </View>
          </>
        )}
      </View>
      
      {/* Footer with service details */}
      <View style={styles.footer}>
        {memorialDetails.date && (
          <Text style={styles.footerBold}>
            {memorialDetails.date}
            {memorialDetails.time && ` | ${memorialDetails.time}`}
          </Text>
        )}
        {data?.obituary?.fullName && (
          <Text style={styles.footerText}>
            In Memory of {data.obituary.fullName}
          </Text>
        )}
        {memorialDetails.location && (
          <Text style={styles.footerText}>{memorialDetails.location}</Text>
        )}
      </View>
    </Page>
  );
};

// Interior page for obituary
const ModernInteriorPage = ({ data }) => (
  <Page size="A4" style={{ backgroundColor: '#2D3748', padding: 60, color: '#FFFFFF' }}>
    <Text style={{ fontSize: 24, fontFamily: 'Times-Bold', color: '#FFFFFF', marginBottom: 30, textAlign: 'center' }}>
      Obituary
    </Text>
    
    {data?.obituary?.fullName && (
      <Text style={{ fontSize: 18, fontFamily: 'Times-Bold', color: '#CBD5E0', marginBottom: 20, textAlign: 'center' }}>
        {data.obituary.fullName}
      </Text>
    )}
    
    <Text style={{ fontSize: 14, lineHeight: 1.8, color: '#E2E8F0', textAlign: 'justify' }}>
      {data?.obituary?.lifeStory || 'A beloved life remembered with love and cherished memories.'}
    </Text>
    
    {data?.obituary?.survivedBy && (
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 16, fontFamily: 'Times-Bold', color: '#CBD5E0', marginBottom: 10 }}>
          Survived By
        </Text>
        <Text style={{ fontSize: 14, lineHeight: 1.6, color: '#E2E8F0' }}>
          {data.obituary.survivedBy}
        </Text>
      </View>
    )}
  </Page>
);

// Main PDF Document
const ModernProgramDocument = ({ data }) => (
  <Document>
    <ModernProgramCoverPage data={data} />
    <ModernInteriorPage data={data} />
  </Document>
);

// Export function
export const generateModernProgramPDF = async (memorialData) => {
  try {
    console.log('🔄 Generating Modern Program PDF...');
    
    const doc = <ModernProgramDocument data={memorialData} />;
    const pdfBlob = await pdf(doc).toBlob();
    
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const name = memorialData?.obituary?.fullName || 'Memorial';
    link.download = `${name.replace(/[^a-zA-Z0-9\s]/g, '_')}_Modern_Program.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Modern Program PDF generated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Modern Program PDF generation failed:', error);
    return { success: false, error: error.message };
  }
};