// src/pages/StartMemorialPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { echoPageStyles } from '../components/styles/MemoraStyles';
import memoraApi from '../services/memoraApi';

const StartMemorialPage = () => {
  const [memorialId, setMemorialId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Use hardcoded gradient to avoid import issues
  const gradientColors = ['#AFA3BF', '#CDC1D9', '#E4F2EE'];

  useEffect(() => {
    const createMemorial = async () => {
      try {
        setLoading(true);
        
        // Create guest session first
        await memoraApi.createGuestSession();
        
        // Create memorial
        const response = await memoraApi.createMemorial();
        setMemorialId(response.memorial.id);
        
        console.log('✅ Memorial created with ID:', response.memorial.id);
        
      } catch (err) {
        console.error('❌ Failed to create memorial:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    createMemorial();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(memorialId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = memorialId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    navigate('/obituary');
  };

  const handleBackHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #AFA3BF 0%, #CDC1D9 50%, #E4F2EE 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          ...echoPageStyles.overlay
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 20,
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid rgba(255,255,255,0.8)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem auto'
          }}></div>
          <h2 style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.95)', marginBottom: '1rem' }}>
            Creating Your Memorial...
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)' }}>
            Please wait while we set up your memorial program
          </p>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #AFA3BF 0%, #CDC1D9 50%, #E4F2EE 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div style={echoPageStyles.overlay}></div>
        
        <div style={echoPageStyles.header}>
          <div style={echoPageStyles.brandSection}>
            <h1 style={echoPageStyles.brandTitle}>Memora</h1>
            <p style={echoPageStyles.brandSubtitle}>Legacy Builder</p>
            <div style={echoPageStyles.brandLine}></div>
          </div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 20,
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '3rem',
            border: '2px solid rgba(255,100,100,0.4)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '40rem'
          }}>
            <h2 style={{ fontSize: '2rem', color: 'rgba(255,150,150,0.95)', marginBottom: '1rem' }}>
              Unable to Create Memorial
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Try Again
            </button>
            <button
              onClick={handleBackHome}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                padding: '1rem 2rem',
                borderRadius: '2rem',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #AFA3BF 0%, #CDC1D9 50%, #E4F2EE 100%)',
      color: 'white',
      fontFamily: 'Georgia, serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={echoPageStyles.overlay}></div>
      
      <div style={echoPageStyles.header}>
        <div style={echoPageStyles.brandSection}>
          <h1 style={echoPageStyles.brandTitle}>Memora</h1>
          <p style={echoPageStyles.brandSubtitle}>Legacy Builder</p>
          <div style={echoPageStyles.brandLine}></div>
        </div>
      </div>

      <div style={echoPageStyles.mainContent}>
        <div style={echoPageStyles.titleSection}>
          <div style={echoPageStyles.decorativeLine}>
            <div style={echoPageStyles.shortLine}></div>
            <Heart size={32} color="rgba(255,255,255,0.8)" />
            <div style={echoPageStyles.shortLine}></div>
          </div>
          
          <h2 style={{ ...echoPageStyles.mainTitle, fontSize: '3rem', marginBottom: '2rem' }}>
            Your Memorial is Ready
          </h2>
          
          <p style={{ ...echoPageStyles.culturalText, fontSize: '1.25rem', marginBottom: '3rem' }}>
            We've created your memorial program. Save your Memorial ID below to access it anytime.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '3rem',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          maxWidth: '40rem',
          margin: '0 auto 3rem auto',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '1.5rem',
            fontWeight: '500'
          }}>
            Your Memorial ID
          </h3>
          
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              wordBreak: 'break-all'
            }}>
              {memorialId}
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            style={{
              background: copied ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.2)',
              border: `2px solid ${copied ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255,255,255,0.4)'}`,
              borderRadius: '0.75rem',
              padding: '1rem 2rem',
              color: 'rgba(255,255,255,0.95)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              margin: '0 auto',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }
            }}
          >
            {copied ? (
              <>
                <CheckCircle size={20} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={20} />
                <span>Copy ID</span>
              </>
            )}
          </button>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              lineHeight: '1.5'
            }}>
              <strong>Important:</strong> Save this ID somewhere safe! You'll need it to access your memorial from any device or browser. We recommend texting it to yourself or writing it down.
            </p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: '40rem',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h4 style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '1rem'
          }}>
            What's Next?
          </h4>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6',
            margin: 0
          }}>
            We'll guide you through creating a beautiful obituary, selecting photos, assigning speakers, and organizing all the details for your memorial program.
          </p>
        </div>
      </div>

      <div style={echoPageStyles.bottomSection}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleBackHome}
            style={{
              ...echoPageStyles.continueButton,
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.4)',
              fontSize: '1rem',
              padding: '1rem 2rem'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            ← Back to Home
          </button>

          <button
            onClick={handleContinue}
            style={{
              ...echoPageStyles.continueButton,
              fontSize: '1.25rem',
              padding: '1.25rem 3rem'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <span>Begin Memorial Journey</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMemorialPage;