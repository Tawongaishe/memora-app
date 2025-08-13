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
  message,
  Modal,
  Radio
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
  AlertCircle,
  Palette
} from 'lucide-react';
import memoraApi from '../services/memoraApi';
import { generateMemorialPDF } from '../services/memorialPdfService';
import { generateClassicPortraitPDF } from '../services/classicPortraitPdfService';
import { generateModernProgramPDF } from '../services/modernProgramPdfService';
import { generateTraditionalElegantPDF } from '../services/traditionalElegantPdfService';
import { generateFloralCelebrationPDF } from '../services/floralCelebrationPdfService';

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
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('classic-portrait');

  // PDF Style options
  const pdfStyles = [
    {
      id: 'classic-portrait',
      name: 'Classic Portrait',
      description: 'Full photo background with elegant text overlay',
      preview: '/api/placeholder/300/400', // You'll replace with actual preview images
      generator: generateClassicPortraitPDF,
      features: ['Full photo background', 'Elegant script typography', 'Dark overlay design', 'Intimate feel']
    },
    {
      id: 'modern-program',
      name: 'Modern Program',
      description: 'Clean, structured service program layout',
      preview: '/api/placeholder/300/400',
      generator: generateModernProgramPDF,
      features: ['Clean text layout', 'Structured program', 'Contemporary design', 'Service-focused']
    },
    {
      id: 'traditional-elegant',
      name: 'Traditional Elegant',
      description: 'Classic white background with formal typography',
      preview: '/api/placeholder/300/400',
      generator: generateTraditionalElegantPDF,
      features: ['Clean white background', 'Formal typography', 'Centered photo', 'Timeless design']
    },
    {
      id: 'floral-celebration',
      name: 'Floral Celebration',
      description: 'Soft pastels with decorative floral elements',
      preview: '/api/placeholder/300/400',
      generator: generateFloralCelebrationPDF,
      features: ['Soft pastel colors', 'Floral decorations', 'Celebratory feel', 'Feminine elegance']
    }
  ];

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

  const handleStyleSelection = () => {
    setShowStyleSelector(true);
  };

  const generatePDF = async (styleId = null) => {
    setIsGenerating(true);
    setShowStyleSelector(false);
    
    try {
      console.log('🔄 Generating PDF with style:', styleId || 'default');
      
      let result;
      
      if (styleId) {
        // Use selected style generator
        const selectedStyleConfig = pdfStyles.find(style => style.id === styleId);
        
        if (!selectedStyleConfig) {
          throw new Error('Selected PDF style not found');
        }
        
        result = await selectedStyleConfig.generator(memorialData);
        
        if (result.success) {
          message.success(`${selectedStyleConfig.name} memorial program generated successfully!`);
        }
      } else {
        // Use default memorialPdfService
        result = await generateMemorialPDF(memorialData);
        
        if (result.success) {
          message.success('Memorial program generated successfully!');
        }
      }
      
      if (result.success) {
        setProgramGenerated(true);
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
                icon={<Palette size={16} />}
                onClick={handleStyleSelection}
                disabled={isGenerating}
              >
                Alternative Styles
              </Button>
              <Button
                type="primary"
                icon={isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                onClick={() => generatePDF()}
                loading={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* PDF Style Selector Modal */}
      <Modal
        title="Choose Alternative Memorial Program Style"
        open={showStyleSelector}
        onCancel={() => setShowStyleSelector(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setShowStyleSelector(false)}>
            Cancel
          </Button>,
          <Button 
            key="generate" 
            type="primary" 
            onClick={() => generatePDF(selectedStyle)}
            loading={isGenerating}
          >
            Generate {pdfStyles.find(s => s.id === selectedStyle)?.name} Style
          </Button>
        ]}
      >
        <Radio.Group 
          value={selectedStyle} 
          onChange={(e) => setSelectedStyle(e.target.value)}
          style={{ width: '100%' }}
        >
          <Row gutter={[16, 16]}>
            {pdfStyles.map((style) => (
              <Col key={style.id} xs={24} sm={12} lg={6}>
                <Card
                  hoverable
                  size="small"
                  style={{
                    border: selectedStyle === style.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedStyle(style.id)}
                  cover={
                    <div style={{ 
                      height: 200, 
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {style.id === 'classic-portrait' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23333\'/%3E%3C/svg%3E")',
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '12px'
                        }}>
                          <div style={{ fontStyle: 'italic', marginBottom: '8px' }}>In Loving Memory...</div>
                          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>NAME</div>
                        </div>
                      )}
                      {style.id === 'modern-program' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#2D3748',
                          color: 'white',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div style={{ fontStyle: 'italic', fontSize: '18px', marginBottom: '8px' }}>Worship Service</div>
                          <div style={{ fontSize: '10px', letterSpacing: '2px' }}>PROGRAM</div>
                          <div style={{ marginTop: '16px', fontSize: '10px' }}>
                            <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                              <span>Scripture Reading</span><span>Minister</span>
                            </div>
                            <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                              <span>Prayer</span><span>Elder</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {style.id === 'traditional-elegant' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontStyle: 'italic', fontSize: '14px', marginBottom: '8px' }}>In Loving Memory</div>
                          <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', marginBottom: '8px', border: '1px solid #ccc' }}></div>
                          <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px' }}>Full Name</div>
                          <div style={{ fontSize: '10px', color: '#666' }}>Date - Date</div>
                        </div>
                      )}
                      {style.id === 'floral-celebration' && (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#FEFEFE',
                          color: '#5A5A5A',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          position: 'relative'
                        }}>
                          <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', backgroundColor: '#F4C2C2', borderRadius: '50%', opacity: 0.6 }}></div>
                          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '15px', height: '15px', backgroundColor: '#D4C5B9', borderRadius: '50%', opacity: 0.5 }}></div>
                          <div style={{ fontSize: '10px', marginBottom: '4px', color: '#8A7968', letterSpacing: '1px' }}>IN LOVING, LASTING MEMORY</div>
                          <div style={{ fontSize: '8px', marginBottom: '8px', color: '#8A7968' }}>of</div>
                          <div style={{ fontStyle: 'italic', fontSize: '14px', color: '#C85A5A', marginBottom: '8px' }}>Name</div>
                          <div style={{ width: '50px', height: '40px', backgroundColor: '#F8F5F3', border: '2px solid #E8D5C4', borderRadius: '4px' }}></div>
                        </div>
                      )}
                    </div>
                  }
                >
                  <div style={{ padding: '8px 0' }}>
                    <Radio value={style.id} style={{ marginBottom: '8px' }}>
                      <Text strong>{style.name}</Text>
                    </Radio>
                    <Paragraph style={{ margin: 0, fontSize: '12px' }}>
                      {style.description}
                    </Paragraph>
                    <div style={{ marginTop: '8px' }}>
                      {style.features.map((feature, index) => (
                        <Tag key={index} size="small" style={{ marginBottom: '4px' }}>
                          {feature}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Modal>

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

      {/* Content Sections - keeping all the existing collapse panels */}
      <Collapse accordion>
        {/* All your existing Panel components go here - I'll keep them as they are */}
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