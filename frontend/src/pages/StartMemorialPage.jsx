// src/pages/StartMemorialPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { startMemorialStyles, startMemorialAnimations } from '../components/styles/StartMemorialPageStyles';
import memoraApi from '../services/memoraApi';

const StartMemorialPage = () => {
  const [memorialId, setMemorialId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Add CSS animations to the document head
    const style = document.createElement('style');
    style.textContent = startMemorialAnimations;
    document.head.appendChild(style);
    
    // Cleanup function to remove the style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

  // Loading State
  if (loading) {
    return (
      <div style={startMemorialStyles.loadingContainer}>
        <div style={startMemorialStyles.backgroundOverlay}></div>
        
        <div style={startMemorialStyles.loadingContent}>
          <div style={startMemorialStyles.loadingSpinner}></div>
          <h2 style={startMemorialStyles.loadingTitle}>
            Creating Your Memorial...
          </h2>
          <p style={startMemorialStyles.loadingText}>
            Please wait while we set up your memorial program
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={startMemorialStyles.errorContainer}>
        <div style={startMemorialStyles.backgroundOverlay}></div>

        <div style={startMemorialStyles.errorBrandHeader}>
          <h1 style={startMemorialStyles.errorBrandTitle}>Memora</h1>
          <p style={startMemorialStyles.errorBrandSubtitle}>Legacy Builder</p>
        </div>

        <div style={startMemorialStyles.errorCard}>
          <h2 style={startMemorialStyles.errorTitle}>
            Unable to Create Memorial
          </h2>
          <p style={startMemorialStyles.errorText}>
            {error}
          </p>
          <div style={startMemorialStyles.errorButtonGroup}>
            <button
              onClick={() => window.location.reload()}
              style={startMemorialStyles.tryAgainButton}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              Try Again
            </button>
            <button
              onClick={handleBackHome}
              style={{
                ...startMemorialStyles.tryAgainButton,
                background: 'rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div style={startMemorialStyles.container}>
      <div style={startMemorialStyles.backgroundOverlay}></div>
      
      {/* Header */}
      <div style={startMemorialStyles.header}>
        <div style={startMemorialStyles.headerContent}>
          <div style={startMemorialStyles.headerLine}></div>
          <div>
            <h1 style={startMemorialStyles.brandTitle}>Memora</h1>
            <p style={startMemorialStyles.brandSubtitle}>Legacy Builder</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={startMemorialStyles.mainContent}>
        {/* Title Section */}
        <div style={startMemorialStyles.titleSection}>
          <div style={startMemorialStyles.decorativeSection}>
            <div style={startMemorialStyles.decorativeLine}></div>
            <Heart size={40} color="rgba(255,255,255,0.8)" />
            <div style={startMemorialStyles.decorativeLine}></div>
          </div>
          
          <h2 style={startMemorialStyles.pageTitle}>
            Your Memorial is Ready
          </h2>
          
          <p style={startMemorialStyles.pageDescription}>
            We've created your memorial program. Save your Memorial ID below to access it anytime.
          </p>
        </div>

        {/* Memorial ID Card */}
        <div style={startMemorialStyles.memorialCard}>
          <h3 style={startMemorialStyles.memorialCardTitle}>
            Your Memorial ID
          </h3>
          
          <div style={startMemorialStyles.memorialIdContainer}>
            <div style={startMemorialStyles.memorialIdText}>
              {memorialId}
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            style={startMemorialStyles.copyButton(copied)}
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
        <div style={startMemorialStyles.importantNotice}>
          <p style={startMemorialStyles.importantNoticeText}>
            <strong style={{ color: 'rgba(255,255,255,0.95)' }}>Important:</strong> Save this ID somewhere safe! You'll need it to access your memorial from any device or browser. We recommend texting it to yourself or writing it down.
          </p>
        </div>

        {/* What's Next */}
        <div style={startMemorialStyles.whatsNextSection}>
          <h4 style={startMemorialStyles.whatsNextTitle}>
            What's Next?
          </h4>
          <p style={startMemorialStyles.whatsNextText}>
            We'll guide you through creating a beautiful obituary, selecting photos, assigning speakers, and organizing all the details for your memorial program.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={startMemorialStyles.bottomNav}>
        <button
          onClick={handleBackHome}
          style={startMemorialStyles.secondaryButton}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
        >
          ← Back to Home
        </button>

        <button
          onClick={handleContinue}
          style={startMemorialStyles.primaryButton}
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