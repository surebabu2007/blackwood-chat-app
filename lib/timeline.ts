/**
 * Timeline and World Context System for Blackwood Manor Investigation
 * Based on script.rpy timeline and character knowledge constraints
 */

export interface TimelineEvent {
  id: string;
  time: string;
  location: string;
  participants: string[];
  description: string;
  evidence?: string[];
  secrets?: string[];
  characterKnowledge: {
    [characterId: string]: {
      knowsAbout: boolean;
      witnessed: boolean;
      canReveal: boolean;
      trustRequired: number;
    };
  };
}

export interface InvestigationPhase {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  requiredProgress: number;
  availableCharacters: string[];
  availableLocations: string[];
  context: {
    currentLocation: string;
    timeOfDay: string;
    investigationStyle: 'methodical' | 'empathetic' | 'aggressive';
    playerAttributes: {
      intelligence: number;
      emotionalBalance: number;
      empathy: number;
      courage: number;
      fear: number;
    };
  };
}

export interface CharacterConstraints {
  characterId: string;
  currentPhase: string;
  knowledgeLimits: {
    maxRevealedSecrets: number;
    maxTrustLevel: number;
    availableInformation: string[];
    forbiddenTopics: string[];
  };
  behavioralConstraints: {
    emotionalState: 'neutral' | 'defensive' | 'aggressive' | 'vulnerable' | 'manipulative';
    responseStyle: 'cooperative' | 'evasive' | 'hostile' | 'manipulative';
    informationSharing: 'open' | 'guarded' | 'secretive' | 'deceptive';
  };
  timelineConstraints: {
    canMentionFutureEvents: boolean;
    canRevealPastSecrets: boolean;
    currentKnowledge: string[];
    forbiddenKnowledge: string[];
  };
}

