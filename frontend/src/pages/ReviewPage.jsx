import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Card,
  Button,
  Collapse,
  Typography,
  Tag,
  Space,
  Row,
  Col,
  Spin,
  Alert,
  Descriptions,
  Image,
  Empty,
  message
} from 'antd';
import {
  Download,
  FileText,
  Check,
  Edit3,
  Share2,
  Heart,
  Camera,
  Users,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react';
import memoraApi from '../services/memoraApi';
import { generateMemorialPDF } from '../services/memorialPdfService';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const MemorialProgramReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [programGenerated, setProgramGenerated] = useState(false);
  const [memorialData, setMemorialData] = useState(null);
  const [error, setError] = useState(null);

  // Load memorial data on component mount
  useEffect(() => {
    loadMemorialData();
  }, []);

  const loadMemorialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📋 Loading memorial data for review...');
      const response = await memoraApi.getMemorialData();
      
      console.log('🔍 Raw API response:', response);
      
      if (response && response.memorialData) {
        console.log('📊 Memorial data found:', response.memorialData);
        
        // Transform the backend data structure to match our component expectations
        const transformedData = {
          obituary: response.memorialData.obituary,
          speeches: response.memorialData.speeches,
          photos: response.memorialData.photos,
          burial: response.memorialData.burialLocation,
          acknowledgments: response.memorialData.acknowledgements,
          repass: response.memorialData.repassLocation,
          bodyViewing: response.memorialData.bodyViewing,
          memorial: response.memorialData.memorial
        };
        
        console.log('🔄 Transformed data:', transformedData);
        setMemorialData(transformedData);
      } else {
        console.log('❌ No memorial_data found in response. Full response:', response);
        
        // If no data from backend, create empty structure for editing
        setMemorialData({
          obituary: null,
          speeches: null,
          photos: null,
          burial: null,
          acknowledgments: null,
          repass: null
        });
      }
    } catch (error) {
      console.error('❌ Error loading memorial data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (section) => {
    // Navigate to specific section for editing
    const routeMap = {
      obituary: '/obituary',
      speeches: '/speeches', 
      photos: '/photos',
      burial: '/burial-location',
      acknowledgments: '/acknowledgements',
      repass: '/repass-location'
    };
    
    if (routeMap[section]) {
      navigate(routeMap[section]);
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🔄 Generating PDF with data:', memorialData);
      
      const result = await generateMemorialPDF(memorialData);
      
      if (result.success) {
        setProgramGenerated(true);
        message.success('Memorial program PDF generated and downloaded successfully!');
      } else {
        throw new Error(result.error || 'PDF generation failed');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      message.error(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePrintableHTML = (data) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Memorial Program - ${data?.obituary?.fullName || 'Memorial'}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 40px; 
              line-height: 1.6; 
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 20px;
            }
            .title { 
              font-size: 28px; 
              font-weight: bold; 
              margin-bottom: 10px;
              color: #8b5cf6;
            }
            .name { 
              font-size: 24px; 
              font-weight: bold; 
              margin-bottom: 5px; 
            }
            .dates { 
              font-size: 18px; 
              color: #666; 
            }
            .section { 
              margin-bottom: 30px; 
              page-break-inside: avoid;
            }
            .section-title { 
              font-size: 20px; 
              font-weight: bold; 
              margin-bottom: 15px; 
              color: #8b5cf6;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 5px;
            }
            .content { 
              font-size: 14px; 
              margin-bottom: 10px; 
            }
            .speaker-list { 
              margin-left: 20px; 
            }
            .speaker { 
              margin-bottom: 8px; 
            }
            .speaker strong { 
              display: inline-block; 
              width: 140px; 
            }
            @media print {
              body { margin: 20px; }
              .header { margin-bottom: 30px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">In Loving Memory</div>
            ${data?.obituary?.fullName ? `<div class="name">${data.obituary.fullName}</div>` : ''}
            ${data?.obituary?.birthDate && data?.obituary?.deathDate ? 
              `<div class="dates">${data.obituary.birthDate} - ${data.obituary.deathDate}</div>` : ''}
          </div>

          ${data?.obituary?.lifeStory ? `
            <div class="section">
              <div class="section-title">Life Story</div>
              <div class="content">${data.obituary.lifeStory}</div>
            </div>
          ` : ''}

          ${data?.obituary?.survivedBy ? `
            <div class="section">
              <div class="section-title">Survived By</div>
              <div class="content">${data.obituary.survivedBy}</div>
            </div>
          ` : ''}

          ${data?.burial ? `
            <div class="section">
              <div class="section-title">Burial Service</div>
              ${data.burial.cemeteryName ? `<div class="content"><strong>Location:</strong> ${data.burial.cemeteryName}</div>` : ''}
              ${data.burial.burialAddress ? `<div class="content">${data.burial.burialAddress}</div>` : ''}
              ${data.burial.burialDate && data.burial.burialTime ? 
                `<div class="content"><strong>Date & Time:</strong> ${data.burial.burialDate} at ${data.burial.burialTime}</div>` : ''}
            </div>
          ` : ''}

          ${data?.repass ? `
            <div class="section">
              <div class="section-title">Reception Following Service</div>
              ${data.repass.repassLocation ? `<div class="content"><strong>Location:</strong> ${data.repass.repassLocation}</div>` : ''}
              ${data.repass.repassAddress ? `<div class="content">${data.repass.repassAddress}</div>` : ''}
              ${data.repass.repassTime ? `<div class="content"><strong>Time:</strong> ${data.repass.repassTime}</div>` : ''}
            </div>
          ` : ''}

          ${data?.speeches ? `
            <div class="section">
              <div class="section-title">Order of Service</div>
              <div class="speaker-list">
                ${data.speeches.introductionSpeaker ? `<div class="speaker"><strong>Opening Remarks:</strong> ${data.speeches.introductionSpeaker}</div>` : ''}
                ${data.speeches.prayerSpeaker ? `<div class="speaker"><strong>Prayer:</strong> ${data.speeches.prayerSpeaker}</div>` : ''}
                ${data.speeches.eulogySpeaker ? `<div class="speaker"><strong>Eulogy:</strong> ${data.speeches.eulogySpeaker}</div>` : ''}
                ${data.speeches.closingSpeaker ? `<div class="speaker"><strong>Closing Remarks:</strong> ${data.speeches.closingSpeaker}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${data?.acknowledgments?.acknowledgmentText ? `
            <div class="section">
              <div class="section-title">Acknowledgments</div>
              <div class="content">${data.acknowledgments.acknowledgmentText}</div>
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Memorial Program - ${memorialData?.obituary?.fullName}`,
          text: 'Memorial service program',
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    }
  };

  // Helper function to check if section has data
  const hasData = (data) => {
    if (!data) return false;
    
    // Handle different data types
    if (Array.isArray(data)) {
      return data.length > 0;
    }
    
    if (typeof data === 'object') {
      // For objects, check if they have meaningful values (not just null/empty)
      const values = Object.values(data);
      return values.some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim() !== '';
        if (typeof value === 'boolean') return value === true;
        return true;
      });
    }
    
    return false;
  };

  const hasRepassData = (repass) => {
    return repass && (repass.hasRepass === true || repass.venueName || repass.repassAddress);
  };

  const hasViewingData = (viewing) => {
    return viewing && (viewing.hasViewing === true || viewing.viewingLocation);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error Loading Memorial Data"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={loadMemorialData}>
              Try Again
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <FileText size={32} />
              <div>
                <Title level={2} style={{ margin: 0 }}>Memorial Program Review</Title>
                <Text type="secondary">Review and finalize your memorial service program</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<Share2 size={16} />}
                onClick={handleShare}
                disabled={isGenerating}
              >
                Share
              </Button>
              <Button
                type="primary"
                icon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                onClick={generatePDF}
                loading={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Memorial Overview */}
      {(memorialData?.obituary || memorialData?.memorial) && (
        <Card style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="small">
              <Heart size={24} />
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                In Loving Memory of {memorialData?.obituary?.fullName || memorialData?.memorial?.deceasedName}
              </Title>
              {memorialData?.obituary?.birthDate && memorialData?.obituary?.deathDate && (
                <Text style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
                  {memorialData.obituary.birthDate} - {memorialData.obituary.deathDate}
                </Text>
              )}
            </Space>
          </div>
        </Card>
      )}

      {/* Content Sections */}
      <Collapse accordion>
        {/* Obituary Section */}
        <Panel
          header={
            <Space>
              <FileText size={20} />
              <Text strong>Obituary</Text>
              <Tag color={hasData(memorialData?.obituary) ? 'success' : 'error'}>
                {hasData(memorialData?.obituary) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="obituary"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('obituary');
              }}
            >
              Edit
            </Button>
          }
        >
          {memorialData?.obituary ? (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Name">{memorialData.obituary.fullName}</Descriptions.Item>
              <Descriptions.Item label="Birth Date">{memorialData.obituary.birthDate}</Descriptions.Item>
              <Descriptions.Item label="Date of Passing">{memorialData.obituary.deathDate}</Descriptions.Item>
              {memorialData.obituary.lifeStory && (
                <Descriptions.Item label="Life Story">
                  <Paragraph>{memorialData.obituary.lifeStory}</Paragraph>
                </Descriptions.Item>
              )}
              {memorialData.obituary.survivedBy && (
                <Descriptions.Item label="Survived By">
                  <Paragraph>{memorialData.obituary.survivedBy}</Paragraph>
                </Descriptions.Item>
              )}
            </Descriptions>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No obituary data available. Click Edit to add information."
            />
          )}
        </Panel>

        {/* Body Viewing Section */}
        <Panel
          header={
            <Space>
              <Users size={20} />
              <Text strong>Body Viewing</Text>
              <Tag color={hasViewingData(memorialData?.bodyViewing) ? 'success' : 'error'}>
                {hasViewingData(memorialData?.bodyViewing) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="bodyViewing"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('body-viewing');
              }}
            >
              Edit
            </Button>
          }
        >
          {hasViewingData(memorialData?.bodyViewing) ? (
            <Descriptions column={1} bordered>
              {memorialData.bodyViewing.hasViewing === false ? (
                <Descriptions.Item label="Status">
                  <Text type="secondary">No viewing planned</Text>
                </Descriptions.Item>
              ) : (
                <>
                  {memorialData.bodyViewing.viewingLocation && (
                    <Descriptions.Item label="Location">{memorialData.bodyViewing.viewingLocation}</Descriptions.Item>
                  )}
                  {memorialData.bodyViewing.viewingDate && (
                    <Descriptions.Item label="Date">{memorialData.bodyViewing.viewingDate}</Descriptions.Item>
                  )}
                  {(memorialData.bodyViewing.viewingStartTime || memorialData.bodyViewing.viewingEndTime) && (
                    <Descriptions.Item label="Time">
                      {memorialData.bodyViewing.viewingStartTime} 
                      {memorialData.bodyViewing.viewingEndTime && ` - ${memorialData.bodyViewing.viewingEndTime}`}
                    </Descriptions.Item>
                  )}
                  {memorialData.bodyViewing.viewingNotes && (
                    <Descriptions.Item label="Notes">{memorialData.bodyViewing.viewingNotes}</Descriptions.Item>
                  )}
                </>
              )}
            </Descriptions>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No body viewing information. Click Edit to add details."
            />
          )}
        </Panel>

        {/* Speeches Section */}
        <Panel
          header={
            <Space>
              <Users size={20} />
              <Text strong>Ceremony Speeches</Text>
              <Tag color={hasData(memorialData?.speeches) ? 'success' : 'error'}>
                {hasData(memorialData?.speeches) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="speeches"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('speeches');
              }}
            >
              Edit
            </Button>
          }
        >
          {memorialData?.speeches && memorialData.speeches.length > 0 ? (
            <Descriptions column={1} bordered>
              {memorialData.speeches.map((speech, index) => (
                <Descriptions.Item 
                  key={speech.id} 
                  label={speech.speechType || `Speaker ${index + 1}`}
                >
                  <div>
                    <Text strong>{speech.speakerName}</Text>
                    {speech.relationship && (
                      <Text type="secondary"> ({speech.relationship})</Text>
                    )}
                    {speech.notes && (
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary">{speech.notes}</Text>
                      </div>
                    )}
                  </div>
                </Descriptions.Item>
              ))}
            </Descriptions>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No speech assignments available. Click Edit to add speakers."
            />
          )}
        </Panel>

        {/* Photos Section */}
        <Panel
          header={
            <Space>
              <Camera size={20} />
              <Text strong>Photo Gallery</Text>
              <Tag color={hasData(memorialData?.photos) ? 'success' : 'error'}>
                {hasData(memorialData?.photos) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="photos"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('photos');
              }}
            >
              Edit
            </Button>
          }
        >
          {memorialData?.photos && memorialData.photos.length > 0 ? (
            <Row gutter={[16, 16]}>
              {memorialData.photos.map((photo, index) => (
                <Col key={photo.id} xs={12} sm={8} md={6}>
                  <div style={{ 
                    aspectRatio: '1',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #d9d9d9'
                  }}>
                    {photo.fileUrl ? (
                      <img 
                        src={photo.fileUrl} 
                        alt={photo.filename}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div style={{ 
                      width: '100%',
                      height: '100%',
                      display: photo.fileUrl ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Camera size={24} color="#bfbfbf" />
                      <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                        {photo.filename || `Photo ${index + 1}`}
                      </Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No photos selected. Click Edit to add photos."
            />
          )}
        </Panel>

        {/* Burial Location Section */}
        <Panel
          header={
            <Space>
              <MapPin size={20} />
              <Text strong>Burial Location</Text>
              <Tag color={hasData(memorialData?.burial) ? 'success' : 'error'}>
                {hasData(memorialData?.burial) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="burial"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('burial');
              }}
            >
              Edit
            </Button>
          }
        >
          {memorialData?.burial ? (
            <Descriptions column={1} bordered>
              {memorialData.burial.cemeteryName && (
                <Descriptions.Item label="Cemetery">{memorialData.burial.cemeteryName}</Descriptions.Item>
              )}
              {memorialData.burial.burialAddress && (
                <Descriptions.Item label="Address">{memorialData.burial.burialAddress}</Descriptions.Item>
              )}
              {(memorialData.burial.burialDate || memorialData.burial.burialTime) && (
                <Descriptions.Item label="Date & Time">
                  {memorialData.burial.burialDate} {memorialData.burial.burialTime && `at ${memorialData.burial.burialTime}`}
                </Descriptions.Item>
              )}
            </Descriptions>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No burial location information. Click Edit to add details."
            />
          )}
        </Panel>

        {/* Acknowledgments Section */}
        <Panel
          header={
            <Space>
              <Heart size={20} />
              <Text strong>Acknowledgments</Text>
              <Tag color={hasData(memorialData?.acknowledgments) ? 'success' : 'error'}>
                {hasData(memorialData?.acknowledgments) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="acknowledgments"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('acknowledgments');
              }}
            >
              Edit
            </Button>
          }
        >
          {memorialData?.acknowledgments?.acknowledgmentText ? (
            <Paragraph>{memorialData.acknowledgments.acknowledgmentText}</Paragraph>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No acknowledgment message. Click Edit to add your message."
            />
          )}
        </Panel>

        {/* Repass Section */}
        <Panel
          header={
            <Space>
              <MapPin size={20} />
              <Text strong>Repass Location</Text>
              <Tag color={hasRepassData(memorialData?.repass) ? 'success' : 'error'}>
                {hasRepassData(memorialData?.repass) ? 'Complete' : 'Missing'}
              </Tag>
            </Space>
          }
          key="repass"
          extra={
            <Button
              size="small"
              icon={<Edit3 size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit('repass');
              }}
            >
              Edit
            </Button>
          }
        >
          {hasRepassData(memorialData?.repass) ? (
            <Descriptions column={1} bordered>
              {memorialData.repass.hasRepass === false ? (
                <Descriptions.Item label="Status">
                  <Text type="secondary">No repass planned</Text>
                </Descriptions.Item>
              ) : (
                <>
                  {memorialData.repass.venueName && (
                    <Descriptions.Item label="Venue">{memorialData.repass.venueName}</Descriptions.Item>
                  )}
                  {memorialData.repass.repassAddress && (
                    <Descriptions.Item label="Address">{memorialData.repass.repassAddress}</Descriptions.Item>
                  )}
                  {memorialData.repass.repassDate && (
                    <Descriptions.Item label="Date">{memorialData.repass.repassDate}</Descriptions.Item>
                  )}
                  {memorialData.repass.repassTime && (
                    <Descriptions.Item label="Time">{memorialData.repass.repassTime}</Descriptions.Item>
                  )}
                  {memorialData.repass.repassNotes && (
                    <Descriptions.Item label="Notes">{memorialData.repass.repassNotes}</Descriptions.Item>
                  )}
                </>
              )}
            </Descriptions>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No repass location information. Click Edit to add details."
            />
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default MemorialProgramReviewPage;