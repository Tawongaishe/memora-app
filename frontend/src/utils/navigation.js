// src/utils/navigation.js

// Define the sequence of pages in the memorial planning process
export const PAGE_SEQUENCE = [
  {
    path: '/obituary',
    title: 'Obituary',
    description: 'Life story and details'
  },
  {
    path: '/memorial-details',
    title: 'Memorial Details',
    description: 'Service information and details'
  },
  {
    path: '/body-viewing',
    title: 'Body Viewing',
    description: 'Viewing arrangements'
  },
  {
    path: '/speeches',
    title: 'Ceremony Speeches',
    description: 'Speaker assignments'
  },
  {
    path: '/acknowledgements',
    title: 'Acknowledgements',
    description: 'Thank you messages'
  },
  {
    path: '/repass-location',
    title: 'Repass Location',
    description: 'Gathering after service'
  },
  {
    path: '/photos',
    title: 'Photo Gallery',
    description: 'Photo selection'
  },
  {
    path: '/burial-location',
    title: 'Burial Location',
    description: 'Final arrangements'
  }
];

// Get the next page in the sequence
export const getNextPage = (currentPath) => {
  const currentIndex = PAGE_SEQUENCE.findIndex(page => page.path === currentPath);
  if (currentIndex !== -1 && currentIndex < PAGE_SEQUENCE.length - 1) {
    return PAGE_SEQUENCE[currentIndex + 1];
  }
  return null; // No next page (end of sequence)
};

// Get the previous page in the sequence
export const getPreviousPage = (currentPath) => {
  const currentIndex = PAGE_SEQUENCE.findIndex(page => page.path === currentPath);
  if (currentIndex > 0) {
    return PAGE_SEQUENCE[currentIndex - 1];
  }
  return null; // No previous page (start of sequence)
};

// Get current page info
export const getCurrentPageInfo = (currentPath) => {
  return PAGE_SEQUENCE.find(page => page.path === currentPath) || null;
};

// Get progress information
export const getProgress = (currentPath) => {
  const currentIndex = PAGE_SEQUENCE.findIndex(page => page.path === currentPath);
  return {
    current: currentIndex + 1,
    total: PAGE_SEQUENCE.length,
    percentage: Math.round(((currentIndex + 1) / PAGE_SEQUENCE.length) * 100)
  };
};