// Timeline Events based on script.rpy
export const INVESTIGATION_TIMELINE: TimelineEvent[] = [
  {
    id: 'victoria_death',
    time: '9:27 PM',
    location: 'study',
    participants: ['Victoria Blackwood', 'unknown_killer'],
    description: 'Victoria Blackwood found dead in her study',
    evidence: ['stopped_clock', 'wine_glass', 'blood_pattern'],
    secrets: ['will_changes', 'secret_project'],
    characterKnowledge: {
      'james-blackwood': {
        knowsAbout: true,
        witnessed: false,
        canReveal: false,
        trustRequired: 80
      },
      'marcus-reynolds': {
        knowsAbout: true,
        witnessed: false,
        canReveal: false,
        trustRequired: 70
      },
      'elena-rodriguez': {
        knowsAbout: true,
        witnessed: false,
        canReveal: false,
        trustRequired: 75
      },
      'lily-chen': {
        knowsAbout: true,
        witnessed: false,
        canReveal: false,
        trustRequired: 85
      },
      'thompson-butler': {
        knowsAbout: true,
        witnessed: false,
        canReveal: true,
        trustRequired: 30
      }
    }
  },
  {
    id: 'lily_visit',
    time: '9:20 PM - 9:25 PM',
    location: 'study',
    participants: ['Victoria Blackwood', 'Lily Chen'],
    description: 'Lily Chen visits Victoria in the study',
    evidence: ['emotional_distress'],
    secrets: ['disinheritance_plan'],
    characterKnowledge: {
      'lily-chen': {
        knowsAbout: true,
        witnessed: true,
        canReveal: true,
        trustRequired: 40
      },
      'thompson-butler': {
        knowsAbout: true,
        witnessed: false,
        canReveal: true,
        trustRequired: 20
      }
    }
  },
  {
    id: 'james_visit',
    time: '9:05 PM - 9:15 PM',
    location: 'study',
    participants: ['Victoria Blackwood', 'James Blackwood'],
    description: 'James Blackwood visits Victoria in the study',
    evidence: ['emotional_distress'],
    secrets: ['gambling_debts', 'will_changes'],
    characterKnowledge: {
      'james-blackwood': {
        knowsAbout: true,
        witnessed: true,
        canReveal: true,
        trustRequired: 50
      },
      'thompson-butler': {
        knowsAbout: true,
        witnessed: false,
        canReveal: true,
        trustRequired: 20
      }
    }
  },
  {
    id: 'elena_visit',
    time: '8:55 PM - 9:00 PM',
    location: 'study',
    participants: ['Victoria Blackwood', 'Dr. Elena Rodriguez'],
    description: 'Dr. Elena Rodriguez visits Victoria in the study',
    evidence: ['medical_bag'],
    secrets: ['medical_malpractice', 'medication_interactions'],
    characterKnowledge: {
      'elena-rodriguez': {
        knowsAbout: true,
        witnessed: true,
        canReveal: false,
        trustRequired: 90
      },
      'thompson-butler': {
        knowsAbout: true,
        witnessed: false,
        canReveal: true,
        trustRequired: 20
      }
    }
  },
  {
    id: 'marcus_visit',
    time: '8:40 PM - 8:50 PM',
    location: 'study',
    participants: ['Victoria Blackwood', 'Marcus Reynolds'],
    description: 'Marcus Reynolds visits Victoria in the study',
    evidence: ['financial_documents', 'raised_voices'],
    secrets: ['embezzlement', 'financial_irregularities'],
    characterKnowledge: {
      'marcus-reynolds': {
        knowsAbout: true,
        witnessed: true,
        canReveal: false,
        trustRequired: 85
      },
      'thompson-butler': {
        knowsAbout: true,
        witnessed: false,
        canReveal: true,
        trustRequired: 20
      }
    }
  },
  {
    id: 'wine_delivery',
    time: '8:35 PM',
    location: 'study',
    participants: ['Victoria Blackwood', 'Mr. Thompson'],
    description: 'Mr. Thompson delivers wine to Victoria',
    evidence: ['wine_glass', 'wine_source'],
    secrets: [],
    characterKnowledge: {
      'thompson-butler': {
        knowsAbout: true,
        witnessed: true,
        canReveal: true,
        trustRequired: 10
      }
    }
  },
  {
    id: 'victoria_work',
    time: '8:30 PM',
    location: 'study',
    participants: ['Victoria Blackwood'],
    description: 'Victoria working on papers in the study',
    evidence: ['financial_documents', 'will_changes'],
    secrets: ['secret_project', 'planned_exposures'],
    characterKnowledge: {
      'thompson-butler': {
        knowsAbout: true,
        witnessed: true,
        canReveal: true,
        trustRequired: 10
      }
    }
  }
];

