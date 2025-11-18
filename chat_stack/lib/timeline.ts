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
    [eventId: string]: {
      canKnow: boolean;
      trustRequired: number;
      canReveal: boolean;
    };
  };
}

class TimelineManagerClass {
  private static timelineEvents: TimelineEvent[] = [
    {
      id: 'wine-delivery',
      time: '8:35 PM',
      location: 'Study',
      participants: ['thompson-butler', 'victoria-blackwood'],
      description: 'Mr. Thompson delivered wine to Victoria in the study',
      characterKnowledge: {
        'thompson-butler': { knowsAbout: true, witnessed: true, canReveal: true, trustRequired: 0 },
        'victoria-blackwood': { knowsAbout: true, witnessed: true, canReveal: false, trustRequired: 0 }
      }
    },
    {
      id: 'marcus-visit',
      time: '8:40-8:50 PM',
      location: 'Study',
      participants: ['marcus-reynolds', 'victoria-blackwood'],
      description: 'Marcus Reynolds visited Victoria, raised voices heard',
      characterKnowledge: {
        'marcus-reynolds': { knowsAbout: true, witnessed: true, canReveal: true, trustRequired: 20 },
        'thompson-butler': { knowsAbout: true, witnessed: false, canReveal: true, trustRequired: 10 }
      }
    },
    {
      id: 'elena-visit',
      time: '8:55-9:00 PM',
      location: 'Study',
      participants: ['elena-rodriguez', 'victoria-blackwood'],
      description: 'Dr. Elena Rodriguez visited Victoria',
      characterKnowledge: {
        'elena-rodriguez': { knowsAbout: true, witnessed: true, canReveal: true, trustRequired: 25 },
        'thompson-butler': { knowsAbout: true, witnessed: false, canReveal: true, trustRequired: 15 }
      }
    },
    {
      id: 'james-visit',
      time: '9:05-9:15 PM',
      location: 'Study',
      participants: ['james-blackwood', 'victoria-blackwood'],
      description: 'James Blackwood visited Victoria',
      characterKnowledge: {
        'james-blackwood': { knowsAbout: true, witnessed: true, canReveal: true, trustRequired: 30 },
        'thompson-butler': { knowsAbout: true, witnessed: false, canReveal: true, trustRequired: 20 }
      }
    },
    {
      id: 'lily-visit',
      time: '9:20-9:25 PM',
      location: 'Study',
      participants: ['lily-chen', 'victoria-blackwood'],
      description: 'Lily Chen visited Victoria',
      characterKnowledge: {
        'lily-chen': { knowsAbout: true, witnessed: true, canReveal: true, trustRequired: 40 },
        'thompson-butler': { knowsAbout: true, witnessed: false, canReveal: true, trustRequired: 25 }
      }
    },
    {
      id: 'victoria-death',
      time: '9:27 PM',
      location: 'Study',
      participants: ['victoria-blackwood'],
      description: 'Victoria Blackwood died (clock stopped)',
      characterKnowledge: {
        'thompson-butler': { knowsAbout: true, witnessed: false, canReveal: true, trustRequired: 0 }
      }
    }
  ];

  static getResponseContext(characterId: string, trustLevel: number): string {
    const relevantEvents = this.timelineEvents.filter(event => {
      const knowledge = event.characterKnowledge[characterId];
      return knowledge && knowledge.knowsAbout && knowledge.trustRequired <= trustLevel;
    });

    if (relevantEvents.length === 0) {
      return '';
    }

    const contextLines = relevantEvents.map(event => {
      return `- ${event.time}: ${event.description}`;
    });

    return `\n\n=== TIMELINE CONTEXT YOU CAN REFERENCE ===\n${contextLines.join('\n')}`;
  }

  static updateProgress(characterId: string, progress: number): void {
    // Progress tracking implementation
    // This can be expanded to track investigation milestones
  }
}

export const TimelineManager = TimelineManagerClass;

