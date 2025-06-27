// src/pages/SimpleAcknowledgmentsPage.jsx
import React, { useState } from 'react';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';

const SimpleAcknowledgmentsPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});

  // Echo page data for Acknowledgments
  const echoData = {
    title: "Acknowledgements",
    culturalContext: "The acknowledgement section expresses the family's heartfelt thanks to everyone who offered support, love, and kindness during their time of loss.",
    historicalNote: "In many African traditions, community support during times of grief is considered sacred. The Yoruba concept of 'Àwọn ará' emphasizes how the community becomes family during moments of celebration and mourning.",
    gradientColors: ['#4a154b', '#350d36', '#1a0a1b'], // Purple gradient
    progressStep: 4
  };

  // Simple form with just one text area - perfect for acknowledgments
  const formFields = [
    {
      type: 'textarea',
      name: 'acknowledgmentText',
      label: 'Acknowledgment Message',
      placeholder: 'We are deeply grateful for all the prayers, flowers, meals, and visits during this difficult time. Your love and support have been a source of strength for our family. We extend special thanks to...',
      required: true,
      fullWidth: true,
      rows: 8,
      helper: 'Express gratitude for prayers, flowers, meals, visits, and other gestures of comfort.'
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
    console.log('Acknowledgments data:', data);
    alert('Acknowledgments completed! Check console for data.');
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
        title="Acknowledgements"
        prompt="Express your family's gratitude to everyone who provided support during this difficult time."
        formFields={formFields}
        onBack={handleFormBack}
        onNext={handleFormNext}
        progressStep={5}
        layout="single-column" // Single column layout for simple forms
        initialData={formData}
      />
    );
  }

  return null;
};

export default SimpleAcknowledgmentsPage;