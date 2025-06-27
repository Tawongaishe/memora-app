# Frontend
## Memora Universal Components Documentation

## Overview

The Memora Legacy Builder uses a modular component system designed with cultural sensitivity and elegant user experience in mind. The system consists of two primary universal components that can be combined to create any passage in the memorial program creation journey.

## Architecture

```
📁 src/
├── 📁 components/
│   └── 📁 common/
│       ├── UniversalEchoPage.jsx    # Cultural introduction pages
│       └── UniversalFormPage.jsx    # Data collection forms
└── 📁 pages/
    ├── ModularObituaryPage.jsx      # Example: Complex form usage
    └── SimpleAcknowledgmentsPage.jsx # Example: Simple form usage
```

---

## UniversalEchoPage Component

### Purpose
The Echo page serves as a culturally-rich introduction to each section of the memorial program. It provides context, historical significance, and prepares users emotionally for the task ahead.

### Key Features
- **Cultural Context**: Sets the emotional and cultural tone
- **Historical Notes**: Educational insights about traditions
- **Immersive Design**: Gradient backgrounds with floating animations
- **Audio Controls**: Play/pause/mute functionality
- **Progress Tracking**: Visual journey indicators

### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | Yes | - | The section name (e.g., "Obituary", "Acknowledgements") |
| `culturalContext` | string | No | - | Main descriptive text explaining the section's purpose |
| `historicalNote` | string | No | - | Cultural or historical insight related to the section |
| `onContinue` | function | Yes | - | Callback function when "Continue Journey" is clicked |
| `gradientColors` | array | No | `['#4a154b', '#350d36', '#1a0a1b']` | Array of 3 hex colors for background gradient |
| `progressStep` | number | No | 0 | Current step in the journey (0-based index) |
| `totalSteps` | number | No | 8 | Total number of steps in the journey |
| `autoPlayAudio` | boolean | No | true | Whether to auto-start audio on page load |

### Example Usage

```jsx
import UniversalEchoPage from '../components/common/UniversalEchoPage';

const MyEchoPage = () => {
  return (
    <UniversalEchoPage
      title="Musical Selection"
      culturalContext="Music has always been central to Black funeral traditions, from spirituals to jazz, offering comfort and celebration of life."
      historicalNote="In New Orleans second line traditions, the music transitions from somber dirges to joyful celebrations, reflecting the journey from mourning to celebrating a life well-lived."
      gradientColors={['#1e3a8a', '#1e40af', '#1d4ed8']}
      progressStep={2}
      onContinue={() => console.log('Moving to form')}
    />
  );
};
```

### Visual Customization

#### Gradient Themes by Section
```jsx
// Acknowledgments - Purple theme
gradientColors: ['#4a154b', '#350d36', '#1a0a1b']

// Obituary - Deep blue theme  
gradientColors: ['#2d1b69', '#1a0f3a', '#0f0620']

// Musical Selection - Blue theme
gradientColors: ['#1e3a8a', '#1e40af', '#1d4ed8']

// Reflections - Teal theme
gradientColors: ['#0f766e', '#0d9488', '#14b8a6']
```

---

## UniversalFormPage Component

### Purpose
The Form page handles data collection for each section. It's highly configurable and supports multiple field types, layouts, and validation patterns.

### Key Features
- **Multiple Field Types**: Text, email, tel, textarea, select
- **Flexible Layouts**: Grid, single-column, two-column
- **Smart Validation**: Required field checking with visual feedback
- **Responsive Design**: Adapts to different screen sizes
- **Progress Tracking**: Consistent with Echo page indicators

### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | string | Yes | - | Form title displayed at the top |
| `prompt` | string | No | - | Instructional text explaining the form's purpose |
| `formFields` | array | Yes | - | Array of field configuration objects |
| `onBack` | function | Yes | - | Callback when "Back to Echo" is clicked |
| `onNext` | function | Yes | - | Callback when form is submitted (receives form data) |
| `progressStep` | number | No | 1 | Current step in the journey |
| `totalSteps` | number | No | 8 | Total number of steps |
| `initialData` | object | No | `{}` | Pre-populate form with existing data |
| `layout` | string | No | 'grid' | Layout type: 'grid', 'single-column', 'two-column' |

