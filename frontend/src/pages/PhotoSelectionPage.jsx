// src/pages/PhotoSelectionPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';

const PhotoSelectionPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const currentPath = '/photos';
  const progress = getProgress(currentPath);

  // Echo page data for Photo Selection
  const echoData = {
    title: "Photo Gallery",
    culturalContext: "Photographs preserve the essence of cherished moments, capturing the spirit and joy that defined your loved one's journey through life.",
    historicalNote: "In African traditions, visual storytelling through art and symbols has always been central to preserving memories. The Akan people of Ghana use 'Adinkra' symbols to represent concepts and stories, believing that visual representations hold the power to keep memories alive across generations.",
    gradientColors: MEMORA_GRADIENTS.PHOTOS, // Purple to Teal to Brown gradient
    progressStep: progress.current - 1
  };

  // Photo selection form fields
  const formFields = [
    {
      type: 'file',
      name: 'profilePhoto',
      label: 'Main Profile Photo',
      placeholder: 'Choose a favorite portrait photo...',
      required: true,
      accept: 'image/*',
      helper: 'This will be the primary photo displayed prominently in the memorial.'
    },
    {
      type: 'file',
      name: 'galleryPhotos',
      label: 'Additional Gallery Photos',
      placeholder: 'Select multiple photos to create a gallery...',
      required: false,
      accept: 'image/*',
      multiple: true,
      helper: 'Choose 3-8 photos that capture different moments and aspects of their life.'
    },
    {
      type: 'textarea',
      name: 'photoStory',
      label: 'Photo Story & Captions',
      placeholder: 'Share the stories behind these photos... When and where were they taken? What makes them special?',
      required: false,
      fullWidth: true,
      rows: 4,
      helper: 'Help visitors understand the significance of these captured moments.'
    },
    {
      type: 'select',
      name: 'galleryStyle',
      label: 'Gallery Display Style',
      options: [
        { value: '', label: 'Select a style...' },
        { value: 'classic', label: 'Classic Grid - Traditional layout' },
        { value: 'storytelling', label: 'Storytelling Flow - Chronological narrative' },
        { value: 'mosaic', label: 'Mosaic - Artistic arrangement' },
        { value: 'slideshow', label: 'Slideshow - Full-screen presentation' }
      ],
      required: true,
      helper: 'Choose how you want the photos to be displayed to visitors.'
    },
    {
      type: 'select',
      name: 'photoAccess',
      label: 'Photo Access Settings',
      options: [
        { value: '', label: 'Select access level...' },
        { value: 'public', label: 'Public - Anyone can view' },
        { value: 'family', label: 'Family Only - Password protected' },
        { value: 'private', label: 'Private - Invite only' }
      ],
      required: true,
      helper: 'Control who can view and download these precious memories.'
    }
  ];

  const handleEchoContinue = () => {
    setCurrentStep('form');
  };

  const handleFormBack = () => {
    setCurrentStep('echo');
  };

  const handleFormNext = (data) => {
    setFormData(data);
    console.log('Photo selection data:', data);
    
    const nextPage = getNextPage(currentPath);
    if (nextPage) {
      navigate(nextPage.path);
    } else {
      alert('Memorial planning completed!');
    }
  };

  if (currentStep === 'echo') {
    return (
      <UniversalEchoPage
        title={echoData.title}
        culturalContext={echoData.culturalContext}
        historicalNote={echoData.historicalNote}
        gradientColors={echoData.gradientColors}
        progressStep={echoData.progressStep}
        onContinue={handleEchoContinue}
      />
    );
  }

  if (currentStep === 'form') {
    return (
      <UniversalFormPage
        title="Photo Gallery Selection"
        prompt="Create a beautiful visual tribute by selecting meaningful photos that celebrate your loved one's life and the joy they brought to others."
        formFields={formFields}
        onBack={handleFormBack}
        onNext={handleFormNext}
        progressStep={progress.current}
        layout="single-column"
        initialData={formData}
      />
    );
  }

  return null;
};

export default PhotoSelectionPage;