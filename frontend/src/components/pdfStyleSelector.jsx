// src/components/PDFStyleSelector.jsx
import React from 'react';
import { Card, Radio, Typography, Tag, Row, Col } from 'antd';
import { Palette } from 'lucide-react';
import { generateMemorialPDF } from '../services/memorialPdfService';
import { generateFloralCelebrationPDF } from '../services/floralCelebrationPdfService';

const { Text, Paragraph } = Typography;

const PDFStyleSelector = ({ selectedStyle, onStyleChange }) => {
  // PDF Style options - only 3 styles for testing
  const pdfStyles = [
    {
      id: 'classic-memorial',
      name: 'Classic Memorial',
      description: 'Traditional memorial program with elegant layout',
      generator: generateMemorialPDF,
      features: ['Traditional layout', 'Clean typography', 'Professional design', 'Timeless feel']
    },
    {
      id: 'floral-celebration',
      name: 'Floral Celebration',
      description: 'Soft pastels with decorative floral elements',
      generator: generateFloralCelebrationPDF,
      features: ['Soft pastel colors', 'Floral decorations', 'Celebratory feel', 'Feminine elegance']
    },
  ];

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette size={20} />
          <Text strong>Choose Memorial Program Style</Text>
        </div>
      }
      style={{ marginBottom: '24px' }}
    >
      <Radio.Group 
        value={selectedStyle} 
        onChange={(e) => onStyleChange(e.target.value)}
        style={{ width: '100%' }}
      >
        <Row gutter={[16, 16]}>
          {pdfStyles.map((style) => (
            <Col key={style.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                size="small"
                style={{
                  border: selectedStyle === style.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  cursor: 'pointer'
                }}
                onClick={() => onStyleChange(style.id)}
                cover={
                  <div style={{ 
                    height: 200, 
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {style.id === 'classic-memorial' && (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1F2937',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        padding: '16px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>M</div>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>E</div>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>M</div>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>O</div>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>R</div>
                        <div style={{ fontSize: '24px' }}>Y</div>
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
                    {style.id === 'black-gold-elegance' && (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000000',
                        color: '#FFD700',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        position: 'relative',
                        border: '2px solid #FFD700'
                      }}>
                        <div style={{ position: 'absolute', top: '8px', left: '8px', width: '12px', height: '12px', backgroundColor: '#FFD700', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '12px', height: '12px', backgroundColor: '#FFD700', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '12px', height: '12px', backgroundColor: '#FFD700', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '12px', height: '12px', backgroundColor: '#FFD700', borderRadius: '50%' }}></div>
                        <div style={{ fontSize: '12px', marginBottom: '4px', letterSpacing: '2px' }}>IN LOVING</div>
                        <div style={{ fontStyle: 'italic', fontSize: '18px', marginBottom: '8px' }}>Memory</div>
                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>NAME</div>
                        <div style={{ width: '50px', height: '40px', backgroundColor: 'white', border: '2px solid #FFD700', borderRadius: '4px' }}></div>
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
    </Card>
  );
};

export default PDFStyleSelector;