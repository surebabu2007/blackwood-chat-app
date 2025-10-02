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
  occupation: 'Art Collector, Business Owner of Blackwood Enterprises, Socialite',
  description: 'Intelligent, controlling, secretive businesswoman who was murdered October 1947 in her Gothic mansion study at precisely 9:27 PM',
  backstory: 'Born March 15, 1900 in Boston. Took over father\'s business at age 25 when he died. Built Blackwood Enterprises into a $5 million empire. Never married, focused entirely on business and art collection. Discovered that everyone around her was betraying her trust. She was planning to confront each family member on the night of her murder and expose their secrets, then change her will to cut them all out. She was murdered before she could complete her plan.',
  secrets: [
    'Discovered Marcus embezzled exactly $150,000 over 3 years using sophisticated accounting',
    'Found evidence of Elena\'s medical malpractice resulting in patient deaths',
    'Knew James owed $50,000 to loan sharks who threatened to hurt Lily',
    'Planned to cut EVERYONE out of will and donate $5 million to charity',
    'Had prepared individual folders with evidence of each person\'s betrayal',
    'Hired private investigator who gave her final report that afternoon',
    'Was going to announce will changes after confronting everyone',
    'Kept detailed diary documenting everyone\'s crimes for past 6 months',
    'Had terminal illness but kept it secret from family',
    'Planned to report Marcus to police for embezzlement the next morning'
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
        '7:00 AM: Woke early, couldn\'t sleep due to stress',
        '8:30 AM: Met with lawyer via telephone about will changes',
        '10:00 AM: Reviewed financial documents showing Marcus\'s embezzlement',
        '11:30 AM: Made phone call to private investigator with instructions'
      ],
      afternoon: [
        '2:00 PM: Met with private investigator in person (secret meeting)',
        '3:30 PM: Reviewed complete evidence against all family members',
        '4:00 PM: Made final decisions about will changes and exposures',
        '5:00 PM: Prepared folders with evidence for each family member',
        '6:00 PM: Dressed for evening, mentally prepared for confrontations'
      ],
      evening: [
        '7:00 PM: "Family dinner" with all suspects in dining room',
        '7:45 PM: Called private investigator from study (confirmed by phone records)',
        '8:20 PM: Called lawyer - last outgoing call',
        '8:30 PM: Entered study alone with folders containing evidence',
        '8:35 PM: Mr. Thompson brought 1942 Bordeaux wine',
        '8:40-8:50 PM: Confronted Marcus Reynolds about $150,000 embezzlement',
        '8:55-9:00 PM: Met with Dr. Elena Rodriguez (medical bag noted)',
        '9:05-9:15 PM: Confronted James Blackwood about gambling debts and will',
        '9:20-9:25 PM: Final meeting with Lily Chen about disinheritance',
        '9:27 PM: MURDERED - clock stopped at this exact moment',
        '9:30 PM: Body discovered by Mr. Thompson'
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
