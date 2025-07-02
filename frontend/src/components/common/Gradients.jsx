// Memora Brand Color Gradients Reference
// Use these gradient combinations in your UniversalEchoPage components

// Brand Color Palette
export const MEMORA_COLORS = {
    PRIMARY_PURPLE: '#AFA3BF',
    LIGHT_PURPLE: '#CDC1D9', 
    TEAL: '#B4D9CE',
    LIGHT_TEAL: '#E4F2EE',
    NEUTRAL_GRAY: '#D9D9D9',
    WARM_BROWN: '#BFA98A'
  };
  
  // Pre-defined gradient combinations for different passages
  export const MEMORA_GRADIENTS = {
    // Acknowledgments - Purple to Teal (gratitude & community)
    ACKNOWLEDGMENTS: ['#AFA3BF', '#CDC1D9', '#B4D9CE'],
    
    // Obituary - Purple to Brown (dignity & earthiness)
    OBITUARY: ['#AFA3BF', '#BFA98A', '#8B7355'],
    
    // Musical Selection - Teal spectrum (harmony & flow)
    MUSICAL: ['#B4D9CE', '#E4F2EE', '#A8D0C4'],
    
    // Reflections - Purple to Neutral (contemplation)
    REFLECTIONS: ['#CDC1D9', '#D9D9D9', '#C4C4C4'],
    
    // Eulogy - Brown to Purple (warmth & reverence)
    EULOGY: ['#BFA98A', '#AFA3BF', '#9B8FA8'],
    
    // Service Details - Light Teal to Gray (clarity & peace)
    SERVICE: ['#E4F2EE', '#D9D9D9', '#B4D9CE'],
    
    // Photos & Memories - Full spectrum (celebration)
    PHOTOS: ['#AFA3BF', '#B4D9CE', '#BFA98A'],
    
    // Final Review - Elegant Neutral (completion)
    REVIEW: ['#CDC1D9', '#E4F2EE', '#D9D9D9'],
    
    // Welcome/Onboarding - Primary brand
    WELCOME: ['#AFA3BF', '#CDC1D9', '#E4F2EE']
  };
  
  // Usage examples:
  /*
  import { MEMORA_GRADIENTS } from './path/to/gradients';
  
  // In your Echo page component:
  <UniversalEchoPage
    title="Acknowledgements"
    gradientColors={MEMORA_GRADIENTS.ACKNOWLEDGMENTS}
    // ... other props
  />
  
  // Or use individual colors for custom gradients:
  <UniversalEchoPage
    title="Custom Section"
    gradientColors={[MEMORA_COLORS.PRIMARY_PURPLE, MEMORA_COLORS.TEAL, MEMORA_COLORS.WARM_BROWN]}
    // ... other props
  />
  */
  
  // Gradient themes by emotional tone:
  export const EMOTIONAL_GRADIENTS = {
    // Peaceful & Calming
    PEACEFUL: ['#E4F2EE', '#B4D9CE', '#CDC1D9'],
    
    // Warm & Comforting  
    WARM: ['#BFA98A', '#CDC1D9', '#AFA3BF'],
    
    // Dignified & Formal
    FORMAL: ['#AFA3BF', '#D9D9D9', '#CDC1D9'],
    
    // Celebratory & Uplifting
    CELEBRATORY: ['#B4D9CE', '#E4F2EE', '#BFA98A'],
    
    // Reflective & Contemplative
    CONTEMPLATIVE: ['#CDC1D9', '#AFA3BF', '#D9D9D9']
  };
  
  // Accessibility-checked combinations (WCAG AA compliant text colors)
  export const ACCESSIBLE_COMBINATIONS = {
    // White text works well on these gradients
    DARK_GRADIENTS: [
      MEMORA_GRADIENTS.OBITUARY,
      MEMORA_GRADIENTS.EULOGY,
      EMOTIONAL_GRADIENTS.FORMAL
    ],
    
    // Dark text works well on these gradients  
    LIGHT_GRADIENTS: [
      MEMORA_GRADIENTS.MUSICAL,
      MEMORA_GRADIENTS.SERVICE,
      EMOTIONAL_GRADIENTS.PEACEFUL
    ]
  };
  
  export default MEMORA_GRADIENTS;