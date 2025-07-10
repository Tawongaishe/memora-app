// src/pages/MemoraIntroPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Users, BookOpen, Camera } from 'lucide-react';
import { echoPageStyles, MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';

const MemoraIntroPage = () => {
  const navigate = useNavigate();

  const gradientColors = MEMORA_GRADIENTS.OBITUARY; // Purple to Brown gradient - darker tones

  useEffect(() => {
    // Add CSS animation to the document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulseEffect {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup function to remove the style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/obituary'); // Redirect to obituary page to start planning
  };

  const handleViewChecklist = () => {
    navigate('/funeral-checklist');
  };

  return (
    <div style={echoPageStyles.container(gradientColors, "images/memorial-candles.jpg")}>
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
              animation: `pulseEffect ${2 + Math.random() * 3}s infinite`,
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
      </div>

      <div style={echoPageStyles.mainContent}>
        <div style={echoPageStyles.titleSection}>
          <div style={echoPageStyles.decorativeLine}>
            <div style={echoPageStyles.shortLine}></div>
            <Heart size={32} color="rgba(255,255,255,0.8)" />
            <div style={echoPageStyles.shortLine}></div>
          </div>
          
          <h2 style={{ ...echoPageStyles.mainTitle, fontSize: '4rem', marginBottom: '2rem' }}>
            Welcome to Memora
          </h2>
          
          <p style={{ ...echoPageStyles.culturalText, fontSize: '1.5rem', maxWidth: '50rem', marginBottom: '3rem' }}>
            A compassionate digital companion for creating meaningful memorials that honor your loved one's legacy with dignity, cultural sensitivity, and personal touch.
          </p>
          
          <div style={echoPageStyles.titleUnderline}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '20rem',
            textAlign: 'center'
          }}>
            <Users size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.95)', marginBottom: '1rem' }}>
              Honor Their Story
            </h3>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Celebrate their life with culturally rich storytelling that preserves their legacy for future generations.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '20rem',
            textAlign: 'center'
          }}>
            <BookOpen size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.95)', marginBottom: '1rem' }}>
              Guided Planning
            </h3>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Step-by-step guidance through every aspect of memorial planning with cultural context and wisdom.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            maxWidth: '20rem',
            textAlign: 'center'
          }}>
            <Camera size={48} color="rgba(255,255,255,0.9)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.95)', marginBottom: '1rem' }}>
              Beautiful Memories
            </h3>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              Create lasting tributes with photos, stories, and memories that capture their essence.
            </p>
          </div>
        </div>
      </div>

      <div style={echoPageStyles.bottomSection}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleGetStarted}
            style={{
              ...echoPageStyles.continueButton,
              fontSize: '1.25rem',
              padding: '1.25rem 3rem'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <span>Begin Memorial Planning</span>
            <ArrowRight size={24} />
          </button>

          <button
            onClick={handleViewChecklist}
            style={{
              ...echoPageStyles.continueButton,
              background: 'rgba(255,255,255,0.1)',
              border: '2px solid rgba(255,255,255,0.4)',
              fontSize: '1.25rem',
              padding: '1.25rem 3rem'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <span>Someone Has Passed - Now What?</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default MemoraIntroPage;