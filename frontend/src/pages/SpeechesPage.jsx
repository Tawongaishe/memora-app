// src/pages/SpeechesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';

const SpeechesPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const currentPath = '/speeches';
  const progress = getProgress(currentPath);

  // Echo page data for Ceremony Speeches
  const echoData = {
    title: "Ceremony Speeches",
    culturalContext: "Words spoken at a memorial ceremony carry the power to heal, honor, and celebrate a life well-lived. Each voice adds a unique perspective to the tapestry of remembrance.",
    historicalNote: "In West African traditions, the 'praise singer' or 'griot' serves as the community's voice during important ceremonies. They weave together stories, prayers, and reflections that honor the deceased while providing comfort to the bereaved. This tradition of communal speaking continues in modern memorial services.",
    gradientColors: MEMORA_GRADIENTS.EULOGY, // Brown to Purple gradient
    backgroundImage: "images/choir.jpg",
    progressStep: progress.current - 1
  };

  // Speech ceremony form fields - each speaker in own row
  const formFields = [
    // INTRODUCTION ROW
    {
      type: 'text',
      name: 'introductionSpeaker',
      label: '1. INTRODUCTION - Speaker Name',
      placeholder: 'Name of person giving opening remarks...',
      required: true,
      helper: 'Opens the ceremony and welcomes guests.',
      fullWidth: true
    },
    {
      type: 'text',
      name: 'introductionRelation',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Son, Pastor, Family Friend...',
      required: false,
      fullWidth: true
    },
    
    // PRAYER ROW
    {
      type: 'text',
      name: 'prayerSpeaker',
      label: '2. PRAYER - Speaker Name',
      placeholder: 'Name of person leading the prayer...',
      required: true,
      helper: 'Offers opening or closing prayer.',
      fullWidth: true
    },
    {
      type: 'text',
      name: 'prayerRelation',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Pastor, Elder, Family Member...',
      required: false,
      fullWidth: true
    },
    
    // REFLECTIONS/EULOGY ROW
    {
      type: 'text',
      name: 'eulogySpeaker',
      label: '3. REFLECTIONS/EULOGY - Main Speaker Name',
      placeholder: 'Name of main eulogy speaker...',
      required: true,
      helper: 'Shares the primary tribute and life story.',
      fullWidth: true
    },
    {
      type: 'text',
      name: 'eulogyRelation',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Daughter, Best Friend, Colleague...',
      required: false,
      fullWidth: true
    },
    {
      type: 'textarea',
      name: 'eulogyNotes',
      label: 'Key Points to Include',
      placeholder: 'Important memories, achievements, or stories to mention...',
      required: false,
      rows: 3,
      fullWidth: true
    },
    
    // ADDITIONAL REFLECTION SPEAKERS
    {
      type: 'text',
      name: 'additionalSpeaker1',
      label: 'Additional Reflection Speaker 1 (Optional)',
      placeholder: 'Name of additional speaker...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'additionalRelation1',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Son, Sister, Close Friend...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'additionalSpeaker2',
      label: 'Additional Reflection Speaker 2 (Optional)',
      placeholder: 'Name of additional speaker...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'additionalRelation2',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Grandchild, Colleague, Neighbor...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'additionalSpeaker3',
      label: 'Additional Reflection Speaker 3 (Optional)',
      placeholder: 'Name of additional speaker...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'additionalRelation3',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Friend, Coworker, Community Member...',
      required: false,
      fullWidth: true
    },
    
    // CLOSING REMARKS ROW
    {
      type: 'text',
      name: 'closingSpeaker',
      label: '4. CLOSING REMARKS - Speaker Name',
      placeholder: 'Name of person giving closing remarks...',
      required: true,
      helper: 'Provides final words and ceremony closure.',
      fullWidth: true
    },
    {
      type: 'text',
      name: 'closingRelation',
      label: 'Relationship to Deceased',
      placeholder: 'e.g., Son, Pastor, Family Representative...',
      required: false,
      fullWidth: true
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
    console.log('Ceremony speeches data:', data);
    
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
        title="Ceremony Speeches"
        prompt="Assign speakers for each part of the memorial ceremony. Each speech serves a specific purpose in honoring your loved one."
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

export default SpeechesPage;