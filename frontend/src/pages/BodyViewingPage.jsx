// src/pages/BodyViewingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getPreviousPage, getProgress } from '../utils/navigation';

const BodyViewingPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const currentPath = '/body-viewing';
  const progress = getProgress(currentPath);

  // Echo page data for Body Viewing
  const echoData = {
    title: "Body Viewing",
    culturalContext: "The decision to have a viewing provides family and friends an opportunity for personal farewell and closure, honoring both personal wishes and cultural traditions.",
    historicalNote: "In many African traditions, the community gathers to honor the deceased through various rituals of farewell. The Akan people believe in 'Adwo' - the peaceful departure ceremony where the community comes together to ensure the spirit transitions peacefully to join the ancestors.",
    gradientColors: MEMORA_GRADIENTS.SERVICE, // Light green to gray gradient
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    progressStep: progress.current - 1
  };

  // Body viewing form fields
  const formFields = [
    {
      type: 'select',
      name: 'hasViewing',
      label: 'Will there be a body viewing?',
      options: [
        { value: '', label: 'Please select...' },
        { value: 'yes', label: 'Yes - Include body viewing' },
        { value: 'no', label: 'No - No body viewing' }
      ],
      required: true,
      fullWidth: true,
      helper: 'Choose whether to include a viewing period for family and friends.'
    },
    {
      type: 'text',
      name: 'viewingDate',
      label: 'Viewing Date (if applicable)',
      placeholder: 'MM/DD/YYYY',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'viewingStartTime',
      label: 'Start Time',
      placeholder: 'e.g., 2:00 PM',
      required: false
    },
    {
      type: 'text',
      name: 'viewingEndTime',
      label: 'End Time',
      placeholder: 'e.g., 6:00 PM',
      required: false
    },
    {
      type: 'text',
      name: 'viewingLocation',
      label: 'Viewing Location',
      placeholder: 'Funeral home, church, or other location...',
      required: false,
      fullWidth: true
    },
    {
      type: 'textarea',
      name: 'viewingNotes',
      label: 'Special Instructions for Viewing',
      placeholder: 'Any special requests, family-only hours, or cultural considerations...',
      required: false,
      fullWidth: true,
      rows: 3,
      helper: 'Include any specific guidance for the viewing period.'
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
    console.log('Body viewing data:', data);
    
    // Navigate to next page in sequence
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
        backgroundImage={echoData.backgroundImage}
        progressStep={echoData.progressStep}
        onContinue={handleEchoContinue}
      />
    );
  }

  if (currentStep === 'form') {
    return (
      <UniversalFormPage
        title="Body Viewing Arrangements"
        prompt="Decide whether to include a viewing period and provide the necessary details for family and friends to pay their respects."
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

export default BodyViewingPage;