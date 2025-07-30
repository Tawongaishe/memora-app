// src/pages/AccessMemorialPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, AlertCircle, Search } from 'lucide-react';
import { echoPageStyles } from '../components/styles/MemoraStyles';
import memoraApi from '../services/memoraApi';

const AccessMemorialPage = () => {
  const [memorialId, setMemorialId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Use hardcoded gradient to avoid import issues
  const gradientColors = ['#AFA3BF', '#CDC1D9', '#E4F2EE'];

  const handleMemorialIdChange = (e) => {
    setMemorialId(e.target.value.trim());
    if (error) setError(null); // Clear error when user starts typing
  };

  const handleAccessMemorial = async () => {
    if (!memorialId.trim()) {
      setError('Please enter your Memorial ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Set the memorial ID in the API provider
      memoraApi.setMemorialId(memorialId);

      // Try to fetch the memorial to verify it exists
      const memorial = await memoraApi.getMemorial(memorialId);
      
      console.log('✅ Memorial found:', memorial);
      
      // Navigate to obituary page to continue working on the memorial
      navigate('/obituary');
      
    } catch (err) {
      console.error('❌ Failed to access memorial:', err);
      
      // Clear the memorial ID if it's invalid
      memoraApi.setMemorialId(null);
      
      // Show user-friendly error message
      if (err.message.includes('Memorial not found') || err.message.includes('404')) {
        setError('Memorial not found. Please check your Memorial ID and try again.');
      } else if (err.message.includes('Access denied') || err.message.includes('403')) {
        setError('Access denied. This memorial may belong to another user.');
      } else {
        setError(`Unable to access memorial: ${err.message}`);
      }
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    navigate('/');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAccessMemorial();
    }
  };

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

      <div style={{
        position: 'relative',
        zIndex: 20,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '2rem',
              height: '1px',
              background: 'rgba(255,255,255,0.5)'
            }}></div>
            <Search size={32} color="rgba(255,255,255,0.8)" />
            <div style={{
              width: '2rem',
              height: '1px',
              background: 'rgba(255,255,255,0.5)'
            }}></div>
          </div>
          
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '300',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 1rem 0',
            lineHeight: '1.2'
          }}>
            Access Your Memorial
          </h2>
          
          <p style={{
            fontSize: '1.25rem',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '300',
            marginBottom: '1.5rem',
            maxWidth: '40rem',
            margin: '0 auto 1.5rem auto'
          }}>
            Enter your Memorial ID to continue working on your memorial program.
          </p>
          
          <div style={{
            width: '6rem',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
            margin: '0 auto'
          }}></div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '3rem',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          maxWidth: '40rem',
          margin: '0 auto 3rem auto'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '1.5rem',
            fontWeight: '500'
          }}>
            Enter Memorial ID
          </h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Enter your Memorial ID here..."
              value={memorialId}
              onChange={handleMemorialIdChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: error ? '2px solid rgba(239, 68, 68, 0.6)' : '2px solid rgba(255,255,255,0.3)',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontFamily: 'monospace',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                letterSpacing: '1px',
                textAlign: 'center'
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            />
            
            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,200,200,0.9)'
              }}>
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAccessMemorial}
            disabled={loading || !memorialId.trim()}
            style={{
              width: '100%',
              background: (loading || !memorialId.trim()) ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
              border: `2px solid ${(loading || !memorialId.trim()) ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'}`,
              borderRadius: '0.75rem',
              padding: '1rem 2rem',
              color: 'rgba(255,255,255,0.95)',
              cursor: (loading || !memorialId.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1.125rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading && memorialId.trim()) {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && memorialId.trim()) {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Accessing Memorial...</span>
              </>
            ) : (
              <>
                <span>Access Memorial</span>
                <ArrowRight size={20} />
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
              <strong>Need help?</strong> Your Memorial ID is a long string of letters and numbers that was shown to you when you first created your memorial. Check your saved notes, messages, or browser history.
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
          margin: '0 auto'
        }}>
          <h4 style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '1rem'
          }}>
            Don't Have a Memorial ID?
          </h4>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6',
            margin: '0 0 1.5rem 0'
          }}>
            If you don't have a Memorial ID yet, you can create a new memorial to get started.
          </p>
          <button
            onClick={() => navigate('/start-memorial')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1.5rem',
              color: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            Create New Memorial
          </button>
        </div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        <button
          onClick={handleBackHome}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '2rem',
            padding: '1rem 2rem',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          ← Back to Home
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AccessMemorialPage;