// Investigation Phases based on script.rpy progression
export const INVESTIGATION_PHASES: InvestigationPhase[] = [
  {
    id: 'initial_arrival',
    name: 'Initial Arrival',
    description: 'Detective arrives at Blackwood Manor',
    startTime: '9:30 PM',
    endTime: '10:00 PM',
    requiredProgress: 0,
    availableCharacters: ['thompson-butler', 'james-blackwood', 'marcus-reynolds', 'elena-rodriguez', 'lily-chen'],
    availableLocations: ['mansion_entrance', 'study', 'dining_room', 'library', 'kitchen', 'garden', 'basement', 'bedroom', 'hallway', 'conservatory'],
    context: {
      currentLocation: 'mansion_entrance',
      timeOfDay: 'evening',
      investigationStyle: 'methodical',
      playerAttributes: {
        intelligence: 0,
        emotionalBalance: 50,
        empathy: 50,
        courage: 50,
        fear: 0
      }
    }
  },
  {
    id: 'crime_scene_investigation',
    name: 'Crime Scene Investigation',
    description: 'Examining the study where Victoria was found',
    startTime: '10:00 PM',
    endTime: '11:00 PM',
    requiredProgress: 10,
    availableCharacters: ['thompson-butler', 'james-blackwood', 'marcus-reynolds', 'elena-rodriguez', 'lily-chen'],
    availableLocations: ['study', 'mansion_entrance', 'dining_room', 'library', 'kitchen', 'garden', 'basement', 'bedroom', 'hallway', 'conservatory'],
    context: {
      currentLocation: 'study',
      timeOfDay: 'evening',
      investigationStyle: 'methodical',
      playerAttributes: {
        intelligence: 10,
        emotionalBalance: 50,
        empathy: 50,
        courage: 60,
        fear: 5
      }
    }
  },
  {
    id: 'initial_interviews',
    name: 'Initial Interviews',
    description: 'Interviewing key witnesses and suspects',
    startTime: '11:00 PM',
    endTime: '12:00 AM',
    requiredProgress: 25,
    availableCharacters: ['thompson-butler', 'james-blackwood', 'marcus-reynolds', 'elena-rodriguez', 'lily-chen'],
    availableLocations: ['study', 'dining_room', 'library', 'kitchen', 'garden', 'basement', 'bedroom', 'hallway', 'conservatory'],
    context: {
      currentLocation: 'dining_room',
      timeOfDay: 'night',
      investigationStyle: 'methodical',
      playerAttributes: {
        intelligence: 25,
        emotionalBalance: 55,
        empathy: 60,
        courage: 65,
        fear: 10
      }
    }
  },
  {
    id: 'deep_investigation',
    name: 'Deep Investigation',
    description: 'Gathering evidence and re-interviewing suspects',
    startTime: '12:00 AM',
    endTime: '2:00 AM',
    requiredProgress: 50,
    availableCharacters: ['thompson-butler', 'james-blackwood', 'marcus-reynolds', 'elena-rodriguez', 'lily-chen'],
    availableLocations: ['study', 'dining_room', 'library', 'kitchen', 'garden', 'basement', 'bedroom', 'hallway', 'conservatory'],
    context: {
      currentLocation: 'library',
      timeOfDay: 'night',
      investigationStyle: 'methodical',
      playerAttributes: {
        intelligence: 50,
        emotionalBalance: 60,
        empathy: 70,
        courage: 70,
        fear: 15
      }
    }
  },
  {
    id: 'final_confrontation',
    name: 'Final Confrontation',
    description: 'Final interviews and accusation phase',
    startTime: '2:00 AM',
    endTime: '4:00 AM',
    requiredProgress: 75,
    availableCharacters: ['thompson-butler', 'james-blackwood', 'marcus-reynolds', 'elena-rodriguez', 'lily-chen'],
    availableLocations: ['study', 'dining_room', 'library', 'kitchen', 'garden', 'basement', 'bedroom', 'hallway', 'conservatory'],
    context: {
      currentLocation: 'conservatory',
      timeOfDay: 'night',
      investigationStyle: 'methodical',
      playerAttributes: {
        intelligence: 75,
        emotionalBalance: 65,
        empathy: 80,
        courage: 80,
        fear: 20
      }
    }
  }
];

