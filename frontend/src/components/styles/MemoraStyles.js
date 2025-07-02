// src/styles/memoraStyles.js

// Brand colors
export const MEMORA_COLORS = {
    PRIMARY_PURPLE: '#AFA3BF',
    LIGHT_PURPLE: '#CDC1D9', 
    TEAL: '#B4D9CE',
    LIGHT_TEAL: '#E4F2EE',
    NEUTRAL_GRAY: '#D9D9D9',
    WARM_BROWN: '#BFA98A'
  };
  
  // Gradient combinations
  export const MEMORA_GRADIENTS = {
    ACKNOWLEDGMENTS: ['#AFA3BF', '#CDC1D9', '#B4D9CE'],
    OBITUARY: ['#AFA3BF', '#BFA98A', '#8B7355'],
    MUSICAL: ['#B4D9CE', '#E4F2EE', '#A8D0C4'],
    REFLECTIONS: ['#CDC1D9', '#D9D9D9', '#C4C4C4'],
    EULOGY: ['#BFA98A', '#AFA3BF', '#9B8FA8'],
    SERVICE: ['#E4F2EE', '#D9D9D9', '#B4D9CE'],
    PHOTOS: ['#AFA3BF', '#B4D9CE', '#BFA98A'],
    REVIEW: ['#CDC1D9', '#E4F2EE', '#D9D9D9']
  };
  
  // Echo Page Styles
  export const echoPageStyles = {
    container: (gradientColors) => ({
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
    }),
    
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
  
  // Form Page Styles
  export const formPageStyles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      display: 'flex',
      flexDirection: 'column'
    },
    
    header: {
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    
    brandSection: {
      textAlign: 'left'
    },
    
    headerTitle: {
      fontSize: '2rem',
      fontFamily: 'Georgia, serif',
      fontStyle: 'italic',
      color: '#1f2937',
      margin: '0 0 0.25rem 0'
    },
    
    headerSubtitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
      letterSpacing: '0.05em',
      margin: 0
    },
    
    headerLine: {
      width: '4rem',
      height: '2px',
      background: 'linear-gradient(to right, #9ca3af, transparent)',
      marginTop: '0.5rem'
    },
    
    mainContent: (layout) => ({
      flex: 1,
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      maxWidth: layout === 'single-column' ? '48rem' : '72rem',
      margin: '0 auto',
      width: '100%'
    }),
    
    contentSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    },
    
    titleSection: {
      textAlign: 'center',
      marginBottom: '1rem'
    },
    
    titleDecorative: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '1rem'
    },
    
    titleDecorativeLine: {
      width: '2rem',
      height: '1px',
      background: '#9ca3af'
    },
    
    formTitle: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 0.75rem 0'
    },
    
    formPrompt: {
      fontSize: '1.125rem',
      color: '#374151',
      lineHeight: '1.6',
      maxWidth: '48rem',
      margin: '0 auto'
    },
    
    formSection: (layout) => {
      const layoutStyles = {
        'single-column': { gridTemplateColumns: '1fr' },
        'two-column': { gridTemplateColumns: 'repeat(2, 1fr)' },
        'grid': { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }
      };
      
      return {
        display: 'grid',
        ...layoutStyles[layout],
        gap: '1.5rem',
        padding: '2rem',
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(4px)',
        borderRadius: '1rem',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
      };
    },
    
    formField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    
    fullWidth: {
      gridColumn: '1 / -1'
    },
    
    formLabel: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      letterSpacing: '0.025em'
    },
    
    formInput: {
      padding: '0.75rem 1rem',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      color: '#374151',
      background: 'white',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    
    formTextarea: (rows) => ({
      padding: '0.75rem 1rem',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      color: '#374151',
      background: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      resize: 'vertical',
      minHeight: rows ? `${rows * 1.5}rem` : '6rem'
    }),
    
    formSelect: {
      padding: '0.75rem 1rem',
      border: '2px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontFamily: 'Georgia, serif',
      color: '#374151',
      background: 'white',
      outline: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '2rem'
    },
    
    backButton: {
      color: '#6b7280',
      background: 'none',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      transition: 'all 0.3s ease'
    },
    
    nextButton: {
      padding: '1rem 2rem',
      borderRadius: '2rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    
    progressSection: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1.5rem'
    }
  };