import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const BurialLocationPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/burial-location';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Load existing burial location data if available
    const loadExistingData = async () => {
      try {
        const existingData = await memoraApi.getFormData('burial-location');
        if (existingData.burialLocation) {
          const frontendData = {
            burialType: existingData.burialLocation.burialType || '',
            cemeteryName: existingData.burialLocation.cemeteryName || '',
            burialAddress: existingData.burialLocation.burialAddress || '',
            burialDate: existingData.burialLocation.burialDate ? 
              new Date(existingData.burialLocation.burialDate).toLocaleDateString('en-US') : '',
            burialTime: existingData.burialLocation.burialTime || '',
            burialNotes: existingData.burialLocation.burialNotes || ''
          };
          setFormData(frontendData);
        }
      } catch (err) {
        console.log('No existing burial location data found');
      }
    };

    loadExistingData();
  }, []);

  // Echo page data for Burial Location
  const echoData = {
    title: "Burial Location",
    culturalContext: "The final resting place holds deep significance, providing a sacred space where family and friends can visit, remember, and feel connected to their loved one for generations to come.",
    historicalNote: "In many African traditions, the burial site is considered sacred ground where the ancestors continue to watch over and guide the living. The Yoruba concept of 'Ile Orun' speaks to the spiritual connection between the earthly resting place and the realm of the ancestors.",
    gradientColors: MEMORA_GRADIENTS.REVIEW,
    backgroundImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
    progressStep: progress.current - 1
  };

  // Updated burial location form fields to match backend BurialLocation model
  const formFields = [
    {
      type: 'select',
      name: 'burialType',
      label: 'Type of Final Arrangements',
      options: [
        { value: '', label: 'Please select...' },
        { value: 'burial', label: 'Traditional Burial' },
        { value: 'cremation', label: 'Cremation' },
        { value: 'mausoleum', label: 'Mausoleum Entombment' },
        { value: 'green_burial', label: 'Green/Natural Burial' }
      ],
      required: false,
      fullWidth: true,
      helper: 'Choose the type of final arrangements.'
    },
    {
      type: 'text',
      name: 'cemeteryName',
      label: 'Cemetery/Facility Name',
      placeholder: 'Name of cemetery, crematorium, or memorial park...',
      required: false,
      fullWidth: true,
      helper: 'What is the name of the final resting place?'
    },
    {
      type: 'text',
      name: 'burialAddress',
      label: 'Full Address',
      placeholder: '123 Cemetery Drive, City, State 12345',
      required: false,
      fullWidth: true,
      helper: 'Enter the complete address for directions and GPS navigation.'
    },
    {
      type: 'text',
      name: 'burialDate',
      label: 'Burial/Service Date',
      placeholder: 'MM/DD/YYYY',
      required: false,
      helper: 'When will the burial or final service take place?'
    },
    {
      type: 'text',
      name: 'burialTime',
      label: 'Time',
      placeholder: 'e.g., 11:00 AM',
      required: false,
      helper: 'What time is the burial or committal service?'
    },
    {
      type: 'textarea',
      name: 'burialNotes',
      label: 'Special Instructions & Information',
      placeholder: 'Parking information, family plot details, memorial preferences, directions, or other important details for attendees...',
      required: false,
      fullWidth: true,
      rows: 4,
      helper: 'Include any important details for family and attendees.'
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
      
      // Save burial location data to backend
      const response = await memoraApi.saveFormData('burial-location', data);
      
      setFormData(data);
      console.log('Burial location saved successfully:', response);
      
      // Navigate to next page or show completion
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        // This is the final step - show completion message
        alert('Memorial planning completed! Your memorial program is ready.');
        // Could navigate to a review/summary page here
        navigate('/review');
      }
    } catch (err) {
      setError(`Failed to save burial location: ${err.message}`);
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
        title="Final Arrangements"
        prompt="Provide details about the final resting place and burial arrangements, ensuring family and friends have all the information they need to pay their respects."
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

export default BurialLocationPage;