// src/App.jsx
import { Typography, Card } from 'antd';
import VoiceOverPage from './pages/VoiceOverPage';
import MemoraPassageTemplate from './components/common/MemoraPassageTemplate';

const { Title, Paragraph } = Typography;

function App() {
  const handleComplete = () => {
    console.log('Audio completed!');
    // Auto-scroll to the passage section
    document.getElementById('passage-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleSkip = () => {
    console.log('Audio skipped!');
    // Auto-scroll to the passage section
    document.getElementById('passage-section').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', scrollBehavior: 'smooth' }}>
      {/* VoiceOver Section - Full Viewport Height */}
      <section style={{ height: '100vh', position: 'relative' }}>
        <VoiceOverPage
          title="Welcome to Your Sacred Journey"
          onComplete={handleComplete}
          onSkip={handleSkip}
          autoPlay={false} // Set to true when you have audio
        />
        
        {/* Scroll indicator */}
        <div 
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('passage-section').scrollIntoView({ behavior: 'smooth' })}
        >
          <div style={{ 
            animation: 'bounce 2s infinite',
            fontSize: '24px',
            marginBottom: '8px'
          }}>
            ↓
          </div>
          <div style={{ fontSize: '14px', fontWeight: '300' }}>
            Scroll to continue
          </div>
        </div>

        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </section>

      {/* Passage Section - Memora Template */}
      <section 
        id="passage-section"
        style={{ 
          minHeight: '100vh'
        }}
      >
        <MemoraPassageTemplate />
      </section>
    </div>
  );
}

export default App;