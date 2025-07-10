// src/pages/FuneralChecklistPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock, Phone, FileText, MapPin, Users, Heart } from 'lucide-react';
import { echoPageStyles, MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';

const FuneralChecklistPage = () => {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});

  const gradientColors = MEMORA_GRADIENTS.DARK; // Brown to Purple gradient - darker, more serious tones

  const handleBack = () => {
    navigate('/');
  };

  const handleBeginPlanning = () => {
    navigate('/obituary'); // Redirect to obituary page to start planning
  };

  const toggleCheck = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const checklistSections = [
    {
      title: "Immediate First Steps (First 24 Hours)",
      icon: <Clock size={24} />,
      urgent: true,
      items: [
        { id: 'call-911', text: 'Call 911 if death was unexpected or at home', urgent: true },
        { id: 'call-doctor', text: 'Contact the deceased\'s doctor or hospice care team' },
        { id: 'notify-family', text: 'Notify immediate family members and close friends' },
        { id: 'funeral-home', text: 'Contact funeral home or mortuary for body removal' },
        { id: 'death-certificate', text: 'Obtain death certificate (funeral home can assist)' },
        { id: 'organ-donation', text: 'If applicable, contact organ donation organization' },
        { id: 'secure-home', text: 'Secure the deceased\'s home and belongings' }
      ]
    },
    {
      title: "Legal & Financial (First Week)",
      icon: <FileText size={24} />,
      items: [
        { id: 'will-location', text: 'Locate will and important documents' },
        { id: 'attorney-contact', text: 'Contact estate attorney if one exists' },
        { id: 'employer-notify', text: 'Notify employer and HR department' },
        { id: 'insurance-claims', text: 'Contact life insurance companies' },
        { id: 'bank-accounts', text: 'Contact banks and financial institutions' },
        { id: 'social-security', text: 'Notify Social Security Administration' },
        { id: 'credit-cards', text: 'Contact credit card companies' },
        { id: 'utilities', text: 'Handle utilities and ongoing bills' }
      ]
    },
    {
      title: "Service Planning",
      icon: <Users size={24} />,
      items: [
        { id: 'service-type', text: 'Decide on burial or cremation' },
        { id: 'service-location', text: 'Choose funeral home and service location' },
        { id: 'date-time', text: 'Set date and time for services' },
        { id: 'clergy-officiant', text: 'Select clergy or officiant' },
        { id: 'music-selection', text: 'Choose music and readings' },
        { id: 'speakers', text: 'Ask family/friends to speak or give eulogies' },
        { id: 'flowers', text: 'Order flowers or request donations instead' },
        { id: 'reception', text: 'Plan reception or repass gathering' }
      ]
    },
    {
      title: "Memorial & Tribute",
      icon: <Heart size={24} />,
      items: [
        { id: 'obituary', text: 'Write and submit obituary to newspapers' },
        { id: 'photo-collection', text: 'Gather photos for service and memorial' },
        { id: 'memorial-video', text: 'Create memorial slideshow or video' },
        { id: 'memory-book', text: 'Set up guest book or memory sharing' },
        { id: 'memorial-donations', text: 'Set up memorial donation fund if desired' },
        { id: 'online-memorial', text: 'Create online memorial or tribute page' },
        { id: 'keepsakes', text: 'Plan memorial keepsakes for family' }
      ]
    },
    {
      title: "Burial/Cemetery Arrangements",
      icon: <MapPin size={24} />,
      items: [
        { id: 'burial-plot', text: 'Purchase burial plot or arrange cremation' },
        { id: 'casket-urn', text: 'Select casket or urn' },
        { id: 'headstone', text: 'Design and order headstone or marker' },
        { id: 'grave-flowers', text: 'Arrange for grave site flowers' },
        { id: 'burial-permits', text: 'Obtain necessary burial permits' },
        { id: 'cemetery-services', text: 'Coordinate with cemetery for services' }
      ]
    },
    {
      title: "Communication & Logistics",
      icon: <Phone size={24} />,
      items: [
        { id: 'guest-list', text: 'Create guest list for services' },
        { id: 'invitations', text: 'Send service invitations or announcements' },
        { id: 'transportation', text: 'Arrange transportation for family' },
        { id: 'accommodations', text: 'Arrange accommodations for out-of-town guests' },
        { id: 'parking', text: 'Coordinate parking at service location' },
        { id: 'accessibility', text: 'Ensure accessibility for elderly or disabled guests' },
        { id: 'childcare', text: 'Arrange childcare if needed during services' }
      ]
    },
    {
      title: "Final Preparations",
      icon: <Check size={24} />,
      items: [
        { id: 'final-details', text: 'Confirm all arrangements with funeral home' },
        { id: 'payment', text: 'Finalize payment arrangements' },
        { id: 'programs', text: 'Review and approve service programs' },
        { id: 'flowers-final', text: 'Confirm flower deliveries' },
        { id: 'music-final', text: 'Confirm music and audio/visual needs' },
        { id: 'reception-final', text: 'Finalize reception details and catering' },
        { id: 'family-prep', text: 'Prepare family for the service day' }
      ]
    }
  ];

  const getCompletionStats = () => {
    const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0);
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    return { completed: completedItems, total: totalItems, percentage };
  };

  const stats = getCompletionStats();

  return (
    <div style={echoPageStyles.container(gradientColors, "images/peaceful-hands.jpg")}>
      <div style={echoPageStyles.overlay}></div>
      
      <div style={echoPageStyles.header}>
        <div style={echoPageStyles.brandSection}>
          <h1 style={echoPageStyles.brandTitle}>Memora</h1>
          <p style={echoPageStyles.brandSubtitle}>Legacy Builder</p>
          <div style={echoPageStyles.brandLine}></div>
        </div>
        
        <button
          onClick={handleBack}
          style={{
            ...echoPageStyles.audioButton,
            width: 'auto',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 20,
        flex: 1,
        padding: '2rem',
        maxWidth: '60rem',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ ...echoPageStyles.mainTitle, fontSize: '2.5rem', marginBottom: '1rem' }}>
            Someone Has Passed - Now What?
          </h2>
          <p style={{ ...echoPageStyles.culturalText, fontSize: '1.125rem', marginBottom: '2rem' }}>
            A comprehensive guide to help you navigate this difficult time with compassion and organization.
          </p>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                border: '4px solid rgba(255,255,255,0.3)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `conic-gradient(from 0deg, rgba(255,255,255,0.8) 0deg, rgba(255,255,255,0.8) ${stats.percentage * 3.6}deg, rgba(255,255,255,0.2) ${stats.percentage * 3.6}deg)`
                }}></div>
                <div style={{ 
                  position: 'relative', 
                  color: 'white', 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold' 
                }}>
                  {stats.percentage}%
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)', margin: '0 0 0.5rem 0' }}>
                  Progress Tracker
                </h3>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                  {stats.completed} of {stats.total} tasks completed
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {checklistSections.map((section, sectionIndex) => (
            <div key={sectionIndex} style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              padding: '2rem',
              border: section.urgent ? '2px solid rgba(255,100,100,0.5)' : '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ color: section.urgent ? 'rgba(255,150,150,0.9)' : 'rgba(255,255,255,0.8)' }}>
                  {section.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  color: section.urgent ? 'rgba(255,150,150,0.95)' : 'rgba(255,255,255,0.95)', 
                  margin: 0 
                }}>
                  {section.title}
                </h3>
                {section.urgent && (
                  <span style={{
                    background: 'rgba(255,100,100,0.3)',
                    color: 'rgba(255,255,255,0.9)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    URGENT
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {section.items.map((item, itemIndex) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: checkedItems[item.id] ? 'rgba(100,255,100,0.1)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '0.5rem',
                    border: item.urgent ? '1px solid rgba(255,100,100,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => toggleCheck(item.id)}
                  onMouseEnter={(e) => e.target.style.background = checkedItems[item.id] ? 'rgba(100,255,100,0.15)' : 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = checkedItems[item.id] ? 'rgba(100,255,100,0.1)' : 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '2px solid rgba(255,255,255,0.4)',
                      background: checkedItems[item.id] ? 'rgba(100,255,100,0.8)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {checkedItems[item.id] && <Check size={16} color="white" />}
                    </div>
                    <span style={{ 
                      fontSize: '1rem', 
                      color: item.urgent ? 'rgba(255,150,150,0.9)' : 'rgba(255,255,255,0.9)',
                      textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                      opacity: checkedItems[item.id] ? 0.7 : 1
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button
            onClick={handleBeginPlanning}
            style={{
              ...echoPageStyles.continueButton,
              fontSize: '1.25rem',
              padding: '1.25rem 3rem'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <span>Begin Memorial Planning with Memora</span>
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuneralChecklistPage;