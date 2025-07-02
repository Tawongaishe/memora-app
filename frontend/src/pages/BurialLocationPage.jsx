// src/pages/BurialLocationPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalEchoPage from '../components/common/UniversalEchoPage';
import UniversalFormPage from '../components/common/UniversalFormPage';
import { MEMORA_GRADIENTS } from '../components/styles/MemoraStyles';
import { getNextPage, getProgress } from '../utils/navigation';

const BurialLocationPage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const currentPath = '/burial-location';
  const progress = getProgress(currentPath);

  // Echo page data for Burial Location
  const echoData = {
    title: "Burial Location",
    culturalContext: "The final resting place holds deep significance, providing a sacred space where family and friends can visit, remember, and feel connected to their loved one for generations to come.",
    historicalNote: "In many African traditions, the burial site is considered sacred ground where the ancestors continue to watch over and guide the living. The Yoruba concept of 'Ile Orun' speaks to the spiritual connection between the earthly resting place and the realm of the ancestors.",
    gradientColors: MEMORA_GRADIENTS.REVIEW, // Light gradient for solemn reflection
    progressStep: progress.current - 1
  };

  // Burial location form fields
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
      required: true,
      fullWidth: true,
      helper: 'Choose the type of final arrangements.'
    },
    {
      type: 'text',
      name: 'cemeteryName',
      label: 'Cemetery/Facility Name',
      placeholder: 'Name of cemetery, crematorium, or memorial park...',
      required: false,
      fullWidth: true
    },
    {
      type: 'text',
      name: 'burialAddress',
      label: 'Full Address',
      placeholder: '123 Cemetery Drive, City, State 12345',
      required: false,
      fullWidth: true,
      helper: 'Enter the complete address for Google Maps integration.'
    },
    {
      type: 'text',
      name: 'burialGoogleMapsLink',
      label: 'Google Maps Link (Optional)',
      placeholder: 'Paste Google Maps link here...',
      required: false,
      fullWidth: true,
      helper: 'You can paste a Google Maps link for easy navigation to the site.'
    },
    {
      type: 'text',
      name: 'plotSection',
      label: 'Plot/Section Information',
      placeholder: 'Section A, Plot 123, or Mausoleum Level 2...',
      required: false,
      fullWidth: true,
      helper: 'Specific location within the cemetery for family reference.'
    },
    {
      type: 'text',
      name: 'burialDate',
      label: 'Burial/Service Date',
      placeholder: 'MM/DD/YYYY',
      required: false
    },
    {
      type: 'text',
      name: 'burialTime',
      label: 'Time',
      placeholder: 'e.g., 11:00 AM',
      required: false
    },
    {
      type: 'text',
      name: 'cemeteryContact',
      label: 'Cemetery Contact Person',
      placeholder: 'Name and phone number...',
      required: false,
      fullWidth: true
    },
    {
      type: 'select',
      name: 'graveMarker',
      label: 'Grave Marker/Memorial Type',
      options: [
        { value: '', label: 'Select type...' },
        { value: 'headstone', label: 'Traditional Headstone' },
        { value: 'flat_marker', label: 'Flat Ground Marker' },
        { value: 'monument', label: 'Monument' },
        { value: 'mausoleum_plaque', label: 'Mausoleum Plaque' },
        { value: 'cremation_niche', label: 'Cremation Niche' },
        { value: 'memorial_bench', label: 'Memorial Bench' },
        { value: 'tree_memorial', label: 'Tree Memorial (Green Burial)' }
      ],
      required: false,
      fullWidth: true
    },
    {
      type: 'textarea',
      name: 'burialNotes',
      label: 'Special Instructions & Information',
      placeholder: 'Parking information, family plot details, memorial preferences, or other important details...',
      required: false,
      fullWidth: true,
      rows: 3,
      helper: 'Include any important details for family and attendees.'
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
    console.log('Burial location data:', data);
    
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
        progressStep={echoData.progressStep}
        onContinue={handleEchoContinue}
      />
    );
  }

  if (currentStep === 'form') {
    return (
      <UniversalFormPage
        title="Burial Location Selection"
        prompt="Provide details about the final resting place and burial arrangements, ensuring family and friends have all the information they need to pay their respects."
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

export default BurialLocationPage;