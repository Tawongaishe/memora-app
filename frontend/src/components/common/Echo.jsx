// src/components/common/Echo.jsx
import React from 'react';
import { Card, Typography, Space, Badge } from 'antd';
import { BookOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const Echo = ({ title, content, culturalContext }) => {
  return (
    <Card
      style={{
        marginBottom: '24px',
        borderLeft: '4px solid #667eea',
        background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)',
        border: '1px solid #e6f0ff'
      }}
      bodyStyle={{ padding: '20px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space align="start" size="large">
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <BookOutlined style={{ color: 'white', fontSize: '18px' }} />
          </div>
          
          <div style={{ flex: 1 }}>
            <Text 
              strong 
              style={{ 
                fontSize: '18px', 
                color: '#2c3e50',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              {title}
            </Text>
            
            <Paragraph 
              style={{ 
                color: '#4a5568', 
                marginBottom: 0,
                lineHeight: '1.6',
                fontSize: '15px'
              }}
            >
              {content}
            </Paragraph>
          </div>
        </Space>
        
        {culturalContext && (
          <div
            style={{
              background: 'rgba(102, 126, 234, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              borderLeft: '3px solid #667eea'
            }}
          >
            <Space align="start" size="small">
              <Badge 
                color="#667eea" 
                text={
                  <Text strong style={{ color: '#667eea', fontSize: '13px' }}>
                    CULTURAL CONTEXT
                  </Text>
                } 
              />
            </Space>
            <Paragraph 
              style={{ 
                color: '#4a5568', 
                marginTop: '8px',
                marginBottom: 0,
                fontSize: '14px',
                fontStyle: 'italic'
              }}
            >
              {culturalContext}
            </Paragraph>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default Echo;