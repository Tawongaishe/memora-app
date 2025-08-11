// src/components/styles/StartMemorialPageStyles.js

export const startMemorialStyles = {
  // Main container styles
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #AFA3BF 0%, #CDC1D9 50%, #E4F2EE 100%)',
    color: 'white',
    fontFamily: 'Georgia, serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },

  // Background effects
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
    pointerEvents: 'none'
  },

  // Loading state styles
  loadingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #AFA3BF 0%, #CDC1D9 50%, #E4F2EE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: 'Georgia, serif'
  },

  loadingSpinner: {
    width: '80px',
    height: '80px',
    border: '6px solid rgba(255,255,255,0.2)',
    borderTop: '6px solid rgba(255,255,255,0.8)',
    borderRadius: '50%',
    animation: 'spin 1.2s linear infinite',
    margin: '0 auto 3rem auto'
  },

  loadingContent: {
    position: 'relative',
    zIndex: 20,
    textAlign: 'center',
    padding: '3rem'
  },

  loadingTitle: {
    fontSize: '2.5rem', 
    color: 'rgba(255,255,255,0.95)', 
    marginBottom: '1.5rem',
    fontWeight: '300',
    letterSpacing: '0.02em'
  },

  loadingText: {
    fontSize: '1.25rem', 
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.6'
  },

  // Error state styles
  errorContainer: {
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
  },

  errorCard: {
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(25px)',
    borderRadius: '2rem',
    padding: '4rem',
    border: '2px solid rgba(255,100,100,0.3)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
    position: 'relative',
    zIndex: 20,
    textAlign: 'center',
    maxWidth: '600px'
  },

  errorTitle: {
    fontSize: '2.5rem', 
    color: 'rgba(255,150,150,0.95)', 
    marginBottom: '2rem',
    fontWeight: '300',
    letterSpacing: '0.02em'
  },

  errorText: {
    fontSize: '1.25rem', 
    color: 'rgba(255,255,255,0.85)', 
    marginBottom: '3rem',
    lineHeight: '1.6'
  },

  errorButtonGroup: {
    display: 'flex', 
    gap: '1.5rem', 
    justifyContent: 'center', 
    flexWrap: 'wrap'
  },

  // Header styles
  header: {
    position: 'relative',
    zIndex: 20,
    padding: '2.5rem',
    paddingBottom: '0'
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  headerLine: {
    width: '3px',
    height: '40px',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.3))'
  },

  brandTitle: {
    fontSize: '2.25rem',
    fontWeight: '300',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.95)',
    margin: '0 0 0.25rem 0'
  },

  brandSubtitle: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
    letterSpacing: '0.05em',
    margin: 0
  },

  // Main content styles
  mainContent: {
    position: 'relative',
    zIndex: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4rem 2.5rem',
    textAlign: 'center'
  },

  titleSection: {
    marginBottom: '4rem'
  },

  decorativeSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2.5rem'
  },

  decorativeLine: {
    width: '3rem',
    height: '1px',
    background: 'rgba(255,255,255,0.4)'
  },

  pageTitle: {
    fontSize: '3.5rem',
    fontWeight: '300',
    letterSpacing: '0.03em',
    color: 'rgba(255,255,255,0.95)',
    margin: '0 0 2rem 0',
    lineHeight: '1.2'
  },

  pageDescription: {
    fontSize: '1.375rem',
    lineHeight: '1.7',
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '300',
    marginBottom: '2rem',
    maxWidth: '50rem',
    margin: '0 auto'
  },

  // Memorial ID card styles
  memorialCard: {
    background: 'rgba(255,255,255,0.12)',
    backdropFilter: 'blur(25px)',
    borderRadius: '2rem',
    padding: '4rem',
    border: '2px solid rgba(255,255,255,0.25)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
    maxWidth: '700px',
    margin: '0 auto 4rem auto'
  },

  memorialCardTitle: {
    fontSize: '2rem',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: '2.5rem',
    fontWeight: '400',
    letterSpacing: '0.02em'
  },

  memorialIdContainer: {
    background: 'rgba(0,0,0,0.25)',
    borderRadius: '1rem',
    padding: '2.5rem',
    marginBottom: '2.5rem',
    border: '1px solid rgba(255,255,255,0.15)'
  },

  memorialIdText: {
    fontSize: '1.5rem',
    fontFamily: 'monospace',
    color: 'rgba(255,255,255,0.95)',
    fontWeight: 'bold',
    letterSpacing: '3px',
    wordBreak: 'break-all',
    lineHeight: '1.6'
  },

  // Button styles
  copyButton: (copied) => ({
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
  }),

  primaryButton: {
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
  },

  secondaryButton: {
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
  },

  tryAgainButton: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.4)',
    padding: '1.25rem 2.5rem',
    borderRadius: '2rem',
    cursor: 'pointer',
    fontSize: '1.125rem',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },

  // Info sections
  importantNotice: {
    background: 'rgba(59, 130, 246, 0.12)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    padding: '3rem',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    maxWidth: '700px',
    margin: '0 auto 4rem auto'
  },

  importantNoticeText: {
    fontSize: '1.125rem',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    lineHeight: '1.7'
  },

  whatsNextSection: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(20px)',
    borderRadius: '1.5rem',
    padding: '3rem',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    maxWidth: '700px',
    margin: '0 auto'
  },

  whatsNextTitle: {
    fontSize: '1.75rem',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: '1.5rem',
    fontWeight: '400'
  },

  whatsNextText: {
    fontSize: '1.125rem',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.7',
    margin: 0
  },

  // Bottom navigation
  bottomNav: {
    position: 'relative',
    zIndex: 20,
    padding: '2.5rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap'
  },

  // Brand header (for error page)
  errorBrandHeader: {
    position: 'absolute',
    top: '2rem',
    left: '2rem',
    zIndex: 20
  },

  errorBrandTitle: {
    fontSize: '2rem',
    fontWeight: '300',
    letterSpacing: '0.1em',
    color: 'rgba(255,255,255,0.95)',
    margin: '0 0 0.5rem 0'
  },

  errorBrandSubtitle: {
    fontSize: '0.875rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
    letterSpacing: '0.05em',
    margin: 0
  }
};

// CSS animations
export const startMemorialAnimations = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;