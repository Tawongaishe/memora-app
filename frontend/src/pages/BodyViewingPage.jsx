import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const BodyViewingPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/body-viewing';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Load existing body viewing data if available
    const loadExistingData = async () => {
      try {
        const existingData = await memoraApi.getFormData('body-viewing');
        if (existingData.bodyViewing) {
          const frontendData = {
            hasViewing: existingData.bodyViewing.hasViewing ? 'yes' : 'no',
            viewingDate: existingData.bodyViewing.viewingDate ? 
              new Date(existingData.bodyViewing.viewingDate).toLocaleDateString('en-US') : '',
            viewingStartTime: existingData.bodyViewing.viewingStartTime || '',
            viewingEndTime: existingData.bodyViewing.viewingEndTime || '',
            viewingLocation: existingData.bodyViewing.viewingLocation || '',
            viewingNotes: existingData.bodyViewing.viewingNotes || ''
          };
          setFormData(frontendData);
        }
      } catch (err) {
        console.log('No existing body viewing data found');
      }
    };

    loadExistingData();
  }, []);

  // Echo page data for Body Viewing
  const echoData = {
    title: "Final Viewing Arrangements",
    culturalContext: "The decision to have a viewing provides family and friends an opportunity for personal farewell and closure, honoring both personal wishes and cultural traditions.",
    historicalNote: "In many African traditions, the community gathers to honor the deceased through various rituals of farewell. The Akan people believe in 'Adwo' - the peaceful departure ceremony where the community comes together to ensure the spirit transitions peacefully to join the ancestors.",
    gradientColors: MEMORA_GRADIENTS.SERVICE,
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    progressStep: progress.current - 1
  };

  // Body viewing form fields - focused only on viewing arrangements
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
      label: 'Viewing Date',
      placeholder: 'MM/DD/YYYY',
      required: false,
      helper: 'Enter the date when viewing will be held (if applicable).'
    },
    {
      type: 'text',
      name: 'viewingStartTime',
      label: 'Start Time',
      placeholder: 'e.g., 2:00 PM',
      required: false,
      helper: 'What time will the viewing begin?'
    },
    {
      type: 'text',
      name: 'viewingEndTime',
      label: 'End Time',
      placeholder: 'e.g., 6:00 PM',
      required: false,
      helper: 'What time will the viewing end?'
    },
    {
      type: 'text',
      name: 'viewingLocation',
      label: 'Viewing Location',
      placeholder: 'Funeral home, church, or other location...',
      required: false,
      fullWidth: true,
      helper: 'Where will the viewing take place?'
    },

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
      
      // Save body viewing data to backend
      const response = await memoraApi.saveFormData('body-viewing', data);
      
      setFormData(data);
      console.log('Body viewing saved successfully:', response);
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to save body viewing: ${err.message}`);
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
        title="Body Viewing Arrangements"
        prompt="Decide whether to include a viewing period and provide the necessary details for family and friends to pay their respects."
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

export default BodyViewingPage;