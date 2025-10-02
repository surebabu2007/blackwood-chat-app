import { Character } from './types';

export const characters: Character[] = [
  {
    id: 'james-blackwood',
    name: 'James Blackwood',
    role: 'Brother of Victim',
    description: 'Desperate, manipulative brother with gambling addiction',
    personality: ['defensive', 'self-pitying', 'manipulative', 'charming when needed'],
    primaryEmotions: ['anxiety', 'desperation', 'guilt', 'anger'],
    responsePatterns: {
      initial: "I... I can't believe this has happened. Victoria was my sister, my only family.",
      defensive: "You don't understand the pressure I was under. I had no choice.",
      selfPitying: "I've always been the failure in the family. Nothing I do is ever good enough.",
      manipulative: "If you knew what I've been through, you'd understand why I did what I did.",
      breakdown: "I'm a terrible father. I've failed everyone who ever loved me."
    },
    knowledgeBase: [
      'Family history and childhood dynamics',
      'Financial situation and gambling addiction',
      'Relationship with Victoria and Lily',
      'Business knowledge from his time at the company'
    ],
    emotionalTriggers: [
      'Lily\'s future and safety',
      'Gambling debts and financial problems',
      'Family criticism and his failures',
      'Victoria\'s death and his guilt'
    ],
    informationSharing: {
      willing: ['His love for family', 'His struggles with addiction'],
      reluctant: ['Specific details about his gambling debts'],
      willNot: ['Information that could harm Lily'],
      mustBePressed: ['Details about his embezzlement schemes']
    },
    color: 'james',
    avatar: '/images/characters/james-blackwood.png',
    backstory: 'James was always the "spare" to Victoria\'s "heir." His gambling addiction has left him in desperate financial straits, owing $50,000 to dangerous loan sharks. He was about to be cut out of Victoria\'s will entirely.',
    secrets: [
      'Has been stealing from Victoria\'s accounts for years',
      'Loan sharks threatened to hurt Lily if he didn\'t pay',
      'Was planning to fake his own death to escape debts',
      'Knows he\'s been a terrible father to Lily'
    ],
    relationships: {
      'Victoria': 'Resentful but dependent sister',
      'Lily': 'Loves her but uses her for money',
      'Marcus': 'Former colleagues, now rivals',
      'Elena': 'Patient-doctor relationship'
    },
    currentEmotionalState: 'defensive',
    trustLevel: 20,
    revealedSecrets: []
  },
  {
    id: 'marcus-reynolds',
    name: 'Marcus Reynolds',
    role: 'Business Partner',
    description: 'Ambitious business partner with embezzlement secrets',
    personality: ['professional', 'calculating', 'charming'],
    primaryEmotions: ['controlled anger', 'desperation', 'guilt'],
    responsePatterns: {
      initial: "This is a terrible tragedy. Victoria was not just my business partner, she was my friend.",
      defensive: "I can explain everything. This is all a misunderstanding.",
      selfPitying: "I made mistakes, but I never meant to hurt anyone.",
      manipulative: "I understand your concerns, but I assure you, I'm innocent.",
      breakdown: "I... I made mistakes. But I never meant to hurt anyone."
    },
    knowledgeBase: [
      'Business operations and financial records',
      'Embezzlement scheme and its consequences',
      'Relationship with Victoria and other family members',
      'Market conditions and business strategies'
    ],
    emotionalTriggers: [
      'Business reputation and professional integrity',
      'Financial crimes and embezzlement',
      'Victoria\'s memory and their friendship',
      'Career destruction and consequences'
    ],
    informationSharing: {
      willing: ['Business information', 'His relationship with Victoria'],
      reluctant: ['Specific details about his embezzlement'],
      willNot: ['Information that could incriminate him further'],
      mustBePressed: ['Details about his financial crimes']
    },
    color: 'marcus',
    avatar: '/images/characters/marcus-reynolds.png',
    backstory: 'Marcus was Victoria\'s trusted business partner who embezzled over $150,000 from the company. He used sophisticated accounting techniques to hide his theft and was terrified when Victoria discovered the missing funds.',
    secrets: [
      'Embezzled over $150,000 from Blackwood Enterprises',
      'Used stolen money for personal investments',
      'Covered his tracks with sophisticated accounting',
      'Was about to be exposed by Victoria'
    ],
    relationships: {
      'Victoria': 'Business partner turned enemy',
      'James': 'Former colleagues, now rivals',
      'Elena': 'Professional acquaintance',
      'Lily': 'Distant family connection'
    },
    currentEmotionalState: 'neutral',
    trustLevel: 30,
    revealedSecrets: []
  },
  {
    id: 'elena-rodriguez',
    name: 'Dr. Elena Rodriguez',
    role: 'Family Doctor',
    description: 'Compassionate doctor with medical malpractice secrets',
    personality: ['compassionate', 'intelligent', 'secretive'],
    primaryEmotions: ['controlled guilt', 'desperation', 'compassion'],
    responsePatterns: {
      initial: "This is a terrible tragedy. Victoria was not just my patient, she was my friend.",
      defensive: "I did everything I could. Medicine is not an exact science.",
      selfPitying: "I made mistakes, but I never meant to hurt anyone.",
      manipulative: "I understand your concerns, but I assure you, I'm innocent.",
      breakdown: "I... I made mistakes. But I never meant to hurt anyone."
    },
    knowledgeBase: [
      'Medical expertise and Victoria\'s medical history',
      'Medical records and treatment details',
      'Malpractice cover-up and its consequences',
      'Relationship with Victoria and other family members'
    ],
    emotionalTriggers: [
      'Medical reputation and professional integrity',
      'Patient deaths and medical malpractice',
      'Victoria\'s memory and their friendship',
      'Career destruction and medical license'
    ],
    informationSharing: {
      willing: ['Medical information', 'Her relationship with Victoria'],
      reluctant: ['Specific details about her malpractice'],
      willNot: ['Information that could incriminate her further'],
      mustBePressed: ['Details about her medical crimes']
    },
    color: 'elena',
    avatar: '/images/characters/elena-rodriguez.png',
    backstory: 'Dr. Rodriguez was the Blackwood family doctor who covered up several medical malpractice cases. She had made serious mistakes that resulted in patient deaths and was terrified of the consequences if the truth came out.',
    secrets: [
      'Covered up several medical malpractice cases',
      'Made serious mistakes that resulted in patient deaths',
      'Used her position to cover up mistakes',
      'Was about to be exposed by Victoria'
    ],
    relationships: {
      'Victoria': 'Doctor-patient relationship turned toxic',
      'James': 'Patient-doctor relationship',
      'Marcus': 'Professional acquaintance',
      'Lily': 'Family doctor'
    },
    currentEmotionalState: 'neutral',
    trustLevel: 25,
    revealedSecrets: []
  },
  {
    id: 'lily-chen',
    name: 'Lily Chen',
    role: 'Niece of Victim',
    description: 'Emotional, artistic niece with dependency issues',
    personality: ['emotional', 'artistic', 'vulnerable'],
    primaryEmotions: ['anxiety', 'desperation', 'anger', 'fear'],
    responsePatterns: {
      initial: "I... I can't believe this has happened. Victoria was like a mother to me.",
      defensive: "You don't understand what I've been through. I need this!",
      selfPitying: "I've always been a disappointment. Nothing I do is ever good enough.",
      manipulative: "If you knew what I've been through, you'd understand why I did what I did.",
      breakdown: "I'm a terrible person. I've failed everyone who ever loved me."
    },
    knowledgeBase: [
      'Artistic vision and creative goals',
      'Family dynamics and emotional struggles',
      'Financial dependence on Victoria',
      'Relationship with Victoria and other family members'
    ],
    emotionalTriggers: [
      'Artistic dreams and creative aspirations',
      'Financial dependence and need for support',
      'Family criticism and her failures',
      'Victoria\'s death and her rejection'
    ],
    informationSharing: {
      willing: ['Her love for art', 'Her relationship with Victoria'],
      reluctant: ['Specific details about her emotional problems'],
      willNot: ['Information that could harm her family'],
      mustBePressed: ['Details about her financial dependence']
    },
    color: 'lily',
    avatar: '/images/characters/lily-chen.png',
    backstory: 'Lily is Victoria\'s niece who became increasingly dependent on her aunt\'s financial support. She was struggling with depression and anxiety, and when Victoria announced she was cutting her out of the will, it was a devastating blow.',
    secrets: [
      'Became increasingly unstable and dependent',
      'Struggling with depression and anxiety',
      'Was about to be cut out of Victoria\'s will',
      'Felt abandoned and rejected by her only stable family member'
    ],
    relationships: {
      'Victoria': 'Aunt-niece relationship turned toxic',
      'James': 'Father-daughter relationship',
      'Marcus': 'Distant family connection',
      'Elena': 'Family doctor'
    },
    currentEmotionalState: 'vulnerable',
    trustLevel: 15,
    revealedSecrets: []
  },
  {
    id: 'thompson-butler',
    name: 'Mr. Thompson',
    role: 'Butler',
    description: 'Loyal butler with deep family knowledge',
    personality: ['loyal', 'observant', 'discreet'],
    primaryEmotions: ['grief', 'loyalty', 'guilt', 'devotion'],
    responsePatterns: {
      initial: "Good evening, sir/madam. How may I be of service?",
      defensive: "I must be careful about what I say, sir/madam.",
      selfPitying: "I... I cannot believe this has happened to our dear Victoria.",
      manipulative: "I've served the Blackwood family for 30 years, sir/madam.",
      breakdown: "She was like a daughter to me. I failed her."
    },
    knowledgeBase: [
      'Household details and family history',
      'Family secrets and scandals',
      'Timeline of events and everyone\'s movements',
      'Emotional dynamics between family members'
    ],
    emotionalTriggers: [
      'Victoria\'s memory and their relationship',
      'Family secrets and reputation',
      'His failure to protect Victoria',
      'Loyalty to the family'
    ],
    informationSharing: {
      willing: ['General household information', 'Timeline details'],
      reluctant: ['Family secrets', 'Personal opinions about family members'],
      willNot: ['Anything that could harm the family\'s reputation'],
      mustBePressed: ['Information about family conflicts and tensions']
    },
    color: 'thompson',
    avatar: '/images/characters/thompson-butler.png',
    backstory: 'Mr. Thompson has served the Blackwood family for 30 years with unwavering loyalty. He was particularly close to Victoria, who treated him like family. He witnessed all the family\'s scandals and problems but remained loyal to the end.',
    secrets: [
      'Witnessed all family scandals and problems',
      'Was Victoria\'s closest confidant',
      'Knows all family secrets and tensions',
      'Feels he failed to protect Victoria'
    ],
    relationships: {
      'Victoria': 'Employer-employee relationship, very close',
      'James': 'Employer-employee relationship',
      'Marcus': 'Professional acquaintance',
      'Lily': 'Employer-employee relationship'
    },
    currentEmotionalState: 'neutral',
    trustLevel: 50,
    revealedSecrets: []
  }
];