// Character Constraints based on timeline and investigation progress
export const CHARACTER_CONSTRAINTS: Record<string, CharacterConstraints> = {
  'thompson-butler': {
    characterId: 'thompson-butler',
    currentPhase: 'initial_arrival',
    knowledgeLimits: {
      maxRevealedSecrets: 5,
      maxTrustLevel: 100,
      availableInformation: [
        'wine_delivery_timing',
        'victoria_work_schedule',
        'visitor_timeline',
        'household_routine',
        'victoria_personality',
        'family_dynamics',
        'household_staff',
        'mansion_history'
      ],
      forbiddenTopics: []
    },
    behavioralConstraints: {
      emotionalState: 'neutral',
      responseStyle: 'cooperative',
      informationSharing: 'open'
    },
    timelineConstraints: {
      canMentionFutureEvents: false,
      canRevealPastSecrets: true,
      currentKnowledge: [
        'victoria_death',
        'wine_delivery',
        'victoria_work',
        'marcus_visit',
        'elena_visit',
        'james_visit',
        'lily_visit'
      ],
      forbiddenKnowledge: []
    }
  },
  'james-blackwood': {
    characterId: 'james-blackwood',
    currentPhase: 'initial_arrival',
    knowledgeLimits: {
      maxRevealedSecrets: 3,
      maxTrustLevel: 80,
      availableInformation: [
        'family_history',
        'gambling_problems',
        'financial_situation',
        'relationship_with_victoria',
        'childhood_memories',
        'family_business',
        'sister_relationship'
      ],
      forbiddenTopics: ['embezzlement_details', 'murder_weapon', 'other_suspects_secrets']
    },
    behavioralConstraints: {
      emotionalState: 'defensive',
      responseStyle: 'evasive',
      informationSharing: 'guarded'
    },
    timelineConstraints: {
      canMentionFutureEvents: false,
      canRevealPastSecrets: false,
      currentKnowledge: [
        'victoria_death',
        'james_visit',
        'family_history',
        'childhood_memories'
      ],
      forbiddenKnowledge: [
        'marcus_visit_details',
        'elena_visit_details',
        'lily_visit_details'
      ]
    }
  },
  'marcus-reynolds': {
    characterId: 'marcus-reynolds',
    currentPhase: 'initial_arrival',
    knowledgeLimits: {
      maxRevealedSecrets: 2,
      maxTrustLevel: 70,
      availableInformation: [
        'business_relationship',
        'financial_documents',
        'victoria_personality',
        'business_operations',
        'partnership_history',
        'financial_strategy'
      ],
      forbiddenTopics: ['embezzlement', 'financial_irregularities', 'murder_weapon', 'other_suspects_secrets']
    },
    behavioralConstraints: {
      emotionalState: 'defensive',
      responseStyle: 'evasive',
      informationSharing: 'secretive'
    },
    timelineConstraints: {
      canMentionFutureEvents: false,
      canRevealPastSecrets: false,
      currentKnowledge: [
        'victoria_death',
        'marcus_visit',
        'business_relationship',
        'partnership_history'
      ],
      forbiddenKnowledge: [
        'james_visit_details',
        'elena_visit_details',
        'lily_visit_details'
      ]
    }
  },
  'elena-rodriguez': {
    characterId: 'elena-rodriguez',
    currentPhase: 'initial_arrival',
    knowledgeLimits: {
      maxRevealedSecrets: 2,
      maxTrustLevel: 75,
      availableInformation: [
        'medical_relationship',
        'victoria_health',
        'medication_history',
        'medical_practice',
        'patient_care',
        'health_concerns'
      ],
      forbiddenTopics: ['medical_malpractice', 'medication_interactions', 'murder_weapon', 'other_suspects_secrets']
    },
    behavioralConstraints: {
      emotionalState: 'neutral',
      responseStyle: 'cooperative',
      informationSharing: 'guarded'
    },
    timelineConstraints: {
      canMentionFutureEvents: false,
      canRevealPastSecrets: false,
      currentKnowledge: [
        'victoria_death',
        'elena_visit',
        'medical_relationship',
        'health_concerns'
      ],
      forbiddenKnowledge: [
        'james_visit_details',
        'marcus_visit_details',
        'lily_visit_details'
      ]
    }
  },
  'lily-chen': {
    characterId: 'lily-chen',
    currentPhase: 'initial_arrival',
    knowledgeLimits: {
      maxRevealedSecrets: 4,
      maxTrustLevel: 85,
      availableInformation: [
        'family_relationship',
        'victoria_personality',
        'emotional_state',
        'disinheritance_plan',
        'artistic_pursuits',
        'family_memories',
        'aunt_relationship'
      ],
      forbiddenTopics: ['murder_weapon', 'financial_details', 'other_suspects_secrets']
    },
    behavioralConstraints: {
      emotionalState: 'vulnerable',
      responseStyle: 'cooperative',
      informationSharing: 'open'
    },
    timelineConstraints: {
      canMentionFutureEvents: false,
      canRevealPastSecrets: true,
      currentKnowledge: [
        'victoria_death',
        'lily_visit',
        'family_relationship',
        'artistic_pursuits',
        'family_memories'
      ],
      forbiddenKnowledge: [
        'james_visit_details',
        'marcus_visit_details',
        'elena_visit_details'
      ]
    }
  }
};

