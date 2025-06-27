// src/components/common/UniversalFormPage.jsx
import React, { useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';

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

  const getLayoutClass = () => {
    switch (layout) {
      case 'single-column':
        return { gridTemplateColumns: '1fr' };
      case 'two-column':
        return { gridTemplateColumns: 'repeat(2, 1fr)' };
      case 'grid':
      default:
        return { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' };
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      padding: '1.5rem',
      textAlign: 'center'
    },
    headerTitle: {
      fontSize: '2rem',
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      color: '#1f2937',
      margin: '0 0 0.25rem 0'
    },
    headerSubtitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
      letterSpacing: '0.05em',
      margin: 0
    },
    headerLine: {
      width: '4rem',
      height: '2px',
      background: 'linear-gradient(to right, #9ca3af, transparent)',
      margin: '0.5rem auto 0'
    },
    mainContent: {
      flex: 1,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      maxWidth: layout === 'single-column' ? '48rem' : '72rem',
      margin: '0 auto',
      width: '100%'
    },
    contentSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    titleSection: {
      textAlign: 'center',
      marginBottom: '1rem'
    },
    titleDecorative: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    },
    titleDecorativeLine: {
      width: '2rem',
      height: '1px',
      background: '#9ca3af'
    },
    formTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 0.75rem 0'
    },
    formPrompt: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.6',
      maxWidth: '48rem',
      margin: '0 auto'
    },
    formSection: {
      display: 'grid',
      ...getLayoutClass(),
      gap: '1.5rem',
      padding: '2rem',
      background: 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(4px)',
      borderRadius: '1rem',
      border: '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
    },
    formField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    formLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      letterSpacing: '0.025em'
    },
    formInput: {
      padding: '0.75rem 1rem',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      color: '#374151',
      background: 'white',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    formTextarea: {
      padding: '0.75rem 1rem',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      color: '#374151',
      background: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      resize: 'vertical',
      minHeight: '6rem'
    },
    formSelect: {
      padding: '0.75rem 1rem',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      color: '#374151',
      background: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    fullWidth: {
      gridColumn: '1 / -1'
    },
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '2rem'
    },
    backButton: {
      color: '#6b7280',
      background: 'none',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      transition: 'all 0.3s ease'
    },
    nextButton: {
      padding: '1rem 2rem',
      borderRadius: '2rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    progressSection: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1.5rem'
    },
    progressDots: {
      display: 'flex',
      gap: '0.5rem'
    },
    progressDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      transition: 'all 0.3s ease'
    }
  };

  const renderField = (field) => {
    const fieldStyle = {
      ...styles.formField,
      ...(field.fullWidth ? styles.fullWidth : {})
    };

    return (
      <div key={field.name} style={fieldStyle}>
        <label style={styles.formLabel}>
          {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
        
        {field.type === 'text' && (
          <input
            type="text"
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFormChange(field.name, e.target.value)}
            style={{
              ...styles.formInput,
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
              ...styles.formInput,
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
              ...styles.formInput,
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
              ...styles.formTextarea,
              borderColor: formData[field.name] ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)',
              minHeight: field.rows ? `${field.rows * 1.5}rem` : '6rem'
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
              ...styles.formSelect,
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

        {field.helper && (
          <small style={{ color: '#6b7280', fontSize: '0.8rem' }}>
            {field.helper}
          </small>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Memora</h1>
        <p style={styles.headerSubtitle}>Legacy Builder</p>
        <div style={styles.headerLine}></div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.contentSection}>
          <div style={styles.titleSection}>
            <div style={styles.titleDecorative}>
              <div style={styles.titleDecorativeLine}></div>
              <Heart size={20} color="#9ca3af" />
              <div style={styles.titleDecorativeLine}></div>
            </div>
            
            <h2 style={styles.formTitle}>
              {title}
            </h2>
            
            {prompt && (
              <p style={styles.formPrompt}>
                {prompt}
              </p>
            )}
          </div>

          <div style={styles.formSection}>
            {formFields.map(renderField)}
          </div>
        </div>

        <div>
          <div style={styles.navigation}>
            <button
              onClick={onBack}
              style={styles.backButton}
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
                ...styles.nextButton,
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
          
          <div style={styles.progressSection}>
            <div style={styles.progressDots}>
              {[...Array(totalSteps)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.progressDot,
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