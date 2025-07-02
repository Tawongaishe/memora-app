// src/pages/ModularObituaryPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';


const ModularObituaryPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const currentPath = '/obituary';
  const progress = getProgress(currentPath);

  // Echo page data
  const echoData = {
    title: "Obituary",
    culturalContext: "  ",
    historicalNote: "In West African oral traditions, the 'praise singer' or 'griot' would recount the life stories of the departed, ensuring their deeds and character lived on in community memory. This tradition of honoring through storytelling continues in modern obituaries.",
    gradientColors: MEMORA_GRADIENTS.OBITUARY, // Purple to Brown gradient
    progressStep: progress.current - 1
  };

  // Form page data
  const formFields = [
    {
      type: 'text',
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter the full name of your loved one...',
      required: true
    },
    {
      type: 'text',
      name: 'birthDate',
      label: 'Date of Birth',
      placeholder: 'MM/DD/YYYY',
      required: true
    },
    {
      type: 'text',
      name: 'deathDate',
      label: 'Date of Passing',
      placeholder: 'MM/DD/YYYY',
      required: true
    },
    {
      type: 'text',
      name: 'birthPlace',
      label: 'Place of Birth',
      placeholder: 'City, State',
      required: false
    },
    {
      type: 'textarea',
      name: 'lifeStory',
      label: 'Life Story & Achievements',
      placeholder: 'Share the beautiful story of their life, career, passions, and achievements...',
      required: true,
        fullWidth: true,
      rows: 6
    },
    {
      type: 'textarea',
      name: 'survivedBy',
      label: 'Survived By',
      placeholder: 'List family members, spouse, children, grandchildren, siblings...',
      required: true,
      fullWidth: true,
      rows: 4
    },
    {
      type: 'textarea',
      name: 'precededBy',
      label: 'Preceded in Death By',
      placeholder: 'List family members who passed before them...',
      required: false,
      rows: 3
    },
    {
      type: 'select',
      name: 'tone',
      label: 'Obituary Tone',
      options: [
        { value: '', label: 'Select a tone...' },
        { value: 'traditional', label: 'Traditional & Formal' },
        { value: 'celebratory', label: 'Celebratory & Uplifting' },
        { value: 'personal', label: 'Personal & Intimate' },
        { value: 'spiritual', label: 'Spiritual & Faith-Centered' }
      ],
      required: true
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
    console.log('Obituary form data:', data);
    
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
        progressStep={echoData.progressStep}
        onContinue={handleEchoContinue}
      />
    );
  }

  if (currentStep === 'form') {
    return (
      <UniversalFormPage
        title="Obituary Information"
        prompt="Please provide the following information to create a meaningful obituary that honors your loved one's life and legacy."
        formFields={formFields}
        onBack={handleFormBack}
        onNext={handleFormNext}
        progressStep={progress.current}
        layout="grid"
        initialData={formData}
      />
    );
  }

  return null;
};

export default ModularObituaryPage;