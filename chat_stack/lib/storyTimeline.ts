// Story Timeline and Case Details from script.rpy
// This defines the exact timeline, locations, and investigation logic

export const storyTimeline = {
  // Exact timeline from script.rpy witness testimonies
  timeline: {
    '8:30 PM': {
      event: 'Victoria entered study with folders',
      witness: 'Night maid',
      significance: 'Last time she was seen entering with documents'
    },
    '8:35 PM': {
      event: 'Butler brought wine to Victoria',
      witness: 'Night maid',
      details: '1942 Bordeaux from the cellar',
      significance: 'Potential poisoning opportunity'
    },
    '8:40 PM': {
      event: 'Marcus Reynolds entered study',
      witness: 'Night guard',
      demeanor: 'Looking tense',
      significance: 'Business confrontation about embezzlement'
    },
    '8:45 PM': {
      event: 'Raised voices heard from study',
      witness: 'Maid cleaning nearby',
      details: 'Marcus gesturing animatedly',
      significance: 'Heated argument witnessed'
    },
    '8:50 PM': {
      event: 'Marcus left study',
      witness: 'Night guard',
      demeanor: 'Agitated, clutching papers',
      significance: 'Left after confrontation'
    },
    '8:55 PM': {
      event: 'Dr. Elena Rodriguez entered',
      witness: 'Night maid',
      details: 'Carrying medical bag',
      significance: 'Medical visit or opportunity'
    },
    '9:00 PM': {
      event: 'Elena left study',
      witness: 'Maid',
      demeanor: 'Calm but thoughtful',
      significance: 'Left before murder time'
    },
    '9:05 PM': {
      event: 'James Blackwood entered study',
      witness: 'Night guard',
      demeanor: 'Face showing distress',
      significance: 'Family confrontation about will'
    },
    '9:15 PM': {
      event: 'James left study',
      witness: 'Maid',
      demeanor: 'Upset, wiping eyes',
      significance: 'Last to leave before Lily'
    },
    '9:20 PM': {
      event: 'Lily Chen entered study',
      witness: 'Night guard',
      demeanor: 'Quick, nervous movements',
      significance: 'Final visitor before murder'
    },
    '9:25 PM': {
      event: 'Lily left study',
      witness: 'Multiple staff',
      demeanor: 'Almost running',
      significance: 'Left just before murder'
    },
    '9:27 PM': {
      event: 'Clock stopped - Time of murder',
      witness: 'Physical evidence',
      significance: 'Precise moment of death'
    },
    '9:30 PM': {
      event: 'Butler discovered body',
      witness: 'Mr. Thompson',
      significance: 'Crime scene discovered'
    }
  },

  // Murder weapon possibilities from script.rpy
  possibleMurderWeapons: [
    {
      type: 'poisoned wine',
      location: 'Study wine glass',
      evidence: 'Wine glass with suspicious residue, poisoned bottle in cellar',
      method: 'Poison added to 1942 Bordeaux'
    },
    {
      type: 'strangulation',
      location: 'Study',
      evidence: 'Rope fibers matching curtain rope, ligature marks',
      method: 'Strangled with curtain rope'
    },
    {
      type: 'blunt force trauma',
      location: 'Study',
      evidence: 'Blood pattern on carpet, defensive wounds',
      method: 'Struck from behind'
    },
    {
      type: 'stabbing',
      location: 'Study',
      evidence: 'Letter opener with blood stains in basement',
      method: 'Stabbed with letter opener'
    },
    {
      type: 'overdose',
      location: 'Study',
      evidence: 'Medication bottles, medical records',
      method: 'Lethal drug combination'
    }
  ],

  // Crime scene details from script.rpy
  crimeScene: {
    location: 'Victoria\'s Study',
    description: 'Mahogany furniture, floor-to-ceiling bookshelves, eerily quiet',
    atmosphere: 'Scent of old books and something metallic',
    evidence: {
      desk: 'Financial documents about will changes',
      wineGlass: 'Half-empty with lipstick marks and suspicious residue',
      fireplace: 'Partially burned papers about "secret project" and "medical records"',
      window: 'Signs of tampering, muddy footprints',
      bookshelf: 'Hidden diary with personal thoughts and fears',
      carpet: 'Blood stains suggesting struggle from behind',
      chair: 'Scratch marks indicating Victoria fought back',
      clock: 'Stopped at 9:27 PM - precise time of death'
    }
  },

  // Character alibis and window of opportunity
  suspectOpportunities: {
    'Marcus Reynolds': {
      aloneTime: '8:40 PM - 8:50 PM (10 minutes)',
      behavior: 'Left agitated with papers',
      motive: 'Embezzlement exposure ($150,000 stolen)',
      evidence: 'Financial irregularities, defensive behavior'
    },
    'Dr. Elena Rodriguez': {
      aloneTime: '8:55 PM - 9:00 PM (5 minutes)',
      behavior: 'Left calm but thoughtful',
      motive: 'Medical malpractice exposure',
      evidence: 'Access to poisons, medical knowledge'
    },
    'James Blackwood': {
      aloneTime: '9:05 PM - 9:15 PM (10 minutes)',
      behavior: 'Left upset, wiping eyes',
      motive: 'Being cut from will, gambling debts ($50,000)',
      evidence: 'Financial desperation, emotional state'
    },
    'Lily Chen': {
      aloneTime: '9:20 PM - 9:25 PM (5 minutes)',
      behavior: 'Left almost running',
      motive: 'Disinheritance, emotional rejection',
      evidence: 'Emotional instability, timing'
    }
  },

  // Investigation approach from script.rpy
  investigationStyles: {
    methodical: {
      focus: 'Timeline, evidence, facts',
      strength: 'Attention to detail, logical connections',
      characters: 'Works well with analytical suspects'
    },
    empathetic: {
      focus: 'Emotions, relationships, psychology',
      strength: 'Building trust, understanding motives',
      characters: 'Works well with emotional suspects'
    },
    interactive: {
      focus: 'Direct questioning, conversation',
      strength: 'Real-time information gathering',
      characters: 'Works well with all suspects'
    }
  },

  // Victoria's planned actions that night (from script.rpy)
  victimIntentions: {
    purpose: 'Confront each family member about betrayals',
    evidence: 'Detailed records of wrongdoing',
    announcement: 'Changing will to cut everyone out',
    beneficiary: 'Everything going to charity',
    exposure: 'Planning to reveal financial irregularities'
  },

  // Key locations from script.rpy
  locations: {
    study: 'Crime scene, Victoria\'s private office',
    library: 'Witness testimony gathering, analysis',
    diningRoom: 'Butler interview location',
    kitchen: 'Staff information, wine source',
    garden: 'Escape route, footprints evidence',
    basement: 'Murder weapon location, wine cellar',
    bedroom: 'Victoria\'s personal effects',
    conservatory: 'Suspect reinterviews',
    hallway: 'Transition between locations'
  },

  // 1947-specific details
  historicalContext: {
    year: 1947,
    setting: 'New England Gothic mansion',
    postWar: 'WWII ended 1945, 2 years ago',
    technology: {
      available: ['Rotary phones', 'Telegrams', 'Radio', '1940s cars', 'Gas/electric lights'],
      notAvailable: ['Computers', 'Internet', 'Cell phones', 'Modern forensics', 'DNA testing']
    },
    forensics: {
      available: ['Fingerprints', 'Ballistics', 'Blood type', 'Autopsy', 'Physical evidence'],
      notAvailable: ['DNA', 'Computer databases', 'CCTV', 'Digital records']
    },
    society: {
      class: 'Strict hierarchy between family and servants',
      gender: 'Female detective unusual and noteworthy',
      money: 'Average income $2,850/year, Victoria worth $5 million'
    }
  }
};

// Helper functions to get story-accurate information
export function getEventAtTime(time: string): any {
  return (storyTimeline.timeline as any)[time];
}

export function getCharacterOpportunity(characterId: string): any {
  const name = characterId.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
  
  // Map character IDs to full names
  const nameMap: Record<string, string> = {
    'marcus-reynolds': 'Marcus Reynolds',
    'elena-rodriguez': 'Dr. Elena Rodriguez',
    'james-blackwood': 'James Blackwood',
    'lily-chen': 'Lily Chen'
  };
  
  return (storyTimeline.suspectOpportunities as any)[nameMap[characterId]];
}

export function getTimelineForCharacter(characterId: string): string {
  const opportunity = getCharacterOpportunity(characterId);
  if (!opportunity) return '';
  
  return `You were with Victoria ${opportunity.aloneTime}. You left ${opportunity.behavior.toLowerCase()}.`;
}

export function getAllTimeline(): string {
  return Object.entries(storyTimeline.timeline)
    .map(([time, event]) => `${time}: ${event.event}`)
    .join('\n');
}


