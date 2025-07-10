// src/components/common/UniversalEchoPage.jsx
import React, { useState, useEffect } from 'react';
import { ChevronRight, Volume2, VolumeX, Play, Pause, Heart } from 'lucide-react';
import { echoPageStyles } from '../styles/MemoraStyles';

const UniversalEchoPage = ({ 
  title, 
  culturalContext, 
  historicalNote, 
  onContinue, 
  gradientColors = ['#4a154b', '#350d36', '#1a0a1b'],
  progressStep = 0,
  totalSteps = 8,
  autoPlayAudio = true,
  // add background image 
  backgroundImage = null,
  imageSize = 'cover',
  imagePosition = 'center'
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

  return (
    <div style={echoPageStyles.container(gradientColors, backgroundImage, imageSize, imagePosition)}>
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

      <div style={echoPageStyles.overlay}></div>
      
      <div style={echoPageStyles.header}>
        <div style={echoPageStyles.brandSection}>
          <h1 style={echoPageStyles.brandTitle}>Memora</h1>
          <p style={echoPageStyles.brandSubtitle}>Legacy Builder</p>
          <div style={echoPageStyles.brandLine}></div>
        </div>
        
        <div style={echoPageStyles.audioControls}>
          <button
            onClick={toggleAudio}
            style={{
              ...echoPageStyles.audioButton,
              background: audioPlaying ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = audioPlaying ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}
          >
            {audioPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button
            onClick={toggleMute}
            style={echoPageStyles.audioButton}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
          >
            {audioMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
      </div>

      <div style={echoPageStyles.mainContent}>
        <div style={echoPageStyles.titleSection}>
          <div style={echoPageStyles.decorativeLine}>
            <div style={echoPageStyles.shortLine}></div>
            <Heart size={24} color="rgba(255,255,255,0.6)" />
            <div style={echoPageStyles.shortLine}></div>
          </div>
          
          <h2 style={echoPageStyles.mainTitle}>
            {title}
          </h2>
          
          <div style={echoPageStyles.titleUnderline}></div>
        </div>
        
        <div>
          {culturalContext && (
            <p style={echoPageStyles.culturalText}>
              {culturalContext}
            </p>
          )}
          
          {historicalNote && (
            <div style={echoPageStyles.historicalCard}>
              <div style={echoPageStyles.historicalContent}>
                <div style={echoPageStyles.historicalLine}></div>
                <p style={echoPageStyles.historicalText}>
                  {historicalNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={echoPageStyles.bottomSection}>
        <div style={echoPageStyles.progressDots}>
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              style={{
                ...echoPageStyles.progressDot,
                background: i === progressStep ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
        
        <button
          onClick={onContinue}
          style={echoPageStyles.continueButton}
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