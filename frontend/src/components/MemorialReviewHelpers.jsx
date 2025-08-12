// src/components/memorial/MemorialReviewHelpers.jsx
import React from 'react';
import { Panel } from 'antd/lib/collapse';
import { Button, Tag, Space, Typography, Descriptions, Empty } from 'antd';
import { Edit3 } from 'lucide-react';

const { Text, Paragraph } = Typography;

/**
 * Reusable Panel component for memorial sections
 * Eliminates the repetitive panel structure across all sections
 */
export const ReusablePanel = ({ 
  icon, 
  title, 
  sectionKey, 
  data, 
  hasDataFn, 
  onEdit, 
  children 
}) => (
  <Panel
    header={
      <Space>
        {icon}
        <Text strong>{title}</Text>
        <Tag color={hasDataFn(data) ? 'success' : 'error'}>
          {hasDataFn(data) ? 'Complete' : 'Missing'}
        </Tag>
      </Space>
    }
    key={sectionKey}
    extra={
      <Button
        size="small"
        icon={<Edit3 size={14} />}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(sectionKey);
        }}
      >
        Edit
      </Button>
    }
  >
    {children}
  </Panel>
);

/**
 * Reusable descriptions component for displaying field data
 * Handles the common pattern of showing key-value pairs
 */
export const SectionDescriptions = ({ data, fields }) => (
  <Descriptions column={1} bordered>
    {fields.map(({ key, label, formatter }) => {
      const value = key.includes('.') ? 
        // Handle nested keys like 'burial.date'
        key.split('.').reduce((obj, k) => obj?.[k], data) :
        data[key];
        
      if (!value && value !== 0) return null;
      
      return (
        <Descriptions.Item key={key} label={label}>
          {formatter ? formatter(data) : value}
        </Descriptions.Item>
      );
    })}
  </Descriptions>
);

/**
 * Reusable empty state component
 * Provides consistent empty states across all sections
 */
export const EmptySection = ({ description }) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={description}
  />
);

/**
 * Helper function to check if section has meaningful data
 * Consolidates the repeated data validation logic
 */
export const hasData = (data) => {
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

/**
 * Specialized helper functions for specific section types
 */
export const hasRepassData = (repass) => {
  return repass && (repass.hasRepass === true || repass.venueName || repass.repassAddress);
};

export const hasViewingData = (viewing) => {
  return viewing && (viewing.hasViewing === true || viewing.viewingLocation);
};

/**
 * Photo gallery component
 * Extracted to reduce complexity in main component
 */
export const PhotoGallery = ({ photos }) => (
  <Row gutter={[16, 16]}>
    {photos.map((photo, index) => (
      <Col key={photo.id || index} xs={12} sm={8} md={6}>
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
              alt={photo.filename || `Photo ${index + 1}`}
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
);

/**
 * Speech list component
 * Handles the specific rendering for speeches section
 */
export const SpeechList = ({ speeches }) => (
  <Descriptions column={1} bordered>
    {speeches.map((speech, index) => (
      <Descriptions.Item 
        key={speech.id || index} 
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
);

/**
 * Status display component for sections that can be disabled
 * (like viewing and repass sections)
 */
export const StatusDisplay = ({ hasService, serviceName }) => (
  <Descriptions column={1} bordered>
    <Descriptions.Item label="Status">
      <Text type="secondary">No {serviceName} planned</Text>
    </Descriptions.Item>
  </Descriptions>
);