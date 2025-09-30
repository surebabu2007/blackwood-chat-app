export interface VictimData {
  name: string;
  age: number;
  occupation: string;
  description: string;
  backstory: string;
  secrets: string[];
  relationships: Record<string, string>;
  businessInfo: {
    companyName: string;
    financialIrregularities: string[];
    willChanges: string[];
    plannedExposures: string[];
  };
  personalInfo: {
    healthIssues: string[];
    romanticLife: string[];
    artCollection: string[];
    familyHistory: string[];
  };
  timeline: {
    lastDay: {
      morning: string[];
      afternoon: string[];
      evening: string[];
    };
    lastWeek: string[];
    lastMonth: string[];
  };
  evidence: {
    diaryEntries: string[];
    phoneRecords: string[];
    financialDocuments: string[];
    medicalRecords: string[];
  };
}

export const victoriaBlackwood: VictimData = {
  name: 'Victoria Elizabeth Blackwood',
  age: 47,
  occupation: 'Art Collector, Business Owner, Socialite',
  description: 'Intelligent, controlling, secretive businesswoman who was murdered in her own mansion',
  backstory: 'Victoria was a successful businesswoman and art collector who discovered that everyone around her was betraying her trust. She was planning to expose their secrets and change her will to cut them all out before being murdered.',
  secrets: [
    'Discovered financial irregularities in her company',
    'Planned to expose everyone\'s secrets',
    'Was about to change her will to cut out family members',
    'Had a terminal illness affecting her judgment',
    'Hired a private investigator to gather evidence',
    'Was planning to donate most of her wealth to charity'
  ],
  relationships: {
    'James Blackwood': 'Sister-brother relationship, resentful but dependent',
    'Marcus Reynolds': 'Business partner relationship turned toxic',
    'Dr. Elena Rodriguez': 'Doctor-patient relationship turned toxic',
    'Lily Chen': 'Aunt-niece relationship turned toxic',
    'Mr. Thompson': 'Employer-employee relationship, very close'
  },
  businessInfo: {
    companyName: 'Blackwood Enterprises',
    financialIrregularities: [
      'Marcus Reynolds embezzled over $150,000',
      'James Blackwood stole from company accounts',
      'Missing funds in several departments',
      'Suspicious transactions in art collection'
    ],
    willChanges: [
      'Cut James out entirely due to gambling debts',
      'Remove Marcus from inheritance',
      'Reduce Lily\'s inheritance',
      'Donate majority to charity',
      'Leave small amount to Mr. Thompson'
    ],
    plannedExposures: [
      'Marcus\'s embezzlement scheme',
      'Elena\'s medical malpractice cover-up',
      'James\'s gambling addiction and theft',
      'Lily\'s financial dependence and instability'
    ]
  },
  personalInfo: {
    healthIssues: [
      'Terminal illness diagnosis',
      'High blood pressure from stress',
      'Insomnia due to paranoia',
      'Weight loss from stress'
    ],
    romanticLife: [
      'Never married, focused on career',
      'Had secret relationship with younger man',
      'Several failed relationships due to controlling nature'
    ],
    artCollection: [
      'One of the most impressive private collections in New England',
      'Some pieces were stolen or forged',
      'Valuable pieces worth millions',
      'Passion project throughout her life'
    ],
    familyHistory: [
      'Father died when she was 25, left her in charge',
      'Mother died when she was 12',
      'Took care of James after mother\'s death',
      'Father had illegal business practices she discovered'
    ]
  },
  timeline: {
    lastDay: {
      morning: [
        'Met with lawyer to discuss will changes',
        'Reviewed financial documents',
        'Made phone calls to family members',
        'Planned the evening\'s "family dinner"'
      ],
      afternoon: [
        'Met with private investigator',
        'Reviewed evidence against family members',
        'Made final decisions about will changes',
        'Prepared for confrontation with family'
      ],
      evening: [
        'Hosted "family dinner" with all suspects',
        'Confronted each family member about their secrets',
        'Made final decision to change her will',
        'Was murdered in her study at 9:27 PM'
      ]
    },
    lastWeek: [
      'Discovered Marcus\'s embezzlement',
      'Found evidence of Elena\'s malpractice',
      'Learned about James\'s latest gambling debts',
      'Decided to cut Lily out of will',
      'Hired private investigator'
    ],
    lastMonth: [
      'Became increasingly paranoid',
      'Started keeping detailed records of everyone\'s activities',
      'Began planning to change her will',
      'Started experiencing health problems',
      'Became more controlling and demanding'
    ]
  },
  evidence: {
    diaryEntries: [
      'I can\'t keep quiet anymore. The truth must come out, even if it destroys everything.',
      'I\'m afraid. But I have to do what\'s right.',
      'They were all betraying me. I trusted them and they used me.',
      'I built this company from nothing. I know what I\'m talking about.',
      'I was trying to protect everyone. I never meant to hurt anyone.'
    ],
    phoneRecords: [
      'Called lawyer at 8:20 PM (last call)',
      'Called private investigator at 7:45 PM',
      'Multiple calls to family members throughout the day',
      'Called medical ethics foundation about donation'
    ],
    financialDocuments: [
      'New will cutting out family members',
      'Evidence of embezzlement by Marcus',
      'Records of James\'s gambling debts',
      'Planned charity donations'
    ],
    medicalRecords: [
      'Terminal illness diagnosis',
      'Stress-related symptoms and paranoia',
      'Suspicious medication interactions',
      'Recent appointment with Dr. Rodriguez'
    ]
  }
};
