// src/pages/MemoraIntroPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Users, BookOpen, Camera, FileText, Music, Clock } from 'lucide-react';

const MemoraIntroPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Calculate current section based on scroll position
      const sectionHeight = window.innerHeight;
      const section = Math.floor(window.scrollY / (sectionHeight * 0.8));
      setCurrentSection(section);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/start-memorial');
  };

  const handleAccessExisting = () => {
    navigate('/access-memorial');
  };

  const handleViewChecklist = () => {
    navigate('/funeral-checklist');
  };

  // Scroll-based opacity and transform calculations
  const getElementStyle = (sectionIndex, elementOffset = 0) => {
    const sectionStart = sectionIndex * window.innerHeight * 0.8;
    const elementStart = sectionStart + elementOffset;
    const progress = Math.max(0, Math.min(1, (scrollY - elementStart + window.innerHeight) / window.innerHeight));
    
    return {
      opacity: progress,
      transform: `translateY(${(1 - progress) * 50}px)`,
      transition: 'all 0.1s ease-out'
    };
  };

  return (
    <div style={{
      minHeight: '600vh', // Make it scrollable
      position: 'relative'
    }}>
      {/* Fixed Background Effects */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      {/* Floating particles */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        overflow: 'hidden', 
        pointerEvents: 'none',
        zIndex: 2
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: 'rgba(255,255,255,0.4)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Fixed Navigation Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '2rem',
        background: currentSection > 0 ? 'rgba(175, 163, 191, 0.9)' : 'transparent',
        backdropFilter: currentSection > 0 ? 'blur(20px)' : 'none',
        transition: 'all 0.3s ease'
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
              fontSize: '2rem',
              fontWeight: '300',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.95)',
              margin: '0 0 0.25rem 0',
              fontFamily: 'Georgia, serif'
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

      {/* Section 1: Hero */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem',
        textAlign: 'center',
        backgroundImage: 'url("images/africa.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Add darker overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 5
        }}></div>
        
        <div style={{
          ...getElementStyle(0, 0),
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              width: '4rem',
              height: '1px',
              background: 'rgba(255,255,255,0.4)'
            }}></div>
            <Heart size={48} color="rgba(255,255,255,0.8)" />
            <div style={{
              width: '4rem',
              height: '1px',
              background: 'rgba(255,255,255,0.4)'
            }}></div>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '300',
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 2rem 0',
            lineHeight: '1.1',
            fontFamily: 'Georgia, serif'
          }}>
            Welcome to Memora
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '300',
            maxWidth: '60rem',
            margin: '0 auto'
          }}>
            Turn grief into celebration with a meaningful, personalized journey of remembrance
          </p>
        </div>
      </section>

      {/* Section 2: What We Do + CTA */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2D1B69 0%, #1A1A2E 50%, #16213E 100%)'
      }}>
        <div style={{
          ...getElementStyle(1, 0),
          maxWidth: '70rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '300',
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 2rem 0',
            lineHeight: '1.2',
            fontFamily: 'Georgia, serif'
          }}>
            We Guide You Through
            <br />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Every Step</span>
          </h2>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: '300',
            maxWidth: '50rem',
            margin: '0 auto 4rem auto'
          }}>
            Creating a beautiful funeral or celebration of life program shouldn't add stress during an already difficult time. We'll walk you through simple forms to build a professional PDF program.
          </p>

          {/* Early CTA Buttons */}
          <div style={{
            ...getElementStyle(1, 200),
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '2rem',
                padding: '1.5rem 3rem',
                color: 'rgba(255,255,255,0.95)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'Georgia, serif'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            >
              <span>Create a Memorial</span>
              <ArrowRight size={24} />
            </button>

            <button
              onClick={handleAccessExisting}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '2rem',
                padding: '1.5rem 3rem',
                color: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontFamily: 'Georgia, serif'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Access Existing Memorial
            </button>
          </div>

          <div style={{
            ...getElementStyle(1, 300),
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.2)',
            maxWidth: '40rem',
            margin: '0 auto'
          }}>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 1rem 0'
            }}>
              Need immediate help with funeral planning?
            </p>
            <button
              onClick={handleViewChecklist}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '1rem',
                padding: '1rem 2rem',
                color: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <Clock size={18} />
              <span>Someone Has Passed - Now What?</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F1419 100%)'
      }}>
        <div style={{
          ...getElementStyle(2, 0),
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '300',
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 2rem 0',
            fontFamily: 'Georgia, serif'
          }}>
            Everything You Need
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          maxWidth: '80rem',
          width: '100%'
        }}>
          {[
            {
              icon: <FileText size={48} />,
              title: 'Beautiful Obituary',
              description: 'Tell their story with dignity and love through our guided obituary builder'
            },
            {
              icon: <Camera size={48} />,
              title: 'Photo Gallery',
              description: 'Curate meaningful photos that celebrate their life and cherished memories'
            },
            {
              icon: <Users size={48} />,
              title: 'Speaker Assignments',
              description: 'Organize who will speak and when, with notes for each part of the service'
            },
            {
              icon: <Music size={48} />,
              title: 'Service Details',
              description: 'Plan every aspect from music to readings to repass location'
            },
            {
              icon: <BookOpen size={48} />,
              title: 'Professional PDF',
              description: 'Get a beautifully formatted program ready to print for your service'
            },
            {
              icon: <Heart size={48} />,
              title: 'Cultural Sensitivity',
              description: 'Respectful guidance that honors traditions and personal preferences'
            }
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                ...getElementStyle(2, index * 100),
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                padding: '3rem',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                textAlign: 'center'
              }}
            >
              <div style={{
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                color: 'rgba(255,255,255,0.95)',
                marginBottom: '1rem',
                fontWeight: '500',
                fontFamily: 'Georgia, serif'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: The Process */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0F1419 0%, #1A0E2E 50%, #2D1B69 100%)'
      }}>
        <div style={{
          ...getElementStyle(3, 0),
          maxWidth: '70rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '300',
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 3rem 0',
            lineHeight: '1.2',
            fontFamily: 'Georgia, serif'
          }}>
            Simple.
            <br />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Guided.</span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Beautiful.</span>
          </h2>
          
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: '300',
            maxWidth: '50rem',
            margin: '0 auto'
          }}>
            Fill out simple forms at your own pace. We'll handle the design and formatting, giving you a professional memorial program that honors their memory with dignity.
          </p>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '0 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2D1B69 0%, #AFA3BF 50%, #CDC1D9 100%)'
      }}>
        <div style={{
          ...getElementStyle(4, 0),
          maxWidth: '60rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '300',
            letterSpacing: '0.02em',
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 3rem 0',
            lineHeight: '1.2',
            fontFamily: 'Georgia, serif'
          }}>
            Start Today
          </h2>
          
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            lineHeight: '1.7',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: '300',
            margin: '0 0 4rem 0'
          }}>
            Honor their memory with a beautiful memorial program. Begin your journey or continue where you left off.
          </p>

          <div style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                background: 'rgba(255,255,255,0.25)',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '2rem',
                padding: '1.5rem 3rem',
                color: 'rgba(255,255,255,0.95)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'Georgia, serif'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.35)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            >
              <span>Create Memorial</span>
              <ArrowRight size={24} />
            </button>

            <button
              onClick={handleAccessExisting}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '2rem',
                padding: '1.5rem 3rem',
                color: 'rgba(255,255,255,0.9)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                fontFamily: 'Georgia, serif'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            >
              Access Existing
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.8;
          }
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          margin: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default MemoraIntroPage;