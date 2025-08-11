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
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>
      
      {/* Header */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        padding: '2.5rem',
        paddingBottom: '0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '3px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.3))'
          }}></div>
          <div>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: '300',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.95)',
              margin: '0 0 0.25rem 0'
            }}>Memora</h1>
            <p style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: '300',
              letterSpacing: '0.05em',
              margin: 0
            }}>Legacy Builder</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem 2.5rem',
        textAlign: 'center'
      }}>
        {/* Title Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{
              width: '3rem',
              height: '1px',
              background: 'rgba(255,255,255,0.4)'
            }}></div>
            <Search size={40} color="rgba(255,255,255,0.8)" />
            <div style={{
              width: '3rem',
              height: '1px',
              background: 'rgba(255,255,255,0.4)'
            }}></div>
          </div>
          
          <h2 style={{
            fontSize: '3.5rem',
            fontWeight: '300',
            letterSpacing: '0.03em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 2rem 0',
            lineHeight: '1.2'
          }}>
            Access Your Memorial
          </h2>
          
          <p style={{
            fontSize: '1.375rem',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '300',
            marginBottom: '2rem',
            maxWidth: '50rem',
            margin: '0 auto'
          }}>
            Enter your Memorial ID to continue working on your memorial program.
          </p>
        </div>

        {/* Access Form */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(25px)',
          borderRadius: '2rem',
          padding: '4rem',
          border: '2px solid rgba(255,255,255,0.25)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          maxWidth: '700px',
          margin: '0 auto 4rem auto'
        }}>
          <h3 style={{
            fontSize: '2rem',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '2.5rem',
            fontWeight: '400',
            letterSpacing: '0.02em'
          }}>
            Enter Memorial ID
          </h3>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <input
              type="text"
              placeholder="Enter your Memorial ID here..."
              value={memorialId}
              onChange={handleMemorialIdChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.5rem 2rem',
                border: error ? '3px solid rgba(239, 68, 68, 0.6)' : '3px solid rgba(255,255,255,0.25)',
                borderRadius: '1rem',
                fontSize: '1.125rem',
                fontFamily: 'monospace',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease',
                letterSpacing: '2px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
            />
            
            {error && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'rgba(255,200,200,0.95)'
              }}>
                <AlertCircle size={24} />
                <span style={{ fontSize: '1.125rem' }}>{error}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleAccessMemorial}
            disabled={loading || !memorialId.trim()}
            style={{
              width: '100%',
              background: (loading || !memorialId.trim()) ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
              border: `3px solid ${(loading || !memorialId.trim()) ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)'}`,
              borderRadius: '1rem',
              padding: '1.5rem 2.5rem',
              color: 'rgba(255,255,255,0.95)',
              cursor: (loading || !memorialId.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              fontSize: '1.25rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading && memorialId.trim()) {
                e.target.style.background = 'rgba(255,255,255,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && memorialId.trim()) {
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Accessing Memorial...</span>
              </>
            ) : (
              <>
                <span>Access Memorial</span>
                <ArrowRight size={24} />
              </>
            )}
          </button>
        </div>

        {/* Help Section */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.12)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '3rem',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          maxWidth: '700px',
          margin: '0 auto 4rem auto'
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            lineHeight: '1.7'
          }}>
            <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Need help?</strong> Your Memorial ID is a long string of letters and numbers that was shown to you when you first created your memorial. Check your saved notes, messages, or browser history.
          </p>
        </div>

        {/* Create New Memorial */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '3rem',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <h4 style={{
            fontSize: '1.75rem',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '1.5rem',
            fontWeight: '400'
          }}>
            Don't Have a Memorial ID?
          </h4>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.7',
            margin: '0 0 2rem 0'
          }}>
            If you don't have a Memorial ID yet, you can create a new memorial to get started.
          </p>
          <button
            onClick={() => navigate('/start-memorial')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '1rem',
              padding: '1.25rem 2.5rem',
              color: 'rgba(255,255,255,0.9)',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
          >
            Create New Memorial
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        padding: '2.5rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleBackHome}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '2rem',
            padding: '1.25rem 2.5rem',
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            fontSize: '1.125rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
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