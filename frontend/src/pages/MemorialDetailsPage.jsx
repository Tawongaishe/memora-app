import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const MemorialDetailsPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/memorial-details';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Load existing memorial details if available
    const loadExistingData = async () => {
      try {
        const existingData = await memoraApi.getFormData('body-viewing');
        if (existingData.bodyViewing && existingData.bodyViewing.viewingNotes) {
          // Parse the paragraph back into separate fields if needed
          const notes = existingData.bodyViewing.viewingNotes;
          const frontendData = {
            memorialDate: '',
            memorialTime: '',
            memorialLocation: '',
            additionalDetails: notes
          };
          setFormData(frontendData);
        }
      } catch (err) {
        console.log('No existing memorial details found');
      }
    };

    loadExistingData();
  }, []);

  // Echo page data for Memorial Details
  const echoData = {
    title: "Memorial Service Details",
    culturalContext: "The memorial service is the heart of honoring a life well-lived, bringing together community, family, and friends to celebrate memories and begin the healing journey together.",
    historicalNote: "In West African traditions, memorial ceremonies called 'Celebration of Life' involve the entire community sharing stories, music, and food. The Yoruba believe that a proper memorial ensures the departed's spirit joins the ancestors with honor and continues to guide the living.",
    gradientColors: MEMORA_GRADIENTS.SERVICE,
    backgroundImage: "https://images.unsplash.com/photo-1544776527-4b8b73e9a7b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    progressStep: progress.current - 1
  };

  // Memorial details form fields
  const formFields = [
    {
      type: 'text',
      name: 'memorialDate',
      label: 'Memorial Service Date',
      placeholder: 'MM/DD/YYYY',
      required: true,
      fullWidth: true,
      helper: 'When will the main memorial service be held?'
    },
    {
      type: 'text',
      name: 'memorialTime',
      label: 'Memorial Service Time',
      placeholder: 'e.g., 11:00 AM',
      required: true,
      fullWidth: true,
      helper: 'What time will the memorial service begin?'
    },
    {
      type: 'text',
      name: 'memorialLocation',
      label: 'Memorial Service Location',
      placeholder: 'Church, funeral home, community center, or other venue...',
      required: true,
      fullWidth: true,
      helper: 'Where will the memorial service take place?'
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
      
      // Combine the separate fields into a paragraph with line breaks
      const memorialParagraph = [
        `Memorial Service Date: ${data.memorialDate}`,
        `Memorial Service Time: ${data.memorialTime}`,
        `Memorial Service Location: ${data.memorialLocation}`
      ].join('\n');

      // Send as viewingNotes to the body-viewing endpoint
      const backendData = {
        hasViewing: false, // This is memorial details, not viewing
        viewingDate: '',
        viewingStartTime: '',
        viewingEndTime: '',
        viewingLocation: '',
        viewingNotes: memorialParagraph
      };
      
      const response = await memoraApi.saveFormData('body-viewing', backendData);
      
      setFormData(data);
      console.log('Memorial details saved successfully:', response);
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to save memorial details: ${err.message}`);
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
        title="Memorial Service Information"
        prompt="Provide the essential details for the memorial service that will be included in the program for all attendees."
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

export default MemorialDetailsPage;