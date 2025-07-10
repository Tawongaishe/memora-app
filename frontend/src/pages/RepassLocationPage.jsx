// src/pages/RepassLocationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';

const RepassLocationPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const currentPath = '/repass-location';
  const progress = getProgress(currentPath);

  // Echo page data for Repass Location
  const echoData = {
    title: "Repass Location",
    culturalContext: "The repass gathering allows family and friends to come together after the service, sharing meals, stories, and comfort as the community continues to honor and remember your loved one.",
    historicalNote: "In West African tradition, the 'Akwasidae' gathering brings the community together to share food and stories, strengthening bonds during times of both celebration and mourning. This communal meal tradition continues in the African diaspora as the repass - a time for healing through fellowship.",
    gradientColors: MEMORA_GRADIENTS.SERVICE, // Light green to gray gradient
    backgroundImage: "images/lights.webp",
    progressStep: progress.current - 1
  };

  // Repass location form fields
  const formFields = [
    {
      type: 'select',
      name: 'hasRepass',
      label: 'Will there be a repass gathering?',
      options: [
        { value: '', label: 'Please select...' },
        { value: 'yes', label: 'Yes - Include repass gathering' },
        { value: 'no', label: 'No - No repass gathering' }
      ],
      required: true,
      fullWidth: true,
      helper: 'Choose whether to host a meal/gathering after the service.'
    },
    {
      type: 'text',
      name: 'repassVenueName',
      label: 'Venue Name',
      placeholder: 'Name of restaurant, church hall, community center...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'repassAddress',
      label: 'Full Address',
      placeholder: '123 Main Street, City, State 12345',
      required: false,
      fullWidth: true,
      helper: 'Enter the complete address for Google Maps integration.'
    },
    {
      type: 'text',
      name: 'repassGoogleMapsLink',
      label: 'Google Maps Link (Optional)',
      placeholder: 'Paste Google Maps link here...',
      required: false,
      fullWidth: true,
      helper: 'You can paste a Google Maps link for easy navigation.'
    },
    {
      type: 'text',
      name: 'repassDate',
      label: 'Repass Date',
      placeholder: 'MM/DD/YYYY',
      required: false
    },
    {
      type: 'text',
      name: 'repassTime',
      label: 'Start Time',
      placeholder: 'e.g., 1:00 PM',
      required: false
    },
    {
      type: 'select',
      name: 'repassType',
      label: 'Type of Gathering',
      options: [
        { value: '', label: 'Select type...' },
        { value: 'full_meal', label: 'Full Meal Service' },
        { value: 'light_refreshments', label: 'Light Refreshments' },
        { value: 'potluck', label: 'Potluck Style' },
        { value: 'dessert_coffee', label: 'Dessert & Coffee' }
      ],
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'expectedGuests',
      label: 'Expected Number of Guests',
      placeholder: 'Approximate number...',
      required: false
    },
    {
      type: 'text',
      name: 'contactPerson',
      label: 'Contact Person for Venue',
      placeholder: 'Name and phone number...',
      required: false,
      fullWidth: true
    },
    {
      type: 'textarea',
      name: 'repassNotes',
      label: 'Special Instructions',
      placeholder: 'Dietary considerations, parking information, or other details...',
      required: false,
      fullWidth: true,
      rows: 3,
      helper: 'Include any important details for guests attending the repass.'
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
    console.log('Repass location data:', data);
    
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
        title="Repass Location Selection"
        prompt="Choose and provide details for the gathering location where family and friends will come together after the service to share a meal and continue celebrating your loved one's life."
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

export default RepassLocationPage;