// src/components/common/UniversalFormPage.jsx
import React, { useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import { formPageStyles } from '../styles/MemoraStyles';

const UniversalFormPage = ({ 
  title, 
  prompt, 
  formFields = [], 
  onBack, 
  onNext, 
  progressStep = 1,
  totalSteps = 8,
  initialData = {},
  layout = 'grid' // 'grid', 'single-column', 'two-column'
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleFormChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const isFormValid = () => {
    const requiredFields = formFields.filter(field => field.required);
    return requiredFields.every(field => formData[field.name] && formData[field.name].trim());
  };

  const handleNext = () => {
    if (onNext) {
      onNext(formData);
    }
  };

  const renderField = (field) => {
    const fieldStyle = {
      ...formPageStyles.formField,
      ...(field.fullWidth ? formPageStyles.fullWidth : {})
    };

    return (
      <div key={field.name} style={fieldStyle}>
        <label style={formPageStyles.formLabel}>
          {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            style={{
              ...formPageStyles.formInput,
              borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'}
          />
        )}
        
        {field.type === 'email' && (
          <input
            type="email"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            style={{
              ...formPageStyles.formInput,
              borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'}
          />
        )}
        
        {field.type === 'tel' && (
          <input
            type="tel"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            style={{
              ...formPageStyles.formInput,
              borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'}
          />
        )}
        
        {field.type === 'textarea' && (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            style={{
              ...formPageStyles.formTextarea(field.rows),
              borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'}
          />
        )}
        
        {field.type === 'select' && (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            style={{
              ...formPageStyles.formSelect,
              borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'}
            onBlur={(e) => e.target.style.borderColor = formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'}
          >
            {field.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {field.type === 'file' && (
          <div>
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => {
                const files = field.multiple ? Array.from(e.target.files) : e.target.files[0];
                handleFormChange(field.name, files);
              }}
              style={{
                ...formPageStyles.formInput,
                borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'}
              onBlur={(e) => e.target.style.borderColor = formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'}
            />
            {formData[field.name] && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                {field.multiple ? 
                  `${formData[field.name].length} file(s) selected` : 
                  `Selected: ${formData[field.name].name}`
                }
              </div>
            )}
          </div>
        )}

        {field.helper && (
          <small style={{ color: '#6b7280', fontSize: '0.8rem' }}>
            {field.helper}
          </small>
        )}
      </div>
    );
  };

  return (
    <div style={formPageStyles.container}>
      <div style={formPageStyles.header}>
        <div style={formPageStyles.brandSection}>
          <h1 style={formPageStyles.headerTitle}>Memora</h1>
          <p style={formPageStyles.headerSubtitle}>Legacy Builder</p>
          <div style={formPageStyles.headerLine}></div>
        </div>
      </div>

      <div style={formPageStyles.mainContent(layout)}>
        <div style={formPageStyles.contentSection}>
          <div style={formPageStyles.titleSection}>
            <div style={formPageStyles.titleDecorative}>
              <div style={formPageStyles.titleDecorativeLine}></div>
              <Heart size={20} color="#9ca3af" />
              <div style={formPageStyles.titleDecorativeLine}></div>
            </div>
            
            <h2 style={formPageStyles.formTitle}>
              {title}
            </h2>
            
            {prompt && (
              <p style={formPageStyles.formPrompt}>
                {prompt}
              </p>
            )}
          </div>

          <div style={formPageStyles.formSection(layout)}>
            {formFields.map(renderField)}
          </div>
        </div>

        <div>
          <div style={formPageStyles.navigation}>
            <button
              onClick={onBack}
              style={formPageStyles.backButton}
              onMouseEnter={(e) => {
                e.target.style.color = '#374151';
                e.target.style.background = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#6b7280';
                e.target.style.background = 'none';
              }}
            >
              <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
              Back to Echo
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isFormValid()}
              style={{
                ...formPageStyles.nextButton,
                background: isFormValid() ? '#10b981' : '#d1d5db',
                color: isFormValid() ? 'white' : '#6b7280',
                cursor: isFormValid() ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (isFormValid()) {
                  e.target.style.background = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (isFormValid()) {
                  e.target.style.background = '#10b981';
                }
              }}
            >
              <span>Continue Journey</span>
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div style={formPageStyles.progressSection}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    background: i === progressStep ? '#10b981' : i < progressStep ? '#3b82f6' : '#d1d5db'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalFormPage;