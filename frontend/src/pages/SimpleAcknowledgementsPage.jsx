import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const SimpleAcknowledgmentsPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/acknowledgements';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Load existing acknowledgements data if available
    const loadExistingData = async () => {
      try {
        const existingData = await memoraApi.getFormData('acknowledgements');
        if (existingData.acknowledgements) {
          setFormData({
            acknowledgmentText: existingData.acknowledgements.acknowledgmentText || ''
          });
        }
      } catch (err) {
        console.log('No existing acknowledgements data found');
      }
    };

    loadExistingData();
  }, []);

  // Echo page data for Acknowledgments
  const echoData = {
    title: "Acknowledgements",
    culturalContext: "The acknowledgement section expresses the family's heartfelt thanks to everyone who offered support, love, and kindness during their time of loss.",
    historicalNote: "In many African traditions, community support during times of grief is considered sacred. The Yoruba concept of 'Àwọn ará' emphasizes how the community becomes family during moments of celebration and mourning.",
    gradientColors: MEMORA_GRADIENTS.ACKNOWLEDGMENTS,
    backgroundImage: "images/africa.jpg",
    progressStep: progress.current - 1
  };

  // Simple form with just one text area - matches backend Acknowledgements model
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

  const handleFormNext = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Save acknowledgements data to backend
      const response = await memoraApi.saveFormData('acknowledgements', data);
      
      setFormData(data);
      console.log('Acknowledgements saved successfully:', response);
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to save acknowledgements: ${err.message}`);
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
        title="Acknowledgements"
        prompt="Express your family's gratitude to everyone who provided support during this difficult time."
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

export default SimpleAcknowledgmentsPage;
