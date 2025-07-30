import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';
import memoraApi from '../services/memoraApi';

const SpeechesPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const currentPath = '/speeches';
  const progress = getProgress(currentPath);

  useEffect(() => {
    // Load existing speeches data if available
    const loadExistingData = async () => {
      try {
        setLoading(true);
        const existingData = await memoraApi.getFormData('speeches');
        if (existingData.speeches && existingData.speeches.length > 0) {
          // Convert backend speech array back to frontend form format
          const frontendData = {};
          
          existingData.speeches.forEach(speech => {
            const type = speech.speechType;
            const speakerKey = `${type}Speaker`;
            const relationKey = `${type}Relation`;
            
            if (type === 'introduction') {
              frontendData.introductionSpeaker = speech.speakerName;
              frontendData.introductionRelation = speech.relationship;
            } else if (type === 'prayer') {
              frontendData.prayerSpeaker = speech.speakerName;
              frontendData.prayerRelation = speech.relationship;
            } else if (type === 'eulogy') {
              frontendData.eulogySpeaker = speech.speakerName;
              frontendData.eulogyRelation = speech.relationship;
              frontendData.eulogyNotes = speech.notes;
            } else if (type === 'closing') {
              frontendData.closingSpeaker = speech.speakerName;
              frontendData.closingRelation = speech.relationship;
            } else if (type === 'reflection') {
              // Handle additional speakers
              let speakerIndex = 1;
              while (frontendData[`additionalSpeaker${speakerIndex}`]) {
                speakerIndex++;
              }
              if (speakerIndex <= 3) {
                frontendData[`additionalSpeaker${speakerIndex}`] = speech.speakerName;
                frontendData[`additionalRelation${speakerIndex}`] = speech.relationship;
              }
            }
          });
          
          setFormData(frontendData);
        }
      } catch (err) {
        console.log('No existing speeches data found');
      } finally {
        setLoading(false);
      }
    };

    loadExistingData();
  }, []);

  // Echo page data for Ceremony Speeches
  const echoData = {
    title: "Ceremony Speeches",
    culturalContext: "Words spoken at a memorial ceremony carry the power to heal, honor, and celebrate a life well-lived. Each voice adds a unique perspective to the tapestry of remembrance.",
    historicalNote: "In West African traditions, the 'praise singer' or 'griot' serves as the community's voice during important ceremonies. They weave together stories, prayers, and reflections that honor the deceased while providing comfort to the bereaved. This tradition of communal speaking continues in modern memorial services.",
    gradientColors: MEMORA_GRADIENTS.EULOGY,
    backgroundImage: "images/choir.jpg",
    progressStep: progress.current - 1
  };

  // Updated form fields - structured to match backend Speech model
  const formFields = [
    // INTRODUCTION SECTION
    {
      type: 'text',
      name: 'introductionSpeaker',
      label: '1. OPENING REMARKS - Speaker Name',
      placeholder: 'Name of person giving opening remarks...',
      required: true,
      helper: 'This person opens the ceremony and welcomes guests.',
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
    
    // PRAYER SECTION
    {
      type: 'text',
      name: 'prayerSpeaker',
      label: '2. OPENING PRAYER - Speaker Name',
      placeholder: 'Name of person leading the prayer...',
      required: true,
      helper: 'This person offers the opening prayer or invocation.',
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
    
    // MAIN EULOGY SECTION
    {
      type: 'text',
      name: 'eulogySpeaker',
      label: '3. MAIN EULOGY - Speaker Name',
      placeholder: 'Name of main eulogy speaker...',
      required: true,
      helper: 'This person shares the primary tribute and life story.',
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
      label: 'Key Points for Eulogy',
      placeholder: 'Important memories, achievements, or stories to include in the eulogy...',
      required: false,
      rows: 3,
      fullWidth: true,
      helper: 'Special notes or guidance for the eulogy speaker.'
    },
    
    // ADDITIONAL SPEAKERS SECTION
    {
      type: 'text',
      name: 'additionalSpeaker1',
      label: '4. ADDITIONAL REFLECTION - Speaker 1 (Optional)',
      placeholder: 'Name of additional speaker...',
      required: false,
      fullWidth: true,
      helper: 'Additional family member or friend who wants to share memories.'
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
      label: '5. ADDITIONAL REFLECTION - Speaker 2 (Optional)',
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
      label: '6. ADDITIONAL REFLECTION - Speaker 3 (Optional)',
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
    
    // CLOSING SECTION
    {
      type: 'text',
      name: 'closingSpeaker',
      label: '7. CLOSING REMARKS - Speaker Name',
      placeholder: 'Name of person giving closing remarks...',
      required: true,
      helper: 'This person provides final words and ceremony closure.',
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

  const handleFormNext = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Save speeches data to backend
      const response = await memoraApi.saveFormData('speeches', data);
      
      setFormData(data);
      console.log('Speeches saved successfully:', response);
      
      // Navigate to next page
      const nextPage = getNextPage(currentPath);
      if (nextPage) {
        navigate(nextPage.path);
      } else {
        alert('Memorial planning completed!');
      }
    } catch (err) {
      setError(`Failed to save speeches: ${err.message}`);
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
        title="Ceremony Speeches Assignment"
        prompt="Assign speakers for each part of the memorial ceremony. Each speech serves a specific purpose in honoring your loved one and providing comfort to attendees."
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

export default SpeechesPage;