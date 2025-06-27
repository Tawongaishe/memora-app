// src/pages/ModularObituaryPage.jsx
import React, { useState } from 'react';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';

const ModularObituaryPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});

  // Echo page data
  const echoData = {
    title: "Obituary",
    culturalContext: "An obituary is more than a notice of death—it's a celebration of a life lived, a story of love, legacy, and the indelible mark left on this world.",
    historicalNote: "In West African oral traditions, the 'praise singer' or 'griot' would recount the life stories of the departed, ensuring their deeds and character lived on in community memory. This tradition of honoring through storytelling continues in modern obituaries.",
    gradientColors: ['#2d1b69', '#1a0f3a', '#0f0620'],
    progressStep: 1
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
    // Here you would typically move to the next step or process the data
    alert('Obituary form completed! Check console for data.');
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
        progressStep={2}
        layout="grid"
        initialData={formData}
      />
    );
  }

  return null;
};

export default ModularObituaryPage;