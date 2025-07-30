// src/pages/ModularObitPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const ModularObituaryPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [memorialId, setMemorialId] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/obituary';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Check if we have a memorial ID, if not redirect to start page
    const checkMemorialId = () => {
      const id = memoraApi.getMemorialId();
      if (!id) {
        console.log('No memorial ID found, redirecting to start page');
        navigate('/start-memorial');
        return;
      }
      
      setMemorialId(id);
      console.log('Using memorial ID:', id);
      
      // Try to load existing obituary data
      loadExistingData(id);
    };

    const loadExistingData = async (id) => {
      try {
        const existingData = await memoraApi.getFormData('obituary');
        if (existingData.obituary) {
          // Convert backend data back to frontend format
          const frontendData = {
            fullName: existingData.obituary.fullName,
            birthDate: existingData.obituary.birthDate ? 
              new Date(existingData.obituary.birthDate).toLocaleDateString('en-US') : '',
            deathDate: existingData.obituary.deathDate ? 
              new Date(existingData.obituary.deathDate).toLocaleDateString('en-US') : '',
            birthPlace: existingData.obituary.birthPlace || '',
            lifeStory: existingData.obituary.lifeStory || '',
            survivedBy: existingData.obituary.survivedBy || '',
            precededBy: existingData.obituary.precededBy || '',
            tone: existingData.obituary.tone || ''
          };
          setFormData(frontendData);
          console.log('Loaded existing obituary data');
        }
      } catch (err) {
        console.log('No existing obituary data found');
      }
    };

    checkMemorialId();
  }, [navigate]);

  // Echo page data
  const echoData = {
    title: "Obituary",
    culturalContext: "The obituary tells the story of a life well-lived, honoring their journey, accomplishments, and the love they shared with family and community.",
    historicalNote: "In West African oral traditions, the 'praise singer' or 'griot' would recount the life stories of the departed, ensuring their deeds and character lived on in community memory. This tradition of honoring through storytelling continues in modern obituaries.",
    gradientColors: MEMORA_GRADIENTS.OBITUARY,
    backgroundImage: "images/image5song.jpg",
    progressStep: progress.current - 1
  };

  // Form fields with proper validation
  const formFields = [
    {
      type: 'text',
      name: 'fullName',
      label: 'Full Name',
      placeholder: 'Enter the full name of your loved one...',
      required: true,
      helper: 'Enter the complete legal name as it should appear in the obituary.'
    },
    {
      type: 'text',
      name: 'birthDate',
      label: 'Date of Birth',
      placeholder: 'MM/DD/YYYY',
      required: true,
      helper: 'Enter in MM/DD/YYYY format (e.g., 03/15/1950)'
    },
    {
      type: 'text',
      name: 'deathDate',
      label: 'Date of Passing',
      placeholder: 'MM/DD/YYYY',
      required: true,
      helper: 'Enter in MM/DD/YYYY format (e.g., 12/25/2024)'
    },
    {
      type: 'text',
      name: 'birthPlace',
      label: 'Place of Birth',
      placeholder: 'City, State or Country',
      required: false,
      helper: 'Where were they born? (e.g., Atlanta, Georgia or Lagos, Nigeria)'
    },
    {
      type: 'textarea',
      name: 'lifeStory',
      label: 'Life Story & Achievements',
      placeholder: 'Share the beautiful story of their life, career, passions, and achievements...',
      required: true,
      fullWidth: true,
      rows: 6,
      helper: 'Include their education, career, hobbies, achievements, and what made them special.'
    },
    {
      type: 'textarea',
      name: 'survivedBy',
      label: 'Survived By',
      placeholder: 'List family members: spouse, children, grandchildren, siblings...',
      required: true,
      fullWidth: true,
      rows: 4,
      helper: 'List immediate family members who are still living.'
    },
    {
      type: 'textarea',
      name: 'precededBy',
      label: 'Preceded in Death By',
      placeholder: 'List family members who passed before them...',
      required: false,
      rows: 3,
      helper: 'List family members who passed away before your loved one.'
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
      required: true,
      helper: 'Choose the tone that best reflects how you want to honor their memory.'
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
      
      // Save obituary data to backend
      const response = await memoraApi.saveFormData('obituary', data);
      
      setFormData(data);
      console.log('Obituary saved successfully:', response);
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to save obituary: ${err.message}`);
      setLoading(false);
    }
  };

  // Don't render anything if we don't have a memorial ID (will redirect)
  if (!memorialId) {
    return null;
  }

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
        title="Obituary Information"
        prompt="Please provide the following information to create a meaningful obituary that honors your loved one's life and legacy."
        formFields={formFields}
        onBack={handleFormBack}
        onNext={handleFormNext}
        progressStep={progress.current}
        layout="grid"
        initialData={formData}
        loading={loading}
        error={error}
      />
    );
  }

  return null;
};

export default ModularObituaryPage;