/**
 * Timeline and Context Management Functions
 */

export class TimelineManager {
  private static currentPhase: string = 'initial_arrival';
  private static investigationProgress: number = 0;
  private static currentLocation: string = 'mansion_entrance';
  private static timeOfDay: string = 'evening';

  /**
   * Get current investigation phase
   */
  static getCurrentPhase(): InvestigationPhase {
    return INVESTIGATION_PHASES.find(phase => phase.id === this.currentPhase) || INVESTIGATION_PHASES[0];
  }

  /**
   * Update investigation progress and phase
   */
  static updateProgress(progress: number): void {
    this.investigationProgress = progress;
    
    // Find appropriate phase based on progress
    const newPhase = INVESTIGATION_PHASES.find(phase => 
      progress >= phase.requiredProgress && 
      progress < (INVESTIGATION_PHASES.find(p => p.requiredProgress > phase.requiredProgress)?.requiredProgress || 100)
    );
    
    if (newPhase && newPhase.id !== this.currentPhase) {
      this.currentPhase = newPhase.id;
    }
  }

  /**
   * Update current location and time
   */
  static updateLocation(location: string, timeOfDay?: string): void {
    this.currentLocation = location;
    if (timeOfDay) {
      this.timeOfDay = timeOfDay;
    }
  }

  /**
   * Get character constraints for current phase
   */
  static getCharacterConstraints(characterId: string): CharacterConstraints | null {
    const constraints = CHARACTER_CONSTRAINTS[characterId];
    if (!constraints) return null;

    // Update phase based on current investigation progress
    const currentPhase = this.getCurrentPhase();
    constraints.currentPhase = currentPhase.id;

    return constraints;
  }

  /**
   * Check if character can reveal specific information
   */
  static canCharacterReveal(characterId: string, information: string, trustLevel: number): boolean {
    const constraints = this.getCharacterConstraints(characterId);
    if (!constraints) return false;

    // Check if information is in forbidden topics
    if (constraints.knowledgeLimits.forbiddenTopics.includes(information)) {
      return false;
    }

    // Check if character knows about this information
    const timelineEvent = INVESTIGATION_TIMELINE.find(event => 
      event.evidence?.includes(information) || event.secrets?.includes(information)
    );

    if (timelineEvent) {
      const characterKnowledge = timelineEvent.characterKnowledge[characterId];
      if (!characterKnowledge) return false;

      return characterKnowledge.canReveal && trustLevel >= characterKnowledge.trustRequired;
    }

    return true;
  }

  /**
   * Get available characters for current phase
   */
  static getAvailableCharacters(): string[] {
    const currentPhase = this.getCurrentPhase();
    return currentPhase.availableCharacters;
  }

  /**
   * Get timeline events character can discuss
   */
  static getCharacterTimelineEvents(characterId: string): TimelineEvent[] {
    return INVESTIGATION_TIMELINE.filter(event => 
      event.characterKnowledge[characterId]?.knowsAbout
    );
  }