### Field Configuration

Each field in the `formFields` array supports these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | Yes | Field type: 'text', 'email', 'tel', 'textarea', 'select' |
| `name` | string | Yes | Unique identifier for the field |
| `label` | string | Yes | Display label for the field |
| `placeholder` | string | No | Placeholder text |
| `required` | boolean | No | Whether field is required for form submission |
| `fullWidth` | boolean | No | Whether field should span full form width |
| `rows` | number | No | Height for textarea fields (default: 4) |
| `options` | array | No | Options for select fields `[{value, label}]` |
| `helper` | string | No | Additional help text below the field |

### Layout Options

#### Grid Layout (Default)
```jsx
layout="grid"
// Auto-responsive columns, minimum 300px width
// Perfect for forms with mixed field sizes
```

#### Single Column Layout
```jsx
layout="single-column" 
// All fields in one column
// Ideal for simple forms or long text areas
```

#### Two Column Layout
```jsx
layout="two-column"
// Fixed two-column layout
// Good for balanced forms with similar field types
```

### Example Usage

#### Simple Form (Acknowledgments)
```jsx
const simpleFormFields = [
  {
    type: 'textarea',
    name: 'acknowledgmentText',
    label: 'Acknowledgment Message',
    placeholder: 'We are deeply grateful for...',
    required: true,
    fullWidth: true,
    rows: 8,
    helper: 'Express gratitude for support received during this time.'
  }
];

<UniversalFormPage
  title="Acknowledgements"
  prompt="Express your family's gratitude to those who provided support."
  formFields={simpleFormFields}
  layout="single-column"
  onBack={() => setStep('echo')}
  onNext={(data) => console.log('Form data:', data)}
/>
```

#### Complex Form (Obituary)
```jsx
const complexFormFields = [
  {
    type: 'text',
    name: 'fullName',
    label: 'Full Name',
    placeholder: 'Enter full name...',
    required: true
  },
  {
    type: 'text',
    name: 'birthDate',
    label: 'Date of Birth',
    placeholder: 'MM/DD/YYYY',
    required: true
  },
  {
    type: 'textarea',
    name: 'lifeStory',
    label: 'Life Story',
    placeholder: 'Share their story...',
    required: true,
    fullWidth: true,
    rows: 6
  },
  {
    type: 'select',
    name: 'tone',
    label: 'Obituary Tone',
    required: true,
    options: [
      { value: '', label: 'Select tone...' },
      { value: 'traditional', label: 'Traditional & Formal' },
      { value: 'celebratory', label: 'Celebratory & Uplifting' }
    ]
  }
];

<UniversalFormPage
  title="Obituary Information"
  prompt="Provide information to create a meaningful obituary."
  formFields={complexFormFields}
  layout="grid"
  onBack={() => setStep('echo')}
  onNext={(data) => processObituaryData(data)}
/>
```

---

## Building Complete Passages

### Pattern: Echo → Form → Process

Every passage follows this consistent pattern:

```jsx
const PassagePage = () => {
  const [currentStep, setCurrentStep] = useState('echo');
  const [formData, setFormData] = useState({});

  // 1. Define echo content
  const echoData = {
    title: "Section Name",
    culturalContext: "Why this section matters...",
    historicalNote: "Cultural traditions and context...",
    gradientColors: ['#color1', '#color2', '#color3'],
    progressStep: 2
  };

  // 2. Define form fields
  const formFields = [ /* field configurations */ ];

  // 3. Handle navigation
  const handleEchoContinue = () => setCurrentStep('form');
  const handleFormBack = () => setCurrentStep('echo');
  const handleFormNext = (data) => {
    setFormData(data);
    // Process or move to next passage
  };

  // 4. Render current step
  if (currentStep === 'echo') {
    return <UniversalEchoPage {...echoData} onContinue={handleEchoContinue} />;
  }

  if (currentStep === 'form') {
    return (
      <UniversalFormPage
        title="Form Title"
        formFields={formFields}
        onBack={handleFormBack}
        onNext={handleFormNext}
        initialData={formData}
      />
    );
  }
};
```

