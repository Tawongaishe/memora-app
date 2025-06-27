// src/components/common/UniversalEchoPage.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, Volume2, VolumeX, Play, Pause, Heart } from 'lucide-react';

const UniversalEchoPage = ({ 
  title, 
  culturalContext, 
  historicalNote, 
  onContinue, 
  gradientColors = ['#4a154b', '#350d36', '#1a0a1b'],
  progressStep = 0,
  totalSteps = 8,
  autoPlayAudio = true 
}) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  useEffect(() => {
    if (autoPlayAudio) {
      setAudioPlaying(true);
    }
  }, [autoPlayAudio]);

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  const toggleMute = () => {
    setAudioMuted(!audioMuted);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 50%, ${gradientColors[2]} 100%)`,
      color: 'white',
      fontFamily: 'Georgia, serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
      pointerEvents: 'none'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      position: 'relative',
      zIndex: 20
    },
    brandSection: {
      textAlign: 'left'
    },
    brandTitle: {
      fontSize: '2rem',
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      color: 'rgba(255,255,255,0.95)',
      margin: '0 0 0.25rem 0'
    },
    brandSubtitle: {
      fontSize: '0.875rem',
      color: 'rgba(255,255,255,0.7)',
      letterSpacing: '0.05em',
      margin: 0
    },
    brandLine: {
      width: '4rem',
      height: '2px',
      background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
      marginTop: '0.5rem'
    },
    audioControls: {
      display: 'flex',
      gap: '0.75rem'
    },
    audioButton: {
      width: '3rem',
      height: '3rem',
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(16px)',
      border: 'none',
      borderRadius: '50%',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    mainContent: {
      position: 'relative',
      zIndex: 20,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 1.5rem',
      marginTop: '-5rem',
      textAlign: 'center'
    },
    titleSection: {
      marginBottom: '2rem'
    },
    decorativeLine: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    shortLine: {
      width: '2rem',
      height: '1px',
      background: 'rgba(255,255,255,0.5)'
    },
    mainTitle: {
      fontSize: '3rem',
      fontWeight: '300',
      letterSpacing: '0.05em',
      color: 'rgba(255,255,255,0.95)',
      margin: '0 0 1rem 0',
      lineHeight: '1.2'
    },
    titleUnderline: {
      width: '6rem',
      height: '1px',
      background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
      margin: '0 auto'
    },
    culturalText: {
      fontSize: '1.25rem',
      lineHeight: '1.6',
      color: 'rgba(255,255,255,0.9)',
      fontWeight: '300',
      marginBottom: '1.5rem',
      maxWidth: '40rem',
      margin: '0 auto 1.5rem auto'
    },
    historicalCard: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      maxWidth: '40rem',
      margin: '0 auto'
    },
    historicalContent: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-start'
    },
    historicalLine: {
      width: '4px',
      height: '4rem',
      background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
      borderRadius: '2px',
      flexShrink: 0,
      marginTop: '0.25rem'
    },
    historicalText: {
      fontSize: '0.875rem',
      fontStyle: 'italic',
      color: 'rgba(255,255,255,0.85)',
      lineHeight: '1.6',
      margin: 0
    },
    bottomSection: {
      position: 'relative',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      alignItems: 'center'
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
    },
    continueButton: {
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(20px)',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.3)',
      padding: '1rem 2.5rem',
      borderRadius: '2rem',
      fontSize: '1.125rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Floating particles/stars effect */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div style={styles.overlay}></div>
      
      <div style={styles.header}>
        <div style={styles.brandSection}>
          <h1 style={styles.brandTitle}>Memora</h1>
          <p style={styles.brandSubtitle}>Legacy Builder</p>
          <div style={styles.brandLine}></div>
        </div>
        
        <div style={styles.audioControls}>
          <button
            onClick={toggleAudio}
            style={{
              ...styles.audioButton,
              background: audioPlaying ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = audioPlaying ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}
          >
            {audioPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            onClick={toggleMute}
            style={styles.audioButton}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >
            {audioMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.titleSection}>
          <div style={styles.decorativeLine}>
            <div style={styles.shortLine}></div>
            <Heart size={24} color="rgba(255,255,255,0.6)" />
            <div style={styles.shortLine}></div>
          </div>
          
          <h2 style={styles.mainTitle}>
            {title}
          </h2>
          
          <div style={styles.titleUnderline}></div>
        </div>
        
        <div>
          {culturalContext && (
            <p style={styles.culturalText}>
              {culturalContext}
            </p>
          )}
          
          {historicalNote && (
            <div style={styles.historicalCard}>
              <div style={styles.historicalContent}>
                <div style={styles.historicalLine}></div>
                <p style={styles.historicalText}>
                  {historicalNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.progressDots}>
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.progressDot,
                background: i === progressStep ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
        
        <button
          onClick={onContinue}
          style={styles.continueButton}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        >
          <span>Continue Journey</span>
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default UniversalEchoPage;