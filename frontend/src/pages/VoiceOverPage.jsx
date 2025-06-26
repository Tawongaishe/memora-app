// src/pages/VoiceOverPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Typography, Progress } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ForwardOutlined } from '@ant-design/icons';

const { Text } = Typography;

const VoiceOverPage = ({ 
  audioSrc, 
  title = "Listening...", 
  onComplete,
  onSkip,
  autoPlay = true 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    if (audio) {
      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);

      if (autoPlay) {
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioSrc, autoPlay, onComplete]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    if (onSkip) onSkip();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="voiceover-container">
      <style jsx>{`
        .voiceover-container {
          min-height: 100vh;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 20%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 20%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 30%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.6;
          }
        }

        .audio-controls {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 90%;
        }

        .pulse-ring {
          animation: pulse 2s infinite;
          border-radius: 50%;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Floating orbs for ambiance */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      {/* Audio controls */}
      <div className="audio-controls">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Text 
            style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: '300',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {title}
          </Text>

          <div className={`pulse-ring ${isPlaying ? 'pulse-ring' : ''}`}>
            <Button
              type="text"
              icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={togglePlayPause}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontSize: '36px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          </div>

          {duration > 0 && (
            <div style={{ width: '100%' }}>
              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor={{
                  '0%': 'rgba(255, 255, 255, 0.8)',
                  '100%': 'rgba(255, 255, 255, 0.4)'
                }}
                trailColor="rgba(255, 255, 255, 0.2)"
                strokeWidth={6}
                style={{ marginBottom: '16px' }}
              />
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
              </Text>
            </div>
          )}

          <Button
            type="text"
            icon={<ForwardOutlined />}
            onClick={handleSkip}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '25px',
              padding: '8px 24px',
              height: 'auto'
            }}
          >
            Skip
          </Button>
        </Space>
      </div>

      {/* Hidden audio element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
        />
      )}
    </div>
  );
};

export default VoiceOverPage;