---

## Design Guidelines

### Cultural Sensitivity
- **Respectful Language**: Use dignified, comforting language
- **Historical Context**: Include relevant cultural traditions
- **Visual Design**: Maintain elegant, sacred aesthetic
- **Color Psychology**: Choose colors that evoke appropriate emotions

### Accessibility
- **Contrast Ratios**: All text meets WCAG guidelines
- **Focus States**: Clear visual indicators for keyboard navigation
- **Screen Readers**: Semantic HTML and proper labeling
- **Font Sizes**: Readable typography for all ages

### User Experience
- **Progressive Disclosure**: Show information when needed
- **Clear Navigation**: Obvious back/forward options
- **Validation Feedback**: Immediate, helpful error messages
- **Progress Indicators**: Keep users oriented in their journey

---

## Extending the System

### Adding New Field Types

To add a new field type, extend the `renderField` function in `UniversalFormPage`:

```jsx
// Add to renderField function
{field.type === 'date' && (
  <input
    type="date"
    value={formData[field.name] || ''}
    onChange={(e) => handleFormChange(field.name, e.target.value)}
    style={styles.formInput}
  />
)}
```

### Creating New Layouts

Add new layout options by extending the `getLayoutClass` function:

```jsx
const getLayoutClass = () => {
  switch (layout) {
    case 'three-column':
      return { gridTemplateColumns: 'repeat(3, 1fr)' };
    // ... existing cases
  }
};
```

### Custom Validation

Extend the `isFormValid` function for complex validation:

```jsx
const isFormValid = () => {
  // Standard required field validation
  const requiredFields = formFields.filter(field => field.required);
  const hasRequiredFields = requiredFields.every(field => 
    formData[field.name] && formData[field.name].trim()
  );

  // Custom validation
  if (formData.email && !isValidEmail(formData.email)) {
    return false;
  }

  return hasRequiredFields;
};
```

---

## Best Practices

### Performance
- **Component Memoization**: Use `React.memo` for static content
- **Lazy Loading**: Import components only when needed
- **Optimized Images**: Use appropriate formats and sizes

### Maintainability
- **Consistent Naming**: Follow established patterns
- **Documentation**: Comment complex logic
- **Type Safety**: Consider adding PropTypes or TypeScript
- **Testing**: Write tests for validation logic

### Data Handling
- **Validation**: Always validate on both client and server
- **Privacy**: Handle sensitive information appropriately
- **Persistence**: Save progress to prevent data loss
- **Format Consistency**: Standardize date formats, phone numbers, etc.

---

## Troubleshooting

### Common Issues

**Form not validating properly**
- Check that all required fields have `required: true`
- Verify field names match between configuration and validation

**Styling inconsistencies**
- Ensure all custom styles follow the existing pattern
- Check for CSS specificity conflicts with external libraries

**Navigation not working**
- Verify `onBack` and `onNext` callbacks are properly defined
- Check that state management is handling step transitions

**Progress indicators incorrect**
- Ensure `progressStep` is 0-based and within `totalSteps` range
- Verify step numbering is consistent across Echo and Form pages

### Debug Mode

Add debug logging to track component behavior:

```jsx
// Add to component props for debugging
const debugMode = process.env.NODE_ENV === 'development';

if (debugMode) {
  console.log('Current step:', currentStep);
  console.log('Form data:', formData);
}
```

---

## Migration Guide

### From Legacy Components

If migrating from the original monolithic components:

1. **Extract Echo Content**: Move cultural context to Echo page props
2. **Convert Form Fields**: Transform form JSX to field configuration arrays
3. **Update Navigation**: Replace inline handlers with prop callbacks
4. **Test Thoroughly**: Verify all functionality works with new components

### Version Compatibility

- **React 16.8+**: Required for hooks usage
- **Modern Browsers**: ES6+ features used throughout
- **Mobile Support**: Responsive design works on all screen sizes

---

This modular system provides the foundation for creating beautiful, culturally-sensitive memorial program builders while maintaining code reusability and consistent user experience across all sections.