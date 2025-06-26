import React, { useState, useEffect } from 'react';
import { ChevronRight, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const MemoraPassageTemplate = () => {
  const [currentStep, setCurrentStep] = useState('echo'); // 'echo' or 'instruction'
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Sample data - replace with actual content for each passage
  const passageData = {
    echo: {
      title: "Acknowledgements",
      culturalContext: "The acknowledgement section expresses the family's heartfelt thanks to everyone who offered support, love, and kindness during their time of loss.",
      historicalNote: "In many African traditions, community support during times of grief is considered sacred. The Yoruba concept of 'Àwọn ará' emphasizes how the community becomes family during moments of celebration and mourning.",
      backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    instruction: {
      title: "Acknowledgements",
      prompt: "Express gratitude for prayers, flowers, meals, visits, and other gestures of comfort, as well as a special thanks to those who participated in the service.",
      placeholder: "Example: gratitude for prayers, flowers, meals, visits, and other gestures of comfort, as well as a special thanks to those who participated in the service..."
    }
  };

  useEffect(() => {
    // Auto-play audio when Echo page loads
    if (currentStep === 'echo') {
      setAudioPlaying(true);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 'echo') {
      setCurrentStep('instruction');
      setAudioPlaying(false);
    } else {
      // Handle moving to next passage
      console.log('Moving to next passage with input:', userInput);
    }
  };

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying);
  };

  const toggleMute = () => {
    setAudioMuted(!audioMuted);
  };

  const EchoPage = () => (
    <div 
      className="min-h-screen flex flex-col justify-between p-6 text-white relative overflow-hidden"
      style={{ background: passageData.echo.backgroundImage }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-2xl font-serif italic text-white/90">Memora</h1>
          <p className="text-sm text-white/70 mt-1">Program Builder</p>
        </div>
        
        {/* Audio controls */}
        <div className="flex gap-3">
          <button
            onClick={toggleAudio}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {audioPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={toggleMute}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {audioMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 -mt-16">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-light tracking-wide">
            {passageData.echo.title}
          </h2>
          
          <div className="space-y-4 max-w-md mx-auto">
            <p className="text-lg leading-relaxed text-white/90">
              {passageData.echo.culturalContext}
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm italic text-white/80 leading-relaxed">
                {passageData.echo.historicalNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="relative z-10 flex justify-center">
        <button
          onClick={handleNext}
          className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full font-medium hover:bg-white/30 transition-colors flex items-center gap-2"
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const InstructionPage = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="text-center">
          <h1 className="text-2xl font-serif italic text-gray-800">Memora</h1>
          <p className="text-sm text-gray-600 mt-1">Program Builder</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 flex flex-col justify-between max-w-lg mx-auto w-full">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {passageData.instruction.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {passageData.instruction.prompt}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={passageData.instruction.placeholder}
              className="w-full h-48 p-4 border-2 border-blue-200 rounded-lg resize-none focus:border-blue-400 focus:outline-none text-gray-700 leading-relaxed"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            />
            
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {userInput.length} characters
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => setCurrentStep('echo')}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            ← Back
          </button>
          
          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {currentStep === 'echo' ? <EchoPage /> : <InstructionPage />}
    </div>
  );
};

export default MemoraPassageTemplate;