// World Configuration for Blackwood Manor
// Update this file to customize the mystery world, locations, and story elements

export const worldConfig = {
  // Basic World Information
  setting: {
    name: 'Blackwood Manor',
    location: 'A wealthy estate outside Boston, Massachusetts',
    timePeriod: '1947 - Post-World War II America',
    atmosphere: 'Gothic mansion with dark secrets in the post-war era',
    description: 'An imposing Victorian mansion that has been in the Blackwood family for generations. The house holds many secrets within its walls. The year is 1947, just two years after World War II ended, and America is entering a new era of prosperity and change.',
    historicalContext: {
      year: 1947,
      recentEvents: [
        'World War II ended in 1945',
        'Post-war economic boom beginning',
        'Cold War tensions with Soviet Union starting',
        'Veterans returning home and rebuilding lives',
        'Traditional social structures and gender roles'
      ],
      technology: [
        'No computers or internet',
        'Rotary telephones for communication',
        'Telegrams for urgent messages',
        'Radio as primary entertainment',
        'Classic 1940s automobiles',
        'Gas lamps and electric lighting'
      ],
      society: [
        'Formal social etiquette and manners',
        'Traditional gender roles',
        'Upper class maintains strict social hierarchies',
        'Servants and household staff common in wealthy homes',
        'Formal dress codes - suits, dresses, hats, gloves'
      ],
      language: [
        'Formal speech patterns',
        'Period-appropriate slang: "swell", "keen", "gee whiz"',
        'Respectful forms of address: "Sir", "Madam", "Miss"',
        'No modern slang or internet terminology'
      ]
    }
  },

  // Key Locations
  locations: {
    'study': {
      name: 'James Blackwood\'s Study',
      description: 'A dark wood-paneled room filled with books and family portraits',
      significance: 'Where James conducts family business',
      clues: ['Financial documents', 'Family photos', 'Whiskey bottle']
    },
    'office': {
      name: 'Business Office',
      description: 'Marcus Reynolds\' modern office space in the mansion',
      significance: 'Where business deals are made',
      clues: ['Contract documents', 'Computer files', 'Meeting notes']
    },
    'library': {
      name: 'Family Library',
      description: 'Dr. Elena Rodriguez\'s favorite reading spot',
      significance: 'Where medical records might be kept',
      clues: ['Medical journals', 'Prescription bottles', 'Family health records']
    },
    'art_studio': {
      name: 'Art Studio',
      description: 'Lily Chen\'s creative sanctuary',
      significance: 'Where Lily expresses her emotions through art',
      clues: ['Paintings', 'Art supplies', 'Personal diary']
    },
    'kitchen': {
      name: 'Kitchen',
      description: 'Mr. Thompson\'s domain',
      significance: 'Where household staff gather and gossip',
      clues: ['Household schedule', 'Staff notes', 'Food preparation records']
    }
  },

  // Timeline of Events
  timeline: {
    'three_days_ago': 'Victoria was seen arguing with Marcus about business decisions',
    'two_days_ago': 'Victoria cancelled all her appointments and stayed in her room',
    'yesterday_evening': 'Victoria was last seen alive at 8 PM by Mr. Thompson',
    'this_morning': 'Victoria\'s body was discovered by the maid at 7 AM'
  },

  // Family History
  familyHistory: {
    founders: 'The Blackwood family built their fortune in shipping and trade in the 1800s',
    currentGeneration: 'Victoria inherited the business from her father, expanding into real estate',
    familyDynamics: 'The family has always been known for keeping secrets and maintaining appearances',
    recentEvents: 'Financial troubles began two years ago when several investments failed'
  },

  // Business Information
  businessInfo: {
    companyName: 'Blackwood Enterprises',
    currentValue: 'Estimated $50 million (down from $100 million two years ago)',
    majorAssets: ['Blackwood Manor', 'Downtown office building', 'Shipping contracts'],
    financialProblems: [
      'Declining shipping revenues',
      'Failed real estate investments',
      'Lawsuit from business partner',
      'Tax audit complications'
    ]
  },

  // Investigation Clues
  investigationClues: {
    physical: [
      'Broken vase in the hallway',
      'Muddy footprints near the back door',
      'Victoria\'s jewelry box left open',
      'Wine glass with lipstick on the rim'
    ],
    digital: [
      'Victoria\'s phone found in her bedroom',
      'Computer logged out but still warm',
      'Security cameras offline for 2 hours last night',
      'Recent emails about urgent business meeting'
    ],
    testimonial: [
      'Neighbor heard shouting around 9 PM',
      'Delivery driver saw unfamiliar car in driveway',
      'Security guard noticed lights on unusually late',
      'Housekeeper found door unlocked this morning'
    ]
  },

  // Red Herrings (False Leads)
  redHerrings: [
    'A rival business competitor had threatened Victoria',
    'Victoria\'s ex-husband was seen in town recently',
    'The family lawyer had been pressuring Victoria about the will',
    'A former employee had been sending angry letters'
  ],

  // Key Questions for Investigation
  keyQuestions: [
    'Where was everyone between 8 PM and midnight?',
    'Who had access to Victoria\'s medication?',
    'What was the nature of the business argument?',
    'Why were the security cameras offline?',
    'Who benefits most from Victoria\'s death?',
    'What secrets was Victoria hiding?'
  ],

  // Story Themes
  themes: {
    primary: 'Family secrets and betrayal',
    secondary: 'Greed and ambition',
    tertiary: 'Love and loss',
    atmosphere: 'Suspicion and mistrust'
  },

  // Character Motivations
  characterMotivations: {
    'james-blackwood': 'Wants to save the family business and maintain his inheritance',
    'marcus-reynolds': 'Seeking to gain control of the company through partnership',
    'elena-rodriguez': 'Protecting family medical secrets and her professional reputation',
    'lily-chen': 'Desperate for family approval and inheritance',
    'thompson-butler': 'Loyal to the family but knows more than he reveals'
  }
};

// Helper function to get location information
export const getLocationInfo = (locationId: string) => {
  return worldConfig.locations[locationId as keyof typeof worldConfig.locations] || null;
};

// Helper function to get timeline events
export const getTimelineEvents = () => {
  return Object.entries(worldConfig.timeline);
};

// Helper function to get investigation clues by category
export const getCluesByCategory = (category: 'physical' | 'digital' | 'testimonial') => {
  return worldConfig.investigationClues[category];
};