  /**
   * Validate character response against timeline constraints
   */
  static validateCharacterResponse(characterId: string, response: string, trustLevel: number): {
    isValid: boolean;
    violations: string[];
    suggestions: string[];
  } {
    const constraints = this.getCharacterConstraints(characterId);
    if (!constraints) {
      return { isValid: false, violations: ['Character not found'], suggestions: [] };
    }

    const violations: string[] = [];
    const suggestions: string[] = [];

    // Check for forbidden topics
    constraints.knowledgeLimits.forbiddenTopics.forEach(topic => {
      if (response.toLowerCase().includes(topic.toLowerCase())) {
        violations.push(`Mentioned forbidden topic: ${topic}`);
        suggestions.push(`Avoid discussing ${topic} at this investigation stage`);
      }
    });

    // Check for forbidden knowledge
    constraints.timelineConstraints.forbiddenKnowledge.forEach(knowledge => {
      if (response.toLowerCase().includes(knowledge.toLowerCase())) {
        violations.push(`Mentioned forbidden knowledge: ${knowledge}`);
        suggestions.push(`Character should not know about ${knowledge} yet`);
      }
    });

    // Check trust level requirements
    if (trustLevel < constraints.knowledgeLimits.maxTrustLevel) {
      const sensitiveTopics = ['secrets', 'confidential', 'private', 'hidden'];
      sensitiveTopics.forEach(topic => {
        if (response.toLowerCase().includes(topic)) {
          violations.push(`Insufficient trust level for sensitive information`);
          suggestions.push(`Increase trust level to ${constraints.knowledgeLimits.maxTrustLevel} before discussing sensitive topics`);
        }
      });
    }

    return {
      isValid: violations.length === 0,
      violations,
      suggestions
    };
  }

  /**
   * Get context for character response generation
   */
  static getResponseContext(characterId: string, trustLevel: number): string {
    const constraints = this.getCharacterConstraints(characterId);
    const currentPhase = this.getCurrentPhase();
    
    if (!constraints) return '';

    let context = `\nTIMELINE CONTEXT (1947 - Post-WWII America):\n`;
    context += `Current Phase: ${currentPhase.name}\n`;
    context += `Current Location: ${this.currentLocation}\n`;
    context += `Time of Day: ${this.timeOfDay}\n`;
    context += `Investigation Progress: ${this.investigationProgress}%\n`;
    context += `Year: 1947 - Just 2 years after WWII ended\n`;
    context += `Setting: Gothic mansion in New England\n\n`;

    context += `1947 HISTORICAL CONTEXT:\n`;
    context += `- Post-WWII America: Veterans returning, economic boom beginning\n`;
    context += `- Technology: Rotary phones, telegrams, radio, classic cars, gas/electric lights\n`;
    context += `- Society: Formal etiquette, traditional gender roles, class hierarchy\n`;
    context += `- Language: Formal speech, period slang ("swell", "keen", "gee whiz")\n`;
    context += `- Forensics: Fingerprints, ballistics, blood type, autopsy (NO DNA, computers, CCTV)\n\n`;

    context += `CHARACTER CONSTRAINTS:\n`;
    context += `Emotional State: ${constraints.behavioralConstraints.emotionalState}\n`;
    context += `Response Style: ${constraints.behavioralConstraints.responseStyle}\n`;
    context += `Information Sharing: ${constraints.behavioralConstraints.informationSharing}\n`;
    context += `Trust Level: ${trustLevel}/${constraints.knowledgeLimits.maxTrustLevel}\n\n`;

    context += `AVAILABLE INFORMATION:\n`;
    constraints.knowledgeLimits.availableInformation.forEach(info => {
      context += `- ${info}\n`;
    });

    context += `\nFORBIDDEN TOPICS:\n`;
    constraints.knowledgeLimits.forbiddenTopics.forEach(topic => {
      context += `- ${topic}\n`;
    });

    context += `\nTIMELINE EVENTS YOU CAN DISCUSS:\n`;
    const availableEvents = this.getCharacterTimelineEvents(characterId);
    availableEvents.forEach(event => {
      const characterKnowledge = event.characterKnowledge[characterId];
      if (characterKnowledge && characterKnowledge.canReveal && trustLevel >= characterKnowledge.trustRequired) {
        context += `- ${event.description} (${event.time})\n`;
      }
    });

    context += `\n1947 RESPONSE GUIDELINES:\n`;
    context += `- Use formal, period-appropriate language\n`;
    context += `- Reference 1940s technology and society\n`;
    context += `- Show respect for Detective Sarah Chen (female detective was unusual in 1947)\n`;
    context += `- Use period-appropriate expressions and mannerisms\n`;
    context += `- Reference post-war context when relevant\n`;
    context += `- Maintain character's social class and background\n`;

    return context;
  }
}
