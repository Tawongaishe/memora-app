
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const RepassLocationPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/repass-location';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Load existing repass location data if available
    const loadExistingData = async () => {
      try {
        const existingData = await memoraApi.getFormData('repass-location');
        if (existingData.repassLocation) {
          const frontendData = {
            hasRepass: existingData.repassLocation.hasRepass ? 'yes' : 'no',
            repassVenueName: existingData.repassLocation.venueName || '',
            repassAddress: existingData.repassLocation.repassAddress || '',
            repassDate: existingData.repassLocation.repassDate ? 
              new Date(existingData.repassLocation.repassDate).toLocaleDateString('en-US') : '',
            repassTime: existingData.repassLocation.repassTime || '',
            repassNotes: existingData.repassLocation.repassNotes || ''
          };
          setFormData(frontendData);
        }
      } catch (err) {
        console.log('No existing repass location data found');
      }
    };

    loadExistingData();
  }, []);

  // Echo page data for Repass Location
  const echoData = {
    title: "Repass Location",
    culturalContext: "The repass gathering allows family and friends to come together after the service, sharing meals, stories, and comfort as the community continues to honor and remember your loved one.",
    historicalNote: "In West African tradition, the 'Akwasidae' gathering brings the community together to share food and stories, strengthening bonds during times of both celebration and mourning. This communal meal tradition continues in the African diaspora as the repass - a time for healing through fellowship.",
    gradientColors: MEMORA_GRADIENTS.SERVICE,
    backgroundImage: "images/lights.webp",
    progressStep: progress.current - 1
  };

  // Updated repass location form fields to match backend RepassLocation model
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
      fullWidth: true,
      helper: 'What is the name of the venue hosting the repass?'
    },
    {
      type: 'text',
      name: 'repassAddress',
      label: 'Full Address',
      placeholder: '123 Main Street, City, State 12345',
      required: false,
      fullWidth: true,
      helper: 'Enter the complete address for directions and GPS navigation.'
    },
    {
      type: 'text',
      name: 'repassDate',
      label: 'Repass Date',
      placeholder: 'MM/DD/YYYY',
      required: false,
      helper: 'When will the repass take place?'
    },
    {
      type: 'text',
      name: 'repassTime',
      label: 'Start Time',
      placeholder: 'e.g., 1:00 PM',
      required: false,
      helper: 'What time should guests arrive for the repass?'
    },
    {
      type: 'textarea',
      name: 'repassNotes',
      label: 'Special Instructions',
      placeholder: 'Dietary considerations, parking information, RSVP details, or other important information for guests...',
      required: false,
      fullWidth: true,
      rows: 4,
      helper: 'Include any important details for guests attending the repass.'
    }
  ];

  const handleEchoContinue = () => {
    setCurrentStep('form');
  };

  const handleFormBack = () => {
    setCurrentStep('echo');
  };

  const handleFormNext = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Save repass location data to backend
      const response = await memoraApi.saveFormData('repass-location', data);
      
      setFormData(data);
      console.log('Repass location saved successfully:', response);
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to save repass location: ${err.message}`);
      setLoading(false);
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
        loading={loading}
        error={error}
      />
    );
  }

  return null;
};

export default RepassLocationPage;