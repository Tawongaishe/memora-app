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
        color: 'white',
        fontFamily: 'Georgia, serif'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 20,
          textAlign: 'center',
          padding: '3rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '6px solid rgba(255,255,255,0.2)',
            borderTop: '6px solid rgba(255,255,255,0.8)',
            borderRadius: '50%',
            animation: 'spin 1.2s linear infinite',
            margin: '0 auto 3rem auto'
          }}></div>
          <h2 style={{ 
            fontSize: '2.5rem', 
            color: 'rgba(255,255,255,0.95)', 
            marginBottom: '1.5rem',
            fontWeight: '300',
            letterSpacing: '0.02em'
          }}>
            Creating Your Memorial...
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'rgba(255,255,255,0.8)',
            lineHeight: '1.6'
          }}>
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Georgia, serif',
        position: 'relative',
        padding: '2rem'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 20
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 0.5rem 0'
          }}>Memora</h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: '300',
            letterSpacing: '0.05em',
            margin: 0
          }}>Legacy Builder</p>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 20,
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(25px)',
            borderRadius: '2rem',
            padding: '4rem',
            border: '2px solid rgba(255,100,100,0.3)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              color: 'rgba(255,150,150,0.95)', 
              marginBottom: '2rem',
              fontWeight: '300',
              letterSpacing: '0.02em'
            }}>
              Unable to Create Memorial
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255,255,255,0.85)', 
              marginBottom: '3rem',
              lineHeight: '1.6'
            }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.4)',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                Try Again
              </button>
              <button
                onClick={handleBackHome}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.4)',
                  padding: '1.25rem 2.5rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                Back to Home
              </button>
            </div>
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
            <Heart size={40} color="rgba(255,255,255,0.8)" />
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
            Your Memorial is Ready
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
            We've created your memorial program. Save your Memorial ID below to access it anytime.
          </p>
        </div>

        {/* Memorial ID Card */}
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
            Your Memorial ID
          </h3>
          
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '1rem',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontFamily: 'monospace',
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 'bold',
              letterSpacing: '3px',
              wordBreak: 'break-all',
              lineHeight: '1.6'
            }}>
              {memorialId}
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            style={{
              background: copied ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255,255,255,0.15)',
              border: `2px solid ${copied ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255,255,255,0.4)'}`,
              borderRadius: '1rem',
              padding: '1.25rem 2.5rem',
              color: 'rgba(255,255,255,0.95)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              margin: '0 auto',
              fontSize: '1.125rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              minWidth: '250px'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.target.style.background = 'rgba(255,255,255,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }
            }}
          >
            {copied ? (
              <>
                <CheckCircle size={24} />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy size={24} />
                <span>Copy Memorial ID</span>
              </>
            )}
          </button>
        </div>

        {/* Important Notice */}
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
            <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Important:</strong> Save this ID somewhere safe! You'll need it to access your memorial from any device or browser. We recommend texting it to yourself or writing it down.
          </p>
        </div>

        {/* What's Next */}
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
            What's Next?
          </h4>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.7',
            margin: 0
          }}>
            We'll guide you through creating a beautiful obituary, selecting photos, assigning speakers, and organizing all the details for your memorial program.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        padding: '2.5rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
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

        <button
          onClick={handleContinue}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '2rem',
            padding: '1.25rem 3rem',
            color: 'rgba(255,255,255,0.95)',
            cursor: 'pointer',
            fontSize: '1.25rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        >
          <span>Begin Memorial Journey</span>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default StartMemorialPage;